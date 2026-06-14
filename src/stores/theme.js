import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useThemeStore = defineStore('theme', {
  state: () => ({
    currentTheme: 'dark-glass',
  }),
  actions: {
    setTheme(themeName) {
      this.currentTheme = themeName || 'dark-glass'
      
      // Limpiar clases anteriores
      document.documentElement.className = document.documentElement.className
        .split(' ')
        .filter(c => !c.startsWith('theme-'))
        .join(' ')
      
      // Aplicar nueva clase al HTML para que sea 100% global
      document.documentElement.classList.add(`theme-${this.currentTheme}`)
    },
    async fetchThemeForUser(username) {
      if (!username) return
      try {
        const user = await api.getUserByUsername(username)
        if (user && user.portfolio_theme) {
          this.setTheme(user.portfolio_theme)
        }
      } catch (err) {
        console.warn('Could not fetch theme for user:', err)
      }
    }
  }
})
