import { useState } from 'react'
import { Image as KonvaImage, Rect, Text, Group, Circle } from 'react-konva'
import useImage from 'use-image'
import { Item } from '../app/types'

type DraggableImageProps = {
  item: Item
  selected: boolean
  onSelect: () => void
  onDragEnd: (x: number, y: number) => void
}

export function DraggableImage({ 
  item, 
  selected, 
  onSelect, 
  onDragEnd 
}: DraggableImageProps) {
  const [image, status] = useImage(item.imageUrl)
  const [imageError, setImageError] = useState(false)

  const strokeColor = selected ? '#3b82f6' : undefined
  const strokeWidth = selected ? 3 : 0

  // Si hay error de imagen o no cargó, mostrar rectángulo gris
  if (imageError || status === 'failed') {
    return (
      <Group
        x={item.x}
        y={item.y}
        draggable
        onClick={onSelect}
        onMouseDown={onSelect}
        onDragEnd={(e) => {
          const newX = e.target.x()
          const newY = e.target.y()
          onDragEnd(newX, newY)
        }}
      >
        {/* Rectángulo gris de fondo */}
        <Rect
          x={0}
          y={0}
          width={item.width}
          height={item.height}
          fill="#d3d3d3"
          stroke={strokeColor}
          strokeWidth={strokeWidth}
        />
        {/* Texto con título y marca */}
        <Text
          x={5}
          y={item.height / 2 - 20}
          text={item.title || 'Sin título'}
          fontSize={11}
          fontStyle="bold"
          fill="#333"
          width={item.width - 10}
          align="center"
        />
        <Text
          x={5}
          y={item.height / 2 - 5}
          text={item.brand || 'Sin marca'}
          fontSize={11}
          fill="#333"
          width={item.width - 10}
          align="center"
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
        x={item.x}
        y={item.y}
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
      x={item.x}
      y={item.y}
      draggable
      onClick={onSelect}
      onMouseDown={onSelect}
      onDragEnd={(e) => {
        const newX = e.target.x()
        const newY = e.target.y()
        onDragEnd(newX, newY)
      }}
    >
      <KonvaImage
        image={image}
        x={0}
        y={0}
        width={item.width}
        height={item.height}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
        onError={() => setImageError(true)}
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
    </Group>
  )
}
