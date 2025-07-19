const express = require('express');
const router = express.Router();
const userController = require('../controllers/user.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Get user purchases
router.get('/purchases', authenticateToken, userController.getUserPurchases);

// Get user reading progress
router.get('/reading-progress', authenticateToken, userController.getUserReadingProgress);

// Update user reading progress
router.post('/reading-progress', authenticateToken, userController.updateReadingProgress);

// Admin routes
router.get(
  '/all',
  authenticateToken,
  authorizeRole(['admin']),
  userController.getAllUsers
);

router.put(
  '/:id',
  authenticateToken,
  authorizeRole(['admin']),
  userController.updateUser
);

module.exports = router;