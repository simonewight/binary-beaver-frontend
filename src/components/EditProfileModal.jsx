import React from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import * as z from 'zod'
import { Button } from './ui/button'
import { toast } from 'react-hot-toast'
import Spinner from './ui/spinner'

const profileSchema = z.object({
  bio: z.string().max(500, 'Bio must be less than 500 characters').optional(),
  location: z.string().max(100, 'Location must be less than 100 characters').optional(),
  is_public: z.boolean().optional(),
})

const EditProfileModal = ({ user, onClose, onSave }) => {
  const { register, handleSubmit, formState: { errors, isSubmitting } } = useForm({
    resolver: zodResolver(profileSchema),
    defaultValues: {
      bio: user?.bio || '',
      location: user?.location || '',
      is_public: user?.is_public ?? true,
    }
  })

  const onSubmit = async (data) => {
    try {
      await onSave(data)
      onClose()
    } catch (error) {
      toast.error('Failed to update profile')
    }
  }

  return (
    <div className="fixed inset-0 bg-black/50 flex items-center justify-center z-50">
      <div className="bg-slate-800 p-6 rounded-lg w-full max-w-md">
        <h2 className="text-xl font-bold text-white mb-4">Edit Profile</h2>
        
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
              onClick={onClose}
              className="bg-transparent"
            >
              Cancel
            </Button>
            <Button
              type="submit"
              disabled={isSubmitting}
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
      </div>
    </div>
  )
}

export default EditProfileModal 