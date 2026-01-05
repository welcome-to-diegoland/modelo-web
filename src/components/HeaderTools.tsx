import { useStore } from '../app/store'
import initialImages from '../data/images.json'

export default function HeaderTools() {
  const { items, selectedId, selectItem, initializeItems } = useStore()

  const handleReloadData = () => {
    localStorage.removeItem('modelo-document')
    initializeItems(initialImages as any)
    selectItem(null)
  }

  const handleClear = () => {
    if (window.confirm('¿Estás seguro de que deseas limpiar todo?')) {
      localStorage.removeItem('modelo-document')
      window.location.reload()
    }
  }

  return (
    <header className="header-tools">
      <div className="header-left">
        <h1 className="title">Modelo Web</h1>
        <p className="subtitle">Editor de layouts</p>
      </div>

      <div className="header-center">
        <span className="badge">{items.length} imágenes</span>
        {selectedId && (
          <span className="badge badge-selected">1 seleccionada</span>
        )}
      </div>

      <div className="header-right">
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
          onClick={handleClear}
          className="btn btn-small btn-danger"
          title="Limpiar todo (no se puede deshacer)"
        >
          Limpiar
        </button>
      </div>
    </header>
  )
}
