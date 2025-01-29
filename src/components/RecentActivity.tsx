import React from 'react';
import { Content } from '../lib/content';
import { formatDate } from '../lib/dates';
import { getUserProfile } from '../lib/profile';

interface RecentActivityProps {
  content?: Content[] | null;
  loading?: boolean;
}

export const RecentActivity: React.FC<RecentActivityProps> = ({
  content,
  loading = false,
}) => {
  const [userTimezone, setUserTimezone] = React.useState<string>('UTC');
  const [isLoadingTimezone, setIsLoadingTimezone] = React.useState(true);

  React.useEffect(() => {
    const fetchUserProfile = async () => {
      try {
        const profile = await getUserProfile();
        setUserTimezone(profile.timezone);
      } catch (error) {
        console.error('Error fetching user profile:', error);
      } finally {
        setIsLoadingTimezone(false);
      }
    };
    fetchUserProfile();
  }, []);

  const recentContent = content
    ? content
      .sort((a, b) => new Date(b.updated_at).getTime() - new Date(a.updated_at).getTime())
      .slice(0, 5)
    : [];

  if (loading) {
    return (
      <div className="bg-white rounded-lg p-6 shadow-sm">
        <div className="animate-pulse space-y-4">
          <div className="h-6 bg-gray-200 rounded w-1/3" />
          <div className="space-y-3">
            {[1, 2, 3].map(i => (
              <div key={i} className="h-12 bg-gray-200 rounded" />
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg p-6 shadow-sm">
      <h2 className="text-lg font-semibold text-gray-900 mb-4">Recent Activity</h2>
      <div className="divide-y divide-gray-100">
        {recentContent.map(item => (
          <div key={item.id} className="py-3 first:pt-0 last:pb-0">
            <div className="flex items-center gap-3">
              <div className={`w-2 h-2 rounded-full ${
                item.status === 'published' ? 'bg-green-500' :
                item.status === 'scheduled' ? 'bg-blue-500' :
                item.status === 'draft' ? 'bg-gray-400' :
                'bg-red-500'
              }`} />
              <div>
                <h3 className="text-sm font-medium text-gray-900">{item.title}</h3>
                <p className="text-xs text-gray-500 mt-0.5">
                  {isLoadingTimezone ? (
                    <span className="inline-block w-24 h-3 bg-gray-200 rounded animate-pulse" />
                  ) : (
                    formatDate(item.scheduled_date, userTimezone)
                  )}
                </p>
              </div>
            </div>
          </div>
        ))}
        
        {recentContent.length === 0 && (
          <p className="text-sm text-gray-500 text-center py-4">
            No recent activity
          </p>
        )}
      </div>
    </div>
  );
};