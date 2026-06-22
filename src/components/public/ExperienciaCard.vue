<template>
  <router-link :to="`/experiencia/${experiencia.id}`" class="block outline-none group h-full w-full">
    <GlassCard hoverEffect class="h-full border-border/50 transition-all duration-300 group-hover:border-emerald-500/50">
      <div class="flex flex-row items-start gap-4 w-full h-full">
        <!-- Thumbnail YouTube Style -->
        <div v-if="tData.image_url" class="shrink-0 w-24 sm:w-48 h-24 sm:h-32 rounded-lg overflow-hidden border border-border/50 relative">
          <div class="absolute inset-0 bg-emerald-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
          <img :src="tData.image_url" :alt="tData.empresa" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
        </div>

        <!-- Contenedor derecho para el resto de la info -->
        <div class="flex-1 flex flex-col justify-between min-w-0 h-full">
          
          <div class="flex flex-col gap-1 sm:gap-2 min-w-0 w-full">
            <div class="flex items-center gap-3">
              <div class="p-2 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0 hidden sm:flex">
                <Briefcase :size="18" />
              </div>
              <h3 class="font-bold text-lg text-foreground group-hover:text-emerald-500 transition-colors truncate" :title="tData.rol">{{ tData.rol }}</h3>
            </div>
            
            <div class="flex items-center gap-2 sm:gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
              <span class="flex items-center gap-1 font-medium"><Building2 :size="14" /> {{ tData.empresa }}</span>
              <span class="hidden sm:inline">&middot;</span>
              <span class="flex items-center gap-1 bg-secondary px-2 py-0.5 rounded-full border border-border/50 text-[10px] sm:text-xs">
                <Calendar :size="12" /> {{ formatPeriod(tData.periodo_inicio, tData.periodo_fin) }}
              </span>
            </div>

            <p class="text-xs sm:text-sm text-muted-foreground mt-2 line-clamp-2 hidden sm:block">{{ truncate(tData.descripcion_logros, 150) }}</p>
          </div>

          <div class="mt-auto pt-3 sm:mt-4">
            <div class="flex flex-wrap gap-1.5">
              <span v-for="tag in tData.tags_industria?.slice(0, 3) || []" :key="tag" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                {{ tag }}
              </span>
              <span v-if="(tData.tags_industria?.length || 0) > 3" class="text-[10px] text-muted-foreground flex items-center px-1">...</span>
            </div>
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
import { Briefcase, Building2, Calendar } from 'lucide-vue-next'
import GlassCard from '../ui/GlassCard.vue'

const props = defineProps({
  experiencia: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.experiencia, locale.value))

function formatPeriod(start, end) {
  const isEn = locale.value === 'en'
  const loc = isEn ? 'en-US' : 'es-CL'
  const fmt = (d) => new Date(d).toLocaleDateString(loc, { year: 'numeric', month: 'short' })
  const presentTxt = isEn ? 'Present' : 'Presente'
  return `${fmt(start)} - ${end ? fmt(end) : presentTxt}`
}

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>
