import React from 'react';
import { BookOpen, Headphones } from 'lucide-react';
import { BookType } from '../types/Book';

interface BookCardProps {
  book: BookType;
}

export const BookCard: React.FC<BookCardProps> = ({ book }) => {
  return (
    <div className="bg-white rounded-lg overflow-hidden shadow-sm hover:shadow-md transition-shadow group">
      <div className="relative h-64 overflow-hidden">
        <img
          src={book.cover}
          alt={`${book.title} cover`}
          className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
        />
        <div className="absolute top-2 right-2 flex gap-1">
          {book.type === 'ebook' || book.type === 'both' ? (
            <div className="bg-primary-500 text-white p-1 rounded-md">
              <BookOpen className="h-4 w-4" />
            </div>
          ) : null}
          
          {book.type === 'audio' || book.type === 'both' ? (
            <div className="bg-secondary-500 text-white p-1 rounded-md">
              <Headphones className="h-4 w-4" />
            </div>
          ) : null}
        </div>
      </div>
      
      <div className="p-4">
        <h3 className="font-semibold text-lg text-neutral-900 line-clamp-1">{book.title}</h3>
        <p className="text-neutral-600 text-sm mb-2">by {book.author}</p>
        
        <div className="flex items-center justify-between mt-2">
          <div className="flex flex-wrap gap-1">
            {book.categories.slice(0, 2).map((category, index) => (
              <span 
                key={index} 
                className="text-xs bg-neutral-100 text-neutral-600 px-2 py-1 rounded-full"
              >
                {category}
              </span>
            ))}
          </div>
          <p className="font-semibold text-primary-700">${book.price.toFixed(2)}</p>
        </div>
      </div>
    </div>
  );
};