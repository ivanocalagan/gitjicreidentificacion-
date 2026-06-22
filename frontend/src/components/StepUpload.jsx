import React, { useState } from 'react'

export default function StepUpload({ setUploadData, setRiskData }){
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)
  const [fileName, setFileName] = useState(null)
  const [error, setError] = useState(null)
  const [dragActive, setDragActive] = useState(false)

  const handleFile = async e => {
    const file = e.target.files?.[0] || e.dataTransfer?.files?.[0]
    if(!file) return
    
    if(!file.name.endsWith('.csv') && !file.name.endsWith('.sql')) {
      setError('❌ Solo se aceptan archivos .csv y .sql')
      return
    }
    
    setError(null)
    setLoading(true)
    setFileName(file.name)
    setDragActive(false)
    
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

  const handleDrag = (e) => {
    e.preventDefault()
    e.stopPropagation()
    if (e.type === "dragenter" || e.type === "dragover") {
      setDragActive(true)
    } else if (e.type === "dragleave") {
      setDragActive(false)
    }
  }

  const handleDrop = (e) => {
    e.preventDefault()
    e.stopPropagation()
    setDragActive(false)
    handleFile(e)
  }

  return (
    <section>
      <h2 className="text-3xl font-bold mb-2 text-gradient">📤 Paso 1: Cargar Dataset</h2>
      <p className="text-slate-400 mb-8">Selecciona un archivo CSV o SQL con datos reales a anonimizar</p>
      
      <div 
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={`p-12 border-2 border-dashed rounded-2xl mb-8 bg-gradient-to-br transition-all duration-300 cursor-pointer group relative overflow-hidden ${
          dragActive 
            ? 'border-purple-400 from-purple-950/40 to-purple-950/20 shadow-lg shadow-purple-500/30' 
            : 'border-purple-500/40 from-purple-950/10 to-transparent hover:border-purple-400'
        }`}
      >
        <input 
          type="file" 
          accept=".csv,.sql" 
          onChange={handleFile}
          className="absolute inset-0 opacity-0 cursor-pointer"
        />
        <div className="text-center relative z-10">
          <p className="text-6xl mb-4 group-hover:animate-bounce transition-all">{dragActive ? '📥' : '📁'}</p>
          <p className="text-xl font-bold text-purple-300 mb-2">
            {dragActive ? '¡Suelta aquí!' : 'Arrastra tu archivo'}
          </p>
          <p className="text-sm text-slate-400">
            O haz clic para seleccionar (.csv o .sql)
          </p>
          <p className="text-xs text-slate-500 mt-3 text-opacity-60">
            Máximo: 100 MB | Formatos: CSV, SQL
          </p>
        </div>
        
        {/* Efecto de brillo */}
        <div className="absolute inset-0 bg-gradient-to-r from-transparent via-purple-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none" />
      </div>

      {error && (
        <div className="p-4 bg-red-900/30 border border-red-500/50 rounded-lg text-red-300 mb-4 slide-down-animation flex items-center gap-2">
          <span className="text-xl">⚠️</span>
          {error}
        </div>
      )}
      
      {loading && (
        <div className="text-center py-12 card mb-6">
          <div className="inline-block">
            <div className="w-12 h-12 border-4 border-slate-700 border-t-purple-500 rounded-full animate-spin mx-auto mb-3"></div>
            <p className="text-slate-300 font-medium">Cargando {fileName}...</p>
            <p className="text-xs text-slate-500 mt-1">Procesando archivo en servidor</p>
          </div>
        </div>
      )}

      {preview && fileName && (
        <div className="space-y-4 fade-in-animation">
          {/* ESTADÍSTICAS */}
          <div className="grid grid-cols-3 gap-4">
            <div className="card hover-lift bg-gradient-to-br from-purple-900/30 to-transparent border-purple-500/30">
              <p className="text-xs text-purple-300 font-semibold">📄 Archivo</p>
              <p className="text-lg font-bold text-purple-300 mt-1 truncate">{fileName}</p>
            </div>
            <div className="card hover-lift bg-gradient-to-br from-blue-900/30 to-transparent border-blue-500/30">
              <p className="text-xs text-blue-300 font-semibold">📊 Filas Detectadas</p>
              <p className="text-lg font-bold text-blue-300 mt-1">{preview.length || '?'}</p>
            </div>
            <div className="card hover-lift bg-gradient-to-br from-green-900/30 to-transparent border-green-500/30">
              <p className="text-xs text-green-300 font-semibold">🏛️ Columnas</p>
              <p className="text-lg font-bold text-green-300 mt-1">{Object.keys(preview[0] || {}).length}</p>
            </div>
          </div>

          {/* PREVIEW TABLA */}
          <div className="card bg-slate-900/80">
            <p className="text-xs text-slate-400 font-semibold mb-4 flex items-center gap-2">
              <span className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></span>
              Preview (primeras 5 filas)
            </p>
            <div className="bg-slate-950 p-4 rounded-xl overflow-x-auto max-h-64 overflow-y-auto border border-slate-700/50">
              <table className="w-full text-xs">
                <thead>
                  <tr className="border-b border-slate-700 sticky top-0 bg-slate-900">
                    {Object.keys(preview[0] || {}).map((col, i) => (
                      <th key={i} className="px-2 py-2 text-left text-purple-300 font-bold truncate">
                        {col}
                      </th>
                    ))}
                  </tr>
                </thead>
                <tbody>
                  {preview.map((row, i) => (
                    <tr key={i} className="border-b border-slate-800 hover:bg-slate-800/50 transition-colors">
                      {Object.values(row).map((val, j) => (
                        <td key={j} className="px-2 py-2 text-slate-300 truncate max-w-xs">
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
            className="btn-primary w-full mt-6 flex items-center justify-center gap-2"
          >
            <span>✅ Continuar al Paso 2</span>
            <span>→</span>
          </button>
        </div>
      )}
    </section>
  )
}
