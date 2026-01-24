# API Implementation Guide

This guide provides step-by-step instructions for implementing new API endpoints in the pre-loved frontend application following the existing architectural patterns.

## Table of Contents

1. [Project Structure](#project-structure)
2. [Implementation Steps](#implementation-steps)
3. [Code Examples](#code-examples)
4. [Best Practices](#best-practices)
5. [Testing](#testing)

---

## Project Structure

The API layer is organized as follows:

```
src/services/api/
├── api-client.ts          # Core HTTP client with interceptors
├── routes.api.ts          # API route constants
├── index.ts               # Public API exports
├── {resource}.api.ts      # Resource-specific API functions
└── types/
    ├── index.ts           # Type exports
    ├── common.types.ts    # Shared API types
    └── {resource}.types.ts # Resource-specific types
```

---

## Implementation Steps

### Step 1: Define Types

Create or update the type definitions for your new API endpoint.

**Location:** `src/services/api/types/{resource}.types.ts`

**Requirements:**
- Define request DTOs (Data Transfer Objects)
- Define response interfaces
- Export all types from the file
- Re-export from `types/index.ts`

**Example Structure:**
```typescript
// Request DTOs
export interface CreateResourceRequest {
  name: string
  description?: string
}

export interface UpdateResourceRequest {
  name?: string
  description?: string
}

export interface GetResourcesQueryDto {
  page?: number
  limit?: number
  search?: string
  sortBy?: string
}

// Response interfaces
export interface ResourceResponse {
  id: string
  name: string
  description: string
  createdAt: string
  updatedAt: string
}

export interface PaginatedResourcesResponse {
  total: number
  items: ResourceResponse[]
  page: number
  limit: number
  totalPages: number
}
```

### Step 2: Add API Routes

Add route constants for your new endpoints.

**Location:** `src/services/api/routes.api.ts`

**Requirements:**
- Add new resource section to `API_ROUTES` constant
- Use clear, RESTful naming conventions
- Use path parameters (`:id`, `:userId`, etc.) for dynamic routes
- Follow existing naming patterns

**Example:**
```typescript
export const API_ROUTES = {
  BASE_URL: 'http://localhost:3000/api',
  // ... existing routes
  RESOURCE: {
    GET_ALL: '/resources',
    GET_BY_ID: '/resources/:id',
    CREATE: '/resources',
    UPDATE: '/resources/:id',
    DELETE: '/resources/:id',
    // Add custom actions if needed
    CUSTOM_ACTION: '/resources/:id/custom-action',
  },
} as const
```

### Step 3: Create API Service Functions

Implement the API functions using the HTTP client methods.

**Location:** `src/services/api/{resource}.api.ts`

**Requirements:**
- Import HTTP methods from `api-client.ts`: `get`, `post`, `put`, `patch`, `del`
- Import routes from `routes.api.ts`
- Import types from `types/`
- Add JSDoc comments for each function
- Handle errors appropriately
- Return typed responses

**Example:**
```typescript
import { get, post, put, del } from './api-client'
import { API_ROUTES } from './routes.api'
import type {
  CreateResourceRequest,
  UpdateResourceRequest,
  ResourceResponse,
  PaginatedResourcesResponse,
  GetResourcesQueryDto,
} from './types'

/**
 * Get all resources with optional query parameters
 */
export async function getResources(
  query?: GetResourcesQueryDto,
): Promise<PaginatedResourcesResponse> {
  const response = await get<PaginatedResourcesResponse>(
    API_ROUTES.RESOURCE.GET_ALL,
    query as Record<string, unknown>,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data || {
    total: 0,
    items: [],
    page: 1,
    limit: 10,
    totalPages: 0,
  }
}

/**
 * Get resource by ID
 */
export async function getResourceById(id: string): Promise<ResourceResponse> {
  const endpoint = API_ROUTES.RESOURCE.GET_BY_ID.replace(':id', id)
  const response = await get<ResourceResponse>(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

/**
 * Create a new resource
 */
export async function createResource(
  payload: CreateResourceRequest,
): Promise<ResourceResponse> {
  const response = await post<ResourceResponse>(
    API_ROUTES.RESOURCE.CREATE,
    payload,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

/**
 * Update existing resource
 */
export async function updateResource(
  id: string,
  payload: UpdateResourceRequest,
): Promise<ResourceResponse> {
  const endpoint = API_ROUTES.RESOURCE.UPDATE.replace(':id', id)
  const response = await put<ResourceResponse>(endpoint, payload)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

/**
 * Delete resource
 */
export async function deleteResource(id: string): Promise<void> {
  const endpoint = API_ROUTES.RESOURCE.DELETE.replace(':id', id)
  const response = await del(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }
}
```

### Step 4: Export API Functions

Update the main index file to export your new API functions.

**Location:** `src/services/api/index.ts`

**Requirements:**
- Add export statement for your new API file
- Maintain alphabetical order
- Export all types from the types directory

**Example:**
```typescript
export * from './api-client'
export * from './auth.api'
export * from './orders.api'
export * from './products.api'
export * from './resources.api' // Add this
export * from './routes.api'
export * from './types'
```

### Step 5: Update Types Index

Ensure all types are exported from the types index.

**Location:** `src/services/api/types/index.ts`

**Example:**
```typescript
export * from './auth.types'
export * from './common.types'
export * from './order.types'
export * from './product.types'
export * from './resource.types' // Add this
```

---

## Code Examples

### Available HTTP Methods

The API client provides the following methods:

```typescript
// GET request
const response = await get<ResponseType>(endpoint, queryParams)

// POST request
const response = await post<ResponseType>(endpoint, bodyData)

// PUT request (full update)
const response = await put<ResponseType>(endpoint, bodyData)

// PATCH request (partial update)
const response = await patch<ResponseType>(endpoint, bodyData)

// DELETE request
const response = await del(endpoint)
```

### Handling Query Parameters

```typescript
export async function searchResources(
  query: {
    search?: string
    category?: string
    page?: number
    limit?: number
  },
): Promise<PaginatedResourcesResponse> {
  const response = await get<PaginatedResourcesResponse>(
    API_ROUTES.RESOURCE.GET_ALL,
    query as Record<string, unknown>,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}
```

### Handling Path Parameters

```typescript
export async function getResourceByUserId(
  userId: string,
  resourceId: string,
): Promise<ResourceResponse> {
  const endpoint = API_ROUTES.RESOURCE.GET_BY_USER_AND_ID
    .replace(':userId', userId)
    .replace(':id', resourceId)
  
  const response = await get<ResourceResponse>(endpoint)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}
```

### Custom Headers

```typescript
export async function uploadResource(
  file: File,
): Promise<ResourceResponse> {
  const formData = new FormData()
  formData.append('file', file)

  // Note: For FormData, you might need to extend api-client
  // or use axios directly with custom headers
  const response = await post<ResourceResponse>(
    API_ROUTES.RESOURCE.UPLOAD,
    formData,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}
```

---

## Best Practices

### 1. Error Handling

Always check for errors in API responses:

```typescript
const response = await get<DataType>(endpoint)

if (response.error) {
  throw new Error(response.error)
}

return response.data!
```

### 2. Type Safety

- Always use proper TypeScript types
- Define both request and response types
- Use `as const` for route constants
- Avoid `any` type

### 3. Documentation

- Add JSDoc comments to all exported functions
- Document parameters and return types
- Explain any complex logic or business rules

```typescript
/**
 * Get all resources with optional filtering
 * @param query - Query parameters for filtering and pagination
 * @returns Promise resolving to paginated resources
 * @throws Error if the API request fails
 */
export async function getResources(
  query?: GetResourcesQueryDto,
): Promise<PaginatedResourcesResponse>
```

### 4. Naming Conventions

- **Functions:** Use camelCase and verb prefixes (`get`, `create`, `update`, `delete`)
- **Types:** Use PascalCase with descriptive suffixes (`Request`, `Response`, `DTO`)
- **Routes:** Use SCREAMING_SNAKE_CASE
- **Files:** Use kebab-case with `.api.ts` or `.types.ts` suffix

### 5. API Response Structure

All API responses follow the `ApiResponse` wrapper:

```typescript
interface ApiResponse<T = unknown> {
  data?: T
  message?: string
  error?: string
  errors?: Record<string, Array<string>>
}
```

### 6. Authentication

The API client automatically adds the Authorization header using the token from localStorage. No additional setup needed for authenticated requests.

### 7. Default Values

Always provide sensible defaults for optional return data:

```typescript
return response.data || {
  total: 0,
  items: [],
  page: 1,
  limit: 10,
  totalPages: 0,
}
```

---

## Testing

### Manual Testing Checklist

- [ ] API route constants are correct
- [ ] Types are properly defined and exported
- [ ] API functions are exported from index.ts
- [ ] All functions have proper TypeScript types
- [ ] Error handling is implemented
- [ ] Path parameters are correctly replaced
- [ ] Query parameters are properly formatted
- [ ] Response data structure matches backend
- [ ] Authentication is working (if required)

### Testing in Browser Console

```typescript
import { getResources, createResource } from '@/services/api'

// Test GET request
const resources = await getResources({ page: 1, limit: 10 })
console.log(resources)

// Test POST request
const newResource = await createResource({
  name: 'Test Resource',
  description: 'Test Description'
})
console.log(newResource)
```

### Common Issues and Solutions

1. **401 Unauthorized**
   - Check if token is stored in localStorage
   - Verify token is not expired
   - Ensure Authorization header is being sent

2. **404 Not Found**
   - Verify API_ROUTES path is correct
   - Check path parameter replacement
   - Confirm backend endpoint exists

3. **Type Errors**
   - Ensure types match backend response
   - Check if types are properly exported
   - Verify import paths are correct

4. **CORS Errors**
   - Configure backend CORS settings
   - Check `withCredentials` in api-client.ts
   - Verify BASE_URL is correct

---

## Quick Reference

### File Checklist

When implementing a new API endpoint, create/update these files:

1. ✅ `types/{resource}.types.ts` - Define types
2. ✅ `types/index.ts` - Export types
3. ✅ `routes.api.ts` - Add route constants
4. ✅ `{resource}.api.ts` - Implement API functions
5. ✅ `index.ts` - Export API functions

### Function Template

```typescript
/**
 * [Function description]
 */
export async function functionName(
  param: ParamType,
): Promise<ReturnType> {
  const endpoint = API_ROUTES.RESOURCE.ENDPOINT.replace(':param', param)
  const response = await method<ReturnType>(endpoint, data)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}
```

---

## Additional Resources

- [Axios Documentation](https://axios-http.com/docs/intro)
- [TypeScript Handbook](https://www.typescriptlang.org/docs/handbook/intro.html)
- [REST API Best Practices](https://restfulapi.net/)

---

**Last Updated:** January 2026
**Maintained By:** Pre-loved Development Team
