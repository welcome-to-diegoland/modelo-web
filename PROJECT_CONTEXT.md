# Modelo Web - Contexto del Proyecto

**Última actualización:** 14 de febrero, 2026

## 🎯 Objetivo Principal

Editor visual de layouts para catálogos de productos. Permite organizar imágenes de productos en páginas estilo carta con drag & drop, agregar anotaciones, descuentos, y marcar áreas para resumir/eliminar de las imágenes.

---

## 🏗️ Arquitectura Técnica

### Stack
- **React 18** + **TypeScript** - UI y tipado
- **Zustand** - Estado global (items, shapes, selectedId, zoom, etc.)
- **Konva + React-Konva** - Canvas para renderizado de imágenes y formas
- **Vite** - Build tool y dev server
- **use-image** - Hook para carga de imágenes en Konva

### Estructura de Datos

```typescript
// Item (Imagen de producto)
type Item = {
  id: string
  x, y: number              // Posición relativa a la página
  width, height: number
  page: number              // Página donde está (1, 2, 3, ...)
  imageUrl: string
  imageVersion?: number     // Para forzar recarga de cache
  lines?: LineData[]        // Líneas de "Resumir" (coordenadas normalizadas 0-1)
  title?: string
  brand?: string
  itemCode?: string
  hasBorder?: boolean       // Marcador verde de resaltado
  hasForros?: boolean       // Marcador amarillo "F"
  percentages?: number[]    // Descuentos rojos (10, 15, 20, 40, 50)
}

// Shape (Caja de texto)
type Shape = {
  id: string
  x, y: number
  width, height: number
  text: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  hasBorder?: boolean
  hasForros?: boolean
  percentages?: number[]
}

// LineData (Líneas para "Resumir")
type LineData = {
  id: string
  points: number[]  // [x1, y1, x2, y2] normalizados 0-1
}
```

### Sistema de Coordenadas

#### Páginas
- Múltiples páginas carta verticales (A4: 595x842 pt)
- Layout: `CANVAS_MARGIN | PAGE | GAP | PAGE | GAP | PAGE | CANVAS_MARGIN`
- Cada página tiene su propio espacio Y global
- Conversión: Y_global = Y_página + (pageNumber-1) * (pageHeight + gap)

#### Items & Shapes
- Coordenadas **relativas a su página** (x: 0-595, y: 0-842)
- Al mover entre páginas, se recalcula page y y automáticamente

#### Líneas de "Resumir"
- Guardadas en **coordenadas normalizadas** (0-1)
- Al dibujar en modal: `normalized = pixel / dimension`
- Al renderizar: `pixel = normalized * dimension`
- Esto permite que las líneas escalen correctamente con el tamaño de la imagen

---

## 🎨 Componentes Principales

### App.tsx
- Root component
- Maneja estados globales: drawingMode, editingShapeId, activePage, dimensions

### HeaderTools.tsx
- Barra superior con botones de acción
- Controles de zoom, búsqueda, auto-layout, limpiar
- **NO tiene botón Resumir** (se movió al InspectorPanel)

### Workspace.tsx
- Canvas principal con Konva
- Renderiza todas las páginas, items y shapes
- Maneja drag & drop, selección
- Modo dibujo para crear shapes rectangulares

### InspectorPanel.tsx
- Panel inferior con info de item/shape seleccionado
- Botones: Resaltado, Forros, Descuentos (10-50%), Eliminar, **Resumir**
- Input para editar texto de shapes
- Contiene el modal de edición de imágenes

### ImageItem.tsx (DraggableImage)
- Componente individual de imagen
- Renderiza imagen + borde + iconos (resaltado, forros, descuentos)
- **Renderiza líneas de "Resumir"** sobrepuestas a la imagen
- Maneja error states (rectángulo gris con texto)

### ImageEditModal.tsx
- Modal cuadrado 700x700px para editar imagen con herramientas
- Canvas Konva de tamaño fijo 700x700px
- **Herramienta "Raya"**: Click punto inicial → Click punto final = línea recta rosa
- **Shift para líneas rectas**: Mantener Shift mientras dibujas ajusta la línea a 8 ángulos (0°, 45°, 90°, 135°, 180°, 225°, 270°, 315°)
- **Zoom**: 50% a 400% con botones +, -, Reset (escala el Layer, no el Stage)
- **Pan/Drag**: Arrastrar imagen cuando NO está en modo Raya
- **Cursores dinámicos**: crosshair (dibujando), grab (listo), grabbing (arrastrando)
- Guarda líneas en coordenadas normalizadas (0-1)
- No modifica imagen original (solo guarda líneas como datos)
- strokeWidth y dash de líneas se ajustan inversamente al zoom

### SearchProductModal.tsx
- Modal para buscar y agregar productos desde images_new.json
- Filtra por título, marca, itemCode

---

## ⚙️ Funcionalidades Clave

### 1. Auto-Layout
- 3 modos: Normal, Por altura, Por ancho
- `autoLayoutPage()`: Ordena items de una página
- `autoLayoutAllPages()`: Ordena todas las páginas
- Usa algoritmo bin-packing con columnas

### 2. Sistema de Iconos
- **Resaltado** (hasBorder): Círculo verde con "!"
- **Forros** (hasForros): Círculo amarillo con "F"
- **Descuentos** (percentages): Círculos rojos con número (10-50)
- Renderizados en posiciones fijas de cada imagen

### 3. Persistencia
- LocalStorage: `modelo-document` (items), `modelo-shapes` (shapes)
- Auto-save en cada cambio (move, delete, toggle, etc.)
- Botón "Recargar datos" resetea desde JSON

### 4. Feature "Resumir" (Nuevo)
**Propósito:** Marcar áreas de una imagen que no se quieren con líneas rosas rectas

**Flujo:**
1. Usuario selecciona imagen
2. Click en botón "Resumir" en InspectorPanel
3. Se abre ImageEditModal con la imagen
4. Click en "Raya" para activar herramienta
5. Click en punto inicial, click en punto final → línea recta rosa
6. Repetir para más líneas
7. Click en "Guardar" → líneas se guardan como datos (NO se modifica imagen)
8. Líneas se renderizan sobre la imagen en el canvas principal

**Implementación técnica:**
- Líneas guardadas en `item.lines[]` como `LineData`
- Coordenadas normalizadas (0-1) para escalar correctamente
- Modal usa Konva Stage 700x700px fijo
- Zoom aplica `scaleX/scaleY` al Layer (no al Stage)
- Pan ajusta `x/y` del Layer con estados `isPanning` y `lastPanPosition`
- Coordenadas de dibujo se ajustan según zoom: `(pointer - layer.pos) / scale`
- Renderizado en ImageItem usando componente `<Line>` de Konva

---

## 🐛 Problemas Resueltos

### 1. Header desapareciendo
**Problema:** Al seleccionar imagen, botones del header desaparecían
**Causa:** Badge "1 seleccionada" cambiaba layout, causando overflow
**Solución:** 
- Eliminado badge "1 seleccionada"
- CSS: `header-right` con `flex-wrap: wrap` y `min-width: 0`
- `header-tools` con `min-height` en lugar de `height` fijo

### 2. Imagen desapareciendo al guardar Resumir
**Problema:** Imagen se convertía a data URL, useImage no recargaba
**Intentos:**
- ✗ Agregar timestamp a URL
- ✗ Forzar reload con key
**Solución Final:** NO modificar imagen, guardar líneas como datos separados

### 3. Líneas desalineadas
**Problema:** Líneas dibujadas en modal aparecían desalineadas en canvas
**Causa:** Coordenadas absolutas en píxeles no escalaban
**Solución:** Coordenadas normalizadas (0-1)
- Al guardar: `normalized = pixel / modalDimension`
- Al renderizar: `pixel = normalized * itemDimension`

### 4. Código duplicado en store/modal
**Problema:** Ediciones parciales causaron código corrupto
**Solución:** Limpiar duplicados, usar multi_replace_string_in_file

---

## 📝 Reglas de Desarrollo

### Coordinate System Rules
1. Items siempre usan coordenadas relativas a su página
2. Al mover items, calcular nueva página basado en Y global
3. Líneas de Resumir SIEMPRE en coordenadas normalizadas (0-1)

### State Management Rules
1. Toda mutación de items/shapes debe llamar `saveToStorage()`
2. Store es single source of truth
3. No modificar arrays directamente, usar `.map()` o spread

### React/TypeScript Rules
1. Siempre destructurar store con valores por defecto
2. Usar try-catch en componentes críticos
3. No usar `any` - siempre tipar correctamente

### Konva Rules
1. Escuchar `onDragEnd` no `onDragMove` para performance
2. Usar `listening={false}` en elementos decorativos
3. Precomputar dimensiones para evitar recálculos

### CSS Rules
1. Header debe usar `min-height` y `flex-wrap: wrap`
2. No usar `height` fijo en contenedores que pueden crecer
3. Usar `overflow: visible` para prevenir cortes

---

## 🚀 Cómo Trabajar en Este Proyecto

### Agregar Nueva Funcionalidad
1. Actualizar tipos en `types.ts` si es necesario
2. Agregar funciones al store en `store.ts`
3. Crear/modificar componentes
4. Testear en navegador
5. Actualizar este archivo

### Debugging
1. Verificar errores en consola del navegador (F12)
2. Verificar estado en React DevTools
3. Revisar localStorage: `modelo-document`, `modelo-shapes`
4. Logs estratégicos con `console.log`

### Best Practices
- Leer código existente antes de modificar
- Usar multi_replace cuando hay múltiples cambios
- No crear archivos innecesarios
- Consolidar funcionalidad relacionada
- Documentar decisiones importantes aquí

---

## 📚 Archivos Importantes

### Configuración
- `vite.config.ts` - Configuración de Vite
- `tsconfig.json` - TypeScript config
- `package.json` - Dependencias

### Datos
- `src/data/images.json` - Datos iniciales (usado por "Recargar datos")
- `src/data/images_new.json` - Catálogo para búsqueda

### Estilos
- `src/app/App.css` - Estilos globales
- `src/styles/SearchProductModal.css` - Modal de búsqueda
- `src/styles/ImageEditModal.css` - Modal de Resumir

### Core
- `src/app/store.ts` - Zustand store (500+ líneas)
- `src/app/types.ts` - Tipos TypeScript
- `src/app/config.ts` - Constantes y helpers de configuración

### Layouts
- `src/layout/autoLayout.ts` - Algoritmos de auto-layout
- `src/layout/mmToPx.ts` - Conversiones de unidades

---

## 🔮 Futuras Mejoras (Ideas)

1. **Deshacer/Rehacer**: Stack de acciones para undo/redo
2. **Export PDF**: Generar PDF con layout actual
3. **Zoom mejorado**: Zoom in/out con scroll, mini-mapa
4. **Guías y Snap**: Alineación automática entre elementos
5. **Templates**: Guardar/cargar layouts predefinidos
6. **Colaboración**: Multi-usuario en tiempo real
7. **IA Suggestions**: Auto-sugerencias de layout óptimo
8. **Borrador de líneas**: Herramienta para borrar líneas individuales en Resumir
9. **Exportar líneas**: Enviar coordenadas de líneas a backend para procesamiento de imagen
10. **Colores personalizados**: Cambiar color de líneas de Resumir

---

## 💡 Notas para IA Future

### Context to Remember
- Este proyecto es un editor de layouts para catálogos
- Usuario es "di" en macOS
- Stack: React + TypeScript + Konva + Zustand
- Siempre usar coordenadas normalizadas para líneas de Resumir
- No modificar imágenes originales, usar overlays

### Common Tasks
- **Agregar botón**: Primero ubicar dónde lógicamente pertenece (header vs inspector)
- **Modificar store**: Siempre incluir `saveToStorage()` call
- **Debugging**: Pedir al usuario que revise consola del navegador
- **CSS issues**: Verificar flex, overflow, y heights antes de asumir JS error

### Red Flags
- ❌ Código duplicado en múltiples lugares
- ❌ Modificar arrays sin spread operator
- ❌ Usar coordenadas absolutas para líneas
- ❌ Height fijo en elementos que pueden crecer
- ❌ Olvidar actualizar tipos cuando se agregan campos

---

**Este documento debe actualizarse con cada cambio significativo al proyecto.**
