import { initialAuthState } from './state'
import type { StateCreator } from 'zustand'
import type { AuthStore } from './types'

export const createAuthActions: StateCreator<AuthStore, [], [], AuthStore> = (
  set,
) => ({
  ...initialAuthState,

  // Internal state setters
  setUser: (user) => {
    set({
      user,
      isAuthenticated: !!user,
      error: null,
    })
  },

  setLoading: (loading) => {
    set({ isLoading: loading })
  },

  setError: (error) => {
    set({ error })
  },

  // Placeholders for async actions (implemented in asyncActions.ts)
  login: async () => {
    console.log('login')
    // Placeholder
  },

  register: async () => {
    // Placeholder
  },

  logout: () => {
    // Placeholder
  },

  refreshProfile: async () => {
    // Placeholder
  },

  checkAuth: async () => {
    // Placeholder
  },
})
