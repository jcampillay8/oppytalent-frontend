<template>
  <div class="container py-8 max-w-5xl mx-auto">
    <!-- Hero Section (Siempre visible) -->
    <section class="text-center py-12 px-4 relative mb-12" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
      <div class="absolute inset-0 bg-primary/5 rounded-[3rem] -z-10 blur-3xl opacity-50"></div>
      
      <div class="relative w-32 h-32 mx-auto mb-6 rounded-full border-4 border-primary/20 overflow-hidden shadow-xl" v-if="perfil?.avatar_url">
        <img :src="perfil.avatar_url" class="w-full h-full object-cover" alt="Profile avatar" />
      </div>

      <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mb-4 flex items-center justify-center flex-wrap gap-2">
        {{ perfil?.nombre_completo || 'Usuario de OppyTalent' }}
        <DegreeBadge v-if="connectionDegree" :degree="connectionDegree" />
      </h1>
      <p class="text-lg md:text-xl text-primary font-medium mb-6">
        {{ perfil?.ocupacion || 'Profesional' }}
      </p>

      <div class="flex items-center justify-center gap-4 mb-8" v-if="targetUser && authStore.user?.id !== targetUser.id">
        <ConnectionButton :userId="targetUser.id" :initialStatus="connectionDegree ? 'ACCEPTED' : null" />
      </div>
      
      <h2 class="text-4xl md:text-5xl font-extrabold tracking-tight text-foreground mt-4 flex items-center justify-center gap-3 mb-4">
        <AppWindow :size="40" class="text-primary hidden sm:block" />
        {{ $t('admin_portfolio_view.portfolio_view_1') }}
      </h2>
    </section>

    <!-- Layout Orquestador (Dinámico) -->
    <div v-if="isLoading" class="flex justify-center py-20">
      <Loader2 class="animate-spin text-primary" :size="48" />
    </div>
    
    <div v-else v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 200 } }">
      <component 
        :is="themeStore.currentLayout === 'bento' ? PortfolioBentoLayout : PortfolioTabsLayout" 
        :proyectos="sortedProyectos"
        :experiencias="sortedExperiencias"
        :estudios="sortedEstudios"
        :reconocimientos="reconocimientosStore.items"
        :habilitaciones="habilitacionesStore.items"
        :config="defaults"
      />
    </div>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { computed, onMounted } from 'vue'
import { Loader2, AppWindow } from 'lucide-vue-next'
import PortfolioTabsLayout from '../../components/public/PortfolioTabsLayout.vue'
import PortfolioBentoLayout from '../../components/public/PortfolioBentoLayout.vue'
import DegreeBadge from '../../components/ui/DegreeBadge.vue'
import ConnectionButton from '../../components/ui/ConnectionButton.vue'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { ref } from 'vue'

import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { useReconocimientosStore } from '../../stores/reconocimientos'
import { useHabilitacionesStore } from '../../stores/habilitaciones'
import { usePerfilStore } from '../../stores/perfil'
import { useThemeStore } from '../../stores/useThemeStore'
import { useSectionConfig } from '../../composables/useSectionConfig'

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const reconocimientosStore = useReconocimientosStore()
const habilitacionesStore = useHabilitacionesStore()
const perfilStore = usePerfilStore()
const themeStore = useThemeStore()
const authStore = useAuthStore()

const targetUser = ref(null)
const connectionDegree = ref(null)

const { defaults, fetchConfigs } = useSectionConfig()

const perfil = computed(() => perfilStore.items[0] || null)

const isLoading = computed(() => {
  return proyectosStore.loading || 
         experienciasStore.loading || 
         estudiosStore.loading ||
         reconocimientosStore.loading ||
         habilitacionesStore.loading
})

const sortedProyectos = computed(() => {
  return [...proyectosStore.items].sort((a, b) => new Date(b.fecha_proyecto || 0) - new Date(a.fecha_proyecto || 0))
})

const sortedExperiencias = computed(() => {
  return [...experienciasStore.items].sort((a, b) => {
    const endA = a.periodo_fin ? new Date(a.periodo_fin).getTime() : Infinity
    const endB = b.periodo_fin ? new Date(b.periodo_fin).getTime() : Infinity
    if (endA !== endB) return endB - endA
    const startA = a.periodo_inicio ? new Date(a.periodo_inicio).getTime() : 0
    const startB = b.periodo_inicio ? new Date(b.periodo_inicio).getTime() : 0
    return startB - startA
  })
})

const sortedEstudios = computed(() => {
  return [...estudiosStore.items].sort((a, b) => b.anio_obtencion - a.anio_obtencion)
})

onMounted(async () => {
  const currentPath = window.location.pathname
  if (currentPath.includes('/portfolio/') || currentPath === '/portafolio') {
    // Determine user to load
    const pathMatch = currentPath.match(/\/portfolio\/([^/]+)/)
    const username = pathMatch ? pathMatch[1] : (localStorage.getItem('currentPortfolioUser') || 'jcampillayworks')
    
    // Configs
    await fetchConfigs(username)
    // Layout
    await themeStore.fetchThemeForUser(username)
    
    // Fetch Target User & Degree
    try {
      targetUser.value = await api.getUserByUsername(username)
      if (authStore.user && targetUser.value.id !== authStore.user.id) {
        const res = await api.getConnectionDegree(targetUser.value.id)
        connectionDegree.value = res.degree
      }
    } catch(e) {}
    
    // Data
    Promise.all([
      perfilStore.fetchAll(username),
      proyectosStore.fetchAll(username),
      experienciasStore.fetchAll(username),
      estudiosStore.fetchAll(username),
      reconocimientosStore.fetchAll(username),
      habilitacionesStore.fetchAll(username)
    ])
  }
})
</script>
