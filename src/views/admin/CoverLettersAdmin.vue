<template>
  <div class="container">
    <AdminLayout title="Oportunidades (Cover Letters)">
      <template #actions>
        <!-- Botones de acciones globales si es necesario -->
      </template>

      <div class="admin-content">
        <div v-if="loading" class="loading-state">
          <div class="spinner"></div>
          <p>Cargando oportunidades...</p>
        </div>

        <div v-else-if="!coverLetters.length" class="empty-state">
          <div class="empty-icon">📄</div>
          <h3>No tienes Cover Letters aún</h3>
          <p>Cuando un reclutador visite tu portafolio y genere una carta para una oferta, aparecerá aquí junto con su correo (si lo dejó).</p>
        </div>

        <div v-else class="letters-grid">
          <div v-for="letter in coverLetters" :key="letter.id" class="card letter-card">
            <div class="card-header">
              <div class="job-info">
                <h3 class="job-title">{{ letter.job_title }}</h3>
                <span class="company-badge" v-if="letter.company_name">{{ letter.company_name }}</span>
              </div>
              <div class="card-actions">
                <button class="icon-btn danger" title="Eliminar" @click="deleteLetter(letter.id)">🗑️</button>
              </div>
            </div>
            
            <div class="recruiter-info" v-if="letter.recruiter_email">
              <span class="label">Reclutador:</span> {{ letter.recruiter_email }}
            </div>

            <div class="letter-body">
              <div class="markdown-content" v-html="renderMarkdown(letter.generated_letter)"></div>
            </div>

            <div class="card-footer">
              <span class="date">{{ formatDate(letter.created_at) }}</span>
              <span class="generator-badge" :class="letter.generated_by">Generado por: {{ letter.generated_by === 'owner' ? 'Ti' : 'Visitante' }}</span>
            </div>
          </div>
        </div>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { api } from '../../services/api'
import { marked } from 'marked'

const coverLetters = ref([])
const loading = ref(true)

const fetchLetters = async () => {
  try {
    loading.value = true
    const response = await api.getCoverLetters()
    coverLetters.value = response
  } catch (error) {
    alert("Error al cargar las cover letters")
  } finally {
    loading.value = false
  }
}

const deleteLetter = async (id) => {
  if (!confirm("¿Seguro que deseas eliminar esta carta de presentación?")) return
  try {
    await api.deleteCoverLetter(id)
    coverLetters.value = coverLetters.value.filter(l => l.id !== id)
  } catch (error) {
    alert("Error al eliminar")
  }
}

const renderMarkdown = (text) => {
  return marked(text)
}

const formatDate = (dateStr) => {
  const d = new Date(dateStr)
  return d.toLocaleDateString() + ' ' + d.toLocaleTimeString([], {hour: '2-digit', minute:'2-digit'})
}

onMounted(() => {
  fetchLetters()
})
</script>

<style scoped>
.admin-content {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.letters-grid {
  display: grid;
  grid-template-columns: 1fr;
  gap: 1.5rem;
}

.letter-card {
  padding: 1.5rem;
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  border-bottom: 1px solid var(--color-border);
  padding-bottom: 1rem;
}

.job-info {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.job-title {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
}

.company-badge {
  align-self: flex-start;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-sm);
  font-size: 0.8rem;
  color: var(--color-gray-700);
  font-weight: 600;
}

.recruiter-info {
  font-size: 0.9rem;
  background: rgba(var(--color-primary-rgb), 0.1);
  padding: 0.5rem;
  border-radius: var(--radius-sm);
  color: var(--color-gray-900);
}

.recruiter-info .label {
  font-weight: 600;
}

.letter-body {
  background: var(--color-background);
  padding: 1rem;
  border-radius: var(--radius-sm);
  max-height: 250px;
  overflow-y: auto;
  border: 1px solid var(--color-border);
  font-family: serif;
  color: var(--color-gray-900);
  font-size: 0.95rem;
}

.card-footer {
  display: flex;
  justify-content: space-between;
  align-items: center;
  font-size: 0.85rem;
  color: var(--color-gray-500);
}

.generator-badge {
  padding: 0.25rem 0.5rem;
  border-radius: var(--radius-full);
  font-weight: 600;
}

.generator-badge.visitor {
  background: #e0f2fe;
  color: #0284c7;
}

.generator-badge.owner {
  background: #dcfce7;
  color: #16a34a;
}
</style>
