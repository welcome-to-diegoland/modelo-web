# Modelo Web MVP 🎯

Editor visual para acomodar bloques de imagen en dos páginas carta verticales con drag & drop, selección y persistencia de estado.

## ✅ Features del MVP

### Layout
- ✓ Dos páginas carta verticales (A4) lado a lado
- ✓ Espacio gris libre a izquierda y derecha
- ✓ Header superior fijo con información
- ✓ Panel inferior con info de imagen seleccionada

### Imágenes / Bloques
- ✓ Carga desde JSON
- ✓ Drag libre (pueden encimarse)
- ✓ Se pueden mover dentro de la página
- ✓ Se pueden mover fuera (zona gris)
- ✓ Se pueden pasar entre páginas

### Interacción
- ✓ Click para seleccionar
- ✓ Borde azul visible cuando está seleccionada
- ✓ Panel inferior muestra metadata
- ✓ Botón para toggle de borde
- ✓ Botón para eliminar imagen

### Estado & Persistencia
- ✓ Todo vive en JSON (data/images.json)
- ✓ Guardado automático en localStorage
- ✓ Cargas al refrescar

## ❌ Fuera del MVP (próximas fases)
- Zoom
- Snap a guías
- Validación de colisiones
- Export PDF
- Multiusuario
- Historial / undo
- IA

## 📦 Stack Técnico

- **React 18** - UI
- **TypeScript** - Tipado
- **Zustand** - Estado global
- **Konva** - Rendering gráfico
- **React-Konva** - Binding React
- **use-image** - Carga de imágenes en Konva

## 📁 Estructura

```
src/
├─ app/
│   ├─ App.tsx           ← Componente raíz
│   ├─ App.css           ← Estilos
│   ├─ store.ts          ← Estado global (Zustand)
│   └─ types.ts          ← Tipos TypeScript
│
├─ components/
│   ├─ HeaderTools.tsx   ← Header superior
│   ├─ Workspace.tsx     ← Layout general
│   ├─ PageCanvas.tsx    ← Canvas Konva
│   ├─ ImageItem.tsx     ← Bloque draggable
│   └─ InspectorPanel.tsx ← Panel info
│
├─ data/
│   ├─ images.json       ← Datos de bloques
│   └─ initialLayout.ts  ← Layout inicial
│
├─ layout/
│   ├─ autoLayout.ts     ← Algoritmos
│   └─ mmToPx.ts        ← Conversiones
│
├─ index.css
├─ main.tsx
└─ ...
```

## 🚀 Instalación y Setup

```bash
# 1. Instalar dependencias
npm install

# 2. Instalar dependencias específicas del MVP
npm install react-konva konva use-image zustand

# 3. Dev server
npm run dev

# 4. Build
npm run build
```

## 💾 Cómo Funciona el Estado

### Store (Zustand)
```typescript
type Store = {
  items: Item[]              // Array de imágenes
  selectedId: string | null  // ID de imagen seleccionada
  selectItem(id)             // Seleccionar imagen
  moveItem(id, x, y)         // Mover imagen
  initializeItems(items)     // Cargar datos
  deleteItem(id)             // Eliminar imagen
  toggleItemBorder(id)       // Toggle borde
}
```

### Persistencia
- Al iniciar: carga desde `localStorage['modelo-document']`
- Al mover/editar: guarda automáticamente en localStorage
- Botón "Limpiar": borra todo (no se puede deshacer)

## 🎨 Tipos de Datos

```typescript
type Item = {
  id: string           // ID único
  x: number            // Posición X en píxeles
  y: number            // Posición Y en píxeles
  width: number        // Ancho en píxeles
  height: number       // Alto en píxeles
  page: number         // 1 o 2
  imageUrl: string     // URL de la imagen
  title?: string       // Nombre (opcional)
  hasBorder?: boolean  // Tiene borde (opcional)
}

type Page = {
  id: number     // 1 o 2
  width: number  // 400px (A4 vertical)
  height: number // 563px (A4 vertical)
}
```

## 🎯 Clave de la Arquitectura

**Principio fundamental:** Nada está "pegado" al canvas.

- El JSON es la **verdad absoluta**
- El canvas es solo una **vista**
- Todo cambio va al estado → localStorage
- Al refrescar: se recarga desde localStorage

## 🔧 Funciones Auxiliares

### mmToPx.ts
```typescript
mmToPx(210)      // 210mm → ~794px
pxToMm(794)      // ~210mm
A4_WIDTH_PX      // 794px
A4_HEIGHT_PX     // 1123px
```

### autoLayout.ts
```typescript
autoLayoutItems(items, width, height)  // Distribuye automáticamente
hasCollision(item1, item2)             // Detecta colisiones
getCollidingItems(item, allItems)      // Items que chocan
```

## 📱 Responsive

- Desktop: 2 páginas lado a lado
- Tablet: páginas apiladas
- Mobile: página única

## 🐛 Debug

Para ver el estado en consola:
```javascript
// En consola del navegador
localStorage.getItem('modelo-document')
```

Para resetear todo:
```javascript
localStorage.removeItem('modelo-document')
location.reload()
```

## 📝 Próximos Pasos (Roadmap)

1. **Phase 2:** Snap a guías (ayuda de alineación)
2. **Phase 3:** Zoom + pan
3. **Phase 4:** Export PDF
4. **Phase 5:** Colisiones automáticas
5. **Phase 6:** Historial (undo/redo)
6. **Phase 7:** Multiusuario con backend

---

**Hecho con ❤️ - MVP v1.0**