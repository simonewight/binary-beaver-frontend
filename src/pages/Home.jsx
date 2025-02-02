import React from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Search, Star, Heart, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  console.log('Home rendering:', { user })

  return (
    <div className="bg-slate-900 min-h-screen">
      {/* Hero Section */}
      <div className="pt-20 pb-16 text-center bg-slate-900">
        <h1 className="text-6xl font-extrabold text-white mb-6">
          Build. Share. Play with Code.
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join the next generation of coders in a fun, interactive space where learning meets gaming.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-slate-900 hover:bg-slate-100"
            onClick={() => navigate(user ? '/profile' : '/register')}
          >
            {user ? 'Start Coding Now' : 'Get Started'}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="text-white border-white"
            onClick={() => navigate('/snippets')}
          >
            Explore Blox
          </Button>
        </div>
      </div>

      {/* Featured Snippets */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Featured Blox</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {[1, 2, 3].map((item) => (
            <Card key={item} className="bg-slate-800 border-slate-700">
              <CardContent className="p-6">
                <div className="flex justify-between items-start mb-4">
                  <div>
                    <h3 className="text-lg font-medium text-white">Amazing Button Animation</h3>
                    <div className="flex gap-2 mt-1">
                      <span className="text-slate-300 text-sm">CSS</span>
                      <span className="text-slate-300 text-sm">•</span>
                      <span className="text-slate-300 text-sm">Animation</span>
                    </div>
                  </div>
                  <Button variant="ghost" size="sm" className="text-white">
                    <Heart className="h-4 w-4" />
                  </Button>
                </div>
                <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300">
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
                <div className="flex justify-between items-center mt-4">
                  <div className="flex items-center gap-2">
                    <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
                      <User className="h-4 w-4 text-white" />
                    </div>
                    <span className="text-slate-300 text-sm">@coderPro</span>
                  </div>
                  <div className="flex items-center gap-2 text-slate-300">
                    <Star className="h-4 w-4" />
                    <span className="text-sm">128</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {['HTML & CSS', 'JavaScript', 'React', 'Python'].map((category) => (
            <Button
              key={category}
              variant="outline"
              className="h-24 text-white border-slate-700 hover:bg-slate-800"
            >
              {category}
            </Button>
          ))}
        </div>
      </div>
    </div>
  )
}

export default Home 