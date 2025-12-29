import type { AuthResponse, SignInRequest, SignUpRequest } from '../types/auth'

/**
 * Sign Up API call
 * TODO: Replace with actual API endpoint when backend is ready
 */
export async function signUp(data: SignUpRequest): Promise<AuthResponse> {
  // Placeholder for API call
  // When API is ready, replace with:
  // const response = await fetch('/api/auth/signup', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // return response.json()

  // For now, simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Sign Up API call:', data)
      resolve({
        message: 'Đăng ký thành công!',
        user: {
          id: '1',
          username: data.username,
          email: data.email,
        },
      })
    }, 1000)
  })
}

/**
 * Sign In API call
 * TODO: Replace with actual API endpoint when backend is ready
 */
export async function signIn(data: SignInRequest): Promise<AuthResponse> {
  // Placeholder for API call
  // When API is ready, replace with:
  // const response = await fetch('/api/auth/signin', {
  //   method: 'POST',
  //   headers: { 'Content-Type': 'application/json' },
  //   body: JSON.stringify(data),
  // })
  // return response.json()

  // For now, simulate API call
  return new Promise((resolve) => {
    setTimeout(() => {
      console.log('Sign In API call:', data)
      resolve({
        token: 'mock-token-12345',
        message: 'Đăng nhập thành công!',
        user: {
          id: '1',
          username: data.username,
          email: 'hoai.dev@gmail.com',
        },
      })
    }, 1000)
  })
}
