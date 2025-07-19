import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { 
  Upload, 
  ImagePlus, 
  FileText, 
  Headphones, 
  X, 
  AlertCircle 
} from 'lucide-react';

const CATEGORIES = [
  'Fiction', 'Non-Fiction', 'Science Fiction', 'Fantasy', 'Mystery', 
  'Thriller', 'Romance', 'Horror', 'Biography', 'History', 'Self-Help',
  'Business', 'Computer Science', 'Programming', 'Science', 'Philosophy',
  'Psychology', 'Art', 'Cooking', 'Travel'
];

const BookUploadPage: React.FC = () => {
  const navigate = useNavigate();
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState('');
  const [success, setSuccess] = useState('');
  
  // Form state
  const [title, setTitle] = useState('');
  const [author, setAuthor] = useState('');
  const [description, setDescription] = useState('');
  const [price, setPrice] = useState('');
  const [type, setType] = useState<'ebook' | 'audio' | 'both'>('ebook');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // File state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState('');
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [audioSampleFile, setAudioSampleFile] = useState<File | null>(null);
  
  const handleCoverChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Cover file must be an image');
      return;
    }
    
    setCoverFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleBookFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/epub+zip'];
    if (!allowedTypes.includes(file.type)) {
      setError('Book file must be a PDF or ePub');
      return;
    }
    
    setBookFile(file);
  };
  
  const handleAudioFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
      setError('Audio file must be MP3 or WAV');
      return;
    }
    
    setAudioFile(file);
  };
  
  const handleSampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['application/pdf', 'application/epub+zip'];
    if (!allowedTypes.includes(file.type)) {
      setError('Sample file must be a PDF or ePub');
      return;
    }
    
    setSampleFile(file);
  };
  
  const handleAudioSampleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    const allowedTypes = ['audio/mpeg', 'audio/wav'];
    if (!allowedTypes.includes(file.type)) {
      setError('Audio sample file must be MP3 or WAV');
      return;
    }
    
    setAudioSampleFile(file);
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const validateForm = () => {
    if (!title) {
      setError('Title is required');
      return false;
    }
    
    if (!author) {
      setError('Author is required');
      return false;
    }
    
    if (!price || isNaN(Number(price)) || Number(price) <= 0) {
      setError('Valid price is required');
      return false;
    }
    
    if (!coverFile) {
      setError('Cover image is required');
      return false;
    }
    
    if (type === 'ebook' || type === 'both') {
      if (!bookFile) {
        setError('E-book file is required');
        return false;
      }
    }
    
    if (type === 'audio' || type === 'both') {
      if (!audioFile) {
        setError('Audio file is required');
        return false;
      }
    }
    
    if (selectedCategories.length === 0) {
      setError('At least one category is required');
      return false;
    }
    
    return true;
  };
  
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setError('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    // In a real app, this would use the API to upload
    setTimeout(() => {
      setIsLoading(false);
      setSuccess('Book uploaded successfully!');
      
      // Redirect after a short delay
      setTimeout(() => {
        navigate('/writer');
      }, 2000);
    }, 2000);
  };
  
  return (
    <div className="max-w-4xl mx-auto">
      <h1 className="text-2xl font-bold text-neutral-900 mb-6">Upload New Book</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded">
          <div className="flex items-center">
            <svg className="h-5 w-5 text-green-500 mr-2" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M5 13l4 4L19 7" />
            </svg>
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      <form onSubmit={handleSubmit} className="bg-white rounded-lg shadow-sm p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Book Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Title
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Author
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              rows={5}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
            ></textarea>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Price ($)
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Book Type
            </label>
            <select
              className="block w-full rounded-md border-neutral-300 shadow-sm focus:border-primary-500 focus:ring focus:ring-primary-200 focus:ring-opacity-50"
              value={type}
              onChange={(e) => setType(e.target.value as 'ebook' | 'audio' | 'both')}
            >
              <option value="ebook">E-book Only</option>
              <option value="audio">Audio Book Only</option>
              <option value="both">Both E-book and Audio</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-neutral-700 mb-1">
              Categories
            </label>
            <div className="flex flex-wrap gap-2 mt-2">
              {CATEGORIES.map((category) => (
                <button
                  key={category}
                  type="button"
                  onClick={() => handleCategoryToggle(category)}
                  className={`px-3 py-1 rounded-full text-sm ${
                    selectedCategories.includes(category)
                      ? 'bg-primary-100 text-primary-800 border border-primary-200'
                      : 'bg-white text-neutral-600 border border-neutral-300 hover:bg-neutral-100'
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <p className="text-xs text-neutral-500 mt-2">Select at least one category</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 border-t border-neutral-200 pt-6 mt-2">
            <h2 className="text-lg font-semibold text-neutral-900 mb-4">Book Files</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-neutral-700 mb-2">
              Book Cover Image
            </label>
            <div className="flex items-center space-x-4">
              <div className="flex-shrink-0 w-32 h-40 border-2 border-dashed rounded-lg border-neutral-300 overflow-hidden flex items-center justify-center relative">
                {coverPreview ? (
                  <>
                    <img 
                      src={coverPreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setCoverPreview('');
                        setCoverFile(null);
                      }}
                      className="absolute top-1 right-1 bg-neutral-800 bg-opacity-50 rounded-full p-1 text-white hover:bg-opacity-70"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full">
                    <ImagePlus className="h-8 w-8 text-neutral-400" />
                    <span className="text-xs text-neutral-500 mt-1">Add Cover</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/*"
                      onChange={handleCoverChange}
                    />
                  </label>
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-neutral-600">Upload a high-quality cover image. Recommended ratio is 2:3. Maximum size: 5MB.</p>
              </div>
            </div>
          </div>
          
          {/* E-book file upload */}
          {(type === 'ebook' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                E-book File (PDF/ePub)
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`flex items-center justify-center h-12 px-4 w-full rounded-md border-2 border-dashed ${
                    bookFile ? 'border-primary-300 bg-primary-50' : 'border-neutral-300'
                  }`}
                >
                  {bookFile ? (
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-sm text-neutral-700 truncate">{bookFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setBookFile(null)}
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center cursor-pointer w-full justify-center">
                      <FileText className="h-5 w-5 text-neutral-400 mr-2" />
                      <span className="text-sm text-neutral-500">Choose E-book File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.epub"
                        onChange={handleBookFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Sample file upload */}
          {(type === 'ebook' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Sample File (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`flex items-center justify-center h-12 px-4 w-full rounded-md border-2 border-dashed ${
                    sampleFile ? 'border-primary-300 bg-primary-50' : 'border-neutral-300'
                  }`}
                >
                  {sampleFile ? (
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-primary-500 mr-2" />
                      <span className="text-sm text-neutral-700 truncate">{sampleFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setSampleFile(null)}
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center cursor-pointer w-full justify-center">
                      <FileText className="h-5 w-5 text-neutral-400 mr-2" />
                      <span className="text-sm text-neutral-500">Choose Sample File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".pdf,.epub"
                        onChange={handleSampleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Audio file upload */}
          {(type === 'audio' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Audio File (MP3/WAV)
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`flex items-center justify-center h-12 px-4 w-full rounded-md border-2 border-dashed ${
                    audioFile ? 'border-secondary-300 bg-secondary-50' : 'border-neutral-300'
                  }`}
                >
                  {audioFile ? (
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5 text-secondary-500 mr-2" />
                      <span className="text-sm text-neutral-700 truncate">{audioFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setAudioFile(null)}
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center cursor-pointer w-full justify-center">
                      <Headphones className="h-5 w-5 text-neutral-400 mr-2" />
                      <span className="text-sm text-neutral-500">Choose Audio File</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".mp3,.wav"
                        onChange={handleAudioFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
          
          {/* Audio sample file upload */}
          {(type === 'audio' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-neutral-700 mb-2">
                Audio Sample File (Optional)
              </label>
              <div className="flex items-center space-x-4">
                <div 
                  className={`flex items-center justify-center h-12 px-4 w-full rounded-md border-2 border-dashed ${
                    audioSampleFile ? 'border-secondary-300 bg-secondary-50' : 'border-neutral-300'
                  }`}
                >
                  {audioSampleFile ? (
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5 text-secondary-500 mr-2" />
                      <span className="text-sm text-neutral-700 truncate">{audioSampleFile.name}</span>
                      <button
                        type="button"
                        onClick={() => setAudioSampleFile(null)}
                        className="ml-2 text-neutral-500 hover:text-neutral-700"
                      >
                        <X className="h-4 w-4" />
                      </button>
                    </div>
                  ) : (
                    <label className="flex items-center cursor-pointer w-full justify-center">
                      <Headphones className="h-5 w-5 text-neutral-400 mr-2" />
                      <span className="text-sm text-neutral-500">Choose Audio Sample</span>
                      <input
                        type="file"
                        className="hidden"
                        accept=".mp3,.wav"
                        onChange={handleAudioSampleFileChange}
                      />
                    </label>
                  )}
                </div>
              </div>
            </div>
          )}
          
          <div className="col-span-1 md:col-span-2 flex justify-end mt-6 pt-6 border-t border-neutral-200">
            <button
              type="button"
              className="px-4 py-2 text-neutral-700 bg-white border border-neutral-300 rounded-md shadow-sm hover:bg-neutral-50 mr-4"
              onClick={() => navigate('/writer')}
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isLoading}
              className="px-4 py-2 bg-primary-600 text-white rounded-md shadow-sm hover:bg-primary-700 flex items-center justify-center"
            >
              {isLoading ? (
                <>
                  <svg className="animate-spin h-5 w-5 mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                    <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                    <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z"></path>
                  </svg>
                  Uploading...
                </>
              ) : (
                <>
                  <Upload className="h-5 w-5 mr-2" />
                  Upload Book
                </>
              )}
            </button>
          </div>
        </div>
      </form>
    </div>
  );
};

export default BookUploadPage;