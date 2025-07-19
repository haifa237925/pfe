const express = require('express');
const router = express.Router();
const authController = require('../controllers/auth.controller');
const { authenticateToken } = require('../middleware/auth.middleware');

// Register new user
router.post('/register', authController.register);

// Login
router.post('/login', authController.login);

// Get profile
router.get('/profile', authenticateToken, authController.getProfile);

module.exports = router;