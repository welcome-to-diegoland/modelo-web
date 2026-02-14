# Modelo Web 🎯

Editor visual para organizar layouts de catálogos de productos con drag & drop, anotaciones y herramientas de edición.

## ✨ Características

### Layout y Páginas
- ✓ Múltiples páginas carta verticales (A4)
- ✓ Drag & drop libre entre páginas
- ✓ Espacios grises libres a los lados
- ✓ Auto-layout inteligente (3 modos)

### Gestión de Imágenes
- ✓ Carga desde JSON
- ✓ Búsqueda de productos
- ✓ Drag libre (pueden sobreponerse)
- ✓ Movimiento entre páginas
- ✓ Eliminación individual

### Marcadores y Descuentos
- ✓ **Resaltado**: Marca productos importantes (círculo verde con "!")
- ✓ **Forros**: Indica forros especiales (círculo amarillo con "F")
- ✓ **Descuentos**: Porcentajes 10%, 15%, 20%, 40%, 50% (círculos rojos)

### Feature "Resumir" ⭐ NUEVO
- ✓ Herramienta para marcar áreas de imagen que no se quieren
- ✓ Líneas rectas rosas sobre la imagen
- ✓ Click punto inicial → Click punto final
- ✓ No modifica imagen original (overlay vectorial)
- ✓ Se puede editar después (agregar más líneas)

### Estado y Persistencia
- ✓ Guardado automático en localStorage
- ✓ Recarga al refrescar navegador
- ✓ Botón para resetear desde JSON original

## 🚀 Inicio Rápido

```bash
# Instalar dependencias
npm install

# Iniciar servidor de desarrollo
npm run dev

# Abrir en navegador
http://localhost:5173
```

## 📦 Stack Técnico

- **React 18** + **TypeScript** - UI y tipado fuerte
- **Zustand** - Estado global simplificado
- **Konva + React-Konva** - Canvas de alto rendimiento
- **Vite** - Build tool ultrarrápido
- **use-image** - Carga optimizada de imágenes

## 🎮 Uso

### Seleccionar Imagen
Click en cualquier imagen para seleccionarla (borde azul)

### Mover Imagen  
Arrastra con el mouse. Puede moverse entre páginas libremente.

### Marcar Productos
Panel inferior cuando hay imagen seleccionada:
- **Resaltado**: Producto importante
- **Forros**: Tiene forros especiales
- **10-50%**: Descuentos disponibles

### Resumir Imagen
1. Selecciona una imagen
2. Click en botón **"Resumir"** (panel inferior)
3. En el modal, click en **"Raya"**
4. Click en punto inicial, luego en punto final → línea recta rosa
5. Repite para más líneas
6. Click en **"Guardar"** para aplicar

### Auto-Layout
Botones en header:
- **Auto 1**: Ordena página actual (cambia entre 3 modos)
- **Auto All**: Ordena todas las páginas simultáneamente

### Buscar Productos
Click en **"Buscar"** para abrir catálogo y agregar nuevos productos

## 📁 Estructura del Proyecto

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