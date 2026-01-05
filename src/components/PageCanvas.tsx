import { Rect } from 'react-konva'

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
    </>
  )
}
