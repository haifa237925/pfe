import { useState, useEffect } from 'react';
import { booksApi } from '../lib/api';
import { BookType } from '../types/Book';

interface UseBooksOptions {
  search?: string;
  category?: string;
  type?: string;
  limit?: number;
  autoFetch?: boolean;
}

export const useBooks = (options: UseBooksOptions = {}) => {
  const [books, setBooks] = useState<BookType[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const fetchBooks = async () => {
    setLoading(true);
    setError(null);

    const result = await booksApi.getBooks({
      search: options.search,
      category: options.category,
      type: options.type,
      limit: options.limit || 20
    });

    if (result.error) {
      setError(result.error);
      setBooks([]);
    } else {
      setBooks(result.data || []);
    }

    setLoading(false);
  };

  useEffect(() => {
    if (options.autoFetch !== false) {
      fetchBooks();
    }
  }, [options.search, options.category, options.type, options.limit]);

  return {
    books,
    loading,
    error,
    refetch: fetchBooks
  };
};

export const useBook = (id: string) => {
  const [book, setBook] = useState<BookType | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    if (!id) return;

    const fetchBook = async () => {
      setLoading(true);
      setError(null);

      const result = await booksApi.getBookById(id);

      if (result.error) {
        setError(result.error);
        setBook(null);
      } else {
        setBook(result.data);
      }

      setLoading(false);
    };

    fetchBook();
  }, [id]);

  return { book, loading, error };
};