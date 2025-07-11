import { useState, useRef, useEffect } from 'react'
import { motion } from 'framer-motion'
import { cn } from '@/utils/cn'

const MiniMap = ({ 
  entities = [], 
  canvasSize = { width: 0, height: 0 }, 
  viewportSize = { width: 0, height: 0 }, 
  pan = { x: 0, y: 0 }, 
  zoom = 1, 
  onNavigate 
}) => {
  const canvasRef = useRef(null)
  const [isCanvasReady, setIsCanvasReady] = useState(false)
  const [renderError, setRenderError] = useState(null)

  // Validate dimensions to prevent canvas errors
  const hasValidDimensions = canvasSize.width > 0 && 
                           canvasSize.height > 0 && 
                           viewportSize.width > 0 && 
                           viewportSize.height > 0

  // Calculate minimap dimensions with minimum size enforcement
  const minimapSize = 200
  const scale = Math.min(
    minimapSize / Math.max(canvasSize.width, 1),
    minimapSize / Math.max(canvasSize.height, 1)
  )

  const minimapWidth = Math.max(canvasSize.width * scale, 100)
  const minimapHeight = Math.max(canvasSize.height * scale, 100)

  useEffect(() => {
    if (!hasValidDimensions || !canvasRef.current) {
      setIsCanvasReady(false)
      return
    }

    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    
    try {
      // Set canvas dimensions
      canvas.width = minimapWidth
      canvas.height = minimapHeight
      
      // Clear canvas
      ctx.clearRect(0, 0, minimapWidth, minimapHeight)
      
      // Draw canvas background
      ctx.fillStyle = '#f3f4f6'
      ctx.fillRect(0, 0, minimapWidth, minimapHeight)
      
      // Draw viewport indicator
      const viewportX = (-pan.x * scale) / zoom
      const viewportY = (-pan.y * scale) / zoom
      const viewportW = (viewportSize.width * scale) / zoom
      const viewportH = (viewportSize.height * scale) / zoom
      
      // Ensure viewport dimensions are valid
      if (viewportW > 0 && viewportH > 0) {
        ctx.strokeStyle = '#3b82f6'
        ctx.lineWidth = 2
        ctx.strokeRect(
          Math.max(0, viewportX),
          Math.max(0, viewportY),
          Math.min(viewportW, minimapWidth),
          Math.min(viewportH, minimapHeight)
        )
      }
      
      // Draw entities
      entities.forEach(entity => {
        if (entity.position && typeof entity.position.x === 'number' && typeof entity.position.y === 'number') {
          const x = entity.position.x * scale
          const y = entity.position.y * scale
          
          // Only draw if within canvas bounds
          if (x >= 0 && x <= minimapWidth && y >= 0 && y <= minimapHeight) {
            ctx.fillStyle = getEntityColor(entity.type)
            ctx.fillRect(x - 2, y - 2, 4, 4)
          }
        }
      })
      
      setIsCanvasReady(true)
      setRenderError(null)
    } catch (error) {
      console.error('MiniMap canvas rendering error:', error)
      setRenderError(error.message)
      setIsCanvasReady(false)
    }
  }, [entities, canvasSize, viewportSize, pan, zoom, minimapWidth, minimapHeight, hasValidDimensions])

  const getEntityColor = (type) => {
    const colors = {
      'business-model': '#3b82f6',
      'asset': '#10b981',
      'foundation': '#6b7280',
      'flow': '#f59e0b'
    }
    return colors[type] || '#6b7280'
  }

  const handleClick = (e) => {
    if (!hasValidDimensions || !onNavigate) return

    const rect = e.currentTarget.getBoundingClientRect()
    const x = e.clientX - rect.left
    const y = e.clientY - rect.top
    
    const canvasX = (x / scale) * zoom
    const canvasY = (y / scale) * zoom
    
    onNavigate({
      x: -canvasX + viewportSize.width / 2,
      y: -canvasY + viewportSize.height / 2
    })
  }

  // Don't render if dimensions are invalid
  if (!hasValidDimensions) {
    return (
      <div className="minimap rounded-lg p-2 w-[200px] h-[150px] flex items-center justify-center">
        <p className="text-xs text-gray-500">Map loading...</p>
      </div>
    )
  }

  // Show error state if rendering failed
  if (renderError) {
    return (
      <div className="minimap rounded-lg p-2 w-[200px] h-[150px] flex items-center justify-center">
        <p className="text-xs text-red-500">Map error</p>
      </div>
    )
  }

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.95 }}
      animate={{ opacity: 1, scale: 1 }}
      className={cn(
        "minimap rounded-lg p-2 cursor-pointer",
        !isCanvasReady && "opacity-50"
      )}
      onClick={handleClick}
    >
      <canvas
        ref={canvasRef}
        className="rounded border border-gray-200"
        style={{
          width: minimapWidth,
          height: minimapHeight,
          maxWidth: '200px',
          maxHeight: '150px'
        }}
      />
    </motion.div>
  )
}

export default MiniMap