const { query } = require('../config/database');

const findAll = async (options = {}) => {
  const { search, category, type, limit = 10, offset = 0 } = options;
  
  let sql = `
    SELECT b.*, GROUP_CONCAT(DISTINCT c.name) as categories
    FROM books b
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
  `;
  
  const params = [];
  const whereConditions = [];
  
  // Add search condition
  if (search) {
    whereConditions.push(`(b.title LIKE ? OR b.author LIKE ?)`);
    params.push(`%${search}%`, `%${search}%`);
  }
  
  // Add category filter
  if (category) {
    whereConditions.push(`c.name = ?`);
    params.push(category);
  }
  
  // Add type filter
  if (type) {
    whereConditions.push(`b.type = ?`);
    params.push(type);
  }
  
  // Combine where conditions
  if (whereConditions.length > 0) {
    sql += ` WHERE ${whereConditions.join(' AND ')}`;
  }
  
  sql += ` GROUP BY b.id`;
  sql += ` LIMIT ? OFFSET ?`;
  params.push(limit, offset);
  
  const books = await query(sql, params);
  
  // Convert categories string to array
  return books.map(book => ({
    ...book,
    categories: book.categories ? book.categories.split(',') : []
  }));
};

const findById = async (id) => {
  const sql = `
    SELECT b.*, GROUP_CONCAT(DISTINCT c.name) as categories
    FROM books b
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
    WHERE b.id = ?
    GROUP BY b.id
  `;
  
  const books = await query(sql, [id]);
  
  if (!books.length) return null;
  
  // Convert categories string to array
  return {
    ...books[0],
    categories: books[0].categories ? books[0].categories.split(',') : []
  };
};

const create = async (bookData, userId) => {
  const {
    title,
    description,
    author,
    price,
    type,
    cover,
    file_url,
    audio_url,
    sample_url,
    audio_sample_url,
    categories
  } = bookData;
  
  // Begin transaction
  const conn = await query('START TRANSACTION');
  
  try {
    // Insert book
    const bookSql = `
      INSERT INTO books (
        title, description, author, price, type, cover,
        file_url, audio_url, sample_url, audio_sample_url, user_id
      ) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
    `;
    
    const bookResult = await query(bookSql, [
      title, description, author, price, type, cover,
      file_url, audio_url, sample_url, audio_sample_url, userId
    ]);
    
    const bookId = bookResult.insertId;
    
    // Insert categories
    if (categories && categories.length) {
      // First find or create each category
      for (const categoryName of categories) {
        // Check if category exists
        let categoryId;
        const [existingCategory] = await query(
          'SELECT id FROM categories WHERE name = ?', 
          [categoryName]
        );
        
        if (existingCategory) {
          categoryId = existingCategory.id;
        } else {
          // Create new category
          const newCategory = await query(
            'INSERT INTO categories (name) VALUES (?)',
            [categoryName]
          );
          categoryId = newCategory.insertId;
        }
        
        // Link book to category
        await query(
          'INSERT INTO book_categories (book_id, category_id) VALUES (?, ?)',
          [bookId, categoryId]
        );
      }
    }
    
    await query('COMMIT');
    
    return await findById(bookId);
  } catch (error) {
    await query('ROLLBACK');
    throw error;
  }
};

const getBooksByAuthor = async (userId) => {
  const sql = `
    SELECT b.*, GROUP_CONCAT(DISTINCT c.name) as categories
    FROM books b
    LEFT JOIN book_categories bc ON b.id = bc.book_id
    LEFT JOIN categories c ON bc.category_id = c.id
    WHERE b.user_id = ?
    GROUP BY b.id
    ORDER BY b.created_at DESC
  `;
  
  const books = await query(sql, [userId]);
  
  // Convert categories string to array
  return books.map(book => ({
    ...book,
    categories: book.categories ? book.categories.split(',') : []
  }));
};

const updateBookById = async (id, bookData) => {
  const {
    title,
    description,
    author,
    price,
    type,
    cover,
    file_url,
    audio_url,
    sample_url,
    audio_sample_url,
  } = bookData;
  
  const sql = `
    UPDATE books
    SET title = ?, description = ?, author = ?, price = ?, type = ?, 
        cover = ?, file_url = ?, audio_url = ?, sample_url = ?, audio_sample_url = ?
    WHERE id = ?
  `;
  
  await query(sql, [
    title, description, author, price, type, 
    cover, file_url, audio_url, sample_url, audio_sample_url, id
  ]);
  
  return await findById(id);
};

module.exports = {
  findAll,
  findById,
  create,
  getBooksByAuthor,
  updateBookById
};