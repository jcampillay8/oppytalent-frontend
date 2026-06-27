import json

def update_dict(d, keys, value):
    for key in keys[:-1]:
        d = d.setdefault(key, {})
    d[keys[-1]] = value

def load_json(filepath):
    with open(filepath, 'r') as f:
        return json.load(f)

def save_json(filepath, data):
    with open(filepath, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)

es = load_json('src/locales/es.json')
en = load_json('src/locales/en.json')

translations = [
    (['app_dropdown', 'my_company'], "Mi Empresa", "My Company"),
    (['app_dropdown', 'subscription'], "Suscripción y Créditos", "Subscription & Credits"),
    (['app_dropdown', 'my_ai_chat'], "Mi Chat IA", "My AI Chat"),
    (['app_dropdown', 'my_portfolio'], "Mi Portafolio", "My Portfolio"),
    (['app_dropdown', 'share'], "Compartir", "Share"),
    (['app_dropdown', 'my_network'], "Mi Red Profesional", "My Professional Network"),
    (['app_dropdown', 'impersonate_as'], "Probar como...", "Test as..."),
    (['app_dropdown', 'logout'], "Cerrar Sesión", "Sign Out"),
    (['app_dropdown', 'login'], "Iniciar Sesión", "Log In"),
    (['admin', 'sidebar', 'logout'], "Cerrar Sesión", "Sign Out"),
    (['admin', 'sidebar', 'my_trajectory'], "Mi Trayectoria", "My Trajectory"),
    (['admin', 'sidebar', 'share_profile'], "Compartir Perfil", "Share Profile"),
    (['admin', 'sidebar', 'my_network'], "Mi Red", "My Network"),
    (['admin', 'sidebar', 'appearance'], "Apariencia y Contenido", "Appearance & Content")
]

for keys, es_text, en_text in translations:
    update_dict(es, keys, es_text)
    update_dict(en, keys, en_text)

save_json('src/locales/es.json', es)
save_json('src/locales/en.json', en)
print("Keys added")
