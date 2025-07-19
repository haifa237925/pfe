export type BookType = {
  id: string;
  title: string;
  author: string;
  cover: string;
  price: number;
  type: 'ebook' | 'audio' | 'both';
  categories: string[];
  description: string;
  publishedDate: string;
  fileUrl?: string;
  audioUrl?: string;
  sampleUrl?: string;
  audioSampleUrl?: string;
};

export type ChapterProgress = {
  bookId: string;
  chapterId: string;
  progress: number; // percentage
  lastPosition: number; // page or time in seconds
};

export type PurchaseType = {
  id: string;
  userId: string;
  bookId: string;
  purchaseDate: string;
  price: number;
  paymentMethod: string;
};

export type ReviewType = {
  id: string;
  userId: string;
  bookId: string;
  rating: number;
  comment: string;
  date: string;
  userName: string;
};