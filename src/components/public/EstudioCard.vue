<template>
  <router-link :to="`/estudio/${estudio.id}`" class="block outline-none group h-full w-full">
    <GlassCard hoverEffect class="h-full border-border/50 transition-all duration-300 group-hover:border-amber-500/50">
      <div class="flex flex-row items-start gap-4 w-full h-full">
        <!-- Thumbnail -->
        <div v-if="tData.image_url" class="shrink-0 w-24 sm:w-48 h-24 sm:h-32 rounded-lg overflow-hidden border border-border/50 relative bg-white dark:bg-white/5 p-2 flex items-center justify-center">
          <div class="absolute inset-0 bg-amber-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay pointer-events-none"></div>
          <img :src="tData.image_url" :alt="tData.institucion" class="w-full h-full object-contain drop-shadow-sm relative z-0" />
        </div>

        <!-- Contenedor derecho -->
        <div class="flex-1 flex flex-col justify-between min-w-0 h-full">
          
          <div class="flex flex-col gap-1 sm:gap-2 min-w-0 w-full">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-amber-500/10 text-amber-500 shrink-0 hidden sm:flex">
                <GraduationCap :size="18" />
              </div>
              <h3 class="font-bold text-lg text-foreground group-hover:text-amber-500 transition-colors truncate" :title="tData.titulo">{{ tData.titulo }}</h3>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
              <span class="flex items-center gap-1 font-medium"><Building2 :size="14" /> {{ tData.institucion }}</span>
              <span class="hidden sm:inline">&middot;</span>
              <span class="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full border border-border/50 text-[10px] sm:text-xs">
                <Calendar :size="12" /> {{ formatPeriod(tData.fecha_inicio, tData.fecha_fin) }}
              </span>
            </div>

            <p class="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 hidden sm:block">{{ truncate(tData.descripcion, 150) }}</p>
          </div>

          <div class="mt-auto pt-3 sm:mt-4 flex items-center justify-between">
            <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-amber-500/10 text-amber-500 border border-amber-500/20">
              {{ tData.tipo_estudio || 'Estudio' }}
            </span>
            <a v-if="tData.enlace_credencial" :href="tData.enlace_credencial" target="_blank" @click.stop class="text-xs text-amber-500 hover:text-amber-400 font-medium">Ver Credencial &rarr;</a>
          </div>

        </div>
      </div>
    </GlassCard>
  </router-link>
</template>

<script setup>
import { useTranslatedData } from '../../composables/useTranslatedData'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import { GraduationCap, Building2, Calendar } from 'lucide-vue-next'
import GlassCard from '../ui/GlassCard.vue'

const props = defineProps({
  estudio: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.estudio, locale.value))

function formatPeriod(start, end) {
  const isEn = locale.value === 'en'
  const loc = isEn ? 'en-US' : 'es-CL'
  const fmt = (d) => new Date(d).getFullYear()
  const presentTxt = isEn ? 'Present' : 'Presente'
  if(!start) return ''
  return `${fmt(start)} - ${end ? fmt(end) : presentTxt}`
}

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>
