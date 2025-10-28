const mongoose = require("mongoose");

const orderSchema = new mongoose.Schema({
  userId: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "User",
    required: true,
  },
  products: [
    {
      productId: {
        type: mongoose.Schema.Types.ObjectId,
        ref: "Product",
      },
      title: String,
      price: Number,
      qty: Number,
      image: String,
    }
  ],
  amount: {
    type: Number,
    required: true,
  },
  paymentRef: {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Payment",
  },
  status: {
    type: String,
    enum: ["pending", "confirmed", "shipped", "cancelled"],
    default: "pending",
  },
}, { timestamps: true });

module.exports = mongoose.model("Order", orderSchema);
