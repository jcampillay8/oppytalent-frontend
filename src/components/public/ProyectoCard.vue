<template>
  <router-link :to="`/proyecto/${proyecto.id}`" class="block outline-none group h-full">
    <GlassCard hoverEffect class="h-full flex flex-col transition-all duration-300 group-hover:border-primary/50 overflow-hidden border-border/50">
      <div v-if="translatedProyecto.image_url" class="w-full h-48 overflow-hidden relative shrink-0">
        <div class="absolute inset-0 bg-primary/20 opacity-0 group-hover:opacity-100 transition-opacity z-10 mix-blend-overlay"></div>
        <img :src="translatedProyecto.image_url" :alt="translatedProyecto.titulo" class="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500" />
      </div>
      
      <div class="p-5 flex flex-col flex-grow">
        <div class="flex justify-between items-start gap-4 mb-2">
          <h3 class="text-lg font-bold text-foreground group-hover:text-primary transition-colors line-clamp-2">{{ translatedProyecto.titulo }}</h3>
          <span class="text-xs font-medium text-muted-foreground whitespace-nowrap pt-1 bg-secondary px-2 py-0.5 rounded-full border border-border/50">{{ formatDate(proyecto.fecha_proyecto) }}</span>
        </div>
        
        <p class="text-sm text-muted-foreground mb-4 line-clamp-3">{{ translatedProyecto.descripcion_corta }}</p>
        
        <div class="mt-auto space-y-3">
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tag in translatedProyecto.tags" :key="tag" class="px-2 py-0.5 text-[10px] font-bold uppercase tracking-wider rounded-full bg-blue-500/10 text-blue-500 border border-blue-500/20">{{ tag }}</span>
          </div>
          
          <div class="flex flex-wrap gap-1.5">
            <span v-for="tech in (translatedProyecto.stack_tecnologico || []).slice(0, 5)" :key="tech" class="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary border border-border/50 text-muted-foreground">{{ tech }}</span>
            <span v-if="translatedProyecto.stack_tecnologico?.length > 5" class="px-2 py-0.5 text-xs font-medium rounded-md bg-secondary border border-border/50 text-muted-foreground">+{{ translatedProyecto.stack_tecnologico.length - 5 }}</span>
          </div>
          
          <div v-if="translatedProyecto.kpis && Object.keys(translatedProyecto.kpis).length" class="pt-3 border-t border-border/50">
            <span class="text-[10px] font-bold text-muted-foreground uppercase tracking-widest block mb-2">KPIs</span>
            <div class="flex flex-wrap gap-1.5">
              <span v-for="(val, key) in translatedProyecto.kpis" :key="key" class="text-xs font-medium px-2 py-0.5 rounded-md bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">{{ key }}</span>
            </div>
          </div>
        </div>
      </div>
    </GlassCard>
  </router-link>
</template>

<script setup>
import { computed } from 'vue'
import { useTranslatedData } from '../../composables/useTranslatedData'
import GlassCard from '../ui/GlassCard.vue'

const props = defineProps({
  proyecto: { type: Object, required: true },
})

const translatedProyecto = useTranslatedData(computed(() => props.proyecto))

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'short' })
}
</script>
