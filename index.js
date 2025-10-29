const express = require('express');
const path = require('path');
const cors = require('cors');
const routes = require('./routes');
require('dotenv').config(); // ✅ Load env variables (useful for Razorpay keys, Mongo URI, etc.)

const app = express();

// ✅ Parse JSON and URL-encoded bodies
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// ✅ Configure CORS
const allowedOrigins = [
  "http://localhost:5173",
  "http://localhost:3000",
  "https://mocca-store.vercel.app", // ✅ Added your Vercel frontend
];
app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes(origin)) {
        callback(null, true);
      } else {
        callback(new Error(`CORS policy does not allow access from origin ${origin}`));
      }
    },
    credentials: true,
  })
);

// ✅ Serve static files from /uploads
app.use('/uploads', express.static(path.join(__dirname, 'uploads')));

// ✅ All API routes
app.use('/api', routes);

// ✅ Root route
app.get('/', (req, res) => {
  res.send('🧾 Men Product API is running');
});

// ✅ Export app for server.js
module.exports = app;
