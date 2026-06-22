import io
import pandas as pd
from fastapi import HTTPException

ALLOWED = {'.csv', '.sql'}

def load_dataset(upload_file) -> dict:
    filename = getattr(upload_file, 'filename', None) or str(upload_file)
    if not filename or not any(filename.lower().endswith(ext) for ext in ALLOWED):
        raise HTTPException(status_code=400, detail='Formato no permitido. Solo .csv y .sql')
    if filename.lower().endswith('.csv'):
        data = pd.read_csv(upload_file.file if hasattr(upload_file, 'file') else io.StringIO(upload_file.read().decode('utf-8')))
        preview = data.head(5).to_dict(orient='records')
        schema = {col: str(dtype) for col, dtype in data.dtypes.items()}
        return {
            'table_name': filename.rsplit('.', 1)[0],
            'columns': list(data.columns),
            'row_count': int(len(data)),
            'preview': preview,
            'schema': schema
        }
    # Minimal .sql handling: try to extract INSERT values
    if filename.lower().endswith('.sql'):
        text = upload_file.file.read().decode('utf-8') if hasattr(upload_file, 'file') else upload_file.read().decode('utf-8')
        # naive parsing omitted for brevity
        return {'table_name': filename.rsplit('.',1)[0], 'columns': [], 'row_count': 0, 'preview': [], 'schema': {}}
