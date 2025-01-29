import React, { useEffect, useState } from 'react';
import { X, Edit2 } from 'lucide-react';
import { Content } from '../../lib/content';
import { useNavigate } from 'react-router-dom';
import { formatDate } from '../../lib/dates'
import { getUserProfile } from '../../lib/profile';

interface EventPreviewProps {
  event: Content;
  onClose: () => void;
}

export const EventPreview: React.FC<EventPreviewProps> = ({ event, onClose }) => {
  const navigate = useNavigate();
  const [userTimezone, setUserTimezone] = React.useState<string>('UTC');
  const [isLoading, setIsLoading] = React.useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        setIsLoading(true);
        const profile = await getUserProfile();
        setUserTimezone(profile.timezone);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoading(false);
      }
    };
    fetchUserProfile();
  }, []);
  
  const truncatedDescription = event.description.length > 100 
    ? `${event.description.slice(0, 100)}...` 
    : event.description;

  const handleEdit = () => {
    navigate(`/dashboard/add?edit=${event.id}`);
    onClose();
  };

  return (
    <div className="fixed inset-0 bg-black/20 flex items-center justify-center z-50" onClick={onClose}>
      <div 
        className="bg-white rounded-lg shadow-lg w-full max-w-md m-4" 
        onClick={e => e.stopPropagation()}
      >
        <div className="flex items-center justify-between p-4 border-b border-gray-200 gap-4">
          <h3 className="text-lg font-semibold text-gray-900">{event.title}</h3>
          <div className="flex items-center gap-2">
            <button
              onClick={handleEdit}
              className="p-2 text-gray-600 hover:text-[#6C5CE7] rounded-md hover:bg-gray-100 transition-colors"
              title="Edit content"
            >
              <Edit2 className="h-4 w-4" />
            </button>
            <button
              onClick={onClose}
              className="p-2 text-gray-400 hover:text-gray-500 rounded-md hover:bg-gray-100 transition-colors"
              title="Close preview"
            >
              <X className="h-4 w-4" />
            </button>
          </div>
        </div>
        
        <div className="p-4 space-y-4">
          <div>
            <p className="text-sm font-medium text-gray-500">Type</p>
            <p className="mt-1 text-gray-900 capitalize">{event.type}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Platform</p>
            <p className="mt-1 text-gray-900 capitalize">{event.platform}</p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Scheduled Date</p>
            <p className="mt-1 text-gray-900">
              {isLoading ? (
                <span className="inline-block w-32 h-5 bg-gray-200 rounded animate-pulse" />
              ) : (
                formatDate(event.scheduled_date, userTimezone)
              )}
            </p>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Status</p>
            <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium capitalize mt-1
              ${event.status === 'published' ? 'bg-green-100 text-green-800' :
                event.status === 'scheduled' ? 'bg-blue-100 text-blue-800' :
                event.status === 'draft' ? 'bg-gray-100 text-gray-800' :
                'bg-red-100 text-red-800'
              }`}
            >
              {event.status}
            </span>
          </div>
          
          <div>
            <p className="text-sm font-medium text-gray-500">Description</p>
            <p className="mt-1 text-gray-900 whitespace-pre-wrap">
              {truncatedDescription}
            </p>
          </div>
          
          {event.image_url && (
            <div>
              <p className="text-sm font-medium text-gray-500">Image</p>
              <img
                src={event.image_url}
                alt={event.title}
                className="mt-2 rounded-md max-h-48 w-auto object-cover"
              />
            </div>
          )}
        </div>
      </div>
    </div>
  );
};