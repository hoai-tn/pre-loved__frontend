/**
 * API response wrapper
 */
export interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
  errors?: Record<string, Array<string>>
}

/**
 * Register request payload
 */
export interface RegisterRequest {
  username: string
  email: string
  password: string
}

/**
 * Login request payload
 */
export interface LoginRequest {
  username: string
  password: string
}

/**
 * User profile data
 */
export interface UserProfile {
  id: string
  username: string
  email: string
}

/**
 * Auth response with token
 */
export interface AuthResponse {
  accessToken: string
  user: UserProfile
}

/**
 * Register response
 */
export interface RegisterResponse {
  message: string
  user?: UserProfile
}
