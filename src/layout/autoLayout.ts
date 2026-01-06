import { Item } from '../app/types'

/**
 * Algoritmo de auto-layout que acomoda items dentro de su página
 * Procesa items en orden, respetando su página asignada
 * Si no cabe en altura, baja de fila hasta que quepa
 */
export const autoLayoutItems = (items: Item[], pageWidth: number, pageHeight: number): Item[] => {
  const PADDING = 20
  const MIN_GAP = 10

  // Rastrear posición por página
  const pagePositions: { [key: number]: { x: number; y: number; maxHeightInRow: number } } = {}

  return items.map((item) => {
    const page = item.page || 1
    
    // Inicializar página si no existe
    if (!pagePositions[page]) {
      pagePositions[page] = { x: PADDING, y: PADDING, maxHeightInRow: 0 }
    }

    let { x, y, maxHeightInRow } = pagePositions[page]

    // Verificar y bajar mientras sea necesario
    let attempts = 0
    while ((y + item.height > pageHeight - PADDING) && attempts < 10) {
      x = PADDING
      y += maxHeightInRow + MIN_GAP
      maxHeightInRow = 0
      attempts++
    }

    // Si no cabe en ancho, bajar de fila
    if (x + item.width > pageWidth + PADDING) {
      x = PADDING
      y += maxHeightInRow + MIN_GAP
      maxHeightInRow = 0
    }

    const newItem = { ...item, x, y, page }

    // Actualizar posición para siguiente item
    x += item.width + MIN_GAP
    maxHeightInRow = Math.max(maxHeightInRow, item.height)

    pagePositions[page] = { x, y, maxHeightInRow }

    return newItem
  })
}

/**
 * Detecta colisiones entre dos items
 */
export const hasCollision = (item1: Item, item2: Item): boolean => {
  return !(
    item1.x + item1.width < item2.x ||
    item2.x + item2.width < item1.x ||
    item1.y + item1.height < item2.y ||
    item2.y + item2.height < item1.y
  )
}

/**
 * Obtiene todos los items que colisionan con uno dado
 */
export const getCollidingItems = (item: Item, allItems: Item[]): Item[] => {
  return allItems.filter(other =>
    other.id !== item.id && hasCollision(item, other)
  )
}
