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
        
        <div class="mb-6 rounded-2xl overflow-hidden border border-border/50 shadow-xl bg-secondary" v-if="translatedProyecto.image_url">
          <img :src="translatedProyecto.image_url" :alt="translatedProyecto.titulo" class="w-full max-h-[500px] object-cover" />
        </div>

        <div class="flex flex-wrap gap-2 mb-6">
          <Badge v-for="tag in translatedProyecto.tags" :key="tag" variant="secondary" class="bg-primary/10 text-primary border-primary/20 hover:bg-primary/20">{{ tag }}</Badge>
          <Badge v-for="tech in translatedProyecto.stack_tecnologico" :key="tech" variant="outline">{{ tech }}</Badge>
        </div>
        
        <div class="flex flex-wrap gap-3">
          <button v-if="translatedProyecto.galeria && translatedProyecto.galeria.length > 0" @click="openGallery" class="outline-none">
            <NeonButton glow variant="primary" class="bg-indigo-500 border-indigo-500 shadow-indigo-500/20 hover:bg-indigo-600">
              <template #icon-left><Image :size="18" /></template> 
              Ver Álbum ({{ translatedProyecto.galeria.length }})
            </NeonButton>
          </button>
          <a v-if="translatedProyecto.link_demo" :href="translatedProyecto.link_demo" target="_blank" class="outline-none">
            <NeonButton glow><template #icon-left><ExternalLink :size="18" /></template> Demo</NeonButton>
          </a>
          <a v-if="translatedProyecto.link_github" :href="translatedProyecto.link_github" target="_blank" class="outline-none">
            <NeonButton variant="outline"><template #icon-left><Github :size="18" /></template> GitHub</NeonButton>
          </a>
        </div>
      </header>

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
              <h3 class="text-lg font-bold flex items-center gap-2"><TrendingUp :size="20" class="text-emerald-500" /> Ficha Técnica / KPIs</h3>
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

    <!-- Modal de Galería -->
    <div v-if="isGalleryOpen" class="fixed inset-0 z-[100] flex items-center justify-center bg-black/95 backdrop-blur-md p-4 md:p-8 animate-in fade-in duration-300">
      <button @click="closeGallery" class="absolute top-4 right-4 md:top-6 md:right-6 p-2 md:p-3 text-white/70 hover:text-white transition-colors bg-white/10 hover:bg-white/20 rounded-full z-50">
        <X :size="24" />
      </button>

      <div v-if="currentGalleryIndex !== null" class="relative w-full max-w-7xl h-full lg:h-[85vh] flex flex-col lg:flex-row items-center lg:items-stretch lg:bg-black/40 lg:rounded-2xl lg:overflow-hidden lg:border lg:border-white/10 lg:shadow-2xl">
        
        <!-- Contenedor de Imagen (Izquierda en Desktop) -->
        <div class="relative w-full lg:w-[75%] flex-1 flex items-center justify-center h-[60vh] lg:h-full lg:bg-black/60 p-4 lg:p-8">
          
          <button v-if="translatedProyecto.galeria.length > 1" @click.stop="prevImage" class="absolute left-2 md:left-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 border border-white/10 hover:bg-black/80 rounded-full transition-all z-20 shadow-lg backdrop-blur-sm">
            <ChevronLeft :size="32" />
          </button>
          
          <button v-if="translatedProyecto.galeria.length > 1" @click.stop="nextImage" class="absolute right-2 md:right-6 top-1/2 -translate-y-1/2 p-3 text-white/70 hover:text-white bg-black/50 border border-white/10 hover:bg-black/80 rounded-full transition-all z-20 shadow-lg backdrop-blur-sm">
            <ChevronRight :size="32" />
          </button>

          <img :src="translatedProyecto.galeria[currentGalleryIndex].url" 
               :alt="translatedProyecto.galeria[currentGalleryIndex].caption || 'Imagen de galería'" 
               class="max-w-full max-h-full object-contain shadow-[0_0_50px_rgba(0,0,0,0.3)] animate-in zoom-in-95 duration-300 rounded-lg lg:rounded-none select-none" />
        </div>
        
        <!-- Panel de Detalles (Derecha en Desktop) -->
        <div class="w-full lg:w-[25%] bg-white/5 lg:bg-white/10 backdrop-blur-xl p-6 lg:p-8 flex flex-col mt-4 lg:mt-0 rounded-2xl lg:rounded-none border border-white/10 lg:border-y-0 lg:border-r-0 lg:border-l lg:border-white/10 overflow-y-auto">
          
          <!-- Header del Panel -->
          <div class="flex items-center justify-between lg:flex-col lg:items-start mb-6 gap-4 border-b border-white/10 pb-4">
            <div class="inline-flex items-center px-3 py-1.5 rounded-full bg-white/20 text-xs font-bold tracking-wider text-white uppercase shadow-inner">
              <Image :size="14" class="mr-2" /> {{ currentGalleryIndex + 1 }} / {{ translatedProyecto.galeria.length }}
            </div>
            <h3 class="text-white/90 font-bold text-lg hidden lg:block">{{ translatedProyecto.titulo }}</h3>
          </div>
          
          <!-- Descripción -->
          <div class="flex-1">
            <div v-if="translatedProyecto.galeria[currentGalleryIndex].caption" class="text-white">
              <h4 class="text-[10px] text-white/50 uppercase tracking-widest font-semibold mb-3">Descripción de la Foto</h4>
              <p class="text-sm md:text-base font-normal leading-relaxed text-white/90">
                {{ translatedProyecto.galeria[currentGalleryIndex].caption }}
              </p>
            </div>
            <div v-else class="text-white/30 flex flex-col items-center justify-center h-40 lg:h-full opacity-50">
              <FileText :size="32" class="mb-3" />
              <span class="text-sm font-medium">Sin descripción detallada</span>
            </div>
          </div>
          
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, reactive, onMounted, watch, computed, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore } from '../../stores/proyectos'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowLeft, Calendar, Github, ExternalLink, Youtube, FileText, Info, TrendingUp, ChevronRight, ChevronLeft, Image, X } from 'lucide-vue-next'

const route = useRoute()
const store = useProyectosStore()
const { locale } = useI18n()

const translatedProyecto = useTranslatedData(computed(() => store.current))

const expandedKpis = reactive({})
const isGalleryOpen = ref(false)
const currentGalleryIndex = ref(0)

function openGallery() {
  if (translatedProyecto.value?.galeria?.length) {
    currentGalleryIndex.value = 0
    isGalleryOpen.value = true
    document.body.style.overflow = 'hidden'
  }
}

function closeGallery() {
  isGalleryOpen.value = false
  document.body.style.overflow = ''
}

function nextImage() {
  const total = translatedProyecto.value.galeria.length
  currentGalleryIndex.value = (currentGalleryIndex.value + 1) % total
}

function prevImage() {
  const total = translatedProyecto.value.galeria.length
  currentGalleryIndex.value = (currentGalleryIndex.value - 1 + total) % total
}

function handleKeydown(e) {
  if (isGalleryOpen.value) {
    if (e.key === 'Escape') closeGallery()
    else if (e.key === 'ArrowRight') nextImage()
    else if (e.key === 'ArrowLeft') prevImage()
  }
}

// Cleanup body overflow if unmounted while gallery is open
onUnmounted(() => {
  document.body.style.overflow = ''
  window.removeEventListener('keydown', handleKeydown)
})

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

onMounted(() => {
  store.fetchOne(route.params.id)
  window.addEventListener('keydown', handleKeydown)
})
</script>
