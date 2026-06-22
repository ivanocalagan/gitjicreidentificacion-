import React from 'react'

export default function StepRisk({ uploadData, setRiskData }){
  if(!uploadData) return <p className="text-slate-400">Sube un dataset primero.</p>
  const columns = uploadData.columns || []

  const evaluate = async () =>{
    const res = await fetch('http://localhost:8000/api/evaluate-risk', { method: 'POST', headers: {'Content-Type':'application/json'}, body: JSON.stringify({schema: uploadData.schema, columns})})
    const data = await res.json()
    setRiskData(data)
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Paso 2 — Evaluación de riesgo</h2>
      <div className="mb-3">
        <p>Columnas detectadas: {columns.join(', ')}</p>
        <button onClick={evaluate} className="mt-2 px-3 py-1 bg-violet-600 rounded">Evaluar riesgo</button>
      </div>
    </section>
  )
}
