import React from 'react'
import { Outlet, useNavigate, Link } from 'react-router-dom'
import { Button } from './ui/button'
import { useAuth } from '../context/AuthContext'

const Layout = () => {
  const navigate = useNavigate()
  const { user, logout } = useAuth()
  console.log('Layout rendering:', { user })

  return (
    <div className="min-h-screen">
      {/* Add z-30 to ensure nav is above stars */}
      <nav className="relative z-30 bg-slate-900 border-b border-slate-800">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex">
              <Link to="/" className="flex items-center">
                <img src="/logo.png" alt="Logo" className="h-8 w-8" />
                <span className="ml-2 text-white font-bold">Code Blox</span>
              </Link>
            </div>
            <div className="flex items-center gap-6">
              {user ? (
                <>
                  <Button 
                    variant="ghost" 
                    className="text-white px-4"
                    onClick={() => navigate('/profile')}
                  >
                    Profile
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white px-4"
                    onClick={() => navigate('/collections')}
                  >
                    Collections
                  </Button>
                  <Button 
                    variant="ghost" 
                    className="text-white px-4"
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
                    className="text-white px-4"
                    onClick={() => navigate('/login')}
                  >
                    Sign In
                  </Button>
                  <Button 
                    className="bg-white text-slate-900 hover:bg-slate-100 px-6"
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

      {/* Content */}
      <main>
        <Outlet />
      </main>
    </div>
  )
}

export default Layout 