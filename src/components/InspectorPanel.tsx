import { useState, useEffect } from 'react'
import { useStore } from '../app/store'

type InspectorPanelProps = {
  editingShapeId?: string | null
  onEditingShapeChange?: (id: string | null) => void
}

export default function InspectorPanel({ editingShapeId, onEditingShapeChange }: InspectorPanelProps) {
  const { items, shapes, selectedId, toggleItemBorder, deleteItem, toggleItemPercentage, updateShape, deleteShape, toggleShapePercentage } = useStore()
  const [editText, setEditText] = useState('')

  const selectedItem = items.find(i => i.id === selectedId)
  const selectedShape = shapes.find(s => s.id === selectedId)
  const editingShape = editingShapeId ? shapes.find(s => s.id === editingShapeId) : null

  // Actualizar editText cuando cambia editingShape
  useEffect(() => {
    if (editingShape) {
      setEditText(editingShape.text)
    }
  }, [editingShape])

  // Determinar si hay algo seleccionado
  const hasSelection = selectedItem || selectedShape
  const isShape = selectedShape !== undefined

  // Información para mostrar
  const infoTitle = selectedItem?.title || (selectedShape ? 'Forma' : 'Nada seleccionado')
  const infoDetails = selectedItem 
    ? [
        `Marca: ${selectedItem.brand || 'Sin marca'}`,
        `ID: ${selectedItem.id}`,
        `Página: ${selectedItem.page}`,
        `X: ${Math.round(selectedItem.x)}px`,
        `Y: ${Math.round(selectedItem.y)}px`,
        `Ancho: ${selectedItem.width}px`,
        `Alto: ${selectedItem.height}px`
      ]
    : selectedShape
    ? [
        `ID: ${selectedShape.id}`,
        `X: ${Math.round(selectedShape.x)}px`,
        `Y: ${Math.round(selectedShape.y)}px`,
        `Ancho: ${selectedShape.width}px`,
        `Alto: ${selectedShape.height}px`
      ]
    : []

  const percentageOptions = [10, 15, 20, 40, 50]

  return (
    <div className="inspector-panel">
      {/* Columna izquierda: Información */}
      <div className="inspector-left">
        <h3 className={`font-semibold ${!hasSelection ? 'text-gray-300' : ''}`}>
          {infoTitle}
        </h3>
        {infoDetails.map((detail, idx) => (
          <p key={idx} className={`text-xs ${!hasSelection ? 'text-gray-300' : 'text-gray-600'}`}>
            {detail}
          </p>
        ))}
      </div>

      {/* Columna derecha: Botones e Input */}
      <div className="inspector-right">
        {/* Sección de botones - siempre visible */}
        <div className="buttons-section">
          {selectedItem && (
            <>
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
                Eliminar
              </button>
            </>
          )}

          {selectedShape && (
            <>
              <button
                onClick={() => updateShape(selectedShape.id, { hasBorder: !selectedShape.hasBorder })}
                className={`btn ${selectedShape.hasBorder ? 'btn-active' : 'btn-inactive'}`}
              >
                {selectedShape.hasBorder ? '✓ Resaltado' : 'Resaltado'}
              </button>

              {percentageOptions.map(percentage => (
                <button
                  key={percentage}
                  onClick={() => toggleShapePercentage(selectedShape.id, percentage)}
                  className={`btn ${(selectedShape.percentages || []).includes(percentage) ? 'btn-active' : 'btn-inactive'}`}
                >
                  {(selectedShape.percentages || []).includes(percentage) ? '✓ ' : ''}{percentage}%
                </button>
              ))}

              <button
                onClick={() => deleteShape(selectedShape.id)}
                className="btn btn-danger"
              >
                Eliminar
              </button>
            </>
          )}

          {!hasSelection && (
            <>
              <button disabled className="btn btn-inactive opacity-50">
                Resaltado
              </button>
              {percentageOptions.map(percentage => (
                <button
                  key={percentage}
                  disabled
                  className="btn btn-inactive opacity-50"
                >
                  {percentage}%
                </button>
              ))}
              <button disabled className="btn btn-danger opacity-50">
                Eliminar
              </button>
            </>
          )}
        </div>

        {/* Input de texto - siempre visible */}
        <input
          type="text"
          value={editText}
          onChange={(e) => {
            if (selectedShape) {
              setEditText(e.target.value)
              updateShape(selectedShape.id, { text: e.target.value })
            }
          }}
          onKeyDown={(e) => {
            if (e.key === 'Enter') {
              onEditingShapeChange?.(null)
            } else if (e.key === 'Escape') {
              if (selectedShape) {
                setEditText(selectedShape.text)
              }
              onEditingShapeChange?.(null)
            }
          }}
          onBlur={() => onEditingShapeChange?.(null)}
          autoFocus={editingShapeId !== null}
          disabled={!selectedShape}
          placeholder={selectedShape ? 'Editar texto...' : 'Selecciona una forma para editar'}
          className="inspector-input"
        />
      </div>
    </div>
  )
}
