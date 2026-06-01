<template>
  <div class="container">
    <AdminLayout>
      <h1 class="page-title">Configuración de Secciones</h1>
      <p class="page-subtitle">Elige qué secciones se muestran por defecto al abrir la página principal.</p>

      <div class="secciones-list">
        <div class="card seccion-item" v-for="s in secciones" :key="s.key">
          <div class="seccion-info">
            <h3>{{ s.label }}</h3>
            <span class="seccion-desc">{{ s.desc }}</span>
          </div>
          <label class="toggle-label">
            <input type="checkbox" :checked="defaults[s.key]" @change="e => updateToggle(s.key, e.target.checked)" />
            <span class="toggle-text">{{ defaults[s.key] ? 'Visible' : 'Oculta' }}</span>
          </label>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useSectionConfig } from '../../composables/useSectionConfig'
import { api } from '../../services/api'
import { onMounted } from 'vue'

const { defaults, fetchConfigs } = useSectionConfig()

onMounted(() => {
  fetchConfigs()
})

const updateToggle = async (key, value) => {
  try {
    await api.updateSeccionConfig(key, {
      seccion: key,
      is_expanded: value
    })
    defaults[key] = value
  } catch (error) {
    console.error('Error updating config:', error)
    alert('Error al guardar la configuración')
  }
}

const secciones = [
  { key: 'tags', label: 'Tags / Filtros', desc: 'Barra de filtros por etiquetas' },
  { key: 'proyectos', label: 'Proyectos', desc: 'Galería de proyectos destacados' },
  { key: 'experiencia', label: 'Experiencia', desc: 'Lista de experiencia laboral' },
  { key: 'estudios', label: 'Estudios & Certificaciones', desc: 'Sección de estudios y certificaciones' },
]
</script>

<style scoped>
.page-subtitle {
  margin-bottom: 2rem;
}

.secciones-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.seccion-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
  padding: 1rem 1.25rem;
}

.seccion-info h3 {
  font-size: 0.9375rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.seccion-desc {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
}

.toggle-label {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  cursor: pointer;
  flex-shrink: 0;
}

.toggle-label input[type="checkbox"] {
  width: 1.125rem;
  height: 1.125rem;
  cursor: pointer;
}

.toggle-text {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-gray-600);
  min-width: 3.5rem;
}
</style>
