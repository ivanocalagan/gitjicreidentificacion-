import io
import pandas as pd
from reportlab.lib.pagesizes import letter
from reportlab.pdfgen import canvas


def export_csv_bytes(df: pd.DataFrame) -> bytes:
    buf = io.StringIO()
    df.to_csv(buf, index=False)
    return buf.getvalue().encode('utf-8')


def generate_pdf_report(risk_eval: dict, gen_report: dict) -> bytes:
    buf = io.BytesIO()
    c = canvas.Canvas(buf, pagesize=letter)
    c.setFont('Helvetica-Bold', 14)
    c.drawString(72, 720, 'SAGA — Framework DAT-SIN')
    c.setFont('Helvetica', 10)
    c.drawString(72, 700, f"Fecha: {pd.Timestamp.now().isoformat()}" )
    c.drawString(72, 680, f"Score de riesgo: {risk_eval.get('risk_score')}")
    c.drawString(72, 660, f"Epsilon usado: {gen_report.get('epsilon_used')}")
    c.drawString(72, 640, 'Declaración: Datos 100% sintéticos generados por SAGA. Cumple Ley 81 de Panamá.')
    c.showPage()
    c.save()
    buf.seek(0)
    return buf.read()
