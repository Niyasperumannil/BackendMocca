const express = require("express");
const path = require("path");
const cors = require("cors");
const routes = require("./routes");
require("dotenv").config(); // ✅ Load env variables

const app = express();

// ✅ Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mocca-store.vercel.app" // ✅ removed trailing slash
];

app.use(
  cors({
    origin: (origin, callback) => {
      console.log("🛰️ Incoming request origin:", origin); // ✅ Log the origin for debugging
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        console.error(`🚫 Blocked by CORS: ${origin}`);
        callback(new Error(`CORS policy does not allow access from origin ${origin}`));
      }
    },
    credentials: true,
  })
);

// ✅ Serve static files from /uploads
app.use("/uploads", express.static(path.join(__dirname, "uploads")));

// ✅ All API routes
app.use("/api", routes);

// ✅ Root route
app.get("/", (req, res) => {
  res.send("🧾 Mocca Backend API is running successfully 🚀");
});

// ✅ Handle 404 for unknown routes
app.use((req, res) => {
  res.status(404).json({ message: "Route not found" });
});

// ✅ Global Error Handler (for CORS and other errors)
app.use((err, req, res, next) => {
  console.error("🔥 Error:", err.message);
  res.status(500).json({ message: err.message || "Internal Server Error" });
});

// ✅ Export app for server.js
module.exports = app;
