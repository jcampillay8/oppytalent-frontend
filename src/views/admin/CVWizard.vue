<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">Asistente de Importación de CV</h1>
          <p class="text-muted-foreground mt-1">Revisa y guarda la información extraída por la IA de tu currículum.</p>
        </div>
        <NeonButton @click="goBack" variant="outline">
          <template #icon-left><ArrowLeft :size="18" /></template>
          Volver al Dashboard
        </NeonButton>
      </div>

      <div v-if="!cvWizardStore.hasPendingItems" class="flex flex-col items-center justify-center py-20" v-motion :initial="{ opacity: 0, scale: 0.9 }" :enter="{ opacity: 1, scale: 1 }">
        <div class="h-24 w-24 bg-primary/10 rounded-full flex items-center justify-center text-primary mb-6 border border-primary/20 shadow-lg shadow-primary/5">
          <Sparkles :size="40" />
        </div>
        <h2 class="text-2xl font-bold text-foreground">¡Magia Completada!</h2>
        <p class="text-muted-foreground mt-2 max-w-md text-center mb-8">Has revisado y guardado exitosamente toda la información extraída de tu currículum. Tu portafolio ahora es mucho más robusto.</p>
        <router-link to="/admin">
          <NeonButton glow variant="primary">
            Volver al Panel Principal
          </NeonButton>
        </router-link>
      </div>

      <div v-else class="flex flex-col lg:flex-row gap-6 items-start">
        <!-- Sidebar con la cola de tareas -->
        <GlassCard class="w-full lg:w-80 shrink-0 p-5 sticky top-24">
          <h3 class="font-bold text-lg mb-6 flex items-center justify-between">
            Elementos Pendientes 
            <Badge variant="primary" class="ml-2">{{ cvWizardStore.totalPending }}</Badge>
          </h3>
          
          <div class="space-y-6">
            <div v-if="cvWizardStore.datosContacto">
              <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Datos Personales</h4>
              <button 
                class="w-full text-left px-4 py-3 rounded-lg text-sm transition-all border-l-4"
                :class="currentItemType === 'contacto' ? 'bg-primary/10 border-primary text-foreground font-medium' : 'bg-secondary/50 border-transparent hover:bg-secondary text-muted-foreground'"
                @click="selectItem('contacto', 0)"
              >
                {{ cvWizardStore.datosContacto.nombre || 'Perfil' }}
              </button>
            </div>

            <div v-if="cvWizardStore.pendingProyectos.length > 0">
              <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Proyectos ({{ cvWizardStore.pendingProyectos.length }})</h4>
              <div class="space-y-2">
                <button 
                  v-for="(p, idx) in cvWizardStore.pendingProyectos" 
                  :key="idx"
                  class="w-full text-left px-4 py-3 rounded-lg text-sm transition-all border-l-4 truncate"
                  :class="(currentItemType === 'proyecto' && currentIndex === idx) ? 'bg-primary/10 border-primary text-foreground font-medium' : 'bg-secondary/50 border-transparent hover:bg-secondary text-muted-foreground'"
                  @click="selectItem('proyecto', idx)"
                >
                  {{ p.titulo || 'Proyecto sin título' }}
                </button>
              </div>
            </div>

            <div v-if="cvWizardStore.pendingExperiencias.length > 0">
              <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Experiencia ({{ cvWizardStore.pendingExperiencias.length }})</h4>
              <div class="space-y-2">
                <button 
                  v-for="(e, idx) in cvWizardStore.pendingExperiencias" 
                  :key="idx"
                  class="w-full text-left px-4 py-3 rounded-lg text-sm transition-all border-l-4 truncate"
                  :class="(currentItemType === 'experiencia' && currentIndex === idx) ? 'bg-primary/10 border-primary text-foreground font-medium' : 'bg-secondary/50 border-transparent hover:bg-secondary text-muted-foreground'"
                  @click="selectItem('experiencia', idx)"
                >
                  {{ e.empresa || 'Empresa' }} - {{ e.cargo || 'Cargo' }}
                </button>
              </div>
            </div>

            <div v-if="cvWizardStore.pendingEstudios.length > 0">
              <h4 class="text-xs font-bold text-muted-foreground uppercase tracking-wider mb-3">Estudios ({{ cvWizardStore.pendingEstudios.length }})</h4>
              <div class="space-y-2">
                <button 
                  v-for="(e, idx) in cvWizardStore.pendingEstudios" 
                  :key="idx"
                  class="w-full text-left px-4 py-3 rounded-lg text-sm transition-all border-l-4 truncate"
                  :class="(currentItemType === 'estudio' && currentIndex === idx) ? 'bg-primary/10 border-primary text-foreground font-medium' : 'bg-secondary/50 border-transparent hover:bg-secondary text-muted-foreground'"
                  @click="selectItem('estudio', idx)"
                >
                  {{ e.institucion || 'Institución' }} - {{ e.titulo || 'Título' }}
                </button>
              </div>
            </div>
          </div>
        </GlassCard>

        <!-- Área principal del formulario -->
        <GlassCard class="flex-1 p-6 md:p-8">
          <div v-if="!currentItemType" class="flex flex-col items-center justify-center py-20 text-muted-foreground text-center">
            <MousePointer2 :size="48" class="mb-4 opacity-50" />
            <p class="text-lg">Selecciona un elemento de la lista lateral para revisarlo y guardarlo.</p>
          </div>

          <div v-else v-motion :initial="{ opacity: 0, x: 20 }" :enter="{ opacity: 1, x: 0 }">
            <div class="flex items-center justify-between mb-8 pb-4 border-b border-border/50">
              <h3 class="text-2xl font-bold text-foreground flex items-center gap-2">
                <FileText :size="24" class="text-primary" />
                Revisar {{ getTypeName(currentItemType) }}
              </h3>
              <NeonButton @click="skipCurrentItem" variant="ghost" class="text-muted-foreground hover:text-destructive">
                Descartar Elemento
              </NeonButton>
            </div>
            
            <form @submit.prevent="saveCurrentItem" class="space-y-6">
              <!-- Render dinámico basado en el tipo -->
              <template v-if="currentItemType === 'contacto'">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Ocupación Extraída</label>
                  <input type="text" v-model="formData.ocupacion" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Teléfono</label>
                  <input type="text" v-model="formData.telefono" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="bg-primary/5 border border-primary/20 rounded-lg p-4 text-sm text-primary/80 flex gap-3 mt-6">
                  <Info :size="20" class="shrink-0 mt-0.5" />
                  <p>El nombre de usuario se mantendrá igual. Para el perfil, estos datos te sugerimos añadirlos en tu descripción si lo deseas, o usarlos como base.</p>
                </div>
              </template>

              <template v-if="currentItemType === 'proyecto'">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Título del Proyecto <span class="text-destructive">*</span></label>
                  <input type="text" v-model="formData.titulo" required class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Descripción</label>
                  <textarea v-model="formData.descripcion" rows="5" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"></textarea>
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Tecnologías (separadas por coma)</label>
                  <input type="text" :value="(formData.tecnologias || []).join(', ')" @input="e => formData.tecnologias = e.target.value.split(',').map(t => t.trim())" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </template>

              <template v-if="currentItemType === 'experiencia'">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Empresa <span class="text-destructive">*</span></label>
                  <input type="text" v-model="formData.empresa" required class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Cargo <span class="text-destructive">*</span></label>
                  <input type="text" v-model="formData.cargo" required class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Descripción de Logros</label>
                  <textarea v-model="formData.descripcion" rows="5" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"></textarea>
                </div>
                <div class="grid grid-cols-1 sm:grid-cols-2 gap-4">
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">Periodo Inicio</label>
                    <input type="text" v-model="formData.periodo_inicio" placeholder="Ej: 2021-01" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                  <div class="space-y-2">
                    <label class="text-sm font-medium text-foreground">Periodo Fin</label>
                    <input type="text" v-model="formData.periodo_fin" placeholder="Ej: 2023-12 (vacío si es actual)" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                  </div>
                </div>
              </template>

              <template v-if="currentItemType === 'estudio'">
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Institución <span class="text-destructive">*</span></label>
                  <input type="text" v-model="formData.institucion" required class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Título <span class="text-destructive">*</span></label>
                  <input type="text" v-model="formData.titulo" required class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
                <div class="space-y-2">
                  <label class="text-sm font-medium text-foreground">Año Obtención</label>
                  <input type="number" v-model="formData.anio_obtencion" class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all" />
                </div>
              </template>

              <div class="pt-6 border-t border-border/50 flex justify-end">
                <NeonButton type="submit" glow :disabled="saving">
                  <template #icon-left><Check :size="18" v-if="!saving" /></template>
                  <span v-if="saving" class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Guardando...
                  </span>
                  <span v-else>Guardar y Continuar</span>
                </NeonButton>
              </div>
            </form>
          </div>
        </GlassCard>
      </div>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowLeft, Sparkles, MousePointer2, FileText, Info, Check } from 'lucide-vue-next'
import { useCVWizardStore } from '../../stores/cvWizard'

const router = useRouter()
const cvWizardStore = useCVWizardStore()

const currentItemType = ref(null)
const currentIndex = ref(-1)
const formData = ref({})
const saving = ref(false)

onMounted(() => {
  if (cvWizardStore.hasPendingItems) {
    autoSelectNext()
  }
})

function goBack() {
  router.push('/admin')
}

function getTypeName(type) {
  const map = {
    'contacto': 'Datos Personales',
    'proyecto': 'Proyecto',
    'experiencia': 'Experiencia Laboral',
    'estudio': 'Estudio / Certificación'
  }
  return map[type] || type
}

function selectItem(type, index) {
  currentItemType.value = type
  currentIndex.value = index
  
  if (type === 'contacto') {
    formData.value = { ...cvWizardStore.datosContacto }
  } else if (type === 'proyecto') {
    formData.value = { ...cvWizardStore.pendingProyectos[index] }
  } else if (type === 'experiencia') {
    formData.value = { ...cvWizardStore.pendingExperiencias[index] }
  } else if (type === 'estudio') {
    formData.value = { ...cvWizardStore.pendingEstudios[index] }
  }
}

function autoSelectNext() {
  if (cvWizardStore.datosContacto) {
    selectItem('contacto', 0)
  } else if (cvWizardStore.pendingProyectos.length > 0) {
    selectItem('proyecto', 0)
  } else if (cvWizardStore.pendingExperiencias.length > 0) {
    selectItem('experiencia', 0)
  } else if (cvWizardStore.pendingEstudios.length > 0) {
    selectItem('estudio', 0)
  } else {
    currentItemType.value = null
    currentIndex.value = -1
  }
}

function skipCurrentItem() {
  removeItemFromStore()
  autoSelectNext()
}

function removeItemFromStore() {
  if (currentItemType.value === 'contacto') {
    cvWizardStore.clearContacto()
  } else if (currentItemType.value === 'proyecto') {
    cvWizardStore.removeProyecto(currentIndex.value)
  } else if (currentItemType.value === 'experiencia') {
    cvWizardStore.removeExperiencia(currentIndex.value)
  } else if (currentItemType.value === 'estudio') {
    cvWizardStore.removeEstudio(currentIndex.value)
  }
}

async function saveCurrentItem() {
  saving.value = true
  try {
    if (currentItemType.value === 'proyecto') {
      const dataToSave = {
        titulo: formData.value.titulo,
        descripcion_corta: formData.value.descripcion || 'Extraído del CV',
        descripcion_detallada: formData.value.descripcion || 'Extraído del CV',
        stack_tecnologico: formData.value.tecnologias || [],
        fecha_proyecto: new Date().toISOString().split('T')[0],
        tags: formData.value.tecnologias || []
      }
      await api.createProyecto(dataToSave)
    } 
    else if (currentItemType.value === 'experiencia') {
      let p_inicio = formData.value.periodo_inicio || new Date().toISOString().split('T')[0]
      if (p_inicio.length === 7) p_inicio += '-01'
      
      let p_fin = formData.value.periodo_fin || null
      if (p_fin && p_fin.length === 7) p_fin += '-01'

      const dataToSave = {
        empresa: formData.value.empresa,
        rol: formData.value.cargo,
        descripcion_logros: formData.value.descripcion || 'Experiencia extraída',
        periodo_inicio: p_inicio,
        periodo_fin: p_fin,
        tags_industria: []
      }
      await api.createExperiencia(dataToSave)
    }
    else if (currentItemType.value === 'estudio') {
      const dataToSave = {
        institucion: formData.value.institucion,
        titulo: formData.value.titulo,
        anio_obtencion: parseInt(formData.value.anio_obtencion) || new Date().getFullYear(),
        descripcion_detallada: formData.value.descripcion || 'Estudio extraído'
      }
      await api.createEstudio(dataToSave)
    }
    
    removeItemFromStore()
    autoSelectNext()
    
  } catch (error) {
    alert("Error al guardar: " + error.message)
  } finally {
    saving.value = false
  }
}
</script>
