import { useEffect, useState, useRef } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import Konva from 'konva'
import { useStore } from '../app/store'
import { PageComponent } from './PageCanvas'
import { DraggableImage } from './ImageItem'
import { ShapeItem } from './ShapeItem'
import initialImages from '../data/images.json'
import { CONFIG, getPageHeight, getTotalCanvasHeight, getPageYPosition } from '../app/config'

interface Dimensions {
  pageWidth: number
  pageHeight: number
  canvasWidth: number
  canvasHeight: number
  marginWidth: number
  marginLeftX: number
  marginRightX: number
  pageGap: number
  totalPages: number
  pagePositions: { [key: number]: number } // Mapa de pageNumber -> yPosition
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
  
  const pageHeight = getPageHeight(CONFIG.PAGE_WIDTH_PX)
  const totalCanvasHeight = getTotalCanvasHeight(CONFIG.TOTAL_PAGES, pageHeight, CONFIG.PAGE_GAP_PX)
  
  // Precomputar posiciones de páginas
  const pagePositions: { [key: number]: number } = {}
  for (let i = 1; i <= CONFIG.TOTAL_PAGES; i++) {
    pagePositions[i] = getPageYPosition(i, pageHeight, CONFIG.PAGE_GAP_PX)
  }
  
  const [dimensions, setDimensions] = useState<Dimensions>({
    pageWidth: CONFIG.PAGE_WIDTH_PX,
    pageHeight: pageHeight,
    canvasWidth: CONFIG.PAGE_WIDTH_PX + CONFIG.CANVAS_MARGIN_WIDTH_PX * 2,
    canvasHeight: totalCanvasHeight,
    marginWidth: CONFIG.CANVAS_MARGIN_WIDTH_PX,
    marginLeftX: 0,
    marginRightX: CONFIG.PAGE_WIDTH_PX + CONFIG.CANVAS_MARGIN_WIDTH_PX,
    pageGap: CONFIG.PAGE_GAP_PX,
    totalPages: CONFIG.TOTAL_PAGES,
    pagePositions
  })
  
  const [isDrawing, setIsDrawing] = useState(false)
  const [startPos, setStartPos] = useState({ x: 0, y: 0 })
  const [currentPos, setCurrentPos] = useState({ x: 0, y: 0 })

  // Calcular dimensiones basadas en configuración
  useEffect(() => {
    const newPageHeight = getPageHeight(CONFIG.PAGE_WIDTH_PX)
    const newCanvasHeight = getTotalCanvasHeight(CONFIG.TOTAL_PAGES, newPageHeight, CONFIG.PAGE_GAP_PX)
    const newCanvasWidth = CONFIG.PAGE_WIDTH_PX + CONFIG.CANVAS_MARGIN_WIDTH_PX * 2
    
    // Precomputar posiciones
    const newPagePositions: { [key: number]: number } = {}
    for (let i = 1; i <= CONFIG.TOTAL_PAGES; i++) {
      newPagePositions[i] = getPageYPosition(i, newPageHeight, CONFIG.PAGE_GAP_PX)
    }
    
    setDimensions({
      pageWidth: CONFIG.PAGE_WIDTH_PX,
      pageHeight: newPageHeight,
      canvasWidth: newCanvasWidth,
      canvasHeight: newCanvasHeight,
      marginWidth: CONFIG.CANVAS_MARGIN_WIDTH_PX,
      marginLeftX: 0,
      marginRightX: CONFIG.PAGE_WIDTH_PX + CONFIG.CANVAS_MARGIN_WIDTH_PX,
      pageGap: CONFIG.PAGE_GAP_PX,
      totalPages: CONFIG.TOTAL_PAGES,
      pagePositions: newPagePositions
    })
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

      // Determinar cuál página está más visible
      let activePage = 1
      for (let i = 1; i <= CONFIG.TOTAL_PAGES; i++) {
        const pageYStart = dimensions.pagePositions[i]
        const pageYEnd = pageYStart + dimensions.pageHeight
        
        if (centerPoint >= pageYStart && centerPoint < pageYEnd) {
          activePage = i
          break
        }
      }
      
      onActivePageChange?.(activePage)
    }

    container.addEventListener('scroll', handleScroll)
    return () => container.removeEventListener('scroll', handleScroll)
  }, [dimensions, onActivePageChange])

  return (
    <div className="workspace">
      {/* Canvas UNIFICADO - Contiene todo */}
      <div ref={containerRef} className="canvas-container" style={{ cursor: drawingMode === 'draw' ? 'crosshair' : 'default' }}>
        <Stage 
          ref={stageRef}
          width={dimensions.canvasWidth} 
          height={dimensions.canvasHeight}
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
            {/* Renderizar todas las páginas dinámicamente */}
            {Array.from({ length: CONFIG.TOTAL_PAGES }).map((_, index) => {
              const pageNumber = index + 1
              const pageY = dimensions.pagePositions[pageNumber]
              return (
                <PageComponent
                  key={`page-${pageNumber}`}
                  pageId={pageNumber}
                  x={CONFIG.CANVAS_MARGIN_WIDTH_PX}
                  y={pageY}
                  width={dimensions.pageWidth}
                  height={dimensions.pageHeight}
                />
              )
            })}

            {/* Renderizar imágenes de todas las páginas dinámicamente */}
            {Array.from({ length: CONFIG.TOTAL_PAGES }).map((_, pageIndex) => {
              const pageNumber = pageIndex + 1
              const pageY = dimensions.pagePositions[pageNumber]
              return items
                .filter(item => item.page === pageNumber)
                .map(item => (
                  <DraggableImage
                    key={item.id}
                    item={item}
                    selected={item.id === selectedId}
                    onSelect={() => selectItem(item.id)}
                    onDragEnd={(x, y) => {
                      moveItem(item.id, x, y)
                    }}
                    pageOffsetX={CONFIG.CANVAS_MARGIN_WIDTH_PX}
                    pageOffsetY={pageY}
                  />
                ))
            })}

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
  )
}
