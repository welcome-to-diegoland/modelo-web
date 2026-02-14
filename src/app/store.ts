import { create } from 'zustand'
import { Item, Shape, LineData } from './types'
import { CONFIG, getPageHeight, getPageFromYPosition, getRelativeYInPage } from './config'

type Store = {
  items: Item[]
  shapes: Shape[]
  selectedId: string | null
  layoutMode: 1 | 2 | 3
  zoom: number
  selectItem: (id: string | null) => void
  moveItem: (id: string, x: number, y: number) => void
  initializeItems: (items: Item[]) => void
  deleteItem: (id: string) => void
  toggleItemBorder: (id: string) => void
  toggleItemForros: (id: string) => void
  toggleItemPercentage: (id: string, percentage: number) => void
  updateItemImage: (id: string, imageUrl: string) => void
  updateItemLines: (id: string, lines: LineData[]) => void
  addShape: (shape: Shape) => void
  deleteShape: (id: string) => void
  updateShape: (id: string, updates: Partial<Shape>) => void
  toggleShapeBorder: (id: string) => void
  toggleShapeForros: (id: string) => void
  toggleShapePercentage: (id: string, percentage: number) => void
  clearAllShapes: () => void
  clearEverything: () => void
  cycleLayoutMode: () => void
  setZoom: (zoom: number) => void
  autoLayoutPage: (pageId: number, pageWidth: number, pageHeight: number, pageX: number, pageY: number) => void
  autoLayoutAllPages: (pageWidth: number, pageHeight: number) => void
}

const STORAGE_KEY = 'modelo-document'
const SHAPES_KEY = 'modelo-shapes'

const loadFromStorage = (): Item[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const loadShapesFromStorage = (): Shape[] => {
  try {
    const stored = localStorage.getItem(SHAPES_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveToStorage = (items: Item[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

const saveShapesToStorage = (shapes: Shape[]) => {
  localStorage.setItem(SHAPES_KEY, JSON.stringify(shapes))
}

export const useStore = create<Store>((set) => ({
  items: loadFromStorage(),
  shapes: loadShapesFromStorage(),
  selectedId: null,
  layoutMode: 1,
  zoom: 0.8,

  selectItem: (id) => set({ selectedId: id }),

  cycleLayoutMode: () =>
    set((state) => {
      const nextMode = state.layoutMode === 3 ? 1 : (state.layoutMode + 1) as 1 | 2 | 3
      return { layoutMode: nextMode }
    }),

  setZoom: (zoom) => set({ zoom }),

  moveItem: (id, x, y) =>
    set((state) => {
      const pageHeight = getPageHeight(CONFIG.PAGE_WIDTH_PX)
      const pageGap = CONFIG.PAGE_GAP_PX
      
      const updated = state.items.map(i => {
        if (i.id === id) {
          // Calcular Y global basado en la página actual
          let yGlobal = y
          for (let p = 1; p < i.page; p++) {
            yGlobal += pageHeight + pageGap
          }
          
          // Determinar nueva página basada en Y global
          const newPage = getPageFromYPosition(yGlobal, pageHeight, pageGap)
          
          // Convertir a coordenadas relativas de la nueva página
          const newY = getRelativeYInPage(yGlobal, newPage, pageHeight, pageGap)
          
          return { ...i, x, y: newY, page: newPage }
        }
        return i
      })
      saveToStorage(updated)
      return { items: updated }
    }),

  initializeItems: (items) => {
    saveToStorage(items)
    set({ items })
  },

  deleteItem: (id) =>
    set((state) => {
      const updated = state.items.filter(i => i.id !== id)
      saveToStorage(updated)
      return { items: updated, selectedId: null }
    }),

  toggleItemBorder: (id) =>
    set((state) => {
      const updated = state.items.map(i =>
        i.id === id ? { ...i, hasBorder: !i.hasBorder } : i
      )
      saveToStorage(updated)
      return { items: updated }
    }),

  toggleItemForros: (id) =>
    set((state) => {
      const updated = state.items.map(i =>
        i.id === id ? { ...i, hasForros: !i.hasForros } : i
      )
      saveToStorage(updated)
      return { items: updated }
    }),

  toggleItemPercentage: (id, percentage) =>
    set((state) => {
      const updated = state.items.map(i => {
        if (i.id === id) {
          const current = i.percentages || []
          // Si ya tiene este porcentaje, lo deselecciona (vacía el array)
          // Si tiene otro, lo reemplaza
          // Si no tiene ninguno, lo agrega
          const newPercentages = current.includes(percentage) ? [] : [percentage]
          return { ...i, percentages: newPercentages }
        }
        return i
      })
      saveToStorage(updated)
      return { items: updated }
    }),

  updateItemImage: (id, imageUrl) =>
    set((state) => {
      const updated = state.items.map(i =>
        i.id === id ? { ...i, imageUrl, imageVersion: Date.now() } : i
      )
      saveToStorage(updated)
      return { items: updated }
    }),

  updateItemLines: (id, lines) =>
    set((state) => {
      const updated = state.items.map(i =>
        i.id === id ? { ...i, lines } : i
      )
      saveToStorage(updated)
      return { items: updated }
    }),

  addShape: (shape) =>
    set((state) => {
      const updated = [...state.shapes, shape]
      saveShapesToStorage(updated)
      return { shapes: updated }
    }),

  deleteShape: (id) =>
    set((state) => {
      const updated = state.shapes.filter(s => s.id !== id)
      saveShapesToStorage(updated)
      return { shapes: updated, selectedId: null }
    }),

  updateShape: (id, updates) =>
    set((state) => {
      const updated = state.shapes.map(s =>
        s.id === id ? { ...s, ...updates } : s
      )
      saveShapesToStorage(updated)
      return { shapes: updated }
    }),

  toggleShapeBorder: (id) =>
    set((state) => {
      const updated = state.shapes.map(s =>
        s.id === id ? { ...s, hasBorder: !s.hasBorder } : s
      )
      saveShapesToStorage(updated)
      return { shapes: updated }
    }),

  toggleShapeForros: (id) =>
    set((state) => {
      const updated = state.shapes.map(s =>
        s.id === id ? { ...s, hasForros: !s.hasForros } : s
      )
      saveShapesToStorage(updated)
      return { shapes: updated }
    }),

  toggleShapePercentage: (id, percentage) =>
    set((state) => {
      const updated = state.shapes.map(s => {
        if (s.id === id) {
          const current = s.percentages || []
          const newPercentages = current.includes(percentage) ? [] : [percentage]
          return { ...s, percentages: newPercentages }
        }
        return s
      })
      saveShapesToStorage(updated)
      return { shapes: updated }
    }),

  clearAllShapes: () =>
    set(() => {
      saveShapesToStorage([])
      return { shapes: [], selectedId: null }
    }),

  clearEverything: () =>
    set(() => {
      saveToStorage([])
      saveShapesToStorage([])
      return { items: [], shapes: [], selectedId: null }
    }),

  autoLayoutPage: (pageId, pageWidth, pageHeight, pageX, pageY) =>
    set((state) => {
      const rowItems = state.items.filter(i => {
        return i.y >= 0 && i.y < pageHeight && i.page === pageId
      })
      
      if (rowItems.length === 0) return state

      const padding = 10
      const contentWidth = pageWidth - padding * 2  // 580px para página de 600px
      const GAP = 5
      const mode = state.layoutMode

      let sortedItems: Item[] = [...rowItems]

      // MODO 2: Ordenar por altura descendente
      if (mode === 2) {
        sortedItems.sort((a, b) => b.height - a.height)
      }
      // MODO 3: Ordenar por ancho descendente (intenta llenar mejor)
      else if (mode === 3) {
        sortedItems.sort((a, b) => b.width - a.width)
      }
      // MODO 1: Sin orden especial

      // Agrupar en filas
      const rows: Item[][] = []
      let currentRow: Item[] = []
      let currentRowWidth = 0

      for (const item of sortedItems) {
        const itemWidth = item.width
        const wouldFit = currentRowWidth === 0 || (currentRowWidth + itemWidth + GAP <= contentWidth)
        
        if (wouldFit) {
          currentRow.push(item)
          currentRowWidth += itemWidth + (currentRow.length > 1 ? GAP : 0)
        } else {
          if (currentRow.length > 0) {
            rows.push([...currentRow])
          }
          currentRow = [item]
          currentRowWidth = itemWidth
        }
      }
      
      if (currentRow.length > 0) {
        rows.push([...currentRow])
      }

      // Calcular qué cabe en la página blanca vs qué va al gris
      let currentY = padding
      const placedItems: Set<string> = new Set()
      const rowsToPlace: { row: Item[], y: number }[] = []
      const overflowByRow: Map<Item[], Item[]> = new Map() // Track overflow items by row
      const allOverflowItems: Item[] = [] // Colectar todos los items overflow

      for (const row of rows) {
        const rowHeight = Math.max(...row.map(i => i.height))
        
        if (currentY + rowHeight <= pageHeight - padding) {
          // Cabe en la página
          rowsToPlace.push({ row, y: currentY })
          row.forEach(item => placedItems.add(item.id))
          currentY += rowHeight + GAP
        } else {
          // Este renglón no cabe, todos sus items van al gris
          const overflowItems = row.filter(item => !placedItems.has(item.id))
          overflowByRow.set(row, overflowItems)
          allOverflowItems.push(...overflowItems)
        }
      }

      // Organizar todos los items overflow en filas verticales dentro del gris
      const overflowRows: Item[][] = []
      let overflowCurrentRow: Item[] = []
      let overflowCurrentWidth = 0
      const grayContentWidth = 1800 - pageWidth - 20 // Ancho disponible en gris

      for (const overflowItem of allOverflowItems) {
        const itemWidth = overflowItem.width
        const wouldFit = overflowCurrentWidth === 0 || (overflowCurrentWidth + itemWidth + GAP <= grayContentWidth)
        
        if (wouldFit) {
          overflowCurrentRow.push(overflowItem)
          overflowCurrentWidth += itemWidth + (overflowCurrentRow.length > 1 ? GAP : 0)
        } else {
          if (overflowCurrentRow.length > 0) {
            overflowRows.push([...overflowCurrentRow])
          }
          overflowCurrentRow = [overflowItem]
          overflowCurrentWidth = itemWidth
        }
      }
      
      if (overflowCurrentRow.length > 0) {
        overflowRows.push([...overflowCurrentRow])
      }

      // Crear mapa de item ID a su posición en overflow
      const overflowPositions: Map<string, { x: number, y: number }> = new Map()
      let overflowY = padding

      for (const overflowRow of overflowRows) {
        const overflowRowHeight = Math.max(...overflowRow.map(i => i.height))
        
        // Verificar que no se salga del renglón
        if (overflowY + overflowRowHeight > pageHeight - padding) {
          break // No cabe más verticalmente
        }

        let overflowX = pageWidth + 10
        for (const overflowItem of overflowRow) {
          overflowPositions.set(overflowItem.id, { x: overflowX, y: overflowY })
          overflowX += overflowItem.width + GAP
        }

        overflowY += overflowRowHeight + GAP
      }

      // Actualizar positions - preservar page y actualizar solo x, y
      const updated = state.items.map((item) => {
        // Solo procesar items de la página específica
        if (!rowItems.find(r => r.id === item.id)) {
          return item
        }

        // Si está en rowsToPlace, posicionar en página (parte blanca)
        for (const { row, y } of rowsToPlace) {
          const itemInRow = row.find(i => i.id === item.id)
          if (itemInRow) {
            let x = padding
            for (const rowItem of row) {
              if (rowItem.id === item.id) {
                return { ...item, x, y, page: pageId }
              }
              x += rowItem.width + GAP
            }
          }
        }

        // Si está en overflow, usar las posiciones pre-calculadas
        const overflowPos = overflowPositions.get(item.id)
        if (overflowPos) {
          return { ...item, x: overflowPos.x, y: overflowPos.y, page: pageId }
        }
        
        return item
      })

      saveToStorage(updated)
      return { items: updated }
    }),

  autoLayoutAllPages: (pageWidth, pageHeight) =>
    set((state) => {
      let updated = [...state.items]

      // Aplicar autoLayout a cada página usando la misma lógica de autoLayoutPage
      for (let pageId = 1; pageId <= CONFIG.TOTAL_PAGES; pageId++) {
        const rowItems = updated.filter(i => {
          return i.y >= 0 && i.y < pageHeight && i.page === pageId
        })
        
        if (rowItems.length === 0) continue

        const padding = 10
        const contentWidth = pageWidth - padding * 2  // 580px para página de 600px
        const GAP = 5
        const mode = state.layoutMode

        let sortedItems: Item[] = [...rowItems]

        // MODO 2: Ordenar por altura descendente
        if (mode === 2) {
          sortedItems.sort((a, b) => b.height - a.height)
        }
        // MODO 3: Ordenar por ancho descendente (intenta llenar mejor)
        else if (mode === 3) {
          sortedItems.sort((a, b) => b.width - a.width)
        }
        // MODO 1: Sin orden especial

        // Agrupar en filas
        const rows: Item[][] = []
        let currentRow: Item[] = []
        let currentRowWidth = 0

        for (const item of sortedItems) {
          const itemWidth = item.width
          const wouldFit = currentRowWidth === 0 || (currentRowWidth + itemWidth + GAP <= contentWidth)
          
          if (wouldFit) {
            currentRow.push(item)
            currentRowWidth += itemWidth + (currentRow.length > 1 ? GAP : 0)
          } else {
            if (currentRow.length > 0) {
              rows.push([...currentRow])
            }
            currentRow = [item]
            currentRowWidth = itemWidth
          }
        }
        
        if (currentRow.length > 0) {
          rows.push([...currentRow])
        }

        // Calcular qué cabe en la página blanca vs qué va al gris
        let currentY = padding
        const placedItems: Set<string> = new Set()
        const rowsToPlace: { row: Item[], y: number }[] = []
        const allOverflowItems: Item[] = []

        for (const row of rows) {
          const rowHeight = Math.max(...row.map(i => i.height))
          
          if (currentY + rowHeight <= pageHeight - padding) {
            // Cabe en la página
            rowsToPlace.push({ row, y: currentY })
            row.forEach(item => placedItems.add(item.id))
            currentY += rowHeight + GAP
          } else {
            // Este renglón no cabe, todos sus items van al gris
            const overflowItems = row.filter(item => !placedItems.has(item.id))
            allOverflowItems.push(...overflowItems)
          }
        }

        // Organizar todos los items overflow en filas verticales dentro del gris
        const overflowRows: Item[][] = []
        let overflowCurrentRow: Item[] = []
        let overflowCurrentWidth = 0
        const grayContentWidth = 1800 - pageWidth - 20 // Ancho disponible en gris

        for (const overflowItem of allOverflowItems) {
          const itemWidth = overflowItem.width
          const wouldFit = overflowCurrentWidth === 0 || (overflowCurrentWidth + itemWidth + GAP <= grayContentWidth)
          
          if (wouldFit) {
            overflowCurrentRow.push(overflowItem)
            overflowCurrentWidth += itemWidth + (overflowCurrentRow.length > 1 ? GAP : 0)
          } else {
            if (overflowCurrentRow.length > 0) {
              overflowRows.push([...overflowCurrentRow])
            }
            overflowCurrentRow = [overflowItem]
            overflowCurrentWidth = itemWidth
          }
        }
        
        if (overflowCurrentRow.length > 0) {
          overflowRows.push([...overflowCurrentRow])
        }

        // Crear mapa de item ID a su posición en overflow
        const overflowPositions: Map<string, { x: number, y: number }> = new Map()
        let overflowY = padding

        for (const overflowRow of overflowRows) {
          const overflowRowHeight = Math.max(...overflowRow.map(i => i.height))
          
          // Verificar que no se salga del renglón
          if (overflowY + overflowRowHeight > pageHeight - padding) {
            break // No cabe más verticalmente
          }

          let overflowX = pageWidth + 10
          for (const overflowItem of overflowRow) {
            overflowPositions.set(overflowItem.id, { x: overflowX, y: overflowY })
            overflowX += overflowItem.width + GAP
          }

          overflowY += overflowRowHeight + GAP
        }

        // Actualizar positions para esta página
        updated = updated.map((item) => {
          // Solo procesar items de la página específica
          if (!rowItems.find(r => r.id === item.id)) {
            return item
          }

          // Si está en rowsToPlace, posicionar en página (parte blanca)
          for (const { row, y } of rowsToPlace) {
            const itemInRow = row.find(i => i.id === item.id)
            if (itemInRow) {
              let x = padding
              for (const rowItem of row) {
                if (rowItem.id === item.id) {
                  return { ...item, x, y, page: pageId }
                }
                x += rowItem.width + GAP
              }
            }
          }

          // Si está en overflow, usar las posiciones pre-calculadas
          const overflowPos = overflowPositions.get(item.id)
          if (overflowPos) {
            return { ...item, x: overflowPos.x, y: overflowPos.y, page: pageId }
          }
          
          return item
        })
      }

      saveToStorage(updated)
      return { items: updated }
    }),
}))