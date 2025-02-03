import React, { useState } from 'react'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogDescription,
} from '../ui/dialog'
import { Button } from '../ui/button'
import { Input } from '../ui/input'
import { Copy, Check } from 'lucide-react'
import { toast } from 'react-hot-toast'

const ShareCollectionDialog = ({ open, onOpenChange, url }) => {
  const [copied, setCopied] = useState(false)

  const handleCopy = async () => {
    try {
      await navigator.clipboard.writeText(url)
      setCopied(true)
      toast.success('URL copied to clipboard')
      setTimeout(() => setCopied(false), 2000)
    } catch (error) {
      console.error('Failed to copy:', error)
      toast.error('Failed to copy URL')
    }
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle className="text-lg font-semibold text-white">
            Share Collection
          </DialogTitle>
          <DialogDescription className="text-slate-400">
            Share this collection with others
          </DialogDescription>
        </DialogHeader>

        <div className="flex items-center space-x-2 mt-4">
          <Input
            value={url}
            readOnly
            className="bg-slate-800/50 border-slate-700 text-white"
          />
          <Button
            type="button"
            variant="ghost"
            className="text-slate-400 hover:text-white"
            onClick={handleCopy}
          >
            {copied ? (
              <Check className="h-4 w-4 text-green-400" />
            ) : (
              <Copy className="h-4 w-4" />
            )}
          </Button>
        </div>
      </DialogContent>
    </Dialog>
  )
}

export default ShareCollectionDialog 