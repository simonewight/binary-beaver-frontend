import React from 'react'
import { useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../services/api'
import { toast } from 'react-hot-toast'
import { Button } from '../components/ui/button'
import { ArrowLeft } from 'lucide-react'
import StarField from '../components/ui/StarField'
import SnippetForm from '../components/snippets/SnippetForm'

const NewSnippet = () => {
  const navigate = useNavigate()

  const handleSubmit = async (formData) => {
    try {
      console.log('Submitting new snippet:', formData)
      const response = await snippetsApi.create(formData)
      console.log('Create response full:', response)
      
      const snippetId = response.data.data.id
      console.log('Extracted snippet ID:', snippetId)
      
      if (snippetId) {
        toast.success('Snippet created successfully')
        console.log('Navigating to:', `/snippet/${snippetId}`)
        navigate(`/snippet/${snippetId}`)
      } else {
        console.error('No snippet ID in response. Full response data:', response.data)
        toast.error('Error creating snippet')
        navigate('/profile')
      }
    } catch (error) {
      console.error('Failed to create snippet:', error)
      toast.error('Failed to create snippet')
    }
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
          <h1 className="text-2xl font-bold text-white mb-6">Create New Snippet</h1>
          <SnippetForm onSubmit={handleSubmit} />
        </div>
      </div>
    </div>
  )
}

export default NewSnippet 