import React from 'react'
import { Button } from '../components/ui/button'
import { Heart, Star, User } from 'lucide-react'

const SnippetDetail = () => {
  return (
    <div className="max-w-4xl mx-auto px-4 py-8">
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h1 className="text-2xl font-bold text-white">Amazing Button Animation</h1>
            <div className="flex gap-2 mt-2">
              <span className="text-slate-300">CSS</span>
              <span className="text-slate-300">•</span>
              <span className="text-slate-300">Animation</span>
            </div>
          </div>
          <div className="flex gap-2">
            <Button variant="ghost" size="sm" className="text-white">
              <Heart className="h-4 w-4" />
            </Button>
            <Button variant="ghost" size="sm" className="text-white">
              <Star className="h-4 w-4" />
            </Button>
          </div>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 mt-4">
          <pre>
            {`.btn-animate {
  transform: scale(1);
  transition: 0.3s;
}

.btn-animate:hover {
  transform: scale(1.1);
}`}
          </pre>
        </div>
      </div>
    </div>
  )
}

export default SnippetDetail 