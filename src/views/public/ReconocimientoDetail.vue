<template>
  <div class="container py-8 max-w-3xl mx-auto px-4">
    <div v-if="store.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-pink-500/30 border-t-pink-500 rounded-full animate-spin"></div></div>
    <div v-else-if="!store.current" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">Reconocimiento no encontrado.</div>
    
    <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <router-link to="/portafolio" class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-pink-500 transition-colors mb-8 group">
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" /> {{ locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio' }}
      </router-link>
      
      <GlassCard class="p-8 md:p-10 mb-8 border-pink-500/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 text-pink-500/5 pointer-events-none">
          <Award :size="150" />
        </div>
        
        <header class="relative z-10">
          <h1 class="text-3xl md:text-4xl font-extrabold tracking-tight text-foreground mb-3 leading-tight">{{ tData.titulo }}</h1>
          <h2 class="text-xl font-medium text-pink-500 mb-6">{{ tData.institucion }}</h2>
          
          <div class="mb-8 rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-secondary/30 p-4 md:p-8 flex justify-center items-center relative group" v-if="tData.image_url">
            <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent pointer-events-none"></div>
            <img :src="tData.image_url" :alt="tData.institucion" class="max-w-full max-h-[400px] object-contain rounded-lg shadow-md relative z-10" />
          </div>
          
          <div class="flex flex-row items-center gap-4 flex-wrap">
            <div v-if="tData.fecha" class="flex items-center gap-2 bg-secondary/50 px-4 py-2 rounded-lg border border-border/50 text-sm text-muted-foreground">
              <Calendar :size="18" class="text-pink-500" />
              <span>{{ locale === 'en' ? 'Date:' : 'Fecha:' }}</span>
              <span class="font-bold text-foreground text-lg ml-1">{{ tData.fecha }}</span>
            </div>
            
            <a v-if="tData.enlace" :href="tData.enlace" target="_blank" rel="noopener noreferrer" class="outline-none">
              <NeonButton glow variant="primary" class="bg-pink-500 hover:bg-pink-600 border-pink-500 shadow-pink-500/20 text-white">
                <template #icon-left><ExternalLink :size="18" /></template> 
                {{ locale === 'en' ? 'View Details' : 'Ver Detalles' }}
              </NeonButton>
            </a>
            
            <a v-if="tData.referencia" :href="tData.referencia" target="_blank" rel="noopener noreferrer" class="outline-none">
              <NeonButton variant="outline" class="border-pink-500/30 hover:border-pink-500 text-pink-500">
                <template #icon-left><Link :size="18" /></template> 
                {{ locale === 'en' ? 'Reference' : 'Referencia' }}
              </NeonButton>
            </a>
          </div>
        </header>
      </GlassCard>

      <section class="mb-10">
        <h3 class="text-2xl font-bold mb-6 pb-3 border-b border-border/50 flex items-center gap-2 text-foreground">
           {{ locale === 'en' ? 'About this Recognition' : 'Sobre este Reconocimiento' }}
        </h3>
        <div class="prose prose-zinc dark:prose-invert max-w-none markdown-body" v-html="renderMarkdown(tData.descripcion)"></div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useReconocimientosStore } from '../../stores/reconocimientos'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { ArrowLeft, Award, Calendar, ExternalLink, Link } from 'lucide-vue-next'

const route = useRoute()
const store = useReconocimientosStore()
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
    .replace(/`(.+?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm text-pink-500 font-mono">$1</code>')
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
