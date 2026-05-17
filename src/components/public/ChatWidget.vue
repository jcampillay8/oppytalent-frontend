<template>
  <div class="chat-widget">
    <button class="chat-toggle" @click="open = !open" :title="open ? 'Cerrar chat' : 'Abrir chat IA'">
      <span v-if="!open">IA</span>
      <span v-else>&times;</span>
    </button>
    <Transition name="chat">
      <div v-if="open" class="chat-panel">
        <div class="chat-header">
          <h4>Asistente IA</h4>
        </div>
        <div class="chat-body" ref="chatBody">
          <div v-for="(msg, i) in messages" :key="i" class="chat-message" :class="msg.role">
            {{ msg.content }}
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

const open = ref(false)
const input = ref('')
const loading = ref(false)
const messages = ref([
  { role: 'bot', content: '¡Hola! Soy el asistente virtual de Jaime. Pregúntame lo que quieras sobre su trayectoria profesional, proyectos, estudios o experiencia.' },
])
const chatBody = ref(null)

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
.chat-widget {
  position: fixed;
  bottom: 1.5rem;
  right: 1.5rem;
  z-index: 1000;
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
width: 500px;
height: 600px;
border: 1px solid #aaa;
background-color: white;
border-radius: 3%;
display: flex;
flex-direction: column;
overflow: hidden;
}

.chat-header {
  padding: 0.875rem 1rem;
  background: var(--color-primary);
  color: #fff;
}

.chat-header h4 {
  font-size: 0.9375rem;
  font-weight: 600;
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
  border-radius: var(--radius-md);
  font-size: 0.8125rem;
  line-height: 1.5;
  max-width: 90%;
  white-space: pre-wrap;
}

.chat-message.bot {
  background: var(--color-gray-100);
  color: var(--color-gray-700);
  align-self: flex-start;
}

.chat-message.user {
  background: var(--color-primary);
  color: #fff;
  align-self: flex-end;
}

.chat-message.typing {
  color: var(--color-gray-400);
  font-style: italic;
}

.chat-footer {
  padding: 0.75rem;
  border-top: 1px solid var(--color-gray-200);
  display: flex;
  gap: 0.5rem;
}

.chat-input {
  flex: 1;
  padding: 0.5rem 0.75rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-family: inherit;
  font-size: 0.8125rem;
  outline: none;
}

.chat-input:focus {
  border-color: var(--color-accent);
}

.chat-send {
  padding: 0.5rem 1rem;
  border: none;
  border-radius: var(--radius-sm);
  background: var(--color-primary);
  color: #fff;
  font-size: 0.8125rem;
  cursor: pointer;
  font-weight: 500;
}

.chat-send:disabled {
  background: var(--color-gray-300);
  color: var(--color-gray-500);
  cursor: not-allowed;
}

.chat-enter-active,
.chat-leave-active {
  transition: all 0.2s ease;
}

.chat-enter-from,
.chat-leave-to {
  opacity: 0;
  transform: translateY(10px);
}
</style>
