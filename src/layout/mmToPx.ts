/**
 * Convierte milímetros a píxeles usando DPI estándar de 96
 * Fórmula: mm * (dpi / 25.4)
 */
const DPI = 96

export const mmToPx = (mm: number): number => {
  return Math.round(mm * (DPI / 25.4))
}

export const pxToMm = (px: number): number => {
  return Number((px / (DPI / 25.4)).toFixed(2))
}

// Dimensiones A4 en milímetros
export const A4_WIDTH_MM = 210
export const A4_HEIGHT_MM = 297

// Dimensiones A4 en píxeles (vertical)
export const A4_WIDTH_PX = mmToPx(A4_WIDTH_MM)
export const A4_HEIGHT_PX = mmToPx(A4_HEIGHT_MM)
