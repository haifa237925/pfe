import React from 'react';
import { Link } from 'react-router-dom';
import { Heart, ShoppingCart, Trash2, BookOpen, Headphones } from 'lucide-react';
import { useWishlist } from '../../../contexts/WishlistContext';

// Mock book data for demo
const MOCK_BOOKS = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 9.99,
    type: 'ebook' as const,
    categories: ['Programming', 'Computer Science'],
  },
  {
    id: '2',
    title: 'The Adventure Begins',
    author: 'John Doe',
    cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 7.99,
    type: 'ebook' as const,
    categories: ['Fantasy', 'Adventure'],
  },
  {
    id: '3',
    title: 'Business Strategy',
    author: 'Michael Johnson',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 12.99,
    type: 'audio' as const,
    categories: ['Business', 'Self-Help'],
  },
];

const WishlistPage: React.FC = () => {
  const { wishlistItems, removeFromWishlist, clearWishlist, isLoading } = useWishlist();

  // Get book details for wishlist items (in real app, this would be fetched from API)
  const wishlistBooksWithDetails = wishlistItems.map(item => {
    const book = MOCK_BOOKS.find(b => b.id === item.bookId);
    return {
      ...item,
      book
    };
  }).filter(item => item.book); // Only include items where we found the book

  const handleRemoveFromWishlist = async (bookId: string) => {
    try {
      await removeFromWishlist(bookId);
    } catch (error) {
      console.error('Error removing from wishlist:', error);
    }
  };

  const handleClearWishlist = async () => {
    if (window.confirm('Are you sure you want to clear your entire wishlist?')) {
      try {
        await clearWishlist();
      } catch (error) {
        console.error('Error clearing wishlist:', error);
      }
    }
  };

  if (isLoading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary-600"></div>
      </div>
    );
  }

  return (
    <div className="max-w-6xl mx-auto">
      <div className="flex items-center justify-between mb-6">
        <h1 className="text-2xl font-bold text-neutral-900">My Wishlist</h1>
        {wishlistBooksWithDetails.length > 0 && (
          <button
            onClick={handleClearWishlist}
            className="text-red-600 hover:text-red-700 text-sm font-medium flex items-center"
          >
            <Trash2 className="h-4 w-4 mr-1" />
            Clear All
          </button>
        )}
      </div>

      {wishlistBooksWithDetails.length === 0 ? (
        <div className="bg-white rounded-lg shadow-sm p-12 text-center">
          <Heart className="h-16 w-16 mx-auto mb-4 text-neutral-300" />
          <h2 className="text-xl font-semibold text-neutral-900 mb-2">Your wishlist is empty</h2>
          <p className="text-neutral-600 mb-6">
            Start adding books you're interested in to keep track of them.
          </p>
          <Link
            to="/books"
            className="inline-flex items-center bg-primary-600 text-white px-6 py-3 rounded-md hover:bg-primary-700 transition-colors"
          >
            Browse Books
          </Link>
        </div>
      ) : (
        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          <div className="px-6 py-4 border-b border-neutral-200">
            <p className="text-sm text-neutral-600">
              {wishlistBooksWithDetails.length} book{wishlistBooksWithDetails.length !== 1 ? 's' : ''} in your wishlist
            </p>
          </div>

          <div className="divide-y divide-neutral-200">
            {wishlistBooksWithDetails.map((item) => (
              <div key={item.id} className="p-6 hover:bg-neutral-50 transition-colors">
                <div className="flex items-start space-x-4">
                  <Link to={`/books/${item.book!.id}`} className="flex-shrink-0">
                    <div className="relative w-20 h-28 rounded-lg overflow-hidden shadow-sm">
                      <img
                        src={item.book!.cover}
                        alt={item.book!.title}
                        className="w-full h-full object-cover"
                      />
                      <div className="absolute top-1 right-1">
                        {item.book!.type === 'ebook' || item.book!.type === 'both' ? (
                          <div className="bg-primary-500 text-white p-1 rounded">
                            <BookOpen className="h-3 w-3" />
                          </div>
                        ) : (
                          <div className="bg-secondary-500 text-white p-1 rounded">
                            <Headphones className="h-3 w-3" />
                          </div>
                        )}
                      </div>
                    </div>
                  </Link>

                  <div className="flex-grow min-w-0">
                    <Link to={`/books/${item.book!.id}`}>
                      <h3 className="font-semibold text-lg text-neutral-900 hover:text-primary-600 transition-colors">
                        {item.book!.title}
                      </h3>
                    </Link>
                    <p className="text-neutral-600 mb-2">by {item.book!.author}</p>
                    
                    <div className="flex flex-wrap gap-1 mb-3">
                      {item.book!.categories.slice(0, 2).map((category, index) => (
                        <span 
                          key={index} 
                          className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
                        >
                          {category}
                        </span>
                      ))}
                    </div>

                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <span className="text-lg font-bold text-primary-700">
                          ${item.book!.price.toFixed(2)}
                        </span>
                        <span className="text-xs text-neutral-500">
                          Added {new Date(item.addedDate).toLocaleDateString()}
                        </span>
                      </div>

                      <div className="flex items-center space-x-2">
                        <Link
                          to={`/books/${item.book!.id}`}
                          className="inline-flex items-center px-3 py-2 bg-primary-600 text-white text-sm rounded-md hover:bg-primary-700 transition-colors"
                        >
                          <ShoppingCart className="h-4 w-4 mr-1" />
                          Buy Now
                        </Link>
                        
                        <button
                          onClick={() => handleRemoveFromWishlist(item.bookId)}
                          className="p-2 text-neutral-400 hover:text-red-500 transition-colors"
                          title="Remove from wishlist"
                        >
                          <Trash2 className="h-4 w-4" />
                        </button>
                      </div>
                    </div>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};

export default WishlistPage;