<template>
  <div class="min-h-[calc(100vh-4.5rem)] bg-background py-4 text-foreground transition-colors duration-300">
    <div class="max-w-[1300px] mx-auto h-[calc(100vh-100px)] flex bg-background/50 border border-border/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
      
      <!-- Panel Izquierdo: Lista de Chats -->
      <aside 
        class="w-full md:w-80 lg:w-96 bg-secondary/80 border-r border-border/50 flex flex-col overflow-hidden shrink-0 relative z-10 backdrop-blur-md" 
        :class="activeChat ? 'hidden md:flex' : 'flex'"
      >
        <div class="p-4 md:p-6 border-b border-border/50 flex items-center justify-between bg-card/30 backdrop-blur-md sticky top-0 z-20">
          <h2 class="text-xl font-bold flex items-center gap-2">
            <MessageSquare class="text-primary" />
            Mensajes
          </h2>
          <Badge v-if="chatStore.unreadCount > 0" variant="destructive" class="animate-pulse">
            {{ chatStore.unreadCount }} Nuevos
          </Badge>
        </div>

        <div v-if="chatStore.loading && !chatStore.conversations.length" class="flex-1 flex flex-col items-center justify-center p-8 text-primary">
          <Loader2 class="h-8 w-8 animate-spin mb-4" />
          <p class="text-sm text-muted-foreground">Cargando chats...</p>
        </div>

        <div v-else-if="!chatStore.conversations.length" class="flex-1 flex flex-col items-center justify-center p-8 text-center">
          <div class="w-16 h-16 rounded-full bg-secondary/50 flex items-center justify-center mb-4 border border-border">
            <MessageSquareOff class="h-8 w-8 text-muted-foreground" />
          </div>
          <h3 class="font-semibold text-lg text-foreground mb-1">Sin mensajes</h3>
          <p class="text-sm text-muted-foreground">Cuando alguien te contacte, aparecerá aquí.</p>
        </div>

        <div v-else class="flex-1 overflow-y-auto overflow-x-hidden p-3 custom-scrollbar space-y-2">
          <button 
            v-for="conv in chatStore.conversations" 
            :key="conv.id"
            @click="selectChat(conv)"
            class="w-full text-left p-3 rounded-xl flex items-center gap-3 transition-all duration-200 outline-none"
            :class="activeChat?.id === conv.id ? 'bg-primary/20 border-primary/30 shadow-sm' : 'hover:bg-secondary/50 border-transparent'"
          >
            <!-- Avatar -->
            <div class="relative shrink-0">
              <div class="w-12 h-12 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground overflow-hidden">
                <img v-if="conv.other_participant?.userImage || conv.other_participant?.avatar_url" 
                     :src="conv.other_participant?.userImage || conv.other_participant?.avatar_url" 
                     class="w-full h-full object-cover" />
                <User v-else class="w-6 h-6" />
              </div>
              <div v-if="conv.unread_count > 0" class="absolute -top-1 -right-1 w-4 h-4 bg-destructive border-2 border-background rounded-full"></div>
            </div>

            <!-- Content -->
            <div class="flex-1 min-w-0">
              <div class="flex items-center justify-between mb-1">
                <span class="font-semibold text-sm truncate pr-2 text-foreground">
                  {{ conv.other_participant?.first_name ? `${conv.other_participant.first_name} ${conv.other_participant.last_name || ''}` : conv.other_participant?.username }}
                </span>
                <span class="text-[10px] text-muted-foreground whitespace-nowrap">
                  {{ formatTime(conv.updated_at) }}
                </span>
              </div>
              <p class="text-xs truncate" :class="conv.unread_count > 0 ? 'text-foreground font-medium' : 'text-muted-foreground'">
                {{ conv.last_message?.content || 'Inicia la conversación...' }}
              </p>
            </div>
          </button>
        </div>
      </aside>

      <!-- Panel Derecho: Chat Activo -->
      <main 
        class="flex-1 flex flex-col bg-background/40 relative z-10 backdrop-blur-sm"
        :class="!activeChat ? 'hidden md:flex items-center justify-center' : 'flex'"
      >
        <!-- Estado Vacío -->
        <div v-if="!activeChat" class="text-center p-8 animate-in fade-in zoom-in duration-500">
          <div class="w-24 h-24 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-6 mx-auto">
            <MessageSquare class="h-10 w-10 text-primary opacity-80" />
          </div>
          <h2 class="text-2xl font-bold text-foreground mb-2">Tus Mensajes</h2>
          <p class="text-muted-foreground max-w-sm mx-auto">Selecciona una conversación en el panel lateral para empezar a chatear.</p>
        </div>

        <!-- Chat Header -->
        <template v-else>
          <div class="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-card/30 backdrop-blur-md sticky top-0 z-20">
            <div class="flex items-center gap-3">
              <button @click="activeChat = null" class="md:hidden p-2 -ml-2 rounded-lg text-muted-foreground hover:bg-secondary transition-colors">
                <ArrowLeft class="w-5 h-5" />
              </button>
              <div class="w-10 h-10 rounded-full bg-secondary border border-border flex items-center justify-center text-muted-foreground shrink-0 overflow-hidden">
                <img v-if="activeChat.other_participant?.userImage || activeChat.other_participant?.avatar_url" 
                     :src="activeChat.other_participant?.userImage || activeChat.other_participant?.avatar_url" 
                     class="w-full h-full object-cover" />
                <User v-else class="w-5 h-5" />
              </div>
              <div>
                <h3 class="font-bold text-foreground leading-tight">
                  {{ activeChat.other_participant?.first_name ? `${activeChat.other_participant.first_name} ${activeChat.other_participant.last_name || ''}` : activeChat.other_participant?.username }}
                </h3>
                <span class="text-xs text-primary font-medium">{{ activeChat.other_participant?.role || 'Talento' }}</span>
              </div>
            </div>
            <div class="flex items-center gap-3">
              <router-link :to="`/${activeChat.other_participant?.username?.split('@')[0]}`">
                <NeonButton variant="outline" class="hidden sm:flex" size="sm">
                  <template #icon-left><FolderKanban :size="16" /></template>
                  Ver Perfil
                </NeonButton>
                <button class="sm:hidden p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                  <FolderKanban :size="18" />
                </button>
              </router-link>
            </div>
          </div>

          <!-- Mensajes Body -->
          <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 custom-scrollbar relative" ref="messagesContainer">
            <div v-if="loadingMessages" class="absolute inset-0 flex items-center justify-center bg-background/50 backdrop-blur-sm z-10">
              <Loader2 class="h-8 w-8 text-primary animate-spin" />
            </div>

            <div 
              v-for="msg in messages" 
              :key="msg.id" 
              class="flex gap-4 max-w-[90%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-4 duration-300"
              :class="msg.sender_id === authStore.user?.id ? 'self-end flex-row-reverse' : 'self-start'"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm text-lg z-10 overflow-hidden" 
                   :class="msg.sender_id === authStore.user?.id ? 'bg-primary text-primary-foreground border-primary/20' : 'bg-secondary border-border/50 text-muted-foreground'">
                <template v-if="msg.sender_id === authStore.user?.id">
                  <img v-if="authStore.user?.userImage || authStore.user?.avatar_url" :src="authStore.user?.userImage || authStore.user?.avatar_url" class="w-full h-full object-cover" />
                  <User v-else :size="20" />
                </template>
                <template v-else>
                  <img v-if="activeChat.other_participant?.userImage || activeChat.other_participant?.avatar_url" :src="activeChat.other_participant?.userImage || activeChat.other_participant?.avatar_url" class="w-full h-full object-cover" />
                  <User v-else :size="20" />
                </template>
              </div>
              
              <!-- Burbuja de Chat -->
              <div 
                class="px-5 py-4 text-[15px] leading-relaxed shadow-sm relative group whitespace-pre-wrap break-words"
                :class="msg.sender_id === authStore.user?.id ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' : 'bg-secondary border border-border/50 text-foreground rounded-2xl rounded-tl-sm'"
              >
                {{ msg.content }}
                <div class="flex items-center justify-end mt-2 gap-1">
                  <span class="text-[10px]" :class="msg.sender_id === authStore.user?.id ? 'text-primary-foreground/70' : 'text-muted-foreground'">{{ formatTime(msg.created_at) }}</span>
                  <CheckCheck v-if="msg.sender_id === authStore.user?.id" class="w-3 h-3" :class="msg.is_read ? 'text-blue-300' : 'opacity-50'" />
                </div>
              </div>
            </div>
          </div>

          <!-- Chat Input -->
          <footer class="p-4 sm:p-6 border-t border-border/50 bg-card/30 backdrop-blur-md relative z-20">
            <form class="flex gap-2 max-w-4xl mx-auto items-end" @submit.prevent="sendMessage">
              <textarea
                ref="messageInput"
                v-model="newMessage"
                rows="1"
                class="flex-1 px-5 py-3.5 bg-secondary border border-border/50 text-foreground rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto max-h-32 custom-scrollbar"
                placeholder="Escribe un mensaje..."
                :disabled="sending"
                @keydown.enter.exact.prevent="sendMessage"
                @input="autoResize"
              ></textarea>
              <NeonButton type="submit" :disabled="!newMessage.trim() || sending" glow class="px-6 h-[52px] shrink-0 rounded-xl">
                <span class="hidden sm:inline mr-2">Enviar</span>
                <Send v-if="!sending" :size="18" class="sm:ml-1" />
                <Loader2 v-else :size="18" class="animate-spin sm:ml-1" />
              </NeonButton>
            </form>
          </footer>
        </template>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, nextTick, watch } from 'vue'
import { useRoute } from 'vue-router'
import { User, Send, CheckCheck, Loader2, MessageSquare, ArrowLeft, MessageSquareOff, FolderKanban } from 'lucide-vue-next'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { useAuthStore } from '../../stores/auth'
import { useChatP2PStore } from '../../stores/chat_p2p'
import { api } from '../../services/api'
import dayjs from 'dayjs'

const authStore = useAuthStore()
const chatStore = useChatP2PStore()
const route = useRoute()

const activeChat = ref(null)
const messages = ref([])
const newMessage = ref('')
const loadingMessages = ref(false)
const sending = ref(false)
const messagesContainer = ref(null)
const messageInput = ref(null)

let pollInterval = null

onMounted(async () => {
  await chatStore.fetchConversations()
  
  if (route.query.chat) {
    const targetChat = route.query.chat
    const conv = chatStore.conversations.find(c => c.other_participant?.username?.split('@')[0] === targetChat)
    if (conv) {
      await selectChat(conv)
    }
  }

  // Polling de mensajes activos
  pollInterval = setInterval(async () => {
    // Si no hay chat activo, actualizamos la lista
    if (!activeChat.value) {
      await chatStore.fetchConversations()
    } else {
      // Si hay chat activo, actualizamos mensajes (silent)
      try {
        const newMsgs = await api.getChatMessages(activeChat.value.id)
        if (newMsgs && newMsgs.length > messages.value.length) {
          messages.value = newMsgs
          scrollToBottom()
          // Mark as read si entran nuevos
          if (newMsgs[newMsgs.length - 1].sender_id !== authStore.user?.id) {
            await api.markChatAsRead(activeChat.value.id)
            chatStore.fetchUnreadCount()
            chatStore.fetchConversations() // Para actualizar la lista lateral
          }
        }
      } catch(e) {}
    }
  }, 5000)
})

onUnmounted(() => {
  if (pollInterval) clearInterval(pollInterval)
})

async function selectChat(conv) {
  activeChat.value = conv
  loadingMessages.value = true
  try {
    messages.value = await api.getChatMessages(conv.id)
    if (conv.unread_count > 0) {
      await api.markChatAsRead(conv.id)
      await chatStore.fetchUnreadCount()
      await chatStore.fetchConversations()
    }
    scrollToBottom()
  } catch (err) {
    console.error("Error cargando mensajes", err)
  } finally {
    loadingMessages.value = false
    nextTick(() => {
      messageInput.value?.focus()
    })
  }
}

async function sendMessage() {
  if (!newMessage.value.trim() || !activeChat.value || sending.value) return
  
  sending.value = true
  const content = newMessage.value.trim()
  newMessage.value = ''
  autoResize() // reset height

  try {
    const newMsg = await api.sendChatMessage(activeChat.value.id, content)
    messages.value.push(newMsg)
    
    // Actualizar conversación lateral localmente
    const convIdx = chatStore.conversations.findIndex(c => c.id === activeChat.value.id)
    if (convIdx !== -1) {
      chatStore.conversations[convIdx].last_message = newMsg
      chatStore.conversations[convIdx].updated_at = newMsg.created_at
      // Re-ordenar (mover arriba)
      const conv = chatStore.conversations.splice(convIdx, 1)[0]
      chatStore.conversations.unshift(conv)
    }

    scrollToBottom()
  } catch (err) {
    console.error("Error enviando", err)
  } finally {
    sending.value = false
  }
}

function scrollToBottom() {
  nextTick(() => {
    if (messagesContainer.value) {
      messagesContainer.value.scrollTop = messagesContainer.value.scrollHeight
    }
  })
}

function autoResize() {
  if (!messageInput.value) return
  messageInput.value.style.height = 'auto'
  messageInput.value.style.height = Math.min(messageInput.value.scrollHeight, 128) + 'px'
}

function formatTime(dateStr) {
  if (!dateStr) return ''
  const date = dayjs(dateStr)
  if (date.isSame(dayjs(), 'day')) {
    return date.format('HH:mm')
  }
  return date.format('DD MMM')
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsla(var(--primary), 0.2);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--primary), 0.4);
}
</style>
