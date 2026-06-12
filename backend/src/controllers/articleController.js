const asyncHandler = require("express-async-handler");
const Article = require("../models/Article");
const { buildPaginated, paginate } = require("../middleware/pagination");

// @desc    List all published articles (public)
// @route   GET /api/editorial
exports.listArticles = [
  paginate(20, 100),
  asyncHandler(async (req, res) => {
    const query = { status: "published" };
    if (req.query.category) query.category = req.query.category;
    if (req.query.featured === "true") query.featured = true;
    if (req.query.search) {
      query.$or = [
        { title: { $regex: req.query.search, $options: "i" } },
        { excerpt: { $regex: req.query.search, $options: "i" } },
        { content: { $regex: req.query.search, $options: "i" } },
        { author: { $regex: req.query.search, $options: "i" } },
      ];
    }

    const { data, pagination } = await buildPaginated(Article, query, req, {
      sort: "-publishedAt",
      select: "title slug category excerpt coverImage author readTime featured publishedAt",
    });

    res.json({ success: true, data, pagination });
  }),
];

// @desc    Get single article by slug (public)
// @route   GET /api/editorial/:slug
exports.getArticle = asyncHandler(async (req, res) => {
  const article = await Article.findOne({ slug: req.params.slug, status: "published" });

  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  // Get related articles in same category
  const related = await Article.find({
    category: article.category,
    _id: { $ne: article._id },
    status: "published",
  })
    .select("title slug category excerpt coverImage author readTime publishedAt")
    .sort("-publishedAt")
    .limit(3);

  res.json({ success: true, data: { ...article.toObject(), related } });
});

// @desc    Create article (admin only)
// @route   POST /api/editorial
exports.createArticle = asyncHandler(async (req, res) => {
  const {
    title, category, excerpt, content, coverImage, gallery,
    author, readTime, featured,
  } = req.body;

  if (!title || !category) {
    res.status(400);
    throw new Error("Title and category are required");
  }

  const article = await Article.create({
    title, category, excerpt, content, coverImage, gallery,
    author, readTime, featured,
  });

  res.status(201).json({ success: true, data: article });
});

// @desc    Update article (admin only)
// @route   PUT /api/editorial/:id
exports.updateArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }

  const allowed = [
    "title", "category", "excerpt", "content", "coverImage", "gallery",
    "author", "readTime", "featured", "status",
  ];
  for (const key of allowed) {
    if (req.body[key] !== undefined) article[key] = req.body[key];
  }

  res.json({ success: true, data: await article.save() });
});

// @desc    Delete / archive article (admin only)
// @route   DELETE /api/editorial/:id
exports.deleteArticle = asyncHandler(async (req, res) => {
  const article = await Article.findById(req.params.id);
  if (!article) {
    res.status(404);
    throw new Error("Article not found");
  }
  article.status = "archived";
  await article.save();
  res.json({ success: true, message: "Article archived" });
});
