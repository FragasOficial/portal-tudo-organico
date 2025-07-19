const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware'); // ✅ MANTENHA apenas uma vez

// Rotas protegidas para vendedores
router.post('/', auth.verifyToken, createProduct);
router.delete('/:id', auth.verifyToken, deleteProduct);

// Rota pública para listar
router.get('/', getProducts);

module.exports = router;
