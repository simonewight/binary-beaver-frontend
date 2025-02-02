import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Code, Library, Globe, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import Spinner from '../components/ui/spinner'
import { toast } from 'react-hot-toast'
import EditProfileModal from '../components/EditProfileModal'
import { auth } from '../services/api'
import Skeleton from '../components/ui/skeleton'
import { SkeletonCard } from '../components/ui/skeleton'
import RecentActivity from '../components/RecentActivity'

const StatCard = ({ icon: Icon, label, value }) => (
  <div className="bg-slate-800 p-4 rounded-lg flex items-center gap-3">
    <div className="p-2 bg-slate-700 rounded-md">
      <Icon className="h-5 w-5 text-blue-400" />
    </div>
    <div>
      <p className="text-sm text-slate-400">{label}</p>
      <p className="text-xl font-semibold text-white">{value}</p>
    </div>
  </div>
)

const Profile = () => {
  const { user, setUser } = useAuth()
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activity, setActivity] = useState({ snippets: [], collections: [] })
  const [isActivityLoading, setIsActivityLoading] = useState(true)

  const loadProfileData = async () => {
    try {
      setIsProfileLoading(true)
      const response = await auth.getProfile()
      if (response.data.success) {
        setUser(response.data.data)
      }
    } catch (error) {
      toast.error('Failed to load profile')
    } finally {
      setIsProfileLoading(false)
    }
  }

  const loadStats = async () => {
    try {
      setIsStatsLoading(true)
      const response = await auth.getStats()
      console.log('Stats response:', response.data)  // For debugging
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error)
      toast.error('Failed to load profile stats')
    } finally {
      setIsStatsLoading(false)
    }
  }

  const loadActivity = async () => {
    try {
      setIsActivityLoading(true)
      const response = await auth.getActivity()
      setActivity({
        snippets: response.data.recent_snippets,
        collections: response.data.recent_collections
      })
    } catch (error) {
      console.error('Failed to load activity:', error)
      toast.error('Failed to load recent activity')
    } finally {
      setIsActivityLoading(false)
    }
  }

  useEffect(() => {
    loadProfileData()
    loadStats()
    loadActivity()
  }, [])

  const handleProfileUpdate = async (data) => {
    try {
      const response = await auth.updateProfile(data)
      if (response.data.success) {
        // Update the user data in context
        setUser(response.data.data)
        toast.success('Profile updated successfully')
      }
    } catch (error) {
      console.error('Failed to update profile:', error)
      throw error // This will be caught by the EditProfileModal
    }
  }

  const ProfileSkeleton = () => (
    <div className="bg-slate-800 rounded-lg p-6 mb-6">
      <div className="flex items-start justify-between">
        <div className="flex items-center gap-4">
          {/* Avatar skeleton */}
          <Skeleton className="h-14 w-14 rounded-full" />
          <div className="space-y-2">
            {/* Username skeleton */}
            <Skeleton className="h-7 w-32" />
            {/* Email skeleton */}
            <Skeleton className="h-4 w-48" />
          </div>
        </div>
        {/* Button skeleton */}
        <Skeleton className="h-9 w-24 rounded-md" />
      </div>
      <div className="mt-6 space-y-4">
        {/* Bio skeleton */}
        <Skeleton className="h-4 w-3/4" />
        <Skeleton className="h-4 w-1/2" />
      </div>
    </div>
  )

  const StatsSkeleton = () => (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-8">
      {[1, 2].map((i) => (
        <div key={i} className="bg-slate-800 p-4 rounded-lg flex items-center gap-3">
          <Skeleton className="h-10 w-10 rounded-md" />
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-6 w-12" />
          </div>
        </div>
      ))}
    </div>
  )

  if (isProfileLoading) {
    return (
      <div className="flex justify-center items-center h-[calc(100vh-4rem)]">
        <Spinner size="lg" />
      </div>
    )
  }

  return (
    <div className="max-w-4xl mx-auto p-6">
      <div className="bg-slate-800 rounded-lg p-6 mb-6">
        <h1 className="text-2xl font-bold text-white mb-4">Profile</h1>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div>
            <h2 className="text-lg font-semibold text-slate-200">User Info</h2>
            <p className="text-slate-400">Username: {user?.username}</p>
            <p className="text-slate-400">Email: {user?.email}</p>
          </div>
          <div>
            <h2 className="text-lg font-semibold text-slate-200">Stats</h2>
            <p className="text-slate-400">Snippets: {stats?.snippets_count || 0}</p>
            <p className="text-slate-400">Collections: {stats?.collections_count || 0}</p>
            <p className="text-slate-400">Likes Received: {stats?.likes_received || 0}</p>
            <p className="text-slate-400">Likes Given: {stats?.likes_given || 0}</p>
          </div>
        </div>
        <div className="flex justify-end">
          <Button onClick={() => setShowEditModal(true)}>
            Edit Profile
          </Button>
        </div>
      </div>

      {/* Recent Activity */}
      <div className="bg-slate-800 rounded-lg p-6">
        <h2 className="text-xl font-semibold text-white mb-4">Recent Activity</h2>
        {isActivityLoading ? (
          <div className="space-y-4">
            {[1, 2, 3].map(i => (
              <div key={i} className="bg-slate-700 rounded-lg p-4">
                <div className="flex items-center gap-3">
                  <Skeleton className="h-8 w-8 rounded-md" />
                  <div className="flex-1">
                    <Skeleton className="h-5 w-48" />
                    <Skeleton className="h-4 w-24 mt-2" />
                  </div>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <RecentActivity 
            snippets={activity.snippets}
            collections={activity.collections}
          />
        )}
      </div>

      {showEditModal && (
        <EditProfileModal
          user={user}
          onClose={() => setShowEditModal(false)}
          onSave={handleProfileUpdate}
        />
      )}
    </div>
  )
}

export default Profile 