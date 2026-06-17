<template>
  <div class="container py-8 max-w-3xl mx-auto px-4">
    <div v-if="store.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div></div>
    <div v-else-if="!store.current" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">Estudio / Certificación no encontrado.</div>
    
    <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <router-link to="/portafolio" class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-amber-500 transition-colors mb-8 group">
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" /> {{ locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio' }}
      </router-link>
      
      <GlassCard class="p-8 md:p-10 mb-8 border-amber-500/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 text-amber-500/5 pointer-events-none">
          <GraduationCap :size="150" />
        </div>
        
        <header class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">{{ tData.titulo }}</h1>
          <h2 class="text-xl font-medium text-amber-500 mb-6">{{ tData.institucion }}</h2>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-8">
            <div class="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50">
              <Calendar :size="18" class="text-amber-500" />
              <span>{{ locale === 'en' ? 'Year obtained:' : 'Año de Obtención:' }}</span>
              <span class="font-bold text-foreground text-lg ml-1">{{ tData.anio_obtencion }}</span>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-3" v-if="tData.link">
            <a :href="tData.link" target="_blank" rel="noopener noreferrer" class="outline-none">
              <NeonButton glow variant="primary" class="bg-amber-500 hover:bg-amber-600 border-amber-500 shadow-amber-500/20 text-white">
                <template #icon-left><ExternalLink :size="18" /></template> 
                {{ locale === 'en' ? 'View Credential / More Info' : 'Ver Credencial / Más Info' }}
              </NeonButton>
            </a>
          </div>
        </header>
      </GlassCard>

      <div class="mb-10 rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-secondary/30 p-4 md:p-8 flex justify-center items-center relative group" v-if="tData.image_url">
        <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent pointer-events-none"></div>
        <img :src="tData.image_url" :alt="tData.institucion" class="max-w-full max-h-[400px] object-contain rounded-lg shadow-md transition-transform duration-500 group-hover:scale-[1.02] relative z-10" />
      </div>

      <section class="mb-10">
        <h3 class="text-2xl font-bold mb-6 pb-3 border-b border-border/50 flex items-center gap-2 text-foreground">
          <BookOpen :size="24" class="text-amber-500"/> {{ locale === 'en' ? 'About this Credential / Education' : 'Sobre esta Credencial / Estudio' }}
        </h3>
        <div class="prose prose-zinc dark:prose-invert max-w-none markdown-body" v-html="renderMarkdown(tData.descripcion_detallada)"></div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEstudiosStore } from '../../stores/estudios'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { ArrowLeft, GraduationCap, Calendar, ExternalLink, BookOpen } from 'lucide-vue-next'

const route = useRoute()
const store = useEstudiosStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const tData = computed(() => {
  if (!store.current) return {}
  return getTranslated(store.current, locale.value)
})

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/### (.+)/g, '<h4 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h4>')
    .replace(/## (.+)/g, '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>')
    .replace(/# (.+)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground border-b border-border/50 pb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm text-amber-500 font-mono">$1</code>')
    .replace(/^- (.+)/gm, '<li class="mb-1.5 ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br/>')
  return '<div class="space-y-4 text-muted-foreground"><p class="leading-relaxed">' + html + '</p></div>'
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    store.fetchOne(newId)
  }
})

onMounted(() => store.fetchOne(route.params.id))
</script>