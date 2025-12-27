import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import { createAuthActions } from './actions'
import { createAsyncActions } from './asyncActions'
import type { AuthStore } from './types'

/**
 * Auth Store using Zustand
 * 
 * Features:
 * - DevTools integration for debugging
 * - Async actions support for API integration
 * - Clean separation of concerns (state, actions, async actions)
 * - Auto-check authentication on mount
 */
export const useAuthStore = create<AuthStore>()(
  devtools(
    (set, get, store) => {
      const baseStore = createAuthActions(set, get, store)
      const asyncActions = createAsyncActions(get)

      return {
        ...baseStore,
        // Override async actions with actual implementations
        login: asyncActions.login,
        register: asyncActions.register,
        logout: asyncActions.logout,
        refreshProfile: asyncActions.refreshProfile,
        checkAuth: asyncActions.checkAuth,
      }
    },
    {
      name: 'AuthStore', // DevTools name
    }
  )
)

// Initialize auth check on first load
if (typeof window !== 'undefined') {
  useAuthStore.getState().checkAuth()
}

// Selectors for optimized re-renders
export const selectUser = (state: AuthStore) => state.user
export const selectIsAuthenticated = (state: AuthStore) => state.isAuthenticated
export const selectIsLoading = (state: AuthStore) => state.isLoading
export const selectAuthError = (state: AuthStore) => state.error

// Export types
export type { AuthStore, AuthState, AuthActions } from './types'

