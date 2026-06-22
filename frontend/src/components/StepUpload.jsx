import React, { useState } from 'react'

export default function StepUpload({ setUploadData }){
  const [preview, setPreview] = useState(null)
  const [loading, setLoading] = useState(false)

  const handleFile = async e => {
    const file = e.target.files[0]
    if(!file) return
    setLoading(true)
    const fd = new FormData()
    fd.append('file', file)
    const res = await fetch('http://localhost:8000/api/upload', { method: 'POST', body: fd })
    const data = await res.json()
    setUploadData(data)
    setPreview(data.preview)
    setLoading(false)
  }

  return (
    <section>
      <h2 className="text-xl font-semibold mb-3">Paso 1 — Cargar dataset</h2>
      <div className="p-6 border-2 border-dashed border-violet-600 rounded mb-3">
        <input type="file" accept=".csv,.sql" onChange={handleFile} />
        <p className="text-sm text-slate-400 mt-2">Arrastra o selecciona .csv/.sql</p>
        {loading && <p className="mt-2">Cargando...</p>}
      </div>
      {preview && (
        <div className="bg-slate-700 p-3 rounded">
          <h3 className="font-medium">Preview (5 filas)</h3>
          <pre className="text-sm overflow-auto max-h-40">{JSON.stringify(preview, null, 2)}</pre>
        </div>
      )}
    </section>
  )
}
