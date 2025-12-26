/**
 * Sign Up request payload
 */
export interface SignUpRequest {
  username: string
  email: string
  password: string
}

/**
 * Sign In request payload
 */
export interface SignInRequest {
  username: string
  password: string
}

/**
 * Auth response (will be used when API is integrated)
 */
export interface AuthResponse {
  token?: string
  user?: {
    id: string
    username: string
    email: string
  }
  message?: string
}

/**
 * Auth error response
 */
export interface AuthError {
  message: string
  errors?: Record<string, string[]>
}
