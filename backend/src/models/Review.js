const mongoose = require("mongoose");

const reviewSchema = new mongoose.Schema(
  {
    product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "Designer", required: true },

    rating: { type: Number, required: true, min: 1, max: 5 },
    title: { type: String, maxlength: 200, trim: true },
    text: { type: String, maxlength: 3000 },

    status: {
      type: String,
      enum: ["pending", "approved", "rejected"],
      default: "pending",
    },

    helpfulCount: { type: Number, default: 0 },
    verifiedPurchase: { type: Boolean, default: false },
  },
  { timestamps: true }
);

reviewSchema.index({ product: 1, status: 1 });
reviewSchema.index({ designer: 1, status: 1 });
reviewSchema.index({ customer: 1 });

module.exports = mongoose.model("Review", reviewSchema);
