# 📂 Estructura Completa del Proyecto

## Árbol de Archivos

```
modelo-web/
│
├─── 📁 src/                          ← Código fuente
│    │
│    ├─── 📁 app/                     ← Aplicación principal
│    │    ├─── App.tsx                ✅ Componente raíz
│    │    ├─── App.css                ✅ Estilos principales
│    │    ├─── store.ts               ✅ Estado global (Zustand)
│    │    └─── types.ts               ✅ Tipos TypeScript
│    │
│    ├─── 📁 components/              ← Componentes React
│    │    ├─── HeaderTools.tsx        ✅ Header con controles
│    │    ├─── Workspace.tsx          ✅ Layout principal
│    │    ├─── PageCanvas.tsx         ✅ Canvas Konva para página
│    │    ├─── ImageItem.tsx          ✅ Imagen draggable
│    │    └─── InspectorPanel.tsx     ✅ Panel de información
│    │
│    ├─── 📁 data/                    ← Datos y layout
│    │    ├─── images.json            ✅ Imágenes iniciales
│    │    └─── initialLayout.ts       ✅ Constantes de layout
│    │
│    ├─── 📁 layout/                  ← Utilidades de layout
│    │    ├─── autoLayout.ts          ✅ Algoritmos de distribución
│    │    └─── mmToPx.ts              ✅ Conversiones mm ↔ px
│    │
│    ├─── index.css                   ✅ Estilos globales
│    └─── main.tsx                    ✅ Entry point de React
│
├─── 📁 public/                       ← Assets estáticos (si aplica)
│
├─── 📄 index.html                    ✅ HTML principal
├─── 📄 package.json                  (por crear con npm)
├─── 📄 package-lock.json             (generado por npm)
├─── 📄 vite.config.ts                ✅ Configuración Vite
├─── 📄 tsconfig.json                 ✅ Configuración TypeScript
├─── 📄 tsconfig.node.json            ✅ TypeScript para Vite
├─── 📄 .eslintrc.cjs                 ✅ Configuración ESLint
├─── 📄 .gitignore                    ✅ Git ignore
│
├─── 📚 Documentación
│    ├─── README.md                   ✅ Guía general (principal)
│    ├─── QUICK_START.md              ✅ Setup en 5 minutos
│    ├─── USAGE.md                    ✅ Guía de usuario
│    ├─── ARCHITECTURE.md             ✅ Decisiones técnicas
│    ├─── CHANGELOG.md                ✅ Resumen de implementación
│    └─── FILE_STRUCTURE.md           ✅ Este archivo
│
└─── 📄 package.json.example          ✅ Ejemplo de dependencias
```

## Resumen por Carpeta

### `src/app/`
**Propósito:** Estado y configuración global

| Archivo | Propósito | Tamaño |
|---------|-----------|--------|
| App.tsx | Componente raíz | ~50 líneas |
| App.css | Estilos (header, pages, inspector) | ~300 líneas |
| store.ts | Zustand store con persistencia | ~60 líneas |
| types.ts | Item, Page types | ~20 líneas |

### `src/components/`
**Propósito:** Componentes React reutilizables

| Archivo | Propósito | Tamaño |
|---------|-----------|--------|
| HeaderTools.tsx | Header superior con controls | ~50 líneas |
| Workspace.tsx | Layout de 2 páginas + inspector | ~40 líneas |
| PageCanvas.tsx | Canvas Konva para renderizar página | ~35 líneas |
| ImageItem.tsx | Imagen draggable (DraggableImage) | ~40 líneas |
| InspectorPanel.tsx | Panel info de imagen seleccionada | ~60 líneas |

### `src/data/`
**Propósito:** Datos iniciales y constantes

| Archivo | Propósito | Contenido |
|---------|-----------|-----------|
| images.json | 5 imágenes de ejemplo | Array JSON |
| initialLayout.ts | Constantes PAGES, INITIAL_ITEMS | Exports |

### `src/layout/`
**Propósito:** Utilidades de layout y matemáticas

| Archivo | Propósito | Funciones |
|---------|-----------|-----------|
| autoLayout.ts | auto-layout, collision detection | 3 funciones |
| mmToPx.ts | Conversiones y constantes A4 | 6 exports |

### Archivos Raíz `src/`
| Archivo | Propósito |
|---------|-----------|
| index.css | Estilos globales |
| main.tsx | React entry point |

### Configuración Raíz
| Archivo | Propósito |
|---------|-----------|
| index.html | HTML principal |
| vite.config.ts | Configuración Vite |
| tsconfig.json | TypeScript config |
| tsconfig.node.json | TypeScript para Vite |
| .eslintrc.cjs | ESLint rules |
| .gitignore | Git ignore patterns |

### Documentación Raíz
| Archivo | Propósito |
|---------|-----------|
| README.md | Documentación completa |
| QUICK_START.md | Setup rápido |
| USAGE.md | Guía de usuario |
| ARCHITECTURE.md | Decisiones técnicas |
| CHANGELOG.md | Resumen de cambios |
| FILE_STRUCTURE.md | Este archivo |

## Puntos Clave

### ✅ Lo que Está Incluido

1. **Toda la lógica del MVP**
   - Estado global con Zustand
   - Persistencia en localStorage
   - Renderizado con Konva
   - Drag & drop
   - Selección de imágenes
   - Inspector de propiedades

2. **Componentes funcionales**
   - 5 componentes React
   - TypeScript strict
   - Hooks modernos
   - Sin class components

3. **Configuración profesional**
   - Vite para build rápido
   - TypeScript con strict mode
   - ESLint para calidad
   - Git ignore configurado

4. **Documentación exhaustiva**
   - 5 documentos en markdown
   - Ejemplos de código
   - Guías de usuario
   - Roadmap futuro

### ❌ Lo que Falta (Post-MVP)

1. **package.json real** - Crear con `npm init` o usar `package.json.example`
2. **node_modules** - Se genera con `npm install`
3. **dist/** - Se genera con `npm run build`

## Cómo Usar Esta Estructura

### 1. Iniciar Proyecto
```bash
cd /Users/imac/Desktop/modelo-web
npm install
npm run dev
```

### 2. Editar Código
- Cambios en `src/` se hot-reload automáticamente
- TypeScript checkea tipos en tiempo real
- ESLint valida código

### 3. Para Producción
```bash
npm run build
# Genera dist/ listo para deploy
```

### 4. Entender el Código
1. Comienza en `src/main.tsx`
2. Lee `src/app/App.tsx`
3. Explora `src/components/`
4. Revisa `src/app/store.ts` para estado
5. Mira `src/app/types.ts` para tipos

## Dependencias Por Archivo

```
main.tsx
  └─ React, ReactDOM
  
App.tsx
  ├─ React
  └─ components (HeaderTools, Workspace)

HeaderTools.tsx
  ├─ React
  └─ store (useStore)

Workspace.tsx
  ├─ React
  ├─ store (useStore)
  ├─ PageCanvas
  ├─ InspectorPanel
  └─ data/images.json

PageCanvas.tsx
  ├─ React-Konva
  ├─ store (useStore)
  └─ ImageItem

ImageItem.tsx
  ├─ React-Konva
  └─ use-image

InspectorPanel.tsx
  └─ store (useStore)

store.ts
  ├─ Zustand
  └─ localStorage

types.ts
  └─ TypeScript puro

layout/autoLayout.ts
  └─ types (Item)

layout/mmToPx.ts
  └─ puro (sin dependencias)

data/images.json
  └─ JSON puro

data/initialLayout.ts
  └─ types (Item, Page)
```

## Flujo de Datos

```
localStorage
    ↓
store.ts (Zustand)
    ↓
componentes (useStore hook)
    ├─ HeaderTools
    ├─ Workspace
    │  ├─ PageCanvas ×2
    │  │  └─ ImageItem ×N
    │  └─ InspectorPanel
    ↓
localStorage (auto-save)
```

## Tamaño Aproximado

| Tipo | Cantidad | Líneas |
|------|----------|--------|
| Componentes | 5 | ~250 |
| Estado/Types | 2 | ~100 |
| Utilidades | 2 | ~80 |
| Datos | 2 | ~120 |
| CSS | 2 | ~350 |
| Config | 5 | ~100 |
| **Total** | **18** | **~1000** |

*Sin documentación (5 docs = ~10,000 líneas)*

## Próximas Adiciones (Recomendadas)

### Phase 2
- `src/hooks/` - Custom hooks
- `src/utils/` - Utilidades generales
- `src/constants/` - Valores hardcodeados

### Phase 3
- `src/services/` - API calls
- `src/contexts/` - Si necesita más proveedores

### Phase 4
- `tests/` - Tests unitarios e integración
- `stories/` - Storybook components

### Phase 5+
- `src/pages/` - Páginas si es SPA multi-página
- `public/` - Assets estáticos
- `.github/workflows/` - CI/CD

---

**Última actualización:** Enero 2026
**Versión:** 1.0 MVP
**Status:** ✅ Listo para usar