const asyncHandler = require("express-async-handler");
const CraftHeritage = require("../models/CraftHeritage");
const Product = require("../models/Product");
const Collection = require("../models/Collection");
const Designer = require("../models/Designer");
const { buildPaginated, paginate } = require("../middleware/pagination");

// @desc    List all published craft heritage entries (public)
// @route   GET /api/crafts
exports.listCrafts = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const query = { status: "published" };
    if (req.query.featured === "true") query.featured = true;
    if (req.query.search) {
      query.$or = [
        { name: { $regex: req.query.search, $options: "i" } },
        { region: { $regex: req.query.search, $options: "i" } },
        { era: { $regex: req.query.search, $options: "i" } },
        { tagline: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const { data, pagination } = await buildPaginated(CraftHeritage, query, req, {
      sort: "-createdAt",
      select: "name slug region era tagline coverImage featured createdAt",
    });

    // For each craft, count products and collections that reference it
    const craftsWithCounts = await Promise.all(
      data.map(async (craft) => {
        const craftName = craft.name;
        const productCount = await Product.countDocuments({
          craft: { $regex: `^${craftName}$`, $options: "i" },
          status: "active",
        });
        const collectionCount = await Collection.countDocuments({
          craftTraditions: { $in: [craftName] },
          status: "published",
        });
        const designerCount = await Designer.countDocuments({
          craftTraditions: { $in: [craftName] },
        });
        return {
          ...craft.toObject(),
          productCount,
          collectionCount,
          designerCount,
        };
      })
    );

    res.json({ success: true, data: craftsWithCounts, pagination });
  }),
];

// @desc    Get single craft heritage by slug with related products/collections/designers (public)
// @route   GET /api/crafts/:slug
exports.getCraft = asyncHandler(async (req, res) => {
  const craft = await CraftHeritage.findOne({ slug: req.params.slug, status: "published" });

  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }

  // Find products using this craft
  const products = await Product.find({
    craft: { $regex: `^${craft.name}$`, $options: "i" },
    status: "active",
  })
    .populate("designer", "name slug brandName")
    .sort("-createdAt")
    .limit(12);

  // Find collections featuring this craft tradition
  const collections = await Collection.find({
    craftTraditions: { $in: [craft.name] },
    status: "published",
  })
    .populate("designer", "name slug brandName")
    .sort("-publishedAt")
    .limit(8);

  // Find designers practicing this craft
  const designers = await Designer.find({
    craftTraditions: { $in: [craft.name] },
  })
    .select("name slug brandName studioCity verified category")
    .limit(12);

  res.json({
    success: true,
    data: {
      ...craft.toObject(),
      products,
      collections,
      designers,
      productCount: products.length,
      collectionCount: collections.length,
      designerCount: designers.length,
    },
  });
});

// @desc    Create craft heritage entry (admin only)
// @route   POST /api/crafts
exports.createCraft = asyncHandler(async (req, res) => {
  const { name, region, era, tagline, story, history, coverImage, gallery, featured } = req.body;
  if (!name) {
    res.status(400);
    throw new Error("Craft name is required");
  }

  const craft = await CraftHeritage.create({
    name, region, era, tagline, story, history, coverImage, gallery, featured,
  });

  res.status(201).json({ success: true, data: craft });
});

// @desc    Update craft heritage entry (admin only)
// @route   PUT /api/crafts/:id
exports.updateCraft = asyncHandler(async (req, res) => {
  const craft = await CraftHeritage.findById(req.params.id);
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }

  const allowed = ["name", "region", "era", "tagline", "story", "history", "coverImage", "gallery", "featured", "status"];
  for (const key of allowed) {
    if (req.body[key] !== undefined) craft[key] = req.body[key];
  }

  res.json({ success: true, data: await craft.save() });
});

// @desc    Delete / archive craft heritage entry (admin only)
// @route   DELETE /api/crafts/:id
exports.deleteCraft = asyncHandler(async (req, res) => {
  const craft = await CraftHeritage.findById(req.params.id);
  if (!craft) {
    res.status(404);
    throw new Error("Craft not found");
  }
  craft.status = "archived";
  await craft.save();
  res.json({ success: true, message: "Craft archived" });
});
