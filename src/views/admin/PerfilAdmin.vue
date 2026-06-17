<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Sobre Mí</h1>
          <p class="text-muted-foreground mt-1">Administra la información principal de tu portafolio.</p>
        </div>
        <NeonButton v-if="!store.items.length" @click="openForm(null)" glow variant="primary">
          <template #icon-left><Plus :size="18" /></template>
          Crear Perfil Base
        </NeonButton>
      </div>

      <div v-if="showForm" class="mb-8" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <GlassCard>
          <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 class="text-lg font-bold text-foreground">
              {{ editingPerfil ? 'Editar Perfil' : 'Crear Perfil' }}
            </h2>
            <button @click="showForm = false" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
          <PerfilForm
            :perfil="editingPerfil"
            @save="handleSave"
            @cancel="showForm = false"
          />
        </GlassCard>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 class="h-10 w-10 animate-spin mb-4" />
        <p class="text-sm font-medium text-muted-foreground">Cargando perfil...</p>
      </div>
      
      <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
        <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
          <UserCircle :size="32" />
        </div>
        <h3 class="text-xl font-bold text-foreground">Aún no tienes un perfil base</h3>
        <p class="text-muted-foreground mt-2 max-w-sm text-center">Completa tu información personal, foto y extracto profesional para que los visitantes te conozcan.</p>
        <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
          Comenzar
        </NeonButton>
      </div>

      <div v-else class="grid grid-cols-1 gap-4">
        <GlassCard 
          v-for="p in store.items" 
          :key="p.id" 
          hoverEffect 
          class="flex flex-col sm:flex-row items-start gap-6 p-6"
        >
          <!-- Avatares / Imágenes -->
          <div class="flex items-center gap-4 shrink-0 relative">
            <div class="relative w-16 h-16 rounded-full border-2 border-primary/20 bg-secondary overflow-hidden shrink-0 shadow-inner">
              <img v-if="p.avatar_url" :src="p.avatar_url" class="w-full h-full object-cover" />
              <User v-else :size="32" class="text-muted-foreground absolute inset-0 m-auto" />
            </div>
            
            <div class="relative w-24 h-16 rounded-lg border border-border bg-secondary overflow-hidden shrink-0 shadow-sm hidden sm:block">
              <img v-if="p.image_url" :src="p.image_url" class="w-full h-full object-cover" />
              <ImageIcon v-else :size="24" class="text-muted-foreground absolute inset-0 m-auto" />
            </div>
          </div>

          <!-- Información -->
          <div class="flex-1 min-w-0">
            <h3 class="font-bold text-lg text-foreground mb-2 flex items-center gap-2">
              Extracto <Badge variant="secondary" class="text-[10px]">Actualizado: {{ formatDate(p.updated_at) }}</Badge>
            </h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              {{ truncate(p.descripcion, 200) }}
            </p>
          </div>

          <!-- Acciones -->
          <div class="flex items-center gap-2 shrink-0 w-full sm:w-auto justify-end mt-2 sm:mt-0">
            <NeonButton variant="outline" @click="openForm(p)">
              <template #icon-left><Edit2 :size="14" /></template>
              Editar
            </NeonButton>
            <NeonButton variant="destructive" @click="handleDelete(p.id)">
              <template #icon-left><Trash2 :size="14" /></template>
            </NeonButton>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import PerfilForm from '../../components/admin/PerfilForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Plus, X, Loader2, UserCircle, User, Image as ImageIcon, Edit2, Trash2 } from 'lucide-vue-next'
import { usePerfilStore } from '../../stores/perfil'

const store = usePerfilStore()
const showForm = ref(false)
const editingPerfil = ref(null)

function formatDate(d) {
  if (!d) return ''
  return new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'short', day: 'numeric' })
}

function truncate(text, max) {
  return text?.length > max ? text.slice(0, max) + '...' : text
}

function openForm(perfil) {
  editingPerfil.value = perfil ? { ...perfil } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingPerfil.value) {
    await store.update(editingPerfil.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('¿Estás seguro de que deseas eliminar tu perfil base?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>
