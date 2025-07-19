const { query } = require('../config/database');

const createPurchase = async (purchaseData) => {
  const { userId, bookId, price, paymentMethod, paymentIntentId } = purchaseData;
  
  const sql = `
    INSERT INTO purchases (user_id, book_id, price, payment_method, payment_intent_id)
    VALUES (?, ?, ?, ?, ?)
  `;
  
  const result = await query(sql, [userId, bookId, price, paymentMethod, paymentIntentId]);
  return { id: result.insertId, ...purchaseData };
};

const getUserPurchases = async (userId) => {
  const sql = `
    SELECT p.id, p.book_id, p.purchase_date, p.price, p.payment_method,
           b.title, b.author, b.cover, b.type
    FROM purchases p
    JOIN books b ON p.book_id = b.id
    WHERE p.user_id = ?
    ORDER BY p.purchase_date DESC
  `;
  
  return await query(sql, [userId]);
};

const checkUserOwnsBook = async (userId, bookId) => {
  const sql = `
    SELECT id FROM purchases
    WHERE user_id = ? AND book_id = ?
  `;
  
  const results = await query(sql, [userId, bookId]);
  return results.length > 0;
};

const getBookSales = async (bookId) => {
  const sql = `
    SELECT COUNT(*) as total_sales, SUM(price) as total_revenue
    FROM purchases
    WHERE book_id = ?
  `;
  
  const results = await query(sql, [bookId]);
  return results[0];
};

const getAuthorSales = async (authorId) => {
  const sql = `
    SELECT b.id, b.title, COUNT(p.id) as sales_count, SUM(p.price) as revenue
    FROM books b
    LEFT JOIN purchases p ON b.id = p.book_id
    WHERE b.user_id = ?
    GROUP BY b.id
    ORDER BY revenue DESC
  `;
  
  return await query(sql, [authorId]);
};

module.exports = {
  createPurchase,
  getUserPurchases,
  checkUserOwnsBook,
  getBookSales,
  getAuthorSales
};