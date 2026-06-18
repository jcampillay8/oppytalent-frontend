const BASE_URL = '/api/v1'

async function request(endpoint, options = {}) {
  const token = localStorage.getItem('token')
  const headers = {
    ...(token ? { Authorization: `Bearer ${token}` } : {}),
    ...options.headers,
  }

  if (options.body && !(options.body instanceof FormData) && !headers['Content-Type']) {
    headers['Content-Type'] = 'application/json'
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
    return request('/user/profile')
  },
  
  updateGeminiKey(api_key) {
    return request('/user/gemini-key', {
      method: 'PUT',
      body: JSON.stringify({ api_key })
    })
  },
  
  // Users
  searchUsers(query) {
    return request(`/user/search?q=${encodeURIComponent(query)}`)
  },
  getUserByUsername(username) {
    return request(`/user/${encodeURIComponent(username)}`)
  },
  updateChatConfig(data) {
    return request('/user/chat-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },
  updateThemeConfig(data) {
    return request('/user/theme-config', {
      method: 'PUT',
      body: JSON.stringify(data),
    })
  },

  // Proyectos
  getProyectos(params = '') {
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/proyectos/${query}`)
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
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/experiencias/${query}`)
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
  getEstudios(params = '') {
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/estudios/${query}`)
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
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/perfil/${query}`)
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
  getFrases(params = '') {
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/frases/${query}`)
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
  getSeccionConfigs(username = '') {
    const user = username || localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/seccion_config/${query}`)
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
  },

  // CV Extraction
  extractCV(formData) {
    return request('/ai/cv-extract', {
      method: 'POST',
      body: formData
    })
  },

  // Chat
  getChatLogs() {
    return request('/chat/logs')
  },
  getChatStats() {
    return request('/chat/stats')
  },
  chat(messages) {
    const user = localStorage.getItem('currentPortfolioUser');
    return request('/chat/', { method: 'POST', body: JSON.stringify({ username: user, messages }) })
  },
  
  // Storage & OAuth
  getGoogleAuthUrl() {
    return request('/storage/google/login')
  },
  
  uploadImage(file) {
    const formData = new FormData()
    formData.append('file', file)
    // Usar fetch directamente porque enviamos FormData, no JSON
    const token = localStorage.getItem('token')
    return fetch('/api/v1/images/upload', {
      method: 'POST',
      headers: {
        'Authorization': `Bearer ${token}`
      },
      body: formData
    }).then(async (res) => {
      const data = await res.json()
      if (!res.ok) throw new Error(data.detail || 'Error uploading file')
      return data
    })
  },
  // Reconocimientos
  getReconocimientos(params = '') {
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/reconocimientos/${query}`)
  },
  getReconocimiento(id) {
    return request(`/reconocimientos/${id}`)
  },
  createReconocimiento(data) {
    return request('/reconocimientos/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateReconocimiento(id, data) {
    return request(`/reconocimientos/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteReconocimiento(id) {
    return request(`/reconocimientos/${id}`, { method: 'DELETE' })
  },

  // Habilitaciones
  getHabilitaciones(params = '') {
    const user = localStorage.getItem('currentPortfolioUser');
    const query = user ? `?username=${user}` : '';
    return request(`/habilitaciones/${query}`)
  },
  getHabilitacion(id) {
    return request(`/habilitaciones/${id}`)
  },
  createHabilitacion(data) {
    return request('/habilitaciones/', { method: 'POST', body: JSON.stringify(data) })
  },
  updateHabilitacion(id, data) {
    return request(`/habilitaciones/${id}`, { method: 'PUT', body: JSON.stringify(data) })
  },
  deleteHabilitacion(id) {
    return request(`/habilitaciones/${id}`, { method: 'DELETE' })
  },
}
