<template>
  <div class="bg-secondary/30 backdrop-blur-md border border-border/50 rounded-xl p-6 mb-8">
    <div class="flex justify-between items-center mb-6 pb-4 border-b border-border/50">
      <h3 class="text-lg font-semibold text-foreground">{{ frase ? $t('admin.titles.edit_quote') : $t('admin.titles.new_quote') }}</h3>
      <div class="flex gap-2">
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'es' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('es')">
          🇪🇸 Español (Principal)
        </button>
        <button type="button" class="px-4 py-2 rounded-lg text-sm font-medium transition-colors border" :class="currentTab === 'en' ? 'bg-primary/10 border-primary/50 text-primary' : 'bg-secondary border-border/50 text-muted-foreground hover:bg-secondary/80'" @click="setTab('en')">
          🇺🇸 Inglés (Traducción)
        </button>
      </div>
    </div>

    <form @submit.prevent="submit" class="space-y-6">
      
      <!-- ENGLISH AI TRANSLATE ACTION -->
      <div v-if="currentTab === 'en'" class="bg-gradient-to-r from-indigo-500/10 to-purple-500/10 border border-purple-500/20 rounded-xl p-4 flex justify-between items-center">
        <p class="text-sm text-muted-foreground m-0">Ingresa la traducción manualmente o deja que la IA lo haga por ti basado en el contenido en Español.</p>
        <button type="button" class="flex items-center gap-2 bg-gradient-to-r from-indigo-500 to-purple-500 hover:from-indigo-600 hover:to-purple-600 text-white px-4 py-2 rounded-lg text-sm font-medium transition-all hover:-translate-y-0.5" @click="translateWithAI" :disabled="isTranslating">
          <span v-if="isTranslating" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ isTranslating ? 'Traduciendo...' : '✨ Traducir con IA' }}
        </button>
      </div>

      <!-- TRANSLATABLE FIELDS -->
      <div class="space-y-4">
        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.quote') }}</label>
          <textarea
            v-model="activeModel.texto"
            required
            rows="4"
            class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50 min-h-[100px] resize-y"
            placeholder="Escribe la frase..."
          ></textarea>
        </div>

        <div class="space-y-1.5">
          <label class="block text-sm font-medium text-muted-foreground">{{ $t('forms.author') }}</label>
          <input
            v-model="activeModel.autor"
            type="text"
            required
            class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50"
            placeholder="Ej: Seneca"
          />
        </div>
      </div>

      <div class="flex gap-3 pt-4 border-t border-border/50">
        <button type="submit" class="flex items-center gap-2 px-4 py-2 bg-primary hover:bg-primary/90 text-primary-foreground rounded-lg text-sm font-medium transition-colors" :disabled="loading">
          <span v-if="loading" class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></span>
          {{ loading ? '...' : $t('common.save') }}
        </button>
        <button type="button" class="px-4 py-2 bg-transparent border border-border/50 text-muted-foreground hover:bg-secondary rounded-lg text-sm font-medium transition-colors" @click="$emit('cancel')" :disabled="loading">
          {{ $t('common.cancel') }}
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
