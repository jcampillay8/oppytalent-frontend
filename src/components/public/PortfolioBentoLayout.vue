<template>
  <div class="w-full">
    <!-- Bento Grid -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6 auto-rows-min md:auto-rows-[250px]">
      
      <!-- Experiencia (Caja Grande) -->
      <div v-if="config.experiencia !== false" 
           @click="openModal('experiencia')"
           class="md:col-span-2 md:row-span-1 rounded-3xl p-6 md:p-8 cursor-pointer relative overflow-hidden group border border-border/50 bg-card hover:border-emerald-500/50 transition-all duration-300 shadow-sm hover:shadow-emerald-500/10">
        <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 flex flex-col h-full justify-between">
          <div class="flex justify-between items-start">
            <div class="p-3 bg-emerald-500/10 rounded-2xl text-emerald-500">
              <Briefcase :size="24" />
            </div>
            <Badge variant="secondary" class="bg-emerald-500/10 text-emerald-500 border-none">{{ experiencias.length }} {{ $t('portfolio.experiencia') }}</Badge>
          </div>
          <div class="mt-8">
            <h3 class="text-2xl font-bold text-foreground group-hover:text-emerald-500 transition-colors mb-2">Mi Trayectoria Laboral</h3>
            <p class="text-muted-foreground text-sm line-clamp-2">Explora mis roles, responsabilidades y logros profesionales a lo largo del tiempo.</p>
          </div>
        </div>
      </div>

      <!-- Proyectos (Caja Alta o Ancha) -->
      <div v-if="config.proyectos !== false" 
           @click="openModal('proyectos')"
           class="md:col-span-1 md:row-span-2 rounded-3xl p-6 md:p-8 cursor-pointer relative overflow-hidden group border border-border/50 bg-card hover:border-blue-500/50 transition-all duration-300 shadow-sm hover:shadow-blue-500/10">
        <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div class="relative z-10 flex flex-col h-full">
          <div class="flex justify-between items-start mb-auto">
            <div class="p-3 bg-blue-500/10 rounded-2xl text-blue-500">
              <FolderKanban :size="24" />
            </div>
            <Badge variant="secondary" class="bg-blue-500/10 text-blue-500 border-none">{{ proyectos.length }} {{ $t('portfolio.proyectos') }}</Badge>
          </div>
          <div class="mt-8">
            <h3 class="text-2xl font-bold text-foreground group-hover:text-blue-500 transition-colors mb-2">Proyectos Destacados</h3>
            <p class="text-muted-foreground text-sm mb-4">Soluciones tecnológicas, aplicaciones y casos de estudio.</p>
            <!-- Preview of technologies -->
            <div class="flex flex-wrap gap-2 mt-4">
              <div v-for="(tech, i) in topTechs.slice(0, 5)" :key="i" class="w-8 h-8 rounded-full bg-secondary border border-border flex items-center justify-center text-[10px] font-bold text-muted-foreground overflow-hidden">
                {{ tech.substring(0, 2) }}
              </div>
            </div>
          </div>
        </div>
      </div>

      <!-- Estudios (Caja Mediana) -->
      <div v-if="config.estudios !== false" 
           @click="openModal('estudios')"
           class="md:col-span-1 md:row-span-1 rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-border/50 bg-card hover:border-amber-500/50 transition-all duration-300 shadow-sm hover:shadow-amber-500/10 flex flex-col justify-between">
        <div class="absolute inset-0 bg-gradient-to-br from-amber-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-3 relative z-10 mb-4">
          <div class="p-2.5 bg-amber-500/10 rounded-xl text-amber-500">
            <GraduationCap :size="20" />
          </div>
          <h3 class="text-lg font-bold text-foreground group-hover:text-amber-500 transition-colors">{{ $t('portfolio.estudios') }}</h3>
        </div>
      </div>

      <!-- Reconocimientos (Caja Pequeña/Mediana) -->
      <div v-if="config.reconocimientos !== false" 
           @click="openModal('reconocimientos')"
           class="md:col-span-1 md:row-span-1 rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-border/50 bg-card hover:border-pink-500/50 transition-all duration-300 shadow-sm hover:shadow-pink-500/10 flex flex-col justify-between">
        <div class="absolute inset-0 bg-gradient-to-br from-pink-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-3 relative z-10 mb-4">
          <div class="p-2.5 bg-pink-500/10 rounded-xl text-pink-500">
            <Award :size="20" />
          </div>
          <h3 class="text-lg font-bold text-foreground group-hover:text-pink-500 transition-colors">{{ $t('portfolio.reconocimientos') }}</h3>
        </div>
      </div>

      <!-- Habilitaciones (Si sobra espacio, ocupa 1 o más según CSS grid dense) -->
      <div v-if="config.habilitaciones !== false" 
           @click="openModal('habilitaciones')"
           class="md:col-span-1 md:row-span-1 rounded-3xl p-6 cursor-pointer relative overflow-hidden group border border-border/50 bg-card hover:border-indigo-500/50 transition-all duration-300 shadow-sm hover:shadow-indigo-500/10 flex flex-col justify-between">
        <div class="absolute inset-0 bg-gradient-to-br from-indigo-500/5 to-transparent opacity-50 group-hover:opacity-100 transition-opacity"></div>
        <div class="flex items-center gap-3 relative z-10 mb-4">
          <div class="p-2.5 bg-indigo-500/10 rounded-xl text-indigo-500">
            <ShieldCheck :size="20" />
          </div>
          <h3 class="text-lg font-bold text-foreground group-hover:text-indigo-500 transition-colors">{{ $t('portfolio.habilitaciones') }}</h3>
        </div>
      </div>

    </div>

    <!-- Modal Inmersivo (Glassmorphism) -->
    <Teleport to="body">
      <transition name="fade">
        <div v-if="activeModal" class="fixed inset-0 z-50 flex flex-col bg-background/80 backdrop-blur-xl overflow-y-auto" @click.self="closeModal">
          <!-- Botón de Cerrar Flotante -->
          <div class="sticky top-0 right-0 p-4 sm:p-6 flex justify-end z-50 pointer-events-none">
            <button @click="closeModal" class="p-3 bg-secondary hover:bg-secondary/80 text-foreground rounded-full shadow-lg border border-border/50 pointer-events-auto transition-transform hover:scale-110">
              <X :size="24" />
            </button>
          </div>

          <!-- Contenido del Modal -->
          <div class="w-full max-w-5xl mx-auto px-4 pb-20 -mt-10" v-motion :initial="{ opacity: 0, y: 50 }" :enter="{ opacity: 1, y: 0 }">
            
            <div class="mb-12">
              <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground flex items-center gap-4">
                <component :is="modalInfo.icon" :size="48" :class="modalInfo.colorClass" />
                {{ modalInfo.title }}
              </h2>
              <p class="text-xl text-muted-foreground mt-2">{{ modalInfo.subtitle }}</p>
            </div>

            <!-- Proyectos -->
            <div v-if="activeModal === 'proyectos'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ProyectoCard v-for="p in proyectos" :key="p.id" :proyecto="p" />
            </div>

            <!-- Experiencia -->
            <div v-else-if="activeModal === 'experiencia'" class="grid grid-cols-1 gap-6 relative">
              <ExperienciaCard v-for="e in experiencias" :key="e.id" :experiencia="e" />
            </div>

            <!-- Estudios -->
            <div v-else-if="activeModal === 'estudios'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <EstudioCard v-for="e in estudios" :key="e.id" :estudio="e" />
            </div>

            <!-- Reconocimientos -->
            <div v-else-if="activeModal === 'reconocimientos'" class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <ReconocimientoCard v-for="r in reconocimientos" :key="r.id" :reconocimiento="r" />
            </div>

            <!-- Habilitaciones -->
            <div v-else-if="activeModal === 'habilitaciones'" class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <HabilitacionCard v-for="h in habilitaciones" :key="h.id" :habilitacion="h" />
            </div>

          </div>
        </div>
      </transition>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { FolderKanban, Briefcase, GraduationCap, Award, ShieldCheck, X } from 'lucide-vue-next'
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
  config: { type: Object, required: true }
})

const { t } = useI18n()
const activeModal = ref(null)

const openModal = (section) => {
  activeModal.value = section
  document.body.style.overflow = 'hidden' // Evitar scroll del body
}

const closeModal = () => {
  activeModal.value = null
  document.body.style.overflow = ''
}

const modalInfo = computed(() => {
  switch (activeModal.value) {
    case 'experiencia': return { title: t('portfolio.experiencia'), subtitle: '', icon: Briefcase, colorClass: 'text-emerald-500' }
    case 'proyectos': return { title: t('portfolio.proyectos'), subtitle: '', icon: FolderKanban, colorClass: 'text-blue-500' }
    case 'estudios': return { title: t('portfolio.estudios'), subtitle: '', icon: GraduationCap, colorClass: 'text-amber-500' }
    case 'reconocimientos': return { title: t('portfolio.reconocimientos'), subtitle: '', icon: Award, colorClass: 'text-pink-500' }
    case 'habilitaciones': return { title: t('portfolio.habilitaciones'), subtitle: '', icon: ShieldCheck, colorClass: 'text-indigo-500' }
    default: return {}
  }
})

const topTechs = computed(() => {
  const allTechs = props.proyectos.flatMap(p => p.stack_tecnologico || [])
  const counts = {}
  allTechs.forEach(t => counts[t] = (counts[t] || 0) + 1)
  return Object.entries(counts).sort((a, b) => b[1] - a[1]).map(e => e[0])
})
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
