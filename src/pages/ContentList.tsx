import React, { useEffect, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { Edit2, Trash2, AlertCircle } from 'lucide-react';
import { getContent, deleteContent, updateContentStatus, Content } from '../lib/content';
import { formatDate } from '../lib/dates';
import { getUserProfile } from '../lib/profile';

export const ContentList: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = React.useState<Content[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [contentToDelete, setContentToDelete] = useState<Content | null>(null);
  const [deleteLoading, setDeleteLoading] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');
  const [isLoadingTimezone, setIsLoadingTimezone] = useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserTimezone(profile.timezone);
      } catch (err) {
        console.error('Error fetching user timezone:', err);
      } finally {
        setIsLoadingTimezone(false);
      }
    };

    fetchUserProfile();

    const fetchContent = async () => {
      try {
        const data = await getContent();
        setContent(data);
      } catch (err) {
        setError('Failed to load content');
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchContent();
  }, []);

  const handleDelete = async (content: Content) => {
    setContentToDelete(content);
    setShowDeleteConfirm(true);
  };

  const confirmDelete = async () => {
    if (!contentToDelete) return;

    try {
      setDeleteLoading(true);
      await deleteContent(contentToDelete.id);
      setContent(content.filter(item => item.id !== contentToDelete.id));
      setShowDeleteConfirm(false);
      setContentToDelete(null);
    } catch (err) {
      setError('Failed to delete content');
      console.error(err);
    } finally {
      setDeleteLoading(false);
    }
  };

  const handleStatusChange = async (id: string, status: Content['status']) => {
    try {
      await updateContentStatus(id, status);
      setContent(content.map(item => 
        item.id === id ? { ...item, status } : item
      ));
    } catch (err) {
      setError('Failed to update content status');
      console.error(err);
    }
  };

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Content List</h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm overflow-hidden">
          {loading ? (
            <div className="p-6 space-y-4">
              {[1, 2, 3].map(i => (
                <div key={i} className="animate-pulse">
                  <div className="h-16 bg-gray-200 rounded"></div>
                </div>
              ))}
            </div>
          ) : content.length === 0 ? (
            <div className="p-8 text-center">
              <p className="text-gray-500">No content found</p>
              <button
                onClick={() => navigate('/dashboard/add')}
                className="mt-4 text-[#6C5CE7] hover:text-[#6C5CE7]/90"
              >
                Create your first content
              </button>
            </div>
          ) : (
            <div className="overflow-x-auto min-w-full">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="text-left py-4 px-4 md:px-6 font-medium text-gray-600 whitespace-nowrap">Title</th>
                    <th className="text-left py-4 px-4 md:px-6 font-medium text-gray-600 hidden md:table-cell">Type</th>
                    <th className="text-left py-4 px-4 md:px-6 font-medium text-gray-600 hidden md:table-cell">Platform</th>
                    <th className="text-left py-4 px-4 md:px-6 font-medium text-gray-600">Schedule</th>
                    <th className="text-left py-4 px-4 md:px-6 font-medium text-gray-600">Status</th>
                    <th className="text-right py-4 px-4 md:px-6 font-medium text-gray-600">Actions</th>
                  </tr>
                </thead>
                <tbody>
                  {content.map(item => (
                    <tr key={item.id} className="border-b border-gray-200 hover:bg-gray-50 transition-colors">
                      <td className="py-4 px-4 md:px-6">
                        <div className="flex items-center">
                          <div className={`w-2 h-2 rounded-full mr-3 ${
                            item.status === 'published' ? 'bg-green-500' :
                            item.status === 'scheduled' ? 'bg-blue-500' :
                            item.status === 'draft' ? 'bg-gray-400' :
                            'bg-red-500'
                          }`} />
                          <span className="font-medium text-gray-900">{item.title}</span>
                        </div>
                      </td>
                      <td className="py-4 px-4 md:px-6 capitalize hidden md:table-cell text-gray-600">{item.type}</td>
                      <td className="py-4 px-4 md:px-6 capitalize hidden md:table-cell text-gray-600">{item.platform}</td>
                      <td className="py-4 px-4 md:px-6 text-gray-600">
                        <span className={item.scheduled_date ? '' : 'text-gray-400 italic'}>
                          {isLoadingTimezone ? (
                            <span className="inline-block w-32 h-4 bg-gray-200 rounded animate-pulse" />
                          ) : (
                            formatDate(item.scheduled_date, userTimezone)
                          )}
                        </span>
                      </td>
                      <td className="py-4 px-4 md:px-6">
                        <select
                          value={item.status}
                          onChange={(e) => handleStatusChange(item.id, e.target.value as Content['status'])}
                          className={`px-3 py-1.5 rounded-full text-sm font-medium border ${
                            item.status === 'published' ? 'bg-green-50 border-green-200 text-green-700' :
                            item.status === 'scheduled' ? 'bg-blue-50 border-blue-200 text-blue-700' :
                            item.status === 'draft' ? 'bg-gray-50 border-gray-200 text-gray-700' :
                            'bg-red-50 border-red-200 text-red-700'
                          }`}
                        >
                          <option value="draft">Draft</option>
                          <option value="scheduled">Scheduled</option>
                          <option value="published">Published</option>
                          <option value="archived">Archived</option>
                        </select>
                      </td>
                      <td className="py-4 px-6">
                        <div className="flex items-center justify-end gap-2">
                          <button
                            onClick={() => navigate(`/dashboard/add?edit=${item.id}`)}
                            className="p-2 text-gray-600 hover:text-[#6C5CE7] rounded-md hover:bg-white/75"
                            title="Edit content"
                          >
                            <Edit2 className="h-4 w-4" />
                          </button>
                          <button
                            onClick={() => handleDelete(item)}
                            className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-white/75"
                            title="Delete content"
                          >
                            <Trash2 className="h-4 w-4" />
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>
      </div>

      {/* Delete Confirmation Modal */}
      {showDeleteConfirm && contentToDelete && (
        <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50 p-4">
          <div className="bg-white rounded-lg max-w-md w-full p-6 relative">
            <div className="absolute -top-12 left-1/2 -translate-x-1/2 bg-red-100 rounded-full p-3">
              <AlertCircle className="h-6 w-6 text-red-600" />
            </div>
            
            <div className="mt-2 text-center">
              <h3 className="text-lg font-semibold text-gray-900 mb-2">Delete Content</h3>
              <p className="text-gray-600">
                Are you sure you want to delete "{contentToDelete.title}"? This action cannot be undone.
              </p>
            </div>

            <div className="mt-6 flex justify-end gap-4">
              <button
                onClick={() => {
                  setShowDeleteConfirm(false);
                  setContentToDelete(null);
                }}
                className="px-4 py-2 text-gray-700 hover:bg-gray-100 rounded-md transition-colors"
                disabled={deleteLoading}
              >
                Cancel
              </button>
              <button
                onClick={confirmDelete}
                disabled={deleteLoading}
                className="px-4 py-2 bg-red-600 text-white rounded-md hover:bg-red-700 disabled:opacity-50 transition-colors inline-flex items-center"
              >
                {deleteLoading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-2 border-white border-t-transparent mr-2" />
                    Deleting...
                  </>
                ) : (
                  <>
                    <Trash2 className="h-4 w-4 mr-2" />
                    Delete
                  </>
                )}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};