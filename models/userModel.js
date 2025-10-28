const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  phoneNumber: { type: String, required: true, unique: true },
  isVerified: { type: Boolean, default: false },
  couponCode: { type: String, default: null },

  // Added profile fields:
  firstName: { type: String, default: "" },
  lastName: { type: String, default: "" },
  email: { type: String, default: "" },
  mobile: { type: String, default: "" },

  createdAt: { type: Date, default: Date.now }
});

module.exports = mongoose.model("User", userSchema);
