// server.js
const app = require('./index');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

// Use the PORT from environment (Render sets this automatically) or fallback.
const PORT = process.env.PORT || 5004;

// Connect to MongoDB
mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log('✅ MongoDB connected');

  // Start server — bind to 0.0.0.0 (required by Render) and the PORT
  app.listen(PORT, '0.0.0.0', () => {
    console.log(`🚀 Server running on port ${PORT}`);
  });
})
.catch(err => {
  console.error('❌ MongoDB connection failed:', err.message);
  // Exit process if DB connection fails
  process.exit(1);
});
