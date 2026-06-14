<template>
  <div class="container">
    <AdminLayout>
      <div class="admin-header">
        <h1 class="page-title">Personalización Visual</h1>
      </div>

      <div class="card form-card">
        <form @submit.prevent="saveConfig" class="admin-form">
          
          <h3 class="subsection-title">Elige el Tema de tu Portafolio</h3>
          <p class="help-text">Selecciona el estilo visual que mejor represente tu marca personal.</p>

          <div class="themes-grid">
            <div 
              v-for="theme in availableThemes" 
              :key="theme.id"
              class="theme-card"
              :class="{ active: form.portfolio_theme === theme.id }"
              @click="selectTheme(theme.id)"
            >
              <div class="theme-preview" :style="theme.previewStyle">
                <div class="preview-element primary"></div>
                <div class="preview-element secondary"></div>
              </div>
              <div class="theme-info">
                <h4>{{ theme.name }}</h4>
                <p>{{ theme.description }}</p>
              </div>
              <div class="theme-selector" v-if="form.portfolio_theme === theme.id">
                <span class="check-icon">✓</span>
              </div>
            </div>
          </div>

          <div class="form-actions" style="margin-top: 2rem;">
            <button type="submit" class="btn btn-primary" :disabled="saving">
              <span v-if="saving" class="spinner"></span>
              {{ saving ? 'Guardando...' : 'Guardar Apariencia' }}
            </button>
          </div>
        </form>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/theme'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const form = ref({
  portfolio_theme: 'dark-glass'
})

const saving = ref(false)

const availableThemes = [
  {
    id: 'dark-glass',
    name: 'Dark Glassmorphism',
    description: 'Elegante, tecnológico y profundo. (Por defecto)',
    previewStyle: { background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)', borderColor: '#3f3f46' }
  },
  {
    id: 'light-minimalist',
    name: 'Light Minimalist',
    description: 'Limpio, luminoso y profesional.',
    previewStyle: { background: '#f8fafc', borderColor: '#e2e8f0' }
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Alto contraste, vibrante y hacker.',
    previewStyle: { background: '#000000', borderColor: '#22c55e' }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Corporativo, serio y confiable.',
    previewStyle: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)', borderColor: '#3b82f6' }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Creativo, cálido y personal.',
    previewStyle: { background: 'linear-gradient(135deg, #2a101f 0%, #701a40 100%)', borderColor: '#f43f5e' }
  }
]

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  
  if (authStore.user) {
    try {
      const data = await api.getUserByUsername(authStore.user.username.split('@')[0])
      form.value.portfolio_theme = data.portfolio_theme || 'dark-glass'
    } catch (err) {
      console.error('Error cargando tema:', err)
    }
  }
})

const selectTheme = (themeId) => {
  form.value.portfolio_theme = themeId
  themeStore.setTheme(themeId) // Live preview!
}

const saveConfig = async () => {
  saving.value = true
  try {
    await api.updateThemeConfig({
      portfolio_theme: form.value.portfolio_theme
    })
    alert('Tema actualizado correctamente.')
  } catch (err) {
    alert(err.message || 'Error al guardar el tema')
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.form-card {
  max-width: 800px;
  margin-top: 1.5rem;
}

.subsection-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-100);
  margin-bottom: 0.5rem;
}

.help-text {
  color: var(--color-gray-400);
  font-size: 0.875rem;
  margin-bottom: 2rem;
}

.themes-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(220px, 1fr));
  gap: 1.5rem;
}

.theme-card {
  background: rgba(24, 24, 27, 0.4);
  border: 2px solid var(--color-gray-800);
  border-radius: var(--radius-lg);
  overflow: hidden;
  cursor: pointer;
  transition: all 0.2s ease;
  position: relative;
}

.theme-card:hover {
  border-color: var(--color-gray-600);
  transform: translateY(-2px);
}

.theme-card.active {
  border-color: var(--color-primary);
  box-shadow: 0 0 0 1px var(--color-primary);
  background: rgba(24, 24, 27, 0.8);
}

.theme-preview {
  height: 100px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
  padding: 1rem;
}

.preview-element {
  height: 12px;
  border-radius: 4px;
  background: rgba(255, 255, 255, 0.2);
}

.preview-element.primary {
  width: 60%;
}

.preview-element.secondary {
  width: 40%;
  background: rgba(255, 255, 255, 0.1);
}

.theme-info {
  padding: 1rem;
}

.theme-info h4 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-100);
  margin-bottom: 0.25rem;
}

.theme-info p {
  font-size: 0.8rem;
  color: var(--color-gray-400);
  line-height: 1.4;
}

.theme-selector {
  position: absolute;
  top: 0.5rem;
  right: 0.5rem;
  width: 24px;
  height: 24px;
  background: var(--color-primary);
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
}

.check-icon {
  color: white;
  font-size: 14px;
  font-weight: bold;
}
</style>
