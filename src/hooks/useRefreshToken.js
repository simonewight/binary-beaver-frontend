import { useEffect } from 'react'
import { auth } from '../services/api'

const useRefreshToken = (setUser) => {
  const refreshToken = async () => {
    try {
      const response = await auth.refreshToken()
      if (response.data) {
        const { access } = response.data
        localStorage.setItem('access_token', access)
        return true
      }
      return false
    } catch (error) {
      console.error('Token refresh failed:', error)
      // If refresh fails, clear auth state
      localStorage.removeItem('access_token')
      localStorage.removeItem('refresh_token')
      localStorage.removeItem('user')
      setUser(null)
      return false
    }
  }

  useEffect(() => {
    // Refresh token every 23 minutes (as tokens typically expire in 24 minutes)
    const interval = setInterval(() => {
      const token = localStorage.getItem('refresh_token')
      if (token) {
        refreshToken()
      }
    }, 23 * 60 * 1000)

    return () => clearInterval(interval)
  }, [])

  return refreshToken
}

export default useRefreshToken 