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
          <div v-if="currentTab === 'proyectos'" class="relative">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="!proyectos.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
                No se encontraron proyectos.
              </div>
              <div v-for="(p, index) in proyectos" :key="p.id" class="relative group/edit">
                <ProyectoCard :proyecto="p" />
                <button v-if="isOwner && index < userLimit" @click="$emit('edit', 'project', p)" class="absolute top-3 right-3 p-2 bg-background/90 text-foreground rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-border">
                  <Edit2 :size="16" />
                </button>
                <button v-else-if="isOwner && index >= userLimit" @click="$emit('upgrade')" class="absolute top-3 right-3 p-2 bg-background/90 text-amber-500 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-amber-500/50">
                  <Lock :size="16" />
                </button>
              </div>
            </div>
            <div v-if="isOwner" class="mt-6 flex justify-center">
              <NeonButton variant="outline" class="border-dashed" @click="$emit('new', 'project')">
                <template #icon-left><Plus :size="16" /></template>
                Añadir Proyecto
              </NeonButton>
            </div>
          </div>

          <!-- Experiencia -->
          <div v-else-if="currentTab === 'experiencia'" class="relative">
            <div class="grid grid-cols-1 gap-6">
              <div v-if="!experiencias.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
                No se encontraron experiencias.
              </div>
              <div v-for="(e, index) in experiencias" :key="e.id" class="relative group/edit">
                <ExperienciaCard :experiencia="e" />
                <button v-if="isOwner && index < userLimit" @click="$emit('edit', 'experience', e)" class="absolute top-3 right-3 p-2 bg-background/90 text-foreground rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-border">
                  <Edit2 :size="16" />
                </button>
                <button v-else-if="isOwner && index >= userLimit" @click="$emit('upgrade')" class="absolute top-3 right-3 p-2 bg-background/90 text-amber-500 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-amber-500/50">
                  <Lock :size="16" />
                </button>
              </div>
            </div>
            <div v-if="isOwner" class="mt-6 flex justify-center">
              <NeonButton variant="outline" class="border-dashed" @click="$emit('new', 'experience')">
                <template #icon-left><Plus :size="16" /></template>
                Añadir Experiencia
              </NeonButton>
            </div>
          </div>

          <!-- Estudios -->
          <div v-else-if="currentTab === 'estudios'" class="relative">
            <div class="grid grid-cols-1 gap-6">
              <div v-if="!estudios.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
                No se encontraron estudios.
              </div>
              <div v-for="(e, index) in estudios" :key="e.id" class="relative group/edit">
                <EstudioCard :estudio="e" />
                <button v-if="isOwner && index < userLimit" @click="$emit('edit', 'education', e)" class="absolute top-3 right-3 p-2 bg-background/90 text-foreground rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-border">
                  <Edit2 :size="16" />
                </button>
                <button v-else-if="isOwner && index >= userLimit" @click="$emit('upgrade')" class="absolute top-3 right-3 p-2 bg-background/90 text-amber-500 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-amber-500/50">
                  <Lock :size="16" />
                </button>
              </div>
            </div>
            <div v-if="isOwner" class="mt-6 flex justify-center">
              <NeonButton variant="outline" class="border-dashed" @click="$emit('new', 'education')">
                <template #icon-left><Plus :size="16" /></template>
                Añadir Estudio
              </NeonButton>
            </div>
          </div>

          <!-- Reconocimientos -->
          <div v-else-if="currentTab === 'reconocimientos'" class="relative">
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div v-if="!reconocimientos.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
                No se encontraron reconocimientos.
              </div>
              <div v-for="(r, index) in reconocimientos" :key="r.id" class="relative group/edit">
                <ReconocimientoCard :reconocimiento="r" />
                <button v-if="isOwner && index < userLimit" @click="$emit('edit', 'recognition', r)" class="absolute top-3 right-3 p-2 bg-background/90 text-foreground rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-border">
                  <Edit2 :size="16" />
                </button>
                <button v-else-if="isOwner && index >= userLimit" @click="$emit('upgrade')" class="absolute top-3 right-3 p-2 bg-background/90 text-amber-500 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-amber-500/50">
                  <Lock :size="16" />
                </button>
              </div>
            </div>
            <div v-if="isOwner" class="mt-6 flex justify-center">
              <NeonButton variant="outline" class="border-dashed" @click="$emit('new', 'recognition')">
                <template #icon-left><Plus :size="16" /></template>
                Añadir Reconocimiento
              </NeonButton>
            </div>
          </div>

          <!-- Habilitaciones -->
          <div v-else-if="currentTab === 'habilitaciones'" class="relative">
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div v-if="!habilitaciones.length" class="col-span-full text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
                No se encontraron habilitaciones.
              </div>
              <div v-for="(h, index) in habilitaciones" :key="h.id" class="relative group/edit">
                <HabilitacionCard :habilitacion="h" />
                <button v-if="isOwner && index < userLimit" @click="$emit('edit', 'skill', h)" class="absolute top-3 right-3 p-2 bg-background/90 text-foreground rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-border">
                  <Edit2 :size="16" />
                </button>
                <button v-else-if="isOwner && index >= userLimit" @click="$emit('upgrade')" class="absolute top-3 right-3 p-2 bg-background/90 text-amber-500 rounded-full opacity-0 group-hover/edit:opacity-100 transition-opacity z-10 shadow-lg hover:scale-110 border border-amber-500/50">
                  <Lock :size="16" />
                </button>
              </div>
            </div>
            <div v-if="isOwner" class="mt-6 flex justify-center">
              <NeonButton variant="outline" class="border-dashed" @click="$emit('new', 'skill')">
                <template #icon-left><Plus :size="16" /></template>
                Añadir Habilidad
              </NeonButton>
            </div>
          </div>
        </div>
      </transition>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from 'vue'
import { FolderKanban, Briefcase, GraduationCap, Award, ShieldCheck, Edit2, Plus, Lock } from 'lucide-vue-next'
import Badge from '../ui/Badge.vue'
import NeonButton from '../ui/NeonButton.vue'
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
  config: { type: Object, required: true }, // { proyectos: true, experiencia: true, ... }
  isOwner: { type: Boolean, default: false },
  userLimit: { type: Number, default: 999 }
})

defineEmits(['edit', 'new', 'upgrade'])

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
