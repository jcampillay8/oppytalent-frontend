<template>
  <div class="w-full">
    <div class="flex flex-col sm:flex-row justify-end items-start sm:items-center mb-6 gap-4">
      <NeonButton @click="openForm(null)" glow variant="primary">
        <template #icon-left><Plus :size="18" /></template>
        {{ $t('admin.titles.new_quote') }}
      </NeonButton>
    </div>

      <!-- Banner Informativo UI/UX -->
      <div class="mb-8 p-5 bg-primary/5 border border-primary/20 rounded-xl flex items-start gap-4 shadow-sm relative overflow-hidden group">
        <div class="absolute top-0 left-0 w-1 h-full bg-primary"></div>
        <Info class="text-primary shrink-0 mt-0.5" :size="22" />
        <div class="text-sm text-foreground/90 leading-relaxed">
          <strong class="text-primary block mb-1">¿Para qué sirve esta sección?</strong>
          Aquí puedes agregar frases célebres, poemas, citas inspiradoras o pensamientos que reflejen tu filosofía profesional. 
          Estas citas <strong>se mostrarán aleatoriamente en la ventana del Asistente IA</strong> de tu portafolio público, 
          permitiendo que los visitantes conecten de forma más personal contigo.
        </div>
      </div>

      <div v-if="showForm" class="mb-8" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <GlassCard>
          <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 class="text-lg font-bold text-foreground">
              {{ editingFrase ? $t('admin.titles.edit_quote') : $t('admin.titles.new_quote') }}
            </h2>
            <button @click="showForm = false" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
          <FraseForm
            :frase="editingFrase"
            @save="handleSave"
            @cancel="showForm = false"
          />
        </GlassCard>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 class="h-10 w-10 animate-spin mb-4" />
        <p class="text-sm font-medium text-muted-foreground">{{ $t('admin.views.quotes.loading') }}</p>
      </div>
      
      <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
        <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
          <MessageSquare :size="32" />
        </div>
        <h3 class="text-xl font-bold text-foreground">{{ $t('admin.views.quotes.empty_title') }}</h3>
        <p class="text-muted-foreground mt-2 max-w-sm text-center">{{ $t('admin.views.quotes.empty_desc') }}</p>
        <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
          {{ $t('admin.views.quotes.add_first') }}
        </NeonButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransitionGroup 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in absolute w-full md:w-[calc(50%-0.5rem)]"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 scale-95"
          move-class="transition-transform duration-300"
        >
          <GlassCard 
            v-for="f in store.items" 
            :key="f.id" 
            hoverEffect 
            class="flex flex-col justify-between h-full p-5"
          >
            <div class="mb-4">
              <Quote class="text-primary/20 mb-2" :size="32" />
              <p class="text-foreground font-medium italic leading-relaxed text-lg text-balance">
                "{{ truncate(f.texto, 150) }}"
              </p>
              <div class="mt-3 font-semibold text-muted-foreground text-sm flex items-center gap-2">
                <div class="h-[1px] w-4 bg-primary/50"></div>
                {{ f.autor }}
              </div>
            </div>

            <div class="flex items-center gap-2 justify-end mt-4 pt-4 border-t border-border/50">
              <NeonButton variant="outline" @click="openForm(f)">
                <template #icon-left><Edit2 :size="14" /></template>
                {{ $t('common.edit') }}
              </NeonButton>
              <NeonButton variant="destructive" @click="handleDelete(f.id)">
                <template #icon-left><Trash2 :size="14" /></template>
              </NeonButton>
            </div>
          </GlassCard>
        </TransitionGroup>
      </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import FraseForm from '../../components/admin/FraseForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { Plus, X, Loader2, MessageSquare, Quote, Edit2, Trash2, Info } from 'lucide-vue-next'
import { useFrasesStore } from '../../stores/frases'
import { useI18n } from 'vue-i18n'

const store = useFrasesStore()
const { t } = useI18n()
const showForm = ref(false)
const editingFrase = ref(null)

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

function openForm(frase) {
  editingFrase.value = frase ? { ...frase } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingFrase.value) {
    await store.update(editingFrase.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm(t('admin.views.quotes.delete_confirm'))) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>
