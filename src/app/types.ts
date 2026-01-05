export type Item = {
  id: string
  x: number
  y: number
  width: number
  height: number
  page: number
  imageUrl: string
  title?: string
  hasBorder?: boolean
}

export type Page = {
  id: number
  width: number
  height: number
}
