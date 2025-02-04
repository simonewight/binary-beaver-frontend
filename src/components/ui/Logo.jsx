import React from 'react'
import './Logo.css'

const Logo = ({ size = 27 }) => {
  const style = {
    '--size': `${size}px`,
    '--color': '#06b6d4' // Tailwind's cyan-500
  }

  return (
    <div className="logo-container" style={style}>
      <div className="logo-square"></div>
      <div className="logo-square"></div>
      <div className="logo-square"></div>
      <div className="logo-square"></div>
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