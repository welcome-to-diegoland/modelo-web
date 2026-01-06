import { useState } from 'react'
import { useStore } from '../app/store'
import initialImages from '../data/images.json'
import '../styles/SearchProductModal.css'

type SearchProductModalProps = {
  isOpen: boolean
  activePage: number
  onClose: () => void
}

export default function SearchProductModal({ isOpen, activePage, onClose }: SearchProductModalProps) {
  const [searchQuery, setSearchQuery] = useState('')
  const [foundProduct, setFoundProduct] = useState<any>(null)
  const [notFound, setNotFound] = useState(false)
  const { items, initializeItems } = useStore()

  const handleSearch = () => {
    const query = searchQuery.trim().toLowerCase()
    if (!query) {
      setNotFound(true)
      setFoundProduct(null)
      return
    }

    // Buscar por itemCode o itemGroup
    const product = (initialImages as any[]).find(
      item => 
        item.itemCode.toLowerCase() === query || 
        item.itemGroup.toLowerCase() === query
    )

    if (product) {
      setFoundProduct(product)
      setNotFound(false)
    } else {
      setNotFound(true)
      setFoundProduct(null)
    }
  }

  const handleAccept = () => {
    if (foundProduct) {
      // Crear copia del producto sin el campo 'page' existente
      const newItem = {
        ...foundProduct,
        id: `${foundProduct.id}-${Date.now()}`, // ID único
        page: activePage,
        x: 10,
        y: 10
      }

      // Agregar a los items
      const updatedItems = [...items, newItem]
      initializeItems(updatedItems)
      
      // Cerrar modal y limpiar
      closeModal()
    }
  }

  const closeModal = () => {
    setSearchQuery('')
    setFoundProduct(null)
    setNotFound(false)
    onClose()
  }

  if (!isOpen) return null

  return (
    <div className="modal-overlay" onClick={closeModal}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h2>Buscar Producto</h2>
          <button className="modal-close" onClick={closeModal}>✕</button>
        </div>

        <div className="modal-body">
          <div className="search-section">
            <label htmlFor="search-input">Código o Grupo de Producto:</label>
            <div className="search-input-group">
              <input
                id="search-input"
                type="text"
                value={searchQuery}
                onChange={(e) => {
                  setSearchQuery(e.target.value)
                  setNotFound(false)
                  setFoundProduct(null)
                }}
                onKeyPress={(e) => e.key === 'Enter' && handleSearch()}
                placeholder="Ej: 78-010-040 o 194483"
                className="search-input"
              />
              <button className="btn-search" onClick={handleSearch}>Buscar</button>
            </div>
          </div>

          {notFound && (
            <div className="error-message">
              ❌ Producto no encontrado
            </div>
          )}

          {foundProduct && (
            <div className="product-preview">
              <img src={foundProduct.imageUrl} alt={foundProduct.title} />
              <div className="product-info">
                <p><strong>Título:</strong> {foundProduct.title}</p>
                <p><strong>Marca:</strong> {foundProduct.brand}</p>
                <p><strong>Código:</strong> {foundProduct.itemCode}</p>
                <p><strong>Grupo:</strong> {foundProduct.itemGroup}</p>
                <p><strong>Se agregará a:</strong> Página {activePage}</p>
              </div>
            </div>
          )}
        </div>

        <div className="modal-footer">
          <button className="btn-cancel" onClick={closeModal}>Cancelar</button>
          <button 
            className="btn-accept" 
            onClick={handleAccept}
            disabled={!foundProduct}
          >
            Aceptar
          </button>
        </div>
      </div>
    </div>
  )
}
