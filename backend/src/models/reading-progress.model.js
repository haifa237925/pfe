const { query } = require('../config/database');

const getProgressByBookAndUser = async (userId, bookId) => {
  const sql = `
    SELECT *
    FROM reading_progress
    WHERE user_id = ? AND book_id = ?
  `;
  
  const results = await query(sql, [userId, bookId]);
  return results.length ? results[0] : null;
};

const updateProgress = async (progressData) => {
  const { userId, bookId, lastPosition, completionPercentage } = progressData;
  
  // Check if a record already exists
  const existingProgress = await getProgressByBookAndUser(userId, bookId);
  
  if (existingProgress) {
    // Update existing record
    const sql = `
      UPDATE reading_progress
      SET last_position = ?, 
          completion_percentage = ?,
          last_updated = NOW()
      WHERE user_id = ? AND book_id = ?
    `;
    
    return await query(sql, [lastPosition, completionPercentage, userId, bookId]);
  } else {
    // Insert new record
    const sql = `
      INSERT INTO reading_progress (user_id, book_id, last_position, completion_percentage)
      VALUES (?, ?, ?, ?)
    `;
    
    return await query(sql, [userId, bookId, lastPosition, completionPercentage]);
  }
};

module.exports = {
  getProgressByBookAndUser,
  updateProgress
};