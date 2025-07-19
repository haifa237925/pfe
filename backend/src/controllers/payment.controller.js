const { query } = require('../config/database');
const BookModel = require('../models/book.model');

// Create a mock payment intent (in a real app, this would integrate with Stripe or another payment processor)
const createPaymentIntent = async (req, res) => {
  try {
    const { bookId } = req.body;
    
    if (!bookId) {
      return res.status(400).json({ message: 'Book ID is required' });
    }
    
    // Get book details
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Check if user already purchased this book
    const existingPurchase = await query(
      'SELECT id FROM purchases WHERE user_id = ? AND book_id = ?',
      [req.user.id, bookId]
    );
    
    if (existingPurchase.length > 0) {
      return res.status(400).json({ message: 'You already own this book' });
    }
    
    // Mock payment intent
    const paymentIntent = {
      id: `pi_${Date.now()}`,
      amount: Math.round(book.price * 100), // in cents
      currency: 'usd',
      book_id: bookId,
      created: Date.now() / 1000
    };
    
    res.json({ paymentIntent });
  } catch (error) {
    console.error('Error creating payment intent:', error);
    res.status(500).json({ message: 'Error creating payment intent' });
  }
};

// Complete purchase
const completePurchase = async (req, res) => {
  try {
    const { paymentIntentId, bookId, paymentMethod } = req.body;
    
    if (!paymentIntentId || !bookId || !paymentMethod) {
      return res.status(400).json({ message: 'Required information missing' });
    }
    
    // Get book details
    const book = await BookModel.findById(bookId);
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    // Insert purchase record
    const result = await query(
      'INSERT INTO purchases (user_id, book_id, price, payment_method, payment_intent_id) VALUES (?, ?, ?, ?, ?)',
      [req.user.id, bookId, book.price, paymentMethod, paymentIntentId]
    );
    
    res.status(201).json({
      message: 'Purchase completed successfully',
      purchaseId: result.insertId
    });
  } catch (error) {
    console.error('Error completing purchase:', error);
    res.status(500).json({ message: 'Error completing purchase' });
  }
};

// Get payment history
const getPaymentHistory = async (req, res) => {
  try {
    const userId = req.user.id;
    
    const payments = await query(
      `SELECT p.id, p.book_id, b.title, b.author, p.price, p.payment_method, 
              p.purchase_date, b.cover, b.type
       FROM purchases p
       JOIN books b ON p.book_id = b.id
       WHERE p.user_id = ?
       ORDER BY p.purchase_date DESC`,
      [userId]
    );
    
    res.json({ payments });
  } catch (error) {
    console.error('Error fetching payment history:', error);
    res.status(500).json({ message: 'Error fetching payment history' });
  }
};

module.exports = {
  createPaymentIntent,
  completePurchase,
  getPaymentHistory
};