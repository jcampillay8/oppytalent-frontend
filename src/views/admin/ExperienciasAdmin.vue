<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Experiencia Laboral</h1>
          <p class="text-muted-foreground mt-1">Registra tu trayectoria y roles profesionales.</p>
        </div>
        <NeonButton @click="openForm(null)" glow variant="primary">
          <template #icon-left><Plus :size="18" /></template>
          Nueva Experiencia
        </NeonButton>
      </div>

      <div v-if="showForm" class="mb-8" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <GlassCard>
          <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 class="text-lg font-bold text-foreground">
              {{ editingExperiencia ? 'Editar Experiencia' : 'Registrar Experiencia' }}
            </h2>
            <button @click="showForm = false" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
          <ExperienciaForm
            :experiencia="editingExperiencia"
            @save="handleSave"
            @cancel="showForm = false"
          />
        </GlassCard>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 class="h-10 w-10 animate-spin mb-4" />
        <p class="text-sm font-medium text-muted-foreground">Cargando experiencias...</p>
      </div>
      
      <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
        <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
          <Briefcase :size="32" />
        </div>
        <h3 class="text-xl font-bold text-foreground">No hay experiencia registrada</h3>
        <p class="text-muted-foreground mt-2 max-w-sm text-center">Aún no has agregado tus roles profesionales. ¡Empieza a construir tu historia!</p>
        <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
          Agregar la primera
        </NeonButton>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <TransitionGroup 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in absolute w-full"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 scale-95"
          move-class="transition-transform duration-300"
        >
          <GlassCard 
            v-for="e in store.items" 
            :key="e.id" 
            hoverEffect 
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5"
          >
            <div class="flex-1 flex flex-col gap-2 min-w-0">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-md bg-emerald-500/10 text-emerald-500 shrink-0">
                  <Briefcase :size="18" />
                </div>
                <h3 class="font-bold text-lg text-foreground truncate" :title="e.rol">{{ e.rol }}</h3>
              </div>
              <div class="flex items-center gap-3 text-sm text-muted-foreground mt-1 flex-wrap">
                <span class="flex items-center gap-1 font-medium"><Building2 :size="14" /> {{ e.empresa }}</span>
                <span class="hidden sm:inline">&middot;</span>
                <span class="flex items-center gap-1"><Calendar :size="14" /> {{ formatPeriod(e.periodo_inicio, e.periodo_fin) }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 max-w-sm">
              <Badge v-for="tag in e.tags_industria" :key="tag" variant="secondary" class="whitespace-nowrap">
                {{ tag }}
              </Badge>
            </div>

            <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-4 sm:mt-0">
              <NeonButton variant="outline" @click="openForm(e)">
                <template #icon-left><Edit2 :size="14" /></template>
                Editar
              </NeonButton>
              <NeonButton variant="destructive" @click="handleDelete(e.id)">
                <template #icon-left><Trash2 :size="14" /></template>
              </NeonButton>
            </div>
          </GlassCard>
        </TransitionGroup>
      </div>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import ExperienciaForm from '../../components/admin/ExperienciaForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Plus, X, Loader2, Briefcase, Calendar, Edit2, Trash2, Building2 } from 'lucide-vue-next'
import { useExperienciasStore } from '../../stores/experiencias'

const store = useExperienciasStore()
const showForm = ref(false)
const editingExperiencia = ref(null)

function formatPeriod(start, end) {
  const fmt = (d) => new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'short' })
  return `${fmt(start)} - ${end ? fmt(end) : 'Presente'}`
}

function openForm(exp) {
  editingExperiencia.value = exp ? { ...exp } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingExperiencia.value) {
    await store.update(editingExperiencia.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta experiencia?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
/* Transiciones suaves para la lista */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}
</style>
