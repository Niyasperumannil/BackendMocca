const express = require("express");
const router = express.Router();
const {
  sendOtp,
  verifyOtp,
  getUserProfile,
  updateUserProfile
} = require("../controllers/authController");
const authMiddleware = require("../middleware/authMiddleware");

router.post("/send-otp", sendOtp);
router.post("/verify-otp", verifyOtp);

// Protected profile routes
router.get("/me", authMiddleware, getUserProfile);
router.put("/update", authMiddleware, updateUserProfile);

module.exports = router;
