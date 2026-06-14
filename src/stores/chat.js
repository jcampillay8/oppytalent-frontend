import { defineStore } from 'pinia'
import { ref } from 'vue'

export const useChatStore = defineStore('chat', () => {
  const messages = ref([])
  const currentChatUsername = ref(null)

  function addMessage(message) {
    messages.value.push(message)
  }

  function resetMessages(welcomeMsg, username) {
    messages.value = [
      { role: 'bot', content: welcomeMsg }
    ]
    if (username) {
      currentChatUsername.value = username
    }
  }

  function clearChat() {
    messages.value = []
    currentChatUsername.value = null
  }

  return { messages, currentChatUsername, addMessage, resetMessages, clearChat }
})
