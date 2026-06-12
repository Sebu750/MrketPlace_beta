const mongoose = require("mongoose");
const slugify = require("slugify");

const craftHeritageSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Craft name is required"],
      trim: true,
    },
    slug: { type: String, unique: true, sparse: true },
    region: { type: String, trim: true },
    era: { type: String, trim: true },
    tagline: { type: String, maxlength: 300, trim: true },
    story: { type: String, maxlength: 8000 },
    history: { type: String, maxlength: 8000 },
    coverImage: { type: String },
    gallery: [{ type: String }],

    // Stats — populated by queries at runtime, not stored
    // designerCount and productCount are computed on the frontend

    featured: { type: Boolean, default: false },
    status: {
      type: String,
      enum: ["draft", "published", "archived"],
      default: "published",
    },
  },
  { timestamps: true }
);

// ── Auto-generate slug ────────────────────────────────────────────────────────
craftHeritageSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

craftHeritageSchema.index({ slug: 1 });
craftHeritageSchema.index({ status: 1, createdAt: -1 });

module.exports = mongoose.model("CraftHeritage", craftHeritageSchema);
