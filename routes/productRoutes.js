// productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, searchProducts } = require('../controllers/productController'); // Adicionado searchProducts
const auth = require('../middleware/authMiddleware'); // ✅ MANTENHA apenas uma vez

// Rotas protegidas para vendedores
router.post('/', auth.verifyToken, createProduct);
router.delete('/:id', auth.verifyToken, deleteProduct);

// Rota pública para listar todos os produtos
router.get('/', getProducts);

// Nova rota para buscar/filtrar produtos por nome, cidade e estado
router.get('/search', searchProducts); // Adicionado a nova rota de pesquisa

module.exports = router;
