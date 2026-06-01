<template>
  <div class="card form-card">
    <h3 class="form-title">{{ perfil ? 'Editar Perfil' : 'Nuevo Perfil' }}</h3>
    <form @submit.prevent="handleSubmit">
      <div class="form-group">
        <label>Descripción Personal (Markdown)</label>
        <textarea v-model="form.descripcion" class="form-textarea" rows="10" required></textarea>
      </div>
      <div class="form-group">
        <label>URL de Imagen de perfil (o ID de Google Drive)</label>
        <input v-model="form.image_url" type="text" class="form-input" placeholder="ID de Drive o URL completa" @blur="handleParseImageUrl" />
      </div>
      <div class="form-group">
        <label>URL del Avatar navbar (o ID de Google Drive)</label>
        <input v-model="form.avatar_url" type="text" class="form-input" placeholder="ID de Drive o URL completa" @blur="handleParseAvatarUrl" />
      </div>
      <div class="form-group">
        <label>Teléfono</label>
        <input v-model="form.telefono" type="text" class="form-input" placeholder="+56 9 1234 5678" />
      </div>
      <div class="form-group">
        <label>Email</label>
        <input v-model="form.email" type="email" class="form-input" placeholder="correo@ejemplo.com" />
      </div>
      <div class="form-group">
        <label>LinkedIn (URL)</label>
        <input v-model="form.linkedin" type="url" class="form-input" placeholder="https://linkedin.com/in/usuario" />
      </div>
      <div class="form-group">
        <label>GitHub (URL)</label>
        <input v-model="form.github" type="url" class="form-input" placeholder="https://github.com/usuario" />
      </div>
      <div class="form-group">
        <label>Ciudad</label>
        <input v-model="form.ciudad" type="text" class="form-input" placeholder="Santiago, Chile" />
      </div>
      <div class="form-group">
        <label>Video Pitch (URL de YouTube)</label>
        <input v-model="form.youtube_url" type="url" class="form-input" placeholder="https://www.youtube.com/watch?v=..." />
      </div>
      <div class="form-group">
        <label>Certificaciones (JSON array de objetos)</label>
        <textarea v-model="certificacionesText" class="form-textarea" rows="4" placeholder='[{"titulo": "Licencia A4", "entidad": "Dirección de Tránsito"}]' @blur="parseCertificaciones"></textarea>
      </div>
      <div class="form-group">
        <label>Idiomas (JSON array de objetos)</label>
        <textarea v-model="idiomasText" class="form-textarea" rows="4" placeholder='[{"idioma": "Inglés", "nivel": "Avanzado"}]' @blur="parseIdiomas"></textarea>
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
  perfil: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const form = ref({
  descripcion: '',
  image_url: '',
  avatar_url: '',
  telefono: '',
  email: '',
  linkedin: '',
  github: '',
  ciudad: '',
  youtube_url: '',
  certificaciones: [],
  idiomas: [],
})

const certificacionesText = ref('')
const idiomasText = ref('')

function parseCertificaciones() {
  try {
    form.value.certificaciones = certificacionesText.value ? JSON.parse(certificacionesText.value) : []
  } catch {
    form.value.certificaciones = []
  }
}

function parseIdiomas() {
  try {
    form.value.idiomas = idiomasText.value ? JSON.parse(idiomasText.value) : []
  } catch {
    form.value.idiomas = []
  }
}

function handleParseImageUrl() {
  form.value.image_url = parseImageUrl(form.value.image_url)
}

function handleParseAvatarUrl() {
  form.value.avatar_url = parseImageUrl(form.value.avatar_url)
}

function handleSubmit() {
  parseCertificaciones()
  parseIdiomas()
  emit('save', { ...form.value })
}

onMounted(() => {
  if (props.perfil) {
    form.value = { ...props.perfil }
    certificacionesText.value = JSON.stringify(props.perfil.certificaciones || [], null, 2)
    idiomasText.value = JSON.stringify(props.perfil.idiomas || [], null, 2)
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

.form-actions {
  display: flex;
  gap: 0.75rem;
  margin-top: 1.5rem;
}
</style>
