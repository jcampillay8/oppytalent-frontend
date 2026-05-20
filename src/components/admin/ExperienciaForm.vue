<template>
  <div class="card form-card">
    <h3 class="form-title">{{ experiencia ? 'Editar Experiencia' : 'Nueva Experiencia' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-row">
        <div class="form-group flex-1">
          <label>Empresa</label>
          <input v-model="form.empresa" type="text" class="form-input" required />
        </div>
        <div class="form-group flex-1">
          <label>Rol</label>
          <input v-model="form.rol" type="text" class="form-input" required />
        </div>
      </div>
      <div class="form-row">
        <div class="form-group flex-1">
          <label>Periodo Inicio</label>
          <input v-model="form.periodo_inicio" type="date" class="form-input" required />
        </div>
        <div class="form-group flex-1">
          <label>Periodo Fin</label>
          <input v-model="form.periodo_fin" type="date" class="form-input" :disabled="esActual" />
          <label class="checkbox-label">
            <input type="checkbox" v-model="esActual" />
            Actualmente trabajando aquí
          </label>
        </div>
      </div>
      <div class="form-group">
        <label>Descripción de Logros (Markdown)</label>
        <textarea v-model="form.descripcion_logros" class="form-textarea" rows="6" required></textarea>
      </div>
      <div class="form-group">
        <label>URL de Imagen (o ID de Google Drive)</label>
        <input v-model="form.image_url" type="text" class="form-input" placeholder="ID de Drive o URL completa" @blur="parseImageUrlHandler" />
      </div>
      <div class="form-group">
        <label>Enlace Externo / Proyecto Relacionado</label>
        <input v-model="form.link" type="url" class="form-input" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label>Enlace Demo (Opcional)</label>
        <input v-model="form.link_demo" type="url" class="form-input" placeholder="https://..." />
      </div>
      <div class="form-group">
        <label>Tags de Industria (separado por comas)</label>
        <input v-model="tagsInput" type="text" class="form-input" placeholder="Minería, Banca, IA" @blur="parseTags" />
      </div>
      <div class="form-actions">
        <button type="submit" class="btn btn-primary">Guardar</button>
        <button type="button" class="btn btn-outline" @click="$emit('cancel')">Cancelar</button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch, onMounted } from 'vue'
import { parseImageUrl } from '../../services/utils.js'

const props = defineProps({
  experiencia: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const form = ref({
  empresa: '',
  rol: '',
  periodo_inicio: '',
  periodo_fin: '',
  descripcion_logros: '',
  link: '',
  link_demo: '',
  image_url: '',
  tags_industria: [],
})

const tagsInput = ref('')
const esActual = ref(false)

watch(esActual, (val) => {
  if (val) form.value.periodo_fin = ''
})

function parseImageUrlHandler() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function parseTags() {
  form.value.tags_industria = tagsInput.value.split(',').map((s) => s.trim()).filter(Boolean)
}

function handleSubmit() {
  parseTags()
  const data = { ...form.value }
  if (esActual.value) data.periodo_fin = null
  emit('save', data)
}

onMounted(() => {
  if (props.experiencia) {
    form.value = { ...props.experiencia }
    form.value.periodo_inicio = props.experiencia.periodo_inicio?.slice(0, 10) || ''
    form.value.periodo_fin = props.experiencia.periodo_fin?.slice(0, 10) || ''
    esActual.value = !props.experiencia.periodo_fin
    tagsInput.value = (props.experiencia.tags_industria || []).join(', ')
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

.checkbox-label {
  display: flex;
  align-items: center;
  gap: 0.375rem;
  margin-top: 0.5rem;
  font-size: 0.8125rem;
  color: var(--color-gray-600);
  cursor: pointer;
}

.checkbox-label input[type="checkbox"] {
  width: 1rem;
  height: 1rem;
  cursor: pointer;
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
