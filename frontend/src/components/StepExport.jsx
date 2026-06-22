import React from 'react'

export default function StepExport({ syntheticData }){
  if(!syntheticData) return (
    <div className="text-center py-12 card">
      <div className="text-4xl mb-4">💾</div>
      <p className="text-slate-400 font-medium">Genera datos sintéticos en el Paso 3 primero</p>
    </div>
  )

  const downloadFile = (type, token) => {
    const url = `http://localhost:8000/api/export/${type}?token=${token}`
    window.open(url, '_blank')
  }

  const token = syntheticData?.download_token

  return (
    <section>
      <h2 className="text-3xl font-bold mb-2 text-gradient">💾 Paso 4: Exportar Resultados</h2>
      <p className="text-slate-400 mb-8">Descarga los datos anonimizados en tu computadora</p>

      {/* SUCCESS BANNER */}
      <div className="card bg-gradient-to-r from-green-900/40 via-green-800/30 to-transparent border-green-500/30 p-8 mb-8 text-center">
        <div className="text-5xl mb-4">✅</div>
        <h3 className="text-2xl font-bold text-green-300 mb-3">Anonimización Completada</h3>
        <p className="text-sm text-slate-300 leading-relaxed">
          Los datos exportados cumplen con <strong>Privacidad Diferencial</strong> y la <strong>Ley 81 de Panamá</strong>. 
          Ningún dato real fue almacenado en el servidor.
        </p>
      </div>

      {/* OPCIONES DE DESCARGA */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
        {/* CSV */}
        <div 
          onClick={() => downloadFile('csv', token)}
          className="card hover-lift cursor-pointer bg-gradient-to-br from-purple-900/20 to-transparent border-purple-500/30 group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📄</div>
          <h4 className="font-bold text-xl text-slate-100 mb-2">CSV</h4>
          <p className="text-sm text-slate-400 mb-4">Hoja de cálculo compatible con Excel</p>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">✓ Formato: .csv</p>
            <p className="text-xs text-slate-500">✓ Descarga directa</p>
          </div>
          <button 
            className="btn-primary w-full mt-4 text-sm py-2"
          >
            ⬇️ Descargar CSV
          </button>
        </div>

        {/* SQL */}
        <div 
          onClick={() => downloadFile('sql', token)}
          className="card hover-lift cursor-pointer bg-gradient-to-br from-blue-900/20 to-transparent border-blue-500/30 group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">🗄️</div>
          <h4 className="font-bold text-xl text-slate-100 mb-2">SQL Script</h4>
          <p className="text-sm text-slate-400 mb-4">Script ready para BD</p>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">✓ Compatible MySQL/PostgreSQL</p>
            <p className="text-xs text-slate-500">✓ Importación directa</p>
          </div>
          <button 
            className="btn-primary w-full mt-4 text-sm py-2"
          >
            ⬇️ Descargar SQL
          </button>
        </div>

        {/* PDF */}
        <div 
          onClick={() => downloadFile('pdf-report', token)}
          className="card hover-lift cursor-pointer bg-gradient-to-br from-red-900/20 to-transparent border-red-500/30 group"
        >
          <div className="text-6xl mb-4 group-hover:scale-110 transition-transform duration-300">📊</div>
          <h4 className="font-bold text-xl text-slate-100 mb-2">Reporte PDF</h4>
          <p className="text-sm text-slate-400 mb-4">Documentación completa</p>
          <div className="space-y-2">
            <p className="text-xs text-slate-500">✓ Evaluación de riesgo</p>
            <p className="text-xs text-slate-500">✓ Certificado de cumplimiento</p>
          </div>
          <button 
            className="btn-primary w-full mt-4 text-sm py-2"
          >
            ⬇️ Descargar PDF
          </button>
        </div>
      </div>

      {/* INFORMACIÓN ADICIONAL */}
      <div className="grid grid-cols-2 gap-6 mb-8">
        {/* TOKEN */}
        <div className="card p-6">
          <h3 className="text-sm font-bold text-slate-300 mb-4 flex items-center gap-2">
            <span>🔑</span> Token de Sesión
          </h3>
          <div className="bg-slate-950 p-4 rounded-lg border border-slate-700/50 break-all">
            <code className="text-xs text-slate-400 font-mono">{token}</code>
          </div>
          <p className="text-xs text-slate-500 mt-3">Identificador único para esta sesión</p>
        </div>

        {/* ESTADÍSTICAS */}
        <div className="card p-6 space-y-3">
          <h3 className="text-sm font-bold text-slate-300 mb-4">📊 Estadísticas</h3>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-sm text-slate-400">Filas generadas:</span>
            <span className="font-bold text-purple-300">{syntheticData?.generation_report?.rows_generated}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-sm text-slate-400">Epsilon aplicado:</span>
            <span className="font-bold text-blue-300">{syntheticData?.generation_report?.epsilon_used}</span>
          </div>
          <div className="flex items-center justify-between p-3 bg-slate-700/30 rounded-lg">
            <span className="text-sm text-slate-400">Ley 81 cumplida:</span>
            <span className="font-bold text-green-300">
              {syntheticData?.generation_report?.ley81_compliance ? '✓ Sí' : '✗ No'}
            </span>
          </div>
        </div>
      </div>

      {/* INFORMACIÓN DE SEGURIDAD */}
      <div className="card p-6 bg-gradient-to-br from-blue-900/30 to-transparent border-blue-500/30">
        <h3 className="text-sm font-bold text-blue-300 mb-4 flex items-center gap-2">
          <span>🔒</span> Garantías de Privacidad
        </h3>
        <ul className="space-y-3">
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <span className="text-green-400 font-bold">✓</span>
            <span><strong>Privacidad Diferencial:</strong> Ruido matemático aplicado a todos los datos numéricos</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <span className="text-green-400 font-bold">✓</span>
            <span><strong>Anonimización:</strong> Identificadores directos removidos o anonimizados</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <span className="text-green-400 font-bold">✓</span>
            <span><strong>Conformidad Ley 81:</strong> Cumple con todas las regulaciones de Panamá</span>
          </li>
          <li className="flex items-start gap-3 text-sm text-slate-300">
            <span className="text-green-400 font-bold">✓</span>
            <span><strong>Sesión Temporal:</strong> Datos no persistentes, eliminados tras cierre de sesión</span>
          </li>
        </ul>
      </div>

      {/* FOOTER */}
      <div className="mt-8 pt-6 border-t border-slate-700/30 text-center">
        <p className="text-xs text-slate-500">
          🎉 <strong>¡Proceso completado exitosamente!</strong> 
        </p>
        <p className="text-xs text-slate-600 mt-2">
          Los datos sintéticos están listos para usar, analizar o compartir sin riesgos de privacidad.
        </p>
      </div>
    </section>
  )
}
