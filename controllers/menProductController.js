const MenProduct = require('../models/menProductModel');
const fs = require('fs');
const path = require('path');

// GET all products
exports.getProducts = async (req, res) => {
  try {
    const products = await MenProduct.find();
    res.json(products);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// GET single product
exports.getProductById = async (req, res) => {
  try {
    const product = await MenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });
    res.json(product);
  } catch (err) {
    res.status(500).json({ error: err.message });
  }
};

// CREATE new product
exports.addProduct = async (req, res) => {
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

    const imagePath = req.file ? `/uploads/${req.file.filename}` : '';

    const newProduct = new MenProduct({
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

// UPDATE product
exports.updateProduct = async (req, res) => {
  try {
    const product = await MenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Remove old image if new one is uploaded
    if (req.file && product.image) {
      const oldPath = path.join(__dirname, '..', product.image);
      if (fs.existsSync(oldPath)) fs.unlinkSync(oldPath);
    }

    const updatedData = {
      ...req.body,
    };

    if (req.file) {
      updatedData.image = `/uploads/${req.file.filename}`;
    }

    const updated = await MenProduct.findByIdAndUpdate(req.params.id, updatedData, {
      new: true,
    });

    res.json(updated);
  } catch (err) {
    res.status(400).json({ error: err.message });
  }
};

// DELETE product
exports.deleteProduct = async (req, res) => {
  try {
    const product = await MenProduct.findById(req.params.id);
    if (!product) return res.status(404).json({ message: 'Product not found' });

    // Delete image from filesystem
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
