import React from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Link } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ShareDialog = ({ open, onOpenChange, url }) => {
  const handleCopyUrl = () => {
    navigator.clipboard.writeText(url)
    onOpenChange(false)
    toast.success('URL copied to clipboard')
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">Share Snippet</DialogTitle>
          <DialogDescription className="text-slate-400">
            Copy the link below to share this snippet
          </DialogDescription>
        </DialogHeader>
        
        <div className="flex flex-col sm:flex-row items-center gap-2 mt-4">
          <div className="w-full flex-1 p-3 bg-slate-800/50 border border-slate-700/50 rounded-md text-sm text-slate-300 break-all">
            {url}
          </div>
          <Button
            onClick={handleCopyUrl}
            className="w-full sm:w-auto px-4 py-2 bg-cyan-500 hover:bg-cyan-400 text-white font-medium"
          >
            <Link className="h-4 w-4 mr-2" />
            Copy URL
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareDialog 