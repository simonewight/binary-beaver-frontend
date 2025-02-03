import React, { useState, useEffect } from 'react'
import { useAuth } from '../context/AuthContext'
import { User, Code, Library, Globe, Lock } from 'lucide-react'
import { Button } from '../components/ui/button'
import Spinner from '../components/ui/spinner'
import { toast } from 'react-hot-toast'
import EditProfileModal from '../components/EditProfileModal'
import { auth, snippets as snippetsApi } from '../services/api'
import { Skeleton, SkeletonCard } from '../components/ui/skeleton'
import RecentActivity from '../components/RecentActivity'
import ProfileHeader from '../components/profile/ProfileHeader'
import StatsGrid from '../components/profile/StatsGrid'
import SnippetsGrid from '../components/profile/SnippetsGrid'
import { useNavigate } from 'react-router-dom'
import StarField from '../components/ui/StarField'

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
  const navigate = useNavigate()
  const { user, setUser } = useAuth()
  const [isProfileLoading, setIsProfileLoading] = useState(true)
  const [isStatsLoading, setIsStatsLoading] = useState(true)
  const [stats, setStats] = useState(null)
  const [showEditModal, setShowEditModal] = useState(false)
  const [activity, setActivity] = useState({ snippets: [], collections: [] })
  const [isActivityLoading, setIsActivityLoading] = useState(true)
  const [snippets, setSnippets] = useState([])
  const [isSnippetsLoading, setIsSnippetsLoading] = useState(true)

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
      console.log('Fetching stats...')  // Debug log
      const response = await auth.getStats()
      console.log('Stats response:', response)  // Debug full response
      setStats(response.data)
    } catch (error) {
      console.error('Failed to load stats:', error.response || error)  // Log full error
      toast.error('Failed to load profile stats')
    } finally {
      setIsStatsLoading(false)
    }
  }

  const loadActivity = async () => {
    try {
      setIsActivityLoading(true)
      console.log('Fetching activity...')  // Debug log
      const response = await auth.getActivity()
      console.log('Activity response:', response)  // Debug full response
      setActivity({
        snippets: response.data.recent_snippets,
        collections: response.data.recent_collections
      })
    } catch (error) {
      console.error('Failed to load activity:', error.response || error)  // Log full error
      toast.error('Failed to load recent activity')
    } finally {
      setIsActivityLoading(false)
    }
  }

  const loadSnippets = async () => {
    try {
      setIsSnippetsLoading(true)
      console.log('Fetching snippets for user:', user.id)
      const response = await snippetsApi.getAll({ owner: user.id })
      
      // The data structure is:
      // { success: true, results: [...snippets], links: { next, previous } }
      if (response.data.success && Array.isArray(response.data.results)) {
        setSnippets(response.data.results)
      } else {
        console.error('Unexpected snippets data structure:', response.data)
        setSnippets([])
      }
    } catch (error) {
      console.error('Failed to load snippets:', error)
      toast.error('Failed to load snippets')
    } finally {
      setIsSnippetsLoading(false)
    }
  }

  useEffect(() => {
    console.log('Current user:', user)  // Debug log
    loadProfileData()
    loadStats()
    loadActivity()
    if (user?.id) {  // Changed this condition to check for user.id
      loadSnippets()
    }
  }, [user?.id])  // Added user?.id as dependency

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
      <div className="relative min-h-screen bg-slate-900">
        <StarField />
        <div className="flex justify-center items-center h-[calc(100vh-4rem)] relative z-10">
          <Spinner size="lg" />
        </div>
      </div>
    )
  }

  return (
    <div className="relative min-h-screen bg-slate-900">
      <StarField />
      <div className="relative z-10">
        <div className="max-w-7xl mx-auto p-6">
          <ProfileHeader 
            user={user}
            onEdit={() => setShowEditModal(true)}
            isLoading={isProfileLoading}
          />
          
          <StatsGrid 
            stats={stats}
            isLoading={isStatsLoading}
          />

          {/* Snippets Section */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 mb-6 border border-slate-700/50">
            <div className="flex justify-between items-center mb-6">
              <h2 className="text-xl font-semibold text-white">My Snippets</h2>
              <Button 
                onClick={() => navigate('/snippets/new')}
                className="bg-cyan-500 text-white hover:bg-cyan-400 transition-colors px-8 py-2.5"
              >
                New Snippet
              </Button>
            </div>
            <SnippetsGrid 
              snippets={snippets}
              isLoading={isSnippetsLoading}
            />
          </div>

          {/* Recent Activity */}
          <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-6 border border-slate-700/50">
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

          <EditProfileModal
            user={user}
            open={showEditModal}
            onOpenChange={setShowEditModal}
            onSave={handleProfileUpdate}
          />
        </div>
      </div>
    </div>
  )
}

export default Profile 