import { useEffect, useRef } from 'react'
import './StarField.css'

const StarField = () => {
  const containerRef = useRef(null)

  useEffect(() => {
    const stars = document.createElement('div')
    stars.className = 'stars'
    
    // Create multiple star layers for parallax effect
    for (let i = 1; i <= 3; i++) {
      const starLayer = document.createElement('div')
      starLayer.className = `star-layer star-layer-${i}`
      stars.appendChild(starLayer)
    }
    
    // Add stars to the container instead of body
    containerRef.current.appendChild(stars)
    
    return () => {
      if (containerRef.current && stars) {
        containerRef.current.removeChild(stars)
      }
    }
  }, [])

  return <div ref={containerRef} className="star-container" />
}

export default StarField 