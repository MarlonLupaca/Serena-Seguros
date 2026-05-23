import sys

input_file = "raw_reqs.txt"
output_file = r"C:\Users\strim\.gemini\antigravity\brain\7b21a897-7b75-4237-9f6b-574473036e0e\TABLAS_REQUERIMIENTOS.md"

with open(input_file, 'r', encoding='utf-8') as f:
    lines = f.readlines()

out = []
out.append("# Tablas de Requerimientos Funcionales y No Funcionales\n\n")

# Para mantener memoria de la ultima area si viene vacia
last_area = "Stakeholders"

for line in lines:
    parts = line.strip().split('\t')
    if len(parts) >= 4:
        area = parts[0].strip()
        if area == "(Vacío)" or not area:
            area = last_area
        else:
            last_area = area
            
        req_id = parts[1].strip()
        titulo = parts[2].strip()
        desc = parts[3].strip()
        
        if " – " in titulo:
            codigo, nombre = titulo.split(" – ", 1)
        elif "-" in titulo:
            codigo = titulo.split(" ")[0]
            nombre = titulo.replace(codigo, "").strip(" -")
        else:
            codigo = titulo
            nombre = titulo
            
        importancia = "Alta"
        if "RNF-" in codigo:
            importancia = "Vital"
        
        table = f"""### {codigo}

| Atributo | Detalle |
| :--- | :--- |
| **{codigo}** | **{nombre}** |
| **Versión** | 1.0 |
| **Autores** | Edwin Poblete |
| **Fuentes** | {area} |
| **Dependencias** | Ninguno |
| **Descripción** | {desc} |
| **Importancia** | {importancia} |
| **Estado** | Pendiente de verificación |
| **Comentarios** | Ninguno |

"""
        out.append(table)

with open(output_file, 'w', encoding='utf-8') as f:
    f.write("".join(out))

print("Markdown generado exitosamente en " + output_file)
