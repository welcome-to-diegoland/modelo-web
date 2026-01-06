import { create } from 'zustand'
import { Item, Shape } from './types'

type Store = {
  items: Item[]
  shapes: Shape[]
  selectedId: string | null
  selectItem: (id: string | null) => void
  moveItem: (id: string, x: number, y: number) => void
  initializeItems: (items: Item[]) => void
  deleteItem: (id: string) => void
  toggleItemBorder: (id: string) => void
  toggleItemForros: (id: string) => void
  toggleItemPercentage: (id: string, percentage: number) => void
  addShape: (shape: Shape) => void
  deleteShape: (id: string) => void
  updateShape: (id: string, updates: Partial<Shape>) => void
  toggleShapeBorder: (id: string) => void
  toggleShapeForros: (id: string) => void
  toggleShapePercentage: (id: string, percentage: number) => void
  clearAllShapes: () => void
  clearEverything: () => void
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

  selectItem: (id) => set({ selectedId: id }),

  moveItem: (id, x, y) =>
    set((state) => {
      const updated = state.items.map(i =>
        i.id === id ? { ...i, x, y } : i
      )
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
    })
}))
