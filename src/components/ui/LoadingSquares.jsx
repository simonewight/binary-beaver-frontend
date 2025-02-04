import React from 'react'
import './LoadingSquares.css'

const LoadingSquares = () => {
  return (
    <div className="flex items-center justify-center gap-16">
      <div id="container">
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
        <div className="square"></div>
      </div>
      <div className="text-xl font-medium text-white whitespace-nowrap">
        Setting up your account...
      </div>
    </div>
  )
}

export default LoadingSquares 