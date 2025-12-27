# Auth Store Documentation

## Overview

This auth store is built using **Zustand** for state management, providing a scalable and performant solution for managing authentication state across the application.

## Architecture

The store follows a modular architecture with clear separation of concerns:

```
store/
└── auth/
    ├── index.ts          # Main store configuration and exports
    ├── state.ts          # Initial state definition
    ├── actions.ts        # Synchronous actions
    ├── asyncActions.ts   # Asynchronous actions (API calls)
    ├── types.ts          # TypeScript types and interfaces
    └── README.md         # This documentation
```

## Features

- ✅ **DevTools Integration**: Debug state changes with Redux DevTools
- ✅ **Optimized Selectors**: Prevent unnecessary re-renders
- ✅ **TypeScript Support**: Full type safety
- ✅ **Async Actions**: Complete API integration
- ✅ **Auto-check Authentication**: Automatically checks auth status on mount
- ✅ **Clean Architecture**: Modular and scalable structure
- ✅ **Error Handling**: Comprehensive error handling for all operations

## Usage

### Basic Usage

```tsx
import { useAuthStore } from '@/store/auth'

function MyComponent() {
  // Direct state access
  const user = useAuthStore((state) => state.user)
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated)
  
  // Access actions
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  
  return (
    <div>
      {isAuthenticated ? (
        <div>
          <p>Welcome, {user?.username}!</p>
          <button onClick={logout}>Logout</button>
        </div>
      ) : (
        <button onClick={() => login({ username: 'user', password: 'pass' })}>
          Login
        </button>
      )}
    </div>
  )
}
```

### Using Optimized Selectors

For better performance, use the provided selectors to prevent unnecessary re-renders:

```tsx
import { 
  useAuthStore, 
  selectUser, 
  selectIsAuthenticated,
  selectIsLoading 
} from '@/store/auth'

function UserProfile() {
  // This component will only re-render when user changes
  const user = useAuthStore(selectUser)
  
  // This component will only re-render when auth status changes
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  
  return (
    <div>
      {isAuthenticated && user ? (
        <div>
          <h3>{user.username}</h3>
          <p>{user.email}</p>
        </div>
      ) : (
        <p>Please log in</p>
      )}
    </div>
  )
}
```

### Available Selectors

```typescript
import {
  selectUser,              // Get current user
  selectIsAuthenticated,   // Get authentication status
  selectIsLoading,         // Get loading state
  selectAuthError,         // Get error state
} from '@/store/auth'
```

## API Reference

### State

```typescript
interface AuthState {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  error: string | null
}

interface UserProfile {
  id: string
  username: string
  email: string
}
```

### Actions

#### Async Actions

- **`login(data: LoginRequest): Promise<void>`**
  - Authenticates a user with username and password
  - Updates user state on success
  - Throws error on failure
  
  ```typescript
  interface LoginRequest {
    username: string
    password: string
  }
  ```

- **`register(data: RegisterRequest): Promise<void>`**
  - Registers a new user account
  - After registration, user needs to login separately
  - Throws error on failure
  
  ```typescript
  interface RegisterRequest {
    username: string
    email: string
    password: string
  }
  ```

- **`logout(): void`**
  - Logs out the current user
  - Clears user state and removes token from localStorage

- **`refreshProfile(): Promise<void>`**
  - Fetches the latest user profile from the server
  - Updates user state with fresh data
  - Clears user state if token is invalid

- **`checkAuth(): Promise<void>`**
  - Checks if user is authenticated on mount
  - Automatically called when the store initializes
  - Verifies token and loads user profile

#### Internal State Setters

- **`setUser(user: UserProfile | null)`**
  - Sets the user and authentication status
  
- **`setLoading(loading: boolean)`**
  - Sets the loading state
  
- **`setError(error: string | null)`**
  - Sets the error state

## Examples

### Login Form

```tsx
import { useAuthStore } from '@/store/auth'
import { useState } from 'react'

function LoginForm() {
  const login = useAuthStore((state) => state.login)
  const isLoading = useAuthStore((state) => state.isLoading)
  const error = useAuthStore((state) => state.error)
  
  const [username, setUsername] = useState('')
  const [password, setPassword] = useState('')

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault()
    
    try {
      await login({ username, password })
      // Success - redirect or show success message
    } catch (err) {
      // Error is already set in the store
      console.error('Login failed:', err)
    }
  }

  return (
    <form onSubmit={handleSubmit}>
      <input
        type="text"
        value={username}
        onChange={(e) => setUsername(e.target.value)}
        placeholder="Username"
      />
      <input
        type="password"
        value={password}
        onChange={(e) => setPassword(e.target.value)}
        placeholder="Password"
      />
      {error && <p className="error">{error}</p>}
      <button type="submit" disabled={isLoading}>
        {isLoading ? 'Logging in...' : 'Login'}
      </button>
    </form>
  )
}
```

### User Menu in Navbar

```tsx
import { useAuthStore, selectUser, selectIsAuthenticated } from '@/store/auth'

function UserMenu() {
  const user = useAuthStore(selectUser)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const logout = useAuthStore((state) => state.logout)

  if (!isAuthenticated || !user) {
    return <button>Login</button>
  }

  return (
    <div>
      <span>Welcome, {user.username}</span>
      <button onClick={logout}>Logout</button>
    </div>
  )
}
```

### Protected Route Component

```tsx
import { useAuthStore, selectIsAuthenticated, selectIsLoading } from '@/store/auth'
import { useEffect } from 'react'
import { useNavigate } from '@tanstack/react-router'

function ProtectedRoute({ children }: { children: React.ReactNode }) {
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const isLoading = useAuthStore(selectIsLoading)
  const navigate = useNavigate()

  useEffect(() => {
    if (!isLoading && !isAuthenticated) {
      navigate({ to: '/signin' })
    }
  }, [isAuthenticated, isLoading, navigate])

  if (isLoading) {
    return <div>Loading...</div>
  }

  if (!isAuthenticated) {
    return null
  }

  return <>{children}</>
}
```

## Migration from Context API

If you're migrating from the old Context API, here's a quick comparison:

### Before (Context API)

```tsx
import { useAuth } from '@/lib/contexts/auth-context'

function MyComponent() {
  const { user, isAuthenticated, login, logout } = useAuth()
  // ...
}
```

### After (Zustand)

```tsx
import { useAuthStore, selectUser, selectIsAuthenticated } from '@/store/auth'

function MyComponent() {
  const user = useAuthStore(selectUser)
  const isAuthenticated = useAuthStore(selectIsAuthenticated)
  const login = useAuthStore((state) => state.login)
  const logout = useAuthStore((state) => state.logout)
  // ...
}
```

## Automatic Authentication Check

The auth store automatically checks if the user is authenticated when the application loads:

1. On initialization, `checkAuth()` is called automatically
2. It checks for a token in localStorage
3. If a token exists, it fetches the user profile
4. If the token is invalid or expired, it clears the user state
5. The `isLoading` state is set to `false` once the check is complete

This means you don't need to manually call `checkAuth()` - it happens automatically!

## Error Handling

All async actions include comprehensive error handling:

```tsx
const login = useAuthStore((state) => state.login)
const error = useAuthStore((state) => state.error)

try {
  await login({ username, password })
  // Success
} catch (err) {
  // Error is automatically set in the store
  console.error('Login failed:', err)
  
  // You can also access the error from the store
  const storeError = useAuthStore.getState().error
}
```

## Performance Tips

1. **Use Selectors**: Always use selectors to access specific parts of the state to prevent unnecessary re-renders
2. **Destructure Carefully**: Only destructure the values you need
3. **Avoid Inline Selectors**: Define selectors outside components for better performance
4. **Use Multiple Subscriptions**: Instead of accessing multiple state values in one selector, use multiple focused selectors

## Testing

```tsx
import { useAuthStore } from '@/store/auth'

describe('Auth Store', () => {
  beforeEach(() => {
    // Reset store state before each test
    useAuthStore.setState({ 
      user: null, 
      isAuthenticated: false, 
      isLoading: false,
      error: null 
    })
  })

  it('should set user on successful login', async () => {
    const { login } = useAuthStore.getState()
    
    await login({ username: 'testuser', password: 'password' })

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(isAuthenticated).toBe(true)
    expect(user).toBeTruthy()
    expect(user?.username).toBe('testuser')
  })

  it('should clear user on logout', () => {
    const { logout } = useAuthStore.getState()
    
    // Set initial user
    useAuthStore.setState({ 
      user: { id: '1', username: 'test', email: 'test@test.com' },
      isAuthenticated: true 
    })
    
    logout()

    const { user, isAuthenticated } = useAuthStore.getState()
    expect(isAuthenticated).toBe(false)
    expect(user).toBeNull()
  })
})
```

## Debugging

The store includes Redux DevTools integration. To debug:

1. Install [Redux DevTools Extension](https://github.com/reduxjs/redux-devtools)
2. Open DevTools in your browser
3. Look for "AuthStore" in the Redux tab
4. You can:
   - View current state
   - See action history
   - Time-travel debug
   - Export/import state

## Best Practices

1. **Error Handling**: Always handle errors in async actions
2. **Loading States**: Use `isLoading` to show loading indicators
3. **Token Management**: Token is stored in localStorage and managed by API client
4. **Type Safety**: Leverage TypeScript for all auth-related operations
5. **Selective Updates**: Use selectors to subscribe only to the data you need
6. **Security**: Never store sensitive data in the store - only user profile info

## Integration with API

The auth store integrates with the API service layer:

```typescript
// The store uses these API functions from @/services/api
import { login, register, getProfile, removeToken } from '@/services/api'
```

All API interactions are handled through these service functions, keeping the store clean and focused on state management.

## Future Enhancements

- [ ] Add support for refresh tokens
- [ ] Implement remember me functionality
- [ ] Add social authentication (Google, Facebook)
- [ ] Support for multi-factor authentication
- [ ] Add user preferences to the store
- [ ] Implement session timeout warnings
- [ ] Add audit logging for auth events

