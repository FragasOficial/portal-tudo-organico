const express = require('express');
const router = express.Router();
const authController = require('../controllers/authController');
const authMiddleware = require('../middleware/authMiddleware'); // Assuming authMiddleware.js is in a 'middleware' folder, adjust path if needed.

// Public routes for authentication
router.post('/register', authController.register);
router.post('/login', authController.login);

// Example of a protected route using middleware (optional, add as needed)
// router.get('/profile', authMiddleware.verifyToken, authController.getProfile);

module.exports = router;