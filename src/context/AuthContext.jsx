import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    if (token) {
      try {
        const response = await auth.getProfile()
        setUser(response.data)
        setLoading(false)
      } catch (error) {
        console.error('Auth check failed:', error)
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setLoading(false)
      }
    } else {
      setLoading(false)
    }
  }

  const login = async (credentials) => {
    try {
      const response = await auth.login(credentials)
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        
        const profileResponse = await auth.getProfile()
        setUser(profileResponse.data)
        return response
      }
    } catch (error) {
      console.error('Login failed:', error)
      toast.error(error.response?.data?.detail || 'Login failed')
      throw error
    }
  }

  const logout = async () => {
    try {
      await auth.logout()
    } catch (error) {
      console.error('Logout error:', error)
    } finally {
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      setUser(null)
    }
  }

  return (
    <AuthContext.Provider value={{ user, setUser, login, logout, loading }}>
      {children}
    </AuthContext.Provider>
  )
}

export const useAuth = () => {
  const context = useContext(AuthContext)
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider')
  }
  return context
} 