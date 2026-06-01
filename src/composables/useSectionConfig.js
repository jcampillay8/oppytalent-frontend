import { reactive } from 'vue'
import api from '../api/axios'

const defaults = reactive({
  tags: false,
  proyectos: true,
  experiencia: true,
  estudios: true
})

let loaded = false

export function useSectionConfig() {
  const fetchConfigs = async () => {
    if (loaded) return
    try {
      const response = await api.get('/seccion_config/')
      response.data.forEach(config => {
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
