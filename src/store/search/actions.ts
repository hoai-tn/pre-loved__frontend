import type { SearchState } from './types'

export const searchActions = {
  setQuery: (query: string) => (state: SearchState) => {
    state.query = query
  },
  
  setIsOpen: (isOpen: boolean) => (state: SearchState) => {
    state.isOpen = isOpen
  },
  
  clearSearch: () => (state: SearchState) => {
    state.query = ''
    state.results = []
    state.error = null
    state.isOpen = false
  },
}
