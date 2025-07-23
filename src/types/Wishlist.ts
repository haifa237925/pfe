export interface WishlistItem {
  id: string;
  userId: string;
  bookId: string;
  addedDate: string;
  book?: {
    id: string;
    title: string;
    author: string;
    cover: string;
    price: number;
    type: 'ebook' | 'audio' | 'both';
    categories: string[];
  };
}

export interface WishlistContextType {
  wishlistItems: WishlistItem[];
  isLoading: boolean;
  addToWishlist: (bookId: string) => Promise<void>;
  removeFromWishlist: (bookId: string) => Promise<void>;
  isInWishlist: (bookId: string) => boolean;
  clearWishlist: () => Promise<void>;
}