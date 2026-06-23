# Explicación — SAGA DAT‑SIN

## Resumen
SAGA (Sistema Automatizado de Gestión y Anonimización) es un prototipo que permite subir un dataset, evaluar riesgo, generar datos sintéticos y exportarlos. El backend está implementado con FastAPI; el frontend es una aplicación React + Vite. Los datos se almacenan en memoria (SESSIONS) y los tokens son efímeros.

## Cómo se realizó (arquitectura)
- Backend: FastAPI (backend/main.py). Componentes principales en modules/: loader (lectura de CSV y preview), risk_evaluator (cálculo de factores de riesgo), synthetic_engine (generación sintética usando Faker y parámetros tipo epsilon/n_rows/seed), exporter (export CSV y generar PDF con reportlab).
- Frontend: React + Vite (frontend/). Consume los endpoints REST del backend.
- Almacenamiento: en memoria (diccionario SESSIONS). No se escribe en disco por diseño del prototipo.

## Endpoints principales
- POST /api/upload (multipart file) → procesa CSV y devuelve preview + session_token
- POST /api/evaluate-risk (JSON) → recibe schema y columns, devuelve evaluación de riesgo
- POST /api/generate (JSON) → recibe dataset_session_id, epsilon, n_rows, seed; devuelve preview sintético, generation_report y download_token
- GET /api/export/csv?token=<token> → descarga CSV sintético
- GET /api/export/pdf-report?token=<token> → descarga reporte PDF

## Cómo hacerlo funcional (Windows PowerShell)
1. Backend
   - Abrir PowerShell en C:\Users\Ivan\saga\backend
   - Crear/activar entorno virtual y ejecutar:
     ```powershell
     python -m venv .venv
     Set-ExecutionPolicy -Scope Process -ExecutionPolicy Bypass -Force; .\.venv\Scripts\Activate.ps1
     pip install -r requirements.txt
     uvicorn main:app --reload --port 8000
     ```
   - Documentación Swagger: http://localhost:8000/docs

2. Frontend
   - Abrir PowerShell en C:\Users\Ivan\saga\frontend
   - Ejecutar:
     ```powershell
     npm install
     npm run dev
     ```
   - Abrir: http://localhost:5173

3. Pruebas rápidas (ejemplos)
   - Subir CSV (curl):
     curl -X POST "http://localhost:8000/api/upload" -F "file=@C:\ruta\a\archivo.csv"
   - Evaluar riesgo (PowerShell):
     Get-Content .\backend\risk_payload.json -Raw | Invoke-RestMethod -Uri "http://localhost:8000/api/evaluate-risk" -Method Post -ContentType "application/json"
   - Generar (PowerShell):
     Get-Content .\backend\generate_payload.json -Raw | Invoke-RestMethod -Uri "http://localhost:8000/api/generate" -Method Post -ContentType "application/json"
   - Descargar CSV:
     curl -o synthetic.csv "http://localhost:8000/api/export/csv?token=<download_token>"

## Notas operativas y recomendaciones
- Los tokens de sesión son temporales y se pierden al reiniciar el backend.
- CORS: el backend permite por defecto http://localhost:5173; ajustarlo si se usa otro host/puerto.
- Requisitos: Python 3.10+, pip, Node 18+ (para Vite 5). Instalar dependencies si faltan.
- Si faltan paquetes Python, ejecutar `pip install -r backend/requirements.txt` dentro del virtualenv.
- Para producción, reemplazar almacenamiento en memoria por persistente y asegurar los endpoints (autenticación, límites, logging, manejo de secretos).

---
Ruta del documento: C:\Users\Ivan\saga\explicacion.md

