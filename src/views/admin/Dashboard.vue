<template>
  <div class="container">
    <AdminLayout>
      <h1 class="page-title">Panel de Administración</h1>
      <p class="page-subtitle">Bienvenido, {{ authStore.user?.username }}. Gestiona tu portafolio desde aquí.</p>

      <div class="stats-grid">
        <router-link to="/admin/proyectos" class="stat-card card">
          <div class="stat-number">{{ proyectosStore.items.length }}</div>
          <div class="stat-label">Proyectos</div>
        </router-link>
        <router-link to="/admin/experiencias" class="stat-card card">
          <div class="stat-number">{{ experienciasStore.items.length }}</div>
          <div class="stat-label">Experiencias</div>
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
        <router-link to="/admin/experiencias" class="btn btn-primary">Gestionar Experiencias</router-link>
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

      <!-- Modal de Carga de CV -->
      <div v-if="showCVUpload" class="modal-overlay" @click.self="closeCVModal">
        <div class="modal-content glass-panel">
          <h2>Carga tu Currículum</h2>
          <p class="modal-desc">Sube tu CV en PDF y nuestra IA extraerá tu experiencia, estudios y habilidades automáticamente para llenar tu portafolio.</p>
          
          <form @submit.prevent="handleCVUpload" class="cv-form">
            <div class="file-drop-area" :class="{ 'has-file': selectedFile }">
              <input type="file" ref="cvFileInput" accept="application/pdf" class="file-input" @change="onFileChange" required />
              <div class="file-label" v-if="!selectedFile">
                <span class="upload-icon">📄</span>
                <span>Haz clic para seleccionar tu PDF</span>
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
  if (file && file.type === 'application/pdf') {
    selectedFile.value = file
  } else {
    alert("Por favor, sube un archivo PDF válido.")
    selectedFile.value = null
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

onMounted(() => {
  authStore.fetchUser()
  proyectosStore.fetchAll()
  experienciasStore.fetchAll()
  estudiosStore.fetchAll()
  perfilStore.fetchAll()
  chatLogsStore.fetchStats()
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

/* Modal CV Upload Styles */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  bottom: 0;
  background-color: rgba(0, 0, 0, 0.7);
  backdrop-filter: blur(5px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  width: 90%;
  max-width: 500px;
  padding: 2.5rem;
  border-radius: 16px;
  background: var(--color-surface);
  border: 1px solid rgba(255, 255, 255, 0.1);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
  text-align: center;
}

.modal-content h2 {
  font-size: 1.5rem;
  margin-bottom: 0.5rem;
  color: var(--color-text);
}

.modal-desc {
  font-size: 0.9rem;
  color: var(--color-text-muted);
  margin-bottom: 2rem;
  line-height: 1.5;
}

.file-drop-area {
  position: relative;
  width: 100%;
  height: 150px;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: 12px;
  display: flex;
  justify-content: center;
  align-items: center;
  transition: all 0.3s ease;
  background: rgba(0, 0, 0, 0.2);
  margin-bottom: 2rem;
}

.file-drop-area:hover {
  border-color: #3b82f6;
  background: rgba(59, 130, 246, 0.05);
}

.file-drop-area.has-file {
  border-color: #10b981;
  background: rgba(16, 185, 129, 0.05);
}

.file-input {
  position: absolute;
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
  gap: 0.5rem;
  color: var(--color-text-muted);
  font-weight: 500;
}

.file-label.selected {
  color: #10b981;
}

.upload-icon {
  font-size: 2rem;
}

.modal-actions {
  display: flex;
  justify-content: flex-end;
  gap: 1rem;
}

.btn-glow {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  border: none;
}

.loader-inline {
  display: inline-block;
  width: 16px;
  height: 16px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
