// productRoutes.js
const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct, searchProducts, getProductById, updateProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// Rotas protegidas para vendedores
router.post('/', auth.verifyToken, createProduct);
router.delete('/:id', auth.verifyToken, deleteProduct);
router.put('/:id', auth.verifyToken, updateProduct);

// Rota pública para listar todos os produtos
router.get('/', getProducts);

// ✅ IMPORTANTE: A rota de busca/filtro deve vir ANTES da rota de ID dinâmico
router.get('/search', searchProducts); // Adicionado a nova rota de pesquisa

// Rota para buscar um produto por ID (mais genérica, deve vir depois das específicas)
router.get('/:id', getProductById);

module.exports = router;
