<template>
  <AdminLayout>
    <transition name="fade" mode="out-in">
      
      <!-- VISTA DE LISTA -->
      <div v-if="!showForm" key="lista">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Reconocimientos</h1>
            <p class="text-muted-foreground mt-1">Gestiona tus premios, publicaciones y apariciones en medios.</p>
          </div>
          <NeonButton @click="openForm(null)" glow>
            <template #icon-left><Plus :size="18" /></template>
            Nuevo Reconocimiento
          </NeonButton>
        </div>

        <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 class="h-10 w-10 animate-spin mb-4" />
          <p class="text-sm font-medium text-muted-foreground">Cargando reconocimientos...</p>
        </div>
        
        <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
          <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
            <Award :size="32" />
          </div>
          <h3 class="text-xl font-bold text-foreground">No hay reconocimientos</h3>
          <p class="text-muted-foreground mt-2 max-w-sm text-center">Aún no has registrado premios ni publicaciones.</p>
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
              v-for="r in store.items" 
              :key="r.id" 
              hoverEffect 
              class="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 p-5"
            >
              <div class="flex-1 flex flex-col gap-2 min-w-0">
                <div class="flex items-center gap-3">
                  <div class="p-2 rounded-md bg-pink-500/10 text-pink-500 shrink-0">
                    <Award :size="18" />
                  </div>
                  <h3 class="font-bold text-lg text-foreground truncate" :title="r.titulo">{{ r.titulo }}</h3>
                </div>
                <div class="flex items-center gap-2 text-sm text-muted-foreground mt-1">
                  <span class="font-medium text-foreground">{{ r.institucion }}</span>
                  <span v-if="r.fecha">&bull; {{ r.fecha }}</span>
                </div>
                <div class="text-xs text-muted-foreground mt-1">
                  {{ r.tipo }}
                </div>
              </div>

              <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-4 sm:mt-0">
                <NeonButton variant="outline" @click="openForm(r)">
                  <template #icon-left><Edit2 :size="14" /></template>
                  Editar
                </NeonButton>
                <NeonButton variant="destructive" @click="handleDelete(r.id)">
                  <template #icon-left><Trash2 :size="14" /></template>
                </NeonButton>
              </div>
            </GlassCard>
          </TransitionGroup>
        </div>
      </div>

      <!-- VISTA DE FORMULARIO -->
      <div v-else key="formulario">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-foreground">
              {{ editingReconocimiento ? 'Editar Reconocimiento' : 'Crear Reconocimiento' }}
            </h1>
            <p class="text-muted-foreground mt-1">Completa los detalles de tu reconocimiento.</p>
          </div>
          <NeonButton @click="showForm = false" variant="outline">
            <template #icon-left><ArrowLeft :size="18" /></template>
            Volver a Reconocimientos
          </NeonButton>
        </div>

        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
          <GlassCard class="p-6">
            <ReconocimientoForm
              :reconocimiento="editingReconocimiento"
              @save="handleSave"
              @cancel="showForm = false"
            />
          </GlassCard>
        </div>
      </div>

    </transition>
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import ReconocimientoForm from '../../components/admin/ReconocimientoForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Plus, X, Loader2, Award, Calendar, Edit2, Trash2, ArrowLeft } from 'lucide-vue-next'
import { useReconocimientosStore } from '../../stores/reconocimientos'

const store = useReconocimientosStore()
const showForm = ref(false)
const editingReconocimiento = ref(null)

function openForm(item) {
  editingReconocimiento.value = item ? { ...item } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingReconocimiento.value) {
    await store.update(editingReconocimiento.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('¿Estás seguro de que deseas eliminar este registro?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
/* Transiciones suaves para la lista de cards */
.list-enter-active,
.list-leave-active {
  transition: all 0.4s ease;
}
.list-enter-from,
.list-leave-to {
  opacity: 0;
  transform: translateX(-20px);
}

/* Transición de Vistas (Lista <-> Formulario) */
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
</style>
