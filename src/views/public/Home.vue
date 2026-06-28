<template>
  <div class="min-h-[calc(100vh-4.5rem)] bg-background py-4 text-foreground transition-colors duration-300" :class="portfolioThemeClass">
    <div class="max-w-[1300px] mx-auto h-[calc(100vh-100px)] flex bg-background/50 border border-border/50 rounded-2xl overflow-hidden shadow-2xl backdrop-blur-xl relative">
      
      <!-- Sidebar / Perfil Breve en Escritorio -->
      <aside class="w-80 bg-secondary/80 border-r border-border/50 p-8 flex flex-col gap-8 overflow-y-auto hidden md:flex custom-scrollbar relative z-10 backdrop-blur-md">
        <!-- Profile Card -->
        <div class="flex flex-col items-center text-center">
          <div class="mb-5 relative group">
            <div class="w-28 h-28 rounded-full overflow-hidden border-4 border-primary/20 shadow-xl relative z-10 bg-secondary transition-transform duration-300 group-hover:scale-105">
              <img v-if="avatarUrl || portfolioUser?.userImage" :src="avatarUrl || portfolioUser.userImage" :alt="portfolioUser?.firstName || 'Avatar'" class="w-full h-full object-cover" />
              <div v-else class="w-full h-full flex items-center justify-center text-4xl font-bold text-muted-foreground">
                {{ portfolioUser ? (portfolioUser.firstName || portfolioUser.username || 'U').charAt(0) + (portfolioUser.lastName || '').charAt(0) : '...' }}
              </div>
            </div>
            <!-- Glow effect behind avatar -->
            <div class="absolute inset-0 bg-primary/30 rounded-full blur-xl scale-110 z-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
          </div>
          
          <h2 class="text-2xl font-bold text-foreground mb-1">{{ perfilStore.items[0]?.nombre_completo || (portfolioUser ? `${portfolioUser.firstName || portfolioUser.username} ${portfolioUser.lastName || ''}` : 'Cargando...') }}</h2>
          <p class="text-sm font-medium text-muted-foreground mb-4 leading-relaxed">{{ perfilStore.items[0]?.ocupacion || portfolioUser?.occupation || 'Profesional' }}</p>
          
        </div>

        <!-- Sidebar Help / Quote -->
        <div v-if="tFrase" class="bg-card/50 border border-border/50 p-5 rounded-xl mt-auto relative overflow-hidden group">
          <!-- Decoración de vidrio -->
          <div class="absolute top-0 right-0 w-16 h-16 bg-gradient-to-br from-white/10 to-transparent opacity-50 rounded-bl-full pointer-events-none"></div>
          
          <h3 class="text-sm font-bold text-primary mb-3 flex items-center gap-2">
            <Quote :size="16" /> {{ $t('portfolio.frases') }}
          </h3>
          <blockquote class="text-sm italic text-muted-foreground leading-relaxed relative z-10">
            "{{ tFrase.texto }}"
            <footer class="mt-3 text-xs font-bold text-primary text-right not-italic">— {{ tFrase.autor }}</footer>
          </blockquote>
        </div>
      </aside>

      <!-- Ventana Principal de Chat -->
      <main class="flex-1 flex flex-col bg-background/40 relative z-10 backdrop-blur-sm">
        
        <!-- Chat Header -->
        <div class="px-6 py-4 border-b border-border/50 flex justify-between items-center bg-card/30 backdrop-blur-md sticky top-0 z-20">
          <div>
            <h2 class="text-lg font-bold text-foreground flex items-center gap-2">
              <Bot :size="20" class="text-primary" /> {{ $t('home.title') }}
            </h2>
            <p class="text-xs text-primary flex items-center gap-1.5 font-medium mt-0.5">
              <span class="w-2 h-2 rounded-full bg-primary animate-pulse"></span> {{ $t('home.online') }}
            </p>
          </div>
          <div class="flex items-center gap-3">
            <button 
              v-if="authStore.token" 
              @click="resetChatConversation" 
              class="p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors" 
              title="Reiniciar Conversación"
            >
              <RotateCcw :size="18" />
            </button>
            <router-link to="/portafolio">
              <NeonButton variant="outline" class="hidden sm:flex" size="sm">
                <template #icon-left><FolderKanban :size="16" /></template>
                {{ $t('home.view_portfolio') }}
              </NeonButton>
              <button class="sm:hidden p-2 text-muted-foreground hover:text-primary hover:bg-primary/10 rounded-lg transition-colors">
                <FolderKanban :size="18" />
              </button>
            </router-link>
          </div>
        </div>

        <!-- Cuerpo del Chat -->
        <div class="flex-1 overflow-y-auto p-4 sm:p-6 lg:p-8 flex flex-col gap-6 custom-scrollbar" ref="chatBody" @click="handleChatClick">
          
          <template v-if="!isPortfolioEmpty">
            <div 
              v-for="(msg, i) in messages" 
              :key="i" 
              class="flex gap-4 max-w-[90%] sm:max-w-[85%] animate-in fade-in slide-in-from-bottom-4 duration-300"
              :class="msg.role === 'user' ? 'self-end flex-row-reverse' : 'self-start'"
              :data-log-id="msg.log_id"
            >
              <div class="w-10 h-10 rounded-full flex items-center justify-center shrink-0 border shadow-sm text-lg z-10" :class="msg.role === 'user' ? 'bg-primary text-primary-foreground border-primary/20' : 'bg-secondary border-border/50'">
                <Bot v-if="msg.role === 'bot'" :size="20" class="text-foreground" />
                <User v-else :size="20" />
              </div>
              
              <!-- Burbuja de Chat -->
              <div 
                class="px-5 py-4 text-[15px] leading-relaxed shadow-sm relative group"
                :class="msg.role === 'user' ? 'bg-primary text-primary-foreground rounded-2xl rounded-tr-sm' : 'bg-secondary border border-border/50 text-foreground rounded-2xl rounded-tl-sm markdown-body'"
                v-html="renderMarkdown(msg.content)"
              ></div>
            </div>
          </template>

          <!-- Loading Indicator -->
          <div v-if="loading" class="flex gap-4 max-w-[85%] self-start animate-in fade-in duration-300">
            <div class="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center shrink-0 shadow-sm text-lg z-10">
              <Bot :size="20" class="text-foreground" />
            </div>
            <div class="bg-secondary border border-border/50 px-5 py-4 rounded-2xl rounded-tl-sm flex items-center gap-1.5 h-[52px]">
              <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 0ms"></div>
              <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 150ms"></div>
              <div class="w-2 h-2 bg-primary/60 rounded-full animate-bounce" style="animation-delay: 300ms"></div>
            </div>
          </div>

          <!-- Empty Portfolio Indicator -->
          <div v-if="isPortfolioEmpty" class="flex gap-4 max-w-[85%] self-start">
            <div class="w-10 h-10 rounded-full bg-secondary border border-border/50 flex items-center justify-center shrink-0 shadow-sm text-lg">
              <Bot :size="20" class="text-foreground" />
            </div>
            <div class="bg-secondary border border-border/50 text-foreground px-5 py-4 rounded-2xl rounded-tl-sm text-[15px] leading-relaxed shadow-sm">
              <p v-if="isOwner">
                ¡Hola! Tu portafolio parece estar vacío. Agrega al menos un proyecto, experiencia, estudio o tus datos de "Sobre Mí" en el <router-link to="/admin" class="text-primary hover:underline font-semibold">Panel de Administración</router-link> para habilitar este chat interactivo.
              </p>
              <p v-else>
                El portafolio de este usuario aún está en construcción. El chat se habilitará cuando agregue información a su perfil.
              </p>
            </div>
          </div>
        </div>

        <!-- Chat Footer -->
        <footer class="p-4 sm:p-6 border-t border-border/50 bg-card/30 backdrop-blur-md relative z-20">
          <!-- Sugerencias (Chips) -->
          <div class="flex flex-wrap justify-center gap-2 mb-4" v-if="!isPortfolioEmpty && (portfolioUser?.chat_suggested_q1 || portfolioUser?.chat_suggested_q2 || portfolioUser?.chat_suggested_q3)">
            <button v-if="portfolioUser?.chat_suggested_q1" @click="input = portfolioUser.chat_suggested_q1; send()" class="px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-secondary/50 border border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all shadow-sm">
              {{ portfolioUser.chat_suggested_q1 }}
            </button>
            <button v-if="portfolioUser?.chat_suggested_q2" @click="input = portfolioUser.chat_suggested_q2; send()" class="px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-secondary/50 border border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all shadow-sm">
              {{ portfolioUser.chat_suggested_q2 }}
            </button>
            <button v-if="portfolioUser?.chat_suggested_q3" @click="input = portfolioUser.chat_suggested_q3; send()" class="px-4 py-2 rounded-full text-xs sm:text-sm font-medium bg-secondary/50 border border-border/50 text-muted-foreground hover:bg-secondary hover:text-foreground hover:border-primary/30 transition-all shadow-sm">
              {{ portfolioUser.chat_suggested_q3 }}
            </button>
          </div>
          
          <form class="flex gap-2 max-w-4xl mx-auto items-end" @submit.prevent="send">
            <textarea
              ref="chatInputRef"
              v-model="input"
              rows="1"
              class="flex-1 px-5 py-3.5 bg-secondary border border-border/50 text-foreground rounded-xl outline-none focus:ring-2 focus:ring-primary/50 transition-all text-[15px] shadow-sm disabled:opacity-50 disabled:cursor-not-allowed resize-none overflow-y-auto max-h-32 custom-scrollbar"
              :placeholder="isPortfolioEmpty ? 'El chat está deshabilitado temporalmente...' : $t('home.placeholder')"
              :disabled="loading || isPortfolioEmpty"
              @keydown.enter.exact.prevent="send"
              @input="adjustHeight"
            ></textarea>
            <NeonButton type="submit" :disabled="loading || !input.trim() || isPortfolioEmpty" glow class="px-6 h-[52px] shrink-0">
              <span class="hidden sm:inline mr-2">{{ $t('contact.enviar') }}</span>
              <Send :size="18" class="sm:ml-1" />
            </NeonButton>
          </form>
          
          <p class="text-center text-xs text-muted-foreground mt-4">
            {{ $t('home.disclaimer_1') }}<router-link to="/portafolio" class="text-primary hover:underline font-medium mx-1">{{ $t('home.disclaimer_link') }}</router-link>{{ $t('home.disclaimer_2') }}
          </p>
        </footer>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../../services/api'
import { marked } from 'marked'
import { usePerfilStore } from '../../stores/perfil'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { useChatStore } from '../../stores/chat'
import { useFrasesStore } from '../../stores/frases'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import { storeToRefs } from 'pinia'
import { useAuthStore } from '../../stores/auth'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Bot, User, Send, Quote, RotateCcw, FolderKanban, MessageSquare } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()
const perfilStore = usePerfilStore()
const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const chatStore = useChatStore()
const frasesStore = useFrasesStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const authStore = useAuthStore()

const currentUser = ref(null)
const portfolioUser = ref(null)

const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || perfilStore.items[0]?.image_url || null)

const portfolioThemeClass = computed(() => `theme-${portfolioUser.value?.portfolio_theme || 'dark-glass'}`)

const isOwner = computed(() => {
  if (!currentUser.value || !portfolioUser.value) return false
  return currentUser.value.username?.toLowerCase() === portfolioUser.value.username?.toLowerCase()
})

const isPortfolioEmpty = computed(() => {
  return perfilStore.items.length === 0 && 
         proyectosStore.items.length === 0 && 
         experienciasStore.items.length === 0 && 
         estudiosStore.items.length === 0
})

const randomFrase = ref(null)
const tFrase = computed(() => randomFrase.value ? getTranslated(randomFrase.value, locale.value) : null)

const input = ref('')
const loading = ref(false)
const chatBody = ref(null)
const chatInputRef = ref(null)

const { messages } = storeToRefs(chatStore)

function adjustHeight() {
  if (chatInputRef.value) {
    chatInputRef.value.style.height = 'auto'
    chatInputRef.value.style.height = `${chatInputRef.value.scrollHeight}px`
  }
}

function renderMarkdown(text) {
  if (!text) return ''
  return marked.parse(text, { breaks: true })
}

function handleChatClick(event) {
  const link = event.target.closest('a')
  if (!link) return

  const href = link.getAttribute('href')

  // Register click tracking
  const wrapper = link.closest('.chat-message-wrapper.bot')
  if (wrapper && wrapper.dataset.logId) {
    const logId = wrapper.dataset.logId
    const clickedLinkText = `${link.textContent.trim()} -> ${href}`
    api.registerChatClick(logId, clickedLinkText).catch(e => console.error("Error tracking click:", e))
  }

  if (href && href.startsWith('/')) {
    event.preventDefault()
    router.push(href)
  } else if (href === '#') {
    event.preventDefault()
  }
}

function resetChatConversation() {
  const defaultWelcome = `¡Hola! Soy el asistente virtual de ${portfolioUser.value?.firstName || route.params.username}. Estoy aquí para responder tus dudas sobre su perfil profesional. ¿De qué te gustaría hablar hoy?\n\n**¿Qué puedes preguntar por ejemplo?**\n- Mis Habilidades técnicas y stack.\n- Qué Experiencia laboral tengo.\n- Qué Proyectos clave y KPIs he logrado.\n- Mis datos de contacto.`
  const welcomeMsg = portfolioUser.value?.chat_welcome_message || defaultWelcome
  chatStore.resetMessages(welcomeMsg, route.params.username || localStorage.getItem('currentPortfolioUser'))
}

async function send() {
  const text = input.value.trim()
  if (!text || loading.value) return

  messages.value.push({ role: 'user', content: text })
  input.value = ''
  
  await nextTick()
  adjustHeight()
  
  loading.value = true

  try {
    const msgs = messages.value.map((m) => ({
      role: m.role === 'bot' ? 'assistant' : 'user',
      content: m.content,
    }))
    const res = await api.chat(msgs)
    messages.value.push({ role: 'bot', content: res.content, log_id: res.log_id })
  } catch {
    messages.value.push({ role: 'bot', content: 'Lo siento, he tenido un inconveniente temporal para conectarme con mi cerebro de IA. Por favor, intenta enviar tu pregunta nuevamente.' })
  } finally {
    loading.value = false
  }
}

watch([messages, loading], async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}, { deep: true })

onMounted(async () => {
  try {
    currentUser.value = await api.me()
  } catch (error) {
    // Ignorar error si no está logueado
  }

  const username = route.params.username
  if (username) {
    try {
      portfolioUser.value = await api.getUserByUsername(username)
      localStorage.setItem('currentPortfolioUser', username)
      
      const defaultWelcome = `¡Hola! Soy el asistente virtual de ${portfolioUser.value.firstName || username}. Estoy aquí para responder tus dudas sobre su perfil profesional. ¿De qué te gustaría hablar hoy?\n\n**¿Qué puedes preguntar por ejemplo?**\n- Mis Habilidades técnicas y stack.\n- Qué Experiencia laboral tengo.\n- Qué Proyectos clave y KPIs he logrado.\n- Mis datos de contacto.`
      const welcomeMsg = portfolioUser.value?.chat_welcome_message || defaultWelcome
      if (chatStore.currentChatUsername !== username || messages.value.length <= 1) {
         chatStore.resetMessages(welcomeMsg, username)
      }
    } catch (error) {
      router.push('/home')
    }
  }

  watch(() => route.params.username, async (newUsername) => {
    if (newUsername) {
      try {
        portfolioUser.value = await api.getUserByUsername(newUsername)
        localStorage.setItem('currentPortfolioUser', newUsername)
        const defaultWelcome = `¡Hola! Soy el asistente virtual de ${newUsername}. Estoy aquí para responder tus dudas sobre su perfil profesional. ¿De qué te gustaría hablar hoy?\n\n**¿Qué puedes preguntar por ejemplo?**\n- Mis Habilidades técnicas y stack.\n- Qué Experiencia laboral tengo.\n- Qué Proyectos clave y KPIs he logrado.\n- Mis datos de contacto.`
        const welcomeMsg = portfolioUser.value?.chat_welcome_message || defaultWelcome
        if (chatStore.currentChatUsername !== newUsername || messages.value.length <= 1) {
          chatStore.resetMessages(welcomeMsg, newUsername)
        }
        
        perfilStore.fetchAll()
        proyectosStore.fetchAll()
        experienciasStore.fetchAll()
        estudiosStore.fetchAll()
        await frasesStore.fetchAll()
        
        if (frasesStore.items.length > 0) {
          const randomIndex = Math.floor(Math.random() * frasesStore.items.length)
          randomFrase.value = frasesStore.items[randomIndex]
        } else {
          randomFrase.value = null
        }
      } catch (error) {
        router.push('/home')
      }
    }
  })

  perfilStore.fetchAll()
  proyectosStore.fetchAll()
  experienciasStore.fetchAll()
  estudiosStore.fetchAll()
  await frasesStore.fetchAll()
  
  if (frasesStore.items.length > 0) {
    const randomIndex = Math.floor(Math.random() * frasesStore.items.length)
    randomFrase.value = frasesStore.items[randomIndex]
  } else {
    randomFrase.value = null
  }

  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsla(var(--foreground), 0.1);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--foreground), 0.2);
}

/* Markdown Body Styles para los mensajes del chat de IA */
:deep(.markdown-body p) {
  margin-bottom: 0.75rem;
}
:deep(.markdown-body p:last-child) {
  margin-bottom: 0;
}
:deep(.markdown-body a) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.35rem 0.85rem;
  border-radius: var(--radius);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.8125rem;
  margin: 0.5rem 0.375rem 0.25rem 0;
  transition: all 0.2s ease;
  background-color: hsla(var(--primary), 0.1);
  color: hsl(var(--primary));
  border: 1px solid hsla(var(--primary), 0.2);
}
:deep(.markdown-body a:hover) {
  background-color: hsl(var(--primary));
  color: hsl(var(--primary-foreground));
  transform: translateY(-1px);
}
:deep(.markdown-body strong) {
  font-weight: 700;
  color: hsl(var(--foreground));
}
:deep(.markdown-body ul) {
  list-style-type: disc;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
:deep(.markdown-body ol) {
  list-style-type: decimal;
  padding-left: 1.5rem;
  margin-bottom: 0.75rem;
}
:deep(.markdown-body li) {
  margin-bottom: 0.25rem;
}
</style>
