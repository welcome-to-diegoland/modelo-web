export type Item = {
  id: string
  x: number
  y: number
  width: number
  height: number
  page: number
  imageUrl: string
  title?: string
  brand?: string
  hasBorder?: boolean
  percentages?: number[]
}

export type Shape = {
  id: string
  x: number
  y: number
  width: number
  height: number
  text: string
  backgroundColor: string
  borderColor: string
  borderWidth: number
  hasBorder?: boolean
  percentages?: number[]
}

export type Page = {
  id: number
  width: number
  height: number
}
