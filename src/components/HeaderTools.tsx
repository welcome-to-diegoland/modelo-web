import { useState } from 'react'
import { useStore } from '../app/store'
import initialImages from '../data/images.json'
import { CONFIG, getPageHeight } from '../app/config'
import { autoLayoutItems } from '../layout/autoLayout'
import SearchProductModal from './SearchProductModal'

type DrawingMode = 'select' | 'draw'

type HeaderToolsProps = {
  drawingMode?: DrawingMode
  onDrawingModeChange?: (mode: DrawingMode) => void
  activePage?: number
  dimensions?: any
}

export default function HeaderTools({ drawingMode = 'select', onDrawingModeChange, activePage = 1, dimensions }: HeaderToolsProps) {
  const { items, selectedId, selectItem, initializeItems, clearAllShapes, clearEverything, autoLayoutPage, autoLayoutAllPages, autoLayoutAllItems, layoutMode, cycleLayoutMode, zoom, setZoom } = useStore()
  const [isSearchModalOpen, setIsSearchModalOpen] = useState(false)

  const activePageItemCount = items.filter(item => 
    item.page === activePage && 
    item.x >= 0 && 
    item.y >= 0 && 
    item.x < (dimensions?.pageWidth || 600) && 
    item.y < (dimensions?.pageHeight || 800)
  ).length

  const handleReloadData = () => {
    localStorage.removeItem('modelo-document')
    // Cargar datos del JSON tal como están (sin modificar coordenadas)
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
      // Funciona para CUALQUIER página
      autoLayoutPage(activePage, dimensions.pageWidth, dimensions.pageHeight, 0, 0)
    }, 0)
  }

  const handleAutoLayoutAll = () => {
    if (!dimensions) return
    
    cycleLayoutMode()
    
    setTimeout(() => {
      // Aplica a TODAS las páginas
      autoLayoutAllPages(dimensions.pageWidth, dimensions.pageHeight)
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
    setZoom(0.8)
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
          onClick={() => setIsSearchModalOpen(true)}
          className="btn btn-small"
          title="Buscar y agregar producto"
        >
          🔍 Buscar Producto
        </button>
        <button
          onClick={handleAutoLayout}
          className="btn btn-small"
          title={getModeLabel()}
        >
          Auto 1
        </button>
        <button
          onClick={handleAutoLayoutAll}
          className="btn btn-small"
          title="Auto-acomodar todas las páginas simultáneamente"
        >
          Auto All
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

      <SearchProductModal 
        isOpen={isSearchModalOpen}
        activePage={activePage}
        onClose={() => setIsSearchModalOpen(false)}
      />
    </header>
  )
}
