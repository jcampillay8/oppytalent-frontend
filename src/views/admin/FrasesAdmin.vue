<template>
  <div class="container">
    <AdminLayout>
      <div class="admin-header">
        <h1 class="page-title">Frases Célebres</h1>
        <button class="btn btn-primary" @click="openForm(null)">+ Nueva Frase</button>
      </div>

      <FraseForm
        v-if="showForm"
        :frase="editingFrase"
        @save="handleSave"
        @cancel="showForm = false"
      />

      <div v-if="store.loading" class="loading"><div class="spinner"></div></div>
      <div v-else-if="!store.items.length" class="empty-state">No hay frases registradas.</div>
      <div v-else class="admin-list">
        <div v-for="f in store.items" :key="f.id" class="card admin-item">
          <div class="admin-item-info">
            <p class="frase-texto">"{{ truncate(f.texto, 100) }}"</p>
            <span class="admin-item-meta">— {{ f.autor }}</span>
          </div>
          <div class="admin-item-actions">
            <button class="btn btn-outline btn-sm" @click="openForm(f)">Editar</button>
            <button class="btn btn-danger btn-sm" @click="handleDelete(f.id)">Eliminar</button>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import FraseForm from '../../components/admin/FraseForm.vue'
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
  if (confirm('¿Eliminar esta frase?')) {
    await store.remove(id)
  }
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.admin-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.admin-list {
  display: flex;
  flex-direction: column;
  gap: 0.75rem;
}

.admin-item {
  display: flex;
  align-items: center;
  gap: 1rem;
  padding: 1rem 1.25rem;
}

.admin-item-info {
  flex: 1;
}

.frase-texto {
  font-size: 0.9375rem;
  font-weight: 500;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
  line-height: 1.4;
  font-style: italic;
}

.admin-item-meta {
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  font-weight: 600;
}

.admin-item-actions {
  display: flex;
  gap: 0.5rem;
}

.btn-sm {
  padding: 0.375rem 0.75rem;
  font-size: 0.75rem;
}
</style>
