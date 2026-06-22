import React, { useState } from 'react'
import StepUpload from './components/StepUpload'
import StepRisk from './components/StepRisk'
import StepGenerate from './components/StepGenerate'
import StepExport from './components/StepExport'

export default function App(){
  const [step, setStep] = useState(1)
  const [uploadData, setUploadData] = useState(null)
  const [riskData, setRiskData] = useState(null)
  const [syntheticData, setSyntheticData] = useState(null)
  const [config, setConfig] = useState({epsilon:1.0, n_rows:100})

  const progressPercentage = (step / 4) * 100

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-950 via-purple-950 to-slate-900 text-slate-50">
      <header className="bg-black bg-opacity-50 backdrop-blur-md border-b border-purple-500/30 sticky top-0 z-10">
        <div className="max-w-6xl mx-auto px-6 py-6">
          <div className="flex items-center justify-between mb-4">
            <div className="flex items-center gap-3">
              <div className="w-12 h-12 bg-gradient-to-br from-purple-500 to-pink-500 rounded-lg flex items-center justify-center font-bold text-lg">
                DS
              </div>
              <div>
                <h1 className="text-4xl font-black bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">DAT-SIN</h1>
                <p className="text-xs text-purple-300">Sistema de Anonimización de Datos</p>
              </div>
            </div>
            <div className="text-right">
              <p className="text-sm text-slate-400">Ley 81 Panamá</p>
              <p className="text-xs text-slate-500">Privacidad Diferencial</p>
            </div>
          </div>
          <div className="w-full bg-slate-700 h-1 rounded-full overflow-hidden">
            <div 
              className="bg-gradient-to-r from-purple-500 to-pink-500 h-full transition-all duration-500"
              style={{width: `${progressPercentage}%`}}
            />
          </div>
        </div>
      </header>

      <main className="max-w-6xl mx-auto px-6 py-8">
        <div className="grid grid-cols-4 gap-2 mb-8">
          {[1,2,3,4].map(n=> (
            <button 
              key={n} 
              onClick={()=>setStep(n)} 
              className={`py-3 px-4 rounded-lg font-semibold transition-all ${
                step===n 
                  ? 'bg-gradient-to-r from-purple-600 to-pink-600 shadow-lg shadow-purple-500/50 scale-105' 
                  : step > n
                  ? 'bg-slate-700 text-slate-300'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700'
              }`}
            >
              <span className="text-sm">
                {['📤', '⚠️', '🔮', '💾'][n-1]} Paso {n}
              </span>
            </button>
          ))}
        </div>

        <div className="bg-slate-800/50 backdrop-blur-sm border border-purple-500/20 rounded-2xl p-8 shadow-2xl">
          {step===1 && <StepUpload setUploadData={setUploadData} setRiskData={setRiskData} />}
          {step===2 && <StepRisk uploadData={uploadData} setRiskData={setRiskData} />}
          {step===3 && <StepGenerate uploadData={uploadData} riskData={riskData} setSyntheticData={setSyntheticData} config={config} setConfig={setConfig} />}
          {step===4 && <StepExport syntheticData={syntheticData} />}
        </div>

        <footer className="mt-12 text-center text-slate-500 text-xs border-t border-slate-700 pt-6">
          <p>DAT-SIN © 2026 | UTP FISC 1GS132 | Cumplimiento Ley 81 de Protección de Datos Personales</p>
        </footer>
      </main>
    </div>
  )
}
