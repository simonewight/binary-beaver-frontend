import { Navigate, useLocation, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'
import Spinner from './ui/spinner'

const ProtectedRoute = () => {
  const { user, loading } = useAuth()
  const location = useLocation()
  
  console.log('ProtectedRoute:', { 
    user, 
    loading,
    location: location.pathname,
    localStorage: {
      user: localStorage.getItem('user'),
      token: localStorage.getItem('access_token')
    }
  })

  if (loading) {
    return (
      <div className="min-h-screen bg-slate-900 flex items-center justify-center">
        <Spinner className="w-8 h-8" />
      </div>
    )
  }

  if (!user && location.pathname !== '/login') {
    console.log('No user found, redirecting to login')
    return <Navigate to="/login" replace state={{ from: location }} />
  }

  return <Outlet />
}

export default ProtectedRoute 