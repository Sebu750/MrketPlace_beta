const mongoose = require("mongoose");

const addressItemSchema = new mongoose.Schema(
  {
    id: { type: String }, // frontend-generated id
    name: { type: String, required: [true, "Recipient name is required"] },
    phone: { type: String },
    address: { type: String, required: [true, "Street address is required"] },
    city: { type: String, required: [true, "City is required"] },
    postalCode: { type: String },
    country: { type: String, default: "Pakistan" },
    isDefault: { type: Boolean, default: false },
  },
  { _id: true, timestamps: true }
);

const addressBookSchema = new mongoose.Schema(
  {
    user: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true, unique: true },
    addresses: [addressItemSchema],
  },
  { timestamps: true }
);

module.exports = mongoose.model("AddressBook", addressBookSchema);
