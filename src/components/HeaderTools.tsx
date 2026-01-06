import { useStore } from '../app/store'
import initialImages from '../data/images.json'

type DrawingMode = 'select' | 'draw'

type HeaderToolsProps = {
  drawingMode?: DrawingMode
  onDrawingModeChange?: (mode: DrawingMode) => void
  activePage?: number
  dimensions?: any
}

export default function HeaderTools({ drawingMode = 'select', onDrawingModeChange, activePage = 1, dimensions }: HeaderToolsProps) {
  const { items, selectedId, selectItem, initializeItems, clearAllShapes, clearEverything, autoLayoutPage, layoutMode, cycleLayoutMode, zoom, setZoom } = useStore()

  const activePageItemCount = items.filter(item => item.page === activePage).length

  const handleReloadData = () => {
    localStorage.removeItem('modelo-document')
    initializeItems(initialImages as any)
    selectItem(null)
  }

  const handleClearShapes = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todas las formas?')) {
      clearAllShapes()
    }
  }

  const handleClearAll = () => {
    if (window.confirm('¿Estás seguro de que deseas eliminar todo? Esta acción no se puede deshacer.')) {
      clearEverything()
    }
  }

  const handleAddShape = () => {
    onDrawingModeChange?.('draw')
  }

  const handleAutoLayout = () => {
    if (!dimensions) return
    
    cycleLayoutMode()
    
    setTimeout(() => {
      if (activePage === 1) {
        autoLayoutPage(1, dimensions.pageWidth, dimensions.pageHeight, dimensions.page1X, dimensions.page1Y)
      } else {
        autoLayoutPage(2, dimensions.pageWidth, dimensions.pageHeight, dimensions.page2X, dimensions.page2Y)
      }
    }, 0)
  }

  const getModeLabel = () => {
    if (layoutMode === 1) return 'Auto-acomodar (Normal)'
    if (layoutMode === 2) return 'Auto-acomodar (Por altura)'
    return 'Auto-acomodar (Por ancho)'
  }

  const handleZoomIn = () => {
    setZoom(Math.min(zoom + 0.1, 2))
  }

  const handleZoomOut = () => {
    setZoom(Math.max(zoom - 0.1, 0.5))
  }

  const handleZoomReset = () => {
    setZoom(1)
  }

  return (
    <header className="header-tools">
      <div className="header-left">
        <h1 className="title">Modelo Web</h1>
        <p className="subtitle">Editor de layouts</p>
      </div>

      <div className="header-center">
        <span className="badge">{activePageItemCount} imágenes</span>
        <span className="badge badge-page">Página {activePage}</span>
        {selectedId && (
          <span className="badge badge-selected">1 seleccionada</span>
        )}
      </div>

      <div className="header-right">
        <div className="zoom-controls">
          <button
            onClick={handleZoomOut}
            className="btn btn-small"
            title="Alejar"
          >
            −
          </button>
          <span className="zoom-display">{Math.round(zoom * 100)}%</span>
          <button
            onClick={handleZoomIn}
            className="btn btn-small"
            title="Acercar"
          >
            +
          </button>
          <button
            onClick={handleZoomReset}
            className="btn btn-small"
            title="Zoom por defecto"
          >
            100%
          </button>
        </div>
        <button
          onClick={handleAddShape}
          className={`btn btn-small ${drawingMode === 'draw' ? 'btn-active' : ''}`}
          title="Agregar forma"
        >
          Agregar Forma
        </button>
        <button
          onClick={handleAutoLayout}
          className="btn btn-small"
          title={getModeLabel()}
        >
          {getModeLabel()}
        </button>
        <button
          onClick={handleReloadData}
          className="btn btn-small"
          title="Recargar datos desde JSON"
        >
          Recargar datos
        </button>
        <button
          onClick={() => selectItem(null)}
          className="btn btn-small"
          title="Deseleccionar"
        >
          Deseleccionar
        </button>
        <button
          onClick={handleClearShapes}
          className="btn btn-small btn-danger"
          title="Limpiar solo formas"
        >
          Limpiar Formas
        </button>
        <button
          onClick={handleClearAll}
          className="btn btn-small btn-danger"
          title="Limpiar todo"
        >
          Limpiar Todo
        </button>
      </div>
    </header>
  )
}
