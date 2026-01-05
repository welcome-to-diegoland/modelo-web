import { useStore } from '../app/store'

export default function InspectorPanel() {
  const { items, selectedId, toggleItemBorder, deleteItem } = useStore()

  const selectedItem = items.find(i => i.id === selectedId)

  if (!selectedItem) {
    return (
      <div className="inspector-panel">
        <p className="text-gray-500">Selecciona una imagen para ver su información</p>
      </div>
    )
  }

  return (
    <div className="inspector-panel">
      <div className="info-section">
        <h3 className="font-semibold">{selectedItem.title || 'Sin título'}</h3>
        <p className="text-sm text-gray-600">ID: {selectedItem.id}</p>
      </div>

      <div className="info-section">
        <p><strong>Página:</strong> {selectedItem.page}</p>
        <p><strong>Posición X:</strong> {Math.round(selectedItem.x)}px</p>
        <p><strong>Posición Y:</strong> {Math.round(selectedItem.y)}px</p>
        <p><strong>Ancho:</strong> {selectedItem.width}px</p>
        <p><strong>Alto:</strong> {selectedItem.height}px</p>
      </div>

      <div className="buttons-section">
        <button
          onClick={() => toggleItemBorder(selectedItem.id)}
          className={`btn ${selectedItem.hasBorder ? 'btn-active' : 'btn-inactive'}`}
        >
          {selectedItem.hasBorder ? '✓ Borde activado' : 'Agregar borde'}
        </button>

        <button
          onClick={() => deleteItem(selectedItem.id)}
          className="btn btn-danger"
        >
          Eliminar imagen
        </button>
      </div>
    </div>
  )
}
