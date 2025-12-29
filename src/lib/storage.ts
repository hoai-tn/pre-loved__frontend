/**
 * Check if we're in a browser environment
 */
function isBrowser(): boolean {
  return (
    typeof window !== 'undefined' && typeof window.localStorage !== 'undefined'
  )
}

/**
 * Safely get item from localStorage
 */
export function getLocalStorage(key: string): string | null {
  if (!isBrowser()) {
    return null
  }
  try {
    return localStorage.getItem(key)
  } catch (error) {
    console.error(`Error reading from localStorage key "${key}":`, error)
    return null
  }
}

/**
 * Safely set item in localStorage
 */
export function setLocalStorage(key: string, value: string): void {
  if (!isBrowser()) {
    return
  }
  try {
    localStorage.setItem(key, value)
  } catch (error) {
    console.error(`Error writing to localStorage key "${key}":`, error)
  }
}

/**
 * Safely remove item from localStorage
 */
export function removeLocalStorage(key: string): void {
  if (!isBrowser()) {
    return
  }
  try {
    localStorage.removeItem(key)
  } catch (error) {
    console.error(`Error removing from localStorage key "${key}":`, error)
  }
}
