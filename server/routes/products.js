const express = require('express');
const router = express.Router();
const { getProducts, getProductsByCategory, getProductById, createProduct, updateProduct, deleteProduct } = require('../controllers/productController');

router.get('/', getProducts);
router.get('/category/:category', getProductsByCategory);
router.get('/:id', getProductById);
router.post('/', createProduct);
router.put('/:id', updateProduct);
router.delete('/:id', deleteProduct);

module.exports = router;
