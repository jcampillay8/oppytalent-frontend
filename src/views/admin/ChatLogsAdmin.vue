<template>
  <div class="container">
    <AdminLayout>
      <div class="header-actions">
        <h1 class="page-title">Registros del Chat de IA</h1>
        <button class="btn btn-primary" @click="chatLogsStore.fetchAll()" :disabled="chatLogsStore.loading">
          {{ chatLogsStore.loading ? 'Actualizando...' : 'Actualizar' }}
        </button>
      </div>

      <div v-if="chatLogsStore.error" class="alert alert-error">
        {{ chatLogsStore.error }}
      </div>

      <div class="card overflow-x-auto">
        <table class="table w-full">
          <thead>
            <tr>
              <th>Fecha/Hora</th>
              <th>IP</th>
              <th>Mensaje del Usuario</th>
              <th>Respuesta IA</th>
            </tr>
          </thead>
          <tbody>
            <tr v-for="log in chatLogsStore.items" :key="log.id">
              <td class="whitespace-nowrap">{{ formatDate(log.created_at) }}</td>
              <td>{{ log.ip_address || 'Desconocida' }}</td>
              <td class="message-cell">{{ log.user_message }}</td>
              <td class="message-cell"><div class="response-content">{{ truncate(log.ai_response, 150) }}</div></td>
            </tr>
            <tr v-if="chatLogsStore.items.length === 0 && !chatLogsStore.loading">
              <td colspan="4" class="text-center py-4">No hay registros de chat aún.</td>
            </tr>
          </tbody>
        </table>
      </div>
    </AdminLayout>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useChatLogsStore } from '../../stores/chatLogs'

const chatLogsStore = useChatLogsStore()

onMounted(() => {
  chatLogsStore.fetchAll()
})

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}

function truncate(text, length) {
  if (!text) return ''
  if (text.length <= length) return text
  return text.substring(0, length) + '...'
}
</script>

<style scoped>
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 2rem;
}

.table {
  width: 100%;
  border-collapse: collapse;
  text-align: left;
}

.table th,
.table td {
  padding: 1rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.table th {
  background-color: var(--color-gray-100);
  font-weight: 600;
}

.message-cell {
  max-width: 300px;
}

.response-content {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  white-space: pre-wrap;
}

.overflow-x-auto {
  overflow-x: auto;
}

.whitespace-nowrap {
  white-space: nowrap;
}
</style>
