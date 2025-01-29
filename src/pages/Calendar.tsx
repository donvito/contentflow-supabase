import React from 'react';
import { Calendar as CalendarComponent } from '../components/ui/Calendar';
import { getContent, Content } from '../lib/content';

export const Calendar: React.FC = () => {
  const [content, setContent] = React.useState<Content[]>([]);
  const [loading, setLoading] = React.useState(true);
  const [error, setError] = React.useState<string | null>(null);

  React.useEffect(() => {
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

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-2xl font-bold text-gray-900 mb-8">Content Calendar</h1>
        
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="bg-white rounded-lg shadow-sm p-6">
          {loading ? (
            <div className="animate-pulse space-y-4">
              <div className="h-8 bg-gray-200 rounded w-1/4"></div>
              <div className="h-[600px] bg-gray-200 rounded"></div>
            </div>
          ) : (
            <CalendarComponent
              events={content}
            />
          )}
        </div>
      </div>
    </div>
  );
};