import { useEffect, useRef } from 'react'

const WarpSpeed = ({ className = '' }) => {
  const canvasRef = useRef(null)
  const animationRef = useRef(null)
  const starsRef = useRef([])
  const warpRef = useRef(0)

  useEffect(() => {
    const canvas = canvasRef.current
    const c = canvas.getContext('2d')
    
    // Set canvas size
    const updateCanvasSize = () => {
      canvas.width = window.innerWidth
      canvas.height = window.innerHeight
    }
    updateCanvasSize()
    
    // Initialize stars
    const numStars = 1900
    const focalLength = canvas.width * 2
    const centerX = canvas.width / 2
    const centerY = canvas.height / 2
    
    const initializeStars = () => {
      starsRef.current = Array.from({ length: numStars }, () => ({
        x: Math.random() * canvas.width,
        y: Math.random() * canvas.height,
        z: Math.random() * canvas.width,
        o: `0.${Math.floor(Math.random() * 99) + 1}`
      }))
    }
    
    const moveStars = () => {
      starsRef.current.forEach(star => {
        star.z--
        if (star.z <= 0) star.z = canvas.width
      })
    }
    
    const drawStars = () => {
      if (canvas.width !== window.innerWidth || canvas.height !== window.innerHeight) {
        updateCanvasSize()
        initializeStars()
      }
      
      if (warpRef.current === 0) {
        c.fillStyle = 'rgba(15, 23, 42, 1)'
        c.fillRect(0, 0, canvas.width, canvas.height)
      }
      
      starsRef.current.forEach(star => {
        const pixelX = (star.x - centerX) * (focalLength / star.z) + centerX
        const pixelY = (star.y - centerY) * (focalLength / star.z) + centerY
        const pixelRadius = 1 * (focalLength / star.z)
        
        c.fillStyle = `rgba(103, 232, 249, ${star.o})`
        c.fillRect(pixelX, pixelY, pixelRadius, pixelRadius)
      })
    }
    
    const animate = () => {
      moveStars()
      drawStars()
      animationRef.current = requestAnimationFrame(animate)
    }
    
    // Initialize and start animation
    initializeStars()
    animate()
    
    // Cleanup
    return () => {
      if (animationRef.current) {
        cancelAnimationFrame(animationRef.current)
      }
    }
  }, [])

  const toggleWarp = () => {
    warpRef.current = warpRef.current === 1 ? 0 : 1
  }

  return (
    <div className={`relative ${className}`}>
      <canvas 
        ref={canvasRef} 
        className="absolute inset-0 w-full h-full"
      />
      <button
        onClick={toggleWarp}
        className="absolute bottom-5 left-1/2 -translate-x-1/2 z-10 px-6 py-3 
                 text-cyan-100 border-2 border-cyan-100 font-bold text-lg
                 hover:shadow-[0_0_10px_#67e8f9,0_0_12px_#67e8f9_inset]
                 hover:text-shadow-[0_0_12px_#67e8f9,0_0_5px_#fff]
                 transition-all duration-200 bg-black/80"
      >
        WARP SPEED
      </button>
    </div>
  )
}

export default WarpSpeed 