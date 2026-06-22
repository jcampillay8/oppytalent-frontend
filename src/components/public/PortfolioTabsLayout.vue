<template>
  <div class="w-full">
    <!-- Pestañas de Navegación -->
    <div class="flex flex-wrap justify-center gap-2 md:gap-3 mb-8 pb-4 border-b border-border/50 sticky top-0 bg-background/80 backdrop-blur-md z-40 pt-4 px-4 sm:px-0">
      <button 
        v-for="tab in activeTabs" 
        :key="tab.id"
        @click="currentTab = tab.id"
        class="px-4 py-2.5 rounded-full whitespace-nowrap text-sm font-semibold transition-all duration-300 border shadow-sm"
        :class="currentTab === tab.id 
          ? 'bg-primary text-primary-foreground border-primary shadow-md shadow-primary/30 scale-105 ring-2 ring-primary/20' 
          : 'bg-secondary/70 text-muted-foreground border-border/50 hover:bg-secondary hover:text-foreground hover:scale-[1.02]'"
      >
        <div class="flex items-center gap-2">
          <component :is="tab.icon" :size="16" />
          {{ tab.label }}
          <Badge v-if="tab.count !== undefined" variant="secondary" class="ml-1 opacity-80" :class="currentTab === tab.id ? 'bg-primary-foreground/20 text-primary-foreground' : ''">
            {{ tab.count }}
          </Badge>
        </div>
      </button>
    </div>

    <!-- Contenido Dinámico -->
    <div class="min-h-[50vh]">
      <transition name="fade" mode="out-in">
        <div :key="currentTab">
          <!-- Proyectos -->
          <div v-if="currentTab === 'proyectos'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="!proyectos.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
              No se encontraron proyectos.
            </div>
            <ProyectoCard v-for="p in proyectos" :key="p.id" :proyecto="p" />
          </div>

          <!-- Experiencia -->
          <div v-else-if="currentTab === 'experiencia'" class="grid grid-cols-1 gap-6 relative">
            <div v-if="!experiencias.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
              No se encontraron experiencias.
            </div>
            <ExperienciaCard v-for="e in experiencias" :key="e.id" :experiencia="e" />
          </div>

          <!-- Estudios -->
          <div v-else-if="currentTab === 'estudios'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="!estudios.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
              No se encontraron estudios.
            </div>
            <EstudioCard v-for="e in estudios" :key="e.id" :estudio="e" />
          </div>

          <!-- Reconocimientos -->
          <div v-else-if="currentTab === 'reconocimientos'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="!reconocimientos.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
              No se encontraron reconocimientos.
            </div>
            <ReconocimientoCard v-for="r in reconocimientos" :key="r.id" :reconocimiento="r" />
          </div>

          <!-- Habilitaciones -->
          <div v-else-if="currentTab === 'habilitaciones'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div v-if="!habilitaciones.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
              No se encontraron habilitaciones.
            </div>
            <HabilitacionCard v-for="h in habilitaciones" :key="h.id" :habilitacion="h" />
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { FolderKanban, Briefcase, GraduationCap, Award, ShieldCheck } from 'lucide-vue-next'
import Badge from '../ui/Badge.vue'
import ProyectoCard from './ProyectoCard.vue'
import ExperienciaCard from './ExperienciaCard.vue'
import EstudioCard from './EstudioCard.vue'
import ReconocimientoCard from './ReconocimientoCard.vue'
import HabilitacionCard from './HabilitacionCard.vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  proyectos: { type: Array, default: () => [] },
  experiencias: { type: Array, default: () => [] },
  estudios: { type: Array, default: () => [] },
  reconocimientos: { type: Array, default: () => [] },
  habilitaciones: { type: Array, default: () => [] },
  config: { type: Object, required: true } // { proyectos: true, experiencia: true, ... }
})

const { t } = useI18n()

// Configurar pestañas dinámicamente según la configuración
const activeTabs = computed(() => {
  const tabs = []
  if (props.config.experiencia !== false) {
    tabs.push({ id: 'experiencia', label: t('portfolio.experiencia'), icon: Briefcase, count: props.experiencias.length })
  }
  if (props.config.proyectos !== false) {
    tabs.push({ id: 'proyectos', label: t('portfolio.proyectos'), icon: FolderKanban, count: props.proyectos.length })
  }
  if (props.config.estudios !== false) {
    tabs.push({ id: 'estudios', label: t('portfolio.estudios'), icon: GraduationCap, count: props.estudios.length })
  }
  if (props.config.reconocimientos !== false) {
    tabs.push({ id: 'reconocimientos', label: t('portfolio.reconocimientos'), icon: Award, count: props.reconocimientos.length })
  }
  if (props.config.habilitaciones !== false) {
    tabs.push({ id: 'habilitaciones', label: t('portfolio.habilitaciones'), icon: ShieldCheck, count: props.habilitaciones.length })
  }
  return tabs
})

const currentTab = ref(activeTabs.value[0]?.id || 'experiencia')

// Si las pestañas cambian y la actual desaparece, seleccionar la primera
watch(activeTabs, (newTabs) => {
  if (newTabs.length > 0 && !newTabs.find(t => t.id === currentTab.value)) {
    currentTab.value = newTabs[0].id
  }
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease, transform 0.3s ease;
}
.fade-enter-from {
  opacity: 0;
  transform: translateY(10px);
}
.fade-leave-to {
  opacity: 0;
  transform: translateY(-10px);
}
.hide-scrollbar::-webkit-scrollbar {
  display: none;
}
.hide-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
