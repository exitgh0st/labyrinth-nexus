/**
 * Date utility functions for consistent formatting
 */

/**
 * Format a date to a localized string
 * @param date - The date to format
 * @param locale - The locale to use (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date string
 */
export function formatDate(
  date: Date | string | undefined,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      ...options
    };

    return dateObj.toLocaleDateString(locale, defaultOptions);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Format a date and time to a localized string
 * @param date - The date to format
 * @param locale - The locale to use (default: 'en-US')
 * @param options - Intl.DateTimeFormatOptions
 * @returns Formatted date and time string
 */
export function formatDateTime(
  date: Date | string | undefined,
  locale = 'en-US',
  options?: Intl.DateTimeFormatOptions
): string {
  if (!date) return 'N/A';

  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    const defaultOptions: Intl.DateTimeFormatOptions = {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      ...options
    };

    return dateObj.toLocaleString(locale, defaultOptions);
  } catch {
    return 'Invalid date';
  }
}

/**
 * Get relative time string (e.g., "2 hours ago", "in 3 days")
 * @param date - The date to compare
 * @param baseDate - The base date to compare against (default: now)
 * @returns Relative time string
 */
export function getRelativeTime(
  date: Date | string,
  baseDate: Date = new Date()
): string {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    if (isNaN(dateObj.getTime())) return 'Invalid date';

    const diffMs = baseDate.getTime() - dateObj.getTime();
    const diffSec = Math.floor(diffMs / 1000);
    const diffMin = Math.floor(diffSec / 60);
    const diffHour = Math.floor(diffMin / 60);
    const diffDay = Math.floor(diffHour / 24);
    const diffWeek = Math.floor(diffDay / 7);
    const diffMonth = Math.floor(diffDay / 30);
    const diffYear = Math.floor(diffDay / 365);

    if (Math.abs(diffSec) < 60) return 'just now';
    if (Math.abs(diffMin) < 60) {
      return diffMin > 0 ? `${diffMin}m ago` : `in ${Math.abs(diffMin)}m`;
    }
    if (Math.abs(diffHour) < 24) {
      return diffHour > 0 ? `${diffHour}h ago` : `in ${Math.abs(diffHour)}h`;
    }
    if (Math.abs(diffDay) < 7) {
      return diffDay > 0 ? `${diffDay}d ago` : `in ${Math.abs(diffDay)}d`;
    }
    if (Math.abs(diffWeek) < 4) {
      return diffWeek > 0 ? `${diffWeek}w ago` : `in ${Math.abs(diffWeek)}w`;
    }
    if (Math.abs(diffMonth) < 12) {
      return diffMonth > 0 ? `${diffMonth}mo ago` : `in ${Math.abs(diffMonth)}mo`;
    }
    return diffYear > 0 ? `${diffYear}y ago` : `in ${Math.abs(diffYear)}y`;
  } catch {
    return 'Invalid date';
  }
}

/**
 * Check if a date is today
 * @param date - The date to check
 * @returns true if the date is today
 */
export function isToday(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    const today = new Date();

    return (
      dateObj.getDate() === today.getDate() &&
      dateObj.getMonth() === today.getMonth() &&
      dateObj.getFullYear() === today.getFullYear()
    );
  } catch {
    return false;
  }
}

/**
 * Check if a date is in the past
 * @param date - The date to check
 * @returns true if the date is in the past
 */
export function isPast(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj < new Date();
  } catch {
    return false;
  }
}

/**
 * Check if a date is in the future
 * @param date - The date to check
 * @returns true if the date is in the future
 */
export function isFuture(date: Date | string): boolean {
  try {
    const dateObj = typeof date === 'string' ? new Date(date) : date;
    return dateObj > new Date();
  } catch {
    return false;
  }
}

/**
 * Add days to a date
 * @param date - The base date
 * @param days - Number of days to add (can be negative)
 * @returns New date with days added
 */
export function addDays(date: Date | string, days: number): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setDate(dateObj.getDate() + days);
  return dateObj;
}

/**
 * Get start of day (00:00:00.000)
 * @param date - The date
 * @returns New date at start of day
 */
export function startOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(0, 0, 0, 0);
  return dateObj;
}

/**
 * Get end of day (23:59:59.999)
 * @param date - The date
 * @returns New date at end of day
 */
export function endOfDay(date: Date | string): Date {
  const dateObj = typeof date === 'string' ? new Date(date) : new Date(date);
  dateObj.setHours(23, 59, 59, 999);
  return dateObj;
}
