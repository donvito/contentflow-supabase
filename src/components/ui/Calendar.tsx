import React, { useEffect, useState } from 'react';
import { ChevronLeft, ChevronRight } from 'lucide-react';
import { cn } from '../../lib/utils';
import { EventPreview } from './EventPreview';
import { Content } from '../../lib/content';
import { getUserProfile } from '../../lib/profile';

interface CalendarProps {
  className?: string;
  events?: Content[];
}

export const Calendar: React.FC<CalendarProps> = ({ className, events = [] }) => {
  const [currentDate, setCurrentDate] = React.useState(new Date());
  const [selectedDate, setSelectedDate] = React.useState<Date | null>(null);
  const [userTimezone, setUserTimezone] = useState<string>('UTC');
  const [hoveredEvent, setHoveredEvent] = React.useState<string | null>(null);
  const [selectedEvent, setSelectedEvent] = React.useState<Content | null>(null);

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

  const daysInMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth() + 1,
    0
  ).getDate();

  const firstDayOfMonth = new Date(
    currentDate.getFullYear(),
    currentDate.getMonth(),
    1
  ).getDay();

  const days = Array.from({ length: daysInMonth }, (_, i) => i + 1);
  const padding = Array.from({ length: firstDayOfMonth }, (_, i) => i);

  const getEventsForDate = (day: number) => {
    const dateToCheck = new Date(
      currentDate.getFullYear(),
      currentDate.getMonth(),
      day
    );
    // Strip time part, keep only the date
    dateToCheck.setHours(0, 0, 0, 0);
    
    return events.filter(event => {
      if (!event?.scheduled_date) return false;
      const eventDate = new Date(event.scheduled_date);
      // Strip time part for comparison
      eventDate.setHours(0, 0, 0, 0);
      return eventDate.getTime() === dateToCheck.getTime();
    });
  };

  const monthNames = [
    'January', 'February', 'March', 'April', 'May', 'June',
    'July', 'August', 'September', 'October', 'November', 'December'
  ];

  return (
    <div className={cn('bg-white rounded-lg shadow-sm p-4', className)}>
      <div className="flex items-center justify-between mb-4">
        <h2 className="text-lg font-semibold text-[#333333]">
          {monthNames[currentDate.getMonth()]} {currentDate.getFullYear()}
        </h2>
        <div className="flex gap-2">
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() - 1)))}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <ChevronLeft className="h-5 w-5" />
          </button>
          <button
            onClick={() => setCurrentDate(new Date(currentDate.setMonth(currentDate.getMonth() + 1)))}
            className="p-1 hover:bg-gray-100 rounded-md"
          >
            <ChevronRight className="h-5 w-5" />
          </button>
        </div>
      </div>

      <div className="grid grid-cols-7 gap-1 mb-2">
        {['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'].map(day => (
          <div key={day} className="text-sm font-medium text-gray-500 text-center py-2">
            {day}
          </div>
        ))}
      </div>

      <div className="grid grid-cols-7 gap-1">
        {padding.map(i => (
          <div key={`padding-${i}`} className="aspect-square" />
        ))}
        {days.map(day => {
          const dayEvents = getEventsForDate(day);
          const isSelected = selectedDate?.getDate() === day &&
                           selectedDate?.getMonth() === currentDate.getMonth() &&
                           selectedDate?.getFullYear() === currentDate.getFullYear();

          return (
            <button
              key={day}
              onClick={() => setSelectedDate(new Date(currentDate.getFullYear(), currentDate.getMonth(), day))}
              className="aspect-square p-1 relative hover:bg-gray-50 rounded-md transition-colors min-h-[100px] flex flex-col"
            >
              <div className="flex justify-between items-start mb-1">
                <span className={cn(
                  'text-sm px-1',
                  isSelected && 'text-[#4169E1] font-medium'
                )}>
                  {day}
                </span>
              </div>
              <div className="flex-1 overflow-y-auto space-y-1">
                {dayEvents.map(event => (
                  event && (
                  <div
                    key={event.id}
                    onMouseEnter={() => setHoveredEvent(event.id)}
                    onMouseLeave={() => setHoveredEvent(null)}
                    onClick={(e) => {
                      e.stopPropagation();
                      setSelectedEvent(event);
                    }}
                    className={cn(
                      'text-xs px-1 py-0.5 rounded truncate cursor-pointer transition-colors',
                      'bg-[#4169E1]/10 text-[#4169E1] hover:bg-[#4169E1]/20',
                      hoveredEvent === event.id && 'ring-2 ring-[#4169E1]/50'
                    )}
                  >
                    {event.title}
                  </div>
                  )
                ))}
              </div>
            </button>
          );
        })}
      </div>
      {selectedEvent && (
        <EventPreview
          event={selectedEvent}
          onClose={() => setSelectedEvent(null)}
        />
      )}
    </div>
  );
};