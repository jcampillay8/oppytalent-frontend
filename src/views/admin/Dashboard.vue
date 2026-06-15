<template>
  <div class="container">
    <AdminLayout>
      <h1 class="page-title">Panel de Administración</h1>
      <p class="page-subtitle">Bienvenido, {{ authStore.user?.username }}. Gestiona tu portafolio desde aquí.</p>

      <!-- ESTADO ACTIVO: Dashboard Normal -->
      <template v-if="!isPortfolioEmpty && !isLoading">


      <div class="stats-grid">
        <router-link to="/admin/proyectos" class="stat-card card">
          <div class="stat-number">{{ proyectosStore.items.length }}</div>
          <div class="stat-label">Proyectos</div>
        </router-link>
        <router-link to="/admin/experiencias" class="stat-card card">
          <div class="stat-number">{{ experienciasStore.items.length }}</div>
          <div class="stat-label">Experiencia Laboral</div>
        </router-link>
        <router-link to="/admin/estudios" class="stat-card card">
          <div class="stat-number">{{ estudiosStore.items.length }}</div>
          <div class="stat-label">Estudios</div>
        </router-link>
        <router-link to="/admin/perfil" class="stat-card card">
          <div class="stat-number">{{ perfilStore.items.length }}</div>
          <div class="stat-label">Perfiles</div>
        </router-link>
      </div>

      <div class="admin-actions">
        <router-link to="/admin/proyectos" class="btn btn-primary">Gestionar Proyectos</router-link>
        <router-link to="/admin/experiencias" class="btn btn-primary">Gestionar Experiencia Laboral</router-link>
        <router-link to="/admin/estudios" class="btn btn-primary">Gestionar Estudios</router-link>
        <router-link to="/admin/perfil" class="btn btn-primary">Sobre Mí</router-link>
        <router-link to="/admin/chat-logs" class="btn btn-primary">Ver Logs del Chat</router-link>
      </div>

      <div class="chart-section" v-if="chatLogsStore.stats.length > 0">
        <h3>Interacciones del Chat (Últimos 30 días)</h3>
        <div class="chart-container">
          <div 
            v-for="stat in chatLogsStore.stats" 
            :key="stat.date" 
            class="bar-wrapper"
          >
            <div 
              class="bar" 
              :style="{ height: `${Math.max((stat.count / maxStatCount) * 100, 5)}%` }"
              :title="`${stat.date}: ${stat.count} consultas`"
            >
              <span class="bar-label">{{ stat.count }}</span>
            </div>
            <div class="bar-date">{{ formatDateShort(stat.date) }}</div>
          </div>
        </div>
      </div>

      <div class="bottom-actions" style="display: flex; gap: 1rem; align-items: center; margin-top: 2rem; margin-bottom: 1rem;">
        <button class="btn btn-primary" @click="showCVUpload = true" style="background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%); border: none; box-shadow: 0 4px 14px rgba(59, 130, 246, 0.3);">✨ Carga tu CV (Auto-Completar con IA)</button>
        <button class="btn btn-outline logout-btn" @click="handleLogout" style="margin-top: 0;">Cerrar Sesión</button>
      </div>
      </template>

      <!-- ESTADO DE CARGA -->
      <div v-else-if="isLoading" class="loading-state">
        <div class="spinner"></div>
        <p>Cargando tu portafolio...</p>
      </div>

      <!-- ESTADO VACÍO: Onboarding -->
      <template v-else>
        <div class="onboarding-wrapper">
          <div class="onboarding-card card">
            <div class="onboarding-icon">🚀</div>
            <h2 class="onboarding-title">¡Bienvenido a tu nuevo portafolio inteligente!</h2>
            <p class="onboarding-subtitle">Tu portafolio está vacío. Para empezar a brillar frente a los reclutadores, elige tu propio camino para construir tu perfil:</p>
            
            <div class="onboarding-actions">
              <!-- Camino Rápido -->
              <button class="btn onboarding-btn-primary" @click="showCVUpload = true">
                <span class="btn-icon">📄</span>
                <div class="btn-text">
                  <strong>Sube tu CV</strong>
                  <span>La IA construirá tu perfil por ti en segundos</span>
                </div>
              </button>

              <!-- Camino Manual -->
              <router-link :to="`/${route.params.username}/perfil`" class="btn onboarding-btn-secondary">
                <span class="btn-icon">✍️</span>
                <div class="btn-text">
                  <strong>Empezar desde cero</strong>
                  <span>Llenaré mis datos manualmente paso a paso</span>
                </div>
              </router-link>
            </div>
          </div>
          <button class="btn btn-outline logout-btn" @click="handleLogout" style="margin-top: 1.5rem; margin-left: auto; margin-right: auto; display: block;">Cerrar Sesión</button>
        </div>
      </template>

      <!-- Modal de Carga de CV -->
      <div v-if="showCVUpload" class="modal-overlay" @click.self="closeCVModal">
        <div class="modal-content glass-panel">
          <h2>Carga tu Currículum</h2>
          <p class="modal-desc">Sube tu CV (PDF, Word, TXT, Imagen) y nuestra IA extraerá tu experiencia, estudios y habilidades automáticamente para llenar tu portafolio.</p>
          
          <form @submit.prevent="handleCVUpload" class="cv-form">
            <div class="file-drop-area" :class="{ 'has-file': selectedFile }">
              <input type="file" ref="fileInput" accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg" class="file-input" @change="onFileChange" required />
              <div class="file-label" v-if="!selectedFile">
                <span class="upload-icon">📄</span>
                <span>Haz clic para seleccionar tu archivo (PDF, Word, TXT, Imagen)</span>
              </div>
              <div class="file-label selected" v-else>
                <span class="upload-icon">✅</span>
                <span>{{ selectedFile.name }}</span>
              </div>
            </div>
            
            <div class="modal-actions">
              <button type="button" class="btn btn-outline" @click="closeCVModal" :disabled="uploadingCV">Cancelar</button>
              <button type="submit" class="btn btn-primary btn-glow" :disabled="!selectedFile || uploadingCV">
                <span v-if="uploadingCV" class="loader-inline"></span>
                <span v-else>Procesar con IA</span>
              </button>
            </div>
          </form>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useAuthStore } from '../../stores/auth'
import { useCVWizardStore } from '../../stores/cvWizard'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { usePerfilStore } from '../../stores/perfil'
import { useChatLogsStore } from '../../stores/chatLogs'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cvWizardStore = useCVWizardStore()
const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const perfilStore = usePerfilStore()
const chatLogsStore = useChatLogsStore()

const isLoading = computed(() => {
  return proyectosStore.loading || experienciasStore.loading || estudiosStore.loading || perfilStore.loading
})

const isPortfolioEmpty = computed(() => {
  return proyectosStore.items.length === 0 &&
         experienciasStore.items.length === 0 &&
         estudiosStore.items.length === 0 &&
         perfilStore.items.length === 0
})

const maxStatCount = computed(() => {
  if (!chatLogsStore.stats.length) return 1
  return Math.max(...chatLogsStore.stats.map(s => s.count))
})

function formatDateShort(dateString) {
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`
  }
  return dateString
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Lógica de CV
const showCVUpload = ref(false)
const selectedFile = ref(null)
const uploadingCV = ref(false)

function onFileChange(event) {
  const file = event.target.files[0]
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg']
  
  if (file) {
    const fileName = file.name.toLowerCase()
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (isValid) {
      selectedFile.value = file
    } else {
      alert("Por favor, sube un formato válido (PDF, Word, TXT, MD o Imagen).")
      selectedFile.value = null
    }
  }
}

function closeCVModal() {
  if (uploadingCV.value) return
  showCVUpload.value = false
  selectedFile.value = null
}

async function handleCVUpload() {
  if (!selectedFile.value) return
  uploadingCV.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    // Llamada real al backend para extraer datos con IA
    const data = await api.extractCV(formData)
    
    // Guardar los datos extraídos en el Store
    cvWizardStore.setExtractedData(data)
    
    closeCVModal()
    
    // Redirigir al Asistente de CV
    router.push(`/${route.params.username}/cv-wizard`)
    
  } catch (error) {
    alert("Ocurrió un error al subir el CV: " + error.message)
  } finally {
    uploadingCV.value = false
  }
}

onMounted(async () => {
  try {
    if (!proyectosStore.items.length && !proyectosStore.loading) proyectosStore.fetchAll()
    if (!experienciasStore.items.length && !experienciasStore.loading) experienciasStore.fetchAll()
    if (!estudiosStore.items.length && !estudiosStore.loading) estudiosStore.fetchAll()
    if (!perfilStore.items.length && !perfilStore.loading) perfilStore.fetchAll()

    await chatLogsStore.fetchStats()
  } catch (error) {
    console.error(error)
  }
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: block;
  padding: 1.5rem;
  text-align: center;
  color: inherit;
}

.stat-card:hover {
  text-decoration: none;
  color: inherit;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-top: 0.25rem;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.chart-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.chart-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 40px;
}

.bar {
  width: 100%;
  background-color: var(--color-primary);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  position: relative;
  display: flex;
  justify-content: center;
}

.bar:hover {
  background-color: var(--color-primary-hover);
}

.bar-label {
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--color-text);
}

.bar-date {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.logout-btn {
  margin-top: 2rem;
}

/* MODAL Y UPLOAD CV */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.85);
  backdrop-filter: blur(8px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1rem;
}

.modal-content {
  background: linear-gradient(145deg, rgba(24, 24, 27, 0.95), rgba(39, 39, 42, 0.95));
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: var(--radius-xl, 1rem);
  padding: 2.5rem;
  width: 100%;
  max-width: 500px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.modal-content h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.75rem;
  color: white;
  text-align: center;
}

.modal-desc {
  color: var(--color-gray-400);
  font-size: 0.95rem;
  line-height: 1.5;
  text-align: center;
  margin-bottom: 2rem;
}

.cv-form {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.file-drop-area {
  position: relative;
  border: 2px dashed var(--color-gray-700);
  border-radius: var(--radius-lg);
  padding: 3rem 2rem;
  text-align: center;
  transition: all 0.2s ease;
  background: rgba(0, 0, 0, 0.2);
  cursor: pointer;
}

.file-drop-area:hover, .file-drop-area.has-file {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.file-input {
  position: absolute;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  opacity: 0;
  cursor: pointer;
  z-index: 10;
}

.file-label {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-gray-400);
  font-size: 0.95rem;
  pointer-events: none;
}

.file-label.selected {
  color: #3b82f6;
  font-weight: 500;
}

.upload-icon {
  font-size: 2.5rem;
}

.modal-actions {
  display: flex;
  gap: 1rem;
  justify-content: flex-end;
  margin-top: 1rem;
}

.modal-actions .btn-outline {
  color: white;
  border-color: rgba(255, 255, 255, 0.2);
  background: transparent;
}

.modal-actions .btn-outline:hover {
  background: rgba(255, 255, 255, 0.05);
}

.btn-glow {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  box-shadow: 0 4px 14px rgba(59, 130, 246, 0.4);
  color: white;
}

.btn-glow:hover:not(:disabled) {
  box-shadow: 0 6px 20px rgba(59, 130, 246, 0.6);
  transform: translateY(-2px);
}

.loader-inline {
  display: inline-block;
  width: 1rem;
  height: 1rem;
  border: 2px solid rgba(255, 255, 255, 0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 1s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}

/* ONBOARDING EMPTY STATE */
.loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 4rem 2rem;
  color: var(--color-gray-500);
}

.spinner {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(59, 130, 246, 0.2);
  border-left-color: #3b82f6;
  border-radius: 50%;
  animation: spin 1s linear infinite;
  margin-bottom: 1rem;
}

.onboarding-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  padding: 3rem 1rem;
  min-height: 60vh;
}

.onboarding-card {
  max-width: 600px;
  width: 100%;
  padding: 3.5rem 2.5rem;
  text-align: center;
  background: linear-gradient(145deg, rgba(24, 24, 27, 0.9), rgba(24, 24, 27, 0.95));
  border: 1px solid var(--color-gray-700);
  border-radius: 20px;
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  display: flex;
  flex-direction: column;
  align-items: center;
}

.onboarding-icon {
  font-size: 4rem;
  margin-bottom: 1.5rem;
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  -webkit-background-clip: text;
  -webkit-text-fill-color: transparent;
  filter: drop-shadow(0 0 15px rgba(59, 130, 246, 0.3));
}

.onboarding-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: white;
  margin-bottom: 1rem;
  line-height: 1.2;
}

.onboarding-subtitle {
  font-size: 1.05rem;
  color: var(--color-gray-400);
  margin-bottom: 3rem;
  line-height: 1.5;
  max-width: 480px;
}

.onboarding-actions {
  display: flex;
  flex-direction: column;
  gap: 1.25rem;
  width: 100%;
}

.onboarding-btn-primary {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-align: left;
  transition: all 0.3s ease;
  box-shadow: 0 10px 25px -5px rgba(59, 130, 246, 0.4);
}

.onboarding-btn-primary:hover {
  transform: translateY(-3px);
  box-shadow: 0 20px 25px -5px rgba(59, 130, 246, 0.5);
}

.onboarding-btn-secondary {
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--color-gray-700);
  padding: 1.25rem 1.5rem;
  border-radius: 12px;
  display: flex;
  align-items: center;
  gap: 1.25rem;
  text-align: left;
  transition: all 0.3s ease;
  color: white;
  text-decoration: none;
}

.onboarding-btn-secondary:hover {
  background: rgba(255, 255, 255, 0.08);
  border-color: var(--color-gray-500);
  transform: translateY(-2px);
}

.btn-icon {
  font-size: 2rem;
}

.btn-text {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.btn-text strong {
  font-size: 1.1rem;
  font-weight: 600;
}

.btn-text span {
  font-size: 0.85rem;
  color: rgba(255, 255, 255, 0.7);
}

.onboarding-btn-secondary .btn-text span {
  color: var(--color-gray-400);
}
</style>
