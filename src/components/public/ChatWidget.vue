<template>
  <div class="chat-widget" :class="{ 'is-open': open }">
    <Transition name="fade">
      <div v-if="!open" class="chat-prompt-hint">
        💬 ¡Pregúntame sobre mi trayectoria!
      </div>
    </Transition>

    <button class="chat-toggle" @click="open = !open" :title="open ? 'Cerrar chat' : 'Abrir chat IA'">
      <span v-if="!open">IA</span>
      <span v-else>&times;</span>
    </button>
    
    <Transition name="chat">
      <div v-if="open" class="chat-panel">
        <div class="chat-header">
          <h4>Asistente IA</h4>
          <button class="close-panel-btn" @click="open = false" title="Cerrar">&times;</button>
        </div>
        <div class="chat-body" ref="chatBody">
          <div 
            v-for="(msg, i) in messages" 
            :key="i" 
            class="chat-message" 
            :class="msg.role"
            v-html="renderMarkdown(msg.content)"
          >
          </div>
          <div v-if="loading" class="chat-message bot typing">Escribiendo...</div>
        </div>
        <form class="chat-footer" @submit.prevent="send">
          <input
            v-model="input"
            type="text"
            class="chat-input"
            placeholder="Pregunta sobre mi trayectoria..."
            :disabled="loading"
          />
          <button type="submit" class="chat-send" :disabled="loading || !input.trim()">Enviar</button>
        </form>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { ref, nextTick, watch } from 'vue'
import { api } from '../../services/api'
import { marked } from 'marked' // 1. Importamos la librería

const open = ref(false)
const input = ref('')
const loading = ref(false)
const messages = ref([
  { role: 'bot', content: '¡Hola! Soy el asistente virtual de Jaime. Pregúntame lo que quieras sobre su trayectoria profesional, proyectos, estudios o experiencia.' },
])
const chatBody = ref(null)

// 2. Función para convertir texto Markdown a HTML seguro
function renderMarkdown(text) {
  if (!text) return ''
  // marked.parse devuelve el HTML. Hacemos un parse síncrono estándar.
  return marked.parse(text, { breaks: true }) 
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
    messages.value.push({ role: 'bot', content: res.content })
  } catch {
    messages.value.push({ role: 'bot', content: 'Lo siento, tuve un problema al conectarme. Intenta de nuevo.' })
  } finally {
    loading.value = false
  }
}

watch(messages, async () => {
  await nextTick()
  if (chatBody.value) chatBody.value.scrollTop = chatBody.value.scrollHeight
}, { deep: true })
</script>

<style scoped>
/* --- ESTILOS BASE (ESCRITORIO / DESKTOP) --- */
.chat-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
}

.chat-prompt-hint {
  position: absolute;
  bottom: 64px;
  right: 0;
  white-space: nowrap;
  background-color: #fff;
  color: var(--color-gray-700, #333);
  padding: 0.5rem 0.875rem;
  border-radius: 12px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.15);
  font-size: 0.8125rem;
  font-weight: 500;
  border: 1px solid var(--color-gray-200, #e5e7eb);
  animation: float-bounce 3s ease-in-out infinite;
}

.chat-prompt-hint::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 18px;
  width: 12px;
  height: 12px;
  background: #fff;
  border-right: 1px solid var(--color-gray-200, #e5e7eb);
  border-bottom: 1px solid var(--color-gray-200, #e5e7eb);
  transform: rotate(45deg);
}

.chat-toggle {
  width: 48px;
  height: 48px;
  border-radius: 50%;
  border: none;
  background: var(--color-primary);
  color: #fff;
  font-size: 1rem;
  font-weight: 700;
  cursor: pointer;
  box-shadow: var(--shadow-lg);
  transition: transform 0.15s ease;
}

.chat-toggle:hover {
  transform: scale(1.1);
}

.chat-panel {
  position: absolute;
  bottom: 56px;
  right: 0;
  width: 450px; 
  height: 580px;
  border: 1px solid var(--color-gray-300, #ccc);
  background-color: white;
  border-radius: 16px;
  display: flex;
  flex-direction: column;
  overflow: hidden;
  box-shadow: var(--shadow-xl, 0 10px 25px rgba(0,0,0,0.1));
}

.chat-header {
  padding: 0.875rem 1rem;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.chat-header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
  margin: 0;
}

.close-panel-btn {
  display: none;
  background: transparent;
  border: none;
  color: #fff;
  font-size: 1.5rem;
  cursor: pointer;
  line-height: 1;
}

.chat-body {
  flex: 1;
  padding: 1rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.chat-message {
  padding: 0.625rem 0.875rem;
  border-radius: var(--radius-md, 8px);
  font-size: 0.8125rem;
  line-height: 1.5;
  max-width: 85%;
}

/* 3. SOPORTE DE ESTILOS INTERNOS PARA EL MARKDOWN RENDERIZADO */
.chat-message :deep(p) {
  margin: 0 0 0.5rem 0;
}
.chat-message :deep(p:last-child) {
  margin-bottom: 0;
}
.chat-message :deep(strong) {
  font-weight: 700;
}
.chat-message :deep(ul), .chat-message :deep(ol) {
  margin: 0.25rem 0;
  padding-left: 1.25rem;
}
.chat-message :deep(li) {
  margin-bottom: 0.25rem;
}

/* Estilos para tablas que el bot pueda generar */
.chat-message :deep(table) {
  border-collapse: collapse;
  width: 100%;
  margin: 0.5rem 0;
  font-size: 0.75rem;
}
.chat-message :deep(th), .chat-message :deep(td) {
  border: 1px solid var(--color-gray-300, #d1d5db);
  padding: 0.375rem;
  text-align: left;
}
.chat-message.bot :deep(th) {
  background-color: var(--color-gray-200, #e5e7eb);
}
.chat-message.user :deep(th) {
  background-color: rgba(255, 255, 255, 0.2);
}

.chat-message.bot {
  background: var(--color-gray-100, #f3f4f6);
  color: var(--color-gray-700, #374151);
  align-self: flex-start;
}

.chat-message.user {
  background: var(--color-primary);
  color: #fff;
  align-self: flex-end;
}

.chat-message.typing {
  color: var(--color-gray-400, #9ca3af);
  font-style: italic;
}

.chat-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--color-gray-200, #e5e7eb);
  display: flex;
  gap: 0.5rem;
  background: #fff;
}

.chat-input {
  flex: 1;
  padding: 0.625rem 0.75rem;
  border: 1px solid var(--color-gray-300, #d1d5db);
  border-radius: var(--radius-sm, 6px);
  font-family: inherit;
  font-size: 0.875rem;
  outline: none;
}

.chat-input:focus {
  border-color: var(--color-accent, var(--color-primary));
}

.chat-send {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm, 6px);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
  font-weight: 500;
}

.chat-send:disabled {
  background: var(--color-gray-300, #e5e7eb);
  color: var(--color-gray-500, #9ca3af);
  cursor: not-allowed;
}

/* --- ANIMACIONES --- */
.chat-enter-active, .chat-leave-active {
  transition: all 0.25s cubic-bezier(0.4, 0, 0.2, 1);
}
.chat-enter-from, .chat-leave-to {
  opacity: 0;
  transform: translateY(20px) scale(0.95);
}

.fade-enter-active, .fade-leave-active {
  transition: opacity 0.2s ease;
}
.fade-enter-from, .fade-leave-to {
  opacity: 0;
}

@keyframes float-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-6px); }
}

/* --- RESPONSIVIDAD (MÓVIL) --- */
@media (max-width: 600px) {
  .chat-widget.is-open {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100vw; height: 100vh;
    padding: 0; margin: 0;
  }

  .chat-widget.is-open .chat-toggle {
    display: none;
  }

  .chat-panel {
    position: fixed;
    top: 0; left: 0; right: 0; bottom: 0;
    width: 100% !important; height: 100% !important;
    border-radius: 0; border: none;
  }

  .close-panel-btn {
    display: block;
    padding: 0.5rem;
  }

  .chat-header { padding: 1rem; }
  .chat-body { padding: 1rem 1rem 4rem 1rem; }

  .chat-message {
    max-width: 88%;
    font-size: 0.875rem;
    padding: 0.75rem 1rem;
  }

  .chat-footer {
    padding: 1rem;
    padding-bottom: calc(1rem + env(safe-area-inset-bottom));
    box-shadow: 0 -2px 10px rgba(0,0,0,0.05);
  }

  .chat-input {
    font-size: 1rem;
    padding: 0.75rem;
  }

  .chat-prompt-hint {
    font-size: 0.75rem;
    max-width: 220px;
    white-space: normal;
    right: 0;
  }
}
</style>