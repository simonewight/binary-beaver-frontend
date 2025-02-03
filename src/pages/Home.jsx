import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { Button } from '../components/ui/button'
import { Card, CardContent } from '../components/ui/card'
import { Search, Star, Heart, User } from 'lucide-react'
import { useAuth } from '../context/AuthContext'
import StarField from '../components/ui/StarField'
import { snippets as snippetsApi } from '../services/api'
import SnippetCard from '../components/SnippetCard'

const Home = () => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [featuredSnippets, setFeaturedSnippets] = useState([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadFeaturedSnippets = async () => {
      try {
        setLoading(true)
        // Get the 3 most liked snippets
        const response = await snippetsApi.getAll({ 
          limit: 3,
          ordering: '-likes_count'  // Sort by most likes
        })
        if (response.data?.results) {
          // Ensure we only take the first 3 even if API returns more
          setFeaturedSnippets(response.data.results.slice(0, 3))
        }
      } catch (error) {
        console.error('Failed to load featured snippets:', error)
      } finally {
        setLoading(false)
      }
    }

    loadFeaturedSnippets()
  }, [])

  const handleCategoryClick = (language) => {
    navigate(`/snippets?language=${language.toLowerCase()}`)
  }

  return (
    <div className="bg-slate-900 min-h-screen">
      <StarField />
      <div className="relative z-10">
      {/* Hero Section */}
      <div className="pt-20 pb-16 text-center">
        <h1 className="text-6xl font-extrabold text-white mb-6">
          Build. Share. Play with Code.
        </h1>
        <p className="text-xl text-slate-300 mb-8 max-w-2xl mx-auto">
          Join the next generation of coders in a fun, interactive space where learning meets gaming.
        </p>
        <div className="flex justify-center gap-4">
          <Button 
            size="lg" 
            className="bg-white text-slate-900 hover:bg-slate-100 px-8 py-3"
            onClick={() => navigate(user ? '/profile' : '/register')}
          >
            {user ? 'Start Coding Now' : 'Get Started'}
          </Button>
          <Button 
            size="lg" 
            variant="outline" 
            className="bg-cyan-500 hover:bg-cyan-400 text-white border-none px-8 py-3"
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
          {loading ? (
            // Show skeleton loading state
            [1, 2, 3].map((i) => (
              <div key={i} className="animate-pulse bg-slate-800 rounded-lg h-64" />
            ))
          ) : (
            featuredSnippets.map(snippet => (
              <SnippetCard
                key={snippet.id}
                snippet={snippet}
                onLikeUpdate={(updatedSnippet) => {
                  setFeaturedSnippets(prev =>
                    prev.map(s => s.id === updatedSnippet.id ? updatedSnippet : s)
                  )
                }}
              />
            ))
          )}
        </div>
      </div>

      {/* Categories */}
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-16">
        <h2 className="text-3xl font-bold text-white mb-8">Popular Categories</h2>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          {[
            { name: 'HTML & CSS', value: 'css' },
            { name: 'JavaScript', value: 'javascript' },
            { name: 'React', value: 'jsx' },
            { name: 'Python', value: 'python' }
          ].map((category) => (
            <Button
              key={category.name}
              variant="outline"
              className="h-24 text-white border-slate-700 hover:bg-slate-800/50 bg-slate-800/30"
              onClick={() => handleCategoryClick(category.value)}
            >
              {category.name}
            </Button>
          ))}
        </div>
      </div>
    </div>
    </div>
  )
}

export default Home 