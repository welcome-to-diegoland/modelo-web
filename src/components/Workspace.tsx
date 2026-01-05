import { useEffect, useState } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useStore } from '../app/store'
import { PageComponent } from './PageCanvas'
import { DraggableImage } from './ImageItem'
import InspectorPanel from './InspectorPanel'
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
  page2X: number
  marginLeftX: number
  marginRightX: number
}

export default function Workspace() {
  const { items, selectedId, selectItem, moveItem, initializeItems } = useStore()
  const [dimensions, setDimensions] = useState<Dimensions>({
    pageWidth: 400,
    pageHeight: 563,
    canvasWidth: 800,
    canvasHeight: 563,
    marginWidth: 80,
    page1X: 80,
    page2X: 480,
    marginLeftX: 0,
    marginRightX: 560
  })

  // Calcular dimensiones responsivas
  useEffect(() => {
    const calculateDimensions = () => {
      // Espacios fijos: header (70px) + inspector (120px) = 190px
      const HEADER_HEIGHT = 70
      const INSPECTOR_HEIGHT = 120
      
      const availableHeight = window.innerHeight - HEADER_HEIGHT - INSPECTOR_HEIGHT
      const availableWidth = window.innerWidth
      
      // El ancho de una página basado en la altura disponible y aspecto A4
      const pageHeight = Math.max(400, availableHeight)
      const pageWidth = pageHeight / A4_ASPECT_RATIO
      
      // Ancho total de 2 páginas
      const pagesWidthTotal = pageWidth * 2
      
      // Espacio restante para márgenes (dividido entre 2 lados)
      const remainingWidth = availableWidth - pagesWidthTotal
      const marginWidth = Math.max(30, remainingWidth / 2)
      
      const canvasWidth = marginWidth + pageWidth + pageWidth + marginWidth
      
      setDimensions({
        pageWidth: Math.floor(pageWidth),
        pageHeight: Math.floor(pageHeight),
        canvasWidth: Math.floor(canvasWidth),
        canvasHeight: Math.floor(pageHeight),
        marginWidth: Math.floor(marginWidth),
        marginLeftX: 0,
        page1X: Math.floor(marginWidth),
        page2X: Math.floor(marginWidth + pageWidth),
        marginRightX: Math.floor(marginWidth + pageWidth + pageWidth)
      })
    }

    calculateDimensions()
    window.addEventListener('resize', calculateDimensions)
    return () => window.removeEventListener('resize', calculateDimensions)
  }, [])

  // Inicializar con datos si está vacío
  useEffect(() => {
    if (items.length === 0) {
      initializeItems(initialImages as any)
    }
  }, [items.length, initializeItems])

  return (
    <div className="workspace">
      {/* Canvas UNIFICADO - Contiene todo */}
      <div className="canvas-container">
        <Stage width={dimensions.canvasWidth} height={dimensions.canvasHeight}>
          <Layer>
            {/* Margen izquierdo gris */}
            <Rect
              x={dimensions.marginLeftX}
              y={0}
              width={dimensions.marginWidth}
              height={dimensions.canvasHeight}
              fill="#ccc"
              opacity={0.3}
            />
            
            {/* Página 1 */}
            <PageComponent
              pageId={1}
              x={dimensions.page1X}
              y={0}
              width={dimensions.pageWidth}
              height={dimensions.pageHeight}
            />

            {/* Página 2 */}
            <PageComponent
              pageId={2}
              x={dimensions.page2X}
              y={0}
              width={dimensions.pageWidth}
              height={dimensions.pageHeight}
            />

            {/* Margen derecho gris */}
            <Rect
              x={dimensions.marginRightX}
              y={0}
              width={dimensions.marginWidth}
              height={dimensions.canvasHeight}
              fill="#ccc"
              opacity={0.3}
            />

            {/* TODAS las imágenes (sin filtrar por página) */}
            {items.map(item => (
              <DraggableImage
                key={item.id}
                item={item}
                selected={item.id === selectedId}
                onSelect={() => selectItem(item.id)}
                onDragEnd={(x, y) => {
                  moveItem(item.id, x, y)
                }}
              />
            ))}
          </Layer>
        </Stage>
      </div>

      {/* Panel inspector */}
      <InspectorPanel />
    </div>
  )
}
