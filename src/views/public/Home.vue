<template>
  <div class="portfolio-theme-wrapper" :class="portfolioThemeClass">
    <div class="chat-container">
      <!-- Sidebar / Perfil Breve en Escritorio -->
      <aside class="chat-sidebar">
        <div class="profile-card">
          <div class="avatar-container">
            <img v-if="portfolioUser?.userImage" :src="portfolioUser.userImage" :alt="portfolioUser.firstName" class="profile-avatar" />
            <div v-else class="avatar-placeholder">{{ portfolioUser ? (portfolioUser.firstName || portfolioUser.username || 'U').charAt(0) + (portfolioUser.lastName || '').charAt(0) : '...' }}</div>
          </div>
          <h2 class="profile-name">{{ portfolioUser ? `${portfolioUser.firstName || portfolioUser.username} ${portfolioUser.lastName || ''}` : 'Cargando...' }}</h2>
          <p class="profile-title">{{ portfolioUser?.occupation || 'Talento OppyTalent' }}</p>
          <div class="profile-badges">
            <span class="badge">OppyTalent</span>
          </div>
        </div>

      <div class="sidebar-help">
        <h3>{{ $t('portfolio.frases') }}</h3>
        <blockquote class="sidebar-quote" v-if="tFrase">
          "{{ tFrase.texto }}"
          <footer>{{ tFrase.autor }}</footer>
        </blockquote>
        <blockquote class="sidebar-quote" v-else>
          "Cada gran proyecto comienza con un primer paso. Pronto compartiré aquí las frases y filosofías que inspiran mi trabajo y mi carrera profesional."
          <footer>{{ portfolioUser ? (portfolioUser.firstName || portfolioUser.username) : 'Talento OppyTalent' }}</footer>
        </blockquote>
      </div>
    </aside>

    <!-- Ventana Principal de Chat -->
    <main class="chat-main">
      <div class="chat-header">
        <div class="chat-header-info">
          <h2>{{ $t('home.title') }}</h2>
          <p class="online-indicator">{{ $t('home.online') }}</p>
        </div>
        <div class="header-actions" style="display: flex; gap: 0.5rem; align-items: center;">
          <router-link v-if="isOwner" to="/admin" class="btn btn-primary btn-sm" style="background-color: rgba(59, 130, 246, 0.2); border-color: #3b82f6; color: #fff;">
            Panel Admin
          </router-link>
          <button 
            v-if="authStore.token" 
            @click="resetChatConversation" 
            class="btn btn-outline btn-sm" 
            title="Reiniciar Conversación"
            style="padding: 0.25rem 0.5rem;"
          >
            🧹
          </button>
          <router-link to="/portafolio" class="btn btn-outline btn-sm header-portfolio-btn">
            {{ $t('home.view_portfolio') }}
          </router-link>
        </div>
      </div>

      <!-- Cuerpo del Chat -->
      <div class="chat-body" ref="chatBody" @click="handleChatClick">
        <!-- Lista de Mensajes -->
        <template v-if="!isPortfolioEmpty">
          <div 
            v-for="(msg, i) in messages" 
            :key="i" 
            class="chat-message-wrapper"
            :class="msg.role"
            :data-log-id="msg.log_id"
          >
            <div class="message-avatar">
              <span v-if="msg.role === 'bot'">🤖</span>
              <span v-else>👤</span>
            </div>
            <div class="chat-message" v-html="renderMarkdown(msg.content)"></div>
          </div>
        </template>

        <!-- Indicador de Carga / Escribiendo -->
        <div v-if="loading" class="chat-message-wrapper bot">
          <div class="message-avatar">🤖</div>
          <div class="chat-message loading-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
        <!-- Indicador de portafolio vacío -->
        <div v-if="isPortfolioEmpty" class="chat-message-wrapper bot">
          <div class="message-avatar">🤖</div>
          <div class="chat-message">
            <p v-if="isOwner">
              ¡Hola! Tu portafolio parece estar vacío. Agrega al menos un proyecto, experiencia, estudio o tus datos de "Sobre Mí" en el <router-link to="/admin">Panel de Administración</router-link> para habilitar este chat interactivo.
            </p>
            <p v-else>
              El portafolio de este usuario aún está en construcción. El chat se habilitará cuando agregue información a su perfil.
            </p>
          </div>
        </div>
      </div>

      <!-- Pie del Chat / Entrada -->
      <footer class="chat-footer-area">
        <div class="suggested-chips" v-if="!isPortfolioEmpty && (portfolioUser?.chat_suggested_q1 || portfolioUser?.chat_suggested_q2 || portfolioUser?.chat_suggested_q3)">
          <button v-if="portfolioUser?.chat_suggested_q1" @click="input = portfolioUser.chat_suggested_q1; send()" class="chip-btn">{{ portfolioUser.chat_suggested_q1 }}</button>
          <button v-if="portfolioUser?.chat_suggested_q2" @click="input = portfolioUser.chat_suggested_q2; send()" class="chip-btn">{{ portfolioUser.chat_suggested_q2 }}</button>
          <button v-if="portfolioUser?.chat_suggested_q3" @click="input = portfolioUser.chat_suggested_q3; send()" class="chip-btn">{{ portfolioUser.chat_suggested_q3 }}</button>
        </div>
        
        <form class="chat-form" @submit.prevent="send">
          <input
            v-model="input"
            type="text"
            class="chat-input"
            :placeholder="isPortfolioEmpty ? 'El chat está deshabilitado temporalmente...' : $t('home.placeholder')"
            :disabled="loading || isPortfolioEmpty"
          />
          <button type="submit" class="chat-send-btn" :disabled="loading || !input.trim() || isPortfolioEmpty">
            <span>{{ $t('contact.enviar') }}</span>
            <span class="send-icon">&rarr;</span>
          </button>
        </form>
        <p class="chat-footer-disclaimer">
          {{ $t('home.disclaimer_1') }}<router-link to="/portafolio">{{ $t('home.disclaimer_link') }}</router-link>{{ $t('home.disclaimer_2') }}
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
const portfolioThemeClass = computed(() => `theme-${portfolioUser.value?.portfolio_theme || 'dark-glass'}`)

const isOwner = computed(() => {
  console.log("Checking isOwner:", currentUser.value?.username, portfolioUser.value?.username)
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

const { messages } = storeToRefs(chatStore)



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

watch(messages, async () => {
  await nextTick()
  if (chatBody.value) {
    chatBody.value.scrollTop = chatBody.value.scrollHeight
  }
}, { deep: true })

onMounted(async () => {
  try {
    currentUser.value = await api.me()
    console.log("currentUser fetched:", currentUser.value)
  } catch (error) {
    console.warn("Failed to fetch currentUser:", error)
  }

  const username = route.params.username
  if (username) {
    try {
      portfolioUser.value = await api.getUserByUsername(username)
      console.log("portfolioUser fetched:", portfolioUser.value)
      localStorage.setItem('currentPortfolioUser', username)
      
      const defaultWelcome = `¡Hola! Soy el asistente virtual de ${portfolioUser.value.firstName || username}. Estoy aquí para responder tus dudas sobre su perfil profesional. ¿De qué te gustaría hablar hoy?\n\n**¿Qué puedes preguntar por ejemplo?**\n- Mis Habilidades técnicas y stack.\n- Qué Experiencia laboral tengo.\n- Qué Proyectos clave y KPIs he logrado.\n- Mis datos de contacto.`
      const welcomeMsg = portfolioUser.value?.chat_welcome_message || defaultWelcome
      if (chatStore.currentChatUsername !== username || messages.value.length <= 1) {
         chatStore.resetMessages(welcomeMsg, username)
      }
    } catch (error) {
      console.error('Error fetching user for portfolio:', error)
      router.push('/home') // Redirigir si no existe
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
        
        // Re-fetch all data for the new user so reactivity updates the chat properly
        perfilStore.fetchAll()
        proyectosStore.fetchAll()
        experienciasStore.fetchAll()
        estudiosStore.fetchAll()
        await frasesStore.fetchAll()
      } catch (error) {
        console.error('Error fetching user for portfolio:', error)
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
  }

  nextTick(() => {
    if (chatBody.value) {
      chatBody.value.scrollTop = chatBody.value.scrollHeight
    }
  })
})
</script>

<style scoped>
.portfolio-theme-wrapper {
  min-height: calc(100vh - 4.5rem);
  background-color: var(--color-gray-50);
  padding: 1rem 0;
  color: var(--color-gray-800);
}

.chat-container {
  display: flex;
  height: calc(100vh - 100px);
  max-width: 1300px;
  margin: 0 auto;
  background: transparent;
  border-radius: var(--radius-lg, 16px);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.08);
  backdrop-filter: blur(16px);
}

/* --- SIDEBAR --- */
.chat-sidebar {
  width: 320px;
  background: var(--color-gray-100);
  border-right: 1px solid var(--color-gray-200);
  color: var(--color-gray-800);
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: var(--color-gray-200) transparent;
  backdrop-filter: blur(12px);
}

.chat-sidebar::-webkit-scrollbar {
  width: 4px;
}
.chat-sidebar::-webkit-scrollbar-track {
  background: transparent;
}
.chat-sidebar::-webkit-scrollbar-thumb {
  background: rgba(255, 255, 255, 0.1);
  border-radius: 4px;
}
.chat-sidebar::-webkit-scrollbar-thumb:hover {
  background: rgba(255, 255, 255, 0.2);
}

.profile-card {
  display: flex;
  flex-direction: column;
  align-items: center;
  text-align: center;
}

.avatar-container {
  margin-bottom: 1.25rem;
}

.profile-avatar {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-accent, #2563eb);
  box-shadow: 0 4px 15px rgba(37, 99, 235, 0.3);
}

.avatar-placeholder {
  width: 100px;
  height: 100px;
  border-radius: 50%;
  background: var(--color-gray-700, #334155);
  color: var(--color-gray-300);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 2.25rem;
  font-weight: 700;
  border: 3px solid var(--color-accent, #2563eb);
}

.profile-name {
  font-size: 1.35rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.profile-title {
  font-size: 0.75rem;
  color: var(--color-gray-400, #94a3b8);
  font-weight: 500;
  margin-bottom: 1.25rem;
  line-height: 1.3;
}

.profile-badges {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  justify-content: center;
}

.badge {
  background: rgba(255, 255, 255, 0.08);
  color: var(--color-gray-200);
  padding: 0.25rem 0.625rem;
  border-radius: 99px;
  font-size: 0.6875rem;
  font-weight: 600;
}

.sidebar-help {
  background: rgba(255, 255, 255, 0.03);
  padding: 1.25rem;
  border-radius: var(--radius-md, 12px);
  border: 1px solid rgba(255, 255, 255, 0.05);
}

.sidebar-help h3 {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-accent, #60a5fa);
  margin-bottom: 0.75rem;
}

.sidebar-help ul {
  padding-left: 1rem;
  margin: 0;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.sidebar-help li {
  font-size: 0.75rem;
  color: var(--color-gray-300, #cbd5e1);
  line-height: 1.4;
}

/* --- MAIN PANEL --- */
.chat-main {
  flex: 1;
  display: flex;
  flex-direction: column;
  background: var(--color-gray-50);
  backdrop-filter: blur(16px);
}

.chat-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-gray-200);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: transparent;
}

.chat-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin: 0 0 0.125rem 0;
}

.online-indicator {
  font-size: 0.75rem;
  color: var(--color-accent);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
}

.btn-outline {
  background: transparent;
  border: 1px solid var(--color-gray-200);
  color: var(--color-gray-800);
  border-radius: 6px;
  text-decoration: none;
  transition: all 0.2s;
}
.btn-outline:hover {
  background: rgba(255, 255, 255, 0.1);
}

.header-portfolio-btn {
  font-size: 0.8125rem !important;
  padding: 0.4rem 0.875rem !important;
  font-weight: 600;
}

.chat-body {
  flex: 1;
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

/* --- SIDEBAR QUOTE --- */
.sidebar-quote {
  font-style: italic;
  font-size: 0.85rem;
  color: var(--color-gray-300, #cbd5e1);
  line-height: 1.5;
  margin: 0;
}
.sidebar-quote footer {
  margin-top: 0.75rem;
  font-size: 0.75rem;
  font-weight: 600;
  color: var(--color-accent, #60a5fa);
  text-align: right;
  font-style: normal;
}
.sidebar-quote footer::before {
  content: '— ';
}

/* --- MESSAGE BUBBLES --- */
.chat-message-wrapper {
  display: flex;
  gap: 1rem;
  max-width: 85%;
  align-self: flex-start;
}

.chat-message-wrapper.user {
  align-self: flex-end;
  flex-direction: row-reverse;
}

.message-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: rgba(255, 255, 255, 0.05);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.chat-message-wrapper.user .message-avatar {
  background: var(--color-accent);
  color: var(--color-gray-900);
  border-color: transparent;
}

.chat-message {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  color: var(--color-gray-800);
  padding: 0.875rem 1.25rem;
  border-radius: 18px;
  border-top-left-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.6;
}

.chat-message-wrapper.user .chat-message {
  background: var(--color-accent);
  color: var(--color-gray-900);
  border: none;
  border-radius: 18px;
  border-top-right-radius: 4px;
}

/* Interacciones de Links y Botones de la IA */
.chat-message :deep(a) {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.45rem 1rem;
  border-radius: var(--radius-sm, 8px);
  font-weight: 600;
  text-decoration: none;
  font-size: 0.8125rem;
  margin: 0.5rem 0.375rem 0.25rem 0;
  transition: all 0.2s ease;
}

/* Enlaces Internos (SI) */
.chat-message :deep(a[href^="/"]) {
  background-color: var(--color-accent, #2563eb);
  color: #ffffff !important;
  box-shadow: 0 4px 10px rgba(37, 99, 235, 0.2);
}

.chat-message :deep(a[href^="/"]):hover {
  background-color: var(--color-primary-dark, #1d4ed8);
  transform: translateY(-1px);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.3);
}

/* Enlaces Inactivos (NO) */
.chat-message :deep(a[href^="#"]) {
  background-color: var(--color-gray-200, #e2e8f0);
  color: var(--color-gray-700, #334155) !important;
  border: 1px solid var(--color-gray-300, #cbd5e1);
}

.chat-message :deep(a[href^="#"]):hover {
  background-color: var(--color-gray-300, #cbd5e1);
  transform: translateY(-1px);
}

/* Tablas, Listas y Markdown general */
.chat-message :deep(p) {
  margin: 0 0 0.75rem 0;
}
.chat-message :deep(p:last-child) {
  margin-bottom: 0;
}
.chat-message :deep(strong) {
  font-weight: 700;
}
.chat-message :deep(ul), .chat-message :deep(ol) {
  margin: 0.5rem 0;
  padding-left: 1.5rem;
}
.chat-message :deep(li) {
  margin-bottom: 0.375rem;
}
.chat-message :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 1rem 0;
  font-size: 0.8125rem;
  border-radius: var(--radius-sm);
  overflow: hidden;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
}
.chat-message :deep(th), .chat-message :deep(td) {
  border: 1px solid var(--color-gray-200, #e2e8f0);
  padding: 0.625rem 0.875rem;
  text-align: left;
}
.chat-message :deep(th) {
  background-color: var(--color-gray-200, #f1f5f9);
  font-weight: 700;
}

/* --- LOADING DOTS --- */
.loading-bubble {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  padding: 1rem 1.5rem;
}

.loading-bubble .dot {
  width: 8px;
  height: 8px;
  background: var(--color-gray-400, #94a3b8);
  border-radius: 50%;
  animation: jump-dots 1.4s infinite both;
}

.loading-bubble .dot:nth-child(2) {
  animation-delay: 0.2s;
}

.loading-bubble .dot:nth-child(3) {
  animation-delay: 0.4s;
}

@keyframes jump-dots {
  0%, 80%, 100% { transform: scale(0.6); opacity: 0.5; }
  40% { transform: scale(1.1) translateY(-4px); opacity: 1; }
}


.chat-footer-area {
  padding: 1.5rem 2rem 1.25rem;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  background: transparent;
}

.chat-form {
  display: flex;
  gap: 0.75rem;
  max-width: 900px;
  margin: 0 auto 0.75rem;
}

.chat-input {
  flex: 1;
  padding: 0.875rem 1.25rem;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  color: var(--color-gray-900);
  border-radius: var(--radius-md, 12px);
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.chat-input:focus {
  border-color: var(--color-accent);
  background: var(--color-gray-100);
}

.chat-send-btn {
  padding: 0 1.5rem;
  border: none;
  background: var(--color-accent);
  color: #fff;
  border-radius: var(--radius-md, 12px);
  font-family: inherit;
  font-weight: 600;
  font-size: 0.875rem;
  cursor: pointer;
  display: flex;
  align-items: center;
  gap: 0.5rem;
  transition: all 0.2s ease;
}

.chat-send-btn:hover:not(:disabled) {
  background: var(--color-primary-dark, #1d4ed8);
  box-shadow: 0 6px 15px rgba(37, 99, 235, 0.4);
}

.chat-send-btn:disabled {
  background: var(--color-gray-300, #cbd5e1);
  color: var(--color-gray-500, #94a3b8);
  box-shadow: none;
  cursor: not-allowed;
}

.send-icon {
  font-size: 1rem;
}

.chat-footer-disclaimer {
  font-size: 0.75rem;
  text-align: center;
  color: var(--color-gray-400, #94a3b8);
  margin: 0;
}

.chat-footer-disclaimer a {
  color: var(--color-accent, #2563eb);
  font-weight: 600;
  text-decoration: none;
}

.chat-footer-disclaimer a:hover {
  text-decoration: underline;
}

.suggested-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 0.75rem;
  justify-content: center;
}

.chip-btn {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-gray-300, #cbd5e1);
  border-radius: 9999px;
  padding: 0.5rem 1rem;
  font-size: 0.8rem;
  cursor: pointer;
  transition: all 0.2s ease;
}

.chip-btn:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.2);
}

/* --- ANIMACIONES ADICIONALES --- */
@keyframes wave-effect {
  0%, 100% { transform: rotate(0deg); }
  10% { transform: rotate(14deg); }
  20% { transform: rotate(-8deg); }
  30% { transform: rotate(14deg); }
  40% { transform: rotate(-4deg); }
  50% { transform: rotate(10deg); }
  60% { transform: rotate(0deg); }
}

/* --- RESPONSIVIDAD (MÓVIL) --- */
@media (max-width: 900px) {
  .chat-sidebar {
    display: none; /* Ocultar barra lateral en tablets/móviles */
  }
}

@media (max-width: 600px) {
  .chat-container {
    height: calc(100vh - 100px);
    border-radius: 0;
    border: none;
  }

  .chat-header {
    padding: 1rem;
  }

  .header-portfolio-btn {
    font-size: 0.75rem !important;
    padding: 0.35rem 0.75rem !important;
  }

  .chat-body {
    padding: 1rem;
  }

  .chat-message-wrapper {
    max-width: 92%;
  }

  .chat-message {
    font-size: 0.8125rem;
    padding: 0.75rem 1rem;
  }

  .chat-footer-area {
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
  }

  .chat-form {
    gap: 0.5rem;
  }

  .chat-input {
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }

  .chat-send-btn {
    padding: 0 1rem;
  }
  
  .chat-send-btn span:first-child {
    display: none; /* Ocultar texto "Enviar" en móviles */
  }
}
</style>
