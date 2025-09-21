import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Search, Filter, Book, Headphones } from 'lucide-react';
import { BookCard } from '../components/BookCard';
import { BookType } from '../types/Book';

const DUMMY_BOOKS: BookType[] = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 9.99,
    type: 'ebook',
    categories: ['Programming', 'Computer Science'],
    description: 'A comprehensive guide to modern programming techniques and best practices.',
    publishedDate: '2023-05-15',
  },
  {
    id: '2',
    title: 'The Adventure Begins',
    author: 'John Doe',
    cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 7.99,
    type: 'ebook',
    categories: ['Fantasy', 'Adventure'],
    description: 'An epic journey through magical lands and ancient civilizations.',
    publishedDate: '2023-02-20',
  },
  {
    id: '3',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 12.99,
    type: 'audio',
    categories: ['Business', 'Self-Help'],
    description: 'Learn how to develop effective business strategies for the modern market.',
    publishedDate: '2023-07-10',
  },
  {
    id: '4',
    title: 'History of Science',
    author: 'Sarah Wilson',
    cover: 'https://images.pexels.com/photos/2873669/pexels-photo-2873669.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 8.99,
    type: 'both',
    categories: ['Science', 'History'],
    description: 'A fascinating exploration of scientific discoveries throughout human history.',
    publishedDate: '2022-11-30',
  },
  {
    id: '5',
    title: 'Cooking Masterclass',
    author: 'Chef Rodriguez',
    cover: 'https://images.pexels.com/photos/1640774/pexels-photo-1640774.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 14.99,
    type: 'ebook',
    categories: ['Cooking', 'Food'],
    description: 'Discover the secrets of professional chefs and elevate your culinary skills.',
    publishedDate: '2023-04-05',
  },
  {
    id: '6',
    title: 'Meditation for Beginners',
    author: 'Lily Chen',
    cover: 'https://images.pexels.com/photos/3560044/pexels-photo-3560044.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 6.99,
    type: 'audio',
    categories: ['Health', 'Self-Help'],
    description: 'A gentle introduction to meditation practices for stress reduction and mindfulness.',
    publishedDate: '2023-01-15',
  },
];

const categories = ['All', 'Programming', 'Fantasy', 'Business', 'Science', 'Cooking', 'Health'];
const types = ['All', 'E-Book', 'Audio Book', 'Both'];

const BookCatalogPage: React.FC = () => {
  const [books, setBooks] = useState<BookType[]>(DUMMY_BOOKS);
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('All');
  const [selectedType, setSelectedType] = useState('All');
  const [isFilterOpen, setIsFilterOpen] = useState(false);
  
  // Filter books based on search term, category and type
  useEffect(() => {
    let filteredBooks = DUMMY_BOOKS;
    
    if (searchTerm) {
      filteredBooks = filteredBooks.filter(book => 
        book.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        book.author.toLowerCase().includes(searchTerm.toLowerCase())
      );
    }
    
    if (selectedCategory !== 'All') {
      filteredBooks = filteredBooks.filter(book => 
        book.categories.includes(selectedCategory)
      );
    }
    
    if (selectedType !== 'All') {
      let typeFilter: 'ebook' | 'audio' | 'both';
      
      switch (selectedType) {
        case 'E-Book':
          typeFilter = 'ebook';
          break;
        case 'Audio Book':
          typeFilter = 'audio';
          break;
        default:
          typeFilter = 'both';
      }
      
      filteredBooks = filteredBooks.filter(book => book.type === typeFilter);
    }
    
    setBooks(filteredBooks);
  }, [searchTerm, selectedCategory, selectedType]);
  
  return (
    <div className="container mx-auto px-4 py-8">
      <h1 className="text-3xl font-bold mb-6 text-neutral-900">Catalogue</h1>
      
      {/* Search and filters */}
      <div className="mb-8">
        <div className="flex flex-col md:flex-row gap-4">
          <div className="relative flex-grow">
            <input 
              type="text" 
              placeholder="Search by title or author" 
              className="w-full pl-10 pr-4 py-3 rounded-lg border border-neutral-300 focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
            />
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-neutral-500" />
          </div>
          
          <button 
            className="md:hidden flex items-center justify-center px-4 py-3 bg-white border border-neutral-300 rounded-lg text-neutral-700"
            onClick={() => setIsFilterOpen(!isFilterOpen)}
          >
            <Filter className="h-5 w-5 mr-2" />
            Filters
          </button>
        </div>
        
        <div className={`md:flex justify-between mt-4 ${isFilterOpen ? 'block' : 'hidden md:block'}`}>
          <div>
            <h3 className="font-medium mb-2 text-neutral-700">Categories</h3>
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategory === category
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedCategory(category)}
                >
                  {category}
                </button>
              ))}
            </div>
          </div>
          
          <div className="mt-4 md:mt-0">
            <h3 className="font-medium mb-2 text-neutral-700">Type</h3>
            <div className="flex flex-wrap gap-2">
              {types.map((type) => (
                <button
                  key={type}
                  className={`px-3 py-1 rounded-full text-sm flex items-center ${
                    selectedType === type
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                  onClick={() => setSelectedType(type)}
                >
                  {type === 'E-Book' && <Book className="h-3 w-3 mr-1" />}
                  {type === 'Audio Book' && <Headphones className="h-3 w-3 mr-1" />}
                  {type}
                </button>
              ))}
            </div>
          </div>
        </div>
      </div>
      
      {/* Book grid */}
      {books.length > 0 ? (
        <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-6">
          {books.map((book) => (
            <Link key={book.id} to={`/books/${book.id}`}>
              <BookCard book={book} />
            </Link>
          ))}
        </div>
      ) : (
        <div className="text-center py-12">
          <p className="text-xl text-neutral-600">No books found matching your criteria.</p>
          <button 
            className="mt-4 text-primary-600 hover:text-primary-700"
            onClick={() => {
              setSearchTerm('');
              setSelectedCategory('All');
              setSelectedType('All');
            }}
          >
            Reset filters
          </button>
        </div>
      )}
    </div>
  );
};

export default BookCatalogPage;