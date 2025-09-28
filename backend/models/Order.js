const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema(
  {
    userId: { type: mongoose.Schema.Types.ObjectId, ref: "User", required: true },
    products: [
      {
        productId: { type: mongoose.Schema.Types.ObjectId, ref: "Product", required: true },
        quantity: { type: Number, required: true },
        price: { type: Number, required: true },
        category: { type: String },
      },
    ],
    address: { type: String, required: true },
    phone: { type: String, required: true },
    paymentMethod: { type: String, required: true },
    totalAmount: { type: Number, required: true },
    status: {
      type: String,
      enum: ["pending", "processing", "picked up", "delivered", "cancelled"],
      default: "pending",
    },
    assignedTo: { type: mongoose.Schema.Types.ObjectId, ref: "User", default: null },
    referralBy: {
  type: String,
  default: null
},
  },
  { timestamps: true }
);

module.exports = mongoose.model("Order", orderSchema);
