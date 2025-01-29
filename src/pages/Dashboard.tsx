import React, { useEffect, useState } from 'react';
import { Plus } from 'lucide-react';
import { useNavigate } from 'react-router-dom';
import { Button } from '../components/ui/Button';
import { ContentSchedule } from '../components/ContentSchedule';
import { StatsCard } from '../components/StatsCard';
import { RecentActivity } from '../components/RecentActivity';
import { Calendar as CalendarIcon, List, Clock, CheckCircle } from 'lucide-react';
import { getContent, deleteContent, Content } from '../lib/content';

export const Dashboard: React.FC = () => {
  const navigate = useNavigate();
  const [content, setContent] = useState<Content[] | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
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

  const handleEdit = (id: string) => {
    navigate(`/dashboard/add?edit=${id}`);
  };

  const handleDelete = async (id: string) => {
    try {
      setError(null);
      if (!content) return;
      await deleteContent(id);
      setContent(content.filter(item => item.id !== id));
    } catch (err) {
      setError('Failed to delete content');
      console.error(err);
    }
  };

  const scheduledCount = content?.filter(item => item.status === 'scheduled').length ?? 0;
  const thisWeekCount = content?.filter(item => {
    const date = new Date(item.scheduled_date);
    const now = new Date();
    const weekEnd = new Date(now.getFullYear(), now.getMonth(), now.getDate() + 7);
    return date >= now && date <= weekEnd && item.status === 'scheduled';
  }).length ?? 0;
  const todayCount = content?.filter(item => {
    const date = new Date(item.scheduled_date);
    const now = new Date();
    return date.toDateString() === now.toDateString() && item.status === 'scheduled';
  }).length ?? 0;
  const publishedCount = content?.filter(item => item.status === 'published').length ?? 0;

  return (
    <div className="p-8">
      <div className="max-w-6xl mx-auto">
        {error && (
          <div className="mb-8 p-4 bg-red-50 border border-red-200 text-red-600 rounded-lg">
            {error}
          </div>
        )}

        <div className="flex justify-between items-center mb-8">
          <h1 className="text-2xl font-bold text-gray-900">ContentFlow Dashboard</h1>
          <Button onClick={() => navigate('/dashboard/add')}>
            <Plus className="h-4 w-4 mr-2" />
            Add Content
          </Button>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6 mb-8">
          <StatsCard
            title="Total Scheduled"
            value={scheduledCount.toString()}
            icon={<CalendarIcon className="h-5 w-5 text-[#6C5CE7]" />}
          />
          <StatsCard
            title="Published"
            value={publishedCount.toString()}
            icon={<CheckCircle className="h-5 w-5 text-[#6C5CE7]" />}
          />
          <StatsCard
            title="This Week"
            value={thisWeekCount.toString()}
            icon={<List className="h-5 w-5 text-[#6C5CE7]" />}
          />
          <StatsCard
            title="Today"
            value={todayCount.toString()}
            icon={<Clock className="h-5 w-5 text-[#6C5CE7]" />}
          />
        </div>

        <div className="flex flex-col lg:flex-row gap-8">
          {/* Calendar Section */}
          <div className="flex-1">
            <ContentSchedule
              loading={loading}
              onEdit={handleEdit}
              onDelete={handleDelete}
              events={content}
            />
          </div>

          {/* Recent Activity */}
          <div className="w-full lg:w-80">
            <RecentActivity content={content} loading={loading} />
          </div>
        </div>
      </div>
    </div>
  );
};