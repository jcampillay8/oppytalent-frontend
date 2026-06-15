<template>
  <div class="card form-card">
    <div class="form-header">
      <h3 class="form-title">{{ perfil ? 'Editar Perfil' : 'Nuevo Perfil' }}</h3>
      <div class="lang-tabs">
        <button type="button" class="tab-btn" :class="{ active: currentTab === 'es' }" @click="setTab('es')">
          🇪🇸 Español (Principal)
        </button>
        <button type="button" class="tab-btn" :class="{ active: currentTab === 'en' }" @click="setTab('en')">
          🇺🇸 Inglés (Traducción)
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="ai-action-bar">
        <p class="ai-info">Ingresa la traducción manualmente o deja que la IA lo haga por ti basado en el contenido en Español.</p>
        <button type="button" class="btn btn-ai" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="spinner-small"></span>
          {{ isTranslating ? 'Traduciendo...' : '✨ Traducir con IA' }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="common-fields-section">
        <h4 class="section-title">Datos Generales</h4>
        <div class="form-group">
          <label>URL de Imagen de perfil</label>
          <ImageUploader v-model="form.image_url" />
        </div>
        <div class="form-group">
          <label>URL del Avatar navbar</label>
          <ImageUploader v-model="form.avatar_url" />
        </div>
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Teléfono</label>
            <input v-model="form.telefono" type="text" class="form-input" placeholder="+56 9 1234 5678" />
          </div>
          <div class="form-group flex-1">
            <label>Email</label>
            <input v-model="form.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group flex-1">
            <label>LinkedIn (URL)</label>
            <input v-model="form.linkedin" type="url" class="form-input" placeholder="https://linkedin.com/in/usuario" />
          </div>
          <div class="form-group flex-1">
            <label>GitHub (URL)</label>
            <input v-model="form.github" type="url" class="form-input" placeholder="https://github.com/usuario" />
          </div>
        </div>
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Ciudad</label>
            <input v-model="form.ciudad" type="text" class="form-input" placeholder="Santiago, Chile" />
          </div>
          <div class="form-group flex-1">
            <label>Video Pitch (YouTube)</label>
            <input v-model="form.youtube_url" type="url" class="form-input" placeholder="https://www.youtube.com/watch?v=..." />
          </div>
        </div>
        <hr class="divider" />
        <h4 class="section-title">Contenido (Español)</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="translatable-fields-section">
        <div class="form-group">
          <label>Descripción Personal (Markdown)</label>
          <textarea v-model="activeModel.descripcion" class="form-textarea" rows="10" required></textarea>
        </div>
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Certificaciones (JSON)</label>
            <textarea v-model="activeCertificacionesText" class="form-textarea" rows="4" placeholder='[{"titulo": "Licencia A4", "entidad": "Dirección de Tránsito"}]' @blur="parseCertificaciones"></textarea>
          </div>
          <div class="form-group flex-1">
            <label>Idiomas (JSON)</label>
            <textarea v-model="activeIdiomasText" class="form-textarea" rows="4" placeholder='[{"idioma": "Inglés", "nivel": "Avanzado"}]' @blur="parseIdiomas"></textarea>
          </div>
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="spinner-small"></span>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="isSubmitting">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'
import { api } from '../../services/api.js'
import ImageUploader from './ImageUploader.vue'

const props = defineProps({
  perfil: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

const form = ref({
  descripcion: '',
  image_url: '',
  avatar_url: '',
  telefono: '',
  email: '',
  linkedin: '',
  github: '',
  ciudad: '',
  youtube_url: '',
  certificaciones: [],
  idiomas: [],
  traducciones: []
})

const certificacionesTextEs = ref('')
const idiomasTextEs = ref('')
const certificacionesTextEn = ref('')
const idiomasTextEn = ref('')

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      descripcion: '',
      certificaciones: [],
      idiomas: []
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

const activeCertificacionesText = computed({
  get: () => currentTab.value === 'es' ? certificacionesTextEs.value : certificacionesTextEn.value,
  set: (val) => currentTab.value === 'es' ? certificacionesTextEs.value = val : certificacionesTextEn.value = val
})

const activeIdiomasText = computed({
  get: () => currentTab.value === 'es' ? idiomasTextEs.value : idiomasTextEn.value,
  set: (val) => currentTab.value === 'es' ? idiomasTextEs.value = val : idiomasTextEn.value = val
})

function setTab(tab) {
  currentTab.value = tab
  activeModel.value
}

function parseCertificaciones() {
  try {
    activeModel.value.certificaciones = activeCertificacionesText.value ? JSON.parse(activeCertificacionesText.value) : []
  } catch {
    activeModel.value.certificaciones = []
  }
}

function parseIdiomas() {
  try {
    activeModel.value.idiomas = activeIdiomasText.value ? JSON.parse(activeIdiomasText.value) : []
  } catch {
    activeModel.value.idiomas = []
  }
}

function handleParseImageUrl() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function handleParseAvatarUrl() {
  form.value.avatar_url = parseImageUrl(form.value.avatar_url)
}

async function translateWithAI() {
  if (!form.value.descripcion) {
    alert("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      descripcion: form.value.descripcion,
      certificaciones: form.value.certificaciones,
      idiomas: form.value.idiomas
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.descripcion = t.descripcion || ''
    enModel.certificaciones = t.certificaciones || []
    enModel.idiomas = t.idiomas || []
    
    certificacionesTextEn.value = JSON.stringify(enModel.certificaciones || [], null, 2)
    idiomasTextEn.value = JSON.stringify(enModel.idiomas || [], null, 2)
    
  } catch (error) {
    console.error("Error al traducir:", error)
    alert("Ocurrió un error al intentar traducir con la IA.")
  } finally {
    isTranslating.value = false
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  
  currentTab.value = 'es'
  handleParseImageUrl()
  handleParseAvatarUrl()
  parseCertificaciones()
  parseIdiomas()
  
  currentTab.value = 'en'
  parseCertificaciones()
  parseIdiomas()
  
  currentTab.value = 'es'
  
  try {
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.descripcion.trim() !== '')
    emit('save', dataToSend)
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 1000)
  }
}

onMounted(() => {
  if (props.perfil) {
    form.value = JSON.parse(JSON.stringify(props.perfil))
    if (!form.value.traducciones) form.value.traducciones = []
    
    certificacionesTextEs.value = JSON.stringify(form.value.certificaciones || [], null, 2)
    idiomasTextEs.value = JSON.stringify(form.value.idiomas || [], null, 2)
    
    const enTrans = form.value.traducciones.find(t => t.idioma === 'en')
    if (enTrans) {
      certificacionesTextEn.value = JSON.stringify(enTrans.certificaciones || [], null, 2)
      idiomasTextEn.value = JSON.stringify(enTrans.idiomas || [], null, 2)
    }
  }
})
</script>

<style scoped>
.form-card {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
  padding-bottom: 1rem;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0;
}

.lang-tabs {
  display: flex;
  gap: 0.5rem;
}

.tab-btn {
  padding: 0.5rem 1rem;
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-300);
  border-radius: 6px;
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
  cursor: pointer;
  transition: all 0.2s ease;
}

.tab-btn:hover {
  background: var(--color-gray-200);
}

.tab-btn.active {
  background: var(--color-primary-50);
  border-color: var(--color-primary-500);
  color: var(--color-primary-700);
}

.section-title {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-700);
  margin-bottom: 1rem;
  margin-top: 0;
}

.divider {
  border: 0;
  border-top: 1px dashed var(--color-gray-300);
  margin: 1.5rem 0;
}

.ai-action-bar {
  background: linear-gradient(135deg, rgba(99, 102, 241, 0.05) 0%, rgba(168, 85, 247, 0.05) 100%);
  border: 1px solid rgba(168, 85, 247, 0.2);
  border-radius: 8px;
  padding: 1rem;
  margin-bottom: 1.5rem;
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.ai-info {
  margin: 0;
  font-size: 0.875rem;
  color: var(--color-gray-700);
}

.btn-ai {
  background: linear-gradient(135deg, #6366f1 0%, #a855f7 100%);
  color: white;
  border: none;
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.btn-ai:hover:not(:disabled) {
  opacity: 0.9;
  transform: translateY(-1px);
}

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}

.spinner-small {
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
</style>
