<template>
  <div class="card form-card">
    <h3 class="form-title">{{ frase ? 'Editar Frase' : 'Nueva Frase' }}</h3>
    <form @submit.prevent="submit" class="form">
      <div class="form-group">
        <label>Texto de la Frase</label>
        <textarea
          v-model="form.texto"
          required
          rows="4"
          class="form-input"
          placeholder="Escribe la frase..."
        ></textarea>
      </div>

      <div class="form-group">
        <label>Autor</label>
        <input
          v-model="form.autor"
          type="text"
          required
          class="form-input"
          placeholder="Ej: Seneca"
        />
      </div>

      <div class="form-actions">
        <button type="button" class="btn btn-outline" @click="$emit('cancel')" :disabled="loading">
          Cancelar
        </button>
        <button type="submit" class="btn btn-primary" :disabled="loading">
          {{ loading ? 'Guardando...' : 'Guardar Frase' }}
        </button>
      </div>
    </form>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue'

const props = defineProps({
  frase: { type: Object, default: null },
})
const emit = defineEmits(['save', 'cancel'])

const form = ref({ texto: '', autor: '' })
const loading = ref(false)

watch(
  () => props.frase,
  (val) => {
    if (val) {
      form.value = { ...val }
    } else {
      form.value = { texto: '', autor: '' }
    }
  },
  { immediate: true }
)

async function submit() {
  loading.value = true
  try {
    await emit('save', { ...form.value })
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
.form-card {
  padding: 1.5rem;
  margin-bottom: 2rem;
  border: 1px solid var(--color-primary);
}

.form-title {
  font-size: 1.125rem;
  font-weight: 600;
  margin-bottom: 1rem;
}

.form-group {
  margin-bottom: 1rem;
}

.form-group label {
  display: block;
  font-size: 0.8125rem;
  font-weight: 600;
  margin-bottom: 0.375rem;
  color: var(--color-gray-700);
}

.form-input {
  width: 100%;
  padding: 0.625rem;
  border: 1px solid var(--color-gray-300);
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-family: inherit;
}

.form-input:focus {
  outline: none;
  border-color: var(--color-primary);
}

.form-actions {
  display: flex;
  gap: 0.75rem;
  justify-content: flex-end;
  margin-top: 1.5rem;
}
</style>
