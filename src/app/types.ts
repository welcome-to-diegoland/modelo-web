export type LineData = {
  id: string
  points: number[]
}

export type Item = {
  id: string
  x: number
  y: number
  width: number
  height: number
  page: number
  imageUrl: string
  imageVersion?: number
  lines?: LineData[]
  title?: string
  brand?: string
  itemCode?: string
  itemGroup?: string
  hasBorder?: boolean
  hasForros?: boolean
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
  hasForros?: boolean
  percentages?: number[]
}

export type Page = {
  id: number
  width: number
  height: number
}
