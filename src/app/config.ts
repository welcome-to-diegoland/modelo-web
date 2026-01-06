/**
 * Configuración global de la aplicación
 * Aquí puedes ajustar parámetros como número de páginas, tamaño A4, etc.
 */

export const CONFIG = {
  // Número de páginas a mostrar en el documento
  TOTAL_PAGES: 3,
  
  // Tamaño A4 (210mm x 297mm)
  A4_WIDTH_MM: 210,
  A4_HEIGHT_MM: 297,
  
  // Tamaño en pixels del canvas (basado en proporción A4)
  PAGE_WIDTH_PX: 600,
  
  // Espacio entre páginas en pixels
  PAGE_GAP_PX: 50,
  
  // Margen del canvas a ambos lados
  CANVAS_MARGIN_WIDTH_PX: 600
}

/**
 * Calcula la altura de una página en pixels manteniendo proporción A4
 */
export const getPageHeight = (pageWidth: number): number => {
  return Math.round(pageWidth * (CONFIG.A4_HEIGHT_MM / CONFIG.A4_WIDTH_MM))
}

/**
 * Calcula la altura total del canvas basado en número de páginas
 */
export const getTotalCanvasHeight = (totalPages: number, pageHeight: number, pageGap: number): number => {
  // Altura = (altura de página × número de páginas) + (gap entre páginas × páginas - 1)
  return pageHeight * totalPages + pageGap * (totalPages - 1)
}

/**
 * Obtiene la posición Y de una página específica
 * @param pageNumber Número de página (1-indexed)
 */
export const getPageYPosition = (pageNumber: number, pageHeight: number, pageGap: number): number => {
  if (pageNumber <= 1) return 0
  // Posición = (altura de página × (página - 1)) + (gap × (página - 1))
  return pageHeight * (pageNumber - 1) + pageGap * (pageNumber - 1)
}

/**
 * Determina a qué página pertenece una coordenada Y absoluta
 */
export const getPageFromYPosition = (yAbsolute: number, pageHeight: number, pageGap: number): number => {
  const pageSpacing = pageHeight + pageGap
  const pageNumber = Math.floor(yAbsolute / pageSpacing) + 1
  return Math.max(1, Math.min(pageNumber, CONFIG.TOTAL_PAGES))
}

/**
 * Convierte coordenada Y global a coordenada Y relativa a una página
 */
export const getRelativeYInPage = (yAbsolute: number, pageNumber: number, pageHeight: number, pageGap: number): number => {
  const pageYStart = getPageYPosition(pageNumber, pageHeight, pageGap)
  return yAbsolute - pageYStart
}
