import { create } from 'zustand'
import { Item } from './types'

type Store = {
  items: Item[]
  selectedId: string | null
  selectItem: (id: string | null) => void
  moveItem: (id: string, x: number, y: number) => void
  initializeItems: (items: Item[]) => void
  deleteItem: (id: string) => void
  toggleItemBorder: (id: string) => void
}

const STORAGE_KEY = 'modelo-document'

const loadFromStorage = (): Item[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch {
    return []
  }
}

const saveToStorage = (items: Item[]) => {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(items))
}

export const useStore = create<Store>((set) => ({
  items: loadFromStorage(),
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
    })
}))
