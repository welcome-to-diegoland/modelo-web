import { useState } from 'react'
import { Image as KonvaImage, Rect, Text, Group, Circle, Line } from 'react-konva'
import useImage from 'use-image'
import { Item } from '../app/types'

type DraggableImageProps = {
  item: Item
  selected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
  pageOffsetX?: number
  pageOffsetY?: number
}

export function DraggableImage({ 
  item, 
  selected, 
  onSelect, 
  onDragEnd,
  pageOffsetX = 0,
  pageOffsetY = 0
}: DraggableImageProps) {
  // Usar imageVersion para forzar recarga cuando cambia la imagen
  const imageUrlWithVersion = item.imageVersion ? `${item.imageUrl}#v${item.imageVersion}` : item.imageUrl
  const [image, status] = useImage(imageUrlWithVersion)
  const [imageError, setImageError] = useState(false)

  const strokeColor = selected ? '#3b82f6' : undefined
  const strokeWidth = selected ? 3 : 0

  // Si hay error de imagen o no cargó, mostrar rectángulo gris con información
  if (imageError || status === 'failed') {
    const fontSize = 9
    const padding = 6
    const totalHeight = item.height
    const contentHeight = totalHeight - padding * 2
    // Construir texto con saltos de línea: Título\nMarca\nItemCode - TODO EN BOLD
    const fullText = `${item.title || 'Sin título'}\n${item.brand || 'Sin marca'}\n${item.itemCode || 'Sin código'}`
    
    return (
      <Group
        x={item.x + pageOffsetX}
        y={item.y + pageOffsetY}
        draggable
        onClick={onSelect}
        onMouseDown={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x() - pageOffsetX
          const newY = e.target.y() - pageOffsetY
          onDragEnd(newX, newY)
        }}
      >
        {/* Rectángulo gris de fondo con outline - azul si está seleccionada */}
        <Rect
          x={0}
          y={0}
          width={item.width}
          height={item.height}
          fill="#e5e7eb"
          stroke={strokeColor || '#000000'}
          strokeWidth={strokeWidth || 1}
        />
        {/* Texto combinado: Título\nMarca\nItemCode - TODO EN BOLD */}
        <Text
          x={padding}
          y={item.height / 2 - (fontSize * 1.5)}
          text={fullText}
          fontSize={fontSize * 1.3}
          fontStyle="bold"
          fill="#1f2937"
          width={item.width - padding * 2}
          align="center"
          verticalAlign="middle"
          lineHeight={1.2}
        />
        {/* Ícono de resaltado si tiene borde */}
        {item.hasBorder && (
          <>
            <Circle
              x={item.width - 15}
              y={15}
              radius={15}
              fill="#22c55e"
              stroke="#16a34a"
              strokeWidth={2}
            />
            <Text
              x={item.width - 15}
              y={15}
              text="!"
              fontSize={26}
              fontFamily="Arial"
              fontStyle="bold"
              fontWeight={900}
              fill="white"
              align="center"
              verticalAlign="middle"
              offsetX={5}
              offsetY={10}
            />
          </>
        )}
        {/* Íconos de porcentajes en esquina inferior izquierda */}
        {item.percentages && item.percentages.length > 0 && (
          <>
            {item.percentages.map((percentage, index) => (
              <Group key={percentage}>
                <Circle
                  x={15 + (index * 35)}
                  y={item.height - 15}
                  radius={15}
                  fill="#ef4444"
                  stroke="#dc2626"
                  strokeWidth={2}
                />
                <Text
                  x={15 + (index * 35)}
                  y={item.height - 15}
                  text={`${percentage}`}
                  fontSize={18}
                  fontFamily="Arial"
                  fontStyle="bold"
                  fill="white"
                  align="center"
                  verticalAlign="middle"
                  offsetX={12}
                  offsetY={8}
                  width={24}
                />
              </Group>
            ))}
          </>
        )}
        {/* Icono de Forros en esquina inferior derecha */}
        {item.hasForros && (
          <>
            <Circle
              x={item.width - 15}
              y={item.height - 15}
              radius={15}
              fill="#fbbf24"
              stroke="#f59e0b"
              strokeWidth={2}
            />
            <Text
              x={item.width - 15}
              y={item.height - 15}
              text="F"
              fontSize={26}
              fontFamily="Arial"
              fontStyle="bold"
              fontWeight={900}
              fill="#000"
              align="center"
              verticalAlign="middle"
              offsetX={7}
              offsetY={10}
            />
          </>
        )}
      </Group>
    )
  }

  // Si la imagen está cargando, mostrar rectángulo de carga
  if (status === 'loading') {
    return (
      <Rect
        x={item.x + pageOffsetX}
        y={item.y + pageOffsetY}
        width={item.width}
        height={item.height}
        fill="#e8e8e8"
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        draggable
        onClick={onSelect}
        onMouseDown={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x()
          const newY = e.target.y()
          onDragEnd(newX, newY)
        }}
      />
    )
  }

  // Imagen normal
  return (
    <Group
      x={item.x + pageOffsetX}
      y={item.y + pageOffsetY}
      draggable
      onClick={onSelect}
      onMouseDown={onSelect}
      onDragEnd={(e) => {
        const newX = e.target.x() - pageOffsetX
        const newY = e.target.y() - pageOffsetY
        onDragEnd(newX, newY)
      }}
    >
      <KonvaImage
        image={image}
        x={0}
        y={0}
        width={item.width}
        height={item.height}
        onError={() => setImageError(true)}
      />
      {/* Outline para la imagen - azul si está seleccionada, negro si no */}
      <Rect
        x={0}
        y={0}
        width={item.width}
        height={item.height}
        stroke={strokeColor || '#000000'}
        strokeWidth={strokeWidth || 1}
        fill={null}
        pointerEvents="none"
      />
      {/* Ícono de triángulo de exclamación si tiene borde - círculo verde */}
      {item.hasBorder && (
        <>
          <Circle
            x={item.width - 15}
            y={15}
            radius={15}
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth={2}
          />
          <Text
            x={item.width - 15}
            y={15}
            text="!"
            fontSize={26}
            fontFamily="Arial"
            fontStyle="bold"
            fontWeight={900}
            fill="white"
            align="center"
            verticalAlign="middle"
            offsetX={5}
            offsetY={10}
          />
        </>
      )}
      {/* Íconos de porcentajes en esquina inferior izquierda */}
      {item.percentages && item.percentages.length > 0 && (
        <>
          {item.percentages.map((percentage, index) => (
            <Group key={percentage}>
              <Circle
                x={15 + (index * 35)}
                y={item.height - 15}
                radius={15}
                fill="#ef4444"
                stroke="#dc2626"
                strokeWidth={2}
              />
              <Text
                x={15 + (index * 35)}
                y={item.height - 15}
                text={`${percentage}`}
                fontSize={18}
                fontFamily="Arial"
                fontStyle="bold"
                fill="white"
                align="center"
                verticalAlign="middle"
                offsetX={12}
                offsetY={8}
                width={24}
              />
            </Group>
          ))}
        </>
      )}
      {/* Icono de Forros en esquina inferior derecha */}
      {item.hasForros && (
        <>
          <Circle
            x={item.width - 15}
            y={item.height - 15}
            radius={15}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <Text
            x={item.width - 15}
            y={item.height - 15}
            text="F"
            fontSize={26}
            fontFamily="Arial"
            fontStyle="bold"
            fontWeight={900}
            fill="#000"
            align="center"
            verticalAlign="middle"
            offsetX={7}
            offsetY={10}
          />
        </>
      )}
      {/* Líneas dibujadas para "Resumir" - escalar de coordenadas normalizadas a píxeles */}
      {item.lines && item.lines.length > 0 && (
        <>
          {item.lines.map((line) => {
            // Convertir coordenadas normalizadas (0-1) a píxeles del item
            const scaledPoints = [
              line.points[0] * item.width,  // x1
              line.points[1] * item.height, // y1
              line.points[2] * item.width,  // x2
              line.points[3] * item.height  // y2
            ]
            return (
              <Line
                key={line.id}
                points={scaledPoints}
                stroke="#ec4899"
                strokeWidth={3}
                lineCap="round"
                lineJoin="round"
                listening={false}
              />
            )
          })}
        </>
      )}
    </Group>
  )
}
