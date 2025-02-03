import React, { useState, useEffect } from 'react'
import { useParams, useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../services/api'
import { toast } from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StarField from '../components/ui/StarField'
import SnippetForm from '../components/snippets/SnippetForm'

const EditSnippet = () => {
  const { id } = useParams()
  const navigate = useNavigate()
  const [snippet, setSnippet] = useState(null)
  const [isLoading, setIsLoading] = useState(true)

  useEffect(() => {
    const loadSnippet = async () => {
      try {
        setIsLoading(true)
        console.log('Fetching snippet:', id)
        const response = await snippetsApi.get(id)
        console.log('Snippet response:', response)
        if (response.data) {
          setSnippet(response.data)
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

  const handleSubmit = async (formData) => {
    try {
      await snippetsApi.update(id, formData)
      toast.success('Snippet updated successfully')
      navigate(`/snippet/${id}`)
    } catch (error) {
      console.error('Failed to update snippet:', error)
      toast.error('Failed to update snippet')
    }
  }

  if (isLoading) {
    return (
      <div className="relative min-h-screen bg-slate-900">
        <StarField />
        <div className="relative z-10 max-w-4xl mx-auto p-6">
          <div className="animate-pulse space-y-4">
            <div className="h-8 w-64 bg-slate-800 rounded" />
            <div className="h-64 bg-slate-800 rounded" />
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className="relative z-10 max-w-4xl mx-auto p-6">
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
          <h1 className="text-2xl font-bold text-white mb-6">Edit Snippet</h1>
          {snippet && (
            <SnippetForm 
              initialData={snippet}
              onSubmit={handleSubmit}
              submitLabel="Update Snippet"
            />
          )}
        </div>
      </div>
    </div>
  )
}

export default EditSnippet 