import React, { useState, ChangeEvent } from 'react';
import {
  Upload,
  ImagePlus,
  FileText,
  Headphones,
  X,
  AlertCircle,
  CheckCircle,
  Calendar,
  Tag,
  BookOpen,
  Users
} from 'lucide-react';
import { useCategories } from '../../../hooks/useCategories';

type BookType = 'ebook' | 'audio' | 'both';
type ContentRating = 'all-ages' | '13+' | '16+' | '18+';
type PublicationStatus = 'draft' | 'scheduled' | 'published';

const BookUploadPage: React.FC = () => {
  const [isLoading, setIsLoading] = useState<boolean>(false);
  const [error, setError] = useState<string>('');
  const [success, setSuccess] = useState<string>('');

  const { categories, loading: categoriesLoading, error: categoriesError } = useCategories({
    includeChildren: true
  });

  /* ---------- ORIGINAL FORM STATE ---------- */
  const [title, setTitle] = useState<string>('');
  const [author, setAuthor] = useState<string>('');
  const [description, setDescription] = useState<string>('');
  const [price, setPrice] = useState<string>('');
  const [type, setType] = useState<BookType>('ebook');
  const [language, setLanguage] = useState<string>('en');
  const [isbn, setIsbn] = useState<string>('');
  const [publicationDate, setPublicationDate] = useState<string>('');
  const [tags, setTags] = useState<string>('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);

  /* ---------- NEW ENHANCED FIELDS ---------- */
  const [publisher, setPublisher] = useState<string>('');
  const [genre, setGenre] = useState<string>('');
  const [subgenre, setSubgenre] = useState<string>('');
  const [targetAudience, setTargetAudience] = useState<string>('adults');
  const [contentRating, setContentRating] = useState<ContentRating>('all-ages');
  const [pageCount, setPageCount] = useState<string>('');
  const [duration, setDuration] = useState<string>(''); // in minutes
  const [keywords, setKeywords] = useState<string>('');
  const [seriesName, setSeriesName] = useState<string>('');
  const [seriesNumber, setSeriesNumber] = useState<string>('');
  const [edition, setEdition] = useState<string>('');
  const [originalLanguage, setOriginalLanguage] = useState<string>('');
  const [copyrightYear, setCopyrightYear] = useState<string>('');
  const [contentWarnings, setContentWarnings] = useState<string>('');
  const [publicationStatus, setPublicationStatus] = useState<PublicationStatus>('draft');
  const [scheduledReleaseDate, setScheduledReleaseDate] = useState<string>('');

  /* ---------- FILE STATE ---------- */
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [coverPreview, setCoverPreview] = useState<string>('');
  const [bookFile, setBookFile] = useState<File | null>(null);
  const [audioFile, setAudioFile] = useState<File | null>(null);
  const [sampleFile, setSampleFile] = useState<File | null>(null);
  const [audioSampleFile, setAudioSampleFile] = useState<File | null>(null);

  /* ---------- HANDLERS ---------- */
  const handleCoverChange = (e: ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!file.type.startsWith('image/')) return setError('Cover must be an image (JPEG or PNG)');
    if (file.size > 50 * 1024 * 1024) return setError('Cover file must be less than 50 MB');
    setError('');
    setCoverFile(file);
    const reader = new FileReader();
    reader.onloadend = () => setCoverPreview(reader.result as string);
    reader.readAsDataURL(file);
  };

  const handleFileChange = (
    e: ChangeEvent<HTMLInputElement>,
    setFile: React.Dispatch<React.SetStateAction<File | null>>,
    allowedTypes: string[],
    errorMsg: string
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;
    if (!allowedTypes.includes(file.type)) return setError(errorMsg);
    if (file.size > 50 * 1024 * 1024) return setError('File must be less than 50 MB');
    setError('');
    setFile(file);
  };

  const handleBookFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setBookFile, ['application/pdf', 'application/epub+zip'], 'Book file must be a PDF or ePub');

  const handleAudioFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setAudioFile, ['audio/mpeg', 'audio/wav'], 'Audio file must be MP3 or WAV');

  const handleSampleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setSampleFile, ['application/pdf', 'application/epub+zip'], 'Sample file must be a PDF or ePub');

  const handleAudioSampleFileChange = (e: ChangeEvent<HTMLInputElement>) =>
    handleFileChange(e, setAudioSampleFile, ['audio/mpeg', 'audio/wav'], 'Audio sample must be MP3 or WAV');

  const handleCategoryToggle = (category: string) =>
    setSelectedCategories(prev =>
      prev.includes(category)
        ? prev.filter(c => c !== category)
        : [...prev, category]
    );

  const validateForm = () => {
    if (!title.trim()) return setError('Title is required');
    if (!author.trim()) return setError('Author is required');
    if (!price || isNaN(Number(price)) || Number(price) <= 0) return setError('Valid price is required');
    if (!language.trim()) return setError('Language is required');
    if (!genre.trim()) return setError('Genre is required');
    if (!targetAudience.trim()) return setError('Target audience is required');
    if (!coverFile) return setError('Cover image is required');
    if ((type === 'ebook' || type === 'both') && !bookFile) return setError('E-book file is required');
    if ((type === 'audio' || type === 'both') && !audioFile) return setError('Audio file is required');
    if (selectedCategories.length === 0) return setError('At least one category is required');
    if (publicationStatus === 'scheduled' && !scheduledReleaseDate) return setError('Scheduled release date is required');
    return true;
  };

  const resetForm = () => {
    setTitle('');
    setAuthor('');
    setDescription('');
    setPrice('');
    setType('ebook');
    setLanguage('en');
    setIsbn('');
    setPublicationDate('');
    setTags('');
    setSelectedCategories([]);
    // Enhanced fields
    setPublisher('');
    setGenre('');
    setSubgenre('');
    setTargetAudience('adults');
    setContentRating('all-ages');
    setPageCount('');
    setDuration('');
    setKeywords('');
    setSeriesName('');
    setSeriesNumber('');
    setEdition('');
    setOriginalLanguage('');
    setCopyrightYear('');
    setContentWarnings('');
    setPublicationStatus('draft');
    setScheduledReleaseDate('');
    // Files
    setCoverFile(null);
    setCoverPreview('');
    setBookFile(null);
    setAudioFile(null);
    setSampleFile(null);
    setAudioSampleFile(null);
  };

  const uploadBook = async () => {
    if (!validateForm()) return;
    setIsLoading(true);
    setError('');
    setSuccess('');

    const formData = new FormData();
    // Original fields
    formData.append('title', title.trim());
    formData.append('author', author.trim());
    formData.append('description', description.trim());
    formData.append('price', price);
    formData.append('type', type);
    formData.append('language', language);
    formData.append('isbn', isbn.trim());
    formData.append('publication_date', publicationDate);
    formData.append('tags', tags.trim());
    formData.append('categories', JSON.stringify(selectedCategories));

    // Enhanced fields
    formData.append('publisher', publisher.trim());
    formData.append('genre', genre.trim());
    formData.append('subgenre', subgenre.trim());
    formData.append('target_audience', targetAudience);
    formData.append('content_rating', contentRating);
    formData.append('page_count', pageCount);
    formData.append('duration', duration);
    formData.append('keywords', keywords.trim());
    formData.append('series_name', seriesName.trim());
    formData.append('series_number', seriesNumber);
    formData.append('edition', edition.trim());
    formData.append('original_language', originalLanguage);
    formData.append('copyright_year', copyrightYear);
    formData.append('content_warnings', contentWarnings.trim());
    formData.append('publication_status', publicationStatus);
    formData.append('scheduled_release_date', scheduledReleaseDate);

    // Files
    if (coverFile) formData.append('cover', coverFile);
    if (bookFile) formData.append('book', bookFile);
    if (audioFile) formData.append('audio', audioFile);
    if (sampleFile) formData.append('sample', sampleFile);
    if (audioSampleFile) formData.append('audioSample', audioSampleFile);

    try {
      // Get user token with error handling
      const userStr = localStorage.getItem('user');
      const token = userStr ? JSON.parse(userStr).token : null;

      const res = await fetch('http://localhost:5000/api/books', {
        method: 'POST',
        credentials: 'include',
        headers: { ...(token && { Authorization: `Bearer ${token}` }) },
        body: formData
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Upload failed');
      setSuccess('Book uploaded successfully!');
      resetForm();
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="max-w-5xl mx-auto p-6">
      <h1 className="text-2xl font-bold text-gray-900 mb-6">Upload New Book</h1>

      {error && (
        <div className="mb-6 bg-red-50 border-l-4 border-red-500 p-4 rounded-md flex items-center">
          <AlertCircle className="h-5 w-5 text-red-500 mr-2" />
          <p className="text-red-700">{error}</p>
        </div>
      )}

      {success && (
        <div className="mb-6 bg-green-50 border-l-4 border-green-500 p-4 rounded-md flex items-center">
          <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
          <p className="text-green-700">{success}</p>
        </div>
      )}

      <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-6">
        {/* Basic Information Section */}
        <div className="mb-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-blue-600" />
            Basic Information
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Title *</label>
              <input 
                value={title} 
                onChange={e => setTitle(e.target.value)} 
                placeholder="Enter book title" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Author *</label>
              <input 
                value={author} 
                onChange={e => setAuthor(e.target.value)} 
                placeholder="Enter author name" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publisher</label>
              <input 
                value={publisher} 
                onChange={e => setPublisher(e.target.value)} 
                placeholder="Publishing house name" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Edition</label>
              <input 
                value={edition} 
                onChange={e => setEdition(e.target.value)} 
                placeholder="e.g., First Edition, Revised" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Description *</label>
              <textarea 
                rows={4} 
                value={description} 
                onChange={e => setDescription(e.target.value)} 
                placeholder="Enter book description" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Price ($) *</label>
              <input 
                type="number" 
                min="0.01" 
                step="0.01" 
                value={price} 
                onChange={e => setPrice(e.target.value)} 
                placeholder="0.00" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Type *</label>
              <select 
                value={type} 
                onChange={e => setType(e.target.value as BookType)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="ebook">E-book Only</option>
                <option value="audio">Audio Book Only</option>
                <option value="both">Both E-book and Audio</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Language *</label>
              <select 
                value={language} 
                onChange={e => setLanguage(e.target.value)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Original Language (if translation)</label>
              <select 
                value={originalLanguage} 
                onChange={e => setOriginalLanguage(e.target.value)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Not a translation</option>
                <option value="en">English</option>
                <option value="fr">Français</option>
                <option value="es">Español</option>
                <option value="de">Deutsch</option>
                <option value="ar">العربية</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">ISBN</label>
              <input 
                value={isbn} 
                onChange={e => setIsbn(e.target.value)} 
                placeholder="9781234567890" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publication Date</label>
              <input 
                type="date" 
                value={publicationDate} 
                onChange={e => setPublicationDate(e.target.value)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Copyright Year</label>
              <input 
                type="number" 
                min="1900" 
                max={new Date().getFullYear()} 
                value={copyrightYear} 
                onChange={e => setCopyrightYear(e.target.value)} 
                placeholder={new Date().getFullYear().toString()} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Classification & Audience Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-purple-600" />
            Classification & Audience
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Genre *</label>
              <select 
                value={genre} 
                onChange={e => setGenre(e.target.value)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="">Select genre</option>
                <option value="fiction">Fiction</option>
                <option value="non-fiction">Non-Fiction</option>
                <option value="mystery">Mystery</option>
                <option value="romance">Romance</option>
                <option value="thriller">Thriller</option>
                <option value="fantasy">Fantasy</option>
                <option value="sci-fi">Science Fiction</option>
                <option value="biography">Biography</option>
                <option value="self-help">Self Help</option>
                <option value="business">Business</option>
                <option value="history">History</option>
                <option value="children">Children's</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Subgenre</label>
              <input 
                value={subgenre} 
                onChange={e => setSubgenre(e.target.value)} 
                placeholder="e.g., Urban Fantasy, Historical Romance" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Target Audience *</label>
              <select 
                value={targetAudience} 
                onChange={e => setTargetAudience(e.target.value)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="children">Children (0-12)</option>
                <option value="young-adult">Young Adult (13-17)</option>
                <option value="adults">Adults (18+)</option>
                <option value="all-ages">All Ages</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Rating *</label>
              <select 
                value={contentRating} 
                onChange={e => setContentRating(e.target.value as ContentRating)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="all-ages">All Ages</option>
                <option value="13+">13+ (Teen)</option>
                <option value="16+">16+ (Mature)</option>
                <option value="18+">18+ (Adult Only)</option>
              </select>
            </div>

            <div className="col-span-1 md:col-span-2">
              <label className="block text-sm font-medium text-gray-700 mb-1">Content Warnings</label>
              <input 
                value={contentWarnings} 
                onChange={e => setContentWarnings(e.target.value)} 
                placeholder="e.g., violence, strong language, sexual content" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
              <p className="text-xs text-gray-500 mt-1">Comma-separated list of content warnings</p>
            </div>
          </div>
        </div>

        {/* Series Information */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <BookOpen className="h-5 w-5 mr-2 text-green-600" />
            Series Information (Optional)
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Series Name</label>
              <input 
                value={seriesName} 
                onChange={e => setSeriesName(e.target.value)} 
                placeholder="e.g., The Chronicles of Narnia" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Book Number in Series</label>
              <input 
                type="number" 
                min="1" 
                value={seriesNumber} 
                onChange={e => setSeriesNumber(e.target.value)} 
                placeholder="1" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
            </div>
          </div>
        </div>

        {/* Technical Details */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <FileText className="h-5 w-5 mr-2 text-orange-600" />
            Technical Details
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {(type === 'ebook' || type === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Page Count (approximate)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={pageCount} 
                  onChange={e => setPageCount(e.target.value)} 
                  placeholder="250" 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
            )}

            {(type === 'audio' || type === 'both') && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Duration (minutes)</label>
                <input 
                  type="number" 
                  min="1" 
                  value={duration} 
                  onChange={e => setDuration(e.target.value)} 
                  placeholder="480" 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Publication Settings */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Calendar className="h-5 w-5 mr-2 text-indigo-600" />
            Publication Settings
          </h2>
          
          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Publication Status *</label>
              <select 
                value={publicationStatus} 
                onChange={e => setPublicationStatus(e.target.value as PublicationStatus)} 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              >
                <option value="draft">Save as Draft</option>
                <option value="published">Publish Now</option>
                <option value="scheduled">Schedule for Later</option>
              </select>
            </div>

            {publicationStatus === 'scheduled' && (
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-1">Scheduled Release Date *</label>
                <input 
                  type="datetime-local" 
                  value={scheduledReleaseDate} 
                  onChange={e => setScheduledReleaseDate(e.target.value)} 
                  className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
                />
              </div>
            )}
          </div>
        </div>

        {/* Tags and Keywords */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <Tag className="h-5 w-5 mr-2 text-pink-600" />
            Tags & Keywords
          </h2>
          
          <div className="grid grid-cols-1 gap-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">Tags * (comma-separated)</label>
              <input 
                value={tags} 
                onChange={e => setTags(e.target.value)} 
                placeholder="fiction, thriller, romance" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
              <p className="text-xs text-gray-500 mt-1">User-facing tags that help readers find your book</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-1">SEO Keywords</label>
              <input 
                value={keywords} 
                onChange={e => setKeywords(e.target.value)} 
                placeholder="bestseller, mystery novel, crime fiction" 
                className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500" 
              />
              <p className="text-xs text-gray-500 mt-1">Keywords for search optimization (not visible to users)</p>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">Categories *</label>
              {categoriesLoading ? (
                <div className="text-sm text-gray-500">Loading categories...</div>
              ) : categoriesError ? (
                <div className="text-sm text-red-500">Error loading categories</div>
              ) : (
                <div className="flex flex-wrap gap-2">
                  {categories.map(cat => (
                    <button
                      key={cat.id}
                      type="button"
                      onClick={() => handleCategoryToggle(cat.name)}
                      className={`px-3 py-1 rounded-full text-sm border transition-colors ${
                        selectedCategories.includes(cat.name)
                          ? 'bg-blue-100 text-blue-800 border-blue-200'
                          : 'bg-white text-gray-600 border-gray-300 hover:bg-gray-50'
                      }`}
                    >
                      {cat.name}
                    </button>
                  ))}
                </div>
              )}
              <p className="text-xs text-gray-500 mt-1">Select at least one category</p>
            </div>
          </div>
        </div>

        {/* Cover Image Upload */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4 flex items-center">
            <ImagePlus className="h-5 w-5 mr-2 text-pink-600" />
            Book Cover *
          </h2>
          
          <div className="flex items-start space-x-4">
            <div className="flex-shrink-0 w-32 h-40 border-2 border-dashed rounded-lg border-gray-300 overflow-hidden flex items-center justify-center relative bg-gray-50">
              {coverPreview ? (
                <>
                  <img src={coverPreview} alt="Cover preview" className="w-full h-full object-cover" />
                  <button
                    type="button"
                    onClick={() => { setCoverFile(null); setCoverPreview(''); }}
                    className="absolute top-1 right-1 bg-gray-800 bg-opacity-70 rounded-full p-1 text-white hover:bg-opacity-90 transition-opacity"
                  >
                    <X className="h-4 w-4" />
                  </button>
                </>
              ) : (
                <label className="flex flex-col items-center justify-center cursor-pointer w-full h-full hover:bg-gray-100 transition-colors">
                  <ImagePlus className="h-8 w-8 text-gray-400" />
                  <span className="text-xs text-gray-500 mt-1 text-center">Click to add cover</span>
                  <input type="file" className="hidden" accept="image/*" onChange={handleCoverChange} />
                </label>
              )}
            </div>
            <div className="flex-grow">
              <p className="text-sm text-gray-600">
                Upload a high-quality cover image (JPEG or PNG). Recommended aspect ratio is 2:3 (e.g., 600x900px). Max 50 MB.
              </p>
              {coverFile && (
                <p className="text-xs text-green-600 mt-1">
                  ✓ {coverFile.name} ({(coverFile.size / 1024 / 1024).toFixed(2)} MB)
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Book Files Section */}
        <div className="mb-8 border-t border-gray-200 pt-8">
          <h2 className="text-lg font-semibold text-gray-900 mb-4">Book Files</h2>
          
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* E-book file upload */}
            {(type === 'ebook' || type === 'both') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">E-book File (PDF/ePub) *</label>
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
                            <p className="text-xs text-gray-500">{(bookFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setBookFile(null)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Sample File (Optional)</label>
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
                            <p className="text-xs text-gray-500">{(sampleFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setSampleFile(null)}
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
              </>
            )}

            {/* Audio file upload */}
            {(type === 'audio' || type === 'both') && (
              <>
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio File (MP3/WAV) *</label>
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
                            <p className="text-xs text-gray-500">{(audioFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAudioFile(null)}
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

                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">Audio Sample File (Optional)</label>
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
                            <p className="text-xs text-gray-500">{(audioSampleFile.size / 1024 / 1024).toFixed(2)} MB</p>
                          </div>
                        </div>
                        <button
                          type="button"
                          onClick={() => setAudioSampleFile(null)}
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
              </>
            )}
          </div>
        </div>

        {/* Action Buttons */}
        <div className="flex justify-end space-x-4 pt-6 border-t border-gray-200">
          <button
            type="button"
            onClick={resetForm}
            disabled={isLoading}
            className="px-6 py-2 text-gray-700 bg-white border border-gray-300 rounded-md shadow-sm hover:bg-gray-50 transition-colors disabled:opacity-50 disabled:cursor-not-allowed"
          >
            Cancel
          </button>
          <button
            type="button"
            onClick={uploadBook}
            disabled={isLoading}
            className="px-6 py-2 bg-blue-600 text-white rounded-md shadow-sm hover:bg-blue-700 disabled:opacity-50 disabled:cursor-not-allowed flex items-center justify-center transition-colors"
          >
            {isLoading ? (
              <>
                <svg className="animate-spin h-5 w-5 mr-2" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
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

      {isLoading && (
        <div className="mt-4 bg-blue-50 border border-blue-200 rounded-md p-4">
          <p className="text-sm text-blue-700">Uploading files and creating book record… please wait.</p>
        </div>
      )}
    </div>
  );
};

export default BookUploadPage;