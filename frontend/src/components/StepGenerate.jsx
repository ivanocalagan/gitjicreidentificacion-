import React, { useState } from 'react'

export default function StepGenerate({ uploadData, riskData, setSyntheticData, config, setConfig }){
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  const generate = async () =>{
    if(!uploadData) return
    setLoading(true)
    const payload = { dataset_session_id: uploadData.session_token, epsilon: config.epsilon, n_rows: config.n_rows, seed: config.seed || 42, risk_eval: riskData }
    const res = await fetch('http://localhost:8000/api/generate', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify(payload)})
    const data = await res.json()
    setResult(data)
    setSyntheticData(data.preview)
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Paso 3 — Generar datos sintéticos</h2>
      <div className="mb-3">
        <label className="block">Epsilon: <input type="range" min="0.1" max="10" step="0.1" value={config.epsilon} onChange={e=>setConfig({...config, epsilon: parseFloat(e.target.value)})} /></label>
        <label className="block mt-2">Filas a generar: <input type="number" min="10" max="10000" value={config.n_rows} onChange={e=>setConfig({...config, n_rows: parseInt(e.target.value)})} /></label>
        <button onClick={generate} className="mt-3 px-3 py-1 bg-violet-600 rounded">🔮 Generar</button>
      </div>
      {loading && <p>Cargando generación...</p>}
      {result && (
        <div className="bg-slate-700 p-3 rounded">
          <h3 className="font-medium">Preview sintético</h3>
          <pre className="text-sm overflow-auto max-h-40">{JSON.stringify(result.preview, null, 2)}</pre>
          <pre className="text-sm mt-2">{JSON.stringify(result.generation_report, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}
