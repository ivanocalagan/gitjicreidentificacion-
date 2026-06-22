DIRECT_IDENTIFIERS = [
    "nombre", "name", "cedula", "id_nacional", "passport",
    "email", "correo", "telefono", "phone", "direccion", "address",
    "dni", "ruc", "nss", "cuenta_bancaria", "tarjeta"
]

QUASI_IDENTIFIERS = [
    "edad", "age", "genero", "gender", "sexo", "fecha_nacimiento",
    "birthdate", "carrera", "facultad", "fecha_ingreso", "codigo_postal",
    "zipcode", "municipio", "provincia", "salario", "saldo", "ingreso",
    "fecha_registro", "nacionalidad"
]

SENSITIVE_ATTRIBUTES = [
    "saldo_ahorros", "monto_prestamo", "monto", "deuda", "balance",
    "calificacion_credito", "historial", "estado_cuenta"
]


def evaluate_risk(schema: dict, columns: list) -> dict:
    score = 0
    direct = []
    quasi = []
    sensitive = []
    safe = []
    for col in columns:
        lname = col.lower()
        if any(k in lname for k in DIRECT_IDENTIFIERS):
            score += 35
            direct.append(col)
        elif any(k in lname for k in QUASI_IDENTIFIERS):
            score += 15
            quasi.append(col)
        elif any(k in lname for k in SENSITIVE_ATTRIBUTES):
            score += 10
            sensitive.append(col)
        else:
            safe.append(col)
    score = max(0, min(100, score))
    if score >= 70:
        level = 'ALTO'
        color = '#EF4444'
    elif score >= 40:
        level = 'MEDIO'
        color = '#F59E0B'
    else:
        level = 'BAJO'
        color = '#10B981'
    recommendation = f"Se detectaron {len(direct)} identificadores directos. Se recomienda generación sintética con epsilon ≤ 1.0" if direct else "No se detectaron identificadores directos críticos."
    return {
        'risk_score': score,
        'risk_level': level,
        'risk_color': color,
        'direct_identifiers': direct,
        'quasi_identifiers': quasi,
        'sensitive_attributes': sensitive,
        'safe_columns': safe,
        'recommendation': recommendation
    }
