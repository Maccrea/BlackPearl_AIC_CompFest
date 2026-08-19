import { useState } from 'react'
import { RouterProvider } from 'react-router-dom'
import { router } from './router'

function App() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('black-pearl-aic-comp-fest-khpfq0lxl-maccreas-projects.vercel.app/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptoms, machine_type: 'Mesin A' })
      })
      
      const data = await response.json()
      setResult(data)
    } catch (error) {
      console.error("Gagal menghubungi server:", error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <RouterProvider router={router} />
  )
}

export default App