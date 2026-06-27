import json
import urllib.request
import urllib.parse
import os
import re

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

def parse_vue_template(content, prefix):
    match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not match:
        return content, {}

    template_content = match.group(1)
    
    in_tag = False
    in_quote = None
    
    chunks = []
    current_text = ""
    
    for char in template_content:
        if not in_tag:
            if char == '<':
                chunks.append(('text', current_text))
                current_text = "<"
                in_tag = True
            else:
                current_text += char
        else:
            if in_quote:
                if char == in_quote:
                    in_quote = None
                current_text += char
            else:
                if char in ('"', "'"):
                    in_quote = char
                current_text += char
                if char == '>':
                    chunks.append(('tag', current_text))
                    current_text = ""
                    in_tag = False
    if current_text:
        chunks.append(('text' if not in_tag else 'tag', current_text))
        
    texts = {}
    counter = 1
    new_template_content = ""
    
    for kind, text in chunks:
        if kind == 'text':
            if not re.search(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ]', text) or '{{' in text or '}}' in text or '$t(' in text:
                new_template_content += text
                continue
                
            clean_text = re.sub(r'\s+', ' ', text).strip()
            if not clean_text:
                new_template_content += text
                continue
                
            key = f"{prefix}_{counter}"
            texts[key] = clean_text
            counter += 1
            
            leading = text[:len(text) - len(text.lstrip())]
            trailing = text[len(text.rstrip()):]
            new_template_content += f"{leading}{{{{ $t('admin_{prefix}.{key}') }}}}{trailing}"
        else:
            # Handle placeholder inside tag
            def replacer_placeholder(m):
                nonlocal counter
                val = m.group(1)
                if not re.search(r'[a-zA-ZáéíóúÁÉÍÓÚñÑ]', val):
                    return m.group(0)
                key = f"{prefix}_{counter}"
                texts[key] = val
                counter += 1
                return f':placeholder="$t(\'admin_{prefix}.{key}\')"'
                
            text = re.sub(r'placeholder="([^"]+)"', replacer_placeholder, text)
            
            # Special case for ternary operators in text interpolations
            def replacer_ternary(m):
                nonlocal counter
                full, t1, t2 = m.group(0), m.group(1), m.group(2)
                k1 = f"{prefix}_{counter}"
                texts[k1] = t1
                counter += 1
                k2 = f"{prefix}_{counter}"
                texts[k2] = t2
                counter += 1
                return full.replace(f"'{t1}'", f"$t('admin_{prefix}.{k1}')").replace(f"'{t2}'", f"$t('admin_{prefix}.{k2}')")
                
            text = re.sub(r"\{\{\s*[^?]+\s*\?\s*'([^']+)'\s*:\s*'([^']+)'\s*\}\}", replacer_ternary, text)
            
            new_template_content += text
            
    new_content = content.replace(template_content, new_template_content)
    if 'useI18n' not in new_content and len(texts) > 0:
        # Move useI18n safely after existing imports. 
        # Find the last import.
        last_import = new_content.rfind('import ')
        if last_import != -1:
            end_of_line = new_content.find('\n', last_import)
            insertion_point = end_of_line + 1
            new_content = new_content[:insertion_point] + "import { useI18n } from 'vue-i18n'\nconst { t, locale } = useI18n()\n" + new_content[insertion_point:]
        else:
            new_content = re.sub(r'<script setup>', "<script setup>\nimport { useI18n } from 'vue-i18n'\nconst { t, locale } = useI18n()", new_content)
        
    return new_content, texts

es = json.load(open('src/locales/es.json'))
en = json.load(open('src/locales/en.json'))

files = [
    ('src/components/admin/ProyectoForm.vue', 'proyecto_form'),
    ('src/views/admin/ProyectosAdmin.vue', 'proyectos_admin')
]

es_dict = {}
en_dict = {}

for filepath, prefix in files:
    with open(filepath, 'r') as f:
        content = f.read()
        
    new_content, extracted = parse_vue_template(content, prefix)
    
    es_dict[f'admin_{prefix}'] = extracted
    en_dict[f'admin_{prefix}'] = {}

    for key, text in extracted.items():
        en_text = translate_text(text)
        en_dict[f'admin_{prefix}'][key] = en_text
        print(f"Translated: {text} -> {en_text}")

    with open(filepath, 'w') as f:
        f.write(new_content)

es.update(es_dict)
en.update(en_dict)

with open('src/locales/es.json', 'w') as f:
    json.dump(es, f, indent=2, ensure_ascii=False)
with open('src/locales/en.json', 'w') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

print("Done!")
