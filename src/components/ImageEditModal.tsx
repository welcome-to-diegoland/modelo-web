import { useState, useRef, useEffect } from 'react'
import { Stage, Layer, Image as KonvaImage, Line } from 'react-konva'
import useImage from 'use-image'
import { LineData } from '../app/types'
import '../styles/ImageEditModal.css'

type ImageEditModalProps = {
  isOpen: boolean
  imageUrl: string
  imageId: string
  existingLines?: LineData[]
  onSave: (lines: LineData[]) => void
  onClose: () => void
}

export default function ImageEditModal({ isOpen, imageUrl, imageId, existingLines = [], onSave, onClose }: ImageEditModalProps) {
  const [image] = useImage(imageUrl)
  const [lines, setLines] = useState<LineData[]>(existingLines)
  const [isDrawing, setIsDrawing] = useState(false)
  const [currentLine, setCurrentLine] = useState<number[]>([])
  const stageRef = useRef<any>(null)

  const [dimensions, setDimensions] = useState({ width: 700, height: 700 })
  const [scale, setScale] = useState(1) // Zoom: 0.5 (50%) a 4 (400%)
  const [layerPosition, setLayerPosition] = useState({ x: 0, y: 0 })
  const [isPanning, setIsPanning] = useState(false)
  const [lastPanPosition, setLastPanPosition] = useState({ x: 0, y: 0 })

  // Cargar líneas existentes cuando se abre el modal
  useEffect(() => {
    if (isOpen) {
      setLines(existingLines)
    }
  }, [isOpen, existingLines])

  useEffect(() => {
    if (image) {
      const maxWidth = 700
      const maxHeight = 700
      const imgWidth = image.width
      const imgHeight = image.height
      
      let width = imgWidth
      let height = imgHeight
      
      // Escalar si la imagen es más grande que el contenedor
      if (width > maxWidth || height > maxHeight) {
        const ratio = Math.min(maxWidth / width, maxHeight / height)
        width = width * ratio
        height = height * ratio
      }
      
      setDimensions({ width, height })
    }
  }, [image])

  const handleMouseDown = (e: any) => {
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    
    if (isDrawing) {
      // Modo dibujo: iniciar línea
      const layer = stage.children[0]
      const adjustedX = (pos.x - layer.x()) / scale
      const adjustedY = (pos.y - layer.y()) / scale
      setCurrentLine([adjustedX, adjustedY])
    } else {
      // Modo pan: iniciar arrastre
      setIsPanning(true)
      setLastPanPosition({ x: pos.x, y: pos.y })
    }
  }

  const handleMouseUp = (e: any) => {
    if (isPanning) {
      // Terminar pan
      setIsPanning(false)
      return
    }
    
    if (!isDrawing || currentLine.length === 0) return
    
    const stage = e.target.getStage()
    const layer = stage.children[0]
    const pos = stage.getPointerPosition()
    
    // Ajustar la posición según el zoom del Layer
    let adjustedX = (pos.x - layer.x()) / scale
    let adjustedY = (pos.y - layer.y()) / scale
    
    // Si Shift está presionado, ajustar a líneas rectas (0°, 45°, 90°, 135°, etc.)
    if (e.evt.shiftKey) {
      const dx = adjustedX - currentLine[0]
      const dy = adjustedY - currentLine[1]
      const angle = Math.atan2(dy, dx)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Redondear al ángulo más cercano de 45°
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)
      
      // Proyectar sobre ese ángulo
      adjustedX = currentLine[0] + distance * Math.cos(snapAngle)
      adjustedY = currentLine[1] + distance * Math.sin(snapAngle)
    }
    
    // Normalizar las coordenadas a valores entre 0 y 1 (porcentajes)
    const normalizedPoints = [
      currentLine[0] / dimensions.width,  // x1 normalizado
      currentLine[1] / dimensions.height, // y1 normalizado
      adjustedX / dimensions.width,       // x2 normalizado
      adjustedY / dimensions.height       // y2 normalizado
    ]
    
    const newLine: LineData = {
      id: `line-${Date.now()}`,
      points: normalizedPoints
    }
    
    setLines([...lines, newLine])
    setCurrentLine([])
  }

  const handleMouseMove = (e: any) => {
    const stage = e.target.getStage()
    const pos = stage.getPointerPosition()
    
    if (isPanning) {
      // Modo pan: mover el Layer
      const dx = pos.x - lastPanPosition.x
      const dy = pos.y - lastPanPosition.y
      
      setLayerPosition(prev => ({
        x: prev.x + dx,
        y: prev.y + dy
      }))
      
      setLastPanPosition({ x: pos.x, y: pos.y })
      return
    }
    
    if (!isDrawing || currentLine.length === 0) return
    
    // Modo dibujo: actualizar línea preview
    const layer = stage.children[0]
    let adjustedX = (pos.x - layer.x()) / scale
    let adjustedY = (pos.y - layer.y()) / scale
    
    // Si Shift está presionado, ajustar a líneas rectas (0°, 45°, 90°, 135°, etc.)
    if (e.evt.shiftKey) {
      const dx = adjustedX - currentLine[0]
      const dy = adjustedY - currentLine[1]
      const angle = Math.atan2(dy, dx)
      const distance = Math.sqrt(dx * dx + dy * dy)
      
      // Redondear al ángulo más cercano de 45°
      const snapAngle = Math.round(angle / (Math.PI / 4)) * (Math.PI / 4)
      
      // Proyectar sobre ese ángulo
      adjustedX = currentLine[0] + distance * Math.cos(snapAngle)
      adjustedY = currentLine[1] + distance * Math.sin(snapAngle)
    }
    
    setCurrentLine([currentLine[0], currentLine[1], adjustedX, adjustedY])
  }

  const handleSave = () => {
    // Retornar las líneas como datos, no como imagen
    onSave(lines)
    handleClose()
  }

  const handleClose = () => {
    setLines([])
    setCurrentLine([])
    setIsDrawing(false)
    setScale(1) // Reset zoom
    onClose()
  }

  const handleZoomIn = () => {
    setScale(prev => Math.min(prev + 0.25, 4)) // Max 400%
  }

  const handleZoomOut = () => {
    setScale(prev => Math.max(prev - 0.25, 0.5)) // Min 50%
  }

  const handleZoomReset = () => {
    setScale(1) // 100%
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Editar Imagen - Resumir</h2>
          <button className="modal-close" onClick={handleClose}>×</button>
        </div>
        
        <div className="modal-body">
          {/* Controles de Zoom */}
          <div className="zoom-controls">
            <button className="btn btn-sm" onClick={handleZoomOut} disabled={scale <= 0.5}>
              −
            </button>
            <span className="zoom-level">{Math.round(scale * 100)}%</span>
            <button className="btn btn-sm" onClick={handleZoomIn} disabled={scale >= 4}>
              +
            </button>
            <button className="btn btn-sm" onClick={handleZoomReset}>
              Reset
            </button>
          </div>

          <div 
            className="canvas-container"
            style={{ 
              cursor: isDrawing ? 'crosshair' : (isPanning ? 'grabbing' : 'grab')
            }}
          >
            <Stage
              ref={stageRef}
              width={700}
              height={700}
              onMouseDown={handleMouseDown}
              onMouseUp={handleMouseUp}
              onMouseMove={handleMouseMove}
            >
              <Layer
                x={layerPosition.x}
                y={layerPosition.y}
                scaleX={scale}
                scaleY={scale}
              >
                {image && (
                  <KonvaImage
                    image={image}
                    width={dimensions.width}
                    height={dimensions.height}
                  />
                )}
                
                {/* Líneas guardadas - desnormalizadas para el tamaño del modal */}
                {lines.map((line) => {
                  // Convertir coordenadas normalizadas (0-1) a píxeles del modal
                  const scaledPoints = [
                    line.points[0] * dimensions.width,  // x1
                    line.points[1] * dimensions.height, // y1
                    line.points[2] * dimensions.width,  // x2
                    line.points[3] * dimensions.height  // y2
                  ]
                  return (
                    <Line
                      key={line.id}
                      points={scaledPoints}
                      stroke="#ec4899"
                      strokeWidth={3 / scale} // Ajustar grosor inversamente al zoom
                      lineCap="round"
                      lineJoin="round"
                    />
                  )
                })}
                
                {/* Línea actual mientras se dibuja */}
                {currentLine.length === 4 && (
                  <Line
                    points={currentLine}
                    stroke="#ec4899"
                    strokeWidth={3 / scale} // Ajustar grosor inversamente al zoom
                    lineCap="round"
                    lineJoin="round"
                    dash={[5 / scale, 5 / scale]} // Ajustar dash inversamente al zoom
                  />
                )}
              </Layer>
            </Stage>
          </div>
        </div>
        
        <div className="modal-footer">
          <button 
            className={`btn ${isDrawing ? 'btn-active' : ''}`}
            onClick={() => setIsDrawing(!isDrawing)}
          >
            {isDrawing ? '✓ Raya Activa' : 'Raya'}
          </button>
          <button className="btn btn-primary" onClick={handleSave}>
            Guardar
          </button>
          <button className="btn btn-secondary" onClick={handleClose}>
            Cancelar
          </button>
        </div>
      </div>
    </div>
  )
}
