const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    orderNumber: { type: String, unique: true },
    customer: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    designer: { type: mongoose.Schema.Types.ObjectId, ref: "Designer", required: true },

    items: [
      {
        product: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        name: { type: String, required: true },
        image: { type: String },
        size: { type: String },
        color: { type: String },
        quantity: { type: Number, required: true, min: 1 },
        price: { type: String },
        priceRaw: { type: Number, required: true },
      },
    ],

    status: {
      type: String,
      enum: ["new", "in_production", "ready_to_ship", "shipped", "delivered", "cancelled"],
      default: "new",
    },

    shipping: {
      address: { type: String, required: true },
      city: { type: String, required: true },
      province: { type: String },
      zip: { type: String },
      country: { type: String, default: "Pakistan" },
      method: { type: String, default: "standard" },
    },

    tracking: {
      carrier: { type: String },
      number: { type: String },
      url: { type: String },
      shippedAt: { type: Date },
      deliveredAt: { type: Date },
    },

    payment: {
      method: { type: String, default: "card" },
      transactionId: { type: String },
      status: { type: String, enum: ["pending", "completed", "refunded"], default: "pending" },
    },

    financial: {
      subtotal: { type: Number, required: true },
      commission: { type: Number, required: true },
      commissionRate: { type: Number, default: 0.1 },
      shipping: { type: Number, default: 0 },
      netPayout: { type: Number, required: true },
    },

    timeline: [
      {
        status: { type: String },
        timestamp: { type: Date, default: Date.now },
        note: { type: String },
      },
    ],

    customerNote: { type: String },
    designerNote: { type: String },
  },
  { timestamps: true }
);

orderSchema.pre("save", async function (next) {
  if (this.isNew && !this.orderNumber) {
    const date = new Date();
    const dateStr = [
      date.getFullYear(),
      String(date.getMonth() + 1).padStart(2, "0"),
      String(date.getDate()).padStart(2, "0"),
    ].join("");

    const today = new Date(date.getFullYear(), date.getMonth(), date.getDate());
    const count = await this.constructor.countDocuments({ createdAt: { $gte: today } });
    this.orderNumber = `ADR-${dateStr}-${String(count + 1).padStart(3, "0")}`;
  }

  if (this.isModified("status")) {
    this.timeline.push({ status: this.status, timestamp: new Date() });
  }
  next();
});

orderSchema.index({ customer: 1, createdAt: -1 });
orderSchema.index({ designer: 1, status: 1, createdAt: -1 });
orderSchema.index({ orderNumber: 1 });

module.exports = mongoose.model("Order", orderSchema);
