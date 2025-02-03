import React, { useState, useEffect, useRef, useCallback } from 'react'
import { snippets as snippetsApi } from '../services/api'
import SnippetCard from '../components/SnippetCard'
import { Search } from 'lucide-react'
import { toast } from 'react-hot-toast'
import StarField from '../components/ui/StarField'
import { useSearchParams } from 'react-router-dom'

const Snippets = () => {
  const [searchParams, setSearchParams] = useSearchParams()
  const [snippets, setSnippets] = useState([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState(null)
  const [searchQuery, setSearchQuery] = useState('')
  const [hasMore, setHasMore] = useState(true)
  const [page, setPage] = useState(1)
  const loader = useRef(null)

  // Get language from URL params
  const languageFilter = searchParams.get('language')

  const loadSnippets = async (pageNum = 1, isInitial = false) => {
    if (!isInitial && loading) return // Prevent multiple loads
    
    try {
      if (isInitial) setLoading(true)
      const response = await snippetsApi.getAll({ 
        page: pageNum, 
        search: searchQuery,
        language: languageFilter
      })
      
      const newSnippets = response.data?.results || []
      setSnippets(prev => pageNum === 1 ? newSnippets : [...prev, ...newSnippets])
      setHasMore(newSnippets.length === 10)
    } catch (error) {
      console.error('Failed to fetch snippets:', error)
      setError(error)
      toast.error('Failed to load snippets')
    } finally {
      setLoading(false)
    }
  }

  // Initial load
  useEffect(() => {
    loadSnippets(1, true)
  }, [])

  // Handle infinite scroll
  const handleObserver = useCallback((entries) => {
    const target = entries[0]
    if (target.isIntersecting && hasMore && !loading) {
      setPage(prev => prev + 1)
    }
  }, [hasMore, loading])

  useEffect(() => {
    const option = {
      root: null,
      rootMargin: "20px",
      threshold: 0
    }
    const observer = new IntersectionObserver(handleObserver, option)
    if (loader.current) observer.observe(loader.current)
    
    return () => {
      if (loader.current) observer.unobserve(loader.current)
    }
  }, [handleObserver])

  // Handle search
  useEffect(() => {
    const timer = setTimeout(() => {
      setPage(1)
      loadSnippets(1, true)
    }, 500)

    return () => clearTimeout(timer)
  }, [searchQuery])

  // Load more when page changes
  useEffect(() => {
    if (page > 1) loadSnippets(page)
  }, [page])

  // Update when language filter changes
  useEffect(() => {
    setPage(1)
    loadSnippets(1, true)
  }, [languageFilter])

  const handleLikeUpdate = (updatedSnippet) => {
    setSnippets(prev => 
      prev.map(snippet => 
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className={`
        relative z-10 max-w-7xl mx-auto p-6 
        transition-all duration-500 ease-in-out
        ${loading ? 'opacity-0 translate-y-2' : 'opacity-100 translate-y-0'}
      `}>
        <h1 className="text-2xl font-bold text-white mb-6">Explore Blox</h1>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
          {/* Search and filters */}
          <div className="mb-8">
            <div className="relative">
              <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 h-5 w-5" />
              <input
                type="text"
                placeholder="Search snippets..."
                className="w-full pl-10 pr-4 py-2 bg-slate-800 border border-slate-700 rounded-lg text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
              />
            </div>
          </div>

          {/* Snippets grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {snippets.map(snippet => (
              <SnippetCard 
                key={snippet.id} 
                snippet={snippet}
                onLikeUpdate={handleLikeUpdate}
              />
            ))}
          </div>

          {/* Loading more indicator */}
          {hasMore && (
            <div ref={loader} className="flex justify-center py-8">
              {loading && page > 1 && (
                <div className="flex items-center gap-2">
                  <div className="animate-spin rounded-full h-4 w-4 border-2 border-slate-500 border-t-transparent"></div>
                  <span className="text-slate-500">Loading more...</span>
                </div>
              )}
            </div>
          )}

          {/* No results */}
          {!loading && snippets.length === 0 && (
            <div className="text-center py-12">
              <p className="text-slate-400">No snippets found</p>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}

export default Snippets 