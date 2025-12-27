import type { AuthState } from './types'

export const initialAuthState: AuthState = {
  user: null,
  isAuthenticated: false,
  isLoading: true, // Start as loading to check auth on mount
  error: null,
}

