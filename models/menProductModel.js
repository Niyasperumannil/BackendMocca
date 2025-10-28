const mongoose = require('mongoose');

const menProductSchema = new mongoose.Schema({
  brand: { type: String, required: true },
  title: { type: String, required: true },
  price: { type: Number, required: true },
  image: { type: String, required: true },
  onlineExclusive: { type: Boolean, default: false },
  productType: String,
  fabric: String,
  color: String,
  pattern: String,
  fit: String,
  size: String,
  description: String
}, { timestamps: true });

module.exports = mongoose.model('MenProduct', menProductSchema);
