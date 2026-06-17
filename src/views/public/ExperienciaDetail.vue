<template>
  <div class="container py-8 max-w-3xl mx-auto px-4">
    <div v-if="store.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div></div>
    <div v-else-if="!store.current" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">Experiencia no encontrada.</div>
    
    <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <router-link to="/portafolio" class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-emerald-500 transition-colors mb-8 group">
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" /> {{ locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio' }}
      </router-link>
      
      <GlassCard class="p-8 md:p-10 mb-8 border-emerald-500/20 relative overflow-hidden">
        <div class="absolute top-0 right-0 p-8 text-emerald-500/5 pointer-events-none">
          <Briefcase :size="150" />
        </div>
        
        <header class="relative z-10">
          <h1 class="text-4xl font-extrabold tracking-tight text-foreground mb-2">{{ tData.rol }}</h1>
          <h2 class="text-xl font-medium text-emerald-500 mb-6">{{ tData.empresa }}</h2>
          
          <div class="flex flex-col sm:flex-row sm:items-center gap-4 sm:gap-6 text-sm text-muted-foreground mb-8">
            <div class="flex items-center gap-2 bg-secondary/50 px-3 py-1.5 rounded-lg border border-border/50">
              <Calendar :size="16" class="text-emerald-500" />
              <span class="font-medium text-foreground">{{ formatPeriod(tData.periodo_inicio, tData.periodo_fin) }}</span>
            </div>
          </div>
          
          <div class="flex flex-wrap gap-2 mb-8" v-if="tData.tags_industria && tData.tags_industria.length">
            <Badge v-for="tag in tData.tags_industria" :key="tag" variant="secondary" class="bg-emerald-500/10 text-emerald-500 border-emerald-500/20 hover:bg-emerald-500/20">{{ tag }}</Badge>
          </div>
          
          <div class="flex flex-wrap gap-3" v-if="tData.link_demo">
            <a :href="tData.link_demo" target="_blank" rel="noopener noreferrer" class="outline-none">
              <NeonButton variant="outline" class="border-emerald-500/30 hover:border-emerald-500 text-emerald-500">
                <template #icon-left><ExternalLink :size="18" /></template> 
                {{ locale === 'en' ? 'View Demo' : 'Ver Demo' }}
              </NeonButton>
            </a>
          </div>
        </header>
      </GlassCard>

      <section class="mb-10">
        <h3 class="text-2xl font-bold mb-6 pb-3 border-b border-border/50 flex items-center gap-2 text-foreground">
          <Award :size="24" class="text-emerald-500"/> {{ locale === 'en' ? 'Achievements & Responsibilities' : 'Logros y Responsabilidades' }}
        </h3>
        <div class="prose prose-zinc dark:prose-invert max-w-none markdown-body" v-html="renderMarkdown(tData.descripcion_logros)"></div>
      </section>
    </article>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useExperienciasStore } from '../../stores/experiencias'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowLeft, Briefcase, Calendar, ExternalLink, Award } from 'lucide-vue-next'

const route = useRoute()
const store = useExperienciasStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const tData = computed(() => {
  if (!store.current) return {}
  return getTranslated(store.current, locale.value)
})

function formatPeriod(start, end) {
  const isEn = locale.value === 'en'
  const loc = isEn ? 'en-US' : 'es-CL'
  const fmt = (d) => new Date(d).toLocaleDateString(loc, { year: 'numeric', month: 'long' })
  const presentTxt = isEn ? 'Present' : 'Presente'
  return `${fmt(start)} - ${end ? fmt(end) : presentTxt}`
}

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/### (.+)/g, '<h4 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h4>')
    .replace(/## (.+)/g, '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>')
    .replace(/# (.+)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground border-b border-border/50 pb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm text-emerald-500 font-mono">$1</code>')
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
