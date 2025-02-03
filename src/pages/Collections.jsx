import React, { useState, useEffect } from 'react'
import { collections as collectionsApi } from '../services/api'
import { Button } from '../components/ui/button'
import { Plus, Folder, MoreVertical } from 'lucide-react'
import { toast } from 'react-hot-toast'
import StarField from '../components/ui/StarField'
import { useNavigate } from 'react-router-dom'
import { Input } from '../components/ui/input'
import DeleteConfirmDialog from '../components/snippets/DeleteConfirmDialog'

const Collections = () => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const navigate = useNavigate()
  const [deleteDialogOpen, setDeleteDialogOpen] = useState(false)
  const [selectedCollection, setSelectedCollection] = useState(null)

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true)
        const response = await collectionsApi.getAll()
        setCollections(response.data.results || [])
      } catch (error) {
        console.error('Failed to load collections:', error)
        toast.error('Failed to load collections')
      } finally {
        setLoading(false)
      }
    }

    loadCollections()
  }, [])

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return

    try {
      const response = await collectionsApi.create({ name: newCollectionName })
      const newCollection = response.data.data || response.data
      setCollections(prev => [...prev, newCollection])
      setNewCollectionName('')
      setShowCreateForm(false)
      toast.success('Collection created')
    } catch (error) {
      console.error('Failed to create collection:', error)
      toast.error('Failed to create collection')
    }
  }

  const handleDelete = async () => {
    try {
      await collectionsApi.delete(selectedCollection.id)
      setCollections(prev => prev.filter(c => c.id !== selectedCollection.id))
      toast.success('Collection deleted')
      setDeleteDialogOpen(false)
    } catch (error) {
      console.error('Failed to delete collection:', error)
      toast.error('Failed to delete collection')
    }
  }

  const handleMoreClick = (e, collection) => {
    e.stopPropagation()
    setSelectedCollection(collection)
    setDeleteDialogOpen(true)
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
        <div className="flex justify-between items-center mb-6">
          <h1 className="text-2xl font-bold text-white">Collections</h1>
          <Button
            onClick={() => setShowCreateForm(true)}
            className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2"
          >
            <Plus className="h-4 w-4 mr-2" />
            New Collection
          </Button>
        </div>

        {showCreateForm && (
          <form onSubmit={handleCreateCollection} className="mb-6">
            <div className="flex gap-2">
              <Input
                type="text"
                placeholder="Collection name"
                value={newCollectionName}
                onChange={(e) => setNewCollectionName(e.target.value)}
                className="flex-1 bg-slate-800/50 border-slate-700 text-white"
              />
              <Button
                type="submit"
                className="bg-cyan-500 hover:bg-cyan-400 text-white px-4 py-2"
              >
                Create
              </Button>
              <Button
                type="button"
                variant="ghost"
                onClick={() => setShowCreateForm(false)}
                className="text-slate-400 hover:text-white px-4 py-2"
              >
                Cancel
              </Button>
            </div>
          </form>
        )}

        {loading ? (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="animate-pulse">
                <div className="h-32 bg-slate-800/50 rounded-lg"></div>
              </div>
            ))}
          </div>
        ) : collections.length === 0 ? (
          <div className="text-center py-12">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-slate-800/50 mb-4">
              <Folder className="h-8 w-8 text-slate-400" />
            </div>
            <h2 className="text-xl font-semibold text-white mb-2">No collections yet</h2>
            <p className="text-slate-400">Create a collection to organize your snippets</p>
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {collections.map(collection => (
              <div
                key={collection.id}
                className="group bg-slate-800/50 backdrop-blur-sm rounded-lg p-4 border border-slate-700/50 hover:border-cyan-500/50 transition-colors cursor-pointer"
                onClick={() => navigate(`/collection/${collection.id}`)}
              >
                <div className="flex justify-between items-start mb-4">
                  <div className="flex items-center gap-3">
                    <Folder className="h-5 w-5 text-cyan-400" />
                    <h3 className="text-lg font-medium text-white">{collection.name}</h3>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    className="opacity-0 group-hover:opacity-100 transition-opacity"
                    onClick={(e) => handleMoreClick(e, collection)}
                  >
                    <MoreVertical className="h-4 w-4 text-slate-400" />
                  </Button>
                </div>
                <div className="text-sm text-slate-400">
                  {(collection.snippets?.length || collection.snippets_count || 0)} snippets
                </div>
              </div>
            ))}
          </div>
        )}

        <DeleteConfirmDialog
          open={deleteDialogOpen}
          onOpenChange={setDeleteDialogOpen}
          onConfirm={handleDelete}
          title="Delete Collection"
          description="Are you sure you want to delete this collection? All snippets will be removed from the collection but not deleted."
        />
      </div>
    </div>
  )
}

export default Collections 