import {
  differenceInDays,
  differenceInHours,
  differenceInMinutes,
  differenceInSeconds,
  format,
  isThisWeek,
  isValid,
} from 'date-fns'

/**
 * Format a date string to a Vietnamese relative time string
 * Examples: "Vừa xong", "2 phút trước", "3 giờ trước", "2 ngày trước", etc.
 *
 * @param dateString - ISO date string or date string that can be parsed by Date constructor
 * @returns Formatted Vietnamese relative time string
 */
export function formatRelativeTime(dateString: string): string {
  // Handle invalid or empty date strings
  if (!dateString) {
    return 'Ngày không hợp lệ'
  }

  const date = new Date(dateString)

  // Validate the date
  if (!isValid(date)) {
    return 'Ngày không hợp lệ'
  }

  const now = new Date()

  // Calculate differences using date-fns functions
  const seconds = differenceInSeconds(now, date)
  const minutes = differenceInMinutes(now, date)
  const hours = differenceInHours(now, date)
  const days = differenceInDays(now, date)

  // Less than a minute
  if (seconds < 60) {
    return 'Vừa xong'
  }

  // Less than an hour - show minutes
  if (minutes < 60) {
    return `${minutes} phút trước`
  }

  // Less than a day - show hours
  if (hours < 24) {
    return `${hours} giờ trước`
  }

  // Less than a week - show days
  if (isThisWeek(date)) {
    return `${days} ngày trước`
  }

  // Older than a week - show formatted date (dd/MM/yyyy)
  return format(date, 'dd/MM/yyyy')
}
