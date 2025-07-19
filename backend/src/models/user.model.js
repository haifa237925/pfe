const { query } = require('../config/database');
const bcrypt = require('bcryptjs');

const findByEmail = async (email) => {
  const sql = `SELECT * FROM users WHERE email = ?`;
  const users = await query(sql, [email]);
  return users.length ? users[0] : null;
};

const findById = async (id) => {
  const sql = `SELECT id, email, name, role, created_at FROM users WHERE id = ?`;
  const users = await query(sql, [id]);
  return users.length ? users[0] : null;
};

const create = async (userData) => {
  const { name, email, password, role = 'reader' } = userData;
  
  // Hash password
  const salt = await bcrypt.genSalt(10);
  const hashedPassword = await bcrypt.hash(password, salt);
  
  const sql = `
    INSERT INTO users (name, email, password, role)
    VALUES (?, ?, ?, ?)
  `;
  
  const result = await query(sql, [name, email, hashedPassword, role]);
  
  return { id: result.insertId, name, email, role };
};

const comparePassword = async (plainPassword, hashedPassword) => {
  return await bcrypt.compare(plainPassword, hashedPassword);
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

const getUserReadingProgress = async (userId) => {
  const sql = `
    SELECT rp.book_id, rp.last_position, rp.last_updated, rp.completion_percentage,
           b.title, b.author, b.cover, b.type
    FROM reading_progress rp
    JOIN books b ON rp.book_id = b.id
    WHERE rp.user_id = ?
    ORDER BY rp.last_updated DESC
  `;
  
  return await query(sql, [userId]);
};

module.exports = {
  findByEmail,
  findById,
  create,
  comparePassword,
  getUserPurchases,
  getUserReadingProgress
};