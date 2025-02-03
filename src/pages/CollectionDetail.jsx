import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { collections as collectionsApi } from '../services/api'
import { Button } from '../components/ui/button'
import { ArrowLeft, Edit, Trash } from 'lucide-react'
import { toast } from 'react-hot-toast'
import StarField from '../components/ui/StarField'
import SnippetsGrid from '../components/profile/SnippetsGrid'
import DeleteConfirmDialog from '../components/snippets/DeleteConfirmDialog'
import EditCollectionDialog from '../components/collections/EditCollectionDialog'

const CollectionDetail = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [collection, setCollection] = useState(null)
  const [isLoading, setIsLoading] = useState(true)
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [editDialogOpen, setEditDialogOpen] = useState(false)

  useEffect(() => {
    const loadCollection = async () => {
      try {
        setIsLoading(true)
        const response = await collectionsApi.get(id)
        setCollection(response.data)
      } catch (error) {
        console.error('Failed to load collection:', error)
        toast.error('Failed to load collection')
        navigate('/collections')
      } finally {
        setIsLoading(false)
      }
    }

    loadCollection()
  }, [id, navigate])

  const handleDelete = async () => {
    try {
      await collectionsApi.delete(id)
      toast.success('Collection deleted')
      navigate('/collections')
    } catch (error) {
      console.error('Failed to delete collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  const handleUpdate = (updatedCollection) => {
    setCollection(updatedCollection)
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

  if (!collection) return null

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        {/* Back button */}
        <Button
          variant="ghost"
          size="sm"
          className="text-slate-300 hover:text-white mb-4"
          onClick={() => navigate('/collections')}
        >
          <ArrowLeft className="h-4 w-4 mr-2" />
          Back to Collections
        </Button>

        <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50 mb-6">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white mb-2">{collection.name}</h1>
              <p className="text-slate-400">{collection.snippets?.length || 0} snippets</p>
            </div>
            <div className="flex gap-2">
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-cyan-400 transition-colors"
                onClick={() => setEditDialogOpen(true)}
              >
                <Edit className="h-4 w-4" />
              </Button>
              <Button
                variant="ghost"
                size="sm"
                className="text-white hover:text-red-400 transition-colors"
                onClick={() => setDeleteDialogOpen(true)}
              >
                <Trash className="h-4 w-4" />
              </Button>
            </div>
          </div>
        </div>

        {/* Snippets grid */}
        <SnippetsGrid snippets={collection.snippets || []} />

        {/* Delete confirmation dialog */}
        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Collection"
          description="Are you sure you want to delete this collection? All snippets will be removed from the collection but not deleted."
        />

        {/* Edit collection dialog */}
        <EditCollectionDialog
          open={editDialogOpen}
          onOpenChange={setEditDialogOpen}
          collection={collection}
          onUpdate={handleUpdate}
        />
      </div>
    </div>
  )
}

export default CollectionDetail 