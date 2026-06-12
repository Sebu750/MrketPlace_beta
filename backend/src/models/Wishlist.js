const mongoose = require("mongoose");

const wishlistItemSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    productId: { type: String }, // frontend compatibility
    name: { type: String },
    price: { type: Number },
    priceFormatted: { type: String },
    image: { type: String },
    designer: { type: String },
    size: { type: String },
    color: { type: String },
  },
  { timestamps: true }
);

const wishlistSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    items: [wishlistItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("Wishlist", wishlistSchema);
