const express = require('express');
const router = express.Router();
const bookController = require('../controllers/book.controller');
const { authenticateToken, authorizeRole } = require('../middleware/auth.middleware');

// Public routes
router.get('/', bookController.getBooks);
router.get('/:id', bookController.getBookById);

// Protected routes
router.post(
  '/',
  authenticateToken,
  authorizeRole(['writer', 'admin']),
  bookController.uploadMiddleware.fields([
    { name: 'cover', maxCount: 1 },
    { name: 'book', maxCount: 1 },
    { name: 'audio', maxCount: 1 },
    { name: 'sample', maxCount: 1 },
    { name: 'audioSample', maxCount: 1 }
  ]),
  bookController.createBook
);

router.get(
  '/author/me',
  authenticateToken,
  authorizeRole(['writer']),
  bookController.getAuthorBooks
);

module.exports = router;