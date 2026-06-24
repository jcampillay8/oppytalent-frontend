<template>
  <router-link :to="'/habilitacion/' + habilitacion.id" class="block group h-full cursor-pointer">
    <GlassCard hoverEffect class="h-full flex flex-col transition-all duration-300 group-hover:border-indigo-500/50 overflow-hidden border-border/50">
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-4 mb-2">
          <div class="flex items-center gap-3">
            <div v-if="tData.image_url" class="w-12 h-12 rounded-md overflow-hidden shrink-0 border border-indigo-500/20">
              <img :src="tData.image_url" class="w-full h-full object-cover" alt="Credencial" />
            </div>
            <div v-else class="p-2 rounded-md bg-indigo-500/10 text-indigo-500 shrink-0">
              <ShieldCheck :size="18" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">{{ tData.titulo }}</h3>
            </div>
          </div>
        </div>
        
        <p class="text-sm text-muted-foreground mb-4 mt-2">{{ tData.descripcion }}</p>
        
        <div class="mt-auto pt-3 border-t border-border/50 flex justify-between items-center">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {{ tData.tipo || $t('portfolio.habilitaciones') }}
          </span>
          <a v-if="tData.enlace" :href="tData.enlace" target="_blank" @click.stop class="flex items-center gap-1 text-xs text-indigo-500 hover:text-indigo-400 font-medium bg-indigo-500/5 px-2 py-1 rounded-md transition-colors">
            {{ $t('portfolio.credential') }} <ExternalLink :size="12" />
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
import { ShieldCheck, ExternalLink } from 'lucide-vue-next'

const props = defineProps({
  habilitacion: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.habilitacion, locale.value))
</script>
