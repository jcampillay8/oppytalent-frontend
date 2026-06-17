<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ experiencia ? 'Editar Experiencia' : 'Nueva Experiencia' }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('es')">
          🇪🇸 Español (Principal)
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          🇺🇸 Inglés (Traducción)
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">Ingresa la traducción manualmente o deja que la IA lo haga por ti basado en el contenido en Español.</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? 'Traduciendo...' : '✨ Traducir con IA' }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="space-y-4">
        <h4 class="text-base font-semibold text-foreground mb-4">Datos Generales</h4>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Periodo Inicio</label>
            <input v-model="form.periodo_inicio" type="date" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Periodo Fin</label>
            <input v-model="form.periodo_fin" type="date" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 disabled:opacity-50" :disabled="esActual" />
            <label class="flex items-center gap-2 mt-2 text-sm text-muted-foreground cursor-pointer">
              <input type="checkbox" v-model="esActual" class="rounded border-white/20 bg-black/20 text-primary focus:ring-primary/50" />
              Actualmente trabajando aquí
            </label>
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">URL de Imagen (o ID de Google Drive)</label>
          <ImageUploader v-model="form.image_url" />
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Enlace Externo / Proyecto Relacionado</label>
            <input v-model="form.link" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" placeholder="https://..." />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Enlace Demo (Opcional)</label>
            <input v-model="form.link_demo" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" placeholder="https://..." />
          </div>
        </div>
        <hr class="border-t border-dashed border-border/50 my-6" />
        <h4 class="text-base font-semibold text-foreground mb-4">Contenido (Español)</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Empresa</label>
            <input v-model="activeModel.empresa" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">Rol</label>
            <input v-model="activeModel.rol" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">Descripción de Logros (Markdown)</label>
          <textarea v-model="activeModel.descripcion_logros" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[120px] resize-y" rows="6" required></textarea>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">Tags de Industria (separado por comas)</label>
          <input v-model="activeTagsInput" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" placeholder="Minería, Banca, IA" @blur="parseTags" />
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-border/50">
        <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSubmitting ? 'Guardando...' : 'Guardar Cambios' }}
        </button>
        <button type="button" class="px-4 py-2 bg-transparent border border-border/50 text-muted-foreground hover:bg-secondary rounded-lg text-sm font-medium transition-colors" @click="$emit('cancel')" :disabled="isSubmitting">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'
import { api } from '../../services/api.js'
import ImageUploader from './ImageUploader.vue'

const props = defineProps({
  experiencia: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

const form = ref({
  empresa: '',
  rol: '',
  periodo_inicio: '',
  periodo_fin: '',
  descripcion_logros: '',
  link: '',
  link_demo: '',
  image_url: '',
  tags_industria: [],
  traducciones: []
})

const esActual = ref(false)
const tagsInputEs = ref('')
const tagsInputEn = ref('')

watch(esActual, (val) => {
  if (val) form.value.periodo_fin = ''
})

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      empresa: '',
      rol: '',
      descripcion_logros: '',
      tags_industria: []
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

const activeTagsInput = computed({
  get: () => currentTab.value === 'es' ? tagsInputEs.value : tagsInputEn.value,
  set: (val) => currentTab.value === 'es' ? tagsInputEs.value = val : tagsInputEn.value = val
})

function setTab(tab) {
  currentTab.value = tab
  activeModel.value
}

function parseImageUrlHandler() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function parseTags() {
  const arr = activeTagsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
  activeModel.value.tags_industria = arr
}

async function translateWithAI() {
  if (!form.value.rol || !form.value.empresa) {
    alert("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      empresa: form.value.empresa,
      rol: form.value.rol,
      descripcion_logros: form.value.descripcion_logros,
      tags_industria: form.value.tags_industria
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.empresa = t.empresa || ''
    enModel.rol = t.rol || ''
    enModel.descripcion_logros = t.descripcion_logros || ''
    enModel.tags_industria = t.tags_industria || []
    
    tagsInputEn.value = enModel.tags_industria.join(', ')
    
  } catch (error) {
    console.error("Error al traducir:", error)
    if (error.detail && error.detail.includes('Cuota agotada')) {
      alert("¡Magia agotada! 🪄 Has usado todos tus créditos gratuitos de IA. Para seguir usando las funciones inteligentes, ve a 'Personaliza tu IA' e ingresa tu propia API Key de Gemini gratis.")
    } else {
      alert("Ocurrió un error al intentar traducir con la IA.")
    }
  } finally {
    isTranslating.value = false
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  
  currentTab.value = 'es'
  parseTags()
  currentTab.value = 'en'
  parseTags()
  currentTab.value = 'es'
  
  parseImageUrlHandler()
  
  try {
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.rol.trim() !== '')
    if (esActual.value) dataToSend.periodo_fin = null
    
    emit('save', dataToSend)
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 1000)
  }
}

onMounted(() => {
  if (props.experiencia) {
    form.value = JSON.parse(JSON.stringify(props.experiencia))
    if (!form.value.traducciones) form.value.traducciones = []
    
    form.value.periodo_inicio = props.experiencia.periodo_inicio?.slice(0, 10) || ''
    form.value.periodo_fin = props.experiencia.periodo_fin?.slice(0, 10) || ''
    esActual.value = !props.experiencia.periodo_fin
    
    tagsInputEs.value = (form.value.tags_industria || []).join(', ')
    
    const enTrans = form.value.traducciones.find(t => t.idioma === 'en')
    if (enTrans) {
      tagsInputEn.value = (enTrans.tags_industria || []).join(', ')
    }
  }
})
</script>
