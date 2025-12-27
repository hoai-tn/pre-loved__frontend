import { API_ROUTES } from './routes.api'
import type { ApiResponse } from './types.api'

/**
 * Get stored auth token
 */
function getToken(): string | null {
  return localStorage.getItem('token')
}

/**
 * Set auth token
 */
export function setToken(token: string): void {
  localStorage.setItem('token', token)
}

/**
 * Remove auth token
 */
export function removeToken(): void {
  localStorage.removeItem('token')
}

/**
 * Base API client using fetch
 */
async function apiClient<T = unknown>(
  endpoint: string,
  options: RequestInit = {}
): Promise<ApiResponse<T>> {
  const token = getToken()
  const url = `${API_ROUTES.BASE_URL}${endpoint}`

  const headers: Record<string, string> = {
    'Content-Type': 'application/json',
    ...(options.headers as Record<string, string>),
  }

  if (token) {
    headers['Authorization'] = `Bearer ${token}`
  }

  try {
    const response = await fetch(url, {
      ...options,
      headers,
    })

    const data = await response.json()

    if (!response.ok) {
      return {
        error: data.message || data.error || 'Request failed',
        errors: data.errors,
      }
    }

    return { data }
  } catch (error) {
    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    }
  }
}

/**
 * GET request
 */
export async function get<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export async function post<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * PUT request
 */
export async function put<T = unknown>(
  endpoint: string,
  body?: unknown
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body: body ? JSON.stringify(body) : undefined,
  })
}

/**
 * DELETE request
 */
export async function del<T = unknown>(endpoint: string): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
