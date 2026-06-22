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

  return (
    <div className="min-h-screen bg-slate-900 text-slate-50 p-6">
      <header className="max-w-4xl mx-auto mb-6">
        <h1 className="text-3xl font-bold">SAGA — Panel administrador</h1>
        <p className="text-sm text-slate-400">Carga, evalúa riesgo, genera datos sintéticos y exporta.</p>
      </header>
      <main className="max-w-4xl mx-auto bg-slate-800 p-6 rounded-lg">
        <nav className="flex gap-2 mb-4">
          {[1,2,3,4].map(n=> (
            <button key={n} onClick={()=>setStep(n)} className={`px-3 py-1 rounded ${step===n? 'bg-violet-600':'bg-slate-700'}`}>Paso {n}</button>
          ))}
        </nav>
        {step===1 && <StepUpload setUploadData={setUploadData} setRiskData={setRiskData} />}
        {step===2 && <StepRisk uploadData={uploadData} setRiskData={setRiskData} />}
        {step===3 && <StepGenerate uploadData={uploadData} riskData={riskData} setSyntheticData={setSyntheticData} config={config} setConfig={setConfig} />}
        {step===4 && <StepExport syntheticData={syntheticData} />}
      </main>
    </div>
  )
}
