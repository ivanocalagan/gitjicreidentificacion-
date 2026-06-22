import React, { useState } from 'react'

export default function StepGenerate({ uploadData, riskData, setSyntheticData, config, setConfig }){
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  if(!uploadData) return (
    <div className="text-center py-12 card">
      <div className="text-4xl mb-4">🔮</div>
      <p className="text-slate-400 font-medium">Carga datos en el Paso 1 primero</p>
    </div>
  )

  const generate = async () =>{
    if(!uploadData) return
    setLoading(true)
    const payload = { 
      dataset_session_id: uploadData.session_token, 
      epsilon: config.epsilon, 
      n_rows: config.n_rows, 
      seed: config.seed || 42, 
      risk_eval: riskData 
    }
    const res = await fetch('http://localhost:8000/api/generate', { 
      method: 'POST', 
      headers: {'Content-Type':'application/json'}, 
      body: JSON.stringify(payload)
    })
    const data = await res.json()
    setResult(data)
    setSyntheticData(data)
    setLoading(false)
  }

  const getEpsilonDescription = (eps) => {
    if(eps <= 0.5) return { emoji: '🔒', text: 'Privacidad máxima — distorsión estadística alta' }
    if(eps <= 2.0) return { emoji: '🛡️', text: 'Balance recomendado — privacidad y utilidad óptima' }
    return { emoji: '⚠️', text: 'Mayor utilidad — privacidad reducida' }
  }

  const epsilonDesc = getEpsilonDescription(config.epsilon)

  return (
    <section>
      <h2 className="text-3xl font-bold mb-2 text-gradient">🔮 Paso 3: Generar Datos Sintéticos</h2>
      <p className="text-slate-400 mb-8">Crea datos estadísticamente equivalentes usando Privacidad Diferencial</p>

      {!result ? (
        <div className="space-y-6">
          {/* PARÁMETRO EPSILON */}
          <div className="card">
            <h3 className="text-sm font-bold text-slate-300 mb-6 flex items-center gap-2">
              <span className="text-lg">🔐</span>
              Epsilon (ε) - Control de Privacidad
            </h3>
            
            <div className="space-y-4">
              {/* Slider */}
              <div>
                <div className="flex items-baseline justify-between mb-3">
                  <span className="text-sm font-semibold text-purple-300">Valor: </span>
                  <span className="text-3xl font-black text-purple-400">{config.epsilon.toFixed(2)}</span>
                </div>
                <input 
                  type="range" 
                  min="0.1" 
                  max="10" 
                  step="0.1" 
                  value={config.epsilon} 
                  onChange={e=>setConfig({...config, epsilon: parseFloat(e.target.value)})}
                  className="w-full h-3 bg-gradient-to-r from-red-600 via-yellow-600 to-green-600 rounded-lg appearance-none cursor-pointer accent-purple-500"
                />
                <div className="flex justify-between text-xs text-slate-500 mt-2">
                  <span>0.1 (Máximo)</span>
                  <span>5 (Balance)</span>
                  <span>10 (Mínimo)</span>
                </div>
              </div>

              {/* Descripción */}
              <div className="p-4 bg-slate-700/30 border border-slate-600/50 rounded-lg">
                <p className="text-sm text-slate-200">
                  <span className="text-2xl mr-2">{epsilonDesc.emoji}</span>
                  {epsilonDesc.text}
                </p>
              </div>

              {/* Info sobre epsilon */}
              <div className="bg-blue-900/20 p-4 rounded-lg border border-blue-500/30">
                <p className="text-xs text-blue-300 font-bold mb-2">💡 ¿Qué es Epsilon?</p>
                <p className="text-xs text-slate-300 leading-relaxed">
                  Define cuánto ruido se añade a tus datos. Valores menores = más privacidad + menos precisión. Valores mayores = menos privacidad + más precisión.
                </p>
              </div>
            </div>
          </div>

          {/* NÚMERO DE FILAS */}
          <div className="card">
            <label className="block">
              <span className="text-sm font-bold text-slate-300 mb-3 flex items-center gap-2">
                <span className="text-lg">📊</span>
                Filas a Generar
              </span>
            </label>
            <input 
              type="number" 
              min="10" 
              max="10000" 
              value={config.n_rows} 
              onChange={e=>setConfig({...config, n_rows: parseInt(e.target.value)})}
              className="w-full px-4 py-3 bg-slate-700 border border-slate-600 rounded-lg text-slate-50 font-semibold text-center focus:outline-none focus:border-purple-500 focus:ring-2 focus:ring-purple-500/30"
            />
            <p className="text-xs text-slate-400 mt-3">Rango: 10 - 10,000 filas sintéticas</p>
          </div>

          {/* BOTÓN GENERAR */}
          <button 
            onClick={generate} 
            disabled={loading}
            className={`btn-primary w-full py-4 text-lg flex items-center justify-center gap-3 ${loading ? 'opacity-50 cursor-not-allowed' : 'hover-lift'}`}
          >
            {loading ? (
              <>
                <span className="animate-spin">⏳</span>
                Generando datos sintéticos...
              </>
            ) : (
              <>
                <span>🔮</span>
                Generar {config.n_rows} Filas Sintéticas
              </>
            )}
          </button>

          {/* INFO LEY 81 */}
          <div className="card bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30">
            <p className="text-xs font-bold text-green-300 mb-2 flex items-center gap-2">
              <span>✅</span> Cumplimiento Ley 81 Panamá
            </p>
            <p className="text-xs text-slate-300 leading-relaxed">
              Los datos generados cumplen con privacidad diferencial y la Ley de Protección de Datos Personales de Panamá (Ley 81).
            </p>
          </div>
        </div>
      ) : (
        <div className="space-y-6 fade-in-animation">
          {/* RESULTADO EXITOSO */}
          <div className="card bg-gradient-to-br from-green-900/40 to-transparent border-green-500/30 p-8 text-center">
            <div className="text-5xl mb-4">✅</div>
            <h3 className="text-2xl font-bold text-green-300 mb-2">Generación Exitosa</h3>
            <p className="text-sm text-slate-300">{result.generation_report.rows_generated} filas sintéticas creadas con éxito</p>
          </div>

          {/* MÉTRICAS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card hover-lift bg-gradient-to-br from-purple-900/30 to-transparent border-purple-500/30">
              <p className="text-xs text-purple-300 font-semibold mb-2">📊 Filas</p>
              <p className="text-2xl font-black text-purple-300">{result.generation_report.rows_generated}</p>
              <p className="text-xs text-slate-500 mt-1">Registros generados</p>
            </div>
            <div className="card hover-lift bg-gradient-to-br from-blue-900/30 to-transparent border-blue-500/30">
              <p className="text-xs text-blue-300 font-semibold mb-2">🔐 Epsilon</p>
              <p className="text-2xl font-black text-blue-300">{result.generation_report.epsilon_used}</p>
              <p className="text-xs text-slate-500 mt-1">Privacidad aplicada</p>
            </div>
            <div className="card hover-lift bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30">
              <p className="text-xs text-green-300 font-semibold mb-2">✓ Ley 81</p>
              <p className="text-2xl font-black text-green-300">{result.generation_report.ley81_compliance ? 'Sí' : 'No'}</p>
              <p className="text-xs text-slate-500 mt-1">Cumplimiento</p>
            </div>
          </div>

          {/* MÉTODOS POR COLUMNA */}
          <div className="card">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span>⚙️</span> Métodos de Anonimización por Columna
            </h3>
            <div className="grid grid-cols-2 gap-3">
              {Object.entries(result.generation_report.method_per_column).map(([col, method], i) => (
                <div key={i} className="p-3 bg-slate-700/30 rounded-lg border border-slate-600/50">
                  <p className="text-xs text-slate-400 font-semibold">{col}</p>
                  <p className="text-sm text-purple-300 font-bold mt-1">{method}</p>
                </div>
              ))}
            </div>
          </div>

          {/* PREVIEW */}
          <div className="card">
            <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
              <span>👀</span> Preview (Primeras 5 Filas Sintéticas)
            </h3>
            <div className="bg-slate-950 p-4 rounded-lg overflow-x-auto max-h-64 overflow-y-auto border border-slate-700/50">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700 sticky top-0 bg-slate-900">
                    {Object.keys(result.preview?.[0] || {}).map((col, i) => (
                      <th key={i} className="px-2 py-2 text-left text-purple-300 font-bold text-xs">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {result.preview?.map((row, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-2 py-2 text-slate-300 font-mono text-xs truncate max-w-xs">
                          {String(val).substring(0, 20)}
                        </td>
                      ))}
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>

          {/* BOTÓN CONTINUAR */}
          <button 
            onClick={() => {}}
            className="btn-primary w-full py-3"
          >
            ✅ Continuar al Paso 4 (Exportar)
          </button>
        </div>
      )}
    </section>
  )
}
