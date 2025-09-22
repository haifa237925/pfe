const { supabase } = require('../config/supabase');

// Fonctions de base pour faire démarrer le serveur
const getBooks = async (req, res) => {
    try {
        const { data: books, error } = await supabase
            .from('books')
            .select('*')
            .eq('status', 'published')
            .order('created_at', { ascending: false });
        
        if (error) throw error;
        
        res.json({ books });
    } catch (error) {
        console.error('Error fetching books:', error);
        res.status(500).json({ message: 'Error fetching books' });
    }
};

const getBookById = async (req, res) => {
    try {
        const { id } = req.params;
        const { data: book, error } = await supabase
            .from('books')
            .select('*')
            .eq('id', id)
            .single();
        
        if (error) throw error;
        if (!book) return res.status(404).json({ message: 'Book not found' });
        
        res.json({ book });
    } catch (error) {
        console.error('Error fetching book:', error);
        res.status(500).json({ message: 'Error fetching book' });
    }
};

const searchBooks = async (req, res) => {
    try {
        const { query } = req.query;
        let searchQuery = supabase
            .from('books')
            .select('*')
            .eq('status', 'published');

        if (query) {
            searchQuery = searchQuery.or(`title.ilike.%${query}%,author.ilike.%${query}%`);
        }

        const { data: books, error } = await searchQuery;
        if (error) throw error;

        res.json({ books });
    } catch (error) {
        console.error('Search error:', error);
        res.status(500).json({ message: 'Error searching books' });
    }
};

const getCategories = async (req, res) => {
    try {
        // Retourner des catégories factices pour le moment
        const categories = [
            'Fiction', 'Non-Fiction', 'Science', 'Technology', 
            'Literature', 'History', 'Biography', 'Business'
        ];
        
        res.json({ categories });
    } catch (error) {
        console.error('Categories error:', error);
        res.status(500).json({ message: 'Error fetching categories' });
    }
};

module.exports = {
    getBooks,
    getBookById,
    searchBooks,
    getCategories
};