import './App.css'
import { useState } from 'react'
import HeaderTools from '../components/HeaderTools'
import Workspace from '../components/Workspace'
import InspectorPanel from '../components/InspectorPanel'

type DrawingMode = 'select' | 'draw'

export default function App() {
  const [drawingMode, setDrawingMode] = useState<DrawingMode>('select')
  const [editingShapeId, setEditingShapeId] = useState<string | null>(null)

  return (
    <div className="app">
      <HeaderTools drawingMode={drawingMode} onDrawingModeChange={setDrawingMode} />
      <Workspace drawingMode={drawingMode} onDrawingModeChange={setDrawingMode} onEditingShapeChange={setEditingShapeId} />
      <InspectorPanel editingShapeId={editingShapeId} onEditingShapeChange={setEditingShapeId} />
    </div>
  )
}
