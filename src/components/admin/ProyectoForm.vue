<template>
  <div class="card form-card">
    <h3 class="form-title">{{ proyecto ? 'Editar Proyecto' : 'Nuevo Proyecto' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group flex-1">
          <label>Título</label>
          <input v-model="form.titulo" type="text" class="form-input" required />
        </div>
        <div class="form-group" style="max-width: 200px">
          <label>Fecha</label>
          <input v-model="form.fecha_proyecto" type="date" class="form-input" required />
        </div>
      </div>
      <div class="form-group">
        <label>Descripción Corta</label>
        <input v-model="form.descripcion_corta" type="text" class="form-input" required />
      </div>
      <div class="form-group">
        <label>Descripción Detallada (Markdown)</label>
        <textarea v-model="form.descripcion_detallada" class="form-textarea" rows="8" required></textarea>
      </div>
      <div class="form-group">
        <label>Stack Tecnológico (separado por comas)</label>
        <input v-model="stackInput" type="text" class="form-input" placeholder="Python, FastAPI, PostgreSQL" @blur="parseStack" />
      </div>
      <div class="form-group">
        <label>Tags (separado por comas)</label>
        <input v-model="tagsInput" type="text" class="form-input" placeholder="Minería, IA, Data" @blur="parseTags" />
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>Link GitHub</label>
          <input v-model="form.link_github" type="url" class="form-input" />
        </div>
        <div class="form-group flex-1">
          <label>Link Demo</label>
          <input v-model="form.link_demo" type="url" class="form-input" />
        </div>
      </div>
      <div class="form-group">
        <label>URL de Imagen (o ID de Google Drive)</label>
        <input v-model="form.image_url" type="text" class="form-input" placeholder="ID de Drive o URL completa" @blur="handleParseImageUrl" />
      </div>
      <div class="form-group">
        <label>Video Demostrativo (URL de YouTube)</label>
        <input v-model="form.youtube_url" type="url" class="form-input" placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      <div class="form-group">
        <label>KPIs (JSON)</label>
        <textarea v-model="kpisText" class="form-textarea" rows="3" placeholder='{"Precisión": "98%", "Latencia": "50ms"}' @blur="parseKpis"></textarea>
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-outline" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'

const props = defineProps({
  proyecto: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const form = ref({
  titulo: '',
  descripcion_corta: '',
  descripcion_detallada: '',
  stack_tecnologico: [],
  fecha_proyecto: '',
  link_github: '',
  link_demo: '',
  image_url: '',
  youtube_url: '',
  kpis: {},
  tags: [],
})

const stackInput = ref('')
const tagsInput = ref('')
const kpisText = ref('')

function handleParseImageUrl() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function parseStack() {
  form.value.stack_tecnologico = stackInput.value.split(',').map((s) => s.trim()).filter(Boolean)
}

function parseTags() {
  form.value.tags = tagsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
}

function parseKpis() {
  try {
    form.value.kpis = kpisText.value ? JSON.parse(kpisText.value) : {}
  } catch {
    form.value.kpis = {}
  }
}

function handleSubmit() {
  handleParseImageUrl()
  parseStack()
  parseTags()
  parseKpis()
  emit('save', { ...form.value })
}

onMounted(() => {
  if (props.proyecto) {
    form.value = { ...props.proyecto }
    form.value.fecha_proyecto = props.proyecto.fecha_proyecto?.slice(0, 10) || ''
    stackInput.value = (props.proyecto.stack_tecnologico || []).join(', ')
    tagsInput.value = (props.proyecto.tags || []).join(', ')
    kpisText.value = JSON.stringify(props.proyecto.kpis || {}, null, 2)
  }
})
</script>

<style scoped>
.form-card {
  padding: 1.5rem;
  margin-bottom: 2rem;
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1.25rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.flex-1 {
  flex: 1;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
