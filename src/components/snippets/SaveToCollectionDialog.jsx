import React, { useState, useEffect } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Plus, FolderPlus, X } from 'lucide-react'
import { collections as collectionsApi } from '../../services/api'
import { toast } from 'react-hot-toast'
import { Input } from '../ui/input'

const SaveToCollectionDialog = ({ open, onOpenChange, snippetId }) => {
  const [collections, setCollections] = useState([])
  const [loading, setLoading] = useState(true)
  const [showCreateForm, setShowCreateForm] = useState(false)
  const [newCollectionName, setNewCollectionName] = useState('')
  const [creating, setCreating] = useState(false)

  useEffect(() => {
    const loadCollections = async () => {
      try {
        setLoading(true)
        const response = await collectionsApi.getAll()
        console.log('Collections response:', response)
        setCollections(response.data.results || [])
      } catch (error) {
        console.error('Failed to load collections:', error)
        toast.error('Failed to load collections')
      } finally {
        setLoading(false)
      }
    }

    if (open) {
      loadCollections()
      setShowCreateForm(false)
      setNewCollectionName('')
    }
  }, [open])

  const handleAddToCollection = async (collectionId) => {
    try {
      await collectionsApi.addSnippet(collectionId, snippetId)
      toast.success('Added to collection')
      onOpenChange(false)
    } catch (error) {
      console.error('Failed to add to collection:', error)
      toast.error('Failed to add to collection')
    }
  }

  const handleCreateCollection = async (e) => {
    e.preventDefault()
    if (!newCollectionName.trim()) return

    setCreating(true)
    try {
      const response = await collectionsApi.create({ name: newCollectionName })
      const newCollection = response.data.data || response.data
      setCollections(prev => [...prev, newCollection])
      await handleAddToCollection(newCollection.id)
      setShowCreateForm(false)
      setNewCollectionName('')
    } catch (error) {
      console.error('Failed to create collection:', error)
      toast.error('Failed to create collection')
    } finally {
      setCreating(false)
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Save to Collection
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            {showCreateForm ? 'Create a new collection' : 'Choose a collection to save this snippet to'}
          </DialogDescription>
        </DialogHeader>

        <div className="mt-4 space-y-2">
          {showCreateForm ? (
            <form onSubmit={handleCreateCollection} className="space-y-4">
              <div className="flex gap-2">
                <Input
                  type="text"
                  placeholder="Collection name"
                  value={newCollectionName}
                  onChange={(e) => setNewCollectionName(e.target.value)}
                  className="flex-1 bg-slate-800/50 border-slate-700 text-white"
                />
                <Button
                  type="button"
                  variant="ghost"
                  onClick={() => setShowCreateForm(false)}
                  className="text-slate-400 hover:text-white"
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>
              <Button
                type="submit"
                disabled={creating || !newCollectionName.trim()}
                className="w-full bg-cyan-500 hover:bg-cyan-400 text-white"
              >
                {creating ? 'Creating...' : 'Create & Add Snippet'}
              </Button>
            </form>
          ) : (
            <>
              {loading ? (
                <div className="text-center text-slate-400">Loading collections...</div>
              ) : collections.length === 0 ? (
                <div className="text-center text-slate-400">No collections yet</div>
              ) : (
                collections.map(collection => (
                  <Button
                    key={collection.id}
                    variant="ghost"
                    className="w-full justify-start text-left text-slate-300 hover:text-white hover:bg-slate-800/50"
                    onClick={() => handleAddToCollection(collection.id)}
                  >
                    <FolderPlus className="h-4 w-4 mr-2" />
                    {collection.name}
                  </Button>
                ))
              )}

              <Button
                variant="outline"
                className="w-full mt-4 border-dashed border-slate-700 text-slate-400 hover:text-white hover:border-slate-600"
                onClick={() => setShowCreateForm(true)}
              >
                <Plus className="h-4 w-4 mr-2" />
                Create New Collection
              </Button>
            </>
          )}
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default SaveToCollectionDialog 