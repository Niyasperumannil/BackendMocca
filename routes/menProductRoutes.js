const express = require('express');
const router = express.Router();
const upload = require('../middleware/uploadMiddleware');
const {
  getProducts,
  getProductById,
  addProduct,
  updateProduct,
  deleteProduct,
} = require('../controllers/menProductController');

// GET all men products
router.get('/', getProducts);

// GET product by ID
router.get('/:id', getProductById);

// POST create product with image upload
router.post('/', upload.single('image'), addProduct);

// PUT update product with image upload
router.put('/:id', upload.single('image'), updateProduct);

// DELETE product
router.delete('/:id', deleteProduct);

module.exports = router;
