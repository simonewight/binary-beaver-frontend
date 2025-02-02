import React from 'react'

export const Spinner = ({ className = '' }) => {
  return (
    <div className={`animate-spin rounded-full border-2 border-current border-t-transparent h-4 w-4 ${className}`} />
  )
}

// We can keep the default export as well
export default Spinner 