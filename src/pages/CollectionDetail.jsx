import React from 'react'
import { useParams } from 'react-router-dom'

const CollectionDetail = () => {
  const { id } = useParams()

  return (
    <div className="max-w-7xl mx-auto p-6">
      <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6">
        <h1 className="text-2xl font-bold text-white mb-4">Collection Details</h1>
        <p className="text-slate-300">Collection ID: {id}</p>
        {/* We'll add more content here later */}
      </div>
    </div>
  )
}

export default CollectionDetail 