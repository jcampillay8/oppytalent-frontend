<template>
  <div class="container py-8 max-w-5xl mx-auto">
    <!-- Hero Section -->
    <section class="text-center py-12 px-4 relative mb-8" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <!-- Decoración de fondo opcional si lo deseas -->
      <div class="absolute inset-0 bg-primary/5 rounded-[3rem] -z-10 blur-3xl opacity-50"></div>
      
      <div class="relative w-32 h-32 mx-auto mb-6 rounded-full border-4 border-primary/20 overflow-hidden shadow-xl" v-if="perfil?.avatar_url">
        <img :src="perfil.avatar_url" class="w-full h-full object-cover" alt="Profile avatar" />
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4">
        {{ perfil?.nombre_completo || 'Jaime Gabriel Campillay Rojas' }}
      </h1>
      <p class="text-lg md:text-xl text-primary font-medium mb-6">
        {{ perfil?.ocupacion || 'Ingeniero Civil Industrial • Magíster • Senior Software/Data Engineer' }}
      </p>
    </section>
      
    <!-- Tags / Filters -->
    <section class="mb-12" :class="{ 'opacity-80': !expanded.tags }">
      <h2 class="flex items-center justify-between text-xl font-bold border-b border-border/50 pb-3 mb-6 cursor-pointer hover:text-primary transition-colors group" @click="toggle('tags')">
        <div class="flex items-center gap-2">
          <Filter :size="20" class="text-primary" />
          Tags
        </div>
        <ChevronDown :size="20" class="transition-transform duration-300" :class="{ 'rotate-180': expanded.tags }" />
      </h2>
      <div v-show="expanded.tags" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1 }">
        <FilterBar
          :all-tags="availableTags"
          :selected-tags="selectedTags"
          @toggle="handleToggleTag"
          @clear="selectedTags = []"
        />
      </div>
    </section>

    <!-- Proyectos -->
    <section class="mb-12" :class="{ 'opacity-80': !expanded.proyectos }">
      <h2 class="flex items-center justify-between text-xl font-bold border-b border-border/50 pb-3 mb-6 cursor-pointer hover:text-primary transition-colors group" @click="toggle('proyectos')">
        <div class="flex items-center gap-2">
          <FolderKanban :size="20" class="text-blue-500" />
          <span>{{ $t('portfolio.proyectos') }} <Badge variant="secondary" class="ml-2">{{ filteredProyectos.length }}</Badge></span>
        </div>
        <ChevronDown :size="20" class="transition-transform duration-300" :class="{ 'rotate-180': expanded.proyectos }" />
      </h2>
      <div v-show="expanded.proyectos">
        <div v-if="proyectosStore.loading" class="flex justify-center py-10"><Loader2 class="animate-spin text-primary" :size="32" /></div>
        <div v-else-if="!filteredProyectos.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
          No se encontraron proyectos con los filtros seleccionados.
        </div>
        <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
          <ProyectoCard v-for="p in filteredProyectos" :key="p.id" :proyecto="p" />
        </div>
      </div>
    </section>

    <!-- Experiencia -->
    <section class="mb-12" :class="{ 'opacity-80': !expanded.experiencia }">
      <h2 class="flex items-center justify-between text-xl font-bold border-b border-border/50 pb-3 mb-6 cursor-pointer hover:text-primary transition-colors group" @click="toggle('experiencia')">
        <div class="flex items-center gap-2">
          <Briefcase :size="20" class="text-emerald-500" />
          <span>{{ $t('portfolio.experiencia') }} <Badge variant="secondary" class="ml-2">{{ filteredExperiencias.length }}</Badge></span>
        </div>
        <ChevronDown :size="20" class="transition-transform duration-300" :class="{ 'rotate-180': expanded.experiencia }" />
      </h2>
      <div v-show="expanded.experiencia">
        <div v-if="experienciasStore.loading" class="flex justify-center py-10"><Loader2 class="animate-spin text-primary" :size="32" /></div>
        <div v-else-if="!filteredExperiencias.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
          No se encontraron experiencias con los filtros seleccionados.
        </div>
        <div v-else class="grid grid-cols-1 gap-6 relative">
          <!-- Timeline line -->
          <div class="absolute left-6 top-4 bottom-4 w-px bg-border/50 hidden md:block"></div>
          <ExperienciaCard v-for="e in filteredExperiencias" :key="e.id" :experiencia="e" />
        </div>
      </div>
    </section>

    <!-- Estudios -->
    <section class="mb-12" :class="{ 'opacity-80': !expanded.estudios }">
      <h2 class="flex items-center justify-between text-xl font-bold border-b border-border/50 pb-3 mb-6 cursor-pointer hover:text-primary transition-colors group" @click="toggle('estudios')">
        <div class="flex items-center gap-2">
          <GraduationCap :size="20" class="text-amber-500" />
          <span>{{ $t('portfolio.estudios') }} <Badge variant="secondary" class="ml-2">{{ estudiosStore.items.length }}</Badge></span>
        </div>
        <ChevronDown :size="20" class="transition-transform duration-300" :class="{ 'rotate-180': expanded.estudios }" />
      </h2>
      <div v-show="expanded.estudios">
        <div v-if="estudiosStore.loading" class="flex justify-center py-10"><Loader2 class="animate-spin text-primary" :size="32" /></div>
        <div v-else-if="!estudiosStore.items.length" class="text-center py-10 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
          Sin estudios registrados.
        </div>
        <div v-else class="flex flex-col gap-4">
          <router-link v-for="e in sortedEstudios" :key="e.item.id" :to="`/estudios/${e.item.id}`" class="block outline-none group">
            <GlassCard hoverEffect class="flex items-center gap-6 p-5 transition-transform group-hover:translate-x-2">
              <div class="w-16 h-16 rounded-xl border border-border/50 bg-secondary flex items-center justify-center overflow-hidden shrink-0">
                <img v-if="e.tData.image_url" :src="e.tData.image_url" :alt="e.tData.institucion" class="w-full h-full object-cover" />
                <Building2 v-else :size="24" class="text-muted-foreground" />
              </div>
              <div class="flex-1 min-w-0">
                <h3 class="text-lg font-bold text-foreground mb-1 truncate">{{ e.tData.titulo }}</h3>
                <span class="text-sm text-muted-foreground flex items-center gap-1"><Building2 :size="14" /> {{ e.tData.institucion }}</span>
              </div>
              <div class="text-2xl font-black text-primary opacity-50 shrink-0">
                {{ e.tData.anio_obtencion }}
              </div>
            </GlassCard>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import ProyectoCard from '../../components/public/ProyectoCard.vue'
import ExperienciaCard from '../../components/public/ExperienciaCard.vue'
import FilterBar from '../../components/public/FilterBar.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import Badge from '../../components/ui/Badge.vue'
import { Filter, FolderKanban, Briefcase, GraduationCap, ChevronDown, Loader2, Building2 } from 'lucide-vue-next'

import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { usePerfilStore } from '../../stores/perfil'
import { useSectionConfig } from '../../composables/useSectionConfig'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const perfilStore = usePerfilStore()

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const { defaults, fetchConfigs } = useSectionConfig()

const expanded = defaults

const perfil = computed(() => perfilStore.items[0] || null)

function toggle(key) {
  expanded[key] = !expanded[key]
}

const selectedTags = ref([])

const availableTags = computed(() => {
  const fromProyectos = proyectosStore.items.flatMap((p) => p.tags || [])
  const fromExperiencias = experienciasStore.items.flatMap((e) => e.tags_industria || [])
  return [...new Set([...fromProyectos, ...fromExperiencias])].sort()
})

const filteredProyectos = computed(() => {
  const list = selectedTags.value.length
    ? proyectosStore.items.filter((p) =>
        (p.tags || []).some((t) => selectedTags.value.includes(t))
      )
    : proyectosStore.items

  return [...list].sort((a, b) => new Date(b.fecha_proyecto || 0) - new Date(a.fecha_proyecto || 0))
})

const filteredExperiencias = computed(() => {
  const list = selectedTags.value.length
    ? experienciasStore.items.filter((e) =>
        (e.tags_industria || []).some((t) => selectedTags.value.includes(t))
      )
    : experienciasStore.items

  return [...list].sort((a, b) => {
    const endA = a.periodo_fin ? new Date(a.periodo_fin).getTime() : Infinity
    const endB = b.periodo_fin ? new Date(b.periodo_fin).getTime() : Infinity
    if (endA !== endB) return endB - endA
    const startA = a.periodo_inicio ? new Date(a.periodo_inicio).getTime() : 0
    const startB = b.periodo_inicio ? new Date(b.periodo_inicio).getTime() : 0
    return startB - startA
  })
})

const sortedEstudios = computed(() => {
  const items = [...estudiosStore.items].sort((a, b) => b.anio_obtencion - a.anio_obtencion)
  return items.map(item => ({
    item,
    tData: getTranslated(item, locale.value)
  }))
})

function handleToggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(idx, 1)
}

onMounted(async () => {
  await Promise.all([
    fetchConfigs(),
    perfilStore.fetchAll(),
    proyectosStore.fetchAll(),
    experienciasStore.fetchAll(),
    estudiosStore.fetchAll(),
  ])
})
</script>
