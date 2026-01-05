# 🚀 Quick Start - Modelo Web

## 5 Minutos para Empezar

### 1️⃣ Instalar Dependencias

```bash
cd /Users/imac/Desktop/modelo-web
npm install
```

### 2️⃣ Iniciar Dev Server

```bash
npm run dev
```

Se abrirá automáticamente en `http://localhost:5173`

### 3️⃣ ¡Listo! 🎉

Deberías ver:
- Header superior con título
- 2 páginas A4 lado a lado
- 5 imágenes distribuidas
- Panel inferior con info

## Primeros Pasos

1. **Selecciona** una imagen (click)
2. **Arrastra** para mover
3. **Observa** el panel inferior mostrando datos
4. **Refrescar** página (F5) → datos persisten ✓

## Estructura de Archivos

```
modelo-web/
├── src/
│   ├── app/
│   │   ├── App.tsx          ← Componente raíz
│   │   ├── App.css          ← Estilos principales
│   │   ├── store.ts         ← Estado (Zustand)
│   │   └── types.ts         ← Tipos TypeScript
│   ├── components/
│   │   ├── HeaderTools.tsx
│   │   ├── Workspace.tsx
│   │   ├── PageCanvas.tsx
│   │   ├── ImageItem.tsx
│   │   └── InspectorPanel.tsx
│   ├── data/
│   │   ├── images.json      ← Datos iniciales
│   │   └── initialLayout.ts
│   ├── layout/
│   │   ├── autoLayout.ts
│   │   └── mmToPx.ts
│   ├── index.css
│   └── main.tsx
├── package.json
├── tsconfig.json
├── vite.config.ts
├── index.html
├── README.md                ← Documentación completa
├── ARCHITECTURE.md          ← Decisiones técnicas
├── USAGE.md                 ← Guía de usuario
└── QUICK_START.md           ← Este archivo
```

## Comandos Útiles

```bash
# Desarrollo
npm run dev          # Inicia servidor local

# Producción
npm run build        # Compila para produccción
npm run preview      # Previewsea de build

# Linting
npm run lint         # Verifica errores
```

## Tecnologías

- ⚛️ **React 18** - UI
- 🔷 **TypeScript** - Tipado
- 🎨 **Konva** - Canvas gráfico
- 📦 **Zustand** - Estado global
- 🏗️ **Vite** - Build tool

## Datos Iniciales

Cuando inicie, carga 5 imágenes desde `data/images.json`:

```json
[
  { "id": "img-1", "x": 40, "y": 50, ... },
  { "id": "img-2", "x": 220, "y": 80, ... },
  ...
]
```

Se guarda automáticamente en `localStorage['modelo-document']`

## Primeros Cambios que Puedes Hacer

### 1. Cambiar datos iniciales
Edita `src/data/images.json` y recarga

### 2. Cambiar colores
Edita `src/app/App.css`

### 3. Cambiar tamaño de página
En `src/components/Workspace.tsx`:
```typescript
const PAGE_WIDTH = 400   // ← cambiar
const PAGE_HEIGHT = 563  // ← cambiar
```

### 4. Agregar más imágenes
Agrega objeto a `src/data/images.json`:
```json
{
  "id": "img-6",
  "x": 100,
  "y": 100,
  "width": 150,
  "height": 150,
  "page": 1,
  "imageUrl": "https://...",
  "title": "Mi imagen"
}
```

## Debugging

### Ver estado en consola
```javascript
// F12 → Console
JSON.parse(localStorage.getItem('modelo-document'))
```

### Reset completo
```javascript
localStorage.clear()
location.reload()
```

### Error común: Imágenes no cargan
- Verificar URLs en images.json
- Abrir DevTools → Network tab
- Buscar 404 errors

## Próximo Paso

Lee [USAGE.md](USAGE.md) para conocer todas las funciones.

---

¿Problemas? Revisa [README.md](README.md) o [ARCHITECTURE.md](ARCHITECTURE.md)