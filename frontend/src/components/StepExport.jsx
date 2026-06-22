import React from 'react'

export default function StepExport({ syntheticData }){
  if(!syntheticData) return <div className="text-center py-12"><p className="text-slate-400">Genera datos sintéticos en el Paso 3 primero</p></div>

  const downloadFile = (type, token) => {
    const url = `http://localhost:8000/api/export/${type}?token=${token}`
    window.open(url, '_blank')
  }

  const token = syntheticData?.download_token

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">💾 Paso 4: Exportar Resultados</h2>
      <p className="text-slate-400 mb-6">Descarga los datos sintéticos en tu computadora</p>

      <div className="mb-6 bg-green-900/20 border border-green-500/50 p-4 rounded-lg">
        <p className="text-green-300 font-semibold mb-2">✅ Anonimización Completada</p>
        <p className="text-sm text-slate-300">Los datos exportados cumplen con privacidad diferencial y la Ley 81 de Panamá. Ningún dato real fue almacenado.</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
        <div className="bg-slate-900/50 border-2 border-purple-500/30 hover:border-purple-500/60 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20" onClick={() => downloadFile('csv', token)}>
          <p className="text-3xl mb-3">📄</p>
          <h4 className="font-bold text-lg mb-2">CSV</h4>
          <p className="text-sm text-slate-400 mb-4">Base de datos en formato hoja de cálculo</p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-sm">
            ⬇️ Descargar CSV
          </button>
        </div>

        <div className="bg-slate-900/50 border-2 border-purple-500/30 hover:border-purple-500/60 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20" onClick={() => downloadFile('sql', token)}>
          <p className="text-3xl mb-3">🗄️</p>
          <h4 className="font-bold text-lg mb-2">SQL Script</h4>
          <p className="text-sm text-slate-400 mb-4">Script listo para importar en BD</p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-sm">
            ⬇️ Descargar SQL
          </button>
        </div>

        <div className="bg-slate-900/50 border-2 border-purple-500/30 hover:border-purple-500/60 p-6 rounded-xl cursor-pointer transition-all hover:shadow-lg hover:shadow-purple-500/20" onClick={() => downloadFile('pdf-report', token)}>
          <p className="text-3xl mb-3">📊</p>
          <h4 className="font-bold text-lg mb-2">PDF Reporte</h4>
          <p className="text-sm text-slate-400 mb-4">Evaluación de riesgo y cumplimiento</p>
          <button className="w-full px-4 py-2 bg-gradient-to-r from-purple-600 to-pink-600 hover:from-purple-500 hover:to-pink-500 rounded-lg font-semibold text-sm">
            ⬇️ Descargar PDF
          </button>
        </div>
      </div>

      <div className="mt-6 bg-purple-900/20 border border-purple-500/50 p-4 rounded-lg">
        <p className="text-xs text-slate-400 mb-2">Token de descarga:</p>
        <p className="text-xs font-mono text-slate-300 break-all">{token}</p>
      </div>
    </section>
  )
}
