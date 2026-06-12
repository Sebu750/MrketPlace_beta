const mongoose = require("mongoose");
const slugify = require("slugify");

const productSchema = new mongoose.Schema(
  {
    // ── Core ───────────────────────────────────────────────────────────────────
    name: { type: String, required: [true, "Product name is required"], trim: true },
    slug: { type: String, unique: true, sparse: true },
    designer: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Designer",
      required: true,
    },
    collection: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Collection",
    },

    // ── Classification ─────────────────────────────────────────────────────────
    category: {
      type: String,
      enum: [
        "Dresses",
        "Tops",
        "Bottoms",
        "Outerwear",
        "Suits",
        "Kurta",
        "Shalwar Kameez",
        "Bridal",
        "Formal",
        "Casual",
        "Accessories",
        "Bags",
        "Shoes",
        "Jewellery",
        "Scarves",
      ],
    },
    craft: { type: String, trim: true },

    // ── Pricing ────────────────────────────────────────────────────────────────
    price: { type: Number, required: true, min: 0 },
    priceFormatted: { type: String },

    // ── Content ────────────────────────────────────────────────────────────────
    oneLiner: { type: String, maxlength: 200, trim: true },
    description: { type: String, maxlength: 10000 },
    craftStory: { type: String, maxlength: 5000 },
    materials: { type: String },
    careInstructions: { type: String },
    deliveryTime: { type: String, default: "14–21 business days" },
    returnPolicy: { type: String, default: "14-day return policy" },

    // ── Media ──────────────────────────────────────────────────────────────────
    images: [
      {
        url: { type: String, required: true },
        label: { type: String },
        position: { type: Number, default: 0 },
      },
    ],
    gallery: [{ type: String }],

    // ── Variants ───────────────────────────────────────────────────────────────
    sizes: [{ type: String }],
    colors: [{ type: String }],
    variants: [
      {
        size: { type: String },
        color: { type: String },
        stock: { type: Number, default: 0, min: 0 },
        sku: { type: String },
      },
    ],

    // ── Stats ──────────────────────────────────────────────────────────────────
    totalStock: { type: Number, default: 0 },
    salesCount: { type: Number, default: 0 },
    viewCount: { type: Number, default: 0 },

    // ── Status ─────────────────────────────────────────────────────────────────
    status: {
      type: String,
      enum: ["draft", "active", "sold_out", "archived"],
      default: "draft",
    },
    featured: { type: Boolean, default: false },
  },
  { timestamps: true }
);

// ── Auto-generate slug ────────────────────────────────────────────────────────
productSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  // Auto-format price
  if (this.isModified("price")) {
    this.priceFormatted = `PKR ${this.price.toLocaleString("en-PK")}`;
  }
  // Compute total stock from variants
  if (this.variants && this.variants.length > 0) {
    this.totalStock = this.variants.reduce((sum, v) => sum + v.stock, 0);
  }
  // Auto-update status based on stock
  if (this.totalStock === 0 && this.status === "active") {
    this.status = "sold_out";
  }
  next();
});

// ── Indexes ───────────────────────────────────────────────────────────────────
productSchema.index({ designer: 1, status: 1 });
productSchema.index({ collection: 1 });
productSchema.index({ slug: 1 });
productSchema.index({ status: 1, createdAt: -1 });
productSchema.index({ price: 1 });
productSchema.index({ category: 1 });

module.exports = mongoose.model("Product", productSchema);
