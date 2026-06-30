const asyncHandler = require("express-async-handler");
const Collection = require("../models/Collection");
const { buildPaginated, paginate } = require("../middleware/pagination");

exports.listCollections = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const query = { status: "published" };
    if (req.query.designer) query.designer = req.query.designer;
    if (req.query.season) query.season = req.query.season;
    if (req.query.category) query.category = req.query.category;
    if (req.query.year) query.year = Number(req.query.year);
    if (req.query.featured === "true") query.featured = true;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { description: { $regex: req.query.search, $options: "i" } },
        { season: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const { data, pagination } = await buildPaginated(Collection, query, req, {
      populate: "designer",
      sort: "-publishedAt",
      select: "name slug designer season category coverImage craftTraditions productCount salesCount featured publishedAt year",
    });

    res.json({ success: true, data, pagination });
  }),
];

exports.getCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findOne({ slug: req.params.slug })
    .populate("designer")
    .populate({ path: "products", populate: "designer" });

  if (!collection) {
    res.status(404);
    throw new Error("Collection not found");
  }

  const products = await require("../models/Product").find({ collection: collection._id, status: "active" })
    .populate("designer")
    .sort("-createdAt");

  res.json({ success: true, data: { ...collection.toObject(), products } });
});

exports.getMyCollections = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const query = { designer: req.designer._id };
    if (req.query.status && req.query.status !== "all") query.status = req.query.status;

    const { data, pagination } = await buildPaginated(Collection, query, req, {
      sort: "-createdAt",
    });

    res.json({ success: true, data, pagination });
  }),
];

exports.createCollection = asyncHandler(async (req, res) => {
  const { name, season, category, description, coverImage, lookbookImages, craftTraditions, featured, year } = req.body;
  if (!name) { res.status(400); throw new Error("Collection name is required"); }

  // Auto-publish first collection
  const existingCount = await Collection.countDocuments({ designer: req.designer._id });
  const isFirstCollection = existingCount === 0;

  const collection = await Collection.create({
    name, season, category, description, coverImage, lookbookImages, craftTraditions,
    featured: featured || false, year: year || new Date().getFullYear(),
    designer: req.designer._id,
    status: isFirstCollection ? "published" : (req.body.status || "draft"),
  });

  res.status(201).json({ success: true, data: collection, isFirstCollection });
});

exports.updateCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) { res.status(404); throw new Error("Not found"); }
  if (collection.designer.toString() !== req.user._id.toString() && req.user.role !== "admin") {
    res.status(403); throw new Error("Not authorized");
  }

  const allowed = ["name", "season", "category", "description", "coverImage", "lookbookImages", "craftTraditions", "featured", "status", "year"];
  for (const key of allowed) { if (req.body[key] !== undefined) collection[key] = req.body[key]; }

  res.json({ success: true, data: await collection.save() });
});

exports.updateStatus = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) { res.status(404); throw new Error("Not found"); }
  if (collection.designer.toString() !== req.user._id.toString()) { res.status(403); throw new Error("Not authorized"); }
  if (req.body.status) collection.status = req.body.status;
  res.json({ success: true, data: await collection.save() });
});

exports.deleteCollection = asyncHandler(async (req, res) => {
  const collection = await Collection.findById(req.params.id);
  if (!collection) { res.status(404); throw new Error("Not found"); }
  if (collection.designer.toString() !== req.user._id.toString() && req.user.role !== "admin") { res.status(403); throw new Error("Not authorized"); }
  collection.status = "archived";
  await collection.save();
  res.json({ success: true, message: "Collection archived" });
});
