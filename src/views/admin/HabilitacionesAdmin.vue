<template>
  <AdminLayout>
    <transition name="fade" mode="out-in">
      
      <!-- VISTA DE LISTA -->
      <div v-if="!showForm" key="lista">
        <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
          <div>
            <h1 class="text-3xl font-extrabold tracking-tight text-foreground">{{ $t('admin.views.certifications.title') }}</h1>
            <p class="text-muted-foreground mt-1">{{ $t('admin.views.certifications.description') }}</p>
          </div>
          <template v-if="store.items.length < currentLimit">
            <NeonButton @click="openForm(null)" glow>
              <template #icon-left><Plus :size="18" /></template>
              {{ $t('admin.titles.new_certification') }}
            </NeonButton>
          </template>
          <template v-else>
            <NeonButton @click="showUpgradeModal = true" glow variant="outline" class="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
              <template #icon-left><Lock :size="18" /></template>
              {{ $t('admin.titles.new_certification') }} (¡Gratis!)
            </NeonButton>
          </template>
        </div>

        <div v-if="store.loading" class="flex flex-col items-center justify-center py-20 text-primary">
          <Loader2 class="h-10 w-10 animate-spin mb-4" />
          <p class="text-sm font-medium text-muted-foreground">{{ $t('admin.views.certifications.loading') }}</p>
        </div>
        
        <div v-else-if="!store.items.length" class="flex flex-col items-center justify-center py-20">
          <div class="h-20 w-20 bg-secondary rounded-full flex items-center justify-center text-muted-foreground mb-4 border border-border">
            <ShieldCheck :size="32" />
          </div>
          <h3 class="text-xl font-bold text-foreground">{{ $t('admin.views.certifications.empty_title') }}</h3>
          <p class="text-muted-foreground mt-2 max-w-sm text-center">{{ $t('admin.views.certifications.empty_desc') }}</p>
          <NeonButton variant="outline" class="mt-6" @click="openForm(null)">
            {{ $t('admin.views.certifications.add_first') }}
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
              v-for="(h, index) in store.items" 
              :key="h.id" 
              hoverEffect 
            >
              <div class="flex flex-row items-start gap-4 w-full">
              <!-- Imagen grande al estilo YouTube (si existe) -->
              <div v-if="h.image_url" class="shrink-0 w-24 sm:w-48 h-24 sm:h-32 rounded-lg overflow-hidden border border-border/50">
                <img :src="h.image_url" alt="" class="w-full h-full object-cover" />
              </div>

              <!-- Contenedor derecho para el resto de la info -->
              <div class="flex-1 flex flex-col sm:flex-row justify-between items-start gap-4 min-w-0">
                
                <div class="flex-1 flex flex-col gap-2 min-w-0 w-full">
                  <div class="flex items-center gap-3">
                    <div class="p-2 rounded-md bg-indigo-500/10 text-indigo-500 shrink-0 hidden sm:flex">
                      <ShieldCheck :size="18" />
                    </div>
                    <h3 class="font-bold text-lg text-foreground truncate" :title="h.titulo">{{ h.titulo }}</h3>
                  </div>
                  <div class="text-sm text-muted-foreground mt-1 line-clamp-2">
                    {{ h.descripcion }}
                  </div>
                  <div class="text-xs font-semibold uppercase tracking-wider text-muted-foreground mt-1">
                    {{ h.tipo }}
                  </div>
                </div>

                <div class="flex items-center gap-2 shrink-0 sm:mt-0 w-full sm:w-auto justify-end">
                  <template v-if="index < currentLimit">
                    <NeonButton variant="outline" @click="openForm(h)">
                      <template #icon-left><Edit2 :size="14" /></template>
                      <span class="hidden sm:inline">Editar</span>
                    </NeonButton>
                  </template>
                  <template v-else>
                    <NeonButton variant="outline" @click="showUpgradeModal = true" class="border-emerald-500/50 text-emerald-500 hover:bg-emerald-500/10">
                      <template #icon-left><Lock :size="14" /></template>
                      <span class="hidden sm:inline font-bold">¡Desbloquear Gratis!</span>
                    </NeonButton>
                  </template>
                  <NeonButton variant="destructive" @click="handleDelete(h.id)">
                    <template #icon-left><Trash2 :size="14" /></template>
                  </NeonButton>
                </div>

                </div>
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
              {{ editingHabilitacion ? $t('admin.titles.edit_certification') : $t('admin.titles.new_certification') }}
            </h1>
            <p class="text-muted-foreground mt-1">{{ $t('admin.views.projects.form_desc') }}</p>
          </div>
          <NeonButton @click="showForm = false" variant="outline">
            <template #icon-left><ArrowLeft :size="18" /></template>
            {{ $t('admin.views.certifications.back') }}
          </NeonButton>
        </div>

        <div v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0 }">
          <GlassCard class="p-6">
            <HabilitacionForm
              :habilitacion="editingHabilitacion"
              @save="handleSave"
              @cancel="showForm = false"
            />
          </GlassCard>
        </div>
      </div>

    </transition>
    <UpgradeModal v-model="showUpgradeModal" />
  </AdminLayout>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import HabilitacionForm from '../../components/admin/HabilitacionForm.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import UpgradeModal from '../../components/admin/UpgradeModal.vue'
import { Plus, X, Loader2, ShieldCheck, Edit2, Trash2, ArrowLeft, Lock } from 'lucide-vue-next'
import { useHabilitacionesStore } from '../../stores/habilitaciones'
import { useI18n } from 'vue-i18n'

const store = useHabilitacionesStore()
const { t } = useI18n()
const showForm = ref(false)
const editingHabilitacion = ref(null)
const showUpgradeModal = ref(false)

import { useAuthStore } from '../../stores/auth'
import { computed } from 'vue'
const authStore = useAuthStore()

const limits = {
  BASIC: 2,
  PRO: 4,
  PREMIUM: 6,
  AMBASSADOR: 8,
  PROFESSIONAL: 9999,
  BYOK: 9999
}
const currentLimit = computed(() => {
  const tier = (authStore.user?.freemium_tier || authStore.user?.freemiumTier || 'BASIC')
  return limits[tier.toUpperCase()] || 3
})

function openForm(item) {
  editingHabilitacion.value = item ? { ...item } : null
  showForm.value = true
  window.scrollTo({ top: 0, behavior: 'smooth' })
}

async function handleSave(data) {
  if (editingHabilitacion.value) {
    await store.update(editingHabilitacion.value.id, data)
  } else {
    await store.create(data)
  }
  showForm.value = false
}

async function handleDelete(id) {
  if (confirm(t('admin.views.certifications.delete_confirm'))) {
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
