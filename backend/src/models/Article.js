const mongoose = require("mongoose");
const slugify = require("slugify");

const articleSchema = new mongoose.Schema(
  {
    title: {
      type: String,
      required: [true, "Article title is required"],
      trim: true,
    },
    slug: { type: String, unique: true, sparse: true },
    category: {
      type: String,
      required: true,
      enum: [
        "Interviews",
        "Designer Stories",
        "Collection Reviews",
        "Industry Reports",
        "Student Features",
        "Craft Documentation",
      ],
    },
    excerpt: { type: String, maxlength: 500, trim: true },
    content: { type: String, maxlength: 50000 },
    coverImage: { type: String },
    gallery: [{ type: String }],
    author: { type: String, trim: true },
    readTime: { type: Number, default: 5 },
    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
    publishedAt: { type: Date },
  },
  { timestamps: true }
);

// ── Auto-generate slug + publishedAt ──────────────────────────────────────────
articleSchema.pre("save", function (next) {
  if (this.isModified("title") && !this.slug) {
    this.slug = slugify(this.title, { lower: true, strict: true });
  }
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

articleSchema.index({ slug: 1 });
articleSchema.index({ status: 1, publishedAt: -1 });
articleSchema.index({ category: 1 });
articleSchema.index({ featured: 1 });

module.exports = mongoose.model("Article", articleSchema);
