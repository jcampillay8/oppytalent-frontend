import json

def escape_at_symbol(obj):
    if isinstance(obj, dict):
        return {k: escape_at_symbol(v) for k, v in obj.items()}
    elif isinstance(obj, list):
        return [escape_at_symbol(i) for i in obj]
    elif isinstance(obj, str):
        # We only want to escape if @ is not already escaped like {'@'}
        # But for simplicity, we'll just replace it if it's an email pattern or just simple replace.
        # Vue-i18n actually uses {'@'} to escape @
        # Let's replace any @ that is not surrounded by {' and '}
        # Actually just replace email@example.com with email{'@'}example.com
        return obj.replace('@', "{'@'}")
    return obj

files = ['src/locales/es.json', 'src/locales/en.json']
for file in files:
    with open(file, 'r') as f:
        data = json.load(f)
        
    data = escape_at_symbol(data)
    
    with open(file, 'w') as f:
        json.dump(data, f, indent=2, ensure_ascii=False)
