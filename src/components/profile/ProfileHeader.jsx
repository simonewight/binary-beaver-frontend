import { User, Mail, MapPin, Globe, Calendar } from 'lucide-react'
import { Button } from '../ui/button'
import { formatDate } from '../../lib/utils'
import { Avatar, AvatarImage, AvatarFallback } from '../ui/avatar'
import { getInitials } from '../../lib/utils'

const ProfileHeader = ({ user, onEdit, isLoading }) => {
  if (isLoading) return <ProfileHeaderSkeleton />

  console.log('Profile data in header:', user) // Debug log

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 mb-6">
      <div className="flex flex-col md:flex-row gap-6">
        {/* Avatar Section */}
        <div className="flex-shrink-0">
          <Avatar className="h-20 w-20">
            <AvatarImage src={user.avatar_url} />
            <AvatarFallback username={user.username}>
              {getInitials(user.username)}
            </AvatarFallback>
          </Avatar>
        </div>

        {/* Info Section */}
        <div className="flex-grow">
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-2xl font-bold text-white">{user?.username}</h1>
              <p className="text-slate-400 mt-2">{user?.bio || 'No bio yet'}</p>
            </div>
            <Button
              variant="outline"
              onClick={onEdit}
              className="bg-slate-800/50 backdrop-blur-sm text-white border-slate-700 hover:bg-slate-700/50 transition-colors px-8 py-2.5"
            >
              Edit Profile
            </Button>
          </div>

          {/* User Details */}
          <div className="mt-4 flex flex-wrap gap-4 text-sm text-slate-300">
            <div className="flex items-center gap-1">
              <Mail className="w-4 h-4" />
              <span>{user?.email}</span>
            </div>
            {user?.location && (
              <div className="flex items-center gap-1">
                <MapPin className="w-4 h-4" />
                <span>{user.location}</span>
              </div>
            )}
            <div className="flex items-center gap-1">
              <Calendar className="w-4 h-4" />
              <span>Joined {formatDate(user?.date_joined)}</span>
            </div>
            <div className="flex items-center gap-1">
              <Globe className="w-4 h-4" />
              <span>{user?.is_public ? 'Public Profile' : 'Private Profile'}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

const ProfileHeaderSkeleton = () => (
  <div className="bg-slate-800/50 backdrop-blur-sm rounded-lg p-8 mb-6 animate-pulse">
    <div className="flex flex-col md:flex-row gap-6">
      <div className="w-24 h-24 bg-slate-700 rounded-full" />
      <div className="flex-grow">
        <div className="flex justify-between">
          <div>
            <div className="h-8 w-48 bg-slate-700 rounded mb-2" />
            <div className="h-4 w-96 bg-slate-700 rounded" />
          </div>
          <div className="h-10 w-24 bg-slate-700 rounded" />
        </div>
        <div className="mt-4 flex gap-4">
          {[1, 2, 3, 4].map((i) => (
            <div key={i} className="h-5 w-24 bg-slate-700 rounded" />
          ))}
        </div>
      </div>
    </div>
  </div>
)

export default ProfileHeader 