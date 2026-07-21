import { useState } from 'react'

function App() {
  const [symptoms, setSymptoms] = useState('')
  const [result, setResult] = useState(null)
  const [loading, setLoading] = useState(false)
  const [saved, setSaved] = useState(false) // <-- Tambahan state untuk tombol validasi

  const handleAnalyze = async (e) => {
    e.preventDefault()
    setLoading(true)
    setSaved(false) // <-- Reset status tombol tiap kali analisis baru
    
    try {
      const response = await fetch('http://localhost:8000/analyze', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ symptoms: symptoms, machine_type: 'Mesin A' })
      })
      
      const data = await response.json()
      console.log("Ini balasan dari backend:", data)
      setResult(data)
    } catch (error) {
      console.error("Gagal menghubungi server:", error)
    } finally {
      setLoading(false)
    }
  }

  // <-- Tambahan Fungsi Validasi (Blok 8: Learn AI)
  const handleValidate = async () => {
    try {
      await fetch('http://localhost:8000/validate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          symptoms: symptoms,
          root_cause: result.possible_root_cause,
          recommendations: result.recommendations
        })
      })
      setSaved(true) // Ubah warna dan tulisan tombol jadi sukses
    } catch (error) {
      console.error("Gagal menyimpan:", error)
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

      {/* Tangkap Error dari Backend (Misal Groq Limit) */}
      {result && result.error && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid red', borderRadius: '8px', color: 'red' }}>
          <h3>⚠️ Gagal Memproses AI</h3>
          <p>{result.error}</p>
        </div>
      )}

      {/* Tampilkan Hasil Analisis */}
      {result && !result.error && (
        <div style={{ marginTop: '2rem', padding: '1rem', border: '1px solid #ccc', borderRadius: '8px' }}>
          <h3>Hasil Analisis AI:</h3>
          <p><strong>Status:</strong> {result.status_case}</p>
          <p><strong>Akar Masalah (Prediksi):</strong> {result.possible_root_cause}</p>
          <p><strong>Confidence:</strong> {result.confidence}%</p>
          <p><strong>Rekomendasi Tindakan:</strong></p>
          <ul>
            {result.recommendations?.map((rec, index) => (
              <li key={index}>{rec}</li>
            ))}
          </ul>

          {/* TOMBOL VALIDASI: Hanya muncul jika masuk Jalur B (Reasoning AI / New Case) */}
          {result.status_case && result.status_case.includes("New Case") && (
            <div style={{ marginTop: '1.5rem', padding: '1rem', backgroundColor: '#eefcf1', borderRadius: '8px', border: '1px solid #c3e6cb' }}>
              <p style={{ margin: '0 0 0.5rem 0', fontWeight: 'bold', color: '#155724' }}>
                Apakah solusi AI ini akurat?
              </p>
              <button 
                onClick={handleValidate} 
                disabled={saved} 
                style={{ 
                  padding: '0.5rem 1rem', 
                  backgroundColor: saved ? '#6c757d' : '#28a745', 
                  color: 'white', 
                  border: 'none', 
                  borderRadius: '4px', 
                  cursor: saved ? 'not-allowed' : 'pointer',
                  width: '100%',
                  fontWeight: 'bold'
                }}
              >
                {saved ? '✓ Tersimpan ke Knowledge Base' : 'Validasi & Pelajari Kasus Ini'}
              </button>
            </div>
          )}
        </div>
      )}
    </div>
  )
}

export default App