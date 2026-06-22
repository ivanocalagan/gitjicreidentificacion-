import React, { useState } from 'react'

export default function StepGenerate({ uploadData, riskData, setSyntheticData, config, setConfig }){
  const [loading, setLoading] = useState(false)
  const [result, setResult] = useState(null)

  if(!uploadData) return <div className="text-center py-12"><p className="text-slate-400">Carga datos en el Paso 1 primero</p></div>

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
    if(eps <= 0.5) return '🔒 Privacidad máxima — distorsión estadística alta'
    if(eps <= 2.0) return '🛡️ Balance recomendado — privacidad y utilidad'
    return '⚠️ Mayor utilidad — privacidad reducida'
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">🔮 Paso 3: Generar Datos Sintéticos</h2>
      <p className="text-slate-400 mb-6">Configura parámetros de privacidad diferencial (DP)</p>

      <div className="bg-slate-900/50 border border-purple-500/30 p-6 rounded-xl mb-6 space-y-6">
        <div>
          <label className="block mb-2">
            <span className="text-sm font-semibold text-purple-300">Epsilon (ε): {config.epsilon.toFixed(1)}</span>
          </label>
          <input 
            type="range" 
            min="0.1" 
            max="10" 
            step="0.1" 
            value={config.epsilon} 
            onChange={e=>setConfig({...config, epsilon: parseFloat(e.target.value)})}
            className="w-full h-2 bg-slate-700 rounded-lg appearance-none cursor-pointer"
          />
          <p className="text-xs text-slate-400 mt-2">{getEpsilonDescription(config.epsilon)}</p>
        </div>

        <div>
          <label className="block mb-2 text-sm font-semibold text-purple-300">Filas a generar:</label>
          <input 
            type="number" 
            min="10" 
            max="10000" 
            value={config.n_rows} 
            onChange={e=>setConfig({...config, n_rows: parseInt(e.target.value)})}
            className="w-full px-3 py-2 bg-slate-700 border border-slate-600 rounded-lg text-slate-50"
          />
        </div>

        <button 
          onClick={generate} 
          disabled={loading}
          className="w-full py-3 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-bold text-lg disabled:opacity-50 transition-all"
        >
          {loading ? '⏳ Generando sintéticos...' : '🔮 Generar Datos Sintéticos'}
        </button>
      </div>

      {result && (
        <div className="space-y-4">
          <div className="bg-green-900/20 border border-green-500/50 p-4 rounded-lg">
            <p className="text-green-300 font-semibold mb-2">✅ Generación Exitosa</p>
            <div className="grid grid-cols-3 gap-3 text-sm">
              <div><span className="text-slate-400">Filas generadas:</span> <span className="font-bold text-green-300">{result.generation_report.rows_generated}</span></div>
              <div><span className="text-slate-400">Epsilon:</span> <span className="font-bold text-green-300">{result.generation_report.epsilon_used}</span></div>
              <div><span className="text-slate-400">Cumple Ley 81:</span> <span className="font-bold text-green-300">{result.generation_report.ley81_compliance ? 'Sí ✓' : 'No'}</span></div>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-purple-500/30 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Preview (primeras 5 filas sintéticas):</p>
            <div className="bg-slate-950 p-3 rounded overflow-x-auto max-h-40 overflow-y-auto text-xs font-mono text-slate-300">
              <pre>{JSON.stringify(result.preview, null, 2)}</pre>
            </div>
          </div>

          <div className="bg-slate-900/50 border border-purple-500/30 p-4 rounded-lg">
            <p className="text-xs text-slate-400 mb-2">Métodos por columna:</p>
            <div className="grid grid-cols-3 gap-2">
              {Object.entries(result.generation_report.method_per_column).map(([col, method], i) => (
                <span key={i} className="text-xs px-2 py-1 bg-slate-800 rounded">{col}: <span className="text-purple-300">{method}</span></span>
              ))}
            </div>
          </div>
        </div>
      )}
    </section>
  )
}
