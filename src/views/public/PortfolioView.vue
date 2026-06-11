<template>
  <div class="container">
    <section class="hero">
      <h1 class="hero-title">Jaime Gabriel Campillay Rojas</h1>
      <p class="hero-subtitle">Ingeniero Civil Industrial &middot; Magíster &middot; Senior Software/Data Engineer</p>
      <p class="hero-desc">
        Arquitecto de soluciones escalables. Especializado en sistemas distribuidos, pipelines de datos y 
        arquitecturas cloud-native con enfoque en minería, banca e IA.
      </p>
    </section>

    <section class="section" :class="{ collapsed: !expanded.tags }">
      <h2 class="section-title" @click="toggle('tags')">
        Tags
        <span class="chevron">{{ expanded.tags ? '▾' : '▸' }}</span>
      </h2>
      <div v-if="expanded.tags">
        <FilterBar
          :all-tags="availableTags"
          :selected-tags="selectedTags"
          @toggle="handleToggleTag"
          @clear="selectedTags = []"
        />
      </div>
    </section>

    <section class="section" :class="{ collapsed: !expanded.proyectos }">
      <h2 class="section-title" @click="toggle('proyectos')">
        <span>{{ $t('portfolio.proyectos') }} <span class="count">{{ filteredProyectos.length }}</span></span>
        <span class="chevron">{{ expanded.proyectos ? '▾' : '▸' }}</span>
      </h2>
      <div v-if="expanded.proyectos">
        <div v-if="proyectosStore.loading" class="loading"><div class="spinner"></div></div>
        <div v-else-if="!filteredProyectos.length" class="empty-state">
          No se encontraron proyectos con los filtros seleccionados.
        </div>
        <div v-else class="grid">
          <ProyectoCard v-for="p in filteredProyectos" :key="p.id" :proyecto="p" />
        </div>
      </div>
    </section>

    <section class="section" :class="{ collapsed: !expanded.experiencia }">
      <h2 class="section-title" @click="toggle('experiencia')">
        <span>{{ $t('portfolio.experiencia') }} <span class="count">{{ filteredExperiencias.length }}</span></span>
        <span class="chevron">{{ expanded.experiencia ? '▾' : '▸' }}</span>
      </h2>
      <div v-if="expanded.experiencia">
        <div v-if="experienciasStore.loading" class="loading"><div class="spinner"></div></div>
        <div v-else-if="!filteredExperiencias.length" class="empty-state">
          No se encontraron experiencias con los filtros seleccionados.
        </div>
        <div v-else class="grid">
          <ExperienciaCard v-for="e in filteredExperiencias" :key="e.id" :experiencia="e" />
        </div>
      </div>
    </section>

    <section class="section" :class="{ collapsed: !expanded.estudios }">
      <h2 class="section-title" @click="toggle('estudios')">
        <span>{{ $t('portfolio.estudios') }} <span class="count">{{ estudiosStore.items.length }}</span></span>
        <span class="chevron">{{ expanded.estudios ? '▾' : '▸' }}</span>
      </h2>
      <div v-if="expanded.estudios">
        <div v-if="estudiosStore.loading" class="loading"><div class="spinner"></div></div>
        <div v-else-if="!estudiosStore.items.length" class="empty-state">Sin estudios registrados.</div>
        <div v-else class="estudios-list">
          <router-link v-for="e in sortedEstudios" :key="e.id" :to="`/estudios/${e.id}`" class="card estudio-item">
            <img v-if="e.image_url" :src="e.image_url" :alt="e.institucion" class="estudio-img" />
            <div class="estudio-year">{{ e.anio_obtencion }}</div>
            <div class="estudio-info">
              <h3>{{ e.titulo }}</h3>
              <span class="estudio-institucion">{{ e.institucion }}</span>
            </div>
          </router-link>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, reactive, computed, onMounted } from 'vue'
import ProyectoCard from '../../components/public/ProyectoCard.vue'
import ExperienciaCard from '../../components/public/ExperienciaCard.vue'
import FilterBar from '../../components/public/FilterBar.vue'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { useSectionConfig } from '../../composables/useSectionConfig'

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()

const { defaults, fetchConfigs } = useSectionConfig()

const expanded = defaults

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

const sortedEstudios = computed(() =>
  [...estudiosStore.items].sort((a, b) => b.anio_obtencion - a.anio_obtencion)
)

function handleToggleTag(tag) {
  const idx = selectedTags.value.indexOf(tag)
  if (idx === -1) selectedTags.value.push(tag)
  else selectedTags.value.splice(idx, 1)
}

onMounted(async () => {
  await Promise.all([
    fetchConfigs(),
    proyectosStore.fetchAll(),
    experienciasStore.fetchAll(),
    estudiosStore.fetchAll(),
  ])
})
</script>

<style scoped>
.hero {
  text-align: center;
  padding: 3rem 1rem 2rem;
}

.hero-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.5rem;
}

.hero-subtitle {
  font-size: 1rem;
  color: var(--color-accent);
  font-weight: 500;
  margin-bottom: 1rem;
}

.hero-desc {
  font-size: 0.9375rem;
  color: var(--color-gray-500);
  max-width: 600px;
  margin: 0 auto;
  line-height: 1.6;
}

.section {
  margin-bottom: 3rem;
}

.section-title {
  cursor: pointer;
  user-select: none;
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-gray-200);
  margin-bottom: 1rem;
}

.section-title:hover {
  color: var(--color-accent);
}

.count {
  font-weight: 400;
  color: var(--color-gray-400);
  margin-left: 0.375rem;
}

.chevron {
  font-size: 0.875rem;
  transition: transform 0.2s;
}

.section.collapsed .section-title {
  margin-bottom: 0;
  border-bottom-color: transparent;
}

.section.collapsed {
  margin-bottom: 1rem;
}

.grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(340px, 1fr));
  gap: 1.25rem;
}

.estudios-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.estudio-item {
  display: flex;
  align-items: center;
  gap: 1.25rem;
  padding: 1.25rem;
  text-decoration: none;
  color: inherit;
}

.estudio-item:hover {
  text-decoration: none;
  color: inherit;
}

.estudio-img {
  width: 56px;
  height: 56px;
  border-radius: var(--radius-sm);
  object-fit: cover;
}

.estudio-year {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 60px;
}

.estudio-info h3 {
  font-size: 1rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.estudio-institucion {
  font-size: 0.875rem;
  color: var(--color-gray-500);
}
</style>
