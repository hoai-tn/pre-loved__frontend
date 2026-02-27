# Copilot Instructions - Nart Tech Frontend

## Commands

```bash
# Development
npm run dev              # Start dev server on port 5000

# Build & Preview
npm run build            # Production build
npm run preview          # Preview production build

# Code Quality
npm run lint             # Run ESLint
npm run format           # Run Prettier
npm run check            # Format + auto-fix (Prettier + ESLint)

# Testing
npm test                 # Run Vitest tests
```

## Tech Stack

- **Framework**: TanStack Start (React-based meta-framework with SSR)
- **Router**: TanStack Router (file-based routing)
- **Styling**: Tailwind CSS 4 + shadcn/ui (New York style)
- **State Management**: Zustand
- **Forms**: React Hook Form + Zod
- **HTTP Client**: Axios
- **Testing**: Vitest + React Testing Library

## Architecture

### TanStack Router File-Based Routing

Routes are defined in `src/routes/` with automatic route tree generation:

- `src/routes/__root.tsx` - Root layout with `<Layout>` wrapper
- `src/routes/index.tsx` - Home page (/)
- `src/routes/products.$productId.tsx` - Dynamic route (/products/:productId)
- `src/routes/categories.$slug.tsx` - Category pages (/categories/:slug)
- `src/routes/user/purchase.$orderId.tsx` - Nested route (/user/purchase/:orderId)

**Route Pattern:**

```typescript
import { createFileRoute } from '@tanstack/react-router'

export const Route = createFileRoute('/path')({
  component: MyComponent,
  validateSearch: (search: Record<string, unknown>) => ({
    // Type-safe search params
  }),
})

function MyComponent() {
  const params = Route.useParams()
  const search = Route.useSearch()
  // Component logic
}
```

**Do NOT use route loaders** for data fetching - use Zustand stores instead (see Store Guidelines).

### Zustand Store Architecture

All stores follow a strict modular structure (see `.github/context/store-guidelines.md` for full details):

```
src/store/<store-name>/
├── index.ts          # Store creation with devtools middleware
├── state.ts          # Initial state
├── actions.ts        # Sync actions
├── asyncActions.ts   # Async actions (API calls)
└── types.ts          # TypeScript interfaces
```

**Key Patterns:**

- Always use `devtools` middleware: `create<Store>()(devtools(...))`
- Export individual selectors: `export const selectItems = (state: Store) => state.items`
- Use `persist` middleware only for cart, user preferences, or UI state
- Async actions use try-catch with proper error handling
- Call sync actions from async: `store.setData(...)` not `set(...)`

**Usage:**

```typescript
import { useCartStore, selectCartItemCount } from '@/store/cart'

function Component() {
  const count = useCartStore(selectCartItemCount) // Optimized selector
  const { addItem } = useCartStore() // Actions don't cause re-renders
}
```

### API Layer Structure

All API code lives in `src/services/api/` (see `.github/context/api-guidelines.md` for implementation guide):

```
src/services/api/
├── api-client.ts           # Axios instance with interceptors
├── routes.api.ts           # Route constants (API_ROUTES)
├── {resource}.api.ts       # API functions per resource
└── types/
    ├── common.types.ts     # ApiResponse<T>, pagination types
    └── {resource}.types.ts # Request/response types
```

**Pattern:**

```typescript
// routes.api.ts
export const API_ROUTES = {
  PRODUCTS: {
    GET_ALL: '/products',
    GET_BY_ID: '/products/:id',
  },
} as const

// products.api.ts
export async function getProducts(
  query?: GetProductsQueryDto,
): Promise<PaginatedResponse<ApiProduct>> {
  const response = await get<PaginatedResponse<ApiProduct>>(
    API_ROUTES.PRODUCTS.GET_ALL,
    query as Record<string, unknown>,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data || { total: 0, items: [], page: 1, limit: 10, totalPages: 0 }
}
```

**Available HTTP methods:** `get`, `post`, `put`, `patch`, `del`

**Auth:** Authorization header is added automatically from localStorage token.

## Key Conventions

### TypeScript

- Use `Array<T>` not `T[]` (enforced by ESLint)
- Use generic names like `TKey`, `TValue` not `K`, `V`
- Prefer interfaces over types
- Avoid enums; use objects/maps with `as const`

### Imports

- **Always use `@/` alias** for absolute imports
- Path aliases: `@/components`, `@/store`, `@/services`, `@/lib`
- Configured in `tsconfig.json` (baseUrl + paths) and `vite.config.ts` (viteTsConfigPaths)

### Components

- Use lowercase-with-dashes for directories: `components/auth-wizard/`
- Favor named exports: `export function MyComponent() {}`
- Functional components only

### shadcn/ui Components

- **Never modify `components/ui/` directly**
- Copy to `components/shared/` for customization
- Component config in `components.json` (New York style, Lucide icons)
- Install with: `npx shadcn@latest add <component>`

### Forms

Use React Hook Form + Zod + shadcn/ui form components:

```typescript
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'

const schema = z.object({
  email: z.string().email(),
})

const form = useForm({
  resolver: zodResolver(schema),
})
```

### State Management

- **Local state**: useState for simple component state
- **Global state**: Zustand stores with devtools
- **URL state**: TanStack Router's `validateSearch` + `Route.useSearch()`
- **Avoid**: Context API for application state

### Performance

- Minimize `useEffect` - prefer direct event handlers
- Use Zustand selectors to prevent unnecessary re-renders
- Dynamic imports for large components: `React.lazy(() => import('./Heavy'))`
- Optimize images: WebP format, explicit width/height, lazy loading

## Code Style

- ESLint: `@tanstack/eslint-config` (TanStack's rules)
- Prettier: Automatic formatting
- Auto-fix: `npm run check` (formats + fixes ESLint issues)
- No unused imports, variables, or parameters (enforced)

## Project-Specific Notes

- **Language**: Vietnamese UI text (lang="vi" in root)
- **Port**: Dev server runs on port 5000 (not default)
- **Build output**: `.output/` directory (ignored in git)
- **DevTools**: TanStack Router + React devtools in development
- **API Base URL**: Defined in `api-client.ts` (`API_ROUTES.BASE_URL`)

## File Locations

- Routes: `src/routes/` (file-based, auto-generated tree)
- Components: `src/components/` (organized by feature)
- Store: `src/store/` (Zustand stores)
- API: `src/services/api/` (Axios client + endpoints)
- Utilities: `src/lib/` (utils, storage, date helpers)
- Styles: `src/styles.css` (Tailwind + CSS variables)
- Types: Co-located with features or in `types/` subdirectories

## Important Files

- `src/router.tsx` - Router configuration
- `src/routeTree.gen.ts` - Auto-generated, do not edit
- `src/routes/__root.tsx` - Root layout with HTML structure
- `components.json` - shadcn/ui configuration
- `vite.config.ts` - Build config (TanStack Start + Nitro + Tailwind plugins)
