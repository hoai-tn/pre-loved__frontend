"use client"

import { createContext, useContext, useState, useEffect, ReactNode } from "react"
import { login, register, getProfile, removeToken } from "@/services/api"
import type { LoginRequest, RegisterRequest, UserProfile } from "@/services/api"

interface AuthContextType {
  user: UserProfile | null
  isAuthenticated: boolean
  isLoading: boolean
  login: (data: LoginRequest) => Promise<void>
  register: (data: RegisterRequest) => Promise<void>
  logout: () => void
  refreshProfile: () => Promise<void>
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<UserProfile | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Check if user is authenticated on mount
  useEffect(() => {
    const checkAuth = async () => {
      // Only check profile if token exists
      const token = localStorage.getItem('token')
      if (!token) {
        setIsLoading(false)
        return
      }

      try {
        const profile = await getProfile()
        setUser(profile)
      } catch {
        // Not authenticated or token expired
        setUser(null)
        localStorage.removeItem('token')
      } finally {
        setIsLoading(false)
      }
    }

    checkAuth()
  }, [])

  const handleLogin = async (data: LoginRequest) => {
    const authResponse = await login(data)
    setUser(authResponse.user)
  }

  const handleRegister = async (data: RegisterRequest) => {
    await register(data)
    // After registration, user needs to login
  }

  const handleLogout = () => {
    removeToken()
    setUser(null)
  }

  const refreshProfile = async () => {
    try {
      const profile = await getProfile()
      setUser(profile)
    } catch {
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider
      value={{
        user,
        isAuthenticated: !!user,
        isLoading,
        login: handleLogin,
        register: handleRegister,
        logout: handleLogout,
        refreshProfile,
      }}
    >
      {children}
    </AuthContext.Provider>
  )
}

export function useAuth() {
  const context = useContext(AuthContext)
  if (context === undefined) {
    throw new Error("useAuth must be used within an AuthProvider")
  }
  return context
}
