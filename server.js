const app = require('./index');
const mongoose = require('mongoose');
const dotenv = require('dotenv');

dotenv.config();

const PORT = process.env.PORT || 5004;

mongoose.connect(process.env.MONGO_URI, {
  useNewUrlParser: true,
  useUnifiedTopology: true,
})
.then(() => {
  console.log(' MongoDB connected');
  app.listen(PORT, () => {
    console.log(` Server running on http://localhost:${PORT}`);
  });
})
.catch(err => {
  console.error(' MongoDB connection failed:', err.message);
  process.exit(1);
});
