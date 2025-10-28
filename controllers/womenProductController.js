const WomenProduct = require('../models/womenProductModel');
const fs = require('fs');
const path = require('path');

// GET all women products
exports.getWomenProducts = async (req, res) => {
  try {
    const products = await WomenProduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single women product by ID
exports.getWomenProductById = async (req, res) => {
  try {
    const product = await WomenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new women product
exports.addWomenProduct = async (req, res) => {
  try {
    const {
      brand,
      title,
      price,
      onlineExclusive,
      productType,
      fabric,
      color,
      pattern,
      fit,
      size,
      description,
    } = req.body;

const imagePath = req.file ? `/uploads/women/${req.file.filename}` : '';

    const newProduct = new WomenProduct({
      brand,
      title,
      price,
      image: imagePath,
      onlineExclusive,
      productType,
      fabric,
      color,
      pattern,
      fit,
      size,
      description,
    });

    const saved = await newProduct.save();
    res.status(201).json(saved);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// UPDATE women product
exports.updateWomenProduct = async (req, res) => {
  try {
    const product = await WomenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove old image if new one uploaded
    if (req.file && product.image) {
      const oldPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      // Updated path here
      updatedData.image = `/uploads/women/${req.file.filename}`;
    }

    const updated = await WomenProduct.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE women product
exports.deleteWomenProduct = async (req, res) => {
  try {
    const product = await WomenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    if (product.image) {
      const filePath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(filePath)) fs.unlinkSync(filePath);
    }

    await product.deleteOne();

    res.json({ message: 'Product deleted successfully' });
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};
