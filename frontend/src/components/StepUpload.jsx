import React, { useState } from 'react'

export default function StepUpload({ setUploadData, setRiskData }){
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)

  const handleFile = async e => {
    const file = e.target.files[0]
    if(!file) return
    
    if(!file.name.endsWith('.csv') && !file.name.endsWith('.sql')) {
      setError('❌ Solo se aceptan archivos .csv y .sql')
      return
    }
    
    setError(null)
    setLoading(true)
    setFileName(file.name)
    
    const fd = new FormData()
    fd.append('file', file)
    try {
      const res = await fetch('http://localhost:8000/api/upload', { method: 'POST', body: fd })
      const data = await res.json()
      setUploadData(data)
      setPreview(data.preview)
      setRiskData(null)
    } catch(err) {
      setError('❌ Error al cargar: ' + err.message)
    }
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-2xl font-bold mb-2">📤 Paso 1: Cargar Dataset</h2>
      <p className="text-slate-400 mb-6">Selecciona un archivo CSV o SQL con datos reales a anonimizar</p>
      
      <div className="p-8 border-2 border-dashed border-purple-500/60 rounded-xl mb-6 bg-purple-950/20 hover:bg-purple-950/40 transition-all cursor-pointer relative">
        <input 
          type="file" 
          accept=".csv,.sql" 
          onChange={handleFile}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center">
          <p className="text-3xl mb-2">📁</p>
          <p className="text-lg font-semibold text-purple-300">Arrastra tu archivo aquí</p>
          <p className="text-sm text-slate-400 mt-1">O haz clic para seleccionar (.csv o .sql)</p>
        </div>
      </div>

      {error && <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 mb-4">{error}</div>}
      
      {loading && (
        <div className="text-center py-8">
          <div className="inline-block animate-spin text-3xl mb-2">⏳</div>
          <p className="text-slate-300">Cargando {fileName}...</p>
        </div>
      )}

      {preview && fileName && (
        <div className="bg-slate-900/50 border border-purple-500/30 p-6 rounded-xl">
          <div className="grid grid-cols-3 gap-4 mb-6">
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400">Archivo</p>
              <p className="text-lg font-bold text-purple-300">{fileName}</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400">Filas</p>
              <p className="text-lg font-bold text-purple-300">{preview[0]?.id_socio ? 'N/A' : preview.length} detectadas</p>
            </div>
            <div className="bg-slate-800 p-4 rounded-lg">
              <p className="text-xs text-slate-400">Columnas</p>
              <p className="text-lg font-bold text-purple-300">{Object.keys(preview[0] || {}).length}</p>
            </div>
          </div>
          <p className="text-xs text-slate-400 mb-3">Preview (primeras 5 filas):</p>
          <div className="bg-slate-950 p-3 rounded-lg overflow-x-auto max-h-40 overflow-y-auto text-xs font-mono text-slate-300">
            <pre>{JSON.stringify(preview, null, 2)}</pre>
          </div>
        </div>
      )}
    </section>
  )
}
