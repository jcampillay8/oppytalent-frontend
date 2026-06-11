import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

export function getTranslated(item, localeVal) {
  if (!item) return null

  // Si el idioma es español o no hay traducciones, devolvemos el original
  if (localeVal === 'es' || !item.traducciones || item.traducciones.length === 0) {
    return item
  }

  // Buscamos la traducción para el idioma actual
  const trans = item.traducciones.find(t => t.idioma === localeVal)
  
  // Si existe la traducción, sobreescribimos los campos traducibles
  if (trans) {
    return {
      ...item,
      ...trans // Esto pisará campos como titulo, descripcion_corta, etc.
    }
  }

  return item
}

/**
 * Retorna una versión computada de un objeto que prioriza las traducciones
 * según el idioma actual. Si la traducción no existe, devuelve el original (español).
 */
export function useTranslatedData(itemRef) {
  const { locale } = useI18n()

  // Soportar el patrón antiguo donde se importaba { getTranslated } 
  // al llamar a useTranslatedData() sin parámetros
  if (!itemRef) {
    return { getTranslated }
  }

  return computed(() => {
    return getTranslated(itemRef.value, locale.value)
  })
}
