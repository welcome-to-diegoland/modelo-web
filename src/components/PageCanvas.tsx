import { Rect, Text, Circle } from 'react-konva'

type Props = {
  pageId: number
  x: number
  y: number
  width: number
  height: number
}

/**
 * Componente que dibuja UNA página (sin Stage)
 * El Stage es manejado por el Workspace (canvas unificado)
 */
export function PageComponent({ pageId, x, y, width, height }: Props) {
  const isEven = pageId % 2 === 0
  const circleRadius = 18
  const circleY = y + height - 30
  const circleX = isEven ? x + 25 : x + width - 25
  
  return (
    <>
      {/* Fondo página */}
      <Rect
        x={x}
        y={y}
        width={width}
        height={height}
        fill="white"
        stroke="black"
        strokeWidth={1}
      />
      
      {/* Círculo de fondo para el número */}
      <Circle
        x={circleX}
        y={circleY}
        radius={circleRadius}
        fill="white"
        stroke="black"
        strokeWidth={2}
      />
      
      {/* Número de página en el footer */}
      <Text
        x={circleX}
        y={circleY}
        text={pageId.toString()}
        fontSize={26}
        fontWeight="bold"
        fill="black"
        align="center"
        verticalAlign="middle"
        width={24}
        offsetX={12}
        offsetY={10}
      />
    </>
  )
}
