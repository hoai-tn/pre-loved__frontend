# CLAUDE.md

This file provides guidance to Claude Code (claude.ai/code) when working with code in this repository.

## Project Overview

Nart Tech is a Vietnamese second-hand marketplace frontend (e-commerce). Built with TanStack Start (SSR framework), React 19, TypeScript, and Tailwind CSS v4.

## Commands

- **Dev server:** `npm run dev` (runs on port 5000)
- **Build:** `npm run build`
- **Lint:** `npm run lint` (ESLint)
- **Format:** `npm run format` (Prettier)
- **Lint + Format fix:** `npm run check`
- **Tests:** `npm run test` (vitest, no tests exist yet)

## Architecture

### Framework & Routing
- **TanStack Start** with file-based routing via `@tanstack/react-router`
- Routes are in `src/routes/` — the route tree is auto-generated in `src/routeTree.gen.ts` (do not edit manually)
- Root layout: `src/routes/__root.tsx` → `src/components/layout/layout.tsx` (Navbar + Footer wrapper)
- Dynamic routes use `$param` convention (e.g., `products.$productId.tsx`, `categories.$slug.tsx`)

### State Management
- **Zustand** stores in `src/store/` with a consistent pattern across all stores:
  - Each store has: `index.ts` (store creation + selectors), `types.ts`, `state.ts`, `actions.ts` (sync), `asyncActions.ts` (API calls)
  - Stores: `auth`, `cart`, `products`, `checkout`
  - Cart and checkout stores use `persist` middleware (localStorage)
  - All stores use `devtools` middleware
- Export named selectors from store index files for optimized re-renders

### API Layer
- `src/services/api/api-client.ts` — Axios-based client with Bearer token auth and automatic 401 refresh
- API route constants in `src/services/api/routes.api.ts` — backend runs at `http://localhost:3000/api`
- Domain-specific API modules: `auth.api.ts`, `products.api.ts`, `orders.api.ts`, `category.api.ts`
- Types in `src/services/api/types/`

### UI Components
- **shadcn/ui** primitives in `src/components/ui/` — do not modify these directly; copy to `src/components/shared/` for customization
- Feature components organized by domain: `auth/`, `cart/`, `checkout/`, `home/`, `product/`, `product-detail/`, `purchase/`, `category/`, `layout/`
- Icons from `lucide-react`

### Styling
- Tailwind CSS v4 via `@tailwindcss/vite` plugin
- Global styles in `src/styles.css`
- Utility: `class-variance-authority` for variants, `clsx` + `tailwind-merge` via `src/lib/utils.ts`

## Conventions

- Use `@/` path alias for imports (maps to `src/`)
- Lowercase with dashes for directory names (e.g., `product-detail/`)
- Favor named exports for components
- Prefer interfaces over types; avoid enums (use maps)
- UI text is in Vietnamese
