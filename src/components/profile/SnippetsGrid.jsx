import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Heart, Star, User } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'

const SnippetCard = ({ snippet, onLikeUpdate }) => {
  const navigate = useNavigate()

  const handleLike = async (e) => {
    e.stopPropagation()
    try {
      // Optimistically update UI
      onLikeUpdate({
        ...snippet,
        is_liked: !snippet.is_liked,
        likes_count: snippet.likes_count + (snippet.is_liked ? -1 : 1)
      })

      // Make API call
      const response = await snippetsApi.like(snippet.id)
      
      // If API call fails, revert the optimistic update
      if (!response.data.success) {
        onLikeUpdate({
          ...snippet,
          is_liked: snippet.is_liked,
          likes_count: snippet.likes_count
        })
        toast.error('Failed to update like')
      }
    } catch (error) {
      // Revert optimistic update on error
      onLikeUpdate({
        ...snippet,
        is_liked: snippet.is_liked,
        likes_count: snippet.likes_count
      })
      toast.error('Failed to update like')
    }
  }

  return (
    <Card 
      className="bg-slate-800/50 backdrop-blur-sm border-slate-700 transition-all duration-200 hover:scale-[1.02] hover:shadow-xl cursor-pointer group"
      onClick={() => navigate(`/snippet/${snippet.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-white hover:text-cyan-400 transition-colors">
              {snippet.title}
            </h3>
            <div className="flex gap-2 mt-1">
              <span className="text-slate-300 text-sm">{snippet.language}</span>
              {snippet.tags?.map(tag => (
                <span key={tag} className="text-slate-300 text-sm">• {tag}</span>
              ))}
            </div>
          </div>
          <Button 
            variant="ghost" 
            size="sm" 
            className="text-white hover:text-cyan-400 transition-colors opacity-0 group-hover:opacity-100"
            onClick={handleLike}
          >
            <Heart 
              className={`h-4 w-4 transition-all duration-200 ${
                snippet.is_liked 
                  ? 'fill-cyan-400 text-cyan-400' 
                  : 'group-hover:scale-110 group-hover:text-cyan-400'
              }`} 
            />
          </Button>
        </div>
        <div className="bg-slate-900 rounded-lg p-4 font-mono text-sm text-slate-300 overflow-hidden">
          <pre className="overflow-x-auto whitespace-pre">
            {snippet.code_content
              .split('\n')
              .slice(0, 5)
              .map(line => line.trimStart()) // Remove leading whitespace
              .join('\n')}
            {snippet.code_content.split('\n').length > 5 && '\n...'}
          </pre>
        </div>
        <div className="flex justify-between items-center mt-4">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-slate-300 text-sm">@{snippet.owner.username}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Star className="h-4 w-4" />
            <span className="text-sm">{snippet.likes_count}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

const SnippetsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const SnippetsGrid = ({ snippets, isLoading }) => {
  console.log('SnippetsGrid props:', { snippets, isLoading })
  
  const [localSnippets, setLocalSnippets] = useState(snippets)

  useEffect(() => {
    setLocalSnippets(snippets)
  }, [snippets])

  const handleLikeUpdate = (updatedSnippet) => {
    setLocalSnippets(prev => 
      prev.map(snippet => 
        snippet.id === updatedSnippet.id ? updatedSnippet : snippet
      )
    )
  }

  if (isLoading) return <SnippetsGridSkeleton />
  
  if (!snippets?.length) {
    return (
      <div className="text-center py-12">
        <p className="text-slate-400">No snippets yet</p>
        <Button 
          variant="outline" 
          className="mt-4 text-white border-slate-700"
          onClick={() => navigate('/snippets/new')}
        >
          Create Your First Snippet
        </Button>
      </div>
    )
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {localSnippets.map((snippet) => (
        <SnippetCard 
          key={snippet.id} 
          snippet={snippet} 
          onLikeUpdate={handleLikeUpdate}
        />
      ))}
    </div>
  )
}

export default SnippetsGrid 