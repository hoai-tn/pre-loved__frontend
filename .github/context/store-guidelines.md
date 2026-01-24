# Zustand Store Guidelines

## Overview

This document outlines the best practices and patterns for creating Zustand stores in the Pre-Loved frontend application. All stores follow a consistent modular architecture for maintainability and scalability.

## Standard Store Structure

Every store should follow this file structure:

```
src/store/<store-name>/
├── index.ts           # Main store creation, exports, selectors
├── state.ts           # Initial state definition
├── actions.ts         # Synchronous actions
├── asyncActions.ts    # Asynchronous actions (API calls, side effects)
├── types.ts           # TypeScript interfaces and types
└── README.md          # (Optional) Store documentation
```

## File Responsibilities

### 1. `types.ts` - Type Definitions

Define all TypeScript interfaces and types for the store.

**Required interfaces:**
- `<StoreName>State` - The state shape
- `<StoreName>Actions` - Action methods
- `<StoreName>Store` - Combined type (State & Actions)

**Example:**
```typescript
import type { ApiProduct, GetProductsQueryDto } from '@/services/api/types/product.types'

export interface ProductFilters {
  search: string
  categoryId: number | null
  sortBy: string | null
  sortOrder: 'ASC' | 'DESC'
}

export interface ProductState {
  products: Array<ApiProduct>
  total: number
  isLoading: boolean
  error: string | null
  filters: ProductFilters
}

export interface ProductActions {
  // Sync actions
  setProducts: (products: Array<ApiProduct>, total: number) => void
  clearProducts: () => void
  
  // Async actions (placeholders)
  fetchProducts: (params?: Partial<GetProductsQueryDto>) => Promise<void>
  
  // Internal setters
  setLoading: (loading: boolean) => void
  setError: (error: string | null) => void
}

export type ProductStore = ProductState & ProductActions
```

**Best Practices:**
- Use `Array<T>` instead of `T[]` (ESLint rule)
- Use generic type parameter names like `TKey`, `TValue` (not single letters like `K`)
- Export all interfaces individually for better tree-shaking
- Document complex types with JSDoc comments

---

### 2. `state.ts` - Initial State

Define the initial state for the store.

**Example:**
```typescript
import type { ProductState } from './types'

export const initialProductState: ProductState = {
  products: [],
  total: 0,
  isLoading: false,
  error: null,
  filters: {
    search: '',
    categoryId: null,
    sortBy: null,
    sortOrder: 'DESC',
  },
}
```

**Best Practices:**
- Export as `initial<StoreName>State` for clarity
- Set sensible defaults (empty arrays, null for optional values)
- Use `null` for error states (not undefined)
- Initialize boolean flags to `false` unless loading on mount

---

### 3. `actions.ts` - Synchronous Actions

Create synchronous state updates using Zustand's `set` function.

**Pattern:**
```typescript
import type { StateCreator } from 'zustand'
import { initialProductState } from './state'
import type { ProductStore } from './types'

export const createProductActions: StateCreator<ProductStore> = (set) => ({
  ...initialProductState,

  // Synchronous actions
  setProducts: (products, total) =>
    set({
      products,
      total,
      isLoading: false,
      error: null,
    }),

  clearProducts: () =>
    set({
      products: [],
      total: 0,
    }),

  setFilter: (key, value) =>
    set((state) => ({
      filters: {
        ...state.filters,
        [key]: value,
      },
    })),

  // Async action placeholders (overridden in index.ts)
  fetchProducts: async () => {},

  // Internal setters
  setLoading: (loading) =>
    set({
      isLoading: loading,
    }),

  setError: (error) =>
    set({
      error,
      isLoading: false,
    }),
})
```

**Best Practices:**
- Spread `initialProductState` first
- Use arrow functions for actions
- Keep logic simple - complex logic goes in asyncActions
- Create placeholder async functions (overridden in index.ts)
- Use functional updates `set((state) => ...)` when referencing current state
- Always clear errors on successful operations
- Set `isLoading: false` in both success and error states

---

### 4. `asyncActions.ts` - Asynchronous Actions

Handle API calls, side effects, and complex async logic.

**Pattern:**
```typescript
import type { StoreApi } from 'zustand'
import type { GetProductsQueryDto } from '@/services/api/types/product.types'
import { getProducts } from '@/services/api/products.api'
import type { ProductStore } from './types'

export const createAsyncActions = (
  get: () => ProductStore,
  set: StoreApi<ProductStore>['setState']
) => ({
  fetchProducts: async (params?: Partial<GetProductsQueryDto>) => {
    const store = get()
    
    try {
      store.setLoading(true)
      store.setError(null)

      const { filters } = store

      // Build query parameters
      const queryParams: GetProductsQueryDto = {
        page: 1,
        limit: 20,
        ...params,
      }

      // Apply filters
      if (filters.search) {
        queryParams.search = filters.search
      }
      if (filters.categoryId) {
        queryParams.categoryId = filters.categoryId
      }

      const response = await getProducts(queryParams)

      store.setProducts(response.items, response.total)
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Failed to fetch'
      store.setError(errorMessage)
      console.error('Error fetching products:', error)
    }
  },

  searchProducts: async (query: string) => {
    const store = get()

    if (!query.trim()) {
      set({ isSearchOpen: false })
      return
    }

    try {
      store.setLoading(true)
      const response = await getProducts({ search: query, limit: 10 })
      
      set({
        searchResults: response.items,
        isSearchOpen: true,
        isLoading: false,
      })
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : 'Search failed'
      store.setError(errorMessage)
    }
  },
})
```

**Best Practices:**
- Accept both `get` and `set` parameters from index.ts
- Always set `isLoading: true` at the start
- Clear errors before starting operations
- Use try-catch for error handling
- Call sync actions from the store: `store.setProducts(...)`
- Use direct `set()` for multi-field updates
- Extract error messages properly: `error instanceof Error ? error.message : 'Fallback'`
- Log errors to console for debugging
- Return early for validation failures

---

### 5. `index.ts` - Store Creation and Exports

Create the Zustand store with middleware and export selectors.

**Pattern:**
```typescript
import { create } from 'zustand'
import { devtools } from 'zustand/middleware'
import type { ProductStore } from './types'
import { createProductActions } from './actions'
import { createAsyncActions } from './asyncActions'

/**
 * Product store
 * Manages product listing, filtering, pagination, and search functionality
 */
export const useProductStore = create<ProductStore>()(
  devtools(
    (set, get, store) => {
      const baseStore = createProductActions(set, get, store)
      const asyncActions = createAsyncActions(get, set)

      // Override placeholder async actions with actual implementations
      return {
        ...baseStore,
        fetchProducts: asyncActions.fetchProducts,
        searchProducts: asyncActions.searchProducts,
      }
    },
    { name: 'ProductStore' }
  )
)

// Selectors for optimized re-renders
export const selectProducts = (state: ProductStore) => state.products
export const selectTotal = (state: ProductStore) => state.total
export const selectIsLoading = (state: ProductStore) => state.isLoading
export const selectError = (state: ProductStore) => state.error
export const selectFilters = (state: ProductStore) => state.filters

// Re-export types
export type { ProductStore, ProductState, ProductActions } from './types'
```

**Best Practices:**
- Use `devtools` middleware for Redux DevTools integration
- Name stores descriptively in devtools: `{ name: 'ProductStore' }`
- Spread base store first, then override async actions
- Export individual selectors for each state field
- Export complex selectors for nested state: `selectFilters`
- Re-export types from the index for convenience
- Add JSDoc comment describing the store's purpose

---

## Middleware Usage

### DevTools (Required)

Always use DevTools middleware for debugging:

```typescript
import { devtools } from 'zustand/middleware'

export const useMyStore = create<MyStore>()(
  devtools(
    (set, get, store) => ({ /* store logic */ }),
    { name: 'MyStore' }
  )
)
```

### Persist (Optional)

Use persist middleware for localStorage sync:

```typescript
import { devtools, persist } from 'zustand/middleware'

export const useCartStore = create<CartStore>()(
  devtools(
    persist(
      (set, get, store) => ({ /* store logic */ }),
      {
        name: 'cart-storage',
        partialize: (state) => ({ 
          items: state.items  // Only persist items
        }),
      }
    ),
    { name: 'CartStore' }
  )
)
```

**When to use persist:**
- Cart items
- User preferences/settings
- UI state that should survive refresh
- Filter selections (optional)

**When NOT to use persist:**
- Product lists (fetch fresh)
- Search results
- Temporary UI state
- Sensitive data

---

## Selector Patterns

### Basic Selectors

Export individual selectors for each top-level state field:

```typescript
export const selectProducts = (state: ProductStore) => state.products
export const selectIsLoading = (state: ProductStore) => state.isLoading
export const selectError = (state: ProductStore) => state.error
```

### Nested Selectors

For nested state, create specific selectors:

```typescript
export const selectFilters = (state: ProductStore) => state.filters
export const selectCategoryId = (state: ProductStore) => state.filters.categoryId
export const selectSearchQuery = (state: ProductStore) => state.searchQuery
```

### Computed Selectors

For derived values, create computed selectors:

```typescript
export const selectCartItemCount = (state: CartStore) => 
  state.items.reduce((total, item) => total + item.quantity, 0)

export const selectCartTotal = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)
```

### Usage in Components

```typescript
import { useProductStore, selectProducts, selectIsLoading } from '@/store/products'

function ProductList() {
  // Use selectors for optimized re-renders
  const products = useProductStore(selectProducts)
  const isLoading = useProductStore(selectIsLoading)
  
  // Get actions (doesn't cause re-renders)
  const { fetchProducts, setFilter } = useProductStore()
  
  return (/* JSX */)
}
```

---

## Common Patterns

### Pagination

```typescript
// State
export interface ProductState {
  products: Array<ApiProduct>
  currentPage: number
  totalPages: number
  total: number
  limit: number
}

// Actions
export interface ProductActions {
  loadMoreProducts: () => Promise<void>
  setPage: (page: number) => void
}

// Async Implementation
loadMoreProducts: async () => {
  const { currentPage, totalPages, isLoading } = get()
  
  if (isLoading || currentPage >= totalPages) {
    return
  }
  
  store.setLoading(true)
  const nextPage = currentPage + 1
  
  const response = await getProducts({ page: nextPage, limit: 20 })
  
  set((state) => ({
    products: [...state.products, ...response.items],
    currentPage: nextPage,
    isLoading: false,
  }))
}
```

### Filtering

```typescript
// State with filters object
export interface ProductFilters {
  search: string
  categoryId: number | null
  minPrice: number | null
  maxPrice: number | null
}

export interface ProductState {
  filters: ProductFilters
}

// Generic filter setter
setFilter: <TKey extends keyof ProductFilters>(
  key: TKey,
  value: ProductFilters[TKey]
) => void

// Usage
store.setFilter('categoryId', 123)
store.setFilter('search', 'laptop')
```

### Debounced Search

```typescript
// In component
const searchTimeoutRef = useRef<NodeJS.Timeout | null>(null)

const handleSearchChange = (value: string) => {
  setSearchQuery(value)
  
  if (searchTimeoutRef.current) {
    clearTimeout(searchTimeoutRef.current)
  }
  
  searchTimeoutRef.current = setTimeout(() => {
    if (value.trim()) {
      searchProducts(value)
    } else {
      setSearchOpen(false)
    }
  }, 300)
}
```

### Error Handling

```typescript
// Always follow this pattern
try {
  store.setLoading(true)
  store.setError(null)  // Clear previous errors
  
  const response = await apiCall()
  
  store.setData(response)  // This should set isLoading: false
} catch (error) {
  const errorMessage = error instanceof Error 
    ? error.message 
    : 'Failed to perform operation'
  store.setError(errorMessage)  // This should set isLoading: false
  console.error('Error context:', error)
}
```

---

## Integration with Routes

### TanStack Router Loaders (Deprecated Pattern)

**Old Pattern (Don't use):**
```typescript
export const Route = createFileRoute('/')({
  loader: async ({ context, location }) => {
    const response = await getProducts({ limit: 20, page: 1 })
    return { products: response.items }
  },
})
```

**New Pattern (Use store instead):**
```typescript
export const Route = createFileRoute('/')({
  component: ProductListPage,
  validateSearch: (search: Record<string, unknown>) => ({
    categoryId: search.categoryId as string | undefined,
  }),
})

function ProductListPage() {
  const { categoryId } = Route.useSearch()
  const { fetchProducts, setCategoryFilter } = useProductStore()
  
  useEffect(() => {
    const categoryIdNum = categoryId ? Number(categoryId) : null
    setCategoryFilter(categoryIdNum)
    fetchProducts()
  }, [categoryId, fetchProducts, setCategoryFilter])
  
  // ...
}
```

**Benefits:**
- Store manages data lifecycle
- No duplication between loader and component state
- Consistent data access across components
- Easier to implement filtering and pagination

---

## Testing Considerations

When writing tests for stores:

1. **Import store directly** - Don't mock Zustand
2. **Reset state** between tests
3. **Test selectors** separately from actions
4. **Mock API calls** at the API layer

```typescript
import { useProductStore } from '@/store/products'
import { getProducts } from '@/services/api/products.api'

// Mock API
vi.mock('@/services/api/products.api')

describe('Product Store', () => {
  beforeEach(() => {
    // Reset store
    useProductStore.setState(initialProductState)
  })
  
  it('should fetch products', async () => {
    const mockProducts = [{ id: '1', name: 'Product 1' }]
    vi.mocked(getProducts).mockResolvedValue({
      items: mockProducts,
      total: 1,
    })
    
    await useProductStore.getState().fetchProducts()
    
    expect(useProductStore.getState().products).toEqual(mockProducts)
  })
})
```

---

## Migration Checklist

When migrating component state to a store:

- [ ] Create store structure (types, state, actions, asyncActions, index)
- [ ] Define state shape and initial values
- [ ] Implement synchronous actions
- [ ] Implement async actions with proper error handling
- [ ] Export selectors for all state fields
- [ ] Remove loader functions from routes
- [ ] Replace component state with store selectors
- [ ] Replace local handlers with store actions
- [ ] Update component imports
- [ ] Remove old store files (if consolidating)
- [ ] Search codebase for old store imports
- [ ] Test functionality thoroughly

---

## Common Mistakes to Avoid

### ❌ Don't: Use async/await in sync actions

```typescript
// Bad
setProducts: async (products) => {
  set({ products })
}
```

```typescript
// Good
setProducts: (products) => {
  set({ products })
}
```

### ❌ Don't: Forget to set loading states

```typescript
// Bad
fetchProducts: async () => {
  const response = await getProducts()
  store.setProducts(response.items)
}
```

```typescript
// Good
fetchProducts: async () => {
  try {
    store.setLoading(true)
    store.setError(null)
    const response = await getProducts()
    store.setProducts(response.items)  // Sets isLoading: false
  } catch (error) {
    store.setError(error.message)  // Sets isLoading: false
  }
}
```

### ❌ Don't: Mutate state directly

```typescript
// Bad
addItem: (item) => {
  const store = get()
  store.items.push(item)  // ❌ Direct mutation
}
```

```typescript
// Good
addItem: (item) =>
  set((state) => ({
    items: [...state.items, item]
  }))
```

### ❌ Don't: Use multiple set calls when one is enough

```typescript
// Bad
fetchProducts: async () => {
  set({ isLoading: true })
  set({ error: null })
  const response = await getProducts()
  set({ products: response.items })
  set({ isLoading: false })
}
```

```typescript
// Good
fetchProducts: async () => {
  store.setLoading(true)
  store.setError(null)
  const response = await getProducts()
  store.setProducts(response.items, response.total)  // Sets all at once
}
```

### ❌ Don't: Create unnecessary computed values in state

```typescript
// Bad - storing derived values
export interface CartState {
  items: Array<CartItem>
  total: number  // ❌ Can be computed
  itemCount: number  // ❌ Can be computed
}
```

```typescript
// Good - use selectors for computed values
export interface CartState {
  items: Array<CartItem>
}

export const selectCartTotal = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.price * item.quantity, 0)

export const selectCartItemCount = (state: CartStore) =>
  state.items.reduce((total, item) => total + item.quantity, 0)
```

---

## Examples from Codebase

### Simple Store (Auth)
- Uses standard Zustand pattern
- DevTools middleware
- Auto-initialization on mount
- Exported selectors

### Complex Store (Cart)
- Uses DevTools + Persist middleware
- Computed selectors
- localStorage sync
- Comprehensive README

### Merged Store (Products)
- Consolidates product listing + search
- Handles pagination
- Manages filters (category, search, price)
- Search dropdown state

---

## Summary

**Key Principles:**
1. **Consistency** - All stores follow the same structure
2. **Separation** - Sync actions separate from async actions
3. **Type Safety** - Comprehensive TypeScript interfaces
4. **DevTools** - Always use devtools middleware
5. **Selectors** - Export granular selectors for optimization
6. **Error Handling** - Always try-catch with proper error messages
7. **Loading States** - Always track loading and error states

**File Order:**
1. Create `types.ts` (defines interfaces)
2. Create `state.ts` (initial values)
3. Create `actions.ts` (sync operations)
4. Create `asyncActions.ts` (async operations)
5. Create `index.ts` (store creation + exports)

**Remember:**
- Stores are the **single source of truth** for application state
- Keep stores **focused and cohesive** (one concern per store)
- Use **selectors** for performance optimization
- **Document** complex stores with README files
- Follow **TypeScript** best practices (Array<T>, proper naming)

---

*Last Updated: January 24, 2026*
*For questions or improvements, contact the frontend team.*
