import re

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


def _is_email(s):
    try:
        return bool(re.match(r'^[^@]+@[^@]+\.[^@]+$', str(s)))
    except Exception:
        return False


def _is_synthetic_email_local(s):
    try:
        local = str(s).split('@', 1)[0]
        return bool(re.match(r'^user[0-9a-f]{4,}$', local))
    except Exception:
        return False


def _is_panama_cedula(s):
    try:
        return bool(re.match(r'^\d-\d{3}-\d{4}$', str(s)))
    except Exception:
        return False


def evaluate_risk(schema: dict, columns: list, preview: list = None) -> dict:
    """Evalúa riesgo considerando nombres de columnas y —si está disponible— una muestra (preview)
    para detectar señales de que los datos ya están sintetizados.
    Retorna score ajustado y una "synthesis_score" (0-100) indicando cuánto parece sintetizado el dataset.
    """
    # puntuación base por nombres
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

    # Si se proporciona una preview, analizar valores para detectar pistas de síntesis
    per_column_synth = {}
    synthesis_score = 0.0
    if preview and isinstance(preview, list) and len(preview) > 0:
        for col in columns:
            samples = [row.get(col) for row in preview if row.get(col) not in (None, '')]
            n = len(samples)
            if n == 0:
                per_column_synth[col] = 0.0
                continue
            lname = col.lower()
            synth_lik = 0.0
            # correos: detectar local parts como 'user' + hex
            if 'email' in lname or 'correo' in lname:
                emails = [s for s in samples if _is_email(s)]
                if len(emails) > 0:
                    synth_lik = sum(1 for e in emails if _is_synthetic_email_local(e)) / len(emails)
                else:
                    synth_lik = 0.0
            # ids tipo cedula con patrón generado por el motor sintético
            elif 'cedula' in lname or 'id_' in lname or lname.endswith('_id'):
                synth_lik = sum(1 for v in samples if _is_panama_cedula(v)) / n
            # numéricos: si hay muchas repeticiones (baja unicidad) puede indicar generación
            elif any(t in str(schema.get(col, '')).lower() for t in ['int', 'float', 'double', 'decimal', 'numeric']):
                try:
                    vals = [float(v) for v in samples]
                    uniq_frac = len(set(vals)) / len(vals)
                    synth_lik = 1.0 - uniq_frac
                    synth_lik = min(max(synth_lik, 0.0), 1.0)
                except Exception:
                    synth_lik = 0.0
            else:
                # categóricos/texto: buscar tokens 'user...' o hashes hexadecimales
                user_like = sum(1 for v in samples if isinstance(v, str) and (v.startswith('user') or re.match(r'^[0-9a-f]{6,}$', v)))
                synth_lik = user_like / n
            per_column_synth[col] = round(float(synth_lik), 3)

        # combinar por pesos según tipo de columna
        weights = {}
        for col in columns:
            lname = col.lower()
            if any(k in lname for k in DIRECT_IDENTIFIERS):
                weights[col] = 1.0
            elif any(k in lname for k in QUASI_IDENTIFIERS):
                weights[col] = 0.7
            elif any(k in lname for k in SENSITIVE_ATTRIBUTES):
                weights[col] = 0.5
            else:
                weights[col] = 0.3
        total_w = sum(weights.values()) if sum(weights.values()) > 0 else 1.0
        synthesis_score = sum(per_column_synth[c] * weights[c] for c in columns) / total_w

    # Ajustar la puntuación de riesgo en función de la síntesis detectada
    # Si synthesis_score == 1.0 -> riesgo muy reducido. Factor 0.9 para reducir agresivamente.
    adjusted_score = int(round(score * (1.0 - 0.9 * synthesis_score)))
    adjusted_score = max(0, min(100, adjusted_score))

    if adjusted_score >= 70:
        level = 'ALTO'
        color = '#EF4444'
    elif adjusted_score >= 40:
        level = 'MEDIO'
        color = '#F59E0B'
    else:
        level = 'BAJO'
        color = '#10B981'

    # Clasificación de síntesis (texto)
    synth_pct = int(round(synthesis_score * 100))
    if synth_pct >= 75:
        synth_level = 'ALTO'
    elif synth_pct >= 30:
        synth_level = 'MEDIO'
    else:
        synth_level = 'BAJO'

    recommendation = f"Se detectaron {len(direct)} identificadores directos. Se recomienda generación sintética con epsilon ≤ 1.0" if direct else "No se detectaron identificadores directos críticos."

    return {
        'risk_score': adjusted_score,
        'risk_level': level,
        'risk_color': color,
        'direct_identifiers': direct,
        'quasi_identifiers': quasi,
        'sensitive_attributes': sensitive,
        'safe_columns': safe,
        'recommendation': recommendation,
        'synthesis_score': synth_pct,
        'synthesis_level': synth_level,
        'per_column_synthesis': per_column_synth
    }
