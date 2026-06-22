# SAGA — Sistema Automatizado de Gestión y Anonimización

## Estructura
- backend/: FastAPI backend
- frontend/: React + Vite frontend (scaffold)

## Backend (rápido)
cd backend
python -m venv .venv
.\.venv\Scripts\activate
pip install -r requirements.txt
uvicorn main:app --reload --port 8000

## Frontend (rápido)
cd frontend
npm install
npm run dev
# abrir http://localhost:5173

## Nota
Este scaffold instala módulos y proporciona endpoints básicos: /api/upload, /api/evaluate-risk, /api/generate y export endpoints. Los datos nunca se escriben a disco por diseño del prototipo.
