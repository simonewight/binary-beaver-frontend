import React from 'react'
import './Logo.css'

const Logo = ({ size = 27 }) => {
  const style = {
    '--size': `${size}px`,
    '--color': '#06b6d4' // Tailwind's cyan-500
  }

  return (
    <div className="flex items-center gap-2">
      <div className="logo-container" style={style}>
        <div className="logo-square"></div>
        <div className="logo-square"></div>
        <div className="logo-square"></div>
        <div className="logo-square"></div>
      </div>
      <span 
        className="text-xl font-bold tracking-tight" 
        style={{ 
          fontFamily: 'JetBrains Mono',
          color: '#06b6d4', // Match the logo color
          textShadow: '0 0 10px rgba(6, 182, 212, 0.3)' // Subtle glow effect
        }}
      >
        Code Blox
      </span>
    </div>
  )
}

export const Favicon = () => {
  return (
    <svg
      width="32"
      height="32"
      viewBox="0 0 32 32"
      fill="none"
      xmlns="http://www.w3.org/2000/svg"
    >
      <path
        d="M16 2L30 16L16 30L2 16L16 2Z"
        fill="#06B6D4" // Tailwind cyan-500
        stroke="#0891B2" // Tailwind cyan-600
        strokeWidth="2"
      />
    </svg>
  )
}

export default Logo 