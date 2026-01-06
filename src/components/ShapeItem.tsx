import { Rect, Text, Group, Circle } from 'react-konva'
import { Shape } from '../app/types'
import { useStore } from '../app/store'

type ShapeItemProps = {
  shape: Shape
  isSelected: boolean
  onSelect: () => void
  onClick?: () => void
}

export function ShapeItem({ shape, isSelected, onSelect, onClick }: ShapeItemProps) {
  const { updateShape } = useStore()

  const strokeColor = isSelected ? '#3b82f6' : shape.borderColor
  const strokeWidth = isSelected ? 3 : shape.borderWidth

  const handleDragEnd = (e: any) => {
    const newX = e.target.x()
    const newY = e.target.y()
    updateShape(shape.id, { x: newX, y: newY })
  }

  const handleResizeMouseDown = (e: any) => {
    e.evt.preventDefault()
    e.cancelBubble = true
    const startX = e.evt.clientX
    const startY = e.evt.clientY
    const startWidth = shape.width
    const startHeight = shape.height
    
    const handleMouseMove = (moveEvent: MouseEvent) => {
      const deltaX = moveEvent.clientX - startX
      const deltaY = moveEvent.clientY - startY
      
      const newWidth = Math.max(50, startWidth + deltaX)
      const newHeight = Math.max(50, startHeight + deltaY)
      
      updateShape(shape.id, { width: newWidth, height: newHeight })
    }

    const handleMouseUp = () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
  }

  return (
    <Group
      x={shape.x}
      y={shape.y}
      draggable
      onClick={() => {
        onSelect()
        onClick?.()
      }}
      onDragEnd={handleDragEnd}
    >
      {/* Rectángulo de fondo */}
      <Rect
        x={0}
        y={0}
        width={shape.width}
        height={shape.height}
        fill={shape.backgroundColor}
        stroke={strokeColor}
        strokeWidth={strokeWidth}
      />

      {/* Texto */}
      <Text
        x={10}
        y={shape.height / 2}
        text={shape.text}
        fontSize={14}
        fill="#000"
        width={shape.width - 20}
        verticalAlign="middle"
        align="center"
      />

      {/* Ícono de resaltado si tiene borde */}
      {shape.hasBorder && (
        <>
          <Circle
            x={shape.width - 15}
            y={15}
            radius={15}
            fill="#22c55e"
            stroke="#16a34a"
            strokeWidth={2}
          />
          <Text
            x={shape.width - 15}
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

      {/* Íconos de porcentajes */}
      {shape.percentages && shape.percentages.length > 0 && (
        <>
          {shape.percentages.map((percentage, index) => (
            <Group key={percentage}>
              <Circle
                x={15 + (index * 35)}
                y={shape.height - 15}
                radius={15}
                fill="#ef4444"
                stroke="#dc2626"
                strokeWidth={2}
              />
              <Text
                x={15 + (index * 35)}
                y={shape.height - 15}
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
      {shape.hasForros && (
        <>
          <Circle
            x={shape.width - 15}
            y={shape.height - 15}
            radius={15}
            fill="#fbbf24"
            stroke="#f59e0b"
            strokeWidth={2}
          />
          <Text
            x={shape.width - 15}
            y={shape.height - 15}
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

      {/* Controlador de redimensionamiento */}
      {isSelected && (
        <Rect
          x={shape.width - 12}
          y={shape.height - 12}
          width={12}
          height={12}
          fill="#3b82f6"
          stroke="#1e40af"
          strokeWidth={1}
          onMouseDown={handleResizeMouseDown}
          style={{ cursor: 'nwse-resize' }}
        />
      )}
    </Group>
  )
}
