import { clsx } from 'clsx'
import { twMerge } from 'tailwind-merge'

export function formatDate(dateString) {
  if (!dateString) return ''
  
  const date = new Date(dateString)
  const options = { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  }
  
  return date.toLocaleDateString('en-US', options)
}

export function cn(...classes) {
  return classes.filter(Boolean).join(' ')
} 