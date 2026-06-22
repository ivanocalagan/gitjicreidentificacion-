import pandas as pd
from faker import Faker
import random
from datetime import datetime, timedelta

fake = Faker('es_PA')
Faker.seed(42)

rows = []
for i in range(1, 51):
    birth_year = random.randint(1970, 2005)
    ingreso_date = datetime(random.randint(2018, 2024), random.randint(1, 12), random.randint(1, 28))
    
    # Generar cédula panameña: X-XXX-XXXX
    cedula = f"{random.randint(1,9)}-{random.randint(100,999)}-{random.randint(1000,9999)}"
    
    rows.append({
        'id_socio': i,
        'nombre': fake.name(),
        'cedula': cedula,
        'correo': fake.email(),
        'telefono': f"6{random.randint(100,999)}-{random.randint(1000,9999)}",
        'carrera': random.choice(['Ing. Sistemas', 'Ing. Civil', 'Desarrollo Software', 'Administración', 'Contabilidad']),
        'facultad': 'FISC',
        'fecha_ingreso': ingreso_date.strftime('%Y-%m-%d'),
        'saldo_ahorros': round(random.uniform(100, 5000), 2),
        'tipo_cuenta': random.choice(['Ahorro', 'Corriente', 'Inversión']),
        'estado': random.choice(['Activo', 'Inactivo', 'Suspendido'])
    })

df = pd.DataFrame(rows)
df.to_csv('coopefisc_socios.csv', index=False)
print(f"✅ {len(df)} filas generadas en coopefisc_socios.csv")
print(df.head())
