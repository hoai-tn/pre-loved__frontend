import { create } from 'zustand'
import { immer } from 'zustand/middleware/immer'
import { initialSearchState } from './state'
import { searchActions } from './actions'
import { searchAsyncActions } from './asyncActions'
import type { SearchState } from './types'
import { searchProducts } from '@/services/api'

type SearchStore = SearchState & {
  setQuery: (query: string) => void
  setIsOpen: (isOpen: boolean) => void
  clearSearch: () => void
  searchProducts: (query: string) => Promise<void>
}

export const useSearchStore = create<SearchStore>()(
  immer((set) => ({
    ...initialSearchState,

    setQuery: (query: string) => set(searchActions.setQuery(query)),
    setIsOpen: (isOpen: boolean) => set(searchActions.setIsOpen(isOpen)),
    clearSearch: () => set(searchActions.clearSearch()),
    searchProducts: async (query: string) => {
      // If query empty, clear results and close dropdown
      if (!query.trim()) {
        set((state) => {
          state.query = ''
          state.results = []
          state.error = null
          state.isOpen = false
          state.isLoading = false
        })
        return
      }

      // Set loading state immediately
      set((state) => {
        state.query = query
        state.isLoading = true
        state.error = null
      })

      try {
        const response = await searchProducts({
          search: query,
          limit: 10,
          page: 1,
        })

        set((state) => {
          state.results = response.items
          state.isOpen = true
        })
      } catch (error) {
        set((state) => {
          state.error = error instanceof Error ? error.message : 'Search failed'
          state.results = []
        })
      } finally {
        set((state) => {
          state.isLoading = false
        })
      }
    },
  })),
)

// Selectors
export const selectSearchQuery = (state: SearchStore) => state.query
export const selectSearchResults = (state: SearchStore) => state.results
export const selectSearchIsLoading = (state: SearchStore) => state.isLoading
export const selectSearchError = (state: SearchStore) => state.error
export const selectSearchIsOpen = (state: SearchStore) => state.isOpen
