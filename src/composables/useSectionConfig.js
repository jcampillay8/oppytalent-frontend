import { reactive } from 'vue'
import { api } from '../services/api'

const defaults = reactive({
  tags: false,
  proyectos: true,
  experiencia: true,
  estudios: true
})

let loaded = false

export function useSectionConfig() {
  const fetchConfigs = async (username) => {
    if (loaded) return
    try {
      const response = await api.getSeccionConfigs(username)
      response.forEach(config => {
        if (defaults.hasOwnProperty(config.seccion)) {
          defaults[config.seccion] = config.is_expanded
        }
      })
      loaded = true
    } catch (error) {
      console.error('Error fetching section configs:', error)
    }
  }

  return { defaults, fetchConfigs }
}
