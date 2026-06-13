<template>
  <div class="container">
    <AdminLayout>
      <div class="admin-header">
        <h1 class="page-title">Configuración del Chatbot</h1>
      </div>

      <div class="card form-card">
        <form @submit.prevent="saveConfig" class="admin-form">
          
          <h3 class="subsection-title">Mensaje Inicial</h3>
          <div class="form-group">
            <label for="welcomeMsg">Ingresa el mensaje inicial de tu asistente IA</label>
            <textarea
              id="welcomeMsg"
              v-model="form.chat_welcome_message"
              class="form-input"
              rows="4"
              placeholder="Ej: ¡Hola! Soy el asistente virtual de Sofia. Estoy aquí para ayudarte..."
            ></textarea>
          </div>

          <h3 class="subsection-title">Preguntas Sugeridas (Chips)</h3>
          <p class="help-text">Agrega hasta 3 preguntas rápidas para que el visitante haga clic y pregunte fácilmente.</p>

          <div class="form-group">
            <label for="q1">Pregunta Sugerida 1</label>
            <input
              type="text"
              id="q1"
              v-model="form.chat_suggested_q1"
              class="form-input"
              placeholder="Ej: ¿Cuáles son sus principales habilidades?"
            />
          </div>

          <div class="form-group">
            <label for="q2">Pregunta Sugerida 2</label>
            <input
              type="text"
              id="q2"
              v-model="form.chat_suggested_q2"
              class="form-input"
              placeholder="Ej: ¿Qué experiencia laboral tiene?"
            />
          </div>

          <div class="form-group">
            <label for="q3">Pregunta Sugerida 3</label>
            <input
              type="text"
              id="q3"
              v-model="form.chat_suggested_q3"
              class="form-input"
              placeholder="Ej: Muéstrame su último proyecto"
            />
          </div>

          <div class="form-actions">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving">Guardando...</span>
              <span v-else>Guardar Cambios</span>
            </button>
            <p v-if="successMsg" class="success-message">{{ successMsg }}</p>
            <p v-if="errorMsg" class="error-message">{{ errorMsg }}</p>
          </div>

        </form>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { api } from '../../services/api'

const form = ref({
  chat_welcome_message: '',
  chat_suggested_q1: '',
  chat_suggested_q2: '',
  chat_suggested_q3: ''
})

const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  try {
    const userProfile = await api.me()
    if (userProfile) {
      form.value.chat_welcome_message = userProfile.chat_welcome_message || ''
      form.value.chat_suggested_q1 = userProfile.chat_suggested_q1 || ''
      form.value.chat_suggested_q2 = userProfile.chat_suggested_q2 || ''
      form.value.chat_suggested_q3 = userProfile.chat_suggested_q3 || ''
    }
  } catch (err) {
    console.error('Error loading chat config:', err)
  }
})

async function saveConfig() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  
  try {
    await api.updateChatConfig({
      chat_welcome_message: form.value.chat_welcome_message || null,
      chat_suggested_q1: form.value.chat_suggested_q1 || null,
      chat_suggested_q2: form.value.chat_suggested_q2 || null,
      chat_suggested_q3: form.value.chat_suggested_q3 || null,
    })
    successMsg.value = '¡Configuración guardada con éxito!'
    setTimeout(() => successMsg.value = '', 3000)
  } catch (err) {
    errorMsg.value = 'Ocurrió un error al guardar la configuración.'
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.admin-header {
  margin-bottom: 2rem;
}

.form-card {
  padding: 2rem;
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

label {
  display: block;
  font-weight: 500;
  margin-bottom: 0.25rem;
  color: var(--color-gray-700);
}

.help-text {
  font-size: 0.8rem;
  color: var(--color-gray-400);
  margin-bottom: 0.5rem;
}

.form-input {
  width: 100%;
  padding: 0.875rem 1.25rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  border-radius: var(--radius-md, 12px);
  outline: none;
  font-family: inherit;
  font-size: 0.9375rem;
  transition: all 0.2s ease;
}

.form-input:focus {
  border-color: #3b82f6;
  background: rgba(0, 0, 0, 0.4);
}

.subsection-title {
  font-size: 1.1rem;
  color: var(--color-primary);
  margin-top: 2rem;
  margin-bottom: 0.5rem;
  padding-bottom: 0.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.form-actions {
  margin-top: 2rem;
  display: flex;
  align-items: center;
  gap: 1rem;
}

.success-message {
  color: #10b981;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}

.error-message {
  color: #ef4444;
  font-size: 0.9rem;
  font-weight: 500;
  margin: 0;
}
</style>
