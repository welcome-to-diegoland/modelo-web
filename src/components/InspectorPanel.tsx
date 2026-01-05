import { useStore } from '../app/store'

export default function InspectorPanel() {
  const { items, selectedId, toggleItemBorder, deleteItem, toggleItemPercentage } = useStore()

  const selectedItem = items.find(i => i.id === selectedId)

  if (!selectedItem) {
    return (
      <div className="inspector-panel">
        <p className="text-gray-500">Selecciona una imagen para ver su información</p>
      </div>
    )
  }

  const percentageOptions = [10, 15, 20, 40, 50]

  return (
    <div className="inspector-panel">
      <div className="info-section">
        <h3 className="font-semibold">{selectedItem.title || 'Sin título'}</h3>
        <p className="text-sm text-gray-600">Marca: {selectedItem.brand || 'Sin marca'}</p>
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
          {selectedItem.hasBorder ? '✓ Resaltado' : 'Resaltado'}
        </button>

        {percentageOptions.map(percentage => (
          <button
            key={percentage}
            onClick={() => toggleItemPercentage(selectedItem.id, percentage)}
            className={`btn ${(selectedItem.percentages || []).includes(percentage) ? 'btn-active' : 'btn-inactive'}`}
          >
            {(selectedItem.percentages || []).includes(percentage) ? '✓ ' : ''}{percentage}%
          </button>
        ))}

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
