import { defineStore } from 'pinia'
import { api } from '../services/api'

export const useChatP2PStore = defineStore('chatP2P', {
  state: () => ({
    conversations: [],
    unreadCount: 0,
    loading: false,
    intervalId: null
  }),
  actions: {
    async fetchConversations() {
      this.loading = true
      try {
        const data = await api.getChatConversations()
        this.conversations = data || []
        
        // Calcular unreadCount basándonos en la suma
        let totalUnread = 0
        this.conversations.forEach(c => {
          totalUnread += c.unread_count || 0
        })
        this.unreadCount = totalUnread
      } catch (err) {
        console.error('Error fetching conversations:', err)
      } finally {
        this.loading = false
      }
    },
    async fetchUnreadCount() {
      try {
        const res = await api.getChatUnreadCount()
        if (res) this.unreadCount = res.unread_count || 0
      } catch (err) {
        // Silently fail for background polling
      }
    },
    startPolling(intervalMs = 5000) {
      this.stopPolling()
      this.fetchUnreadCount()
      this.intervalId = setInterval(() => {
        this.fetchUnreadCount()
      }, intervalMs)
    },
    stopPolling() {
      if (this.intervalId) {
        clearInterval(this.intervalId)
        this.intervalId = null
      }
    }
  }
})
