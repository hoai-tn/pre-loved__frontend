import { get, post, setToken } from './api-client'
import { API_ROUTES } from './routes.api'
import type {
  AuthResponse,
  LoginRequest,
  RegisterRequest,
  RegisterResponse,
  UserProfile,
} from './types.api'

/**
 * Register a new user
 */
export async function register(
  payload: RegisterRequest,
): Promise<RegisterResponse> {
  const response = await post<RegisterResponse>(
    API_ROUTES.USER.REGISTER,
    payload,
  )

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}

/**
 * Login user
 */
export async function login(payload: LoginRequest): Promise<AuthResponse> {
  const response = await post<AuthResponse>(API_ROUTES.USER.LOGIN, payload)

  if (response.error) {
    throw new Error(response.error)
  }

  const authData = response.data!
  console.log('authData', authData)
  // Store token if provided
  if (authData.accessToken) {
    setToken(authData.accessToken)
  }
  return authData
}

/**
 * Get user profile
 */
export async function getProfile(): Promise<UserProfile> {
  const response = await get<UserProfile>(API_ROUTES.USER.PROFILE)

  if (response.error) {
    throw new Error(response.error)
  }

  return response.data!
}
