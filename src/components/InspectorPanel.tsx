import { useState, useEffect, useRef } from 'react'
import { useStore } from '../app/store'
import { LineData } from '../app/types'
import ImageEditModal from './ImageEditModal'

type InspectorPanelProps = {
  editingShapeId?: string | null
  onEditingShapeChange?: (id: string | null) => void
}

export default function InspectorPanel({ editingShapeId, onEditingShapeChange }: InspectorPanelProps) {
  const { items, shapes, selectedId, toggleItemBorder, toggleItemForros, deleteItem, toggleItemPercentage, updateShape, deleteShape, toggleShapeBorder, toggleShapeForros, toggleShapePercentage, updateItemLines } = useStore()
  const [editText, setEditText] = useState('')
  const inputRef = useRef<HTMLInputElement>(null)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingImageUrl, setEditingImageUrl] = useState('')
  const [editingImageId, setEditingImageId] = useState('')
  const [existingLines, setExistingLines] = useState<LineData[]>([])

  const selectedItem = items.find(i => i.id === selectedId)
  const selectedShape = shapes.find(s => s.id === selectedId)
  const editingShape = editingShapeId ? shapes.find(s => s.id === editingShapeId) : null

  // Actualizar editText cuando cambia editingShape
  useEffect(() => {
    if (editingShape) {
      setEditText(editingShape.text)
      // Auto-focus en el input cuando editingShapeId cambia
      setTimeout(() => {
        inputRef.current?.focus()
      }, 0)
    }
  }, [editingShape, editingShapeId])

  // Determinar si hay algo seleccionado
  const hasSelection = selectedItem || selectedShape
  const isShape = selectedShape !== undefined

  // Información para mostrar
  const infoTitle = selectedItem?.title || (selectedShape ? 'Forma' : 'Nada seleccionado')
  const infoDetails = selectedItem 
    ? [
        `Marca: ${selectedItem.brand || 'Sin marca'}`,
        `Item Code: ${selectedItem.itemCode || 'N/A'}`,
        `Item Group: ${selectedItem.itemGroup || 'N/A'}`
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

  const handleResumir = () => {
    if (!selectedId || !selectedItem) {
      return
    }
    
    setEditingImageUrl(selectedItem.imageUrl)
    setEditingImageId(selectedItem.id)
    setExistingLines(selectedItem.lines || [])
    setIsEditModalOpen(true)
  }

  const handleSaveLines = (lines: LineData[]) => {
    if (editingImageId) {
      updateItemLines(editingImageId, lines)
    }
    setIsEditModalOpen(false)
    setEditingImageUrl('')
    setEditingImageId('')
    setExistingLines([])
  }

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

              <button
                onClick={() => toggleItemForros(selectedItem.id)}
                className={`btn ${selectedItem.hasForros ? 'btn-active' : 'btn-inactive'}`}
              >
                {selectedItem.hasForros ? '✓ Forros' : 'Forros'}
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

              <button
                onClick={handleResumir}
                className="btn btn-primary"
              >
                Resumir
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

              <button
                onClick={() => toggleShapeForros(selectedShape.id)}
                className={`btn ${selectedShape.hasForros ? 'btn-active' : 'btn-inactive'}`}
              >
                {selectedShape.hasForros ? '✓ Forros' : 'Forros'}
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
              <button disabled className="btn btn-inactive opacity-50">
                Forros
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
          ref={inputRef}
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
          disabled={!selectedShape}
          className="inspector-input"
        />
      </div>

      <ImageEditModal
        isOpen={isEditModalOpen}
        imageUrl={editingImageUrl}
        imageId={editingImageId}
        existingLines={existingLines}
        onSave={handleSaveLines}
        onClose={() => setIsEditModalOpen(false)}
      />
    </div>
  )
}
