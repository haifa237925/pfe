import React, { useState } from 'react';
import { useParams, Link } from 'react-router-dom';
import { 
  BookOpen, 
  Headphones, 
  CreditCard, 
  ShoppingCart, 
  Star, 
  Clock, 
  Calendar,
  Globe,
  Users,
  FileText,
  Award,
  Hash,
  AlertTriangle,
  Check
} from 'lucide-react';
import { useAuth } from '../contexts/AuthContext';
import { useCart } from '../contexts/CartContext';
import { BookType } from '../types/Book';
import { WishlistButton } from '../components/WishlistButton';

// Enhanced book type with new fields
interface EnhancedBookType extends BookType {
  publisher?: string;
  genre: string;
  subgenre?: string;
  targetAudience: string;
  contentRating: 'all-ages' | '13+' | '16+' | '18+';
  pageCount?: number;
  duration?: number; // in minutes
  keywords?: string[];
  seriesName?: string;
  seriesNumber?: number;
  edition?: string;
  originalLanguage?: string;
  copyrightYear?: number;
  contentWarnings?: string[];
  isbn?: string;
  rating: number;
  reviewCount: number;
}

const DUMMY_BOOKS: EnhancedBookType[] = [
  {
    id: '1',
    title: 'The Art of Programming',
    author: 'Jane Smith',
    publisher: 'Tech Publications',
    cover: 'https://images.pexels.com/photos/1029141/pexels-photo-1029141.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 9.99,
    type: 'ebook',
    genre: 'non-fiction',
    subgenre: 'Technical Education',
    targetAudience: 'adults',
    contentRating: 'all-ages',
    pageCount: 342,
    categories: ['Programming', 'Computer Science'],
    description: 'A comprehensive guide to modern programming techniques and best practices. This book covers everything from fundamental concepts to advanced topics, making it suitable for beginners and experienced programmers alike. Learn how to write clean, efficient, and maintainable code through practical examples and exercises.',
    publishedDate: '2023-05-15',
    copyrightYear: 2023,
    edition: 'Second Edition',
    isbn: '978-1234567890',
    keywords: ['programming', 'software development', 'coding', 'best practices'],
    sampleUrl: '/samples/art-of-programming.pdf',
    rating: 4.6,
    reviewCount: 127,
  },
  {
    id: '2',
    title: 'The Adventure Begins',
    author: 'John Doe',
    publisher: 'Fantasy House',
    cover: 'https://images.pexels.com/photos/2662116/pexels-photo-2662116.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 7.99,
    type: 'ebook',
    genre: 'fantasy',
    subgenre: 'Epic Fantasy',
    targetAudience: 'young-adult',
    contentRating: '13+',
    pageCount: 287,
    seriesName: 'Chronicles of Eldoria',
    seriesNumber: 1,
    categories: ['Fantasy', 'Adventure'],
    description: 'An epic journey through magical lands and ancient civilizations. Follow the protagonist as they discover hidden powers and face formidable challenges. This thrilling adventure will keep you on the edge of your seat from start to finish.',
    publishedDate: '2023-02-20',
    copyrightYear: 2023,
    edition: 'First Edition',
    isbn: '978-2345678901',
    keywords: ['fantasy', 'adventure', 'young adult', 'magic'],
    contentWarnings: ['mild violence', 'fantasy themes'],
    sampleUrl: '/samples/adventure-begins.pdf',
    rating: 4.3,
    reviewCount: 89,
  },
  {
    id: '3',
    title: 'Business Strategy Mastery',
    author: 'Michael Johnson',
    publisher: 'Executive Press',
    cover: 'https://images.pexels.com/photos/3184292/pexels-photo-3184292.jpeg?auto=compress&cs=tinysrgb&w=600',
    price: 12.99,
    type: 'audio',
    genre: 'business',
    subgenre: 'Strategic Management',
    targetAudience: 'adults',
    contentRating: 'all-ages',
    duration: 480, // 8 hours
    categories: ['Business', 'Self-Help'],
    description: 'Learn how to develop effective business strategies for the modern market. This book provides practical advice for entrepreneurs and managers seeking to grow their businesses and stay competitive in a rapidly changing environment.',
    publishedDate: '2023-07-10',
    copyrightYear: 2023,
    edition: 'Third Edition',
    isbn: '978-3456789012',
    keywords: ['business strategy', 'entrepreneurship', 'management', 'leadership'],
    audioSampleUrl: '/samples/business-strategy.mp3',
    rating: 4.8,
    reviewCount: 203,
  },
];

const BookDetailPage: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const { user } = useAuth();
  const { addToCart, items } = useCart();
  const [addedToCart, setAddedToCart] = useState(false);
  
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
  
  const isInCart = items.some(item => item.id === book.id);
  
  const handleAddToCart = () => {
    addToCart({
      id: book.id,
      title: book.title,
      author: book.author,
      cover: book.cover,
      price: book.price,
      type: book.type
    });
    setAddedToCart(true);
    setTimeout(() => setAddedToCart(false), 2000);
  };
  
  const formatDate = (dateString: string) => {
    const date = new Date(dateString);
    return date.toLocaleDateString('fr-FR', {
      year: 'numeric',
      month: 'long',
      day: 'numeric'
    });
  };

  const formatDuration = (minutes: number) => {
    const hours = Math.floor(minutes / 60);
    const remainingMinutes = minutes % 60;
    return hours > 0 ? `${hours}h ${remainingMinutes}m` : `${minutes}m`;
  };

  const getContentRatingBadge = (rating: string) => {
    const colors = {
      'all-ages': 'bg-green-100 text-green-800',
      '13+': 'bg-yellow-100 text-yellow-800',
      '16+': 'bg-orange-100 text-orange-800',
      '18+': 'bg-red-100 text-red-800'
    };
    return colors[rating as keyof typeof colors] || colors['all-ages'];
  };

  const renderStars = (rating: number) => {
    return Array.from({ length: 5 }, (_, i) => (
      <Star 
        key={i} 
        className={`h-5 w-5 ${
          i < Math.floor(rating) 
            ? 'text-amber-400 fill-current' 
            : i < rating 
              ? 'text-amber-400 fill-current opacity-50' 
              : 'text-neutral-300'
        }`} 
      />
    ));
  };
  
  return (
    <div className="container mx-auto px-4 py-8">
      <div className="bg-white dark:bg-neutral-800 rounded-lg shadow-sm overflow-hidden">
        {/* Book header */}
        <div className="bg-gradient-to-r from-primary-900 to-primary-700 px-6 py-4 text-white">
          <Link to="/books" className="inline-flex items-center text-primary-100 hover:text-white mb-4">
            <svg className="h-5 w-5 mr-1" fill="none" stroke="currentColor" viewBox="0 0 24 24">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M15 19l-7-7 7-7"></path>
            </svg>
            Retour au catalogue
          </Link>
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-bold mb-2">{book.title}</h1>
              <p className="text-xl text-primary-100 mb-2">par {book.author}</p>
              {book.publisher && (
                <p className="text-primary-200 text-sm">{book.publisher}</p>
              )}
            </div>
            <div className="text-right">
              <div className="flex items-center mb-1">
                {renderStars(book.rating)}
                <span className="ml-2 text-primary-100">{book.rating}</span>
              </div>
              <p className="text-sm text-primary-200">{book.reviewCount} avis</p>
            </div>
          </div>
        </div>
        
        <div className="p-6 md:p-8 flex flex-col md:flex-row gap-8">
          {/* Book cover and purchase info */}
          <div className="md:w-1/3">
            <div className="relative rounded-lg overflow-hidden shadow-md mb-6">
              <img 
                src={book.cover} 
                alt={`Couverture de ${book.title}`} 
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
              
              {/* Content Rating Badge */}
              <div className="absolute top-3 left-3">
                <span className={`px-2 py-1 rounded text-xs font-medium ${getContentRatingBadge(book.contentRating)}`}>
                  {book.contentRating.toUpperCase()}
                </span>
              </div>
            </div>
            
            {/* Purchase Section */}
            <div className="bg-neutral-50 dark:bg-neutral-700 rounded-lg p-5 mb-6">
              <div className="flex items-center justify-between mb-4">
                <span className="text-2xl font-bold text-neutral-900 dark:text-white">${book.price.toFixed(2)}</span>
                <div className="text-right">
                  <div className="flex">
                    {renderStars(book.rating)}
                  </div>
                  <p className="text-sm text-neutral-500 mt-1">{book.reviewCount} avis</p>
                </div>
              </div>
              
              {user ? (
                <div className="space-y-3">
                  {/* Add to Cart Button */}
                  <button
                    onClick={handleAddToCart}
                    disabled={addedToCart}
                    className={`w-full py-3 px-4 rounded-md font-medium flex items-center justify-center transition-all duration-300 ${
                      addedToCart 
                        ? 'bg-green-600 text-white'
                        : isInCart
                          ? 'bg-orange-500 text-white hover:bg-orange-600'
                          : 'bg-primary-600 text-white hover:bg-primary-700'
                    }`}
                  >
                    {addedToCart ? (
                      <>
                        <Check className="h-5 w-5 mr-2" />
                        Ajouté au panier!
                      </>
                    ) : (
                      <>
                        <ShoppingCart className="h-5 w-5 mr-2" />
                        {isInCart ? 'Déjà dans le panier' : 'Ajouter au panier'}
                      </>
                    )}
                  </button>
                  
                  {/* Go to Cart Button if item is in cart */}
                  {(isInCart || addedToCart) && (
                    <Link
                      to="/cart"
                      className="w-full block text-center bg-secondary-600 text-white py-2 px-4 rounded-md font-medium hover:bg-secondary-700 transition-colors"
                    >
                      Voir le panier
                    </Link>
                  )}
                  
                  <div className="flex justify-center">
                    <WishlistButton bookId={book.id} showText className="px-4 py-2 border border-neutral-300 dark:border-neutral-600 rounded-md hover:bg-neutral-50 dark:hover:bg-neutral-600" />
                  </div>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="w-full bg-primary-600 text-white py-3 px-4 rounded-md font-medium flex items-center justify-center hover:bg-primary-700 transition-colors"
                >
                  <CreditCard className="h-5 w-5 mr-2" />
                  Se connecter pour acheter
                </Link>
              )}
              
              <div className="mt-4 text-sm text-neutral-500 dark:text-neutral-400 space-y-2">
                <p className="flex items-center">
                  <Clock className="h-4 w-4 mr-2 text-neutral-400" />
                  Téléchargement instantané après achat
                </p>
                <p className="flex items-center">
                  <Calendar className="h-4 w-4 mr-2 text-neutral-400" />
                  Publié: {formatDate(book.publishedDate)}
                </p>
                {book.pageCount && (
                  <p className="flex items-center">
                    <FileText className="h-4 w-4 mr-2 text-neutral-400" />
                    {book.pageCount} pages
                  </p>
                )}
                {book.duration && (
                  <p className="flex items-center">
                    <Headphones className="h-4 w-4 mr-2 text-neutral-400" />
                    {formatDuration(book.duration)}
                  </p>
                )}
              </div>
            </div>

            {/* Book Info */}
            <div className="space-y-4 mb-6">
              {/* Genre & Target Audience */}
              <div>
                <h3 className="font-medium text-neutral-900 dark:text-white mb-2 flex items-center">
                  <Hash className="h-4 w-4 mr-1" />
                  Détails
                </h3>
                <div className="space-y-1 text-sm text-neutral-600 dark:text-neutral-400">
                  <p><span className="font-medium">Genre:</span> {book.genre.charAt(0).toUpperCase() + book.genre.slice(1)}</p>
                  {book.subgenre && <p><span className="font-medium">Sous-genre:</span> {book.subgenre}</p>}
                  <p><span className="font-medium">Public:</span> {book.targetAudience.replace('-', ' ').split(' ').map(w => w.charAt(0).toUpperCase() + w.slice(1)).join(' ')}</p>
                  {book.isbn && <p><span className="font-medium">ISBN:</span> {book.isbn}</p>}
                  {book.edition && <p><span className="font-medium">Édition:</span> {book.edition}</p>}
                  {book.copyrightYear && <p><span className="font-medium">Copyright:</span> {book.copyrightYear}</p>}
                </div>
              </div>

              {/* Series Info */}
              {book.seriesName && (
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2 flex items-center">
                    <BookOpen className="h-4 w-4 mr-1" />
                    Série
                  </h3>
                  <div className="text-sm text-neutral-600 dark:text-neutral-400">
                    <p><span className="font-medium">{book.seriesName}</span></p>
                    {book.seriesNumber && <p>Tome #{book.seriesNumber}</p>}
                  </div>
                </div>
              )}

              {/* Content Warnings */}
              {book.contentWarnings && book.contentWarnings.length > 0 && (
                <div>
                  <h3 className="font-medium text-neutral-900 dark:text-white mb-2 flex items-center">
                    <AlertTriangle className="h-4 w-4 mr-1 text-amber-500" />
                    Avertissements
                  </h3>
                  <div className="flex flex-wrap gap-1">
                    {book.contentWarnings.map((warning, index) => (
                      <span 
                        key={index}
                        className="bg-amber-100 text-amber-800 px-2 py-1 rounded text-xs"
                      >
                        {warning}
                      </span>
                    ))}
                  </div>
                </div>
              )}
            </div>
            
            {/* Categories */}
            <div className="flex flex-wrap gap-2 mb-6">
              {book.categories.map((category, index) => (
                <span 
                  key={index}
                  className="bg-neutral-100 dark:bg-neutral-600 text-neutral-700 dark:text-neutral-300 px-3 py-1 rounded-full text-sm"
                >
                  {category}
                </span>
              ))}
            </div>
          </div>
          
          {/* Book details */}
          <div className="md:w-2/3">
            <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">Description</h2>
            <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed mb-8">
              {book.description}
            </p>
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mb-6">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">À propos de l'auteur</h2>
              <p className="text-neutral-700 dark:text-neutral-300 leading-relaxed">
                {book.author} est un écrivain renommé avec plusieurs titres best-sellers. Ses œuvres sont connues pour leur profondeur, 
                leur clarté et leur narration captivante qui tient les lecteurs en haleine du début à la fin.
              </p>
            </div>

            {/* Keywords/Tags */}
            {book.keywords && book.keywords.length > 0 && (
              <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6 mb-6">
                <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">Mots-clés</h2>
                <div className="flex flex-wrap gap-2">
                  {book.keywords.map((keyword, index) => (
                    <span 
                      key={index}
                      className="bg-primary-50 dark:bg-primary-900/30 text-primary-700 dark:text-primary-400 px-3 py-1 rounded-full text-sm border border-primary-200 dark:border-primary-700"
                    >
                      {keyword}
                    </span>
                  ))}
                </div>
              </div>
            )}
            
            <div className="border-t border-neutral-200 dark:border-neutral-700 pt-6">
              <h2 className="text-2xl font-semibold mb-4 text-neutral-900 dark:text-white">Aperçu</h2>
              
              <div className="flex flex-col sm:flex-row gap-4">
                {(book.type === 'ebook' || book.type === 'both') && book.sampleUrl && (
                  <Link
                    to={`/reader/${book.id}?sample=true`}
                    className="flex-1 bg-primary-50 dark:bg-primary-900/30 hover:bg-primary-100 dark:hover:bg-primary-900/50 text-primary-700 dark:text-primary-400 border border-primary-200 dark:border-primary-700 py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                  >
                    <BookOpen className="h-5 w-5 mr-2" />
                    Lire l'extrait
                    {book.pageCount && <span className="ml-2 text-sm">({Math.floor(book.pageCount / 10)} pages)</span>}
                  </Link>
                )}
                
                {(book.type === 'audio' || book.type === 'both') && book.audioSampleUrl && (
                  <Link
                    to={`/audio/${book.id}?sample=true`}
                    className="flex-1 bg-secondary-50 dark:bg-secondary-900/30 hover:bg-secondary-100 dark:hover:bg-secondary-900/50 text-secondary-700 dark:text-secondary-400 border border-secondary-200 dark:border-secondary-700 py-3 px-4 rounded-md font-medium flex items-center justify-center transition-colors"
                  >
                    <Headphones className="h-5 w-5 mr-2" />
                    Écouter l'extrait
                    {book.duration && <span className="ml-2 text-sm">({Math.floor((book.duration * 0.1))} min)</span>}
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