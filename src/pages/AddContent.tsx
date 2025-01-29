import React, { useState, useEffect } from 'react';
import { useNavigate, useLocation } from 'react-router-dom';
import { X, Calendar, Trash2 } from 'lucide-react';
import { ContentFormData } from '../components/AddContentModal';
import { createContent, updateContent, getContent, uploadContentImage, Content, deleteContent } from '../lib/content';
import { formatForDateTimeLocal, getCurrentDateTime } from '../lib/dates';
import { getUserProfile } from '../lib/profile';

export const AddContent: React.FC = () => {
  const [userTimezone, setUserTimezone] = useState<string>('UTC');

  const navigate = useNavigate();
  const location = useLocation();
  const editId = new URLSearchParams(location.search).get('edit');
  const [uploading, setUploading] = useState(false);
  const [previewUrl, setPreviewUrl] = useState<string>();
  const [formData, setFormData] = useState<ContentFormData>({
    title: '',
    type: 'post',
    platform: 'instagram',
    scheduledDate: '',
    description: '',
    imageUrl: '',
  });
  const [status, setStatus] = useState<Content['status']>('draft');
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserTimezone(profile.timezone);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      }
    };
    fetchUserProfile();
  }, []);

  useEffect(() => {
    const fetchContent = async () => {
      if (!editId) return;
      setLoading(true);
      setError(null);

      try {
        const allContent = await getContent();
        const contentToEdit = allContent?.find(item => item.id === editId);

        if (contentToEdit) {
          console.log('Editing content:', contentToEdit);
          const formattedDate = contentToEdit.scheduled_date ? 
            formatForDateTimeLocal(contentToEdit.scheduled_date) : 
            '';
          
          console.log('Formatted date:', formattedDate);
          
          // Initialize form data
          const initialFormData = {
            title: contentToEdit.title,
            type: contentToEdit.type,
            platform: contentToEdit.platform,
            scheduledDate: formattedDate,
            description: contentToEdit.description || '',
            imageUrl: contentToEdit.image_url || ''
          };

          setStatus(contentToEdit.status);
          setFormData(initialFormData);

          if (contentToEdit.image_url) {
            setPreviewUrl(contentToEdit.image_url);
          }
        } else {
          setError('Content not found');
          navigate('/dashboard');
        }
      } catch (err) {
        setError('Failed to load content');
        console.error('Error loading content:', { error: err });
      } finally {
        setLoading(false);
      }
    };
    fetchContent();
  }, [editId]);

  if (loading) {
    return <div className="w-full min-h-screen bg-gray-50 p-8 flex items-center justify-center">
      <div className="animate-spin rounded-full h-8 w-8 border-2 border-[#6C5CE7] border-t-transparent"></div>
    </div>;
  }

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    try {
      console.log('Submitting form data:', formData);
      setError(null);
      setLoading(true);
      
      const updateData = {
        ...formData,
        status,
      };
      
      if (editId) {
        await updateContent(editId, updateData);
      } else {
        await createContent(formData);
      }
      navigate('/dashboard');
    } catch (err) {
      setError(`Failed to ${editId ? 'update' : 'create'} content`);
      console.error('Error saving content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleDelete = async () => {
    if (!editId) return;
    try {
      setError(null);
      setLoading(true);
      await deleteContent(editId);
      navigate('/dashboard');
    } catch (err) {
      setError('Failed to delete content');
      console.error('Error deleting content:', err);
    } finally {
      setLoading(false);
    }
  };

  const handleImageUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    try {
      setUploading(true);
      const url = await uploadContentImage(file);
      setFormData({ ...formData, imageUrl: url });
      setPreviewUrl(URL.createObjectURL(file));
    } catch (err) {
      setError('Failed to upload image');
      console.error('Error uploading image:', err);
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="w-full min-h-screen bg-gray-50 p-8">
      <div className="max-w-[1440px] mx-auto">
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 p-8">
          <div className="flex justify-between items-center mb-8">
            <h1 className="text-2xl font-semibold text-gray-900">
              {editId ? 'Edit Content' : 'Add New Content'}
            </h1>
            {editId && (
              <button
                onClick={() => setShowDeleteConfirm(true)}
                className="inline-flex items-center px-4 py-2 text-red-600 hover:text-red-700 hover:bg-red-50 rounded-md transition-colors"
              >
                <Trash2 className="h-5 w-5 mr-2" />
                Delete Content
              </button>
            )}
          </div>

          {error && (
            <div className="mb-8 p-3 bg-red-50 border border-red-200 text-red-600 rounded-md text-sm">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit}>
            <div className="space-y-8">
              <div>
                <label htmlFor="title" className="block text-sm font-medium text-gray-700 mb-2">
                  Title
                </label>
                <input
                  type="text"
                  id="title"
                  value={formData.title}
                  onChange={(e) => setFormData({ ...formData, title: e.target.value })}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="grid grid-cols-2 gap-8">
                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Content Type
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['post', 'video', 'article'] as const).map((type) => (
                      <button
                        key={type}
                        type="button"
                        onClick={() => setFormData({ ...formData, type })}
                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors flex-1 md:flex-none
                          ${formData.type === type
                            ? 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {type}
                      </button>
                    ))}
                  </div>
                </div>

                <div className="col-span-2 md:col-span-1">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Platform
                  </label>
                  <div className="flex flex-wrap gap-2">
                    {(['instagram', 'youtube', 'twitter', 'linkedin'] as const).map((platform) => (
                      <button
                        key={platform}
                        type="button"
                        onClick={() => setFormData({ ...formData, platform })}
                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors flex-1 md:flex-none
                          ${formData.platform === platform
                            ? 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {platform}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Image
                </label>
                <div className="flex items-center space-x-4">
                  <label className="cursor-pointer">
                    <input
                      type="file"
                      accept="image/*"
                      onChange={handleImageUpload}
                      disabled={uploading}
                      className="hidden"
                    />
                    <span className="px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700">
                      Choose file
                    </span>
                  </label>
                  <span className="text-sm text-gray-500">
                    {previewUrl ? 'Image selected' : 'No file chosen'}
                  </span>
                  {uploading && (
                    <div className="animate-spin rounded-full h-5 w-5 border-2 border-[#6C5CE7] border-t-transparent" />
                  )}
                </div>
                {previewUrl && (
                  <div className="mt-4 relative group">
                    <img
                      src={previewUrl}
                      alt="Preview"
                      className="h-32 w-auto object-cover rounded-md"
                    />
                    <button
                      type="button"
                      onClick={() => {
                        setPreviewUrl(undefined);
                        setFormData({ ...formData, imageUrl: '' });
                      }}
                      className="absolute top-2 right-2 p-1 bg-red-500 text-white rounded-full opacity-0 group-hover:opacity-100 transition-opacity hover:bg-red-600"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                )}
              </div>

              <div>
                <label htmlFor="scheduledDate" className="block text-sm font-medium text-gray-700 mb-2">
                  Schedule Date
                  <span className="text-sm text-gray-500 ml-1">(click calendar icon to open picker)</span>
                </label>
                <div className="relative">
                  <input
                    type="datetime-local"
                    id="scheduledDate"
                    value={formData.scheduledDate}
                    onChange={(e) => {
                      console.log('New date value:', e.target.value);
                      setFormData({ ...formData, scheduledDate: e.target.value });
                    }}
                    className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500 pr-10"
                  />
                  <button 
                    type="button"
                    onClick={() => {
                      const input = document.getElementById('scheduledDate') as HTMLInputElement;
                      input.showPicker();
                    }}
                    className="absolute right-3 top-2.5 text-gray-400 hover:text-gray-600 focus:outline-none"
                  >
                    <Calendar className="h-5 w-5 text-gray-400" />
                  </button>
                </div>
              </div>

              {editId && (
                <div>
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Status
                  </label>
                  <div className="flex space-x-4">
                    {(['draft', 'scheduled', 'published', 'archived'] as const).map((s) => (
                      <button
                        key={s}
                        type="button"
                        onClick={() => setStatus(s)}
                        className={`px-4 py-2 rounded-md text-sm font-medium capitalize transition-colors
                          ${status === s
                            ? s === 'published'
                              ? 'bg-green-100 border border-green-200 text-green-700'
                              : s === 'scheduled'
                              ? 'bg-indigo-100 border border-indigo-200 text-indigo-700'
                              : s === 'draft'
                              ? 'border border-gray-300 text-gray-700'
                              : 'border border-gray-300 text-gray-700'
                            : 'border border-gray-300 text-gray-700 hover:bg-gray-50'
                          }`}
                      >
                        {s}
                      </button>
                    ))}
                  </div>
                </div>
              )}

              <div>
                <label htmlFor="description" className="block text-sm font-medium text-gray-700 mb-2">
                  Description
                </label>
                <textarea
                  id="description"
                  value={formData.description}
                  onChange={(e) => setFormData({ ...formData, description: e.target.value })}
                  rows={4}
                  className="w-full px-4 py-2 border border-gray-300 rounded-md focus:ring-2 focus:ring-indigo-500 focus:border-indigo-500"
                  required
                />
              </div>

              <div className="flex justify-end space-x-4">
                <button
                  type="button"
                  disabled={loading}
                  onClick={() => navigate('/dashboard')}
                  className="w-full sm:w-auto px-4 py-2 border border-gray-300 rounded-md text-gray-700 hover:bg-gray-50 disabled:opacity-50"
                >
                  Cancel
                </button>
                <button
                  type="submit"
                  disabled={loading}
                  className="w-full sm:w-auto px-4 py-2 bg-indigo-600 text-white rounded-md hover:bg-indigo-700 disabled:opacity-50"
                >
                  {loading ? 'Saving...' : editId ? 'Update Content' : 'Schedule Content'}
                </button>
              </div>
            </div>
          </form>
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6">
            <h3 className="text-lg font-semibold text-gray-900 mb-4">Delete Content</h3>
            <p className="text-gray-600 mb-6">
              Are you sure you want to delete this content? This action cannot be undone.
            </p>
            <div className="flex justify-end gap-4">
              <button
                onClick={() => setShowDeleteConfirm(false)}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md"
              >
                Cancel
              </button>
              <button
                onClick={handleDelete}
                disabled={loading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50"
              >
                {loading ? 'Deleting...' : 'Delete'}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};