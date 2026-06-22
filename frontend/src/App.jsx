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
    <div className="container-main min-h-screen">
      {/* HEADER ELEGANTE */}
      <header className="header-main">
        <div className="max-w-7xl mx-auto px-8 py-8">
          <div className="flex items-center justify-between mb-8 slide-down-animation">
            <div className="flex items-center gap-4">
              {/* Logo animado */}
              <div className="w-14 h-14 bg-gradient-to-br from-purple-500 to-pink-500 rounded-xl flex items-center justify-center font-bold text-2xl text-white shadow-lg glow-animation hover-lift">
                ∞
              </div>
              <div>
                <h1 className="text-5xl font-black text-gradient">DAT-SIN</h1>
                <p className="text-sm text-purple-300 font-medium">Sistema de Anonimización de Datos</p>
              </div>
            </div>
            <div className="text-right badge-purple px-4 py-2">
              <p className="text-sm font-bold">🔐 Privacidad Diferencial</p>
              <p className="text-xs text-purple-200">Ley 81 Panamá</p>
            </div>
          </div>

          {/* BARRA DE PROGRESO CON EFECTO */}
          <div className="space-y-2">
            <div className="flex items-center justify-between mb-2">
              <span className="text-xs font-semibold text-slate-400">Progreso General</span>
              <span className="text-xs font-bold text-purple-400">{Math.round(progressPercentage)}%</span>
            </div>
            <div className="progress-bar">
              <div 
                className="progress-bar-fill"
                style={{width: `${progressPercentage}%`}}
              />
            </div>
          </div>
        </div>
      </header>

      {/* CONTENIDO PRINCIPAL */}
      <main className="max-w-7xl mx-auto px-8 py-12">
        {/* BOTONES DE NAVEGACIÓN */}
        <div className="grid grid-cols-4 gap-3 mb-10 slide-down-animation">
          {[
            { num: 1, icon: '📤', label: 'Cargar' },
            { num: 2, icon: '⚠️', label: 'Riesgo' },
            { num: 3, icon: '🔮', label: 'Generar' },
            { num: 4, icon: '💾', label: 'Exportar' }
          ].map(({ num, icon, label }) => (
            <button 
              key={num} 
              onClick={() => setStep(num)} 
              className={`py-4 px-4 rounded-xl font-bold transition-all duration-300 transform ${
                step === num 
                  ? 'gradient-purple-pink shadow-lg shadow-purple-500/50 scale-105 hover-lift' 
                  : step > num
                  ? 'bg-slate-700 text-slate-300 hover:bg-slate-600'
                  : 'bg-slate-800 text-slate-400 hover:bg-slate-700 cursor-pointer hover-lift'
              }`}
            >
              <div className="text-2xl mb-1">{icon}</div>
              <div className="text-xs leading-tight">Paso {num}</div>
              <div className="text-xs text-opacity-75">{label}</div>
            </button>
          ))}
        </div>

        {/* CARD PRINCIPAL */}
        <div className="card fade-in-animation mb-8">
          {step===1 && <StepUpload setUploadData={setUploadData} setRiskData={setRiskData} />}
          {step===2 && <StepRisk uploadData={uploadData} setRiskData={setRiskData} />}
          {step===3 && <StepGenerate uploadData={uploadData} riskData={riskData} setSyntheticData={setSyntheticData} config={config} setConfig={setConfig} />}
          {step===4 && <StepExport syntheticData={syntheticData} />}
        </div>

        {/* FOOTER */}
        <footer className="text-center text-slate-500 text-xs border-t border-slate-700/50 pt-8 pb-4">
          <div className="inline-block badge-purple px-4 py-2 mb-3">
            ✨ DAT-SIN v1.0 — Ingeniería de Software Aplicada II
          </div>
          <p className="mt-2">© 2026 UTP FISC 1GS132 | Cumplimiento Ley 81 Protección de Datos Personales</p>
          <p className="text-xs text-slate-600 mt-1">Integrantes: Maryennis, Victor, Ivan, Ernesto</p>
        </footer>
      </main>
    </div>
  )
}
