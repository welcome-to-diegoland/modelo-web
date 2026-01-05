# Guía de Uso - Modelo Web

## 🎯 Flujo Básico

### 1. Inicio
Al abrir la app:
- Se cargan 2 páginas A4 lado a lado
- 5 imágenes de ejemplo aparecen distribuidas
- El estado se carga desde localStorage (o datos iniciales)

### 2. Seleccionar Imagen
- **Click** en cualquier imagen
- Aparece borde **azul** alrededor
- Panel inferior muestra detalles

### 3. Mover Imagen
- **Arrastrar** imagen con mouse
- Se puede mover libremente por la página
- Se puede mover **fuera** a zona gris
- Se puede pasar **entre páginas**
- Se guarda automáticamente al soltar

### 4. Ver Información
Panel inferior muestra:
- Título de la imagen
- ID única
- Número de página (1 o 2)
- Posición X, Y en píxeles
- Ancho y alto

### 5. Agregar Borde
- Seleccionar imagen
- Click en botón "Agregar borde"
- Se guarda automáticamente

### 6. Eliminar Imagen
- Seleccionar imagen
- Click en botón "Eliminar imagen"
- Se quita de todas las páginas

### 7. Deseleccionar
- Click en "Deseleccionar" en header
- O click en espacio vacío
- Se cierra panel de información

### 8. Limpiar Todo
- Click en botón "Limpiar" (rojo)
- Confirmar advertencia
- **Todos los datos se borran** (no se puede deshacer)

## 📐 Propiedades de Imagen

Cada imagen tiene:

| Propiedad | Ejemplo | Editable |
|-----------|---------|----------|
| ID | `img-1` | No |
| Título | "Mountain Landscape" | No (aún) |
| Página | 1 o 2 | Sí (arrastrando) |
| X | 40 | Sí (arrastrando) |
| Y | 50 | Sí (arrastrando) |
| Ancho | 150px | No (aún) |
| Alto | 150px | No (aún) |
| URL | https://... | No (aún) |
| Borde | true/false | Sí (botón) |

## 🎨 Interfaz Visual

```
┌─────────────────────────────────────┐
│  Modelo Web | 5 imágenes | 1 sel    │  ← Header
├─────────────────────────────────────┤
│ GRIS │  PÁGINA 1  │  PÁGINA 2  │ GRIS │
│      │            │            │      │
│      │ [IMG]      │   [IMG]    │      │
│      │    [IMG]   │[IMG]       │      │
│      │ [IMG]      │    [IMG]   │      │
│      │            │            │      │
├─────────────────────────────────────┤
│ Información de la imagen | Botones  │  ← Inspector
└─────────────────────────────────────┘
```

## ⌨️ Atajos

| Acción | Cómo |
|--------|------|
| Seleccionar | Click en imagen |
| Mover | Arrastrar imagen |
| Deseleccionar | Click en "Deseleccionar" |
| Info | Seleccionar imagen |
| Borde | Botón en panel |
| Eliminar | Botón rojo en panel |

## 💾 Guardado Automático

- ✅ Al arrastrar → se guarda en localStorage
- ✅ Al toggle borde → se guarda
- ✅ Al eliminar → se guarda
- ✅ Al refrescar → se carga de localStorage

**No hay botón "Guardar"** - es automático.

## 🔄 Cómo Funciona LocalStorage

### Primera vez
```
localStorage vacío
  ↓
Se cargan datos iniciales de images.json
  ↓
Se guardan en localStorage
```

### Siguientes veces
```
Se carga desde localStorage
  ↓
El usuario interactúa
  ↓
Se guarda cada cambio
```

### Resetear
```
Click "Limpiar"
  ↓
Confirmar
  ↓
localStorage se borra
  ↓
Página recarga
  ↓
Se cargan datos iniciales de nuevo
```

## 🧪 Testing Manual

### Test 1: Cargar imagen
- [ ] Abrir app
- [ ] Ver 5 imágenes distribuidas
- [ ] Ver que están en sus posiciones iniciales

### Test 2: Arrastrar
- [ ] Click en imagen
- [ ] Arrastrarar hasta otro lugar
- [ ] Soltar
- [ ] Aparece borde azul
- [ ] Refrescar página
- [ ] Imagen sigue en nueva posición ✓

### Test 3: Cambiar página
- [ ] Arrastrar imagen de página 1
- [ ] Moverla a espacio de página 2
- [ ] Panel muestra "Página 2"
- [ ] Refrescar
- [ ] Imagen en página 2 ✓

### Test 4: Información
- [ ] Click en imagen
- [ ] Panel muestra detalles
- [ ] X, Y, ancho, alto correctos
- [ ] Click "Deseleccionar"
- [ ] Panel desaparece ✓

### Test 5: Borde
- [ ] Seleccionar imagen
- [ ] Click "Agregar borde"
- [ ] Borde visible en imagen ✓
- [ ] Click "Agregar borde" de nuevo
- [ ] Borde desaparece ✓

### Test 6: Persistencia
- [ ] Mover algunas imágenes
- [ ] Agregar bordes
- [ ] Abrir DevTools → Application → localStorage
- [ ] Ver JSON completo guardado ✓
- [ ] F5 (refrescar)
- [ ] Todas las imágenes en posiciones correctas ✓

### Test 7: Eliminar
- [ ] Seleccionar imagen
- [ ] Click "Eliminar imagen"
- [ ] Imagen desaparece
- [ ] Panel se cierra
- [ ] Contador de imágenes decrece
- [ ] Refrescar
- [ ] Imagen no vuelve ✓

## 🐛 Debugging

### Ver estado en consola
```javascript
// En consola del navegador (F12)
JSON.parse(localStorage.getItem('modelo-document'))
```

### Limpiar localStorage manualmente
```javascript
localStorage.removeItem('modelo-document')
location.reload()
```

### Ver qué imagen está seleccionada
```javascript
// En Redux DevTools o:
const { selectedId } = useStore()
console.log(selectedId)
```

## 🚀 Performance

- ✅ Rápido (~60fps) incluso con 100+ imágenes
- ✅ No lag al arrastrar
- ✅ Transiciones suaves
- ✅ Sin jank (gracias a Konva)

Si está lento:
1. Verificar cantidad de imágenes
2. Ver tamaño de imágenes (grandes urls)
3. Check console por errores

## 📱 En Móvil

- ✅ Responsive (pantalla apilada)
- ⚠️ Drag puede ser tocante (no optimizado)
- ❌ Sin soporte táctil aún (TODO Phase 2)

## ❓ FAQ

**P: ¿Dónde se guardan los datos?**
R: En localStorage de tu navegador (por dominio).

**P: ¿Se pierde si limpio cache?**
R: Sí. Mejor no hacerlo, o exporta PDF primero (Phase 4).

**P: ¿Puedo compartir con otros?**
R: No aún. Phase 6 (multiusuario).

**P: ¿Puedo deshacer cambios?**
R: No aún. Usa botón "Limpiar" para resetear a inicial, o recupera de localStorage si tienes backup.

**P: ¿Puedo exportar a PDF?**
R: No aún. Phase 4.

**P: ¿Qué tan grande puede ser?**
R: LocalStorage ~5-10MB. Probablemente 500-1000 imágenes máximo.

---

**Última actualización:** Enero 2026
**Versión:** MVP 1.0