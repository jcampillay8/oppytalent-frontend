<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Frases Célebres</h1>
          <p class="text-muted-foreground mt-1">Citas y pensamientos que definen tu filosofía.</p>
        </div>
        <NeonButton @click="openForm(null)" glow variant="primary">
          <template #icon-left><Plus :size="18" /></template>
          Nueva Frase
        </NeonButton>
      </div>

      <div v-if="showForm" class="mb-8" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <GlassCard>
          <div class="flex items-center justify-between mb-4 border-b border-border/50 pb-4">
            <h2 class="text-lg font-bold text-foreground">
              {{ editingFrase ? 'Editar Frase' : 'Registrar Frase' }}
            </h2>
            <button @click="showForm = false" class="p-2 text-muted-foreground hover:text-destructive transition-colors">
              <X :size="20" />
            </button>
          </div>
          <FraseForm
            :frase="editingFrase"
            @save="handleSave"
            @cancel="showForm = false"
          />
        </GlassCard>
      </div>

      <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
        <Loader2 class="h-10 w-10 animate-spin mb-4" />
        <p class="text-sm font-medium text-muted-foreground">Cargando frases...</p>
      </div>
      
      <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
        <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
          <MessageSquare :size="32" />
        </div>
        <h3 class="text-xl font-bold text-foreground">No hay frases registradas</h3>
        <p class="text-muted-foreground mt-2 max-w-sm text-center">Aún no has agregado tus frases inspiradoras. ¡Compártelas con el mundo!</p>
        <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
          Agregar la primera
        </NeonButton>
      </div>

      <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <TransitionGroup 
          enter-active-class="transition-all duration-300 ease-out"
          enter-from-class="opacity-0 translate-y-4"
          enter-to-class="opacity-100 translate-y-0"
          leave-active-class="transition-all duration-200 ease-in absolute w-full md:w-[calc(50%-0.5rem)]"
          leave-from-class="opacity-100"
          leave-to-class="opacity-0 scale-95"
          move-class="transition-transform duration-300"
        >
          <GlassCard 
            v-for="f in store.items" 
            :key="f.id" 
            hoverEffect 
            class="flex flex-col justify-between h-full p-5"
          >
            <div class="mb-4">
              <Quote class="text-primary/20 mb-2" :size="32" />
              <p class="text-foreground font-medium italic leading-relaxed text-lg text-balance">
                "{{ truncate(f.texto, 150) }}"
              </p>
              <div class="mt-3 font-semibold text-muted-foreground text-sm flex items-center gap-2">
                <div class="h-[1px] w-4 bg-primary/50"></div>
                {{ f.autor }}
              </div>
            </div>

            <div class="flex items-center gap-2 justify-end mt-4 pt-4 border-t border-border/50">
              <NeonButton variant="outline" @click="openForm(f)">
                <template #icon-left><Edit2 :size="14" /></template>
                Editar
              </NeonButton>
              <NeonButton variant="destructive" @click="handleDelete(f.id)">
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
import FraseForm from '../../components/admin/FraseForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { Plus, X, Loader2, MessageSquare, Quote, Edit2, Trash2 } from 'lucide-vue-next'
import { useFrasesStore } from '../../stores/frases'

const store = useFrasesStore()
const showForm = ref(false)
const editingFrase = ref(null)

function truncate(text, max) {
  if (!text) return ''
  return text.length > max ? text.slice(0, max) + '...' : text
}

function openForm(frase) {
  editingFrase.value = frase ? { ...frase } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingFrase.value) {
    await store.update(editingFrase.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm('¿Estás seguro de que deseas eliminar esta frase?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>
