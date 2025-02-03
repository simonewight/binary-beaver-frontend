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

export function stringToColor(string) {
  let hash = 0;
  for (let i = 0; i < string.length; i++) {
    hash = string.charCodeAt(i) + ((hash << 5) - hash);
  }
  
  const hue = hash % 360;
  return `hsl(${hue}, 70%, 50%)`; // Consistent saturation and lightness
}

export function getInitials(name) {
  return name
    .split(' ')
    .map(word => word[0])
    .join('')
    .toUpperCase()
    .slice(0, 2);
} 