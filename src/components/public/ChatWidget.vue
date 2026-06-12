<template>
  <div class="chat-widget" @click="navigateToChat">
    <div class="chat-prompt-hint">
      <strong>💬 Pregúntame sobre mi trayectoria</strong>
    </div>

    <button class="chat-toggle" title="Preguntar al Asistente IA">
      <span>IA</span>
    </button>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router'

const router = useRouter()

function navigateToChat() {
  const saved = localStorage.getItem('currentPortfolioUser')
  router.push(saved ? `/${saved}` : '/')
}
</script>

<style scoped>
.chat-widget {
  position: fixed;
  bottom: 2rem;
  right: 2rem;
  z-index: 1000;
  display: flex;
  flex-direction: column;
  align-items: flex-end;
  cursor: pointer;
}

.chat-prompt-hint {
  position: absolute;
  bottom: 64px;
  right: 0;
  white-space: nowrap;
  background-color: var(--color-primary-dark, #0f172a);
  color: #fff;
  padding: 0.625rem 1rem;
  border-radius: 14px;
  box-shadow: 0 8px 30px rgba(0, 0, 0, 0.3);
  font-size: 0.8125rem;
  font-weight: 600;
  border: 1px solid rgba(255, 255, 255, 0.1);
  animation: float-bounce 3s ease-in-out infinite;
  transition: all 0.25s ease;
}

.chat-prompt-hint::after {
  content: '';
  position: absolute;
  bottom: -6px;
  right: 18px;
  width: 12px;
  height: 12px;
  background: var(--color-primary-dark, #0f172a);
  border-right: 1px solid rgba(255, 255, 255, 0.1);
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  transform: rotate(45deg);
}

.chat-widget:hover .chat-prompt-hint {
  transform: translateY(-4px);
  background-color: var(--color-accent, #2563eb);
}

.chat-widget:hover .chat-prompt-hint::after {
  background: var(--color-accent, #2563eb);
}

.chat-toggle {
  width: 52px;
  height: 52px;
  border-radius: 50%;
  border: none;
  background: var(--color-accent, #2563eb);
  color: #fff;
  font-size: 1.125rem;
  font-weight: 800;
  cursor: pointer;
  box-shadow: 0 8px 24px rgba(37, 99, 235, 0.4);
  transition: all 0.3s cubic-bezier(0.4, 0, 0.2, 1);
  display: flex;
  align-items: center;
  justify-content: center;
}

.chat-widget:hover .chat-toggle {
  transform: scale(1.1) rotate(5deg);
  box-shadow: 0 12px 30px rgba(37, 99, 235, 0.6);
}

@keyframes float-bounce {
  0%, 100% { transform: translateY(0); }
  50% { transform: translateY(-8px); }
}

@media (max-width: 600px) {
  .chat-widget {
    bottom: 1.5rem;
    right: 1.5rem;
  }
  .chat-prompt-hint {
    display: none; /* Ocultar el texto en móviles para mantener limpio el diseño */
  }
}
</style>