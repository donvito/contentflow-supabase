import React, { useState, useEffect } from 'react';
import { Calendar } from './ui/Calendar';
import { Calendar as CalendarIcon, List } from 'lucide-react';
import { formatDate } from '../lib/dates';
import { getUserProfile } from '../lib/profile';
import { Content } from '../lib/content';

interface ContentScheduleProps {
  events?: Content[] | null;
  loading?: boolean;
  onEdit?: (id: string) => void;
  onDelete?: (id: string) => void;
}

export const ContentSchedule: React.FC<ContentScheduleProps> = ({
  events,
  loading = false,
  onEdit,
  onDelete,
}) => {
  const [view, setView] = useState<'calendar' | 'list'>('calendar');
  const [error, setError] = useState<string | null>(null);
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');

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

  if (loading) {
    return (
      <div className="bg-white rounded-lg shadow-sm p-6">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="h-[400px] bg-gray-200 rounded"></div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-sm p-6">
      <div className="flex justify-between items-center mb-6">
        <h2 className="text-xl font-semibold text-gray-900">Content Schedule</h2>
        <div className="flex gap-4">
          <div className="flex bg-gray-100 rounded-md p-1">
            <button
              onClick={() => setView('calendar')}
              className={`p-2 rounded-md ${
                view === 'calendar'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <CalendarIcon className="h-5 w-5" />
            </button>
            <button
              onClick={() => setView('list')}
              className={`p-2 rounded-md ${
                view === 'list'
                  ? 'bg-white shadow-sm'
                  : 'text-gray-600 hover:text-gray-900'
              }`}
            >
              <List className="h-5 w-5" />
            </button>
          </div>
        </div>
      </div>

      {view === 'calendar' ? (
        <Calendar events={events} />
      ) : (
        <div className="space-y-4">
          {events?.length === 0 && (
            <p className="text-center text-gray-500 py-8">
              No scheduled content yet
            </p>
          )}
          {events?.map(event => (
            <div
              key={event.id}
              className="flex items-center justify-between p-4 bg-gray-50 rounded-lg hover:bg-gray-100 transition-colors group"
            >
              <div className="flex items-center gap-3">
                <div
                  className={`w-2 h-2 rounded-full ${
                    event.status === 'published' ? 'bg-green-500' :
                    event.status === 'scheduled' ? 'bg-blue-500' :
                    event.status === 'draft' ? 'bg-gray-400' :
                    'bg-red-500'
                  }`}
                />
                <div>
                  <h3 className="font-medium text-gray-900">{event.title}</h3>
                  <div className="flex items-center gap-4 mt-1">
                    <span className="text-sm text-gray-500 capitalize">
                      {event.type}
                    </span>
                    <span className="text-sm text-gray-500 capitalize">
                      {event.platform}
                    </span>
                    <span className={`text-sm flex items-center gap-1 ${event.scheduled_date ? 'text-gray-500' : 'text-gray-400 italic'}`}>
                      {formatDate(event.scheduled_date, userTimezone)}
                    </span>
                  </div>
                </div>
              </div>
              <div className="flex gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                {onEdit && (
                  <button
                    onClick={() => onEdit(event.id)}
                    className="p-2 text-gray-600 hover:text-[#6C5CE7] rounded-md hover:bg-white"
                  >
                    Edit
                  </button>
                )}
                {onDelete && (
                  <button
                    onClick={() => {
                      if (window.confirm('Are you sure you want to delete this content?')) {
                        onDelete(event.id);
                      }
                    }}
                    className="p-2 text-gray-600 hover:text-red-600 rounded-md hover:bg-white"
                  >
                    Delete
                  </button>
                )}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};