<template>
  <div class="container">
    <AdminLayout>
      <div class="wizard-header">
        <h1 class="page-title">Asistente de Importación de CV</h1>
        <p class="page-subtitle">Revisa y guarda la información extraída por la IA de tu currículum.</p>
        <button @click="goBack" class="btn btn-outline" style="margin-top: 1rem;">Volver al Dashboard</button>
      </div>

      <div v-if="!cvWizardStore.hasPendingItems" class="empty-state card">
        <div class="empty-icon">🎉</div>
        <h2>¡Todo listo!</h2>
        <p>Has revisado y guardado toda la información extraída de tu CV.</p>
        <router-link to="/admin" class="btn btn-primary" style="margin-top: 1rem;">Volver al Panel Principal</router-link>
      </div>

      <div v-else class="wizard-content">
        <!-- Sidebar con la cola de tareas -->
        <div class="queue-sidebar glass-panel">
          <h3>Elementos Pendientes ({{ cvWizardStore.totalPending }})</h3>
          
          <div v-if="cvWizardStore.datosContacto" class="queue-section">
            <h4>Datos de Contacto (1)</h4>
            <div 
              class="queue-item" 
              :class="{ active: currentItemType === 'contacto' }"
              @click="selectItem('contacto', 0)"
            >
              {{ cvWizardStore.datosContacto.nombre || 'Perfil' }}
            </div>
          </div>

          <div v-if="cvWizardStore.pendingProyectos.length > 0" class="queue-section">
            <h4>Proyectos ({{ cvWizardStore.pendingProyectos.length }})</h4>
            <div 
              v-for="(p, idx) in cvWizardStore.pendingProyectos" 
              :key="idx"
              class="queue-item"
              :class="{ active: currentItemType === 'proyecto' && currentIndex === idx }"
              @click="selectItem('proyecto', idx)"
            >
              {{ p.titulo || 'Proyecto sin título' }}
            </div>
          </div>

          <div v-if="cvWizardStore.pendingExperiencias.length > 0" class="queue-section">
            <h4>Experiencia ({{ cvWizardStore.pendingExperiencias.length }})</h4>
            <div 
              v-for="(e, idx) in cvWizardStore.pendingExperiencias" 
              :key="idx"
              class="queue-item"
              :class="{ active: currentItemType === 'experiencia' && currentIndex === idx }"
              @click="selectItem('experiencia', idx)"
            >
              {{ e.empresa || 'Empresa' }} - {{ e.cargo || 'Cargo' }}
            </div>
          </div>

          <div v-if="cvWizardStore.pendingEstudios.length > 0" class="queue-section">
            <h4>Estudios ({{ cvWizardStore.pendingEstudios.length }})</h4>
            <div 
              v-for="(e, idx) in cvWizardStore.pendingEstudios" 
              :key="idx"
              class="queue-item"
              :class="{ active: currentItemType === 'estudio' && currentIndex === idx }"
              @click="selectItem('estudio', idx)"
            >
              {{ e.institucion || 'Institución' }} - {{ e.titulo || 'Título' }}
            </div>
          </div>
        </div>

        <!-- Área principal del formulario -->
        <div class="form-area card">
          <div v-if="!currentItemType" class="select-prompt">
            <p>👈 Selecciona un elemento de la lista para revisarlo y guardarlo.</p>
          </div>

          <div v-else>
            <div class="item-header">
              <h3>Revisar {{ getTypeName(currentItemType) }}</h3>
              <button @click="skipCurrentItem" class="btn btn-outline btn-sm">Descartar</button>
            </div>
            
            <form @submit.prevent="saveCurrentItem" class="edit-form">
              <!-- Render dinámico basado en el tipo -->
              <template v-if="currentItemType === 'contacto'">
                <div class="form-group">
                  <label>Ocupación Extraída</label>
                  <input type="text" v-model="formData.ocupacion" class="form-input" />
                </div>
                <div class="form-group">
                  <label>Teléfono</label>
                  <input type="text" v-model="formData.telefono" class="form-input" />
                </div>
                <p class="form-help">Nota: El nombre de usuario se mantendrá igual. Para el perfil, estos datos te sugerimos añadirlos en tu descripción si lo deseas, o usarlos como base.</p>
              </template>

              <template v-if="currentItemType === 'proyecto'">
                <div class="form-group">
                  <label>Título del Proyecto</label>
                  <input type="text" v-model="formData.titulo" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea v-model="formData.descripcion" class="form-input" rows="4"></textarea>
                </div>
                <div class="form-group">
                  <label>Tecnologías (separadas por coma)</label>
                  <input type="text" :value="(formData.tecnologias || []).join(', ')" @input="e => formData.tecnologias = e.target.value.split(',').map(t => t.trim())" class="form-input" />
                </div>
              </template>

              <template v-if="currentItemType === 'experiencia'">
                <div class="form-group">
                  <label>Empresa</label>
                  <input type="text" v-model="formData.empresa" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Cargo</label>
                  <input type="text" v-model="formData.cargo" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Descripción</label>
                  <textarea v-model="formData.descripcion" class="form-input" rows="4"></textarea>
                </div>
                <div class="form-row">
                  <div class="form-group">
                    <label>Periodo Inicio</label>
                    <input type="text" v-model="formData.periodo_inicio" class="form-input" placeholder="Ej: 2021-01" />
                  </div>
                  <div class="form-group">
                    <label>Periodo Fin</label>
                    <input type="text" v-model="formData.periodo_fin" class="form-input" placeholder="Ej: 2023-12 (deja vacío si es actual)" />
                  </div>
                </div>
              </template>

              <template v-if="currentItemType === 'estudio'">
                <div class="form-group">
                  <label>Institución</label>
                  <input type="text" v-model="formData.institucion" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Título</label>
                  <input type="text" v-model="formData.titulo" class="form-input" required />
                </div>
                <div class="form-group">
                  <label>Año Obtención</label>
                  <input type="number" v-model="formData.anio_obtencion" class="form-input" />
                </div>
              </template>

              <div class="form-actions">
                <button type="submit" class="btn btn-primary" :disabled="saving">
                  <span v-if="saving">Guardando...</span>
                  <span v-else>Guardar y Continuar</span>
                </button>
              </div>
            </form>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useCVWizardStore } from '../../stores/cvWizard'

const router = useRouter()
const cvWizardStore = useCVWizardStore()

const currentItemType = ref(null)
const currentIndex = ref(-1)
const formData = ref({})
const saving = ref(false)

onMounted(() => {
  if (!cvWizardStore.hasPendingItems) {
    // Si no hay nada, no tiene sentido estar acá, a menos que ya terminó
  } else {
    // Auto seleccionar el primer elemento disponible
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
    // Si es contacto, podríamos actualizar el perfil de usuario pero por simplicidad de este demo lo saltamos o descartamos.
    
    // Si todo salió bien
    removeItemFromStore()
    autoSelectNext()
    
  } catch (error) {
    alert("Error al guardar: " + error.message)
  } finally {
    saving.value = false
  }
}
</script>

<style scoped>
.wizard-content {
  display: flex;
  gap: 2rem;
  margin-top: 2rem;
  align-items: flex-start;
}

.queue-sidebar {
  width: 300px;
  padding: 1.5rem;
  border-radius: var(--radius-lg);
  border: 1px solid var(--color-border);
}

.queue-sidebar h3 {
  margin-bottom: 1rem;
  font-size: 1.1rem;
  color: var(--color-primary);
}

.queue-section {
  margin-bottom: 1.5rem;
}

.queue-section h4 {
  font-size: 0.9rem;
  color: var(--color-gray-400);
  margin-bottom: 0.5rem;
  text-transform: uppercase;
  letter-spacing: 0.05em;
}

.queue-item {
  padding: 0.75rem 1rem;
  background: rgba(255, 255, 255, 0.05);
  border-radius: 8px;
  margin-bottom: 0.5rem;
  cursor: pointer;
  transition: all 0.2s;
  font-size: 0.9rem;
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
  border-left: 3px solid transparent;
}

.queue-item:hover {
  background: rgba(255, 255, 255, 0.1);
}

.queue-item.active {
  background: rgba(59, 130, 246, 0.15);
  border-left-color: var(--color-primary);
  color: #fff;
}

.form-area {
  flex: 1;
  padding: 2rem;
}

.select-prompt {
  text-align: center;
  padding: 4rem 2rem;
  color: var(--color-gray-500);
  font-size: 1.1rem;
}

.item-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-border);
}

.item-header h3 {
  font-size: 1.25rem;
  color: var(--color-text);
}

.empty-state {
  text-align: center;
  padding: 4rem 2rem;
  margin-top: 2rem;
}

.empty-icon {
  font-size: 4rem;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1.5rem;
}

.form-input {
  width: 100%;
  padding: 0.75rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-sm);
  color: var(--color-text);
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.form-row {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 1rem;
}

.form-help {
  font-size: 0.8rem;
  color: var(--color-gray-500);
  margin-top: -0.5rem;
  margin-bottom: 1.5rem;
}

.form-actions {
  display: flex;
  justify-content: flex-end;
  margin-top: 2rem;
}

@media (max-width: 768px) {
  .wizard-content {
    flex-direction: column;
  }
  .queue-sidebar {
    width: 100%;
  }
}
</style>
