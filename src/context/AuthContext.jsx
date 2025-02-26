import React, { createContext, useContext, useState, useEffect } from 'react'
import { auth } from '../services/api'
import { toast } from 'react-hot-toast'

const AuthContext = createContext(null)

export const AuthProvider = ({ children }) => {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    console.log('AuthProvider mounted')  // Debug log
    checkAuth()
  }, [])

  const checkAuth = async () => {
    const token = localStorage.getItem('access_token')
    console.log('Checking auth, token present:', !!token)
    
    if (token) {
      try {
        console.log('Getting profile...')
        const response = await auth.getProfile()
        console.log('Full profile response:', response)
        setUser(response.data)
      } catch (error) {
        console.error('Auth check failed:', error.response || error)
        // Only remove tokens if refresh token is invalid
        if (error.response?.status === 401) {
          try {
            // Attempt to refresh the token
            const refreshToken = localStorage.getItem('refresh_token')
            if (refreshToken) {
              const refreshResponse = await auth.refreshToken()
              if (refreshResponse.data.access) {
                localStorage.setItem('access_token', refreshResponse.data.access)
                // Retry the profile fetch
                const retryResponse = await auth.getProfile()
                setUser(retryResponse.data)
                setLoading(false)
                return
              }
            }
          } catch (refreshError) {
            console.error('Token refresh failed:', refreshError)
            // Clear tokens and user on refresh failure
            localStorage.removeItem('access_token')
            localStorage.removeItem('refresh_token')
            setUser(null)
          }
        }
        // If we get here, either refresh failed or there was a different error
        localStorage.removeItem('access_token')
        localStorage.removeItem('refresh_token')
        setUser(null)
      }
    }
    setLoading(false)
  }

  const login = async (credentials) => {
    try {
      console.log('Attempting login...')
      const response = await auth.login(credentials)
      console.log('Login response:', response.data)
      
      if (response.data.access) {
        localStorage.setItem('access_token', response.data.access)
        localStorage.setItem('refresh_token', response.data.refresh)
        
        // Get full user profile
        const profileResponse = await auth.getProfile()
        console.log('Profile response after login:', profileResponse.data)
        setUser(profileResponse.data)
        return response
      }
    } catch (error) {
      console.error('Login failed:', error.response || error)
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