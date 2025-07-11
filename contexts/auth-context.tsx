"use client"

import { createContext, useContext, useState, useEffect, type ReactNode } from "react"
import { apiService } from "@/services/api"

interface User {
  id: number
  name: string
  email: string
}

interface AuthResponse {
  token: string
  user: User
}

interface AuthContextType {
  user: User | null
  login: (email: string, password: string) => Promise<void>
  register: (firstName: string, lastName: string, email: string, password: string) => Promise<void>
  logout: () => Promise<void>
  loading: boolean
  isAuthenticated: boolean
}

const AuthContext = createContext<AuthContextType | undefined>(undefined)

export function AuthProvider({ children }: { children: ReactNode }) {
  const [user, setUser] = useState<User | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const initializeAuth = async () => {
      const token = localStorage.getItem("auth_token")
      if (token) {
        apiService.setAuthToken(token)
        try {
          await fetchProfile()
        } catch (error) {
          console.warn("Failed to fetch profile on init:", error)
          // Clear invalid token
          localStorage.removeItem("auth_token")
          apiService.setAuthToken(null)
        }
      }
      setLoading(false)
    }

    initializeAuth()
  }, [])

  const fetchProfile = async () => {
    try {
      const response = await apiService.get<User>("/api/auth/profile")
      setUser(response.data)
    } catch (error) {
      console.warn("Failed to fetch profile:", error)
      throw error
    }
  }

  const login = async (email: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiService.post<AuthResponse>("/api/auth/login", {
        email,
        password,
      })

      const { token, user: userData } = response.data

      if (!token) {
        throw new Error("No token received from server")
      }

      // Store token and set auth header
      localStorage.setItem("auth_token", token)
      apiService.setAuthToken(token)
      setUser(userData)
    } catch (error) {
      console.warn("Login failed:", error)
      // Clear any stored auth data on login failure
      localStorage.removeItem("auth_token")
      apiService.setAuthToken(null)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const register = async (firstName: string, lastName: string, email: string, password: string) => {
    try {
      setLoading(true)
      const response = await apiService.post<AuthResponse>("/api/auth/register", {
        first_name: firstName,
        last_name: lastName,
        email,
        password,
      })

      const { token, user: userData } = response.data

      if (!token) {
        throw new Error("No token received from server")
      }

      // Store token and set auth header
      localStorage.setItem("auth_token", token)
      apiService.setAuthToken(token)
      setUser(userData)
    } catch (error) {
      console.warn("Registration failed:", error)
      // Clear any stored auth data on registration failure
      localStorage.removeItem("auth_token")
      apiService.setAuthToken(null)
      setUser(null)
      throw error
    } finally {
      setLoading(false)
    }
  }

  const logout = async () => {
    try {
      setLoading(true)
      // Call logout endpoint to invalidate session on server
      await apiService.post("/api/auth/logout")
    } catch (error) {
      console.warn("Logout API call failed:", error)
      // Continue with local logout even if API call fails
    } finally {
      // Always clear local auth data
      localStorage.removeItem("auth_token")
      apiService.setAuthToken(null)
      setUser(null)
      setLoading(false)
    }
  }

  const isAuthenticated = !!user && !!localStorage.getItem("auth_token")

  return (
    <AuthContext.Provider
      value={{
        user,
        login,
        register,
        logout,
        loading,
        isAuthenticated,
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
