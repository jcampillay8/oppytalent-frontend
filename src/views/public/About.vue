<template>
  <div class="container py-8 max-w-4xl mx-auto px-4">
    <div v-if="store.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
    <div v-else-if="!store.items.length" class="text-center py-20 bg-secondary/30 rounded-xl border border-dashed border-border/50">
      <p class="text-muted-foreground mb-4">{{ locale === 'en' ? 'No information available.' : 'No hay información disponible.' }}</p>
      <router-link to="/">
        <NeonButton variant="outline">{{ locale === 'en' ? 'Back to home' : 'Volver al inicio' }}</NeonButton>
      </router-link>
    </div>
    
    <article v-else class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <router-link to="/" class="inline-flex items-center gap-2 text-sm font-medium text-muted-foreground hover:text-primary transition-colors mb-8 group">
        <ArrowLeft :size="16" class="transition-transform group-hover:-translate-x-1" /> {{ locale === 'en' ? 'Back' : 'Volver' }}
      </router-link>
      
      <div class="flex flex-col md:flex-row gap-8 lg:gap-12 items-start">
        <div class="w-full md:w-1/3 flex flex-col items-center shrink-0">
          <div class="relative group w-full max-w-[280px]">
            <div class="absolute inset-0 bg-primary/20 rounded-2xl blur-xl scale-105 opacity-0 group-hover:opacity-100 transition-opacity duration-500 z-0"></div>
            <img
              v-if="tData.image_url"
              :src="tData.image_url"
              :alt="'Jaime Campillay'"
              class="w-full aspect-[4/5] object-cover rounded-2xl border-2 border-border/50 shadow-xl relative z-10 transition-transform duration-500 group-hover:scale-[1.02]"
            />
          </div>
        </div>
        
        <div class="w-full md:w-2/3">
          <header class="mb-8 text-center md:text-left">
            <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-2 flex items-center justify-center md:justify-start gap-3">
              <UserCircle2 :size="40" class="text-primary hidden sm:block" />
              {{ locale === 'en' ? 'About Me' : 'Sobre Mí' }}
            </h1>
            <p class="text-xl font-medium text-primary">{{ profile.nombre_completo || 'Usuario de OppyTalent' }}</p>
          </header>
          
          <div class="prose prose-zinc dark:prose-invert max-w-none markdown-body mb-10" v-html="renderMarkdown(tData.descripcion)"></div>
          
          <GlassCard class="p-6 mb-8" v-if="getYoutubeEmbed(tData.youtube_url)">
            <h3 class="text-xl font-bold mb-4 flex items-center gap-2"><Youtube :size="24" class="text-red-500" /> {{ locale === 'en' ? 'Video Presentation' : 'Video Presentación' }}</h3>
            <div class="relative w-full overflow-hidden pt-[56.25%] rounded-xl border border-border/50 bg-black">
              <iframe 
                :src="getYoutubeEmbed(tData.youtube_url)" 
                class="absolute top-0 left-0 w-full h-full"
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </GlassCard>
          
          <div class="grid grid-cols-1 sm:grid-cols-2 gap-6">
            <div v-if="tData.certificaciones?.length" class="space-y-4">
              <h3 class="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-2"><Award :size="20" class="text-emerald-500" /> {{ locale === 'en' ? 'Certifications' : 'Certificaciones' }}</h3>
              <ul class="space-y-3">
                <li v-for="(cert, i) in tData.certificaciones" :key="i" class="bg-secondary/50 p-3 rounded-lg border border-border/50 flex flex-col gap-1 hover:bg-secondary transition-colors">
                  <strong class="text-sm font-semibold text-foreground leading-tight">{{ cert.titulo || cert.nombre || (locale === 'en' ? 'Certification' : 'Certificación') }}</strong>
                  <span class="text-xs text-muted-foreground" v-if="cert.entidad">{{ cert.entidad }}</span>
                </li>
              </ul>
            </div>
            
            <div v-if="tData.idiomas?.length" class="space-y-4">
              <h3 class="text-lg font-bold flex items-center gap-2 border-b border-border/50 pb-2"><Languages :size="20" class="text-blue-500" /> {{ locale === 'en' ? 'Languages' : 'Idiomas' }}</h3>
              <ul class="space-y-3">
                <li v-for="(idioma, i) in tData.idiomas" :key="i" class="bg-secondary/50 p-3 rounded-lg border border-border/50 flex justify-between items-center hover:bg-secondary transition-colors">
                  <strong class="text-sm font-semibold text-foreground">{{ idioma.idioma }}</strong>
                  <Badge variant="outline" v-if="idioma.nivel">{{ idioma.nivel }}</Badge>
                </li>
              </ul>
            </div>
          </div>
          
        </div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePerfilStore } from '../../stores/perfil'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowLeft, UserCircle2, Youtube, Award, Languages } from 'lucide-vue-next'

const store = usePerfilStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const profile = computed(() => store.items[0] || {})
const tData = computed(() => getTranslated(profile.value, locale.value))

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

function getYoutubeEmbed(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

onMounted(() => store.fetchAll())
</script>
