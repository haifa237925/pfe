import React, { useState, ChangeEvent } from 'react';
import { 
  Upload, 
  ImagePlus, 
  FileText, 
  Headphones, 
  X, 
  AlertCircle,
  CheckCircle 
} from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';

type BookType = 'ebook' | 'audio' | 'both';

const BookUploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');
  
  // Fetch categories from the API
  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories({
    includeChildren: true
  });
  
  // Form state
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [type, setType] = useState<BookType>('ebook');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  
  // File state
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [audioSampleFile, setAudioSampleFile] = useState<File | null>(null);
  
  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!file.type.startsWith('image/')) {
      setError('Cover file must be an image (JPEG or PNG)');
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setError('Cover file must be less than 50MB');
      return;
    }
    
    setError(''); // Clear any previous errors
    setCoverFile(file);
    
    // Create preview
    const reader = new FileReader();
    reader.onloadend = () => {
      setCoverPreview(reader.result as string);
    };
    reader.readAsDataURL(file);
  };
  
  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>, 
    setFile: React.Dispatch<React.SetStateAction<File | null>>, 
    allowedTypes: string[], 
    errorMessage: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    
    if (!allowedTypes.includes(file.type)) {
      setError(errorMessage);
      return;
    }
    
    if (file.size > 50 * 1024 * 1024) {
      setError('File must be less than 50MB');
      return;
    }
    
    setError(''); // Clear any previous errors
    setFile(file);
  };
  
  const handleBookFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e, 
      setBookFile, 
      ['application/pdf', 'application/epub+zip'], 
      'Book file must be a PDF or ePub'
    );
  };
  
  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e, 
      setAudioFile, 
      ['audio/mpeg', 'audio/wav'], 
      'Audio file must be MP3 or WAV'
    );
  };
  
  const handleSampleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e, 
      setSampleFile, 
      ['application/pdf', 'application/epub+zip'], 
      'Sample file must be a PDF or ePub'
    );
  };
  
  const handleAudioSampleFileChange = (e: ChangeEvent<HTMLInputElement>) => {
    handleFileChange(
      e, 
      setAudioSampleFile, 
      ['audio/mpeg', 'audio/wav'], 
      'Audio sample file must be MP3 or WAV'
    );
  };
  
  const handleCategoryToggle = (category: string) => {
    setSelectedCategories(prev => 
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );
  };
  
  const validateForm = () => {
    if (!title.trim()) {
      setError('Title is required');
      return false;
    }
    
    if (!author.trim()) {
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
        setError('E-book file is required for ebook type');
        return false;
      }
    }
    
    if (type === 'audio' || type === 'both') {
      if (!audioFile) {
        setError('Audio file is required for audio type');
        return false;
      }
    }
    
    if (selectedCategories.length === 0) {
      setError('At least one category is required');
      return false;
    }
    
    return true;
  };
  
  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setPrice('');
    setType('ebook');
    setSelectedCategories([]);
    setCoverFile(null);
    setCoverPreview('');
    setBookFile(null);
    setAudioFile(null);
    setSampleFile(null);
    setAudioSampleFile(null);
  };
  
  const uploadBook = async () => {
    try {
      // Create FormData for file upload
      const formData = new FormData();
      
      // Add text fields
      formData.append('title', title.trim());
      formData.append('author', author.trim());
      formData.append('description', description.trim());
      formData.append('price', price);
      formData.append('type', type);
      formData.append('categories', JSON.stringify(selectedCategories));
      
      // Add files based on the multer field names from your controller
      if (coverFile) {
        formData.append('cover', coverFile);
      }
      
      if (bookFile) {
        formData.append('book', bookFile);
      }
      
      if (audioFile) {
        formData.append('audio', audioFile);
      }
      
      if (sampleFile) {
        formData.append('sample', sampleFile);
      }
      
      if (audioSampleFile) {
        formData.append('audioSample', audioSampleFile);
      }
      
      // Get auth token from localStorage (adjust based on your auth implementation)
      const token = localStorage.getItem('authToken') || localStorage.getItem('token');
      
      const response = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        credentials: 'include',
        headers: {
          // Don't set Content-Type for FormData, let the browser set it with boundary
          ...(token && { 'Authorization': `Bearer ${token}` })
        },
        body: formData
      });
      
      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || `HTTP error! status: ${response.status}`);
      }
      
      const data = await response.json();
      
      setSuccess('Book uploaded successfully!');
      resetForm();
      
      // In a real app, you might want to redirect or update the parent component
      console.log('Book created:', data.book);
      
    } catch (error) {
      console.error('Upload error:', error);
      
      // Handle different types of errors
      const errorMessage = error instanceof Error ? error.message : 'Unknown error occurred';
      const errorName = error instanceof Error ? error.name : '';
      
      if (errorName === 'TypeError' && errorMessage.includes('fetch')) {
        setError('Unable to connect to server. Please check if the backend is running.');
      } else if (errorMessage.includes('401')) {
        setError('Authentication required. Please login again.');
      } else if (errorMessage.includes('413')) {
        setError('File too large. Please reduce file size and try again.');
      } else {
        setError(errorMessage || 'Failed to upload book. Please try again.');
      }
    }
  };
  
  const handleSubmit = async (e: React.MouseEvent<HTMLButtonElement>) => {
    e.preventDefault();
    setError('');
    setSuccess('');
    
    if (!validateForm()) {
      return;
    }
    
    setIsLoading(true);
    
    try {
      await uploadBook();
    } finally {
      setIsLoading(false);
    }
  };
  
  const handleCancel = () => {
    resetForm();
    setError('');
    setSuccess('');
    // In a real app: navigate('/writer');
    console.log('Upload cancelled');
  };
  
  const removeFile = (
    setter: React.Dispatch<React.SetStateAction<File | null>>, 
    previewSetter?: React.Dispatch<React.SetStateAction<string>>
  ) => {
    setter(null);
    if (previewSetter) previewSetter('');
    setError(''); // Clear any file-related errors
  };
  
  return (
    <div className="max-w-4xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Book</h1>
      
      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md">
          <div className="flex items-center">
            <AlertCircle className="h-5 w-5 text-red-500 mr-2 flex-shrink-0" />
            <p className="text-red-700">{error}</p>
          </div>
        </div>
      )}
      
      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md">
          <div className="flex items-center">
            <CheckCircle className="h-5 w-5 text-green-500 mr-2 flex-shrink-0" />
            <p className="text-green-700">{success}</p>
          </div>
        </div>
      )}
      
      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
          <div className="col-span-1 md:col-span-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Information</h2>
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Title *
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter book title"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Author *
            </label>
            <input
              type="text"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={author}
              onChange={(e) => setAuthor(e.target.value)}
              placeholder="Enter author name"
            />
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Description
            </label>
            <textarea
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              rows={4}
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Enter book description"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Price ($) *
            </label>
            <input
              type="number"
              min="0.01"
              step="0.01"
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={price}
              onChange={(e) => setPrice(e.target.value)}
              placeholder="0.00"
            />
          </div>
          
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-1">
              Book Type *
            </label>
            <select
              className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              value={type}
              onChange={(e) => setType(e.target.value as BookType)}
            >
              <option value="ebook">E-book Only</option>
              <option value="audio">Audio Book Only</option>
              <option value="both">Both E-book and Audio</option>
            </select>
          </div>
          
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Categories *
            </label>
            {categoriesLoading ? (
              <div className="text-sm text-gray-500">Loading categories...</div>
            ) : categoriesError ? (
              <div className="text-sm text-red-500">Error loading categories: {categoriesError}</div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {categories.map((category) => (
                  <button
                    key={category.id}
                    type="button"
                    onClick={() => handleCategoryToggle(category.name)}
                    className={`px-3 py-1 rounded-full text-sm transition-colors ${
                      selectedCategories.includes(category.name)
                        ? 'bg-blue-100 text-blue-800 border border-blue-200'
                        : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                    }`}
                  >
                    {category.name}
                  </button>
                ))}
                {/* Render child categories if any */}
                {categories.filter(cat => cat.children && cat.children.length > 0).map(parent => 
                  parent.children?.map((child) => (
                    <button
                      key={child.id}
                      type="button"
                      onClick={() => handleCategoryToggle(child.name)}
                      className={`px-3 py-1 rounded-full text-sm transition-colors ${
                        selectedCategories.includes(child.name)
                          ? 'bg-blue-100 text-blue-800 border border-blue-200'
                          : 'bg-white text-gray-600 border border-gray-300 hover:bg-gray-50'
                      }`}
                      title={`${parent.name} > ${child.name}`}
                    >
                      {child.name}
                    </button>
                  ))
                )}
              </div>
            )}
            <p className="text-xs text-gray-500 mt-2">Select at least one category</p>
          </div>
          
          <div className="col-span-1 md:col-span-2 border-t border-gray-200 pt-6 mt-2">
            <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Files</h2>
          </div>
          
          {/* Cover Image Upload */}
          <div className="col-span-1 md:col-span-2">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Book Cover Image *
            </label>
            <div className="flex items-start space-x-4">
              <div className="flex-shrink-0 w-32 h-40 border-2 border-dashed rounded-lg border-gray-300 overflow-hidden flex items-center justify-center relative bg-gray-50">
                {coverPreview ? (
                  <>
                    <img 
                      src={coverPreview} 
                      alt="Cover preview" 
                      className="w-full h-full object-cover" 
                    />
                    <button
                      type="button"
                      onClick={() => removeFile(setCoverFile, setCoverPreview)}
                      className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90 transition-opacity"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </>
                ) : (
                  <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-gray-100 transition-colors">
                    <ImagePlus className="h-8 w-8 text-gray-400" />
                    <span className="text-xs text-gray-500 mt-1 text-center">Click to add cover</span>
                    <input
                      type="file"
                      className="hidden"
                      accept="image/jpeg,image/png"
                      onChange={handleCoverChange}
                    />
                  </label>
                )}
              </div>
              <div className="flex-grow">
                <p className="text-sm text-gray-600">
                  Upload a high-quality cover image (JPEG or PNG). 
                  Recommended aspect ratio is 2:3 (e.g., 400x600px). 
                  Maximum file size: 50MB.
                </p>
                {coverFile && (
                  <p className="text-xs text-green-600 mt-1">
                    ✓ {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                  </p>
                )}
              </div>
            </div>
          </div>
          
          {/* E-book file upload */}
          {(type === 'ebook' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                E-book File (PDF/ePub) *
              </label>
              <div 
                className={`flex items-center justify-center h-16 px-4 w-full rounded-md border-2 border-dashed transition-colors ${
                  bookFile ? 'border-blue-300 bg-blue-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {bookFile ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-blue-500 mr-2" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{bookFile.name}</span>
                        <p className="text-xs text-gray-500">
                          {(bookFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(setBookFile)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center cursor-pointer w-full justify-center hover:bg-gray-50 transition-colors h-full">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose E-book File (PDF or ePub)</span>
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
          )}
          
          {/* Sample file upload */}
          {(type === 'ebook' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Sample File (Optional)
              </label>
              <div 
                className={`flex items-center justify-center h-16 px-4 w-full rounded-md border-2 border-dashed transition-colors ${
                  sampleFile ? 'border-green-300 bg-green-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {sampleFile ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <FileText className="h-5 w-5 text-green-500 mr-2" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{sampleFile.name}</span>
                        <p className="text-xs text-gray-500">
                          {(sampleFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(setSampleFile)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center cursor-pointer w-full justify-center hover:bg-gray-50 transition-colors h-full">
                    <FileText className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose Sample File (PDF or ePub)</span>
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
          )}
          
          {/* Audio file upload */}
          {(type === 'audio' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio File (MP3/WAV) *
              </label>
              <div 
                className={`flex items-center justify-center h-16 px-4 w-full rounded-md border-2 border-dashed transition-colors ${
                  audioFile ? 'border-purple-300 bg-purple-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {audioFile ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5 text-purple-500 mr-2" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{audioFile.name}</span>
                        <p className="text-xs text-gray-500">
                          {(audioFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(setAudioFile)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center cursor-pointer w-full justify-center hover:bg-gray-50 transition-colors h-full">
                    <Headphones className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose Audio File (MP3 or WAV)</span>
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
          )}
          
          {/* Audio sample file upload */}
          {(type === 'audio' || type === 'both') && (
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Audio Sample File (Optional)
              </label>
              <div 
                className={`flex items-center justify-center h-16 px-4 w-full rounded-md border-2 border-dashed transition-colors ${
                  audioSampleFile ? 'border-orange-300 bg-orange-50' : 'border-gray-300 hover:border-gray-400'
                }`}
              >
                {audioSampleFile ? (
                  <div className="flex items-center justify-between w-full">
                    <div className="flex items-center">
                      <Headphones className="h-5 w-5 text-orange-500 mr-2" />
                      <div>
                        <span className="text-sm text-gray-700 font-medium">{audioSampleFile.name}</span>
                        <p className="text-xs text-gray-500">
                          {(audioSampleFile.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                    </div>
                    <button
                      type="button"
                      onClick={() => removeFile(setAudioSampleFile)}
                      className="text-gray-500 hover:text-gray-700 transition-colors"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                ) : (
                  <label className="flex items-center cursor-pointer w-full justify-center hover:bg-gray-50 transition-colors h-full">
                    <Headphones className="h-5 w-5 text-gray-400 mr-2" />
                    <span className="text-sm text-gray-500">Choose Audio Sample (MP3 or WAV)</span>
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
          )}
          
          <div className="col-span-1 md:col-span-2 flex justify-end space-x-4 mt-8 pt-6 border-t border-gray-200">
            <button
              type="button"
              className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors"
              onClick={handleCancel}
              disabled={isLoading}
            >
              Cancel
            </button>
            <button
              type="button"
              onClick={handleSubmit}
              disabled={isLoading || !title || !author || !price || !coverFile || selectedCategories.length === 0}
              className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
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
      </div>
      
      {/* Upload Progress Info */}
      {isLoading && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">
            Uploading files and creating book record... This may take a few moments for large files.
          </p>
        </div>
      )}
    </div>
  );
};

export default BookUploadPage;