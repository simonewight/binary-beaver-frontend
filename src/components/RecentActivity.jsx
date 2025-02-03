import React from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { Code, Library, Calendar } from 'lucide-react'
import { formatDistanceToNow } from 'date-fns'

const ActivityItem = ({ type, item }) => {
  const isSnippet = type === 'snippet'
  const Icon = isSnippet ? Code : Library
  const path = isSnippet ? `/snippet/${item.id}` : `/collection/${item.id}`

  return (
    <Link 
      to={path}
      className="block p-4 bg-slate-700 rounded-lg hover:bg-slate-600 transition-colors"
    >
      <div className="flex items-center gap-3">
        <div className="p-2 bg-slate-600 rounded-md">
          <Icon className="h-4 w-4 text-blue-400" />
        </div>
        <div className="flex-1 min-w-0">
          <h3 className="text-white font-medium truncate">
            {item.title || item.name}
          </h3>
          <p className="text-sm text-slate-400 flex items-center gap-1">
            <Calendar className="h-3 w-3" />
            {formatDistanceToNow(new Date(item.created_at), { addSuffix: true })}
          </p>
        </div>
      </div>
    </Link>
  )
}

const RecentActivity = ({ snippets, collections }) => {
  const navigate = useNavigate()

  const handleSnippetClick = (snippetId) => {
    navigate(`/snippet/${snippetId}`)
  }

  if (!snippets?.length && !collections?.length) {
    return (
      <div className="text-slate-400 text-center py-8">
        No recent activity
      </div>
    )
  }

  return (
    <div className="space-y-4">
      {snippets?.map(snippet => (
        <ActivityItem 
          key={`snippet-${snippet.id}`}
          type="snippet"
          item={snippet}
        />
      ))}
      {collections?.map(collection => (
        <ActivityItem 
          key={`collection-${collection.id}`}
          type="collection"
          item={collection}
        />
      ))}
    </div>
  )
}

export default RecentActivity 