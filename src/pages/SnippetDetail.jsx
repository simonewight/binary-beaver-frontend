import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../services/api'
import { Button } from '../components/ui/button'
import { Heart, Star, User, Clock, Globe, Copy, ArrowLeft, Edit, Trash, Share2, FolderPlus } from 'lucide-react'
import { formatDate } from '../lib/utils'
import { toast } from 'react-hot-toast'
import StarField from '../components/ui/StarField'
import { useAuth } from '../context/AuthContext'
import CodeBlock from '../components/ui/CodeBlock'
import DeleteConfirmDialog from '../components/snippets/DeleteConfirmDialog'
import { Tooltip, TooltipTrigger, TooltipContent } from '../components/ui/tooltip'
import ShareDialog from '../components/snippets/ShareDialog'
import SaveToCollectionDialog from '../components/snippets/SaveToCollectionDialog'

const SnippetDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const { user } = useAuth()
  const [snippet, setSnippet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [shareDialogOpen, setShareDialogOpen] = useState(false)
  const [saveToCollectionOpen, setSaveToCollectionOpen] = useState(false)

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        setIsLoading(true)
        const response = await snippetsApi.get(id)
        console.log('Snippet response:', response)
        
        // The API returns the snippet data directly, not wrapped in a success field
        if (response.data) {
          setSnippet(response.data)  // Changed from response.data.data to response.data
        } else {
          console.error('Unexpected response:', response)
          toast.error('Failed to load snippet')
          navigate('/profile')
        }
      } catch (error) {
        console.error('Failed to load snippet:', error)
        toast.error('Failed to load snippet')
        navigate('/profile')
      } finally {
        setIsLoading(false)
      }
    }

    loadSnippet()
  }, [id, navigate])

  const handleLike = async () => {
    try {
      const response = await snippetsApi.like(id)
      // Update the snippet state based on the response
      if (response.data) {
        setSnippet(prev => ({
          ...prev,
          is_liked: !prev.is_liked,
          likes_count: prev.likes_count + (prev.is_liked ? -1 : 1)
        }))
      }
    } catch (error) {
      console.error('Failed to update like:', error)
      toast.error('Failed to update like')
    }
  }

  const handleCopy = () => {
    navigator.clipboard.writeText(snippet.code_content)
    toast.success('Code copied to clipboard')
  }

  const handleDelete = async () => {
    try {
      await snippetsApi.delete(id)
      toast.success('Snippet deleted')
      navigate('/profile')
    } catch (error) {
      console.error('Failed to delete snippet:', error)
      toast.error('Failed to delete snippet')
    }
  }

  const handleShare = () => {
    setShareDialogOpen(true)
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-slate-900">
        <StarField />
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-slate-800 rounded" />
            <div className="h-4 w-32 bg-slate-800 rounded" />
            <div className="h-64 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!snippet) return null

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white mb-4"
          onClick={() => navigate(-1)}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back
        </Button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
          {/* Header */}
          <div className="flex justify-between items-start mb-6">
            <div>
              <div className="flex items-center gap-3 mb-2">
                <h1 className="text-2xl font-bold text-white">{snippet.title}</h1>
                <span className="px-2 py-1 rounded text-xs font-medium bg-slate-700 text-cyan-400">
                  {snippet.language}
                </span>
              </div>
              <div className="flex items-center gap-4 text-sm text-slate-300">
                <div className="flex items-center gap-1">
                  <Clock className="w-4 h-4" />
                  <span>{formatDate(snippet.created_at)}</span>
                </div>
                <div className="flex items-center gap-1">
                  <Globe className="w-4 h-4" />
                  <span>{snippet.is_public ? 'Public' : 'Private'}</span>
                </div>
              </div>
            </div>
            <div className="flex gap-2">
              {user?.id === snippet.owner.id && (
                <>
                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-cyan-400 transition-colors"
                        onClick={() => navigate(`/snippet/${id}/edit`)}
                      >
                        <Edit className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Edit snippet</p>
                    </TooltipContent>
                  </Tooltip>

                  <Tooltip>
                    <TooltipTrigger asChild>
                      <Button
                        variant="ghost"
                        size="sm"
                        className="text-white hover:text-red-400 transition-colors"
                        onClick={() => setDeleteDialogOpen(true)}
                      >
                        <Trash className="h-4 w-4" />
                      </Button>
                    </TooltipTrigger>
                    <TooltipContent>
                      <p>Delete snippet</p>
                    </TooltipContent>
                  </Tooltip>
                </>
              )}
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-cyan-400 transition-colors"
                    onClick={handleShare}
                  >
                    <Share2 className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Share snippet URL</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-cyan-400 transition-colors"
                    onClick={() => setSaveToCollectionOpen(true)}
                  >
                    <FolderPlus className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Save to collection</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-cyan-400 transition-colors"
                    onClick={handleLike}
                  >
                    <Heart className={`h-4 w-4 ${snippet.is_liked ? 'fill-cyan-400 text-cyan-400' : ''}`} />
                    <span className="ml-1">{snippet.likes_count}</span>
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>{snippet.is_liked ? 'Unlike snippet' : 'Like snippet'}</p>
                </TooltipContent>
              </Tooltip>
              <Tooltip>
                <TooltipTrigger asChild>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="text-white hover:text-cyan-400 transition-colors"
                    onClick={handleCopy}
                  >
                    <Copy className="h-4 w-4" />
                  </Button>
                </TooltipTrigger>
                <TooltipContent>
                  <p>Copy code to clipboard</p>
                </TooltipContent>
              </Tooltip>
            </div>
          </div>

          {/* Code with description */}
          {snippet.description && (
            <p className="text-slate-300 mb-4">{snippet.description}</p>
          )}
          <div className="mb-6">
            <CodeBlock 
              code={snippet.code_content} 
              language={snippet.language} 
            />
          </div>

          {/* Footer */}
          <div className="flex justify-between items-center">
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
        </div>
      </div>
      <DeleteConfirmDialog
        open={deleteDialogOpen}
        onOpenChange={setDeleteDialogOpen}
        onConfirm={handleDelete}
        title="Delete Snippet"
        description="Are you sure you want to delete this snippet? This action cannot be undone."
      />
      <ShareDialog
        open={shareDialogOpen}
        onOpenChange={setShareDialogOpen}
        url={window.location.href}
      />
      <SaveToCollectionDialog
        open={saveToCollectionOpen}
        onOpenChange={setSaveToCollectionOpen}
        snippetId={id}
      />
    </div>
  )
}

export default SnippetDetail 