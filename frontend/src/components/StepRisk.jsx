import React, { useState } from 'react'

export default function StepRisk({ uploadData, setRiskData }){
  if(!uploadData) return (
    <div className="text-center py-12 card">
      <div className="text-4xl mb-4">📤</div>
      <p className="text-slate-400 font-medium">Sube un dataset en el Paso 1 primero</p>
    </div>
  )
  
  const columns = uploadData.columns || []
  const [riskResult, setRiskResult] = useState(null)
  const [loading, setLoading] = useState(false)

  const evaluate = async () =>{
    setLoading(true)
    const res = await fetch('http://localhost:8000/api/evaluate-risk', { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify({schema: uploadData.schema, columns, preview: uploadData.preview})
    })
    const data = await res.json()
    setRiskData(data)
    setRiskResult(data)
    setLoading(false)
  }

  const getRiskColor = (level) => {
    if(level === 'ALTO') return { bg: 'from-red-600 to-red-700', text: 'text-red-300', icon: '🔴', border: 'border-red-500/30' }
    if(level === 'MEDIO') return { bg: 'from-yellow-600 to-yellow-700', text: 'text-yellow-300', icon: '🟡', border: 'border-yellow-500/30' }
    return { bg: 'from-green-600 to-green-700', text: 'text-green-300', icon: '🟢', border: 'border-green-500/30' }
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-2 text-gradient">⚠️ Paso 2: Evaluar Riesgo de Privacidad</h2>
      <p className="text-slate-400 mb-8">Análisis automático de identificadores y datos sensibles</p>
      
      {!riskResult ? (
        <div className="space-y-6">
          {/* INFORMACIÓN DE COLUMNAS */}
          <div className="card">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span className="text-lg">📊</span>
              Columnas Detectadas: <span className="text-purple-400">{columns.length}</span>
            </h3>
            <div className="flex flex-wrap gap-2">
              {columns.map((col, i) => (
                <span key={i} className="px-3 py-1.5 bg-slate-700/50 text-slate-300 text-xs rounded-full font-medium border border-slate-600/50">
                  {col}
                </span>
              ))}
            </div>
          </div>

          {/* BOTÓN DE EVALUACIÓN */}
          <button 
            onClick={evaluate} 
            disabled={loading}
            className={`btn-primary w-full text-lg py-4 flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover-lift'}`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Analizando datos...
              </>
            ) : (
              <>
                <span className="text-xl">🔍</span>
                Evaluar Riesgo de Re-identificación
              </>
            )}
          </button>

          {/* INFO EXPLICATIVA */}
          <div className="bg-slate-900/50 p-6 rounded-xl border border-slate-700/30">
            <p className="text-xs font-semibold text-slate-400 mb-3 uppercase tracking-wider">¿Qué se analizará?</p>
            <ul className="space-y-2 text-sm text-slate-300">
              <li className="flex items-start gap-2">
                <span className="text-red-400 mt-0.5">•</span>
                <span><strong>Identificadores Directos:</strong> Información que identifica directamente (cédula, teléfono, email)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-yellow-400 mt-0.5">•</span>
                <span><strong>Cuasi-Identificadores:</strong> Datos que pueden identificar en combinación (edad, ubicación)</span>
              </li>
              <li className="flex items-start gap-2">
                <span className="text-blue-400 mt-0.5">•</span>
                <span><strong>Datos Sensibles:</strong> Información protegida bajo Ley 81 (ingresos, salud, estado)</span>
              </li>
            </ul>
          </div>
        </div>
      ) : (
        <div className="space-y-6 fade-in-animation">
          {/* PUNTUACIÓN PRINCIPAL */}
          <div className={`card bg-gradient-to-br ${getRiskColor(riskResult.risk_level).bg} border border-slate-700/50 p-8 text-center`}>
            <p className="text-xs text-slate-200 font-semibold mb-2 uppercase tracking-wider">Puntuación de Riesgo</p>
            <div className="text-7xl font-black text-white mb-4">{riskResult.risk_score}</div>
            <div className="flex items-center justify-center gap-3 mb-6">
              <span className="text-3xl">{getRiskColor(riskResult.risk_level).icon}</span>
              <span className={`text-2xl font-bold ${getRiskColor(riskResult.risk_level).text}`}>
                {riskResult.risk_level === 'ALTO' ? 'CRÍTICO' : riskResult.risk_level === 'MEDIO' ? 'MODERADO' : 'BAJO'}
              </span>
            </div>
            <div className="h-2 bg-black/20 rounded-full overflow-hidden">
              <div 
                className={`h-full bg-gradient-to-r ${getRiskColor(riskResult.risk_level).bg} transition-all duration-1000`}
                style={{width: `${riskResult.risk_score}%`}}
              />
            </div>
          </div>

          {/* ESCALA VISUAL */}
          <div className="card p-6">
            <p className="text-xs font-semibold text-slate-400 mb-4 uppercase tracking-wider">Escala de Riesgo</p>
            <div className="grid grid-cols-4 gap-2">
              {[
                { min: 0, max: 25, emoji: '🟢', label: 'Bajo' },
                { min: 26, max: 50, emoji: '🟡', label: 'Medio' },
                { min: 51, max: 75, emoji: '🟠', label: 'Alto' },
                { min: 76, max: 100, emoji: '🔴', label: 'Crítico' }
              ].map((seg, i) => (
                <div
                  key={i}
                  className={`p-3 rounded-lg text-center transition-all cursor-pointer ${
                    riskResult.risk_score >= seg.min && riskResult.risk_score <= seg.max
                      ? 'ring-2 ring-white scale-105 shadow-lg'
                      : 'opacity-50'
                  }`}
                  style={{
                    background: i === 0 ? '#16a34a' : i === 1 ? '#ca8a04' : i === 2 ? '#ea580c' : '#dc2626'
                  }}
                >
                  <div className="text-xl">{seg.emoji}</div>
                  <p className="text-xs font-bold text-white mt-1">{seg.label}</p>
                </div>
              ))}
            </div>
          </div>

          {/* HALLAZGOS DETALLADOS */}
          <div className="grid grid-cols-3 gap-4">
            {/* Directos */}
            <div className="card bg-gradient-to-br from-red-900/30 to-transparent border-red-500/30">
              <p className="text-xs text-red-300 font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">🔴</span> DIRECTOS
              </p>
              <div className="space-y-1">
                {riskResult.direct_identifiers?.length ? (
                  riskResult.direct_identifiers.map((d, i) => (
                    <div key={i} className="px-2 py-1.5 bg-red-900/50 text-red-200 text-xs rounded border border-red-500/30 font-medium">
                      {d}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">Ninguno detectado</p>
                )}
              </div>
            </div>

            {/* Cuasi */}
            <div className="card bg-gradient-to-br from-yellow-900/30 to-transparent border-yellow-500/30">
              <p className="text-xs text-yellow-300 font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">🟡</span> CUASI
              </p>
              <div className="space-y-1">
                {riskResult.quasi_identifiers?.length ? (
                  riskResult.quasi_identifiers.map((q, i) => (
                    <div key={i} className="px-2 py-1.5 bg-yellow-900/50 text-yellow-200 text-xs rounded border border-yellow-500/30 font-medium">
                      {q}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">Ninguno detectado</p>
                )}
              </div>
            </div>

            {/* Seguros */}
            <div className="card bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30">
              <p className="text-xs text-green-300 font-bold mb-3 flex items-center gap-2">
                <span className="text-lg">🟢</span> SEGUROS
              </p>
              <div className="space-y-1">
                {riskResult.safe_columns?.length ? (
                  riskResult.safe_columns.map((s, i) => (
                    <div key={i} className="px-2 py-1.5 bg-green-900/50 text-green-200 text-xs rounded border border-green-500/30 font-medium">
                      {s}
                    </div>
                  ))
                ) : (
                  <p className="text-slate-500 text-xs italic">Ninguno</p>
                )}
              </div>
            </div>
          </div>

          {/* RECOMENDACIÓN */}
          <div className="card p-6 bg-gradient-to-br from-blue-900/30 to-transparent border-blue-500/30">
            <h3 className="text-lg font-bold text-blue-300 mb-3 flex items-center gap-2">
              <span>💡</span> Recomendación
            </h3>
            <p className="text-sm text-slate-200 leading-relaxed">{riskResult.recommendation}</p>
          </div>

          {/* BOTONES DE ACCIÓN */}
          <div className="grid grid-cols-2 gap-4">
            <button 
              onClick={() => setRiskResult(null)}
              className="btn-secondary py-3"
            >
              🔄 Evaluar de Nuevo
            </button>
            <button 
              onClick={() => {}}
              className="btn-primary py-3"
            >
              ✅ Continuar
            </button>
          </div>
        </div>
      )}
    </section>
  )
}
