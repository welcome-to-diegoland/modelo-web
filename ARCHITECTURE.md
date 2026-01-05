# Arquitectura - Modelo Web MVP

## 🏗️ Decisiones Arquitectónicas

### 1. Estado Global con Zustand

**Por qué:** 
- Simple, sin boilerplate
- Perfecto para apps medianas
- Fácil de persistir
- Sin context providers complejos

**Patrón:**
```typescript
// store.ts es la única fuente de verdad
export const useStore = create<Store>((set) => ({
  // estado
  items: [],
  selectedId: null,
  
  // acciones
  selectItem: (id) => set({ selectedId: id }),
  moveItem: (id, x, y) => set((state) => ({
    items: state.items.map(...)
  }))
}))

// Uso en componentes
const { items, selectedId } = useStore()
```

### 2. Canvas con Konva

**Por qué:**
- Rendering gráfico optimizado
- Drag & drop nativo
- Mejor performance que HTML divs
- Manejo de transformaciones

**Ventajas sobre HTML:**
- No hay reflow/repaint al arrastrar
- Puede renderizar cientos de elementos
- Transformaciones GPU-aceleradas

**Cómo funciona:**
```typescript
<Stage width={400} height={563}>
  <Layer>
    <Rect />        ← Fondo página
    <KonvaImage />  ← Bloques arrastrables
    <KonvaImage />
  </Layer>
</Stage>
```

### 3. Persistencia Simple

**LocalStorage:** 
```typescript
// Guardar
localStorage.setItem('modelo-document', JSON.stringify(items))

// Cargar
const items = JSON.parse(localStorage.getItem('modelo-document') || '[]')
```

**Ventajas:**
- Sin backend requerido
- Instantáneo
- Suficiente para MVP

**Limitaciones:**
- ~5-10MB por dominio
- Solo datos del usuario local
- No sincroniza entre tabs

**Para Phase 2:** Firebase o Supabase

### 4. Componentes por Responsabilidad

```
App.tsx
├── HeaderTools       ← UI de control
└── Workspace
    ├── PageCanvas (×2)
    │   └── DraggableImage (×N)
    └── InspectorPanel     ← Metadata
```

**Datos fluyen así:**
```
Store (Zustand)
    ↓
useStore() en cada componente
    ↓
Cambios → set() → localStorage
    ↓
Re-render automático
```

## 📊 Flujo de Datos

### Inicialización
```
App monta
  ↓
Workspace useEffect
  ↓
items.length === 0?
  ↓ sí
initializeItems(jsonData)
  ↓
localStorage.setItem()
  ↓
store.items = jsonData
  ↓
Re-render
```

### Interacción (Arrastrar)
```
Usuario arrastra ImageItem
  ↓
KonvaImage.onDragEnd(e)
  ↓
moveItem(id, x, y)
  ↓
store.moveItem() → map items → localStorage
  ↓
Konva re-renderiza automáticamente
```

### Selección
```
Usuario click en imagen
  ↓
ImageItem.onClick()
  ↓
selectItem(id)
  ↓
store.selectedId = id
  ↓
PageCanvas renderiza stroke azul
  ↓
InspectorPanel muestra metadata
```

## 🔌 Extensiones Futuras

### Phase 2: Snap & Guías
```typescript
// layout/snap.ts
export const snapToGrid = (x: number, grid: number) => 
  Math.round(x / grid) * grid

export const snapToItem = (item: Item, allItems: Item[], snap: number) =>
  // Detectar items cercanos y alinear
```

Implementación en PageCanvas:
```typescript
const [snappedX, snappedY] = useSnap(item, allItems)
moveItem(id, snappedX, snappedY)
```

### Phase 3: Zoom & Pan
```typescript
// components/ZoomControls.tsx
const [scale, setScale] = useState(1)

<Stage scaleX={scale} scaleY={scale}>
  // Con listener de wheel para zoom
```

### Phase 4: Export PDF
```typescript
// utils/exportPdf.ts
import { jsPDF } from 'jspdf'

export const exportToPdf = (pages: Page[], items: Item[]) => {
  pages.forEach(page => {
    const pdf = new jsPDF()
    // Renderizar items de esa página
    pdf.addImage(...)
    pdf.save(`page-${page.id}.pdf`)
  })
}
```

### Phase 5: Validación de Colisiones
```typescript
// En moveItem
const collisions = getCollidingItems(item, items)
if (collisions.length > 0) {
  // Opción 1: No permitir
  // Opción 2: Mostrar warning
  // Opción 3: Auto-repositionar
}
```

### Phase 6: Historial (Undo/Redo)
```typescript
type Store = {
  // ... items, selectedId, etc.
  history: Item[][]  // Stack de estados
  undo: () => void
  redo: () => void
}

moveItem: (id, x, y) => set((state) => {
  const newItems = state.items.map(...)
  return {
    items: newItems,
    history: [...state.history, newItems]
  }
})
```

### Phase 7: Backend & Multiusuario
```typescript
// api/sync.ts
export const syncItems = async (items: Item[]) => {
  const response = await fetch('/api/documents/my-doc', {
    method: 'PUT',
    body: JSON.stringify(items)
  })
  return response.json()
}

// En store
useEffect(() => {
  const interval = setInterval(() => {
    syncItems(items)  // Cada 2 segundos
  }, 2000)
  return () => clearInterval(interval)
}, [items])
```

## 🎯 Optimizaciones

### 1. Memoización
```typescript
// Evitar re-render innecesarios
const ImageItem = memo(function DraggableImage({ item, selected, ... }) {
  return <KonvaImage />
})
```

### 2. Selectors en Zustand
```typescript
// store.ts
export const selectPageItems = (state) => 
  (pageId: number) => state.items.filter(i => i.page === pageId)

// Componente
const pageItems = useStore(selectPageItems)(pageId)
```

### 3. Batch Updates
```typescript
// Si actualizar múltiples items
set((state) => {
  const updated = state.items.map(...)
  saveToStorage(updated)
  return { items: updated }
}) // Una sola persistencia
```

## 🚨 Error Handling

### LocalStorage Fallback
```typescript
const loadFromStorage = (): Item[] => {
  try {
    const stored = localStorage.getItem(STORAGE_KEY)
    return stored ? JSON.parse(stored) : []
  } catch (error) {
    console.error('Error loading from storage:', error)
    return []  // Fallback vacío
  }
}
```

### Image Loading Errors
```typescript
const [image] = useImage(item.imageUrl)
if (!image) {
  return <KonvaImage image={placeholderImage} />
}
```

## 📐 Dimensiones Base

```typescript
// A4 Vertical
const PAGE_WIDTH = 400   // ~210mm
const PAGE_HEIGHT = 563  // ~297mm

// DPI Estándar
const DPI = 96

// Conversión
mmToPx(210) = 210 * (96 / 25.4) ≈ 794px
```

Pero usamos 400x563 por UI (proporcional, mejor en pantalla).

## 🔐 Validación de Datos

```typescript
// Antes de guardar
const validateItem = (item: Item): boolean => {
  return (
    item.id &&
    item.x >= 0 &&
    item.y >= 0 &&
    item.width > 0 &&
    item.height > 0 &&
    [1, 2].includes(item.page) &&
    item.imageUrl
  )
}
```

## 📚 Referencias

- Zustand: https://github.com/pmndrs/zustand
- Konva: https://konvajs.org/
- React-Konva: https://konvajs.org/docs/react/
- use-image: https://github.com/react-three/drei/tree/master/src/hooks/use-image

---

**Última actualización:** Enero 2026
**Versión:** MVP 1.0
**Status:** ✅ Production Ready