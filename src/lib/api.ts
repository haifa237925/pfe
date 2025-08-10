import { supabase } from './supabase';
import { BookType } from '../types/Book';

// Types pour les API calls
export interface ApiResponse<T> {
  data: T | null;
  error: string | null;
}

// Books API
export const booksApi = {
  // Récupérer tous les livres avec filtres
  async getBooks(filters?: {
    search?: string;
    category?: string;
    type?: string;
    limit?: number;
    offset?: number;
  }): Promise<ApiResponse<BookType[]>> {
    try {
      let query = supabase
        .from('books')
        .select(`
          *,
          book_categories!inner(
            categories(name)
          )
        `);

      // Appliquer les filtres
      if (filters?.search) {
        query = query.or(`title.ilike.%${filters.search}%,author.ilike.%${filters.search}%`);
      }

      if (filters?.type && filters.type !== 'All') {
        const typeMap: { [key: string]: string } = {
          'E-Book': 'ebook',
          'Audio Book': 'audio',
          'Both': 'both'
        };
        query = query.eq('type', typeMap[filters.type] || filters.type);
      }

      if (filters?.limit) {
        query = query.limit(filters.limit);
      }

      if (filters?.offset) {
        query = query.range(filters.offset, filters.offset + (filters.limit || 10) - 1);
      }

      const { data, error } = await query;

      if (error) {
        console.error('Error fetching books:', error);
        return { data: null, error: error.message };
      }

      // Transformer les données pour correspondre au type BookType
      const books: BookType[] = data?.map(book => ({
        id: book.id,
        title: book.title,
        author: book.author,
        cover: book.cover || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: parseFloat(book.price),
        type: book.type,
        categories: book.book_categories?.map((bc: any) => bc.categories.name) || [],
        description: book.description || '',
        publishedDate: book.created_at,
        fileUrl: book.file_url,
        audioUrl: book.audio_url,
        sampleUrl: book.sample_url,
        audioSampleUrl: book.audio_sample_url
      })) || [];

      return { data: books, error: null };
    } catch (err) {
      console.error('API Error:', err);
      return { data: null, error: 'Une erreur est survenue lors de la récupération des livres' };
    }
  },

  // Récupérer un livre par ID
  async getBookById(id: string): Promise<ApiResponse<BookType>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .select(`
          *,
          book_categories(
            categories(name)
          )
        `)
        .eq('id', id)
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      const book: BookType = {
        id: data.id,
        title: data.title,
        author: data.author,
        cover: data.cover || 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
        price: parseFloat(data.price),
        type: data.type,
        categories: data.book_categories?.map((bc: any) => bc.categories.name) || [],
        description: data.description || '',
        publishedDate: data.created_at,
        fileUrl: data.file_url,
        audioUrl: data.audio_url,
        sampleUrl: data.sample_url,
        audioSampleUrl: data.audio_sample_url
      };

      return { data: book, error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de la récupération du livre' };
    }
  },

  // Créer un nouveau livre
  async createBook(bookData: Partial<BookType> & { userId: string }): Promise<ApiResponse<BookType>> {
    try {
      const { data, error } = await supabase
        .from('books')
        .insert({
          title: bookData.title,
          author: bookData.author,
          description: bookData.description,
          price: bookData.price,
          type: bookData.type,
          cover: bookData.cover,
          file_url: bookData.fileUrl,
          audio_url: bookData.audioUrl,
          sample_url: bookData.sampleUrl,
          audio_sample_url: bookData.audioSampleUrl,
          user_id: bookData.userId
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      // Ajouter les catégories si spécifiées
      if (bookData.categories && bookData.categories.length > 0) {
        for (const categoryName of bookData.categories) {
          // Trouver ou créer la catégorie
          const { data: category } = await supabase
            .from('categories')
            .select('id')
            .eq('name', categoryName)
            .single();

          if (category) {
            await supabase
              .from('book_categories')
              .insert({
                book_id: data.id,
                category_id: category.id
              });
          }
        }
      }

      return { data: data as BookType, error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de la création du livre' };
    }
  }
};

// Categories API
export const categoriesApi = {
  async getCategories(): Promise<ApiResponse<string[]>> {
    try {
      const { data, error } = await supabase
        .from('categories')
        .select('name')
        .order('name');

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data.map(cat => cat.name), error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de la récupération des catégories' };
    }
  }
};

// Wishlist API
export const wishlistApi = {
  async getWishlist(userId: string): Promise<ApiResponse<any[]>> {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .select(`
          *,
          books(*)
        `)
        .eq('user_id', userId);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: data || [], error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de la récupération de la wishlist' };
    }
  },

  async addToWishlist(userId: string, bookId: string): Promise<ApiResponse<any>> {
    try {
      const { data, error } = await supabase
        .from('wishlists')
        .insert({
          user_id: userId,
          book_id: bookId
        })
        .select()
        .single();

      if (error) {
        return { data: null, error: error.message };
      }

      return { data, error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de l\'ajout à la wishlist' };
    }
  },

  async removeFromWishlist(userId: string, bookId: string): Promise<ApiResponse<boolean>> {
    try {
      const { error } = await supabase
        .from('wishlists')
        .delete()
        .eq('user_id', userId)
        .eq('book_id', bookId);

      if (error) {
        return { data: null, error: error.message };
      }

      return { data: true, error: null };
    } catch (err) {
      return { data: null, error: 'Erreur lors de la suppression de la wishlist' };
    }
  }
};