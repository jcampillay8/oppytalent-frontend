<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ proyecto ? $t('admin.titles.edit_project') : $t('admin.titles.new_project') }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="currentTab = 'es'">
          {{ $t('admin_proyecto_form.proyecto_form_1') }}
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          {{ $t('admin_proyecto_form.proyecto_form_2') }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">{{ $t('admin_proyecto_form.proyecto_form_3') }}</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? $t('admin_perfil_form.translating', 'Traduciendo...') : $t('admin_perfil_form.translate_ai', '✨ Traducir con IA') }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="space-y-4">
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_proyecto_form.proyecto_form_4') }}</h4>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.date') }}</label>
            <input v-model="form.fecha_proyecto" type="date" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.image_url') }}</label>
            <ImageUploader v-model="form.image_url" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_5') }}</label>
            <input v-model="form.link_github" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_6') }}</label>
            <input v-model="form.link_demo" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_7') }}</label>
            <input v-model="form.youtube_url" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" />
          </div>
        </div>
        <hr class="border-t border-dashed border-border/50 my-6" />
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_proyecto_form.proyecto_form_8') }}</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.title') }}</label>
          <input v-model="activeModel.titulo" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.description') }} (Corta)</label>
          <input v-model="activeModel.descripcion_corta" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.description') }} (Detallada Markdown)</label>
          <textarea v-model="activeModel.descripcion_detallada" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[160px] resize-y" rows="8" required></textarea>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.technologies') }} (separado por comas)</label>
          <input v-model="activeStackInput" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_proyecto_form.proyecto_form_9')" @blur="parseStack" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_10') }}</label>
          <input v-model="activeTagsInput" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_proyecto_form.proyecto_form_11')" @blur="parseTags" />
        </div>
        <div class="space-y-3">
          <label class="block text-sm font-medium text-foreground">{{ $t('admin_proyecto_form.proyecto_form_12') }}</label>
          <div class="bg-background border border-border/50 rounded-xl p-4 space-y-3">
            <div v-for="(kpi, index) in activeKpisList" :key="'kpi'+index" class="flex gap-2 items-start">
              <input v-model="kpi.key" type="text" class="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" :placeholder="$t('admin_proyecto_form.proyecto_form_13')" />
              <input v-model="kpi.value" type="text" class="flex-1 px-3 py-2 bg-secondary/50 border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" :placeholder="$t('admin_proyecto_form.proyecto_form_14')" />
              <button type="button" class="p-2 text-red-500 hover:bg-red-500/10 rounded-lg transition-colors shrink-0" @click="removeKpi(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
            </div>
            <button type="button" class="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1" @click="addKpi">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              {{ $t('admin_proyecto_form.proyecto_form_15') }}
            </button>
          </div>
        </div>

        <div class="space-y-3">
          <label class="block text-sm font-medium text-foreground">{{ $t('admin_proyecto_form.proyecto_form_16') }}</label>
          <div class="bg-background border border-border/50 rounded-xl p-4 space-y-4">
            <div v-for="(img, index) in activeGaleriaList" :key="'img'+index" class="p-4 bg-secondary/30 border border-border/50 rounded-lg relative">
              <button type="button" class="absolute top-2 right-2 p-1.5 bg-red-500/10 text-red-500 hover:bg-red-500/20 rounded-md transition-colors" @click="removeGaleriaItem(index)">
                <svg xmlns="http://www.w3.org/2000/svg" width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M3 6h18"></path><path d="M19 6v14c0 1-1 2-2 2H7c-1 0-2-1-2-2V6"></path><path d="M8 6V4c0-1 1-2 2-2h4c1 0 2 1 2 2v2"></path></svg>
              </button>
              <div class="space-y-3 pr-8">
                <div class="space-y-1.5">
                  <label class="block text-xs font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_17') }}</label>
                  <ImageUploader v-model="img.url" />
                </div>
                <div class="space-y-1.5">
                  <label class="block text-xs font-medium text-muted-foreground">{{ $t('admin_proyecto_form.proyecto_form_18') }}</label>
                  <input v-model="img.caption" type="text" class="w-full px-3 py-2 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary" :placeholder="$t('admin_proyecto_form.proyecto_form_19')" />
                </div>
              </div>
            </div>
            <button type="button" class="text-sm font-medium text-primary hover:text-primary/80 flex items-center gap-1" @click="addGaleriaItem">
              <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><line x1="12" y1="5" x2="12" y2="19"></line><line x1="5" y1="12" x2="19" y2="12"></line></svg>
              {{ $t('admin_proyecto_form.proyecto_form_20') }}
            </button>
          </div>
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-border/50">
        <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSubmitting ? '...' : $t('common.save') }}
        </button>
        <button type="button" class="px-4 py-2 bg-transparent border border-border/50 text-muted-foreground hover:bg-secondary rounded-lg text-sm font-medium transition-colors" @click="$emit('cancel')" :disabled="isSubmitting">{{ $t('common.cancel') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'
import { api } from '../../services/api.js'
import { toast } from 'vue3-toastify'
import ImageUploader from './ImageUploader.vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const props = defineProps({
  proyecto: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es') // 'es' o 'en'

const form = ref({
  titulo: '',
  descripcion_corta: '',
  descripcion_detallada: '',
  stack_tecnologico: [],
  fecha_proyecto: '',
  link_github: '',
  link_demo: '',
  image_url: '',
  youtube_url: '',
  kpis: {},
  galeria: [],
  tags: [],
  traducciones: []
})

// Text inputs for ES
const stackInputEs = ref('')
const tagsInputEs = ref('')
const kpisListEs = ref([])
const galeriaListEs = ref([])

// Text inputs for EN
const stackInputEn = ref('')
const tagsInputEn = ref('')
const kpisListEn = ref([])
const galeriaListEn = ref([])

// Dynamic bindings based on tab
const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      titulo: '',
      descripcion_corta: '',
      descripcion_detallada: '',
      stack_tecnologico: [],
      tags: [],
      kpis: {},
      galeria: []
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

const activeStackInput = computed({
  get: () => currentTab.value === 'es' ? stackInputEs.value : stackInputEn.value,
  set: (val) => currentTab.value === 'es' ? stackInputEs.value = val : stackInputEn.value = val
})

const activeTagsInput = computed({
  get: () => currentTab.value === 'es' ? tagsInputEs.value : tagsInputEn.value,
  set: (val) => currentTab.value === 'es' ? tagsInputEs.value = val : tagsInputEn.value = val
})

const activeKpisList = computed({
  get: () => currentTab.value === 'es' ? kpisListEs.value : kpisListEn.value,
  set: (val) => currentTab.value === 'es' ? kpisListEs.value = val : kpisListEn.value = val
})

const activeGaleriaList = computed({
  get: () => currentTab.value === 'es' ? galeriaListEs.value : galeriaListEn.value,
  set: (val) => currentTab.value === 'es' ? galeriaListEs.value = val : galeriaListEn.value = val
})

function addKpi() {
  activeKpisList.value.push({ key: '', value: '' })
}

function removeKpi(index) {
  activeKpisList.value.splice(index, 1)
}

function addGaleriaItem() {
  activeGaleriaList.value.push({ url: '', caption: '' })
}

function removeGaleriaItem(index) {
  activeGaleriaList.value.splice(index, 1)
}


function setTab(tab) {
  currentTab.value = tab
  // Force compute activeModel to initialize translation obj if needed
  activeModel.value
}

function handleParseImageUrl() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function parseStack() {
  const arr = activeStackInput.value.split(',').map((s) => s.trim()).filter(Boolean)
  activeModel.value.stack_tecnologico = arr
}

function parseTags() {
  const arr = activeTagsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
  activeModel.value.tags = arr
}

function parseKpis() {
  // Convert list of objects [{key: "a", value: "b"}] to dict {"a": "b"}
  const dict = {}
  for (const item of activeKpisList.value) {
    if (item.key.trim()) {
      dict[item.key.trim()] = item.value.trim()
    }
  }
  activeModel.value.kpis = dict
}

function parseGaleria() {
  // Clean empty items safely
  const cleanList = activeGaleriaList.value.filter(item => item && item.url && typeof item.url === 'string' && item.url.trim() !== '')
  activeModel.value.galeria = cleanList.map(item => ({
    url: parseImageUrl(item.url),
    caption: item.caption || ''
  }))
}

async function translateWithAI() {
  if (!form.value.titulo) {
    toast.error("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      titulo: form.value.titulo,
      descripcion_corta: form.value.descripcion_corta,
      descripcion_detallada: form.value.descripcion_detallada,
      stack_tecnologico: form.value.stack_tecnologico,
      tags: form.value.tags,
      kpis: form.value.kpis,
      galeria: form.value.galeria
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    // Assign translated values
    const enModel = activeModel.value
    enModel.titulo = t.titulo || ''
    enModel.descripcion_corta = t.descripcion_corta || ''
    enModel.descripcion_detallada = t.descripcion_detallada || ''
    enModel.stack_tecnologico = t.stack_tecnologico || []
    enModel.tags = t.tags || []
    enModel.kpis = t.kpis || {}
    enModel.galeria = t.galeria || form.value.galeria || [] // Copy galeria from ES by default or translated

    // Update text inputs for English view
    stackInputEn.value = enModel.stack_tecnologico.join(', ')
    tagsInputEn.value = enModel.tags.join(', ')
    
    // Map dict to list for EN
    const enKpisList = []
    if (enModel.kpis) {
      for (const [k, v] of Object.entries(enModel.kpis)) {
        enKpisList.push({ key: k, value: String(v) })
      }
    }
    kpisListEn.value = enKpisList
    galeriaListEn.value = JSON.parse(JSON.stringify(enModel.galeria || []))
    
  } catch (error) {
    console.error("Error al traducir:", error)
    if (error.detail && error.detail.includes('Cuota agotada')) {
      toast.warning("¡Magia agotada! 🪄 Has usado todos tus créditos gratuitos de IA. Para seguir usando las funciones inteligentes, ve a 'Personaliza tu IA' e ingresa tu propia API Key de Gemini gratis.", { autoClose: 6000 })
    } else {
      toast.error("Ocurrió un error al intentar traducir con la IA.")
    }
  } finally {
    isTranslating.value = false
  }
}

async function handleSubmit() {
  isSubmitting.value = true
  
  // Make sure to parse everything before submitting
  currentTab.value = 'es'
  handleParseImageUrl()
  parseStack()
  parseTags()
  parseKpis()
  parseGaleria()
  
  currentTab.value = 'en'
  parseStack()
  parseTags()
  parseKpis()
  parseGaleria()
  currentTab.value = 'es' // reset view
  
  try {
    // Only send the english translation if it has some content
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.titulo.trim() !== '')
    
    console.log("SAVE", JSON.stringify(dataToSend)); emit('save', dataToSend)
  } finally {
    // We don't turn off isSubmitting here if it succeeds because it will unmount,
    // but if we want to be safe:
    setTimeout(() => { isSubmitting.value = false }, 1000)
  }
}

onMounted(() => {
  if (props.proyecto) {
    // Deep clone
    form.value = JSON.parse(JSON.stringify(props.proyecto))
    if (!form.value.traducciones) form.value.traducciones = []
    
    form.value.fecha_proyecto = props.proyecto.fecha_proyecto?.slice(0, 10) || ''
    
    // Init ES inputs
    stackInputEs.value = (form.value.stack_tecnologico || []).join(', ')
    tagsInputEs.value = (form.value.tags || []).join(', ')
    
    // Map dict to list for ES
    const esKpisList = []
    if (form.value.kpis) {
      for (const [k, v] of Object.entries(form.value.kpis)) {
        esKpisList.push({ key: k, value: String(v) })
      }
    }
    kpisListEs.value = esKpisList
    galeriaListEs.value = JSON.parse(JSON.stringify(form.value.galeria || []))
    
    // Init EN inputs if translation exists
    const enTrans = form.value.traducciones.find(t => t.idioma === 'en')
    if (enTrans) {
      stackInputEn.value = (enTrans.stack_tecnologico || []).join(', ')
      tagsInputEn.value = (enTrans.tags || []).join(', ')
      
      const enKpisList = []
      if (enTrans.kpis) {
        for (const [k, v] of Object.entries(enTrans.kpis)) {
          enKpisList.push({ key: k, value: String(v) })
        }
      }
      kpisListEn.value = enKpisList
      galeriaListEn.value = JSON.parse(JSON.stringify(enTrans.galeria || []))
    }
  }
})
</script>
