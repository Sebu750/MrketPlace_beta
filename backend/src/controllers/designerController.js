const asyncHandler = require("express-async-handler");
const Designer = require("../models/Designer");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
const Order = require("../models/Order");
const { buildPaginated, paginate } = require("../middleware/pagination");

exports.listDesigners = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const query = { role: "seller" };
    if (req.query.category) query.category = req.query.category;
    if (req.query.verified === "true") query.verified = true;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { brandName: { $regex: req.query.search, $options: "i" } },
        { bio: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const { data, pagination } = await buildPaginated(Designer, query, req, {
      select: "name slug brandName logo banner bio category craftTraditions verified profileViews",
    });

    res.json({ success: true, data, pagination });
  }),
];

exports.getDesigner = asyncHandler(async (req, res) => {
  const designer = await Designer.findOne({ slug: req.params.slug });
  if (!designer) { res.status(404); throw new Error("Designer not found"); }
  designer.profileViews += 1;
  await designer.save();
  res.json({ success: true, data: designer });
});

exports.getProfile = asyncHandler(async (req, res) => {
  const designer = await Designer.findOne({ userId: req.user._id });
  if (!designer) { res.status(404); throw new Error("Designer profile not found"); }
  res.json({ success: true, data: designer });
});

exports.updateProfile = asyncHandler(async (req, res) => {
  const designer = await Designer.findOne({ userId: req.user._id });
  if (!designer) { res.status(404); throw new Error("Designer profile not found"); }

  const allowed = [
    "name", "brandName", "bio", "logo", "banner", "socialLinks",
    "studioCity", "operatingHours", "defaultShippingPolicy", "defaultReturnPolicy",
    "craftTraditions", "category", "notifications",
  ];
  for (const key of allowed) { if (req.body[key] !== undefined) designer[key] = req.body[key]; }

  res.json({ success: true, data: await designer.save() });
});

exports.getDashboard = asyncHandler(async (req, res) => {
  const designer = await Designer.findOne({ userId: req.user._id });
  if (!designer) { res.status(404); throw new Error("Designer profile not found"); }

  const [totalProducts, activeProducts, totalOrders, pendingOrders, totalRevenue, totalCollections] = await Promise.all([
    Product.countDocuments({ designer: designer._id }),
    Product.countDocuments({ designer: designer._id, status: "active" }),
    Order.countDocuments({ designer: designer._id, status: { $ne: "cancelled" } }),
    Order.countDocuments({ designer: designer._id, status: { $in: ["new", "in_production"] } }),
    Order.aggregate([
      { $match: { designer: designer._id, status: { $ne: "cancelled" } } },
      { $group: { _id: null, total: { $sum: "$financial.netPayout" } } },
    ]),
    Collection.countDocuments({ designer: designer._id, status: "published" }),
  ]);

  res.json({
    success: true,
    data: {
      totalProducts,
      activeProducts,
      totalOrders,
      pendingOrders,
      totalRevenue: totalRevenue[0]?.total || 0,
      totalCollections,
      profileViews: designer.profileViews,
    },
  });
});

exports.getAnalytics = asyncHandler(async (req, res) => {
  const designer = await Designer.findOne({ userId: req.user._id });
  if (!designer) { res.status(404); throw new Error("Designer profile not found"); }

  const months = 12;
  const now = new Date();
  const startDate = new Date(now.getFullYear(), now.getMonth() - months + 1, 1);

  const monthlyRevenue = await Order.aggregate([
    { $match: { designer: designer._id, createdAt: { $gte: startDate }, status: { $ne: "cancelled" } } },
    { $group: { _id: { $dateToString: { format: "%Y-%m", date: "$createdAt" } }, revenue: { $sum: "$financial.netPayout" }, orders: { $sum: 1 } } },
    { $sort: { _id: 1 } },
  ]);

  const topProducts = await Product.find({ designer: designer._id, status: "active" })
    .sort("-salesCount").limit(5).select("name slug price salesCount viewCount images");

  res.json({
    success: true,
    data: { monthlyRevenue, topProducts, profileViews: designer.profileViews },
  });
});
