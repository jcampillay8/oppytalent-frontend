import json

es = json.load(open('src/locales/es.json'))
en = json.load(open('src/locales/en.json'))

replacements = {
    'FrasesAdmin.vue': [
        ('¿Para qué sirve esta sección?', 'admin_frases.why_title', '¿Para qué sirve esta sección?', 'What is this section for?'),
        ('Aquí puedes agregar frases célebres, poemas, citas inspiradoras o pensamientos que reflejen tu filosofía profesional. Estas citas se mostrarán aleatoriamente en la ventana del Asistente IA de tu portafolio público, permitiendo que los visitantes conecten de forma más personal contigo.', 'admin_frases.why_desc', 'Aquí puedes agregar frases célebres, poemas, citas inspiradoras o pensamientos que reflejen tu filosofía profesional. Estas citas se mostrarán aleatoriamente en la ventana del Asistente IA de tu portafolio público, permitiendo que los visitantes conecten de forma más personal contigo.', 'Here you can add famous phrases, poems, inspiring quotes or thoughts that reflect your professional philosophy. These quotes will be displayed randomly in the AI Assistant window of your public portfolio, allowing visitors to connect more personally with you.')
    ],
    'ChatConfigAdmin.vue': [
        ('Entrena a tu IA. Dile qué proyecto destacar cuando un reclutador pregunte por una habilidad específica (Máx. {{ maxRules }}).', 'admin_chat.train_ai_desc', 'Entrena a tu IA. Dile qué proyecto destacar cuando un reclutador pregunte por una habilidad específica (Máx. {maxRules}).', 'Train your AI. Tell it which project to highlight when a recruiter asks about a specific skill (Max {maxRules}).'),
        ('No tienes Agent Skills configurados. La IA usará su criterio predeterminado.', 'admin_chat.no_skills', 'No tienes Agent Skills configurados. La IA usará su criterio predeterminado.', 'You have no Agent Skills configured. The AI will use its default criteria.'),
        ('Si preguntan sobre:', 'admin_chat.if_ask_about', 'Si preguntan sobre:', 'If they ask about:'),
        ('>Sin condición<', 'admin_chat.no_condition', 'Sin condición', 'No condition'),
        ('>Sin argumento definido<', 'admin_chat.no_pitch', 'Sin argumento definido', 'No pitch defined'),
        ('Enlaza a:', 'admin_chat.links_to', 'Enlaza a:', 'Links to:'),
        ('title="Editar Skill"', 'admin_chat.edit_skill', 'Editar Skill', 'Edit Skill'),
        ('title="Eliminar Skill"', 'admin_chat.delete_skill', 'Eliminar Skill', 'Delete Skill'),
        ('Agregar Skill', 'admin_chat.add_skill', 'Agregar Skill', 'Add Skill'),
        ('Visibilidad B2B (Meta-Reclutador)', 'admin_chat.b2b_visibility', 'Visibilidad B2B (Meta-Reclutador)', 'B2B Visibility (Meta-Recruiter)'),
        ('Permitir que las empresas me encuentren', 'admin_chat.b2b_allow', 'Permitir que las empresas me encuentren', 'Allow companies to find me'),
        ('Al activar esto, tu perfil ("Clon Digital") será indexado en el Meta-Buscador privado de empresas de OppyTalent. Los Headhunters podrán encontrarte automáticamente según tus habilidades y experiencia, e invitar a tu IA al "Tribunal de IAs" para pre-evaluación.', 'admin_chat.b2b_desc', 'Al activar esto, tu perfil ("Clon Digital") será indexado en el Meta-Buscador privado de empresas de OppyTalent. Los Headhunters podrán encontrarte automáticamente según tus habilidades y experiencia, e invitar a tu IA al "Tribunal de IAs" para pre-evaluación.', 'By activating this, your profile ("Digital Clone") will be indexed in OppyTalent\'s private company Meta-Search engine. Headhunters will be able to find you automatically based on your skills and experience, and invite your AI to the "AI Tribunal" for pre-evaluation.'),
        ('Guardando preferencia...', 'admin_chat.saving_pref', 'Guardando preferencia...', 'Saving preference...'),
        ('Instruye a tu IA con formato Markdown para destacar tus mejores atributos.', 'admin_chat.modal_desc', 'Instruye a tu IA con formato Markdown para destacar tus mejores atributos.', 'Instruct your AI with Markdown format to highlight your best attributes.'),
        ('Condición (Si preguntan sobre...)', 'admin_chat.condition_label', 'Condición (Si preguntan sobre...)', 'Condition (If they ask about...)'),
        ('placeholder="Ej: IoT, Monitoreo, Liderazgo"', 'admin_chat.condition_placeholder', 'Ej: IoT, Monitoreo, Liderazgo', 'Ex: IoT, Monitoring, Leadership'),
        ('Enlace (Invitar a ver...)', 'admin_chat.link_label', 'Enlace (Invitar a ver...)', 'Link (Invite to see...)'),
        ('>-- Sin enlace --<', 'admin_chat.no_link', '-- Sin enlace --', '-- No link --'),
        ('label="Proyectos"', 'admin_chat.projects', 'Proyectos', 'Projects'),
        ('label="Experiencias"', 'admin_chat.experiences', 'Experiencias', 'Experiences'),
        ('label="Estudios & Certificaciones"', 'admin_chat.studies', 'Estudios & Certificaciones', 'Studies & Certifications'),
        ('label="Reconocimientos"', 'admin_chat.recognitions', 'Reconocimientos', 'Recognitions'),
        ('label="Habilitaciones"', 'admin_chat.certifications', 'Habilitaciones', 'Certifications'),
        ('label="Sobre Mí"', 'admin_chat.about_me', 'Sobre Mí', 'About Me'),
        ('>Ver perfil / Sobre mí<', 'admin_chat.view_profile', 'Ver perfil / Sobre mí', 'View profile / About me'),
        ('Acción (La IA argumentará que...)', 'admin_chat.action_label', 'Acción (La IA argumentará que...)', 'Action (The AI will argue that...)'),
        ('>Markdown mejora la precisión<', 'admin_chat.markdown_improves', 'Markdown mejora la precisión', 'Markdown improves precision'),
        ('placeholder="Ej: **Destaca que tengo experiencia con ESP32** y que el proyecto *FastAlert* es el mejor ejemplo..."', 'admin_chat.action_placeholder', 'Ej: **Destaca que tengo experiencia con ESP32** y que el proyecto *FastAlert* es el mejor ejemplo...', 'Ex: **Highlight that I have experience with ESP32** and that the *FastAlert* project is the best example...'),
        ('Usa asteriscos para **negritas** o *cursivas*, y guiones para viñetas.', 'admin_chat.markdown_help', 'Usa asteriscos para **negritas** o *cursivas*, y guiones para viñetas.', 'Use asterisks for **bold** or *italics*, and hyphens for bullets.'),
        ('Cancelar', 'common.cancel', 'Cancelar', 'Cancel'),
        ('Guardar Skill', 'admin_chat.save_skill', 'Guardar Skill', 'Save Skill')
    ]
}

if 'admin_frases' not in es:
    es['admin_frases'] = {}
    en['admin_frases'] = {}
if 'admin_chat' not in es:
    es['admin_chat'] = {}
    en['admin_chat'] = {}

for filename, reps in replacements.items():
    filepath = f"src/views/admin/{filename}"
    with open(filepath, 'r') as f:
        content = f.read()
    
    for search_str, key, es_val, en_val in reps:
        # Save json
        if not key.startswith('common.'):
            section, k = key.split('.')
            es[section][k] = es_val
            en[section][k] = en_val
            
        # Replace content
        if '{{ maxRules }}' in search_str:
            content = content.replace(search_str, "{{ $t('" + key + "', { maxRules }) }}")
        elif search_str.startswith('title='):
            content = content.replace(search_str, f':title="$t(\'{key}\')"')
        elif search_str.startswith('placeholder='):
            content = content.replace(search_str, f':placeholder="$t(\'{key}\')"')
        elif search_str.startswith('label='):
            content = content.replace(search_str, f':label="$t(\'{key}\')"')
        elif search_str.startswith('>'):
            content = content.replace(search_str, f'>{{{{ $t(\'{key}\') }}}}<')
        else:
            if key != 'common.cancel':
                content = content.replace(search_str, f"{{{{ $t('{key}') }}}}")
            else:
                # special replace for "Cancelar" to avoid breaking code words like "Cancelar" inside a string
                content = content.replace('>Cancelar<', f">{{{{ $t('{key}') }}}}<")
                content = content.replace(' Cancelar ', f" {{{{ $t('{key}') }}}} ")

    with open(filepath, 'w') as f:
        f.write(content)

with open('src/locales/es.json', 'w') as f:
    json.dump(es, f, indent=2, ensure_ascii=False)
with open('src/locales/en.json', 'w') as f:
    json.dump(en, f, indent=2, ensure_ascii=False)

print("Fixed!")
