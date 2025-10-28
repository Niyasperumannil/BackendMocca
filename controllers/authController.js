require("dotenv").config();
const User = require("../models/userModel");
const jwt = require("jsonwebtoken");
const twilio = require("twilio");

const client = twilio(process.env.TWILIO_ACCOUNT_SID, process.env.TWILIO_AUTH_TOKEN);

// Send OTP
exports.sendOtp = async (req, res) => {
  try {
    const { phoneNumber } = req.body;
    if (!phoneNumber) {
      return res.status(400).json({ message: "Phone number is required" });
    }

    const verification = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verifications.create({ to: phoneNumber, channel: "sms" });

    res.status(200).json({ message: "OTP sent successfully", sid: verification.sid });
  } catch (error) {
    console.error("Send OTP Error:", error.message);

    if (error.code === 60200) {
      return res.status(400).json({
        message:
          "Phone number not verified in Twilio. Please verify it first in Twilio console.",
        instructions:
          "Add number to Twilio Verified Caller IDs: https://www.twilio.com/console/phone-numbers/verified",
      });
    }

    res.status(500).json({ message: "Failed to send OTP", error: error.message });
  }
};

// Verify OTP and login/register user
exports.verifyOtp = async (req, res) => {
  try {
    const { phoneNumber, code } = req.body;

    const verificationCheck = await client.verify
      .services(process.env.TWILIO_SERVICE_SID)
      .verificationChecks.create({ to: phoneNumber, code });

    if (verificationCheck.status !== "approved") {
      return res.status(400).json({ message: "Invalid OTP" });
    }

    let user = await User.findOne({ phoneNumber });

    if (!user) {
      user = new User({
        phoneNumber,
        isVerified: true,
        couponCode: "WELCOME25-" + Math.random().toString(36).substring(2, 8).toUpperCase(),
      });
      await user.save();
    } else {
      user.isVerified = true;

      if (!user.couponCode) {
        user.couponCode =
          "WELCOME25-" + Math.random().toString(36).substring(2, 8).toUpperCase();
      }

      await user.save();
    }

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });

    res.status(200).json({
      message: "OTP verified successfully",
      token,
      user: {
        phoneNumber: user.phoneNumber,
        couponCode: user.couponCode,
        discount: "25% on first order"
      },
    });
  } catch (error) {
    console.error("Verify OTP Error:", error.message);
    res.status(500).json({ message: "OTP verification failed", error: error.message });
  }
};

// Get user profile
exports.getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    res.status(200).json({
      phoneNumber: user.phoneNumber,
      couponCode: user.couponCode,
      isVerified: user.isVerified,
      firstName: user.firstName,
      lastName: user.lastName,
      email: user.email,
      mobile: user.mobile
    });
  } catch (error) {
    res.status(500).json({ message: "Failed to fetch user", error: error.message });
  }
};

// Update/save user profile
exports.updateUserProfile = async (req, res) => {
  try {
    const { firstName, lastName, email, mobile } = req.body;

    const user = await User.findById(req.user);
    if (!user) return res.status(404).json({ message: "User not found" });

    if (firstName !== undefined) user.firstName = firstName;
    if (lastName !== undefined) user.lastName = lastName;
    if (email !== undefined) user.email = email;
    if (mobile !== undefined) user.mobile = mobile;

    await user.save();

    res.status(200).json({
      message: "Profile updated successfully",
      user: {
        phoneNumber: user.phoneNumber,
        couponCode: user.couponCode,
        isVerified: user.isVerified,
        firstName: user.firstName,
        lastName: user.lastName,
        email: user.email,
        mobile: user.mobile
      }
    });
  } catch (error) {
    console.error("Update Profile Error:", error.message);
    res.status(500).json({ message: "Failed to update profile", error: error.message });
  }
};
