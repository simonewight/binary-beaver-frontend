import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Heart, Star, User } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import SnippetCard from '../SnippetCard'

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