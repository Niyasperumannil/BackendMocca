const express = require("express");
const router = express.Router();

const authRoutes = require("./authRoutes");            // if you have auth
const menProductRoutes = require("./menProductRoutes");
const womenProductRoutes = require("./womenProductRoutes");
const paymentRoutes = require("./paymentRoutes");
const orderRoutes = require("./orderRoutes");

router.use("/auth", authRoutes);
router.use("/menproducts", menProductRoutes);
router.use("/womenproducts", womenProductRoutes);
router.use("/payment", paymentRoutes);
router.use("/orders", orderRoutes);

module.exports = router;
