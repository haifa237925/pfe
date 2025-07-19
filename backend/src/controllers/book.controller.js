const BookModel = require('../models/book.model');
const multer = require('multer');
const path = require('path');
const fs = require('fs');

// Configure storage
const storage = multer.diskStorage({
  destination: function (req, file, cb) {
    const fileType = getFileType(file.mimetype);
    const uploadDir = path.join(__dirname, `../../uploads/${fileType}`);
    
    // Ensure directory exists
    if (!fs.existsSync(uploadDir)) {
      fs.mkdirSync(uploadDir, { recursive: true });
    }
    
    cb(null, uploadDir);
  },
  filename: function (req, file, cb) {
    // Create unique filename
    const uniqueSuffix = Date.now() + '-' + Math.round(Math.random() * 1E9);
    const extension = path.extname(file.originalname);
    cb(null, uniqueSuffix + extension);
  }
});

// File type helper
const getFileType = (mimetype) => {
  if (mimetype.startsWith('image/')) return 'covers';
  if (mimetype === 'application/pdf' || mimetype === 'application/epub+zip') return 'books';
  if (mimetype.startsWith('audio/')) return 'audio';
  return 'other';
};

// File filter
const fileFilter = (req, file, cb) => {
  // Allowed file types
  const allowedTypes = {
    'image/jpeg': true,
    'image/png': true,
    'application/pdf': true,
    'application/epub+zip': true,
    'audio/mpeg': true,
    'audio/wav': true,
  };
  
  if (allowedTypes[file.mimetype]) {
    cb(null, true);
  } else {
    cb(new Error('Invalid file type. Only images, PDFs, ePubs, and audio files are allowed.'), false);
  }
};

const upload = multer({ 
  storage,
  fileFilter,
  limits: { fileSize: 50 * 1024 * 1024 } // 50MB
});

// Get all books with optional filtering
const getBooks = async (req, res) => {
  try {
    const { search, category, type, page = 1, limit = 10 } = req.query;
    
    const offset = (page - 1) * limit;
    
    const books = await BookModel.findAll({
      search,
      category,
      type,
      limit: parseInt(limit),
      offset: parseInt(offset)
    });
    
    res.json({ books });
  } catch (error) {
    console.error('Error fetching books:', error);
    res.status(500).json({ message: 'Error fetching books' });
  }
};

// Get a book by ID
const getBookById = async (req, res) => {
  try {
    const { id } = req.params;
    const book = await BookModel.findById(id);
    
    if (!book) {
      return res.status(404).json({ message: 'Book not found' });
    }
    
    res.json({ book });
  } catch (error) {
    console.error('Error fetching book:', error);
    res.status(500).json({ message: 'Error fetching book' });
  }
};

// Create a new book
const createBook = async (req, res) => {
  try {
    // Access uploaded files from req.files
    const { title, description, author, price, type, categories } = req.body;
    
    // Validate input
    if (!title || !author || !price || !type) {
      return res.status(400).json({ message: 'Required fields missing' });
    }
    
    // Convert categories string to array if needed
    const categoriesArray = typeof categories === 'string' 
      ? JSON.parse(categories) 
      : categories || [];
    
    // Get file paths
    const coverPath = req.files.cover?.[0]?.path.replace('\\', '/');
    const filePath = req.files.book?.[0]?.path.replace('\\', '/');
    const audioPath = req.files.audio?.[0]?.path.replace('\\', '/');
    const samplePath = req.files.sample?.[0]?.path.replace('\\', '/');
    const audioSamplePath = req.files.audioSample?.[0]?.path.replace('\\', '/');
    
    const newBook = await BookModel.create({
      title,
      description,
      author,
      price: parseFloat(price),
      type,
      cover: coverPath,
      file_url: filePath,
      audio_url: audioPath,
      sample_url: samplePath,
      audio_sample_url: audioSamplePath,
      categories: categoriesArray
    }, req.user.id);
    
    res.status(201).json({ 
      message: 'Book created successfully', 
      book: newBook 
    });
  } catch (error) {
    console.error('Error creating book:', error);
    res.status(500).json({ message: 'Error creating book' });
  }
};

// Get all books by the current author
const getAuthorBooks = async (req, res) => {
  try {
    const books = await BookModel.getBooksByAuthor(req.user.id);
    res.json({ books });
  } catch (error) {
    console.error('Error fetching author books:', error);
    res.status(500).json({ message: 'Error fetching author books' });
  }
};

module.exports = {
  getBooks,
  getBookById,
  createBook,
  getAuthorBooks,
  uploadMiddleware: upload
};