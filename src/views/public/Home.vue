<template>
  <div class="chat-container">
    <!-- Sidebar / Perfil Breve en Escritorio -->
    <aside class="chat-sidebar">
      <div class="profile-card">
        <div class="avatar-container">
          <img v-if="avatarUrl" :src="avatarUrl" alt="Jaime Campillay" class="profile-avatar" />
          <div v-else class="avatar-placeholder">JC</div>
        </div>
        <h2 class="profile-name">Jaime Campillay</h2>
        <p class="profile-title">Ingeniero Civil Industrial &bull; Senior Software & Data Engineer</p>
        <div class="profile-badges">
          <span class="badge">FastAPI</span>
          <span class="badge">Python</span>
          <span class="badge">PostgreSQL</span>
          <span class="badge">Cloud Architect</span>
        </div>
      </div>

      <div class="sidebar-help">
        <h3>Frase Célebre</h3>
        <blockquote class="sidebar-quote" v-if="randomFrase">
          "{{ randomFrase.texto }}"
          <footer>{{ randomFrase.autor }}</footer>
        </blockquote>
        <blockquote class="sidebar-quote" v-else>
          "El verdadero liderazgo en tecnología no se trata solo de dominar herramientas, sino de construir sistemas que empoderen a las personas y transformen problemas complejos en soluciones simples, escalables y sostenibles."
          <footer>Jaime Campillay</footer>
        </blockquote>
      </div>
    </aside>

    <!-- Ventana Principal de Chat -->
    <main class="chat-main">
      <div class="chat-header">
        <div class="chat-header-info">
          <h2>Asistente Profesional de IA</h2>
          <p class="online-indicator">🟢 Conectado &middot; Basado en Gemini</p>
        </div>
        <router-link to="/portafolio" class="btn btn-outline btn-sm header-portfolio-btn">
          Ver Portafolio Visual &rarr;
        </router-link>
      </div>

      <!-- Cuerpo del Chat -->
      <div class="chat-body" ref="chatBody" @click="handleChatClick">
        <!-- Lista de Mensajes -->
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
        
        <!-- Indicador de Carga / Escribiendo -->
        <div v-if="loading" class="chat-message-wrapper bot">
          <div class="message-avatar">🤖</div>
          <div class="chat-message loading-bubble">
            <span class="dot"></span>
            <span class="dot"></span>
            <span class="dot"></span>
          </div>
        </div>
      </div>

      <!-- Pie del Chat / Entrada -->
      <footer class="chat-footer-area">
        <form class="chat-form" @submit.prevent="send">
          <input
            v-model="input"
            type="text"
            class="chat-input"
            placeholder="Escribe una pregunta sobre mi experiencia, proyectos o tecnologías..."
            :disabled="loading"
          />
          <button type="submit" class="chat-send-btn" :disabled="loading || !input.trim()">
            <span>Enviar</span>
            <span class="send-icon">&rarr;</span>
          </button>
        </form>
        <p class="chat-footer-disclaimer">
          Asistente IA entrenado con el CV de Jaime Campillay. Puedes revisar el <router-link to="/portafolio">Portafolio Visual</router-link> en cualquier momento.
        </p>
      </footer>
    </main>
  </div>
</template>

<script setup>
import { ref, computed, nextTick, watch, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'
import { marked } from 'marked'
import { usePerfilStore } from '../../stores/perfil'
import { useChatStore } from '../../stores/chat'
import { useFrasesStore } from '../../stores/frases'
import { storeToRefs } from 'pinia'

const router = useRouter()
const perfilStore = usePerfilStore()
const chatStore = useChatStore()
const frasesStore = useFrasesStore()

const randomFrase = ref(null)

const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || null)

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
  perfilStore.fetchAll()
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
.chat-container {
  display: flex;
  height: calc(100vh - 120px);
  max-width: 1300px;
  margin: 0 auto;
  background: var(--color-gray-50, #f9fafb);
  border-radius: var(--radius-lg, 16px);
  border: 1px solid var(--color-gray-200, #e5e7eb);
  overflow: hidden;
  box-shadow: 0 10px 30px rgba(0, 0, 0, 0.04);
}

/* --- SIDEBAR --- */
.chat-sidebar {
  width: 320px;
  background: var(--color-primary-dark, #0f172a);
  color: #fff;
  padding: 2rem 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 2rem;
  border-right: 1px solid rgba(255, 255, 255, 0.05);
  overflow-y: auto;
  scrollbar-width: thin;
  scrollbar-color: rgba(255, 255, 255, 0.1) transparent;
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
  color: #fff;
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
  background: #fff;
}

.chat-header {
  padding: 1rem 2rem;
  border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background: #fff;
}

.chat-header h2 {
  font-size: 1.125rem;
  font-weight: 700;
  color: var(--color-gray-900, #0f172a);
  margin: 0 0 0.125rem 0;
}

.online-indicator {
  font-size: 0.75rem;
  color: var(--color-gray-500, #64748b);
  margin: 0;
  display: flex;
  align-items: center;
  gap: 0.375rem;
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
  background: var(--color-gray-100, #f1f5f9);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 1.125rem;
  flex-shrink: 0;
  border: 1px solid var(--color-gray-200, #e2e8f0);
  box-shadow: 0 2px 5px rgba(0,0,0,0.03);
}

.chat-message-wrapper.user .message-avatar {
  background: var(--color-accent, #2563eb);
  color: #fff;
  border-color: transparent;
}

.chat-message {
  background: var(--color-gray-100, #f1f5f9);
  color: var(--color-gray-800, #1e293b);
  padding: 0.875rem 1.25rem;
  border-radius: 18px;
  border-top-left-radius: 4px;
  font-size: 0.875rem;
  line-height: 1.6;
}

.chat-message-wrapper.user .chat-message {
  background: var(--color-primary, #1e3a8a);
  color: #fff;
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
  border-top: 1px solid var(--color-gray-200, #e5e7eb);
  background: #fff;
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
  border: 1px solid var(--color-gray-300, #cbd5e1);
  border-radius: var(--radius-md, 12px);
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
  box-shadow: inset 0 2px 4px rgba(0,0,0,0.02);
}

.chat-input:focus {
  border-color: var(--color-accent, #2563eb);
  box-shadow: 0 0 0 3px rgba(37, 99, 235, 0.15), inset 0 2px 4px rgba(0,0,0,0.02);
}

.chat-send-btn {
  padding: 0 1.5rem;
  border: none;
  background: var(--color-accent, #2563eb);
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
  box-shadow: 0 4px 12px rgba(37, 99, 235, 0.3);
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
