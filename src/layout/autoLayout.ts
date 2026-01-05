import { Item } from '../app/types'

/**
 * Algoritmo simple de auto-layout
 * Distribuye imágenes en una cuadrícula básica
 */
export const autoLayoutItems = (items: Item[], pageWidth: number, pageHeight: number): Item[] => {
  const PADDING = 20
  const MIN_GAP = 10

  let x = PADDING
  let y = PADDING
  let maxHeightInRow = 0

  return items.map((item) => {
    // Si no cabe en la fila actual, pasar a la siguiente
    if (x + item.width > pageWidth - PADDING) {
      x = PADDING
      y += maxHeightInRow + MIN_GAP
      maxHeightInRow = 0
    }

    // Si no cabe en la página, mover a siguiente página
    if (y + item.height > pageHeight - PADDING && item.page === 1) {
      return { ...item, page: 2, x: PADDING, y: PADDING }
    }

    const newItem = { ...item, x, y }
    x += item.width + MIN_GAP
    maxHeightInRow = Math.max(maxHeightInRow, item.height)

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
