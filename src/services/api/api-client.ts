import axios from 'axios'
import { API_ROUTES } from './routes.api'
import type { AxiosError, AxiosInstance } from 'axios'
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
 * Create axios instance with base configuration
 */
const axiosInstance: AxiosInstance = axios.create({
  baseURL: API_ROUTES.BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
})

/**
 * Request interceptor to add Authorization header
 */
axiosInstance.interceptors.request.use(
  (config) => {
    const token = getToken()
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => {
    return Promise.reject(error)
  },
)

/**
 * Response interceptor for error handling
 */
axiosInstance.interceptors.response.use(
  (response) => {
    return response
  },
  (error: AxiosError) => {
    return Promise.reject(error)
  },
)

/**
 * Base API client using axios
 */
async function apiClient<T = unknown>(
  endpoint: string,
  options: {
    method?: 'GET' | 'POST' | 'PUT' | 'DELETE' | 'PATCH'
    body?: unknown
    headers?: Record<string, string>
  } = {},
): Promise<ApiResponse<T>> {
  try {
    const response = await axiosInstance.request<ApiResponse<T>>({
      url: endpoint,
      method: options.method || 'GET',
      data: options.body,
      headers: options.headers,
    })
    return { data: response.data.data }
  } catch (error) {
    if (axios.isAxiosError(error)) {
      const axiosError = error as AxiosError<{
        message?: string
        error?: string
        errors?: Record<string, Array<string>>
      }>

      const responseData = axiosError.response?.data

      return {
        error:
          responseData?.message ||
          responseData?.error ||
          axiosError.message ||
          'Request failed',
        errors: responseData?.errors,
      }
    }

    return {
      error: error instanceof Error ? error.message : 'Network error occurred',
    }
  }
}

/**
 * GET request
 */
export async function get<T = unknown>(
  endpoint: string,
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, { method: 'GET' })
}

/**
 * POST request
 */
export async function post<T = unknown>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, {
    method: 'POST',
    body,
  })
}

/**
 * PUT request
 */
export async function put<T = unknown>(
  endpoint: string,
  body?: unknown,
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, {
    method: 'PUT',
    body,
  })
}

/**
 * DELETE request
 */
export async function del<T = unknown>(
  endpoint: string,
): Promise<ApiResponse<T>> {
  return apiClient<T>(endpoint, { method: 'DELETE' })
}
