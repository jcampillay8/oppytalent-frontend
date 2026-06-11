<template>
  <div class="card form-card">
    <div class="form-header">
      <h3 class="form-title">{{ estudio ? 'Editar Estudio' : 'Nuevo Estudio' }}</h3>
      <div class="lang-tabs">
        <button type="button" class="tab-btn" :class="{ active: currentTab === 'es' }" @click="currentTab = 'es'">
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
        <div class="form-row">
          <div class="form-group flex-1">
            <label>Año de Obtención</label>
            <input v-model.number="form.anio_obtencion" type="number" class="form-input" min="1900" :max="new Date().getFullYear()" required />
          </div>
          <div class="form-group flex-1">
            <label>URL de Imagen (o ID de Drive)</label>
            <input v-model="form.image_url" type="text" class="form-input" placeholder="ID de Drive o URL" @blur="handleParseImageUrl" />
          </div>
        </div>
        <div class="form-group">
          <label>Enlace / URL de Credencial</label>
          <input v-model="form.link" type="url" class="form-input" placeholder="https://..." />
        </div>
        <hr class="divider" />
        <h4 class="section-title">Contenido (Español)</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="translatable-fields-section">
        <div class="form-group">
          <label>Institución</label>
          <input v-model="activeModel.institucion" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label>Título</label>
          <input v-model="activeModel.titulo" type="text" class="form-input" required />
        </div>
        <div class="form-group">
          <label>Descripción Detallada (Markdown)</label>
          <textarea v-model="activeModel.descripcion_detallada" class="form-textarea" rows="6" required></textarea>
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

const props = defineProps({
  estudio: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

const form = ref({
  institucion: '',
  titulo: '',
  anio_obtencion: new Date().getFullYear(),
  descripcion_detallada: '',
  link: '',
  image_url: '',
  traducciones: []
})

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      institucion: '',
      titulo: '',
      descripcion_detallada: ''
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

function setTab(tab) {
  currentTab.value = tab
  activeModel.value
}

function handleParseImageUrl() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

async function translateWithAI() {
  if (!form.value.titulo) {
    alert("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      institucion: form.value.institucion,
      titulo: form.value.titulo,
      descripcion_detallada: form.value.descripcion_detallada
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.institucion = t.institucion || ''
    enModel.titulo = t.titulo || ''
    enModel.descripcion_detallada = t.descripcion_detallada || ''
    
  } catch (error) {
    console.error("Error al traducir:", error)
    alert("Ocurrió un error al intentar traducir con la IA.")
  } finally {
    isTranslating.value = false
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  handleParseImageUrl()
  
  try {
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.titulo.trim() !== '')
    emit('save', dataToSend)
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 1000)
  }
}

onMounted(() => {
  if (props.estudio) {
    form.value = JSON.parse(JSON.stringify(props.estudio))
    if (!form.value.traducciones) form.value.traducciones = []
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
