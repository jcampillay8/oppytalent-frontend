<template>
  <div class="block group h-full">
    <GlassCard hoverEffect class="h-full flex flex-col transition-all duration-300 group-hover:border-indigo-500/50 overflow-hidden border-border/50">
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-4 mb-2">
          <div class="flex items-center gap-3">
            <div class="p-2 rounded-md bg-indigo-500/10 text-indigo-500 shrink-0">
              <ShieldCheck :size="18" />
            </div>
            <div>
              <h3 class="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors line-clamp-2">{{ tData.titulo }}</h3>
            </div>
          </div>
        </div>
        
        <p class="text-sm text-muted-foreground mb-4 mt-2">{{ tData.descripcion }}</p>
        
        <div class="mt-auto pt-3 border-t border-border/50">
          <span class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
            {{ tData.tipo || 'Habilitación' }}
          </span>
        </div>
      </div>
    </GlassCard>
  </div>
</template>

<script setup>
import { useTranslatedData } from '../../composables/useTranslatedData'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'
import GlassCard from '../ui/GlassCard.vue'
import { ShieldCheck } from 'lucide-vue-next'

const props = defineProps({
  habilitacion: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.habilitacion, locale.value))
</script>
