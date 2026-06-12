const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Designer = require("../models/Designer");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
const Order = require("../models/Order");
const Payout = require("../models/Payout");
const Review = require("../models/Review");

/* ═══════════════════════════════════════════════════════════════════════
   PLATFORM OVERVIEW / DASHBOARD KPIs
═══════════════════════════════════════════════════════════════════════ */
exports.getPlatformStats = asyncHandler(async (req, res) => {
  const [
    totalUsers,
    totalDesigners,
    totalProducts,
    totalOrders,
    totalCollections,
    pendingPayouts,
  ] = await Promise.all([
    User.countDocuments(),
    Designer.countDocuments(),
    Product.countDocuments({ status: { $ne: "archived" } }),
    Order.countDocuments(),
    Collection.countDocuments({ status: { $ne: "archived" } }),
    Payout.countDocuments({ status: "pending" }),
  ]);

  // Revenue aggregation
  const revenueData = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: null,
        totalGMV: { $sum: "$financial.subtotal" },
        totalCommission: { $sum: "$financial.commission" },
        totalPayout: { $sum: "$financial.netPayout" },
        orderCount: { $sum: 1 },
        avgOrderValue: { $avg: "$financial.subtotal" },
      },
    },
  ]);

  const revenue = revenueData[0] || {
    totalGMV: 0,
    totalCommission: 0,
    totalPayout: 0,
    orderCount: 0,
    avgOrderValue: 0,
  };

  // Orders by status
  const ordersByStatus = await Order.aggregate([
    { $group: { _id: "$status", count: { $sum: 1 } } },
  ]);

  // Recent 30 days stats
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);

  const [newUsersThisMonth, newOrdersThisMonth] = await Promise.all([
    User.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
    Order.countDocuments({ createdAt: { $gte: thirtyDaysAgo } }),
  ]);

  const monthRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: thirtyDaysAgo }, status: { $ne: "cancelled" } } },
    { $group: { _id: null, total: { $sum: "$financial.subtotal" }, count: { $sum: 1 } } },
  ]);

  // Recent orders
  const recentOrders = await Order.find()
    .sort({ createdAt: -1 })
    .limit(8)
    .populate("customer", "name email")
    .populate("designer", "name brandName");

  // Pending collection reviews
  const pendingCollections = await Collection.countDocuments({ status: "in_review" });

  res.json({
    success: true,
    data: {
      kpis: {
        totalUsers,
        totalDesigners,
        totalProducts,
        totalOrders,
        totalCollections,
        pendingPayouts,
        pendingCollections,
      },
      revenue: {
        totalGMV: Math.round(revenue.totalGMV || 0),
        totalCommission: Math.round(revenue.totalCommission || 0),
        totalPayout: Math.round(revenue.totalPayout || 0),
        avgOrderValue: Math.round(revenue.avgOrderValue || 0),
      },
      ordersByStatus: ordersByStatus.reduce((acc, s) => { acc[s._id] = s.count; return acc; }, {}),
      monthly: {
        newUsers: newUsersThisMonth,
        newOrders: newOrdersThisMonth,
        revenue: Math.round(monthRevenue[0]?.total || 0),
      },
      recentOrders,
    },
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   PLATFORM ANALYTICS , 12-month revenue, top designers, categories
═══════════════════════════════════════════════════════════════════════ */
exports.getPlatformAnalytics = asyncHandler(async (req, res) => {
  const months = parseInt(req.query.months) || 12;
  const startDate = new Date();
  startDate.setMonth(startDate.getMonth() - months);

  // Monthly revenue
  const monthlyRevenue = await Order.aggregate([
    { $match: { createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } },
        revenue: { $sum: "$financial.subtotal" },
        commission: { $sum: "$financial.commission" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { _id: 1 } },
  ]);

  // Top designers by revenue
  const topDesigners = await Order.aggregate([
    { $match: { status: { $ne: "cancelled" } } },
    {
      $group: {
        _id: "$designer",
        revenue: { $sum: "$financial.subtotal" },
        orders: { $sum: 1 },
      },
    },
    { $sort: { revenue: -1 } },
    { $limit: 10 },
    {
      $lookup: {
        from: "designers",
        localField: "_id",
        foreignField: "_id",
        as: "designer",
      },
    },
    { $unwind: { path: "$designer", preserveNullAndEmptyArrays: true } },
    {
      $project: {
        name: "$designer.name",
        brandName: "$designer.brandName",
        revenue: 1,
        orders: 1,
      },
    },
  ]);

  // Top categories
  const topCategories = await Product.aggregate([
    { $match: { status: { $ne: "archived" } } },
    { $group: { _id: "$category", count: { $sum: 1 } } },
    { $sort: { count: -1 } },
    { $limit: 8 },
  ]);

  // Orders by payment method
  const paymentMethods = await Order.aggregate([
    { $group: { _id: "$payment.method", count: { $sum: 1 } } },
  ]);

  res.json({
    success: true,
    data: { monthlyRevenue, topDesigners, topCategories, paymentMethods },
  });
});

/* ═══════════════════════════════════════════════════════════════════════
   USERS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getUsers = asyncHandler(async (req, res) => {
  const { role, search, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (role) filter.role = role;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await User.countDocuments(filter);
  const users = await User.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: users,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.updateUserRole = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  if (req.body.role) user.role = req.body.role;
  await user.save();
  res.json({ success: true, data: user });
});

exports.deleteUser = asyncHandler(async (req, res) => {
  const user = await User.findById(req.params.id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  if (user.role === "admin") { res.status(403); throw new Error("Cannot delete admin users"); }
  await User.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "User deleted" });
});

/* ═══════════════════════════════════════════════════════════════════════
   DESIGNERS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getAllDesigners = asyncHandler(async (req, res) => {
  const { status, search, verified, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (verified !== undefined) filter.verified = verified === "true";
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
      { brandName: { $regex: search, $options: "i" } },
      { email: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Designer.countDocuments(filter);
  const designers = await Designer.find(filter)
    .select("-password")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  // Enrich with product/order counts
  const enriched = await Promise.all(
    designers.map(async (d) => {
      const [productCount, orderCount] = await Promise.all([
        Product.countDocuments({ designer: d._id, status: { $ne: "archived" } }),
        Order.countDocuments({ designer: d._id }),
      ]);
      return { ...d.toObject(), productCount, orderCount };
    })
  );

  res.json({
    success: true,
    data: enriched,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.updateDesigner = asyncHandler(async (req, res) => {
  const designer = await Designer.findById(req.params.id);
  if (!designer) { res.status(404); throw new Error("Designer not found"); }

  const allowed = ["verified", "plan", "category", "featured"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) designer[key] = req.body[key];
  }

  await designer.save();
  res.json({ success: true, data: designer });
});

exports.deleteDesigner = asyncHandler(async (req, res) => {
  const designer = await Designer.findById(req.params.id);
  if (!designer) { res.status(404); throw new Error("Designer not found"); }

  // Archive all products
  await Product.updateMany({ designer: designer._id }, { status: "archived" });
  await Designer.findByIdAndDelete(req.params.id);
  // Also delete the User record
  await User.findByIdAndDelete(designer.userId);

  res.json({ success: true, message: "Designer and associated user deleted" });
});

/* ═══════════════════════════════════════════════════════════════════════
   ORDERS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getAllOrders = asyncHandler(async (req, res) => {
  const { status, search, designer, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (designer) filter.designer = designer;
  if (search) {
    filter.$or = [
      { orderNumber: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Order.countDocuments(filter);
  const orders = await Order.find(filter)
    .populate("customer", "name email")
    .populate("designer", "name brandName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: orders,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.adminUpdateOrderStatus = asyncHandler(async (req, res) => {
  const order = await Order.findById(req.params.id);
  if (!order) { res.status(404); throw new Error("Order not found"); }

  if (req.body.status) order.status = req.body.status;
  if (req.body.note) {
    order.timeline.push({ status: order.status, timestamp: new Date(), note: req.body.note });
  }

  await order.save();
  res.json({ success: true, data: order });
});

/* ═══════════════════════════════════════════════════════════════════════
   COLLECTIONS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getAllCollections = asyncHandler(async (req, res) => {
  const { status, search, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Collection.countDocuments(filter);
  const collections = await Collection.find(filter)
    .populate("designer", "name brandName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: collections,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.adminUpdateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) { res.status(404); throw new Error("Collection not found"); }

  const allowed = ["status", "featured"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) collection[key] = req.body[key];
  }

  await collection.save();
  res.json({ success: true, data: collection });
});

/* ═══════════════════════════════════════════════════════════════════════
   PAYOUTS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getAllPayouts = asyncHandler(async (req, res) => {
  const { status, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;

  const total = await Payout.countDocuments(filter);
  const payouts = await Payout.find(filter)
    .populate("designer", "name brandName email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  // Summary
  const summary = await Payout.aggregate([
    {
      $group: {
        _id: "$status",
        count: { $sum: 1 },
        total: { $sum: "$amount" },
      },
    },
  ]);

  res.json({
    success: true,
    data: payouts,
    summary: summary.reduce((acc, s) => { acc[s._id] = { count: s.count, total: s.total }; return acc; }, {}),
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.processPayout = asyncHandler(async (req, res) => {
  const payout = await Payout.findById(req.params.id);
  if (!payout) { res.status(404); throw new Error("Payout not found"); }

  if (payout.status !== "pending") {
    res.status(400);
    throw new Error("Only pending payouts can be processed");
  }

  payout.status = req.body.status || "processed";
  if (payout.status === "processed") payout.processedAt = new Date();
  if (req.body.note) payout.note = req.body.note;

  await payout.save();
  res.json({ success: true, data: payout });
});

/* ═══════════════════════════════════════════════════════════════════════
   PRODUCTS MANAGEMENT (admin override)
═══════════════════════════════════════════════════════════════════════ */
exports.getAllProducts = asyncHandler(async (req, res) => {
  const { status, category, search, designer, page = 1, limit = 30 } = req.query;
  const filter = {};
  if (status) filter.status = status;
  if (category) filter.category = category;
  if (designer) filter.designer = designer;
  if (search) {
    filter.$or = [
      { name: { $regex: search, $options: "i" } },
    ];
  }

  const total = await Product.countDocuments(filter);
  const products = await Product.find(filter)
    .populate("designer", "name brandName")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: products,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.adminToggleProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) { res.status(404); throw new Error("Product not found"); }

  if (req.body.status) product.status = req.body.status;
  if (req.body.featured !== undefined) product.featured = req.body.featured;

  await product.save();
  res.json({ success: true, data: product });
});

/* ═══════════════════════════════════════════════════════════════════════
   REVIEWS MANAGEMENT
═══════════════════════════════════════════════════════════════════════ */
exports.getAllReviews = asyncHandler(async (req, res) => {
  const { page = 1, limit = 30 } = req.query;
  const total = await Review.countDocuments();
  const reviews = await Review.find()
    .populate("product", "name")
    .populate("customer", "name email")
    .sort({ createdAt: -1 })
    .skip((page - 1) * limit)
    .limit(parseInt(limit));

  res.json({
    success: true,
    data: reviews,
    pagination: { page: parseInt(page), limit: parseInt(limit), total, pages: Math.ceil(total / limit) },
  });
});

exports.deleteReview = asyncHandler(async (req, res) => {
  await Review.findByIdAndDelete(req.params.id);
  res.json({ success: true, message: "Review deleted" });
});
