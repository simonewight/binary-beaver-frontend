import { Card, CardContent } from '../ui/card'
import { Button } from '../ui/button'
import { Heart, Star, User } from 'lucide-react'
import { Skeleton } from '../ui/skeleton'
import { useNavigate } from 'react-router-dom'
import { snippets as snippetsApi } from '../../services/api'
import { toast } from 'react-hot-toast'
import { useState, useEffect } from 'react'
import SnippetCard from '../SnippetCard'
import { useAuth } from '../../context/AuthContext'

const SnippetsGridSkeleton = () => (
  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
    {[1, 2, 3].map((i) => (
      <Card key={i} className="bg-slate-800/50 backdrop-blur-sm border-slate-700">
        <CardContent className="p-6">
          <div className="flex justify-between items-start mb-4">
            <div>
              <Skeleton className="h-6 w-48 mb-2" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-8 w-8 rounded-md" />
          </div>
          <Skeleton className="h-32 w-full rounded-lg" />
          <div className="flex justify-between items-center mt-4">
            <div className="flex items-center gap-2">
              <Skeleton className="h-8 w-8 rounded-full" />
              <Skeleton className="h-4 w-24" />
            </div>
            <Skeleton className="h-4 w-12" />
          </div>
        </CardContent>
      </Card>
    ))}
  </div>
)

const SnippetsGrid = ({ snippets }) => {
  const { user } = useAuth()
  
  // Filter snippets to only show the logged-in user's snippets
  const userSnippets = snippets.filter(snippet => snippet.author === user.username)

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {userSnippets.map(snippet => (
        <SnippetCard key={snippet.id} snippet={snippet} />
      ))}
    </div>
  )
}

export default SnippetsGrid 