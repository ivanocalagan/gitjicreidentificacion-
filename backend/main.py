from fastapi import FastAPI, UploadFile, File
from fastapi.responses import JSONResponse, StreamingResponse
from fastapi.middleware.cors import CORSMiddleware
from modules import loader, risk_evaluator, synthetic_engine, exporter
import pandas as pd
import io
import uuid

app = FastAPI(title='SAGA DAT-SIN')
app.add_middleware(CORSMiddleware, allow_origins=["http://localhost:5173"], allow_methods=["*"], allow_headers=["*"], allow_credentials=True)

# simple in-memory session store
SESSIONS = {}

@app.post('/api/upload')
async def api_upload(file: UploadFile = File(...)):
    result = loader.load_dataset(file)
    # store raw preview in session token (not persisted to disk)
    token = str(uuid.uuid4())
    SESSIONS[token] = {'upload': result}
    result['session_token'] = token
    return JSONResponse(result)

@app.post('/api/evaluate-risk')
async def api_evaluate_risk(payload: dict):
    schema = payload.get('schema', {})
    columns = payload.get('columns', [])
    res = risk_evaluator.evaluate_risk(schema, columns)
    return res

@app.post('/api/generate')
async def api_generate(payload: dict):
    token = payload.get('dataset_session_id')
    cfg = {'epsilon': payload.get('epsilon', 1.0), 'n_rows': payload.get('n_rows', 100), 'seed': payload.get('seed', 42)}
    session = SESSIONS.get(token)
    if not session:
        return JSONResponse({'error': 'session not found'}, status_code=404)
    upload = session['upload']
    # reconstruct dataframe from preview if available
    preview = upload.get('preview', [])
    df = pd.DataFrame(preview)
    generated = synthetic_engine.generate_synthetic_data(df, cfg)
    gen = generated['synthetic_df']
    gen_report = generated['generation_report']
    download_token = str(uuid.uuid4())
    SESSIONS[download_token] = {'synthetic': gen, 'report': gen_report, 'risk': payload.get('risk_eval', {})}
    return {'preview': gen.head(5).to_dict(orient='records'), 'generation_report': gen_report, 'download_token': download_token}

@app.get('/api/export/csv')
async def api_export_csv(token: str):
    s = SESSIONS.get(token)
    if not s or 'synthetic' not in s:
        return JSONResponse({'error': 'token invalid'}, status_code=404)
    csv_bytes = exporter.export_csv_bytes(s['synthetic'])
    return StreamingResponse(io.BytesIO(csv_bytes), media_type='text/csv', headers={"Content-Disposition": "attachment; filename=synthetic.csv"})

@app.get('/api/export/pdf-report')
async def api_export_pdf(token: str):
    s = SESSIONS.get(token)
    if not s:
        return JSONResponse({'error': 'token invalid'}, status_code=404)
    pdf = exporter.generate_pdf_report(s.get('risk', {}), s.get('report', {}))
    return StreamingResponse(io.BytesIO(pdf), media_type='application/pdf', headers={"Content-Disposition": "attachment; filename=report.pdf"})

if __name__ == '__main__':
    import uvicorn
    uvicorn.run('main:app', host='0.0.0.0', port=8000, reload=True)
