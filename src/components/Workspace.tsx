import { useEffect } from 'react'
import { Stage, Layer, Rect } from 'react-konva'
import { useStore } from '../app/store'
import { PageComponent } from './PageCanvas'
import { DraggableImage } from './ImageItem'
import InspectorPanel from './InspectorPanel'
import initialImages from '../data/images.json'

// Dimensiones carta en píxeles (A4 vertical)
const PAGE_WIDTH = 400
const PAGE_HEIGHT = 563

// Espacios grises laterales
const MARGIN_WIDTH = 80

// Canvas unificado
const CANVAS_WIDTH = MARGIN_WIDTH + PAGE_WIDTH + PAGE_WIDTH + MARGIN_WIDTH
const CANVAS_HEIGHT = PAGE_HEIGHT

// Posiciones X de cada elemento
const MARGIN_LEFT_X = 0
const PAGE1_X = MARGIN_WIDTH
const PAGE2_X = MARGIN_WIDTH + PAGE_WIDTH
const MARGIN_RIGHT_X = MARGIN_WIDTH + PAGE_WIDTH + PAGE_WIDTH
const PAGE1_Y = 0
const PAGE2_Y = 0

export default function Workspace() {
  const { items, selectedId, selectItem, moveItem, initializeItems } = useStore()

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
        <Stage width={CANVAS_WIDTH} height={CANVAS_HEIGHT}>
          <Layer>
            {/* Margen izquierdo gris */}
            <Rect
              x={MARGIN_LEFT_X}
              y={0}
              width={MARGIN_WIDTH}
              height={CANVAS_HEIGHT}
              fill="#ccc"
              opacity={0.3}
            />
            
            {/* Página 1 */}
            <PageComponent
              pageId={1}
              x={PAGE1_X}
              y={PAGE1_Y}
              width={PAGE_WIDTH}
              height={PAGE_HEIGHT}
            />

            {/* Página 2 */}
            <PageComponent
              pageId={2}
              x={PAGE2_X}
              y={PAGE2_Y}
              width={PAGE_WIDTH}
              height={PAGE_HEIGHT}
            />

            {/* Margen derecho gris */}
            <Rect
              x={MARGIN_RIGHT_X}
              y={0}
              width={MARGIN_WIDTH}
              height={CANVAS_HEIGHT}
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
