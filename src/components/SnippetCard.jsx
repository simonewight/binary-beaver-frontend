import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { Card, CardContent } from './ui/card'
import { Button } from './ui/button'
import { Heart, Star, User } from 'lucide-react'
import { snippets } from '../services/api'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'
import CodePreview from './ui/CodePreview'

const SnippetCard = ({ snippet: initialSnippet, onLikeUpdate }) => {
  const navigate = useNavigate()
  const { user } = useAuth()
  const [snippet, setSnippet] = useState(initialSnippet)
  const [isLiking, setIsLiking] = useState(false)
  const [localLikes, setLocalLikes] = useState(snippet.likes_count || 0)
  const [isLiked, setIsLiked] = useState(snippet.is_liked || false)

  const handleLike = async (e) => {
    e.stopPropagation()
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setIsLiking(true)
      const response = await snippets.like(snippet.id)
      
      if (response.success) {
        setIsLiked(response.is_liked)
        setLocalLikes(response.likes_count)
        
        if (onLikeUpdate) {
          onLikeUpdate({
            ...snippet,
            is_liked: response.is_liked,
            likes_count: response.likes_count
          })
        }

        toast.success(response.is_liked ? 'Added to favourites' : 'Removed from favourites')
      }
    } catch (error) {
      console.error('Like error details:', error.response?.data)
      toast.error('Failed to update favourite')
    } finally {
      setIsLiking(false)
    }
  }

  return (
    <Card 
      className="bg-slate-800 border-slate-700 cursor-pointer transition-all hover:scale-[1.02] hover:shadow-lg"
      onClick={() => navigate(`/snippet/${snippet.id}`)}
    >
      <CardContent className="p-6">
        <div className="flex justify-between items-start mb-4">
          <div>
            <h3 className="text-lg font-medium text-white">{snippet.title}</h3>
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
            className={`hover:bg-transparent ${
              isLiked 
                ? 'text-cyan-500 hover:text-cyan-400' 
                : 'text-slate-400 hover:text-cyan-500'
            }`}
            onClick={(e) => {
              e.stopPropagation()
              handleLike(e)
            }}
            disabled={isLiking}
          >
            <Heart className={`h-4 w-4 ${isLiked ? 'fill-current' : ''}`} />
          </Button>
        </div>
        <div className="bg-slate-900 rounded-lg overflow-hidden">
          <CodePreview 
            code={snippet.code_content}
            language={snippet.language}
          />
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
            <span className="text-sm">{localLikes}</span>
          </div>
        </div>
      </CardContent>
    </Card>
  )
}

export default SnippetCard 