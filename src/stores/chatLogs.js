import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useChatLogsStore = defineStore('chatLogs', {
  state: () => ({
    items: [],
    stats: [],
    loading: false,
    error: null,
  }),
  actions: {
    async fetchAll() {
      this.loading = true
      this.error = null
      try {
        this.items = await api.getChatLogs()
      } catch (error) {
        console.error('Error fetching chat logs:', error)
        this.error = 'No se pudieron cargar los registros del chat.'
      } finally {
        this.loading = false
      }
    },
    async fetchStats() {
      try {
        this.stats = await api.getChatStats()
      } catch (error) {
        console.error('Error fetching chat stats:', error)
      }
    },
  },
})
