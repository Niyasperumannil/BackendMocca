const crypto = require("crypto");
const Razorpay = require("razorpay");
const Payment = require("../models/paymentModel");
const Order = require("../models/orderModel");

// initialize instance if not using paymentMiddleware
const razorpay = new Razorpay({
  key_id: process.env.RAZORPAY_KEY_ID,
  key_secret: process.env.RAZORPAY_KEY_SECRET,
});

exports.createOrder = async (req, res) => {
  try {
    const { amount, currency } = req.body;
    if (!amount) {
      return res.status(400).json({ success: false, message: "Amount is required" });
    }

    const options = {
      amount: amount * 100, // convert to paisa
      currency: currency || "INR",
      receipt: `receipt_${Date.now()}`,
      payment_capture: 1,
    };

    const order = await razorpay.orders.create(options);

    return res.status(200).json({
      success: true,
      order: {
        id: order.id,
        amount: order.amount,
        currency: order.currency,
      },
    });
  } catch (error) {
    console.error("Error creating Razorpay order:", error);
    return res.status(500).json({ success: false, message: "Order creation failed" });
  }
};

exports.verifyPayment = async (req, res) => {
  try {
    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      cart,
      amount,
    } = req.body;

    if (!razorpay_order_id || !razorpay_payment_id || !razorpay_signature) {
      return res.status(400).json({ success: false, message: "Missing payment details" });
    }

    const expectedSignature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    if (expectedSignature !== razorpay_signature) {
      console.error("Signature mismatch:", { expectedSignature, razorpay_signature });
      return res.status(400).json({ success: false, message: "Invalid signature" });
    }

    const paymentDoc = await Payment.create({
      userId: req.user,
      orderId: razorpay_order_id,
      paymentId: razorpay_payment_id,
      signature: razorpay_signature,
      amount,
      currency: "INR",
      status: "paid",
    });

    const orderDoc = await Order.create({
      userId: req.user,
      products: cart.map(item => ({
        productId: item._id,
        title: item.title,
        price: item.price,
        qty: item.qty,
        image: item.image,
      })),
      amount,
      paymentRef: paymentDoc._id,
      status: "confirmed",
    });

    return res.status(200).json({ success: true, payment: paymentDoc, order: orderDoc });
  } catch (error) {
    console.error("Error verifying payment:", error);
    return res.status(500).json({ success: false, message: "Payment verification failed" });
  }
};
