import { defineStore } from 'pinia'
import { api } from '../services/api'
import { useAuthStore } from './auth'

export const useChatP2PStore = defineStore('chatP2P', {
  state: () => ({
    conversations: [],
    unreadCount: 0,
    loading: false,
    ws: null,
    onNewMessageCallback: null
  }),
  actions: {
    async fetchConversations() {
      this.loading = true
      try {
        const data = await api.getChatConversations()
        let convs = data || []
        convs.sort((a, b) => new Date(b.updated_at) - new Date(a.updated_at))
        this.conversations = convs
        
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
    startPolling() {
      this.fetchUnreadCount()
      if (this.ws) return;
      
      const authStore = useAuthStore()
      if (!authStore.token) return;

      const protocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
      const host = window.location.host;
      const wsUrl = `${protocol}//${host}/api/v1/chat-p2p/ws?token=${authStore.token}`;
      
      this.ws = new WebSocket(wsUrl);

      this.ws.onmessage = async (event) => {
        try {
          const data = JSON.parse(event.data);
          if (data.type === 'new_message') {
            await this.fetchConversations();
            await this.fetchUnreadCount();
            if (this.onNewMessageCallback) {
              this.onNewMessageCallback(data);
            }
          }
        } catch(e) {
          console.error("WS error parsing message", e);
        }
      };

      this.ws.onclose = () => {
        this.ws = null;
        // Opcional: reconexión automática si el usuario sigue logueado
        setTimeout(() => {
          if (authStore.token) {
            this.startPolling();
          }
        }, 5000);
      };
    },
    stopPolling() {
      if (this.ws) {
        this.ws.close();
        this.ws = null;
      }
    }
  }
})
