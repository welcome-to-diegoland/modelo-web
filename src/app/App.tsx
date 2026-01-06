import './App.css'
import { useState } from 'react'
import HeaderTools from '../components/HeaderTools'
import Workspace from '../components/Workspace'
import InspectorPanel from '../components/InspectorPanel'

type DrawingMode = 'select' | 'draw'

export default function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('select')
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null)
  const [activePage, setActivePage] = useState<number>(1)
  const [dimensions, setDimensions] = useState<any>(null)

  return (
    <div className="app">
      <HeaderTools drawingMode={drawingMode} onDrawingModeChange={setDrawingMode} activePage={activePage} dimensions={dimensions} />
      <Workspace drawingMode={drawingMode} onDrawingModeChange={setDrawingMode} onEditingShapeChange={setEditingShapeId} onActivePageChange={setActivePage} onDimensionsChange={setDimensions} />
      <InspectorPanel editingShapeId={editingShapeId} onEditingShapeChange={setEditingShapeId} />
    </div>
  )
}
