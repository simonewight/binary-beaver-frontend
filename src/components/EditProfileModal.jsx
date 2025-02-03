import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'
import Spinner from './ui/spinner'
import { Avatar, AvatarImage, AvatarFallback } from './ui/avatar'
import { Input } from './ui/input'
import { Label } from './ui/label'
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from './ui/dialog'
import { auth } from '../services/api'

const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  is_public: z.boolean().optional(),
})

const EditProfileModal = ({ user, onClose, onSave, open, onOpenChange }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user?.bio || '',
      location: user?.location || '',
      is_public: user?.is_public ?? true,
    }
  })

  const [uploading, setUploading] = useState(false)
  
  const handleImageUpload = async (e) => {
    const file = e.target.files[0]
    if (!file) return
    
    try {
      setUploading(true)
      const formData = new FormData()
      formData.append('avatar', file)
      
      const response = await auth.updateAvatar(formData)
      
      if (response.data.success) {
        onSave({ ...user, avatar_url: response.data.avatar_url })
        toast.success('Profile picture updated')
      }
    } catch (error) {
      console.error('Failed to upload image:', error)
      toast.error('Failed to upload image')
    } finally {
      setUploading(false)
    }
  }

  const onSubmit = async (data) => {
    try {
      await onSave(data)
      onOpenChange(false)
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Edit Profile</DialogTitle>
        </DialogHeader>
        
        {/* Add Avatar Section */}
        <div className="flex items-center gap-4 mb-4">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback>
              {user.username[0].toUpperCase()}
            </AvatarFallback>
          </Avatar>
          
          <div className="flex-1">
            <Label htmlFor="avatar" className="mb-2 block">Profile Picture</Label>
            <div className="relative">
              <Input
                id="avatar"
                type="file"
                accept="image/*"
                onChange={handleImageUpload}
                disabled={uploading}
                className="hidden"
              />
              <Button
                type="button"
                variant="outline"
                onClick={() => document.getElementById('avatar').click()}
                disabled={uploading}
                className="w-full bg-slate-800/50 backdrop-blur-sm border-slate-700/50 text-white hover:bg-slate-700/50"
              >
                {uploading ? (
                  <div className="flex items-center gap-2">
                    <Spinner size="sm" />
                    <span>Uploading...</span>
                  </div>
                ) : (
                  <div className="flex items-center gap-2">
                    <span>Choose File</span>
                  </div>
                )}
              </Button>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Bio
            </label>
            <textarea
              {...register('bio')}
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500 h-24 resize-none"
              placeholder="Tell us about yourself..."
            />
            {errors.bio && (
              <span className="text-sm text-red-500 mt-1">
                {errors.bio.message}
              </span>
            )}
          </div>

          <div>
            <label className="block text-sm font-medium text-slate-300 mb-1">
              Location
            </label>
            <input
              {...register('location')}
              type="text"
              className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-md text-white focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="Where are you based?"
            />
            {errors.location && (
              <span className="text-sm text-red-500 mt-1">
                {errors.location.message}
              </span>
            )}
          </div>

          <div className="flex items-center gap-2">
            <input
              {...register('is_public')}
              type="checkbox"
              id="is_public"
              className="rounded border-slate-600 bg-slate-700 text-blue-500 focus:ring-blue-500"
            />
            <label htmlFor="is_public" className="text-sm text-slate-300">
              Make profile public
            </label>
          </div>

          <div className="flex justify-end gap-2 mt-6">
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              className="border-slate-700 text-white hover:bg-slate-800 px-4"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
              className="bg-cyan-500 text-white hover:bg-cyan-400 px-4 py-2"
            >
              {isSubmitting ? (
                <div className="flex items-center gap-2">
                  <Spinner />
                  <span>Saving...</span>
                </div>
              ) : (
                'Save Changes'
              )}
            </Button>
          </div>
        </form>
      </DialogContent>
    </Dialog>
  )
}

export default EditProfileModal 