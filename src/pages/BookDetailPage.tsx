import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { BookOpen, Headphones, CreditCard, ShoppingCart, Star, Clock, Calendar } from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { BookType } from '../types/Book';
import { WishlistButton } from '../components/WishlistButton';

const DUMMY_BOOKS: BookType[] = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 9.99,
    type: 'ebook',
    categories: ['Programming', 'Computer Science'],
    description: 'A comprehensive guide to modern programming techniques and best practices. This book covers everything from fundamental concepts to advanced topics, making it suitable for beginners and experienced programmers alike. Learn how to write clean, efficient, and maintainable code through practical examples and exercises.',
    publishedDate: '2023-05-15',
    sampleUrl: '/samples/art-of-programming.pdf',
  },
  {
    id: '2',
    title: 'The Adventure Begins',
    author: 'John Doe',
    cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 7.99,
    type: 'ebook',
    categories: ['Fantasy', 'Adventure'],
    description: 'An epic journey through magical lands and ancient civilizations. Follow the protagonist as they discover hidden powers and face formidable challenges. This thrilling adventure will keep you on the edge of your seat from start to finish.',
    publishedDate: '2023-02-20',
    sampleUrl: '/samples/adventure-begins.pdf',
  },
  {
    id: '3',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 12.99,
    type: 'audio',
    categories: ['Business', 'Self-Help'],
    description: 'Learn how to develop effective business strategies for the modern market. This book provides practical advice for entrepreneurs and managers seeking to grow their businesses and stay competitive in a rapidly changing environment.',
    publishedDate: '2023-07-10',
    audioSampleUrl: '/samples/business-strategy.mp3',
  },
];

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const [loading, setLoading] = useState(false);
  
  const book = DUMMY_BOOKS.find(book => book.id === id);
  
  if (!book) {
    return (
      <div className="container mx-auto px-4 py-16 text-center">
        <h1 className="text-2xl font-bold mb-4">Book not found</h1>
        <Link to="/books" className="text-primary-600 hover:text-primary-700">
          Return to catalog
        </Link>
      </div>
    );
  }
  
  const handlePurchase = () => {
    setLoading(true);
    setTimeout(() => {
      alert('Purchase successful!');
      setLoading(false);
    }, 1500);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white rounded-lg shadow-sm overflow-hidden">
        {/* Book header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-6 py-4 text-white">
          <Link to="/books" className="inline-flex items-center text-primary-100 hover:text-white mb-4">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Back to catalog
          </Link>
          <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
          <p className="text-xl text-primary-100">by {book.author}</p>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Book cover and purchase info */}
          <div className="md:w-1/3">
            <div className="relative rounded-lg overflow-hidden shadow-md mb-6">
              <img 
                src={book.cover} 
                alt={`${book.title} cover`} 
                className="w-full h-auto"
              />
              <div className="absolute top-3 right-3 flex gap-1">
                {book.type === 'ebook' || book.type === 'both' ? (
                  <div className="bg-primary-500 text-white p-1 rounded-md">
                    <BookOpen className="h-5 w-5" />
                  </div>
                ) : null}
                
                {book.type === 'audio' || book.type === 'both' ? (
                  <div className="bg-secondary-500 text-white p-1 rounded-md">
                    <Headphones className="h-5 w-5" />
                  </div>
                ) : null}
              </div>
            </div>
            
            <div className="bg-neutral-50 rounded-lg p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-neutral-900">${book.price.toFixed(2)}</span>
                <div className="flex">
                  <Star className="h-5 w-5 text-amber-400 fill-current" />
                  <Star className="h-5 w-5 text-amber-400 fill-current" />
                  <Star className="h-5 w-5 text-amber-400 fill-current" />
                  <Star className="h-5 w-5 text-amber-400 fill-current" />
                  <Star className="h-5 w-5 text-neutral-300" />
                </div>
              </div>
              
              {user ? (
                <div className="space-y-3">
                  <button
                    onClick={handlePurchase}
                    disabled={loading}
                    className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
                  >
                    {loading ? (
                      <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                        <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                        <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                      </svg>
                    ) : (
                      <ShoppingCart className="h-5 w-5 mr-2" />
                    )}
                    {loading ? 'Processing...' : 'Purchase Now'}
                  </button>
                  
                  <div className="flex justify-center">
                    <WishlistButton bookId={book.id} showText className="px-4 py-2 border border-neutral-300 rounded-md hover:bg-neutral-50" />
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Login to Purchase
                </Link>
              )}
              
              <div className="mt-4 text-sm text-neutral-500">
                <p className="flex items-center mb-2">
                  <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                  Instant download after purchase
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                  Published: {formatDate(book.publishedDate)}
                </p>
              </div>
            </div>
            
            <div className="flex flex-wrap gap-2 mb-6">
              {book.categories.map((category, index) => (
                <span 
                  key={index}
                  className="bg-neutral-100 text-neutral-700 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {/* Book details */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900">Description</h2>
            <p className="text-neutral-700 leading-relaxed mb-8">
              {book.description}
            </p>
            
            <div className="border-t border-neutral-200 pt-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-900">About the Author</h2>
              <p className="text-neutral-700 leading-relaxed">
                {book.author} is a renowned writer with multiple bestselling titles. Their works are known for depth, 
                clarity, and engaging storytelling that keeps readers hooked from start to finish.
              </p>
            </div>
            
            <div className="border-t border-neutral-200 pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-900">Preview</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {(book.type === 'ebook' || book.type === 'both') && book.sampleUrl && (
                  <Link
                    to={`/reader/${book.id}?sample=true`}
                    className="flex-1 bg-primary-50 hover:bg-primary-100 text-primary-700 border border-primary-200 py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Read Sample
                  </Link>
                )}
                
                {(book.type === 'audio' || book.type === 'both') && book.audioSampleUrl && (
                  <Link
                    to={`/audio/${book.id}?sample=true`}
                    className="flex-1 bg-secondary-50 hover:bg-secondary-100 text-secondary-700 border border-secondary-200 py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    Listen Sample
                  </Link>
                )}
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BookDetailPage;