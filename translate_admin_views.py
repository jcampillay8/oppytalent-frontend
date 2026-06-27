import re
import json
import urllib.request
import urllib.parse
import os

def translate_text(text):
    if not text.strip():
        return text
    url = f"https://translate.googleapis.com/translate_a/single?client=gtx&sl=es&tl=en&dt=t&q={urllib.parse.quote(text)}"
    try:
        req = urllib.request.Request(url, headers={'User-Agent': 'Mozilla/5.0'})
        response = urllib.request.urlopen(req)
        data = json.loads(response.read().decode('utf-8'))
        return ''.join([x[0] for x in data[0]])
    except Exception as e:
        print(f"Error translating '{text}': {e}")
        return text

def process_file(filepath, prefix):
    print(f"Processing {filepath}")
    with open(filepath, 'r') as f:
        content = f.read()

    template_match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not template_match:
        return None

    template_content = template_match.group(1)
    
    texts = {}
    counter = 1
    
    def replacer(match):
        nonlocal counter
        text = match.group(1)
        if not re.search(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ]', text) or '{{' in text or '}}' in text or '$t(' in text:
            return f">{text}<"
        
        clean_text = re.sub(r'\s+', ' ', text).strip()
        if not clean_text:
            return f">{text}<"
            
        key = f"{prefix}_{counter}"
        texts[key] = clean_text
        counter += 1
        
        leading = text[:len(text) - len(text.lstrip())]
        trailing = text[len(text.rstrip()):]
        return f">{leading}{{{{ $t('admin_{prefix}.{key}') }}}}{trailing}<"

    new_template = re.sub(r'>([^<]+)<', replacer, template_content)
    
    if new_template == template_content:
        print(f"No changes in {filepath}")
        return None
        
    new_content = content.replace(template_content, new_template)
    
    if 'useI18n' not in new_content:
        new_content = re.sub(r'<script setup>', "<script setup>\nimport { useI18n } from 'vue-i18n'\nconst { t, locale } = useI18n()", new_content)
        
    with open(filepath, 'w') as f:
        f.write(new_content)
        
    return texts

files = [
    ('src/views/public/PortfolioView.vue', 'portfolio_view'),
    ('src/views/admin/Dashboard.vue', 'dashboard'),
    ('src/views/admin/PerfilAdmin.vue', 'perfil'),
    ('src/views/admin/ProyectosAdmin.vue', 'proyectos'),
    ('src/views/admin/ExperienciasAdmin.vue', 'experiencias'),
    ('src/views/admin/EstudiosAdmin.vue', 'estudios'),
    ('src/views/admin/ReconocimientosAdmin.vue', 'reconocimientos'),
    ('src/views/admin/HabilitacionesAdmin.vue', 'habilitaciones'),
    ('src/views/admin/ShareAdmin.vue', 'share'),
    ('src/views/public/NetworkHub.vue', 'network'),
    ('src/views/admin/PlanConsumoAdmin.vue', 'storage'),
    ('src/views/admin/ChatConfigAdmin.vue', 'chat_config'),
    ('src/views/admin/ChatLogsAdmin.vue', 'chat_logs'),
    ('src/views/admin/AparienciaAdmin.vue', 'apariencia')
]

es_dict = {}
en_dict = {}

for filepath, prefix in files:
    if os.path.exists(filepath):
        extracted = process_file(filepath, prefix)
        if extracted:
            es_dict[f'admin_{prefix}'] = extracted
            en_dict[f'admin_{prefix}'] = {}
            for key, text in extracted.items():
                en_text = translate_text(text)
                en_dict[f'admin_{prefix}'][key] = en_text
                print(f"Translated: {text} -> {en_text}")
    else:
        print(f"File not found: {filepath}")

with open('src/locales/es.json', 'r') as f:
    es = json.load(f)
with open('src/locales/en.json', 'r') as f:
    en = json.load(f)
    
es.update(es_dict)
en.update(en_dict)

with open('src/locales/es.json', 'w') as f:
    json.dump(es, f, indent=2, ensure_ascii=False)
with open('src/locales/en.json', 'w') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

print("Done!")
