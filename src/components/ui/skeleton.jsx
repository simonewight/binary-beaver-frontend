import React from 'react'
import { cn } from "../../lib/utils"

const Skeleton = ({ className, ...props }) => {
  return (
    <div
      className={cn("animate-shimmer bg-gradient-to-r from-slate-800 via-slate-700 to-slate-800", className)}
      {...props}
    />
  )
}

const SkeletonCard = () => {
  return (
    <div className="bg-slate-800 border border-slate-700 rounded-lg p-6 animate-shimmer">
      <div className="flex justify-between items-start mb-4">
        <div className="space-y-2">
          <div className="h-6 w-48 bg-slate-700 rounded"></div>
          <div className="flex gap-2">
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
            <div className="h-4 w-16 bg-slate-700 rounded"></div>
          </div>
        </div>
        <div className="h-8 w-8 bg-slate-700 rounded"></div>
      </div>
      <div className="h-32 bg-slate-900 rounded-lg mb-4"></div>
      <div className="flex justify-between items-center">
        <div className="flex items-center gap-2">
          <div className="h-8 w-8 bg-slate-700 rounded-full"></div>
          <div className="h-4 w-24 bg-slate-700 rounded"></div>
        </div>
        <div className="flex items-center gap-2">
          <div className="h-4 w-4 bg-slate-700 rounded"></div>
          <div className="h-4 w-8 bg-slate-700 rounded"></div>
        </div>
      </div>
    </div>
  )
}

export { Skeleton as default, SkeletonCard } 