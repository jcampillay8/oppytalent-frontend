<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ habilitacion ? $t('admin.titles.edit_certification') : $t('admin.titles.new_certification') }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('es')">
          {{ $t('admin_habilitacion_form.habilitacion_form_1') }}
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          {{ $t('admin_habilitacion_form.habilitacion_form_2') }}
        </button>
      </div>
    </div>

    <form @submit.prevent="handleSubmit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">{{ $t('admin_habilitacion_form.habilitacion_form_3') }}</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? $t('admin_perfil_form.translating', 'Traduciendo...') : $t('admin_perfil_form.translate_ai', '✨ Traducir con IA') }}
        </button>
      </div>

      <!-- COMMON FIELDS -->
      <div v-show="currentTab === 'es'" class="space-y-4">
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_habilitacion_form.habilitacion_form_4') }}</h4>
        
        <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <div class="space-y-2">
            <label class="text-sm font-semibold text-foreground">{{ $t('admin_habilitacion_form.habilitacion_form_5') }}</label>
            <select 
              v-model="form.tipo"
              class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
              required
            >
              <option value="DISPONIBILIDAD">{{ $t('admin_habilitacion_form.habilitacion_form_6') }}</option>
              <option value="LICENCIA">{{ $t('admin_habilitacion_form.habilitacion_form_7') }}</option>
              <option value="SALUD">{{ $t('admin_habilitacion_form.habilitacion_form_8') }}</option>
            </select>
          </div>

          <div class="space-y-2">
            <label class="text-sm font-semibold text-foreground">{{ $t('admin_habilitacion_form.habilitacion_form_9') }}</label>
            <input 
              v-model="form.enlace" 
              type="url" 
              class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
              :placeholder="$t('admin_habilitacion_form.habilitacion_form_10')" 
            />
          </div>

          <div class="space-y-2 md:col-span-2">
            <label class="text-sm font-semibold text-foreground">{{ $t('admin_habilitacion_form.habilitacion_form_11') }}</label>
            <ImageUploader v-model="form.image_url" />
          </div>
        </div>

        <hr class="border-t border-dashed border-border/50 my-6" />
        <h4 class="text-base font-semibold text-foreground mb-4">{{ $t('admin_habilitacion_form.habilitacion_form_12') }}</h4>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="space-y-2">
          <label class="text-sm font-semibold text-foreground">{{ $t('admin_habilitacion_form.habilitacion_form_13') }}</label>
          <input 
            v-model="activeModel.titulo" 
            type="text" 
            class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
            :placeholder="$t('admin_habilitacion_form.habilitacion_form_14')" 
            required 
          />
        </div>

        <div class="space-y-2">
          <label class="text-sm font-semibold text-foreground">{{ $t('admin_habilitacion_form.habilitacion_form_15') }}</label>
          <textarea 
            v-model="activeModel.descripcion" 
            class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground min-h-[100px]"
            :placeholder="$t('admin_habilitacion_form.habilitacion_form_16')" 
            required
          ></textarea>
        </div>
      </div>

      <div class="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
        <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors" :disabled="isSubmitting">
          <span v-if="isSubmitting" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isSubmitting ? '...' : $t('common.save') }}
        </button>
        <button type="button" class="px-4 py-2 bg-transparent border border-border/50 text-muted-foreground hover:bg-secondary rounded-lg text-sm font-medium transition-colors" @click="$emit('cancel')" :disabled="isSubmitting">{{ $t('admin_habilitacion_form.habilitacion_form_17') }}</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, computed, watch, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'
import { api } from '../../services/api.js'
import { toast } from 'vue3-toastify'
import ImageUploader from './ImageUploader.vue'
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()

const props = defineProps({
  habilitacion: { type: Object, default: null }
})

const emit = defineEmits(['save', 'cancel'])

const isSubmitting = ref(false)
const isTranslating = ref(false)
const currentTab = ref('es')

const form = ref({
  tipo: 'LICENCIA',
  titulo: '',
  descripcion: '',
  image_url: '',
  enlace: '',
  traducciones: []
})

const activeModel = computed(() => {
  if (currentTab.value === 'es') return form.value
  
  let enTranslation = form.value.traducciones.find(t => t.idioma === 'en')
  if (!enTranslation) {
    enTranslation = {
      idioma: 'en',
      titulo: '',
      descripcion: ''
    }
    form.value.traducciones.push(enTranslation)
  }
  return enTranslation
})

function setTab(tab) {
  currentTab.value = tab
}

function parseImageUrlHandler() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

async function translateWithAI() {
  if (!form.value.titulo || !form.value.descripcion) {
    toast.error("Primero debes llenar los campos en Español para poder traducir.")
    return
  }
  
  isTranslating.value = true
  try {
    const contentToTranslate = {
      titulo: form.value.titulo,
      descripcion: form.value.descripcion
    }

    const response = await api.translateWithAI(contentToTranslate, 'en')
    const t = response.translated_content
    
    const enModel = activeModel.value
    enModel.titulo = t.titulo || ''
    enModel.descripcion = t.descripcion || ''
    
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
  
  parseImageUrlHandler()
  
  try {
    const dataToSend = { ...form.value }
    dataToSend.traducciones = dataToSend.traducciones.filter(t => t.titulo.trim() !== '' || t.descripcion.trim() !== '')
    
    emit('save', dataToSend)
  } finally {
    setTimeout(() => { isSubmitting.value = false }, 1000)
  }
}

onMounted(() => {
  if (props.habilitacion) {
    form.value = JSON.parse(JSON.stringify(props.habilitacion))
    if (!form.value.traducciones) form.value.traducciones = []
  }
})
</script>
