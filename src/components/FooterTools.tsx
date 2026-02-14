import { useState } from 'react'
import { useStore } from '../app/store'
import { LineData } from '../app/types'
import ImageEditModal from './ImageEditModal'

export default function FooterTools() {
  const { items, selectedId, updateItemLines } = useStore()
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editingImageUrl, setEditingImageUrl] = useState('')
  const [editingImageId, setEditingImageId] = useState('')
  const [existingLines, setExistingLines] = useState<LineData[]>([])

  const handleResumir = () => {
    if (!selectedId) {
      alert('Por favor selecciona una imagen primero')
      return
    }
    
    const selectedItem = items.find(item => item.id === selectedId)
    if (!selectedItem) {
      alert('No se encontró la imagen seleccionada')
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
    <>
      <footer className="footer-tools">
        <button
          onClick={handleResumir}
          className="btn btn-resumir"
          title="Resumir imagen seleccionada"
          disabled={!selectedId}
        >
          <i className="fa-solid fa-pen-to-square"></i> Resumir
        </button>
      </footer>

      <ImageEditModal
        isOpen={isEditModalOpen}
        imageUrl={editingImageUrl}
        imageId={editingImageId}
        existingLines={existingLines}
        onSave={handleSaveLines}
        onClose={() => setIsEditModalOpen(false)}
      />
    </>
  )
}
