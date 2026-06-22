Guía para capturas y documentación del proyecto SAGA

1. Pantalla principal del administrador
 - Captura de App.jsx mostrando la barra de pasos y el header.
 - Incluir el código de App.jsx en la documentación.

2. Paso 1 — Upload
 - Capturar el área de carga con el archivo sample_data\coopefisc_socios.csv seleccionado.
 - Incluir el fragmento de StepUpload.jsx y explicar: qué endpoint llama, qué devuelve (session_token).

3. Paso 2 — Termómetro de Riesgo
 - Capturar la respuesta de /api/evaluate-risk mostrando risk_score y listas.
 - Incluir fragmentos de risk_evaluator.py y la explicación del scoring (puntos por identificador).

4. Paso 3 — Generación
 - Capturar el slider de epsilon en acción y el preview sintético.
 - Incluir explicación de synthetic_engine.py: métodos por tipo de columna y fórmula Laplace.

5. Paso 4 — Exportación
 - Capturar tarjetas de descarga y ejemplo de archivo CSV descargado.
 - Explicar exporter.generate_pdf_report y el encabezado legal.

6. Capturas de código backend
 - main.py endpoints: /api/upload, /api/evaluate-risk, /api/generate, /api/export/*
 - Incluir ejemplo de curl para cada endpoint.

7. Notas de cumplimiento
 - Lista las restricciones absolutas (nunca escribir datos reales a disco, formato cedula panameña, etc.)

Con estas capturas y fragmentos de código podrás completar la sección Visual del proyecto final y anexar las imágenes en el documento Word.
