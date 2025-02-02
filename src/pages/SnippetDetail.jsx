import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { snippets } from '../services/api'
import { Button } from '../components/ui/button'
import CodeEditor from '../components/ui/code-editor'
import { Heart, Star, User, Share2, Clock, Tag } from 'lucide-react'
import { toast } from 'react-hot-toast'
import { useAuth } from '../context/AuthContext'
import { motion } from 'framer-motion'
import Comment from '../components/Comment'

const SnippetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [snippet, setSnippet] = useState(null)
  const [loading, setLoading] = useState(true)
  const [isLiking, setIsLiking] = useState(false)
  const [comments, setComments] = useState([])
  const [newComment, setNewComment] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)

  useEffect(() => {
    const fetchSnippet = async () => {
      try {
        const response = await snippets.get(id)
        if (response.data.success) {
          setSnippet(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch snippet:', error)
        toast.error('Failed to load snippet')
      } finally {
        setLoading(false)
      }
    }

    fetchSnippet()
  }, [id])

  useEffect(() => {
    const fetchComments = async () => {
      try {
        const response = await snippets.getComments(id)
        if (response.data.success) {
          setComments(response.data.data)
        }
      } catch (error) {
        console.error('Failed to fetch comments:', error)
      }
    }

    if (snippet) {
      fetchComments()
    }
  }, [id, snippet])

  const handleLike = async () => {
    if (!user) {
      navigate('/login')
      return
    }

    try {
      setIsLiking(true)
      const response = await snippets.like(id)
      if (response.data.success) {
        setSnippet(prev => ({
          ...prev,
          is_liked: !prev.is_liked,
          likes_count: prev.is_liked ? prev.likes_count - 1 : prev.likes_count + 1
        }))
        toast.success(snippet.is_liked ? 'Removed from favorites' : 'Added to favorites')
      }
    } catch (error) {
      console.error('Failed to like snippet:', error)
      toast.error('Failed to update favorite status')
    } finally {
      setIsLiking(false)
    }
  }

  const handleCopyCode = () => {
    navigator.clipboard.writeText(snippet.code_content)
    toast.success('Code copied to clipboard')
  }

  const handleAddComment = async (e) => {
    e.preventDefault()
    if (!user) {
      navigate('/login')
      return
    }

    if (!newComment.trim()) {
      toast.error('Comment cannot be empty')
      return
    }

    try {
      setIsSubmitting(true)
      const response = await snippets.addComment(id, { content: newComment })
      if (response.data.success) {
        setComments([response.data.data, ...comments])
        setNewComment('')
        toast.success('Comment added successfully')
      }
    } catch (error) {
      console.error('Failed to add comment:', error)
      toast.error('Failed to add comment')
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteComment = async (commentId) => {
    try {
      await snippets.deleteComment(id, commentId)
      setComments(comments.filter(c => c.id !== commentId))
      toast.success('Comment deleted successfully')
    } catch (error) {
      console.error('Failed to delete comment:', error)
      toast.error('Failed to delete comment')
    }
  }

  const handleUpdateComment = async (commentId, content) => {
    try {
      const response = await snippets.updateComment(id, commentId, { content })
      if (response.data.success) {
        setComments(comments.map(c => 
          c.id === commentId ? { ...c, content } : c
        ))
        toast.success('Comment updated successfully')
      }
    } catch (error) {
      console.error('Failed to update comment:', error)
      toast.error('Failed to update comment')
    }
  }

  if (loading) {
    return (
      <div className="max-w-4xl mx-auto px-4 py-8 animate-pulse">
        <div className="bg-slate-800 rounded-lg p-6">
          <div className="h-8 w-64 bg-slate-700 rounded mb-4"></div>
          <div className="h-4 w-32 bg-slate-700 rounded mb-8"></div>
          <div className="h-64 bg-slate-900 rounded-lg"></div>
        </div>
      </div>
    )
  }

  if (!snippet) return null

  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      className="max-w-4xl mx-auto px-4 py-8"
    >
      <div className="bg-slate-800 rounded-lg p-6">
        <div className="flex justify-between items-start mb-6">
          <div>
            <h1 className="text-2xl font-bold text-white mb-2">{snippet.title}</h1>
            <div className="flex items-center gap-4 text-slate-300">
              <div className="flex items-center gap-1">
                <Clock className="h-4 w-4" />
                <span className="text-sm">
                  {new Date(snippet.created_at).toLocaleDateString()}
                </span>
              </div>
              <div className="flex items-center gap-1">
                <Tag className="h-4 w-4" />
                <span className="text-sm">{snippet.language}</span>
              </div>
            </div>
          </div>
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-white"
              onClick={handleCopyCode}
            >
              <Share2 className="h-4 w-4 mr-2" />
              Copy
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className={`text-white ${isLiking ? 'opacity-50' : ''}`}
              onClick={handleLike}
              disabled={isLiking}
            >
              <Heart className={`h-4 w-4 mr-2 ${snippet.is_liked ? 'fill-current text-red-500' : ''}`} />
              {snippet.likes_count}
            </Button>
          </div>
        </div>

        <div className="mb-6">
          <CodeEditor
            value={snippet.code_content}
            language={snippet.language.toLowerCase()}
            readOnly
          />
        </div>

        {snippet.description && (
          <div className="mb-6">
            <h2 className="text-lg font-semibold text-white mb-2">Description</h2>
            <p className="text-slate-300">{snippet.description}</p>
          </div>
        )}

        <div className="flex items-center justify-between pt-4 border-t border-slate-700">
          <div className="flex items-center gap-2">
            <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
              <User className="h-4 w-4 text-white" />
            </div>
            <span className="text-slate-300">@{snippet.owner.username}</span>
          </div>
          <div className="flex items-center gap-2 text-slate-300">
            <Star className="h-4 w-4" />
            <span>{snippet.likes_count}</span>
          </div>
        </div>

        <div className="mt-8">
          <h2 className="text-xl font-bold text-white mb-4">Comments</h2>
          {user ? (
            <form onSubmit={handleAddComment} className="mb-6">
              <textarea
                value={newComment}
                onChange={(e) => setNewComment(e.target.value)}
                placeholder="Add a comment..."
                className="w-full px-3 py-2 bg-slate-800 border border-slate-700 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
                rows={3}
              />
              <div className="flex justify-end mt-2">
                <Button
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? 'Posting...' : 'Post Comment'}
                </Button>
              </div>
            </form>
          ) : (
            <p className="text-slate-400 mb-6">
              <button
                onClick={() => navigate('/login')}
                className="text-blue-400 hover:underline"
              >
                Sign in
              </button>
              {' '}to leave a comment
            </p>
          )}
          
          <div className="space-y-4">
            {comments.map(comment => (
              <Comment
                key={comment.id}
                comment={comment}
                onDelete={handleDeleteComment}
                onUpdate={handleUpdateComment}
              />
            ))}
          </div>
        </div>
      </div>
    </motion.div>
  )
}

export default SnippetDetail 