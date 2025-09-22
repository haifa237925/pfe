const BookModel = require('../models/bookModel');

class BookService {
  // Transformer les données de Supabase en format frontend
  static transformBookData(book) {
    return {
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover_image_url,
      price: book.price,
      type: book.book_type === 'audiobook' ? 'audio' : book.book_type,
      categories: book.categories?.map(cat => cat.category_id?.name) || [],
      description: book.description,
      publishedDate: book.publication_date,
      rating: book.reviews?.[0]?.avg || 0,
      reviewCount: book.reviews?.[0]?.count || 0
    };
  }

  // Récupérer les livres avec filtres
  static async getBooks(filters = {}) {
    try {
      const result = await BookModel.findAll(filters);
      
      // Transformer les données
      const transformedBooks = result.books.map(BookService.transformBookData);
      
      return {
        books: transformedBooks,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNext: result.currentPage < result.totalPages,
          hasPrev: result.currentPage > 1
        }
      };
    } catch (error) {
      throw new Error(`Failed to fetch books: ${error.message}`);
    }
  }

  // Récupérer un livre par ID
  static async getBookById(id) {
    try {
      const book = await BookModel.findById(id);
      
      if (!book) {
        throw new Error('Book not found');
      }

      // Transformer les données pour le détail
      return {
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover_image_url,
        price: book.price,
        type: book.book_type === 'audiobook' ? 'audio' : book.book_type,
        categories: book.categories?.map(cat => ({
          id: cat.category_id.id,
          name: cat.category_id.name
        })) || [],
        description: book.description,
        publishedDate: book.publication_date,
        language: book.language,
        isbn: book.isbn,
        totalPages: book.total_pages,
        totalDuration: book.total_duration,
        authorInfo: {
          name: book.user?.full_name,
          avatar: book.user?.avatar_url,
          bio: book.user?.bio
        },
        reviews: book.reviews || [],
        files: book.files || []
      };
    } catch (error) {
      throw new Error(`Failed to fetch book: ${error.message}`);
    }
  }

  // Recherche avancée
  static async searchBooks(filters) {
    try {
      const result = await BookModel.searchAdvanced(filters);
      
      const transformedBooks = result.books.map(BookService.transformBookData);
      
      return {
        books: transformedBooks,
        pagination: {
          totalCount: result.totalCount,
          totalPages: result.totalPages,
          currentPage: result.currentPage,
          hasNext: result.currentPage < result.totalPages,
          hasPrev: result.currentPage > 1
        }
      };
    } catch (error) {
      throw new Error(`Search failed: ${error.message}`);
    }
  }

  // Récupérer les catégories
  static async getCategories() {
    try {
      return await BookModel.getCategories();
    } catch (error) {
      throw new Error(`Failed to fetch categories: ${error.message}`);
    }
  }
}

module.exports = BookService;