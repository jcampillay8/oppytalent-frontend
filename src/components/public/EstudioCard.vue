<template>
  <router-link :to="`/estudio/${estudio.id}`" class="block outline-none group h-full">
    <GlassCard hoverEffect class="h-full flex flex-col transition-all duration-300 group-hover:border-blue-500/50 overflow-hidden border-border/50">
      <div v-if="tData.image_url" class="w-full h-48 overflow-hidden relative shrink-0">
        <div class="absolute inset-0 bg-blue-500/10 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
        <img :src="tData.image_url" :alt="tData.institucion" class="w-full h-full object-cover" />
      </div>
      
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-4 mb-2">
          <div>
            <h3 class="text-lg font-bold text-foreground group-hover:text-blue-500 transition-colors line-clamp-2">{{ tData.titulo }}</h3>
            <span class="text-sm font-medium text-blue-500/80 block mt-0.5">{{ tData.institucion }}</span>
          </div>
          <span class="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1 bg-secondary px-2 py-0.5 rounded-full border border-border/50">{{ formatPeriod(tData.fecha_inicio, tData.fecha_fin) }}</span>
        </div>
        
        <p class="text-sm text-muted-foreground mb-4 line-clamp-3">{{ truncate(tData.descripcion, 200) }}</p>
        
        <div class="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">
            {{ tData.tipo_estudio || 'Estudio' }}
          </span>
          <a v-if="tData.enlace_credencial" :href="tData.enlace_credencial" target="_blank" @click.stop class="text-xs text-blue-500 hover:text-blue-400 font-medium">Ver Credencial &rarr;</a>
        </div>
      </div>
    </GlassCard>
  </router-link>
</template>

<script setup>
import { useTranslatedData } from '../../composables/useTranslatedData'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
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
