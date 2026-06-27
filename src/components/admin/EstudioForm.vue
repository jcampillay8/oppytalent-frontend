<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ estudio ? $t('admin.titles.edit_study') : $t('admin.titles.new_study') }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="currentTab = 'es'">
          {{ $t('admin_estudio_form.estudio_form_1') }}
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          {{ $t('admin_estudio_form.estudio_form_2') }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">{{ $t('admin_estudio_form.estudio_form_3') }}</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? $t('admin_perfil_form.translating', 'Traduciendo...') : $t('admin_perfil_form.translate_ai', '✨ Traducir con IA') }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="space-y-4">
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_estudio_form.estudio_form_4') }}</h4>
        <div class="flex gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_estudio_form.estudio_form_5') }}</label>
            <input v-model.number="form.anio_obtencion" type="number" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" min="1900" :max="new Date().getFullYear()" required />
          </div>
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.image_url') }}</label>
          <ImageUploader v-model="form.image_url" />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.link') }}</label>
          <input v-model="form.link" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_estudio_form.estudio_form_6')" />
        </div>
        <hr class="border-t border-dashed border-border/50 my-6" />
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_estudio_form.estudio_form_7') }}</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.institution') }}</label>
          <input v-model="activeModel.institucion" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.title') }}</label>
          <input v-model="activeModel.titulo" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" required />
        </div>
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.description') }}</label>
          <textarea v-model="activeModel.descripcion_detallada" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[120px] resize-y" rows="6" required></textarea>
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
    toast.error("Primero debes llenar los campos en Español para poder traducir.")
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
