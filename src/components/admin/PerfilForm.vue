<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ perfil ? $t('admin.titles.edit_profile') : $t('admin.titles.new_profile') }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('es')">
          {{ $t('admin_perfil_form.perfil_form_1') }}
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          {{ $t('admin_perfil_form.perfil_form_2') }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">{{ $t('admin_perfil_form.perfil_form_3') }}</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? $t('admin_perfil_form.translating', 'Traduciendo...') : $t('admin_perfil_form.translate_ai', '✨ Traducir con IA') }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="space-y-4">
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_perfil_form.perfil_form_4') }}</h4>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_5') }}</label>
            <input v-model="form.nombre_completo" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_6')" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_7') }}</label>
            <input v-model="form.ocupacion" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_8')" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_9') }}</label>
            <ImageUploader v-model="form.image_url" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_10') }}</label>
            <ImageUploader v-model="form.avatar_url" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_11') }}</label>
            <input v-model="form.telefono" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" placeholder="+56 9 1234 5678" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_12') }}</label>
            <input v-model="form.email" type="email" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_13')" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_14') }}</label>
            <input v-model="form.linkedin" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_15')" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_16') }}</label>
            <input v-model="form.github" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_17')" />
          </div>
        </div>
        <div class="flex flex-col sm:flex-row gap-4">
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_18') }}</label>
            <input v-model="form.ciudad" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_19')" />
          </div>
          <div class="flex-1 space-y-1.5">
            <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_20') }}</label>
            <input v-model="form.youtube_url" type="url" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_21')" />
          </div>
        </div>
        <hr class="border-t border-dashed border-border/50 my-6" />
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_perfil_form.perfil_form_22') }}</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_23') }}</label>
          <textarea v-model="activeModel.descripcion" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[200px] resize-y" rows="10" required></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('admin_perfil_form.perfil_form_24') }}</label>
          <input v-model="activeHabilidadesInput" type="text" class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" :placeholder="$t('admin_perfil_form.perfil_form_25')" @blur="parseHabilidades" />
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-border/50">
        <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSubmitting ? $t('admin_perfil_form.saving', 'Guardando...') : $t('admin_perfil_form.save_changes', 'Guardar Cambios') }}
        </button>
        <button type="button" class="px-4 py-2 bg-transparent border border-border/50 text-muted-foreground hover:bg-secondary rounded-lg text-sm font-medium transition-colors" @click="$emit('cancel')" :disabled="isSubmitting">{{ $t('admin_perfil_form.perfil_form_26') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, computed, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'
import { api } from '../../services/api.js'
import { toast } from 'vue3-toastify'
import ImageUploader from './ImageUploader.vue'

const { t, locale } = useI18n()

const props = defineProps({
  perfil: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

const form = ref({
  nombre_completo: '',
  ocupacion: '',
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
  habilidades: [],
  traducciones: []
})

const certificacionesTextEs = ref('')
const idiomasTextEs = ref('')
const habilidadesInputEs = ref('')
const certificacionesTextEn = ref('')
const idiomasTextEn = ref('')
const habilidadesInputEn = ref('')

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      descripcion: '',
      certificaciones: [],
      idiomas: [],
      habilidades: []
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

const activeHabilidadesInput = computed({
  get: () => currentTab.value === 'es' ? habilidadesInputEs.value : habilidadesInputEn.value,
  set: (val) => currentTab.value === 'es' ? habilidadesInputEs.value = val : habilidadesInputEn.value = val
})

function setTab(tab) {
  currentTab.value = tab
  activeModel.value
}

function parseHabilidades() {
  const arr = activeHabilidadesInput.value.split(',').map((s) => s.trim()).filter(Boolean)
  activeModel.value.habilidades = arr
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
    toast.error("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      descripcion: form.value.descripcion,
      certificaciones: form.value.certificaciones,
      idiomas: form.value.idiomas,
      habilidades: form.value.habilidades
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.descripcion = t.descripcion || ''
    enModel.certificaciones = t.certificaciones || []
    enModel.idiomas = t.idiomas || []
    enModel.habilidades = t.habilidades || []
    
    certificacionesTextEn.value = JSON.stringify(enModel.certificaciones || [], null, 2)
    idiomasTextEn.value = JSON.stringify(enModel.idiomas || [], null, 2)
    habilidadesInputEn.value = (enModel.habilidades || []).join(', ')
    
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
  
  currentTab.value = 'es'
  handleParseImageUrl()
  handleParseAvatarUrl()
  parseCertificaciones()
  parseIdiomas()
  parseHabilidades()
  
  currentTab.value = 'en'
  parseCertificaciones()
  parseIdiomas()
  parseHabilidades()
  
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
    habilidadesInputEs.value = (form.value.habilidades || []).join(', ')
    
    const enTrans = form.value.traducciones.find(t => t.idioma === 'en')
    if (enTrans) {
      certificacionesTextEn.value = JSON.stringify(enTrans.certificaciones || [], null, 2)
      idiomasTextEn.value = JSON.stringify(enTrans.idiomas || [], null, 2)
      habilidadesInputEn.value = (enTrans.habilidades || []).join(', ')
    }
  }
})
</script>
