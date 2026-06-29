<template>
  <Teleport to="body">
    <transition name="fade">
      <div v-if="activeForm" class="fixed inset-0 z-[100] flex items-center justify-center bg-background/80 backdrop-blur-sm p-4 overflow-y-auto" @click.self="closeModal">
        <div class="bg-card w-full max-w-4xl rounded-2xl shadow-2xl border border-border flex flex-col max-h-[90vh] my-auto overflow-hidden animate-in zoom-in-95 duration-200">
          
          <!-- Header -->
          <div class="px-6 py-4 border-b border-border flex justify-between items-center bg-secondary/30 sticky top-0 z-10">
            <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
              <Edit2 v-if="editingItem" :size="20" class="text-primary" />
              <Plus v-else :size="20" class="text-primary" />
              {{ editingItem ? t(`admin.titles.edit_${activeForm}`) : t(`admin.titles.new_${activeForm}`) }}
            </h2>
            <button @click="closeModal" class="p-2 hover:bg-secondary rounded-full text-muted-foreground hover:text-foreground transition-colors">
              <X :size="20" />
            </button>
          </div>

          <!-- Body -->
          <div class="p-6 overflow-y-auto">
            <component 
              :is="formComponent" 
              :[formPropName]="editingItem" 
              @save="handleSave" 
              @cancel="closeModal" 
            />
          </div>
          
        </div>
      </div>
    </transition>
  </Teleport>

  <UpgradeModal v-model="showUpgradeModal" />
</template>

<script setup>
import { ref, computed, defineAsyncComponent } from 'vue'
import { Edit2, Plus, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import UpgradeModal from '../admin/UpgradeModal.vue'

import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { useReconocimientosStore } from '../../stores/reconocimientos'
import { useHabilitacionesStore } from '../../stores/habilitaciones'
import { usePerfilStore } from '../../stores/perfil'

const ProyectoForm = defineAsyncComponent(() => import('../admin/ProyectoForm.vue'))
const ExperienciaForm = defineAsyncComponent(() => import('../admin/ExperienciaForm.vue'))
const EstudioForm = defineAsyncComponent(() => import('../admin/EstudioForm.vue'))
const ReconocimientoForm = defineAsyncComponent(() => import('../admin/ReconocimientoForm.vue'))
const HabilitacionForm = defineAsyncComponent(() => import('../admin/HabilitacionForm.vue'))
const PerfilForm = defineAsyncComponent(() => import('../admin/PerfilForm.vue'))

const props = defineProps({
  activeForm: String, // 'project', 'experience', 'education', 'recognition', 'skill', 'profile'
  editingItem: Object
})

const emit = defineEmits(['close'])

const { t } = useI18n()
const showUpgradeModal = ref(false)

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const reconocimientosStore = useReconocimientosStore()
const habilitacionesStore = useHabilitacionesStore()
const perfilStore = usePerfilStore()

const storeMap = {
  'project': proyectosStore,
  'experience': experienciasStore,
  'education': estudiosStore,
  'recognition': reconocimientosStore,
  'skill': habilitacionesStore,
  'profile': perfilStore
}

const componentMap = {
  'project': ProyectoForm,
  'experience': ExperienciaForm,
  'education': EstudioForm,
  'recognition': ReconocimientoForm,
  'skill': HabilitacionForm,
  'profile': PerfilForm
}

const propMap = {
  'project': 'proyecto',
  'experience': 'experiencia',
  'education': 'estudio',
  'recognition': 'reconocimiento',
  'skill': 'habilitacion',
  'profile': 'perfil'
}

const formComponent = computed(() => componentMap[props.activeForm])
const formPropName = computed(() => propMap[props.activeForm])
const currentStore = computed(() => storeMap[props.activeForm])

function closeModal() {
  emit('close')
}

async function handleSave(data) {
  if (props.editingItem) {
    await currentStore.value.update(props.editingItem.id, data)
  } else {
    await currentStore.value.create(data)
  }
  closeModal()
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
