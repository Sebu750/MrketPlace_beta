const mongoose = require("mongoose");

const payoutSchema = new mongoose.Schema(
  {
    reference: { type: String, unique: true },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "Designer", required: true },

    amount: { type: Number, required: true },
    commission: { type: Number, required: true },

    status: {
      type: String,
      enum: ["pending", "processed", "failed"],
      default: "pending",
    },

    method: { type: String, default: "bank_transfer" },
    bankDetails: {
      holder: { type: String, trim: true },
      accountMasked: { type: String },
      bank: { type: String, trim: true },
      branch: { type: String, trim: true },
    },

    periodStart: { type: Date, required: true },
    periodEnd: { type: Date, required: true },
    processedAt: { type: Date },
  },
  { timestamps: true }
);

payoutSchema.pre("save", function (next) {
  if (this.isNew && !this.reference) {
    const prefix = "PAY";
    const random = Math.floor(Math.random() * 10000).toString().padStart(4, "0");
    this.reference = `${prefix}-${random}`;
  }
  if (this.isModified("status") && this.status === "processed" && !this.processedAt) {
    this.processedAt = new Date();
  }
  next();
});

payoutSchema.index({ designer: 1, createdAt: -1 });
payoutSchema.index({ reference: 1 });

module.exports = mongoose.model("Payout", payoutSchema);
