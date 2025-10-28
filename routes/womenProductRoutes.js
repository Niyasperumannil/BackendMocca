const express = require('express');
const router = express.Router();

const uploadWomen = require('../middleware/uploadWomenMiddleware');
const {
  getWomenProducts,
  getWomenProductById,
  addWomenProduct,
  updateWomenProduct,
  deleteWomenProduct,
} = require('../controllers/womenProductController');

// GET all women products
router.get('/', getWomenProducts);

// GET single women product by ID
router.get('/:id', getWomenProductById);

// POST create new women product with image upload
router.post('/', uploadWomen.single('image'), addWomenProduct);

// PUT update women product by ID with optional image upload
router.put('/:id', uploadWomen.single('image'), updateWomenProduct);

// DELETE women product by ID
router.delete('/:id', deleteWomenProduct);

module.exports = router;
