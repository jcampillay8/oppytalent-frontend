<template>
  <router-link :to="'/reconocimiento/' + reconocimiento.id" class="block group h-full cursor-pointer">
    <GlassCard hoverEffect class="h-full flex flex-col transition-all duration-300 group-hover:border-pink-500/50 overflow-hidden border-border/50">
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-4 mb-2">
          <div class="flex items-center gap-3">
            <div v-if="tData.image_url" class="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-pink-500/20">
              <img :src="tData.image_url" class="w-full h-full object-cover" alt="Premio" />
            </div>
            <div v-else class="p-2 rounded-md bg-pink-500/10 text-pink-500 shrink-0">
              <Award :size="18" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors line-clamp-2">{{ tData.titulo }}</h3>
              <span class="text-sm font-medium text-pink-500/80 block mt-0.5">{{ tData.institucion }}</span>
            </div>
          </div>
          <span v-if="tData.fecha" class="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1 bg-secondary px-2 py-0.5 rounded-full border border-border/50">{{ formatDate(tData.fecha) }}</span>
        </div>
        
        <p class="text-sm text-muted-foreground mb-4 line-clamp-3 mt-3">{{ truncate(tData.descripcion, 200) }}</p>
        
        <div class="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-pink-500/10 text-pink-500 border border-pink-500/20">
            {{ tData.tipo || $t('portfolio.reconocimientos') }}
          </span>
          <a v-if="tData.enlace" :href="tData.enlace" target="_blank" @click.stop class="flex items-center gap-1 text-xs text-pink-500 hover:text-pink-400 font-medium bg-pink-500/5 px-2 py-1 rounded-md transition-colors">
            {{ $t('portfolio.read_more') }} <ExternalLink :size="12" />
          </a>
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
import { Award, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  reconocimiento: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.reconocimiento, locale.value))

function formatDate(d) {
  if (!d) return ''
  const loc = locale.value === 'en' ? 'en-US' : 'es-CL'
  return new Date(d).toLocaleDateString(loc, { year: 'numeric', month: 'short' })
}

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>
