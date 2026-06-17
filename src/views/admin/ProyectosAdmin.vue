<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Proyectos</h1>
          <p class="text-muted-foreground mt-1">Gestiona tu portafolio de proyectos e implementaciones.</p>
        </div>
        <NeonButton @click="openForm(null)" glow>
          <template #icon-left><Plus :size="18" /></template>
          Nuevo Proyecto
        </NeonButton>
      </div>

      <div v-if="showForm" class="mb-8" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <GlassCard>
          <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 class="text-lg font-bold text-foreground">
              {{ editingProyecto ? 'Editar Proyecto' : 'Crear Proyecto' }}
            </h2>
            <button @click="showForm = false" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
          <ProyectoForm
            :proyecto="editingProyecto"
            @save="handleSave"
            @cancel="showForm = false"
          />
        </GlassCard>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 class="h-10 w-10 animate-spin mb-4" />
        <p class="text-sm font-medium text-muted-foreground">Cargando proyectos...</p>
      </div>
      
      <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
        <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
          <FolderKanban :size="32" />
        </div>
        <h3 class="text-xl font-bold text-foreground">No hay proyectos</h3>
        <p class="text-muted-foreground mt-2 max-w-sm text-center">Todavía no has registrado ningún proyecto. ¡Comienza a destacar tu trabajo ahora!</p>
        <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
          Agregar el primero
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
            v-for="p in store.items" 
            :key="p.id" 
            hoverEffect 
            class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5"
          >
            <div class="flex-1 flex flex-col gap-2 min-w-0">
              <div class="flex items-center gap-3">
                <div class="p-2 rounded-md bg-primary/10 text-primary shrink-0">
                  <Briefcase :size="18" />
                </div>
                <h3 class="font-bold text-lg text-foreground truncate" :title="p.titulo">{{ p.titulo }}</h3>
              </div>
              <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                <Calendar :size="14" />
                <span>{{ formatDate(p.fecha_proyecto) }}</span>
              </div>
            </div>

            <div class="flex flex-wrap items-center gap-2 max-w-sm">
              <Badge v-for="tag in p.tags" :key="tag" variant="secondary" class="whitespace-nowrap">
                {{ tag }}
              </Badge>
            </div>

            <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-4 sm:mt-0">
              <NeonButton variant="outline" @click="openForm(p)">
                <template #icon-left><Edit2 :size="14" /></template>
                Editar
              </NeonButton>
              <NeonButton variant="destructive" @click="handleDelete(p.id)">
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
import ProyectoForm from '../../components/admin/ProyectoForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Plus, X, Loader2, FolderKanban, Calendar, Edit2, Trash2, Briefcase } from 'lucide-vue-next'
import { useProyectosStore } from '../../stores/proyectos'

const store = useProyectosStore()
const showForm = ref(false)
const editingProyecto = ref(null)

function formatDate(d) {
  if (!d) return 'Actualidad'
  return new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'short' })
}

function openForm(proyecto) {
  editingProyecto.value = proyecto ? { ...proyecto } : null
  showForm.value = true
  // Scroll to top to see the form
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingProyecto.value) {
    await store.update(editingProyecto.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este proyecto? Esta acción no se puede deshacer.')) {
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
