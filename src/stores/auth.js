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
    localStorage.removeItem('currentPortfolioUser')
    window.location.href = '/login'
  }

  async function impersonate(role_id) {
    loading.value = true
    try {
      const data = await api.impersonate(role_id)
      token.value = data.access_token || data.accessToken
      localStorage.setItem('token', token.value)
      // Refetch user context completely to re-trigger route guards and UI state
      await fetchUser()
    } finally {
      loading.value = false
    }
  }

  async function restoreRole() {
    loading.value = true
    try {
      const data = await api.restoreRole()
      token.value = data.access_token || data.accessToken
      localStorage.setItem('token', token.value)
      await fetchUser()
    } finally {
      loading.value = false
    }
  }

  return { user, token, loading, login, fetchUser, logout, impersonate, restoreRole }
})
