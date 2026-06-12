const asyncHandler = require("express-async-handler");
const User = require("../models/User");
const Wishlist = require("../models/Wishlist");
const AddressBook = require("../models/AddressBook");
const Review = require("../models/Review");
const Order = require("../models/Order");
const bcrypt = require("bcryptjs");

/* ═══════════════════════════════════════════════════════════════════════════
   PROFILE
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Get customer profile
// @route   GET /api/customer/profile
exports.getProfile = asyncHandler(async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }
  res.json({ success: true, data: user });
});

// @desc    Update customer profile (name, phone)
// @route   PUT /api/customer/profile
exports.updateProfile = asyncHandler(async (req, res) => {
  const { name, phone } = req.body;
  const user = await User.findById(req.user._id);
  if (!user) { res.status(404); throw new Error("User not found"); }

  if (name !== undefined) user.name = name;
  if (phone !== undefined) user.phone = phone;
  await user.save();

  res.json({ success: true, data: user });
});

/* ═══════════════════════════════════════════════════════════════════════════
   PASSWORD
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Change password
// @route   PUT /api/customer/password
exports.changePassword = asyncHandler(async (req, res) => {
  const { currentPassword, newPassword } = req.body;
  if (!currentPassword || !newPassword) {
    res.status(400);
    throw new Error("Current and new password are required");
  }
  if (newPassword.length < 8) {
    res.status(400);
    throw new Error("Password must be at least 8 characters");
  }

  const user = await User.findById(req.user._id).select("+password");
  if (!user) { res.status(404); throw new Error("User not found"); }

  const isMatch = await bcrypt.compare(currentPassword, user.password);
  if (!isMatch) {
    res.status(400);
    throw new Error("Current password is incorrect");
  }

  user.password = newPassword; // pre-save hook hashes it
  await user.save();

  res.json({ success: true, message: "Password changed successfully" });
});

/* ═══════════════════════════════════════════════════════════════════════════
   WISHLIST
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Get wishlist
// @route   GET /api/customer/wishlist
exports.getWishlist = asyncHandler(async (req, res) => {
  let wish = await Wishlist.findOne({ user: req.user._id }).populate("items.product");
  if (!wish) wish = { items: [] };
  res.json({ success: true, data: wish.items });
});

// @desc    Add item to wishlist (or toggle)
// @route   POST /api/customer/wishlist
exports.toggleWishlist = asyncHandler(async (req, res) => {
  const { productId, name, price, priceFormatted, image, designer, size, color } = req.body;
  if (!productId) { res.status(400); throw new Error("productId is required"); }

  let wish = await Wishlist.findOne({ user: req.user._id });
  if (!wish) wish = await Wishlist.create({ user: req.user._id, items: [] });

  const existing = wish.items.find(
    (i) => i.product?.toString() === productId || i.productId === productId
  );

  if (existing) {
    wish.items = wish.items.filter(
      (i) => i.product?.toString() !== productId && i.productId !== productId
    );
  } else {
    wish.items.push({
      product: productId,
      productId,
      name,
      price,
      priceFormatted,
      image,
      designer,
      size,
      color,
    });
  }

  await wish.save();
  await wish.populate("items.product");
  res.json({ success: true, data: wish.items, toggled: existing ? "removed" : "added" });
});

// @desc    Remove item from wishlist by productId
// @route   DELETE /api/customer/wishlist/:productId
exports.removeFromWishlist = asyncHandler(async (req, res) => {
  const { productId } = req.params;
  let wish = await Wishlist.findOne({ user: req.user._id });
  if (!wish) { res.json({ success: true, data: [] }); return; }

  wish.items = wish.items.filter(
    (i) => i.product?.toString() !== productId && i.productId !== productId
  );
  await wish.save();
  await wish.populate("items.product");
  res.json({ success: true, data: wish.items });
});

/* ═══════════════════════════════════════════════════════════════════════════
   ADDRESSES
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Get address book
// @route   GET /api/customer/addresses
exports.getAddresses = asyncHandler(async (req, res) => {
  let book = await AddressBook.findOne({ user: req.user._id });
  if (!book) book = { addresses: [] };
  res.json({ success: true, data: book.addresses });
});

// @desc    Add address
// @route   POST /api/customer/addresses
exports.addAddress = asyncHandler(async (req, res) => {
  const { name, phone, address, city, postalCode, country, isDefault, id } = req.body;

  let book = await AddressBook.findOne({ user: req.user._id });
  if (!book) book = await AddressBook.create({ user: req.user._id, addresses: [] });

  // If first address or isDefault, clear others
  if (book.addresses.length === 0 || isDefault) {
    book.addresses.forEach((a) => { a.isDefault = false; });
  }

  book.addresses.push({
    id: id || `addr_${Date.now()}`,
    name, phone, address, city, postalCode,
    country: country || "Pakistan",
    isDefault: book.addresses.length === 0 ? true : (isDefault || false),
  });

  await book.save();
  res.json({ success: true, data: book.addresses });
});

// @desc    Update address
// @route   PUT /api/customer/addresses/:id
exports.updateAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;
  const updates = req.body;

  let book = await AddressBook.findOne({ user: req.user._id });
  if (!book) { res.status(404); throw new Error("Address book not found"); }

  const addr = book.addresses.find((a) => a.id === id || a._id?.toString() === id);
  if (!addr) { res.status(404); throw new Error("Address not found"); }

  if (updates.isDefault) {
    book.addresses.forEach((a) => { a.isDefault = false; });
  }

  Object.assign(addr, updates);
  await book.save();
  res.json({ success: true, data: book.addresses });
});

// @desc    Remove address
// @route   DELETE /api/customer/addresses/:id
exports.removeAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let book = await AddressBook.findOne({ user: req.user._id });
  if (!book) { res.json({ success: true, data: [] }); return; }

  book.addresses = book.addresses.filter(
    (a) => a.id !== id && a._id?.toString() !== id
  );
  await book.save();
  res.json({ success: true, data: book.addresses });
});

// @desc    Set default address
// @route   PATCH /api/customer/addresses/:id/default
exports.setDefaultAddress = asyncHandler(async (req, res) => {
  const { id } = req.params;

  let book = await AddressBook.findOne({ user: req.user._id });
  if (!book) { res.status(404); throw new Error("Address book not found"); }

  book.addresses.forEach((a) => {
    a.isDefault = a.id === id || a._id?.toString() === id;
  });
  await book.save();
  res.json({ success: true, data: book.addresses });
});

/* ═══════════════════════════════════════════════════════════════════════════
   REVIEWS
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Get customer's reviews (paginated)
// @route   GET /api/customer/reviews
exports.getMyReviews = asyncHandler(async (req, res) => {
  const page = parseInt(req.query.page) || 1;
  const limit = parseInt(req.query.limit) || 10;
  const skip = (page - 1) * limit;

  const filter = { customer: req.user._id };

  const [total, reviews] = await Promise.all([
    Review.countDocuments(filter),
    Review.find(filter)
      .populate("product", "name images price priceFormatted slug")
      .populate("designer", "brandName slug")
      .sort({ createdAt: -1 })
      .skip(skip)
      .limit(limit),
  ]);

  const pages = Math.ceil(total / limit);
  res.json({
    success: true,
    data: reviews,
    pagination: { page, limit, total, pages },
  });
});

/* ═══════════════════════════════════════════════════════════════════════════
   STATS
═══════════════════════════════════════════════════════════════════════════ */

// @desc    Get customer dashboard stats
// @route   GET /api/customer/stats
exports.getStats = asyncHandler(async (req, res) => {
  const userId = req.user._id;

  const [totalOrders, activeOrders, deliveredOrders, wishlist, addresses] = await Promise.all([
    Order.countDocuments({ customer: userId }),
    Order.countDocuments({
      customer: userId,
      status: { $in: ["new", "in_production", "ready_to_ship", "shipped"] },
    }),
    Order.countDocuments({ customer: userId, status: "delivered" }),
    Wishlist.findOne({ user: userId }).select("items"),
    AddressBook.findOne({ user: userId }).select("addresses"),
  ]);

  // Lifetime spend
  const spendAgg = await Order.aggregate([
    { $match: { customer: userId, status: "delivered" } },
    { $group: { _id: null, total: { $sum: "$financial.subtotal" } } },
  ]);

  res.json({
    success: true,
    data: {
      totalOrders,
      activeOrders,
      deliveredOrders,
      wishlistCount: wishlist?.items?.length || 0,
      addressCount: addresses?.addresses?.length || 0,
      lifetimeSpend: spendAgg[0]?.total || 0,
    },
  });
});
