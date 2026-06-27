import json

def load_json(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

es = load_json('src/locales/es.json')
en = load_json('src/locales/en.json')

if 'admin_perfil_form' not in es:
    es['admin_perfil_form'] = {}
if 'admin_perfil_form' not in en:
    en['admin_perfil_form'] = {}

es['admin_perfil_form']['saving'] = "Guardando..."
en['admin_perfil_form']['saving'] = "Saving..."

es['admin_perfil_form']['save_changes'] = "Guardar Cambios"
en['admin_perfil_form']['save_changes'] = "Save Changes"

save_json('src/locales/es.json', es)
save_json('src/locales/en.json', en)
print("Added keys for save_changes")
