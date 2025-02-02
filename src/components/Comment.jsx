import React, { useState } from 'react'
import { User, Trash2, Edit2 } from 'lucide-react'
import { Button } from './ui/button'
import { useAuth } from '../context/AuthContext'
import { toast } from 'react-hot-toast'

const Comment = ({ comment, onDelete, onUpdate }) => {
  const { user } = useAuth()
  const [isEditing, setIsEditing] = useState(false)
  const [editedContent, setEditedContent] = useState(comment.content)

  const handleUpdate = () => {
    if (editedContent.trim() === '') {
      toast.error('Comment cannot be empty')
      return
    }
    onUpdate(comment.id, editedContent)
    setIsEditing(false)
  }

  return (
    <div className="bg-slate-800 rounded-lg p-4 mb-4">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-2 mb-2">
          <div className="w-8 h-8 rounded-full bg-slate-700 flex items-center justify-center">
            <User className="h-4 w-4 text-white" />
          </div>
          <div>
            <span className="text-white font-medium">@{comment.user.username}</span>
            <span className="text-slate-400 text-sm ml-2">
              {new Date(comment.created_at).toLocaleDateString()}
            </span>
          </div>
        </div>
        {user?.id === comment.user.id && (
          <div className="flex gap-2">
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-white"
              onClick={() => setIsEditing(!isEditing)}
            >
              <Edit2 className="h-4 w-4" />
            </Button>
            <Button
              variant="ghost"
              size="sm"
              className="text-slate-400 hover:text-red-500"
              onClick={() => onDelete(comment.id)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>
      {isEditing ? (
        <div className="mt-2">
          <textarea
            value={editedContent}
            onChange={(e) => setEditedContent(e.target.value)}
            className="w-full px-3 py-2 bg-slate-900 border border-slate-700 rounded-md text-white resize-none focus:outline-none focus:ring-2 focus:ring-blue-500"
            rows={3}
          />
          <div className="flex justify-end gap-2 mt-2">
            <Button
              variant="ghost"
              size="sm"
              onClick={() => setIsEditing(false)}
            >
              Cancel
            </Button>
            <Button
              size="sm"
              onClick={handleUpdate}
            >
              Save
            </Button>
          </div>
        </div>
      ) : (
        <p className="text-slate-300">{comment.content}</p>
      )}
    </div>
  )
}

export default Comment 