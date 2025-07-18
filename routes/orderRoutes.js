const express = require('express');
const router = express.Router();
const { placeOrder, getMyOrders, getSellerOrders, rateProduct } = require('../controllers/orderController');
const auth = require('../middleware/authMiddleware');

// Cliente realiza compra
router.post('/', auth.verifyToken, placeOrder);

// Cliente vê seus pedidos
router.get('/me', auth.verifyToken, getMyOrders);

// Vendedor vê seus pedidos recebidos
router.get('/seller', auth.verifyToken, getSellerOrders);

// Cliente avalia produto
router.post('/avaliar', auth.verifyToken, rateProduct);

module.exports = router;

const express = require('express');
const orderController = require('../controllers/orderController');
const { verifyToken } = require('../middlewares/authMiddleware');

router.post('/', verifyToken, orderController.placeOrder); // Protegida por token
router.get('/me', verifyToken, orderController.getMyOrders); // Protegida por token
router.get('/seller', verifyToken, orderController.getSellerOrders); // Protegida por token
router.post('/avaliar', verifyToken, orderController.rateProduct); // Protegida por token

module.exports = router;