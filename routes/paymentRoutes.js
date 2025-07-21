const express = require('express');
const router = express.Router();
const paymentController = require('../controllers/paymentController');
const auth = require('../middleware/authMiddleware');

// Rota para processar o pagamento
// ✅ Alterado de '/' para '/process' para corresponder ao URL do log
router.post('/process', auth.verifyToken, paymentController.processPayment);

module.exports = router;