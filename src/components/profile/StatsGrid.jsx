import { Code, Library, Heart, Star } from 'lucide-react'

const StatCard = ({ icon: Icon, label, value, isLoading }) => {
  if (isLoading) {
    return (
      <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg animate-pulse">
        <div className="h-8 w-8 bg-slate-700 rounded mb-2" />
        <div className="h-4 w-16 bg-slate-700 rounded mb-1" />
        <div className="h-6 w-8 bg-slate-700 rounded" />
      </div>
    )
  }

  return (
    <div className="bg-slate-800/50 backdrop-blur-sm p-4 rounded-lg">
      <div className="flex items-center gap-4">
        <div className="p-2 bg-slate-700 rounded-lg">
          <Icon className="h-6 w-6 text-cyan-400" />
        </div>
        <div>
          <p className="text-sm text-slate-400">{label}</p>
          <p className="text-2xl font-bold text-white">{value}</p>
        </div>
      </div>
    </div>
  )
}

const StatsGrid = ({ stats, isLoading }) => {
  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <StatCard
        icon={Code}
        label="Snippets"
        value={stats?.snippets_count || 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={Library}
        label="Collections"
        value={stats?.collections_count || 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={Heart}
        label="Likes Received"
        value={stats?.likes_received || 0}
        isLoading={isLoading}
      />
      <StatCard
        icon={Star}
        label="Likes Given"
        value={stats?.likes_given || 0}
        isLoading={isLoading}
      />
    </div>
  )
}

export default StatsGrid 