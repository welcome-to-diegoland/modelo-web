import { useEffect, useState, useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import Konva from 'konva'
import { useStore } from '../app/store'
import { PageComponent } from './PageCanvas'
import { DraggableImage } from './ImageItem'
import { ShapeItem } from './ShapeItem'
import initialImages from '../data/images.json'

// Aspecto A4 vertical: 210mm x 297mm = 1.414
const A4_ASPECT_RATIO = 297 / 210

interface Dimensions {
  pageWidth: number
  pageHeight: number
  canvasWidth: number
  canvasHeight: number
  marginWidth: number
  page1X: number
  page1Y: number
  page2X: number
  page2Y: number
  marginLeftX: number
  marginRightX: number
  pageGap: number
}

type DrawingMode = 'select' | 'draw'

type WorkspaceProps = {
  drawingMode: DrawingMode
  onDrawingModeChange: (mode: DrawingMode) => void
  onEditingShapeChange?: (id: string | null) => void
  onActivePageChange?: (page: number) => void
  onDimensionsChange?: (dimensions: any) => void
}

export default function Workspace({ drawingMode, onDrawingModeChange, onEditingShapeChange, onActivePageChange, onDimensionsChange }: WorkspaceProps) {
  const stageRef = useRef<Konva.Stage>(null)
  const containerRef = useRef<HTMLDivElement>(null)
  const { items, shapes, selectedId, selectItem, moveItem, initializeItems, addShape, zoom } = useStore()
  const [dimensions, setDimensions] = useState<Dimensions>({
    pageWidth: 400,
    pageHeight: 563,
    canvasWidth: 560,
    canvasHeight: 1276,
    marginWidth: 80,
    page1X: 80,
    page1Y: 0,
    page2X: 80,
    page2Y: 613,
    marginLeftX: 0,
    marginRightX: 480,
    pageGap: 50
  })
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })

  // Calcular dimensiones responsivas
  useEffect(() => {
    const calculateDimensions = () => {
      // Tamaño FIJO de la página A4
      const FIXED_PAGE_WIDTH = 600 // Ancho fijo
      const FIXED_PAGE_HEIGHT = Math.round(FIXED_PAGE_WIDTH * (297 / 210)) // Proporción A4
      const PAGE_GAP = 50
      
      // Canvas: margen (600) + página (600) + margen (600) = 1800px
      // Las 2 páginas comparten el mismo ancho, apiladas verticalmente
      const canvasWidth = FIXED_PAGE_WIDTH * 3
      const canvasHeight = FIXED_PAGE_HEIGHT * 2 + PAGE_GAP
      
      setDimensions({
        pageWidth: FIXED_PAGE_WIDTH,
        pageHeight: FIXED_PAGE_HEIGHT,
        canvasWidth: Math.floor(canvasWidth),
        canvasHeight: Math.floor(canvasHeight),
        marginWidth: FIXED_PAGE_WIDTH,
        marginLeftX: 0,
        page1X: FIXED_PAGE_WIDTH,
        page1Y: 0,
        page2X: FIXED_PAGE_WIDTH,
        page2Y: FIXED_PAGE_HEIGHT + PAGE_GAP,
        marginRightX: FIXED_PAGE_WIDTH * 2,
        pageGap: PAGE_GAP
      })
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)
    return () => window.removeEventListener('resize', calculateDimensions)
  }, [])

  // Notificar cambios de dimensiones
  useEffect(() => {
    onDimensionsChange?.(dimensions)
  }, [dimensions, onDimensionsChange])

  // Inicializar con datos si está vacío
  useEffect(() => {
    if (items.length === 0) {
      initializeItems(initialImages as any)
    }
  }, [items.length, initializeItems])

  // Detectar página activa basada en scroll
  useEffect(() => {
    const container = containerRef.current
    if (!container) return

    const handleScroll = () => {
      const scrollTop = container.scrollTop
      const containerHeight = container.clientHeight
      const centerPoint = scrollTop + containerHeight / 2

      // Determinamos cuál página está más visible
      const page1Bottom = dimensions.page1Y + dimensions.pageHeight
      const page2Top = dimensions.page2Y

      if (centerPoint < page2Top) {
        onActivePageChange?.(1)
      } else {
        onActivePageChange?.(2)
      }
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [dimensions, onActivePageChange])

  return (
    <div className="workspace">
      {/* Canvas UNIFICADO - Contiene todo */}
      <div ref={containerRef} className="canvas-container" style={{ cursor: drawingMode === 'draw' ? 'crosshair' : 'default' }}>
        <div style={{ width: `${dimensions.canvasWidth}px`, height: `${dimensions.canvasHeight}px` }}>
          <Stage 
            ref={stageRef}
            width={dimensions.canvasWidth} 
            height={dimensions.canvasHeight}
            scaleX={zoom}
            scaleY={zoom}
            offsetX={(dimensions.canvasWidth * (1 - zoom)) / 2}
            offsetY={0}
          onMouseDown={(e) => {
            if (drawingMode === 'draw') {
              const pos = e.target.getStage()!.getPointerPosition()!
              setStartPos({ x: pos.x, y: pos.y })
              setCurrentPos({ x: pos.x, y: pos.y })
              setIsDrawing(true)
            }
          }}
          onMouseMove={(e) => {
            if (drawingMode === 'draw' && isDrawing) {
              const pos = e.target.getStage()!.getPointerPosition()!
              setCurrentPos({ x: pos.x, y: pos.y })
            }
          }}
          onMouseUp={(e) => {
            if (drawingMode === 'draw' && isDrawing) {
              const endPos = e.target.getStage()!.getPointerPosition()!
              const width = Math.abs(endPos.x - startPos.x)
              const height = Math.abs(endPos.y - startPos.y)
              
              // Solo crear forma si tiene tamaño mínimo
              if (width > 20 && height > 20) {
                const newShape = {
                  id: `shape-${Date.now()}`,
                  x: Math.min(startPos.x, endPos.x),
                  y: Math.min(startPos.y, endPos.y),
                  width,
                  height,
                  text: '',
                  backgroundColor: '#a5f3fc',
                  borderColor: '#0891b2',
                  borderWidth: 2,
                  hasBorder: false,
                  percentages: []
                }
                addShape(newShape)
                selectItem(newShape.id)
                onEditingShapeChange?.(newShape.id)
              }
              
              setIsDrawing(false)
              onDrawingModeChange('select')
            }
          }}
        >
          <Layer>
            {/* Página 1 */}
            <PageComponent
              pageId={1}
              x={dimensions.page1X}
              y={dimensions.page1Y}
              width={dimensions.pageWidth}
              height={dimensions.pageHeight}
            />

            {/* Página 2 */}
            <PageComponent
              pageId={2}
              x={dimensions.page2X}
              y={dimensions.page2Y}
              width={dimensions.pageWidth}
              height={dimensions.pageHeight}
            />

            {/* Imágenes página 1 */}
            {items.filter(item => item.page === 1).map(item => (
              <DraggableImage
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => selectItem(item.id)}
                onDragEnd={(x, y) => {
                  moveItem(item.id, x, y)
                }}
                pageOffsetX={dimensions.page1X}
                pageOffsetY={dimensions.page1Y}
              />
            ))}

            {/* Imágenes página 2 */}
            {items.filter(item => item.page === 2).map(item => (
              <DraggableImage
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => selectItem(item.id)}
                onDragEnd={(x, y) => {
                  moveItem(item.id, x, y)
                }}
                pageOffsetX={dimensions.page2X}
                pageOffsetY={dimensions.page2Y}
              />
            ))}

            {/* TODAS las formas */}
            {shapes.map(shape => (
              <ShapeItem
                key={shape.id}
                shape={shape}
                isSelected={shape.id === selectedId}
                onSelect={() => selectItem(shape.id)}
                onClick={() => onEditingShapeChange?.(shape.id)}
              />
            ))}

            {/* Preview de forma mientras se dibuja */}
            {isDrawing && (
              <Rect
                x={Math.min(startPos.x, currentPos.x)}
                y={Math.min(startPos.y, currentPos.y)}
                width={Math.abs(currentPos.x - startPos.x)}
                height={Math.abs(currentPos.y - startPos.y)}
                stroke="#06b6d4"
                strokeWidth={2}
                dash={[5, 5]}
                fill="rgba(6, 182, 212, 0.1)"
              />
            )}
          </Layer>
        </Stage>
        </div>
      </div>
    </div>
  )
}
