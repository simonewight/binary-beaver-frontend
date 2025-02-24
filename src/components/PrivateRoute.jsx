import { Navigate, Outlet } from 'react-router-dom'
import { useAuth } from '../context/AuthContext'

const PrivateRoute = ({ publicPaths = [] }) => {
  const { user, loading } = useAuth()

  if (loading) {
    return <div>Loading...</div>
  }

  // Allow access to public paths without authentication
  if (!user && window.location.pathname === '/') {
    return <Outlet />
  }

  return user ? <Outlet /> : <Navigate to="/login" />
}

export default PrivateRoute 