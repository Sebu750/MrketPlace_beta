const asyncHandler = require("express-async-handler");
const Product = require("../models/Product");
const { buildPaginated, paginate } = require("../middleware/pagination");

// @desc    List all active products (public)
// @route   GET /api/products
exports.listProducts = [
  paginate(24, 100),
  asyncHandler(async (req, res) => {
    const query = { status: "active" };

    // Filters
    if (req.query.category) query.category = req.query.category;
    if (req.query.craft) query.craft = { $regex: req.query.craft, $options: "i" };
    if (req.query.designer) query.designer = req.query.designer;
    if (req.query.collection) query.collection = req.query.collection;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { craft: { $regex: req.query.search, $options: "i" } },
      ];
    }
    if (req.query.priceMin || req.query.priceMax) {
      query.price = {};
      if (req.query.priceMin) query.price.$gte = Number(req.query.priceMin);
      if (req.query.priceMax) query.price.$lte = Number(req.query.priceMax);
    }

    let sort = "-createdAt";
    if (req.query.sort === "price-asc") sort = "price";
    if (req.query.sort === "price-desc") sort = "-price";
    if (req.query.sort === "popular") sort = "-salesCount";
    if (req.query.sort === "name") sort = "name";

    const { data, pagination } = await buildPaginated(Product, query, req, {
      populate: "designer collection",
      sort,
      select:
        "name slug price priceFormatted category craft oneLiner images gallery sizes colors totalStock salesCount viewCount status featured createdAt",
    });

    res.json({ success: true, data, pagination });
  }),
];

// @desc    Get single product by slug (public)
// @route   GET /api/products/:slug
exports.getProduct = asyncHandler(async (req, res) => {
  const product = await Product.findOne({ slug: req.params.slug }).populate("designer collection");

  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  // Increment view count
  product.viewCount += 1;
  await product.save();

  res.json({ success: true, data: product });
});

// @desc    Get designer's own products
// @route   GET /api/designer/products
exports.getMyProducts = [
  paginate(24, 100),
  asyncHandler(async (req, res) => {
    const designer = req.designer || req.user;
    const query = { designer: designer._id };

    if (req.query.status && req.query.status !== "all") {
      query.status = req.query.status;
    }
    if (req.query.search) {
      query.name = { $regex: req.query.search, $options: "i" };
    }

    const { data, pagination } = await buildPaginated(Product, query, req, {
      populate: "collection",
      sort: "-createdAt",
    });

    res.json({ success: true, data, pagination });
  }),
];

// @desc    Create product (designer only)
// @route   POST /api/products
exports.createProduct = asyncHandler(async (req, res) => {
  const designer = req.designer || req.user;

  const {
    name, collection, category, craft, price, oneLiner, description,
    craftStory, materials, careInstructions, deliveryTime, returnPolicy,
    sizes, colors, variants, images, gallery, featured,
  } = req.body;

  if (!name || !price) {
    res.status(400);
    throw new Error("Product name and price are required");
  }

  const product = await Product.create({
    name, collection, category, craft, price, oneLiner, description,
    craftStory, materials, careInstructions, deliveryTime, returnPolicy,
    sizes: sizes || [],
    colors: colors || [],
    variants: variants || [],
    images: images || [],
    gallery: gallery || [],
    featured: featured || false,
    designer: designer._id,
  });

  res.status(201).json({ success: true, data: product });
});

// @desc    Update product (designer, owner only)
// @route   PUT /api/products/:id
exports.updateProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.designer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to update this product");
  }

  const allowed = [
    "name", "collection", "category", "craft", "price", "oneLiner", "description",
    "craftStory", "materials", "careInstructions", "deliveryTime", "returnPolicy",
    "sizes", "colors", "variants", "images", "gallery", "featured", "status",
  ];

  for (const key of allowed) {
    if (req.body[key] !== undefined) product[key] = req.body[key];
  }

  const updated = await product.save();
  res.json({ success: true, data: updated });
});

// @desc    Delete product (soft delete , set to archived)
// @route   DELETE /api/products/:id
exports.deleteProduct = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.designer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403);
    throw new Error("Not authorized to delete this product");
  }

  product.status = "archived";
  await product.save();

  res.json({ success: true, message: "Product archived" });
});

// @desc    Toggle product status (draft ↔ active)
// @route   PATCH /api/products/:id/status
exports.toggleStatus = asyncHandler(async (req, res) => {
  const product = await Product.findById(req.params.id);
  if (!product) {
    res.status(404);
    throw new Error("Product not found");
  }

  if (product.designer.toString() !== req.user._id.toString()) {
    res.status(403);
    throw new Error("Not authorized");
  }

  product.status = product.status === "active" ? "draft" : "active";
  await product.save();

  res.json({ success: true, data: { status: product.status } });
});
