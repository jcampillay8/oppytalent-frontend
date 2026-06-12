import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'

export const useAuthStore = defineStore('auth', () => {
  const user = ref(null)
  const token = ref(localStorage.getItem('token') || null)
  const loading = ref(false)

  async function login(username, password) {
    loading.value = true
    try {
      const data = await api.login(username, password)
      token.value = data.access_token
      localStorage.setItem('token', data.access_token)
      user.value = await api.me()
      localStorage.setItem('currentPortfolioUser', user.value.username)
    } finally {
      loading.value = false
    }
  }

  async function fetchUser() {
    if (!token.value) return
    try {
      user.value = await api.me()
      localStorage.setItem('currentPortfolioUser', user.value.username)
    } catch {
      logout()
    }
  }

  function logout() {
    user.value = null
    token.value = null
    localStorage.removeItem('token')
  }

  return { user, token, loading, login, fetchUser, logout }
})
