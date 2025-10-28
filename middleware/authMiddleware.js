const jwt = require("jsonwebtoken");
require("dotenv").config();
const User = require("../models/userModel"); // adjust path if needed

const authMiddleware = async (req, res, next) => {
  try {
    const authHeader = req.header("Authorization");
    const token = authHeader?.replace("Bearer ", "");

    if (!token) {
      return res.status(401).json({ success: false, message: "Access denied. No token provided." });
    }

    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    // `decoded` may contain e.g. { id: ..., iat: ..., exp: ... }
    req.user = decoded.id;  // attach user ID
    // optional: you can load user from DB
    next();
  } catch (err) {
    console.error("Auth Middleware Error:", err);
    return res.status(401).json({ success: false, message: "Invalid token" });
  }
};

module.exports = authMiddleware;
