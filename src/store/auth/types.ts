import type { LoginRequest, RegisterRequest, UserProfile } from '@/services/api'

export interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

export interface AuthActions {
  // Async actions
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
  checkAuth: () => Promise<void>
  
  // Internal state setters
  setUser: (user: UserProfile | null) => void
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type AuthStore = AuthState & AuthActions

