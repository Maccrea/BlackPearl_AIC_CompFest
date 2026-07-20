import { useState } from 'react'

function App() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
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
    <div style={{ padding: '2rem', maxWidth: '600px', margin: '0 auto', fontFamily: 'sans-serif' }}>
      <h1>LegacyMind AI 🧠</h1>
      <p>Masukkan gejala kerusakan mesin untuk dianalisis.</p>
      
      <form onSubmit={handleAnalyze} style={{ display: 'flex', flexDirection: 'column', gap: '1rem' }}>
        <textarea 
          rows="4" 
          placeholder="Contoh: Mesin bergetar keras dan suhu naik di atas 90 derajat..."
          value={symptoms}
          onChange={(e) => setSymptoms(e.target.value)}
          style={{ padding: '0.5rem', fontSize: '1rem' }}
          required
        />
        <button type="submit" disabled={loading} style={{ padding: '0.5rem', fontSize: '1rem', cursor: 'pointer' }}>
          {loading ? 'Menganalisis...' : 'Analisis Gejala'}
        </button>
      </form>

      {result && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Hasil Analisis AI:</h3>
          <p><strong>Status:</strong> {result.status_case}</p>
          <p><strong>Akar Masalah (Prediksi):</strong> {result.possible_root_cause}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          <p><strong>Rekomendasi Tindakan:</strong></p>
          <ul>
            {result.recommendations.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>
        </div>
      )}
    </div>
  )
}

export default App