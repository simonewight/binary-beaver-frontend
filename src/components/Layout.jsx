import React from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  console.log('Layout rendering:', { user })

  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation will be shared across all pages */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <Link to="/" className="text-2xl font-bold text-white hover:text-slate-200 transition-colors">
              Code Blox
            </Link>
            <div className="flex gap-4">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white"
                    onClick={() => navigate('/collections')}
                  >
                    Collections
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white"
                    onClick={() => {
                      logout()
                      navigate('/')
                    }}
                  >
                    Sign Out
                  </Button>
                </>
              ) : (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-white text-slate-900 hover:bg-slate-100"
                    onClick={() => navigate('/register')}
                  >
                    Get Started
                  </Button>
                </>
              )}
            </div>
          </div>
        </div>
      </nav>

      {/* Page content will be rendered here */}
      <Outlet />
    </div>
  )
}

export default Layout 