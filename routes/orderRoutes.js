const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getSellerOrders, rateProduct } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware'); // Padronizado para 'middleware'

// Cliente realiza compra
router.post('/', auth.verifyToken, placeOrder);

// Cliente vê seus pedidos
router.get('/me', auth.verifyToken, getMyOrders);

// Vendedor vê seus pedidos recebidos
router.get('/seller', auth.verifyToken, getSellerOrders);

// Cliente avalia produto
router.post('/avaliar', auth.verifyToken, rateProduct);

module.exports = router;

// routes/orderRoutes.js
const express = require('express');
const { placeOrder, getMyOrders, getSellerOrders, rateProduct } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// ... other order routes

router.get('/seller', auth.verifyToken, getSellerOrders); // Protegida para vendedores

// ...
module.exports = router;

const auth = require('../middleware/authMiddleware');
