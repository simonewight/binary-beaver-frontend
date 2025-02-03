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

export default Logo 