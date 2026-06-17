<template>
  <div class="container py-8 max-w-4xl mx-auto px-4">
    <div v-if="store.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    <div v-else-if="!translatedProyecto" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">Proyecto no encontrado.</div>
    
    <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <router-link to="/portafolio" class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-6 group">
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" /> {{ locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio' }}
      </router-link>
      
      <header class="mb-8">
        <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">{{ translatedProyecto.titulo }}</h1>
        <div class="flex items-center gap-4 text-sm text-muted-foreground mb-6">
          <span class="flex items-center gap-1.5"><Calendar :size="16" /> {{ formatDate(translatedProyecto.fecha_proyecto) }}</span>
          <span class="w-1 h-1 rounded-full bg-border"></span>
          <span>Actualizado: {{ formatDate(translatedProyecto.updated_at) }}</span>
        </div>
        
        <div class="flex flex-wrap gap-2 mb-6">
          <Badge v-for="tag in translatedProyecto.tags" :key="tag" variant="secondary" class="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{{ tag }}</Badge>
          <Badge v-for="tech in translatedProyecto.stack_tecnologico" :key="tech" variant="outline">{{ tech }}</Badge>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <a v-if="translatedProyecto.link_github" :href="translatedProyecto.link_github" target="_blank" class="outline-none">
            <NeonButton variant="outline"><template #icon-left><Github :size="18" /></template> GitHub</NeonButton>
          </a>
          <a v-if="translatedProyecto.link_demo" :href="translatedProyecto.link_demo" target="_blank" class="outline-none">
            <NeonButton glow><template #icon-left><ExternalLink :size="18" /></template> Demo</NeonButton>
          </a>
        </div>
      </header>

      <div class="mb-10 rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-secondary" v-if="translatedProyecto.image_url">
        <img :src="translatedProyecto.image_url" :alt="translatedProyecto.titulo" class="w-full max-h-[500px] object-cover transition-transform duration-700 hover:scale-105" />
      </div>

      <GlassCard class="mb-10 p-6 md:p-8" v-if="getYoutubeEmbed(translatedProyecto.youtube_url)">
        <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><Youtube :size="24" class="text-red-500" /> Video Demostrativo</h3>
        <div class="relative w-full overflow-hidden pt-[56.25%] rounded-xl border border-border/50 bg-black">
          <iframe 
            :src="getYoutubeEmbed(translatedProyecto.youtube_url)" 
            class="absolute top-0 left-0 w-full h-full"
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </GlassCard>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div class="lg:col-span-2 space-y-10">
          <section>
            <h3 class="text-xl font-bold mb-4 pb-2 border-b border-border/50 flex items-center gap-2"><FileText :size="20" class="text-primary"/> Descripción</h3>
            <div class="prose prose-zinc dark:prose-invert max-w-none markdown-body" v-html="renderMarkdown(translatedProyecto.descripcion_detallada)"></div>
          </section>
        </div>
        
        <div class="space-y-8">
          <GlassCard class="p-6 bg-primary/5 border-primary/20 shadow-lg shadow-primary/5">
            <h3 class="text-lg font-bold mb-3 flex items-center gap-2"><Info :size="20" class="text-primary" /> Contexto</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">{{ translatedProyecto.descripcion_corta }}</p>
          </GlassCard>

          <GlassCard v-if="translatedProyecto.kpis && Object.keys(translatedProyecto.kpis).length" class="p-0 overflow-hidden">
            <div class="p-5 border-b border-border/50 bg-secondary/50">
              <h3 class="text-lg font-bold flex items-center gap-2"><TrendingUp :size="20" class="text-emerald-500" /> KPIs & Métricas</h3>
            </div>
            <div class="divide-y divide-border/50">
              <div v-for="(val, key) in translatedProyecto.kpis" :key="key">
                <template v-if="isSimple(val)">
                  <div class="flex justify-between items-center p-4 hover:bg-secondary/30 transition-colors">
                    <span class="text-sm font-medium text-muted-foreground">{{ key }}</span>
                    <span class="text-sm font-bold text-foreground">{{ val }}</span>
                  </div>
                </template>
                <template v-else>
                  <div class="flex items-center justify-between p-4 bg-secondary/20 cursor-pointer hover:bg-secondary/40 transition-colors" @click="toggleKpi(key)">
                    <div class="flex items-center gap-2">
                      <ChevronRight :size="16" class="text-muted-foreground transition-transform duration-200" :class="{ 'rotate-90': expandedKpis[key] }" />
                      <span class="text-sm font-bold text-primary">{{ key }}</span>
                    </div>
                    <Badge variant="secondary" class="text-xs">{{ Object.keys(val).length }}</Badge>
                  </div>
                  <div v-show="expandedKpis[key]" class="bg-background/50 divide-y divide-border/30">
                    <div v-for="(subVal, subKey) in val" :key="subKey" class="flex justify-between items-center p-3 pl-10 hover:bg-secondary/10 transition-colors">
                      <span class="text-xs font-medium text-muted-foreground">{{ subKey }}</span>
                      <span class="text-sm font-semibold text-foreground">{{ subVal }}</span>
                    </div>
                  </div>
                </template>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore } from '../../stores/proyectos'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowLeft, Calendar, Github, ExternalLink, Youtube, FileText, Info, TrendingUp, ChevronRight } from 'lucide-vue-next'

const route = useRoute()
const store = useProyectosStore()
const { locale } = useI18n()

const translatedProyecto = useTranslatedData(computed(() => store.current))

const expandedKpis = reactive({})

function toggleKpi(key) {
  expandedKpis[key] = !expandedKpis[key]
}

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString(locale.value === 'en' ? 'en-US' : 'es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
}

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/### (.+)/g, '<h4 class="text-lg font-bold mt-6 mb-3 text-foreground">$1</h4>')
    .replace(/## (.+)/g, '<h3 class="text-xl font-bold mt-8 mb-4 text-foreground">$1</h3>')
    .replace(/# (.+)/g, '<h2 class="text-2xl font-bold mt-8 mb-4 text-foreground border-b border-border/50 pb-2">$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong class="font-bold text-foreground">$1</strong>')
    .replace(/\*(.+?)\*/g, '<em class="italic">$1</em>')
    .replace(/`(.+?)`/g, '<code class="bg-secondary px-1.5 py-0.5 rounded text-sm text-primary font-mono">$1</code>')
    .replace(/^- (.+)/gm, '<li class="mb-1.5 ml-4 list-disc">$1</li>')
    .replace(/\n\n/g, '</p><p class="mb-4 leading-relaxed">')
    .replace(/\n/g, '<br/>')
  return '<div class="space-y-4 text-muted-foreground"><p class="leading-relaxed">' + html + '</p></div>'
}

function isSimple(val) {
  return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
}

function getYoutubeEmbed(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    store.fetchOne(newId)
  }
})

onMounted(() => store.fetchOne(route.params.id))
</script>
