import json

def update_locales():
    with open('src/locales/es.json', 'r') as f:
        es = json.load(f)
    with open('src/locales/en.json', 'r') as f:
        en = json.load(f)
        
    es['public_nav'] = {
        "features": "Funcionalidades",
        "talent": "Para Talentos",
        "b2b": "Para Empresas",
        "pricing": "Precios",
        "about": "Sobre OppyTalent",
        "language": "Idioma",
        "login": "Iniciar Sesión",
        "register": "Registrarse",
        "contact": "Contactar",
        "chat": "Chat",
        "dashboard": "Ir al Dashboard",
        "messages": "Mensajes",
        "network": "Red"
    }
    
    en['public_nav'] = {
        "features": "Features",
        "talent": "For Talent",
        "b2b": "For Business",
        "pricing": "Pricing",
        "about": "About OppyTalent",
        "language": "Language",
        "login": "Log In",
        "register": "Sign Up",
        "contact": "Contact",
        "chat": "Chat",
        "dashboard": "Go to Dashboard",
        "messages": "Messages",
        "network": "Network"
    }
    
    with open('src/locales/es.json', 'w') as f:
        json.dump(es, f, indent=2, ensure_ascii=False)
    with open('src/locales/en.json', 'w') as f:
        json.dump(en, f, indent=2, ensure_ascii=False)

update_locales()
