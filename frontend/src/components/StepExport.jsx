import React from 'react'

export default function StepExport({ syntheticData }){
  if(!syntheticData) return <p className="text-slate-400">Genera datos sintéticos antes de exportar.</p>

  const handleDownload = (type) =>{
    // token management omitted for demo – instruct user to use returned download_token
    alert('Usa los endpoints /api/export con el download_token devuelto por /api/generate')
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Paso 4 — Exportar</h2>
      <div className="grid grid-cols-3 gap-3">
        <div className="p-3 bg-slate-700 rounded">
          <h4>📄 CSV</h4>
          <p>Descarga CSV sintético</p>
          <button onClick={()=>handleDownload('csv')} className="mt-2 px-2 py-1 bg-violet-600 rounded">Descargar CSV</button>
        </div>
        <div className="p-3 bg-slate-700 rounded">
          <h4>🗄️ SQL</h4>
          <p>Script SQL para importar</p>
          <button onClick={()=>handleDownload('sql')} className="mt-2 px-2 py-1 bg-violet-600 rounded">Descargar SQL</button>
        </div>
        <div className="p-3 bg-slate-700 rounded">
          <h4>📊 PDF</h4>
          <p>Reporte de generación y riesgo</p>
          <button onClick={()=>handleDownload('pdf')} className="mt-2 px-2 py-1 bg-violet-600 rounded">Descargar PDF</button>
        </div>
      </div>
    </section>
  )
}
