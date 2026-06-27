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
        return f">{leading}{{{{ $t('layout_{prefix}.{key}') }}}}{trailing}<"

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
    ('src/App.vue', 'app'),
    ('src/components/admin/AdminLayout.vue', 'admin')
]

es_dict = {}
en_dict = {}

for filepath, prefix in files:
    if os.path.exists(filepath):
        extracted = process_file(filepath, prefix)
        if extracted:
            es_dict[f'layout_{prefix}'] = extracted
            en_dict[f'layout_{prefix}'] = {}
            for key, text in extracted.items():
                en_text = translate_text(text)
                en_dict[f'layout_{prefix}'][key] = en_text
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
