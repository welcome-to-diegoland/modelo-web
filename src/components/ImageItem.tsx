import { Image as KonvaImage } from 'react-konva'
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
  const [image] = useImage(item.imageUrl)

  const strokeColor = selected ? '#3b82f6' : undefined
  const strokeWidth = selected ? 3 : 0

  return (
    <KonvaImage
      image={image}
      x={item.x}
      y={item.y}
      width={item.width}
      height={item.height}
      draggable
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      onClick={onSelect}
      onDragEnd={(e) => {
        const newX = e.target.x()
        const newY = e.target.y()
        onDragEnd(newX, newY)
      }}
    />
  )
}
