import React from 'react'
import { Card, CardContent } from '../components/ui/card'
import { Button } from '../components/ui/button'

const Collections = () => {
  return (
    <div className="max-w-7xl mx-auto px-4 py-8">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-bold text-white">My Collections</h1>
        <Button>New Collection</Button>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {/* Collection cards will go here */}
      </div>
    </div>
  )
}

export default Collections 