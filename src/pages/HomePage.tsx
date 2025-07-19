import React from 'react';
import { Link } from 'react-router-dom';
import { BookOpen, Upload, Headphones, ShieldCheck } from 'lucide-react';

const HomePage: React.FC = () => {
  return (
    <div className="bg-neutral-50">
      {/* Hero section */}
      <section className="bg-gradient-to-r from-primary-900 to-primary-700 text-white">
        <div className="container mx-auto px-4 py-20 md:py-32">
          <div className="max-w-3xl mx-auto text-center">
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-bold mb-6 leading-tight">
              Discover, Read, and Listen to Amazing Books
            </h1>
            <p className="text-xl md:text-2xl mb-8 text-primary-100">
              Your gateway to a world of digital books and audiobooks
            </p>
            <div className="flex flex-col sm:flex-row justify-center gap-4">
              <Link 
                to="/books" 
                className="bg-white text-primary-700 px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-50 transition-colors"
              >
                Explore Books
              </Link>
              <Link 
                to="/register" 
                className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-500 transition-colors border border-primary-500"
              >
                Join Now
              </Link>
            </div>
          </div>
        </div>
        
        <div className="h-16 bg-gradient-to-b from-primary-700 to-neutral-50"></div>
      </section>
      
      {/* Features */}
      <section className="py-16 md:py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl md:text-4xl font-bold text-center mb-16 text-neutral-900">Platform Features</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-primary-100 text-primary-600 mb-6">
                <BookOpen className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Digital Books</h3>
              <p className="text-neutral-600">
                Access a wide variety of ebooks in different formats, with a secure and comfortable reading experience.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-secondary-100 text-secondary-600 mb-6">
                <Headphones className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Audio Books</h3>
              <p className="text-neutral-600">
                Listen to your favorite books with our advanced audio player featuring playback controls and progress tracking.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-accent-100 text-accent-600 mb-6">
                <Upload className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">For Writers</h3>
              <p className="text-neutral-600">
                Upload and sell your books with detailed analytics on sales and reader engagement.
              </p>
            </div>
            
            <div className="bg-white p-8 rounded-lg shadow-sm hover:shadow-md transition-shadow text-center">
              <div className="inline-flex items-center justify-center h-16 w-16 rounded-full bg-neutral-100 text-neutral-600 mb-6">
                <ShieldCheck className="h-8 w-8" />
              </div>
              <h3 className="text-xl font-semibold mb-3 text-neutral-900">Secure Platform</h3>
              <p className="text-neutral-600">
                Advanced security features to protect content from piracy and ensure safe transactions.
              </p>
            </div>
          </div>
        </div>
      </section>
      
      {/* Call to Action */}
      <section className="bg-primary-50 py-16">
        <div className="container mx-auto px-4 text-center">
          <h2 className="text-3xl md:text-4xl font-bold mb-6 text-neutral-900">Ready to Start Reading?</h2>
          <p className="text-xl mb-8 text-neutral-700 max-w-2xl mx-auto">
            Join thousands of readers and writers on our platform. Get access to exclusive books and features.
          </p>
          <div className="flex flex-col sm:flex-row justify-center gap-4">
            <Link 
              to="/register" 
              className="bg-primary-600 text-white px-6 py-3 rounded-md font-medium text-lg hover:bg-primary-700 transition-colors"
            >
              Sign Up Now
            </Link>
            <Link 
              to="/books" 
              className="bg-white text-primary-600 px-6 py-3 rounded-md font-medium text-lg hover:bg-neutral-100 transition-colors border border-primary-200"
            >
              Browse Books
            </Link>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;