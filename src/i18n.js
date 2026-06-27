import { createI18n } from 'vue-i18n'
import es from './locales/es.json'
import en from './locales/en.json'

// Obtener idioma preferido del localStorage o navegador, por defecto 'es'
const savedLanguage = localStorage.getItem('user-language')
const defaultLanguage = savedLanguage || 'es'

export const i18n = createI18n({
  legacy: false, // Requerido para usar Composition API
  locale: defaultLanguage,
  fallbackLocale: 'es',
  messages: {
    es,
    en
  }
})
