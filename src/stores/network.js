import { defineStore } from 'pinia'
import { api } from '../services/api'
import { useAuthStore } from './auth'

export const useNetworkStore = defineStore('network', {
  state: () => ({
    pendingRequests: [],
    pollInterval: null
  }),

  getters: {
    pendingCount: (state) => state.pendingRequests.length
  },

  actions: {
    async fetchPendingRequests() {
      const auth = useAuthStore()
      if (!auth.token) return
      
      try {
        const requests = await api.getPendingConnections()
        this.pendingRequests = requests || []
      } catch (error) {
        console.error("Error fetching pending requests:", error)
      }
    },

    startPolling() {
      if (this.pollInterval) return
      this.fetchPendingRequests()
      // Poll every 30 seconds
      this.pollInterval = setInterval(() => {
        this.fetchPendingRequests()
      }, 30000)
    },

    stopPolling() {
      if (this.pollInterval) {
        clearInterval(this.pollInterval)
        this.pollInterval = null
      }
      this.pendingRequests = []
    }
  }
})
