<template>
  <div class="container">
    <AdminLayout>
      <div class="header-actions">
        <div>
          <h1 class="page-title">Registros del Chat de IA</h1>
          <p class="subtitle">Monitorea y analiza las interacciones de los visitantes con la inteligencia artificial.</p>
        </div>
        
        <div class="action-buttons">
          <!-- Column Toggle Dropdown -->
          <div class="dropdown-container">
            <button class="btn btn-secondary" @click="showColumnMenu = !showColumnMenu">
              <span class="icon">⚙️</span> Columnas
            </button>
            <div v-if="showColumnMenu" class="dropdown-menu">
              <label v-for="col in columns" :key="col.key" class="dropdown-item">
                <input type="checkbox" v-model="col.visible" />
                <span>{{ col.label }}</span>
              </label>
            </div>
          </div>
          
          <button class="btn btn-primary" @click="refreshData" :disabled="chatLogsStore.loading">
            <span class="icon">↻</span> {{ chatLogsStore.loading ? 'Actualizando...' : 'Actualizar' }}
          </button>
        </div>
      </div>

      <div v-if="chatLogsStore.error" class="alert alert-error">
        {{ chatLogsStore.error }}
      </div>

      <div class="card table-container">
        <table class="table">
          <thead>
            <tr>
              <th v-for="col in visibleColumns" :key="col.key">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody>
            <tr 
              v-for="log in paginatedItems" 
              :key="log.id"
              class="interactive-row"
              @click="openModal(log)"
            >
              <td v-if="isColVisible('created_at')" class="whitespace-nowrap date-cell">
                {{ formatDate(log.created_at) }}
              </td>
              <td v-if="isColVisible('ip_address')" class="font-mono text-sm">
                <span class="badge badge-ip">{{ log.ip_address || 'Desconocida' }}</span>
              </td>
              <td v-if="isColVisible('city')">{{ log.city || '-' }}</td>
              <td v-if="isColVisible('region')">{{ log.region || '-' }}</td>
              <td v-if="isColVisible('country')">
                <span v-if="log.country" class="badge badge-country">{{ log.country }}</span>
                <span v-else>-</span>
              </td>
              <td v-if="isColVisible('user_message')" class="message-cell">
                <div class="truncate-text">{{ log.user_message }}</div>
              </td>
              <td v-if="isColVisible('ai_response')" class="message-cell">
                <div class="truncate-text text-muted">{{ log.ai_response }}</div>
              </td>
              <td v-if="isColVisible('clicked_link')">
                <span v-if="log.clicked_link" class="badge badge-action truncate-text" style="max-width: 150px;">{{ log.clicked_link }}</span>
                <span v-else>-</span>
              </td>
            </tr>
            <tr v-if="chatLogsStore.items.length === 0 && !chatLogsStore.loading">
              <td :colspan="visibleColumns.length" class="empty-state">
                <div class="empty-state-content">
                  <span class="empty-icon">💬</span>
                  <p>No hay registros de chat aún.</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </div>

      <!-- Pagination Controls -->
      <div class="pagination-controls" v-if="chatLogsStore.items.length > 0">
        <div class="per-page-selector">
          <label>Mostrar:</label>
          <select v-model="itemsPerPage" @change="currentPage = 1" class="per-page-select">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span class="total-items">Total: {{ chatLogsStore.items.length }} registros</span>
        </div>
        
        <div class="page-navigation">
          <button class="btn btn-secondary btn-sm" @click="prevPage" :disabled="currentPage === 1">&laquo; Anterior</button>
          <span class="page-info">Página {{ currentPage }} de {{ totalPages || 1 }}</span>
          <button class="btn btn-secondary btn-sm" @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0">Siguiente &raquo;</button>
        </div>
      </div>
    </AdminLayout>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedLog" class="modal-overlay" @click.self="closeModal">
        <div class="modal-content">
          <div class="modal-header">
            <h2>Detalle de Conversación</h2>
            <button class="close-btn" @click="closeModal">&times;</button>
          </div>
          
          <div class="modal-body">
            <div class="meta-info">
              <div class="meta-item">
                <span class="meta-label">Fecha y Hora</span>
                <span class="meta-value">{{ formatDate(selectedLog.created_at) }}</span>
              </div>
              <div class="meta-item">
                <span class="meta-label">IP Cliente</span>
                <span class="meta-value font-mono">{{ selectedLog.ip_address || 'Desconocida' }}</span>
              </div>
              <div class="meta-item" v-if="selectedLog.city || selectedLog.country">
                <span class="meta-label">Ubicación</span>
                <span class="meta-value">
                  {{ [selectedLog.city, selectedLog.region, selectedLog.country].filter(Boolean).join(', ') }}
                </span>
              </div>
              <div class="meta-item" v-if="selectedLog.clicked_link">
                <span class="meta-label">Acción (Link Clickeado)</span>
                <span class="meta-value badge badge-action">{{ selectedLog.clicked_link }}</span>
              </div>
            </div>

            <div class="chat-bubbles">
              <div class="bubble user-bubble">
                <div class="bubble-header">👤 Usuario</div>
                <div class="bubble-text">{{ selectedLog.user_message }}</div>
              </div>
              
              <div class="bubble ai-bubble">
                <div class="bubble-header">🤖 Inteligencia Artificial</div>
                <div class="bubble-text markdown-body">{{ selectedLog.ai_response }}</div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </Teleport>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useChatLogsStore } from '../../stores/chatLogs'

const chatLogsStore = useChatLogsStore()

// State for Modal
const selectedLog = ref(null)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(chatLogsStore.items.length / itemsPerPage.value))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return chatLogsStore.items.slice(start, end)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// State for Columns
const columns = ref([
  { key: 'created_at', label: 'Fecha/Hora', visible: true },
  { key: 'ip_address', label: 'IP', visible: true },
  { key: 'city', label: 'Ciudad', visible: false },
  { key: 'region', label: 'Región', visible: false },
  { key: 'country', label: 'País', visible: true },
  { key: 'user_message', label: 'Mensaje del Usuario', visible: true },
  { key: 'ai_response', label: 'Respuesta IA', visible: true },
  { key: 'clicked_link', label: 'Link Clickeado', visible: false },
])
const showColumnMenu = ref(false)

const visibleColumns = computed(() => columns.value.filter(c => c.visible))

function isColVisible(key) {
  return columns.value.find(c => c.key === key)?.visible
}

// Click outside dropdown to close
const closeDropdown = (e) => {
  if (!e.target.closest('.dropdown-container')) {
    showColumnMenu.value = false
  }
}

onMounted(() => {
  chatLogsStore.fetchAll()
  document.addEventListener('click', closeDropdown)
})

onUnmounted(() => {
  document.removeEventListener('click', closeDropdown)
})

function refreshData() {
  chatLogsStore.fetchAll()
  currentPage.value = 1
}

function openModal(log) {
  selectedLog.value = log
  document.body.style.overflow = 'hidden' // Prevent background scrolling
}

function closeModal() {
  selectedLog.value = null
  document.body.style.overflow = ''
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}
</script>

<style scoped>
/* Typography & Layout */
.header-actions {
  display: flex;
  justify-content: space-between;
  align-items: flex-end;
  margin-bottom: 2rem;
  flex-wrap: wrap;
  gap: 1rem;
}

.page-title {
  font-size: 1.75rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.subtitle {
  color: var(--color-gray-500);
  font-size: 0.9rem;
}

.action-buttons {
  display: flex;
  gap: 0.75rem;
  align-items: center;
}

.icon {
  margin-right: 0.25rem;
}

/* Dropdown */
.dropdown-container {
  position: relative;
}

.btn-secondary {
  background-color: var(--color-gray-100);
  color: var(--color-gray-800);
  border: 1px solid var(--color-gray-200);
}

.btn-secondary:hover {
  background-color: var(--color-gray-200);
}

.dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  background: white;
  border-radius: 8px;
  box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 8px 10px -6px rgba(0, 0, 0, 0.1);
  border: 1px solid var(--color-gray-100);
  padding: 0.5rem;
  min-width: 200px;
  z-index: 50;
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.dropdown-item {
  display: flex;
  align-items: center;
  padding: 0.5rem 0.75rem;
  border-radius: 6px;
  cursor: pointer;
  transition: background-color 0.2s;
  font-size: 0.9rem;
  color: var(--color-gray-700);
}

.dropdown-item:hover {
  background-color: var(--color-gray-50);
}

.dropdown-item input {
  margin-right: 0.75rem;
  accent-color: var(--color-primary);
}

/* Table Card */
.card {
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05), 0 2px 4px -2px rgba(0, 0, 0, 0.025);
  border: 1px solid var(--color-gray-100);
}

.table-container {
  width: 100%;
  overflow-x: auto; /* Limit horizontal scroll to this container */
  /* Hide scrollbar for cleaner look but allow scrolling */
  scrollbar-width: thin;
}

.table {
  width: 100%;
  border-collapse: separate;
  border-spacing: 0;
  text-align: left;
  min-width: 800px;
}

.table th {
  background-color: var(--color-gray-50);
  font-weight: 600;
  color: var(--color-gray-500);
  text-transform: uppercase;
  font-size: 0.75rem;
  letter-spacing: 0.05em;
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-200);
  position: sticky;
  top: 0;
}

.table td {
  padding: 1rem 1.25rem;
  border-bottom: 1px solid var(--color-gray-100);
  color: var(--color-gray-800);
  font-size: 0.9rem;
  vertical-align: middle;
}

.interactive-row {
  cursor: pointer;
  transition: all 0.2s ease;
}

.interactive-row:hover {
  background-color: var(--color-gray-50);
  transform: translateY(-1px);
  box-shadow: 0 2px 4px rgba(0,0,0,0.02) inset;
}

.interactive-row:last-child td {
  border-bottom: none;
}

/* Cells */
.date-cell {
  color: var(--color-gray-500);
}

.font-mono {
  font-family: ui-monospace, SFMono-Regular, Menlo, Monaco, Consolas, monospace;
}

.text-sm {
  font-size: 0.85rem;
}

.text-muted {
  color: var(--color-gray-500);
}

.message-cell {
  max-width: 250px;
}

.truncate-text {
  white-space: nowrap;
  overflow: hidden;
  text-overflow: ellipsis;
}

.whitespace-nowrap {
  white-space: nowrap;
}

/* Badges */
.badge {
  padding: 0.25rem 0.6rem;
  border-radius: 9999px;
  font-size: 0.75rem;
  font-weight: 500;
  display: inline-block;
}

.badge-ip {
  background-color: #e0f2fe;
  color: #0284c7;
}

.badge-country {
  background-color: #f3f4f6;
  color: #4b5563;
  border: 1px solid #e5e7eb;
}

.badge-action {
  background-color: #fef3c7;
  color: #b45309;
  border: 1px solid #fde68a;
  display: inline-flex;
  max-width: 100%;
}

/* Empty State */
.empty-state {
  text-align: center;
  padding: 4rem 2rem;
}

.empty-state-content {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1rem;
  color: var(--color-gray-500);
}

.empty-icon {
  font-size: 2.5rem;
  opacity: 0.5;
}

/* Pagination */
.pagination-controls {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-top: 1.5rem;
  padding: 1rem;
  background: white;
  border-radius: 12px;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.05);
  border: 1px solid var(--color-gray-100);
  flex-wrap: wrap;
  gap: 1rem;
}

.per-page-selector {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  font-size: 0.9rem;
  color: var(--color-gray-700);
}

.per-page-select {
  padding: 0.35rem 0.5rem;
  border-radius: 6px;
  border: 1px solid var(--color-gray-300);
  background-color: white;
  outline: none;
  font-family: inherit;
  font-size: 0.9rem;
}

.total-items {
  margin-left: 1rem;
  color: var(--color-gray-500);
  font-size: 0.85rem;
}

.page-navigation {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.page-info {
  font-size: 0.9rem;
  color: var(--color-gray-700);
  font-weight: 500;
}

.btn-sm {
  padding: 0.35rem 0.75rem;
  font-size: 0.85rem;
}

/* Modal */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100vw;
  height: 100vh;
  background-color: rgba(15, 23, 42, 0.4);
  backdrop-filter: blur(4px);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 9999;
  padding: 1.5rem;
  animation: fadeIn 0.2s ease-out;
}

.modal-content {
  background: white;
  width: 100%;
  max-width: 700px;
  max-height: 90vh;
  border-radius: 16px;
  box-shadow: 0 20px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04);
  display: flex;
  flex-direction: column;
  animation: slideUp 0.3s ease-out;
  overflow: hidden;
}

.modal-header {
  padding: 1.5rem 2rem;
  border-bottom: 1px solid var(--color-gray-100);
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: var(--color-gray-50);
}

.modal-header h2 {
  margin: 0;
  font-size: 1.25rem;
  color: var(--color-gray-900);
}

.close-btn {
  background: none;
  border: none;
  font-size: 1.5rem;
  line-height: 1;
  color: var(--color-gray-400);
  cursor: pointer;
  transition: color 0.2s;
  padding: 0.25rem;
  display: flex;
  align-items: center;
  justify-content: center;
  border-radius: 50%;
}

.close-btn:hover {
  color: var(--color-gray-800);
  background-color: var(--color-gray-200);
}

.modal-body {
  padding: 2rem;
  overflow-y: auto;
  display: flex;
  flex-direction: column;
  gap: 2rem;
}

.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  background-color: var(--color-gray-50);
  padding: 1.25rem;
  border-radius: 8px;
  border: 1px solid var(--color-gray-100);
}

.meta-item {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
}

.meta-label {
  font-size: 0.75rem;
  text-transform: uppercase;
  color: var(--color-gray-500);
  font-weight: 600;
  letter-spacing: 0.05em;
}

.meta-value {
  font-size: 0.95rem;
  color: var(--color-gray-900);
}

.chat-bubbles {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.bubble {
  display: flex;
  flex-direction: column;
  gap: 0.5rem;
}

.bubble-header {
  font-size: 0.85rem;
  font-weight: 600;
  color: var(--color-gray-500);
}

.bubble-text {
  padding: 1.25rem;
  border-radius: 12px;
  font-size: 0.95rem;
  line-height: 1.6;
  color: var(--color-gray-800);
  white-space: pre-wrap;
}

.user-bubble .bubble-text {
  background-color: #f0f9ff;
  border: 1px solid #bae6fd;
  color: #0369a1;
  border-top-left-radius: 0;
}

.ai-bubble .bubble-text {
  background-color: white;
  border: 1px solid var(--color-gray-200);
  box-shadow: 0 1px 3px rgba(0,0,0,0.05);
  border-top-right-radius: 0;
}

/* Animations */
@keyframes fadeIn {
  from { opacity: 0; }
  to { opacity: 1; }
}

@keyframes slideUp {
  from { opacity: 0; transform: translateY(20px) scale(0.98); }
  to { opacity: 1; transform: translateY(0) scale(1); }
}

/* Markdown adjustments for AI response */
.markdown-body :deep(p:last-child) {
  margin-bottom: 0;
}
</style>

