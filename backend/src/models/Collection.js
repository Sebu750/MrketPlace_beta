const mongoose = require("mongoose");
const slugify = require("slugify");

const collectionSchema = new mongoose.Schema(
  {
    name: { type: String, required: [true, "Collection name is required"], trim: true },
    slug: { type: String, unique: true, sparse: true },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designer",
      required: true,
    },
    season: {
      type: String,
      enum: [
        "Spring/Summer",
        "Fall/Winter",
        "Resort",
        "Pre-Fall",
        "Bridal",
        "Festive",
        "Ramadan",
        "Couture",
        "Year-round",
      ],
    },
    category: {
      type: String,
      enum: [
        "Womenswear",
        "Menswear",
        "Unisex",
        "Bridal",
        "Pret",
        "Luxury Pret",
        "Accessories",
        "Streetwear",
        "Contemporary",
      ],
    },
    description: { type: String, maxlength: 5000 },
    coverImage: { type: String },
    lookbookImages: [{ type: String }],
    craftTraditions: [{ type: String, trim: true }],

    // ── Stats ──────────────────────────────────────────────────────────────
    productCount: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    totalRevenue: { type: Number, default: 0 },

    // ── Status ─────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "in_review", "published", "archived"],
      default: "draft",
    },
    publishedAt: { type: Date },
    featured: { type: Boolean, default: false },
    year: { type: Number, default: new Date().getFullYear() },
  },
  { timestamps: true }
);

// ── Auto-generate slug ────────────────────────────────────────────────────────
collectionSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Set publishedAt when transitioning to published
  if (this.isModified("status") && this.status === "published" && !this.publishedAt) {
    this.publishedAt = new Date();
  }
  next();
});

// ── Indexes for efficient queries ─────────────────────────────────────────────
collectionSchema.index({ designer: 1 });
collectionSchema.index({ status: 1, publishedAt: -1 });
collectionSchema.index({ slug: 1 });

module.exports = mongoose.model("Collection", collectionSchema);
