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

def parse_vue_template(content, prefix):
    # Find <template> ... </template>
    import re
    match = re.search(r'<template>(.*?)</template>', content, re.DOTALL)
    if not match:
        return content, {}

    template_content = match.group(1)
    
    in_tag = False
    in_quote = None
    
    chunks = []
    current_text = ""
    
    # Very basic tokenizer
    for i, char in enumerate(template_content):
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
            new_template_content += f"{leading}{{{{ $t('{prefix}.{key}') }}}}{trailing}"
        else:
            new_template_content += text
            
    new_content = content.replace(template_content, new_template_content)
    if 'useI18n' not in new_content and len(texts) > 0:
        new_content = re.sub(r'<script setup>', "<script setup>\nimport { useI18n } from 'vue-i18n'\nconst { t, locale } = useI18n()", new_content)
        
    return new_content, texts

files = [
    ('src/views/admin/Dashboard.vue', 'dash_v2'),
    ('src/views/private/NetworkHub.vue', 'network_hub'),
    ('src/components/ui/SearchSpotlight.vue', 'search_spot')
]

es_dict = {}
en_dict = {}

for filepath, prefix in files:
    if os.path.exists(filepath):
        with open(filepath, 'r') as f:
            content = f.read()
            
        new_content, extracted = parse_vue_template(content, prefix)
        
        # Manually extract specific attributes if needed (e.g. placeholder)
        import re
        if filepath.endswith('SearchSpotlight.vue'):
            new_content = new_content.replace('placeholder="Buscar talento... (⌘ + K)"', ':placeholder="$t(\'search_spot.placeholder\')"')
            extracted['placeholder'] = "Buscar talento... (⌘ + K)"
            
        if extracted:
            with open(filepath, 'w') as f:
                f.write(new_content)
            
            es_dict[prefix] = extracted
            en_dict[prefix] = {}
            for key, text in extracted.items():
                en_text = translate_text(text)
                en_dict[prefix][key] = en_text
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
