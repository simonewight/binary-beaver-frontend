import React from 'react'
import { Outlet } from 'react-router-dom'
import { Button } from './ui/button'

const Layout = () => {
  return (
    <div className="min-h-screen bg-slate-900">
      {/* Navigation will be shared across all pages */}
      <nav className="bg-slate-800 border-b border-slate-700">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center h-16">
            <div className="text-2xl font-bold text-white">Code Blox</div>
            <div className="flex gap-4">
              <Button variant="ghost" className="text-white">
                Sign In
              </Button>
              <Button className="bg-white text-slate-900 hover:bg-slate-100">
                Get Started
              </Button>
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