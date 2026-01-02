import type { LoginRequest, RegisterRequest } from '@/services/api'
import type { AuthStore } from './types'
import * as apiClient from '@/services/api'

/**
 * Async actions for auth store
 */
export const createAsyncActions = (get: () => AuthStore) => ({
  /**
   * Check if user is authenticated on mount
   */
  checkAuth: async () => {
    const { setUser, setLoading } = get()
    try {
      const profile = await apiClient.getProfile()
      setUser(profile)
    } catch {
      // Not authenticated or token expired
      setUser(null)
      localStorage.removeItem('token')
    } finally {
      setLoading(false)
    }
  },

  /**
   * Login user
   */
  login: async (data: LoginRequest) => {
    const { setUser, setLoading, setError } = get()

    try {
      setLoading(true)
      setError(null)

      const authResponse = await apiClient.login(data)
      setUser(authResponse.user)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Login failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * Register new user
   */
  register: async (data: RegisterRequest) => {
    const { setLoading, setError } = get()

    try {
      setLoading(true)
      setError(null)

      await apiClient.register(data)
      // After registration, user needs to login
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Registration failed'
      setError(errorMessage)
      throw error
    } finally {
      setLoading(false)
    }
  },

  /**
   * Logout user
   */
  logout: () => {
    const { setUser } = get()
    apiClient.logout()
    apiClient.removeToken()
    setUser(null)
  },

  /**
   * Refresh user profile
   */
  refreshProfile: async () => {
    const { setUser, setError } = get()

    try {
      setError(null)
      const profile = await apiClient.getProfile()
      setUser(profile)
    } catch (error) {
      const errorMessage =
        error instanceof Error ? error.message : 'Failed to refresh profile'
      setError(errorMessage)
      setUser(null)
    }
  },
})
