import { useStore } from '../app/store'
import initialImages from '../data/images.json'

type DrawingMode = 'select' | 'draw'

type HeaderToolsProps = {
  drawingMode?: DrawingMode
  onDrawingModeChange?: (mode: DrawingMode) => void
}

export default function HeaderTools({ drawingMode = 'select', onDrawingModeChange }: HeaderToolsProps) {
  const { items, shapes, selectedId, selectItem, initializeItems, clearAllShapes, clearEverything } = useStore()

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

  return (
    <header className="header-tools">
      <div className="header-left">
        <h1 className="title">Modelo Web</h1>
        <p className="subtitle">Editor de layouts</p>
      </div>

      <div className="header-center">
        <span className="badge">{items.length} imágenes</span>
        <span className="badge">{shapes.length} formas</span>
        {selectedId && (
          <span className="badge badge-selected">1 seleccionada</span>
        )}
      </div>

      <div className="header-right">
        <button
          onClick={handleAddShape}
          className={`btn btn-small ${drawingMode === 'draw' ? 'btn-active' : ''}`}
          title="Agregar forma"
        >
          Agregar Forma
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
          title="Limpiar todo (no se puede deshacer)"
        >
          Limpiar Todo
        </button>
      </div>
    </header>
  )
}
