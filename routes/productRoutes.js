const express = require('express');
const router = express.Router();
const { getProducts, createProduct, deleteProduct } = require('../controllers/productController');
const auth = require('../middleware/authMiddleware');

// Rotas protegidas para vendedores
router.post('/', auth.verifyToken, createProduct);
router.delete('/:id', auth.verifyToken, deleteProduct);

// Rota pública para listar
router.get('/', getProducts);

module.exports = router;
const { verifyToken } = require('../middlewares/authMiddleware'); // Exemplo de caminho
router.post('/products', verifyToken, productController.createProduct);
router.delete('/products/:id', verifyToken, productController.deleteProduct);
router.post('/orders', verifyToken, orderController.placeOrder);
router.get('/orders/me', verifyToken, orderController.getMyOrders);
router.get('/orders/seller', verifyToken, orderController.getSellerOrders);
router.post('/orders/avaliar', verifyToken, orderController.rateProduct);

const express = require('express');
const authController = require('../controllers/authController'); // Supondo que 'controllers' é a pasta dos controladores

router.post('/register', authController.register);
router.post('/login', authController.login);

module.exports = router;