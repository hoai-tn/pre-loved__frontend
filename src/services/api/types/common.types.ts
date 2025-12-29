/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
  errors?: Record<string, Array<string>>
}
