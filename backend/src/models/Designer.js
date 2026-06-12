const mongoose = require("mongoose");
const slugify = require("slugify");

const designerSchema = new mongoose.Schema(
  {
    // ── Core (mirrors User fields for standalone use) ──────────────────────────
    userId: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "User",
      required: true,
      unique: true,
    },
    name: { type: String, required: true, trim: true },
    email: { type: String, required: true, unique: true, lowercase: true },
    password: { type: String, required: true, select: false },
    role: { type: String, default: "seller" },

    // ── Brand ──────────────────────────────────────────────────────────────────
    brandName: { type: String, trim: true },
    bio: { type: String, maxlength: 5000 },
    logo: { type: String },
    banner: { type: String },
    socialLinks: {
      instagram: { type: String, trim: true },
      website: { type: String, trim: true },
      facebook: { type: String, trim: true },
    },

    // ── Studio ─────────────────────────────────────────────────────────────────
    studioCity: { type: String, trim: true },
    operatingHours: { type: String, default: "Monday–Friday, 9 AM – 6 PM" },
    defaultShippingPolicy: { type: String },
    defaultReturnPolicy: { type: String },

    // ── Identity ───────────────────────────────────────────────────────────────
    craftTraditions: [{ type: String, trim: true }],
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
    verified: { type: Boolean, default: false },
    plan: { type: String, enum: ["free", "pro", "enterprise"], default: "free" },

    // ── Meta ───────────────────────────────────────────────────────────────────
    slug: { type: String, unique: true, sparse: true },
    profileViews: { type: Number, default: 0 },
    joinedDate: { type: Date, default: Date.now },

    // ── Bank (encrypted at controller level, masked for display) ────────────────
    bankDetails: {
      holder: { type: String, trim: true },
      accountNumber: { type: String, trim: true, select: false },
      accountMasked: { type: String },
      bank: { type: String, trim: true },
      branch: { type: String, trim: true },
    },

    // ── Notification preferences ───────────────────────────────────────────────
    notifications: {
      orders: { type: Boolean, default: true },
      payouts: { type: Boolean, default: true },
      reviews: { type: Boolean, default: true },
      marketing: { type: Boolean, default: false },
    },
  },
  { timestamps: true }
);

// ── Slug auto-generation ──────────────────────────────────────────────────────
designerSchema.pre("save", function (next) {
  if (this.isModified("name") && !this.slug) {
    this.slug = slugify(this.name, { lower: true, strict: true });
  }
  next();
});

// ── Password hashing (shared with User) ──────────────────────────────────────
const bcrypt = require("bcryptjs");
designerSchema.pre("save", async function (next) {
  if (!this.isModified("password")) return next();
  this.password = await bcrypt.hash(this.password, 12);
  next();
});

designerSchema.methods.comparePassword = async function (candidate) {
  return bcrypt.compare(candidate, this.password);
};

module.exports = mongoose.model("Designer", designerSchema);
