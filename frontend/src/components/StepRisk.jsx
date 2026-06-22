import React, { useState } from 'react'

export default function StepRisk({ uploadData, setRiskData }){
  if(!uploadData) return <div className="text-center py-12"><p className="text-slate-400">Sube un dataset en el Paso 1 primero</p></div>
  
  const columns = uploadData.columns || []
  const [riskResult, setRiskResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const evaluate = async () =>{
    setLoading(true)
    const res = await fetch('http://localhost:8000/api/evaluate-risk', { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({schema: uploadData.schema, columns})
    })
    const data = await res.json()
    setRiskData(data)
    setRiskResult(data)
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">⚠️ Paso 2: Evaluación de Riesgo</h2>
      <p className="text-slate-400 mb-6">Análisis de privacidad y clasificación de datos sensibles</p>
      
      <div className="mb-6">
        <p className="mb-3"><span className="font-semibold text-purple-300">{columns.length} columnas</span> detectadas:</p>
        <div className="flex flex-wrap gap-2 mb-4">
          {columns.map((col, i) => (
            <span key={i} className="px-3 py-1 bg-slate-700 text-slate-300 text-xs rounded-full">{col}</span>
          ))}
        </div>
        <button 
          onClick={evaluate} 
          disabled={loading}
          className="px-6 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold disabled:opacity-50"
        >
          {loading ? '⏳ Evaluando...' : '🔍 Evaluar Riesgo'}
        </button>
      </div>

      {riskResult && (
        <div className="space-y-4">
          <div className={`p-6 rounded-xl border-2 ${
            riskResult.risk_level === 'ALTO' ? 'border-red-500/50 bg-red-950/30' :
            riskResult.risk_level === 'MEDIO' ? 'border-yellow-500/50 bg-yellow-950/30' :
            'border-green-500/50 bg-green-950/30'
          }`}>
            <p className="text-xs text-slate-400 mb-2">Nivel de Riesgo</p>
            <div className="flex items-center justify-between">
              <span className="text-3xl font-bold">{riskResult.risk_score}/100</span>
              <span className={`text-lg font-bold px-4 py-2 rounded-lg ${
                riskResult.risk_level === 'ALTO' ? 'text-red-300 bg-red-900/50' :
                riskResult.risk_level === 'MEDIO' ? 'text-yellow-300 bg-yellow-900/50' :
                'text-green-300 bg-green-900/50'
              }`}>
                {riskResult.risk_level === 'ALTO' ? '🔴 ALTO' : riskResult.risk_level === 'MEDIO' ? '🟡 MEDIO' : '🟢 BAJO'}
              </span>
            </div>
          </div>

          <div className="grid grid-cols-3 gap-4">
            <div className="bg-red-900/20 border border-red-500/50 p-4 rounded-lg">
              <p className="text-xs text-red-300 mb-2">🔴 Identificadores Directos</p>
              <div className="flex flex-wrap gap-1">
                {riskResult.direct_identifiers.map((d, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-red-900/50 text-red-200 rounded">{d}</span>
                ))}
              </div>
            </div>
            <div className="bg-yellow-900/20 border border-yellow-500/50 p-4 rounded-lg">
              <p className="text-xs text-yellow-300 mb-2">🟡 Cuasi-Identificadores</p>
              <div className="flex flex-wrap gap-1">
                {riskResult.quasi_identifiers.map((q, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-yellow-900/50 text-yellow-200 rounded">{q}</span>
                ))}
              </div>
            </div>
            <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg">
              <p className="text-xs text-green-300 mb-2">🟢 Columnas Seguras</p>
              <div className="flex flex-wrap gap-1">
                {riskResult.safe_columns.map((s, i) => (
                  <span key={i} className="px-2 py-1 text-xs bg-green-900/50 text-green-200 rounded">{s}</span>
                ))}
              </div>
            </div>
          </div>

          <div className="bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg">
            <p className="text-xs text-purple-300 mb-2">💡 Recomendación</p>
            <p className="text-sm text-slate-200">{riskResult.recommendation}</p>
          </div>
        </div>
      )}
    </section>
  )
}
