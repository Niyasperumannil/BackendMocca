const Order = require("../models/orderModel");

exports.getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({ userId: req.user })
                              .populate("paymentRef", "-signature -__v")
                              .sort({ createdAt: -1 });
    return res.status(200).json({ success: true, orders });
  } catch (error) {
    console.error("Error fetching user orders:", error);
    return res.status(500).json({ success: false, message: "Could not fetch orders" });
  }
};
