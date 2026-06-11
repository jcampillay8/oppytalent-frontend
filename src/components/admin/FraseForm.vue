<template>
  <div class="card form-card">
    <div class="form-header">
      <h3 class="form-title">{{ frase ? 'Editar Frase' : 'Nueva Frase' }}</h3>
      <div class="lang-tabs">
        <button type="button" class="tab-btn" :class="{ active: currentTab === 'es' }" @click="setTab('es')">
          🇪🇸 Español (Principal)
        </button>
        <button type="button" class="tab-btn" :class="{ active: currentTab === 'en' }" @click="setTab('en')">
          🇺🇸 Inglés (Traducción)
        </button>
      </div>
    </div>

    <form @submit.prevent="submit" class="form">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="ai-action-bar">
        <p class="ai-info">Ingresa la traducción manualmente o deja que la IA lo haga por ti basado en el contenido en Español.</p>
        <button type="button" class="btn btn-ai" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="spinner-small"></span>
          {{ isTranslating ? 'Traduciendo...' : '✨ Traducir con IA' }}
        </button>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="translatable-fields-section">
        <div class="form-group">
          <label>Texto de la Frase</label>
          <textarea
            v-model="activeModel.texto"
            required
            rows="4"
            class="form-input"
            placeholder="Escribe la frase..."
          ></textarea>
        </div>

        <div class="form-group">
          <label>Autor</label>
          <input
            v-model="activeModel.autor"
            type="text"
            required
            class="form-input"
            placeholder="Ej: Seneca"
          />
        </div>
      </div>

      <div class="form-actions">
        <button type="submit" class="btn btn-primary" :disabled="loading">
          <span v-if="loading" class="spinner-small"></span>
          {{ loading ? 'Guardando...' : 'Guardar Frase' }}
        </button>
        <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="loading">
          Cancelar
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { api } from '../../services/api.js'

const props = defineProps({
  frase: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const form = ref({ texto: '', autor: '', traducciones: [] })
const loading = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

watch(
  () => props.frase,
  (val) => {
    if (val) {
      form.value = JSON.parse(JSON.stringify(val))
      if (!form.value.traducciones) form.value.traducciones = []
    } else {
      form.value = { texto: '', autor: '', traducciones: [] }
    }
  },
  { immediate: true }
)

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      texto: '',
      autor: ''
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

function setTab(tab) {
  currentTab.value = tab
  activeModel.value
}

async function translateWithAI() {
  if (!form.value.texto || !form.value.autor) {
    alert("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      texto: form.value.texto,
      autor: form.value.autor
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.texto = t.texto || ''
    enModel.autor = t.autor || ''
    
  } catch (error) {
    console.error("Error al traducir:", error)
    alert("Ocurrió un error al intentar traducir con la IA.")
  } finally {
    isTranslating.value = false
  }
}

async function submit() {
  loading.value = true
  try {
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.texto.trim() !== '')
    emit('save', dataToSend)
  } finally {
    setTimeout(() => { loading.value = false }, 1000)
  }
}
</script>

<style scoped>
.form-card {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-primary);
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

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: var(--color-gray-700);
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-start;
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
