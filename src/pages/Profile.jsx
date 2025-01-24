import React from 'react'
import { Card, CardContent } from '../components/ui/card'

const Profile = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex items-center gap-4 mb-6">
          <div className="w-20 h-20 rounded-full bg-slate-700 flex items-center justify-center">
            <span className="text-2xl text-white">JD</span>
          </div>
          <div>
            <h1 className="text-2xl font-bold text-white">John Doe</h1>
            <p className="text-slate-300">@johndoe</p>
          </div>
        </div>
        <div className="space-y-6">
          <div>
            <h2 className="text-lg font-semibold text-white mb-3">My Snippets</h2>
            {/* Snippets grid will go here */}
          </div>
        </div>
      </div>
    </div>
  )
}

export default Profile 