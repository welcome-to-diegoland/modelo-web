import { Item, Page } from '../app/types'

export const PAGES: Page[] = [
  {
    id: 1,
    width: 400,
    height: 563
  },
  {
    id: 2,
    width: 400,
    height: 563
  }
]

// MARGIN_WIDTH = 80
// PAGE_WIDTH = 400
// Canvas unificado: 80 + 400 + 400 + 80 = 960
// Página 1: x = 80 to 480
// Página 2: x = 480 to 880

export const INITIAL_ITEMS: Item[] = [
  {
    id: 'img-1',
    x: 0,
    y: 0,
    width: 150,
    height: 150,
    page: 1,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=300&h=300&fit=crop',
    title: 'Mountain Landscape',
    hasBorder: false
  },
  {
    id: 'img-2',
    x: 0,
    y: 0,
    width: 120,
    height: 180,
    page: 1,
    imageUrl: 'https://images.unsplash.com/photo-1469022563149-aa64dbd37dc0?w=300&h=400&fit=crop',
    title: 'Forest Scene',
    hasBorder: false
  },
  {
    id: 'img-3',
    x: 0,
    y: 0,
    width: 180,
    height: 120,
    page: 1,
    imageUrl: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=400&h=300&fit=crop',
    title: 'Ocean View',
    hasBorder: false
  },
  {
    id: 'img-4',
    x: 0,
    y: 0,
    width: 160,
    height: 160,
    page: 2,
    imageUrl: 'https://images.unsplash.com/photo-1470252649378-9c29740ff023?w=300&h=300&fit=crop',
    title: 'Desert Dunes',
    hasBorder: false
  },
  {
    id: 'img-5',
    x: 0,
    y: 0,
    width: 100,
    height: 200,
    page: 2,
    imageUrl: 'https://images.unsplash.com/photo-1495567720989-cebdbdd97913?w=300&h=500&fit=crop',
    title: 'City Lights',
    hasBorder: false
  }
]
