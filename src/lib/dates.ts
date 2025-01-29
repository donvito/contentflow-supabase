// Format date for display
export function formatDate(date: string | null): string {
  if (!date) return 'Not scheduled';
  try {
    const d = new Date(date);
    if (isNaN(d.getTime())) return 'Invalid date';
    
    // Format as "Jan 25, 2025, 09:00 PM"
    return d.toLocaleString('en-US', {
      month: 'short',
      day: 'numeric',
      year: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: true
    });
  } catch (error) {
    console.error('Error formatting date:', error);
    return 'Invalid date';
  }
}

// Format date for datetime-local input
export function formatForDateTimeLocal(utcDate: string): string {
  if (!utcDate) return '';
  try {
    const date = new Date(utcDate);
    if (isNaN(date.getTime())) return '';
    
    const year = date.getFullYear();
    const month = String(date.getMonth() + 1).padStart(2, '0');
    const day = String(date.getDate()).padStart(2, '0');
    const hours = String(date.getHours()).padStart(2, '0');
    const minutes = String(date.getMinutes()).padStart(2, '0');
    
    return `${year}-${month}-${day}T${hours}:${minutes}`;
  } catch (error) {
    console.error('Error formatting date for input:', error);
    return '';
  }
}

// Get current datetime in local timezone for datetime-local input
export function getCurrentDateTime(): string {
  const now = new Date();
  const year = now.getFullYear();
  const month = String(now.getMonth() + 1).padStart(2, '0');
  const day = String(now.getDate()).padStart(2, '0');
  const hours = String(now.getHours()).padStart(2, '0');
  const minutes = String(now.getMinutes()).padStart(2, '0');
  
  return `${year}-${month}-${day}T${hours}:${minutes}`;
}

// Convert local datetime to UTC for storage
export function toUTC(localDate: string): string | null {
  if (!localDate) return null;
  try {
    const date = new Date(localDate);
    if (isNaN(date.getTime())) return null;
    return date.toISOString();
  } catch (error) {
    console.error('Error converting to UTC:', error);
    return null;
  }
}