const BASE_URL = '/api/v1'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  const response = await fetch(`${BASE_URL}${endpoint}`, {
    ...options,
    headers,
  })

  if (response.status === 204) return null

  const data = await response.json()

  if (!response.ok) {
    const error = new Error(data.detail || 'API Error')
    error.status = response.status
    throw error
  }

  return data
}

export const api = {
  // Auth
  login(username, password) {
    return request('/auth/login', {
      method: 'POST',
      body: JSON.stringify({ username, password }),
    })
  },
  me() {
    return request('/auth/me')
  },

  // Proyectos
  getProyectos(params = '') {
    return request(`/proyectos/${params}`)
  },
  getProyecto(id) {
    return request(`/proyectos/${id}`)
  },
  createProyecto(data) {
    return request('/proyectos/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateProyecto(id, data) {
    return request(`/proyectos/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteProyecto(id) {
    return request(`/proyectos/${id}`, { method: 'DELETE' })
  },

  // Experiencias
  getExperiencias(params = '') {
    return request(`/experiencias/${params}`)
  },
  getExperiencia(id) {
    return request(`/experiencias/${id}`)
  },
  createExperiencia(data) {
    return request('/experiencias/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateExperiencia(id, data) {
    return request(`/experiencias/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteExperiencia(id) {
    return request(`/experiencias/${id}`, { method: 'DELETE' })
  },

  // Estudios
  getEstudios() {
    return request('/estudios/')
  },
  getEstudio(id) {
    return request(`/estudios/${id}`)
  },
  createEstudio(data) {
    return request('/estudios/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateEstudio(id, data) {
    return request(`/estudios/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteEstudio(id) {
    return request(`/estudios/${id}`, { method: 'DELETE' })
  },

  // Perfil
  getPerfil(params = '') {
    return request(`/perfil/${params}`)
  },
  getPerfilById(id) {
    return request(`/perfil/${id}`)
  },
  createPerfil(data) {
    return request('/perfil/', { method: 'POST', body: JSON.stringify(data) })
  },
  updatePerfil(id, data) {
    return request(`/perfil/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deletePerfil(id) {
    return request(`/perfil/${id}`, { method: 'DELETE' })
  },

  // Chat
  chat(messages) {
    return request('/chat/', {
      method: 'POST',
      body: JSON.stringify({ messages }),
    })
  },
  registerChatClick(logId, clickedLink) {
    return request(`/chat/${logId}/click`, {
      method: 'PATCH',
      body: JSON.stringify({ clicked_link: clickedLink }),
    })
  },
  getChatLogs() {
    return request('/chat/logs')
  },
  getChatStats() {
    return request('/chat/stats')
  },

  // Frases
  getFrases() {
    return request('/frases/')
  },
  getFrase(id) {
    return request(`/frases/${id}`)
  },
  createFrase(data) {
    return request('/frases/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateFrase(id, data) {
    return request(`/frases/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteFrase(id) {
    return request(`/frases/${id}`, { method: 'DELETE' })
  },

  // Seccion Configs
  getSeccionConfigs() {
    return request('/seccion_config/')
  },
  updateSeccionConfig(seccion, data) {
    return request(`/seccion_config/${seccion}`, { method: 'PUT', body: JSON.stringify(data) })
  },

  // AI Translation
  translateWithAI(content, targetLanguage = 'en') {
    return request('/ai/translate', {
      method: 'POST',
      body: JSON.stringify({ content, target_language: targetLanguage })
    })
  }
}
