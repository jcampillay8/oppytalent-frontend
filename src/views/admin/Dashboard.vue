<template>
  <div class="container">
    <AdminLayout>
      <h1 class="page-title">Panel de Administración</h1>
      <p class="page-subtitle">Bienvenido, {{ authStore.user?.username }}. Gestiona tu portafolio desde aquí.</p>

      <div class="stats-grid">
        <router-link to="/admin/proyectos" class="stat-card card">
          <div class="stat-number">{{ proyectosStore.items.length }}</div>
          <div class="stat-label">Proyectos</div>
        </router-link>
        <router-link to="/admin/experiencias" class="stat-card card">
          <div class="stat-number">{{ experienciasStore.items.length }}</div>
          <div class="stat-label">Experiencias</div>
        </router-link>
        <router-link to="/admin/estudios" class="stat-card card">
          <div class="stat-number">{{ estudiosStore.items.length }}</div>
          <div class="stat-label">Estudios</div>
        </router-link>
        <router-link to="/admin/perfil" class="stat-card card">
          <div class="stat-number">{{ perfilStore.items.length }}</div>
          <div class="stat-label">Perfiles</div>
        </router-link>
      </div>

      <div class="admin-actions">
        <router-link to="/admin/proyectos" class="btn btn-primary">Gestionar Proyectos</router-link>
        <router-link to="/admin/experiencias" class="btn btn-primary">Gestionar Experiencias</router-link>
        <router-link to="/admin/estudios" class="btn btn-primary">Gestionar Estudios</router-link>
        <router-link to="/admin/perfil" class="btn btn-primary">Sobre Mí</router-link>
        <router-link to="/admin/chat-logs" class="btn btn-primary">Ver Logs del Chat</router-link>
      </div>

      <div class="chart-section" v-if="chatLogsStore.stats.length > 0">
        <h3>Interacciones del Chat (Últimos 30 días)</h3>
        <div class="chart-container">
          <div 
            v-for="stat in chatLogsStore.stats" 
            :key="stat.date" 
            class="bar-wrapper"
          >
            <div 
              class="bar" 
              :style="{ height: `${Math.max((stat.count / maxStatCount) * 100, 5)}%` }"
              :title="`${stat.date}: ${stat.count} consultas`"
            >
              <span class="bar-label">{{ stat.count }}</span>
            </div>
            <div class="bar-date">{{ formatDateShort(stat.date) }}</div>
          </div>
        </div>
      </div>

      <button class="btn btn-outline logout-btn" @click="handleLogout">Cerrar Sesión</button>
    </AdminLayout>
  </div>
</template>

<script setup>
import { onMounted, computed } from 'vue'
import { useRouter } from 'vue-router'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useAuthStore } from '../../stores/auth'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { usePerfilStore } from '../../stores/perfil'
import { useChatLogsStore } from '../../stores/chatLogs'

const router = useRouter()
const authStore = useAuthStore()
const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const perfilStore = usePerfilStore()
const chatLogsStore = useChatLogsStore()

const maxStatCount = computed(() => {
  if (!chatLogsStore.stats.length) return 1
  return Math.max(...chatLogsStore.stats.map(s => s.count))
})

function formatDateShort(dateString) {
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`
  }
  return dateString
}

function handleLogout() {
  authStore.logout()
  router.push('/admin/login')
}

onMounted(() => {
  authStore.fetchUser()
  proyectosStore.fetchAll()
  experienciasStore.fetchAll()
  estudiosStore.fetchAll()
  perfilStore.fetchAll()
  chatLogsStore.fetchStats()
})
</script>

<style scoped>
.stats-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(140px, 1fr));
  gap: 1rem;
  margin-bottom: 2rem;
}

.stat-card {
  display: block;
  padding: 1.5rem;
  text-align: center;
  color: inherit;
}

.stat-card:hover {
  text-decoration: none;
  color: inherit;
}

.stat-number {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-primary);
}

.stat-label {
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-top: 0.25rem;
}

.admin-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.chart-section {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--color-surface);
  border: 1px solid var(--color-border);
  border-radius: var(--radius-md);
}

.chart-section h3 {
  margin-bottom: 1.5rem;
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-text);
}

.chart-container {
  display: flex;
  align-items: flex-end;
  gap: 0.5rem;
  height: 200px;
  overflow-x: auto;
  padding-bottom: 1rem;
}

.bar-wrapper {
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: flex-end;
  height: 100%;
  min-width: 40px;
}

.bar {
  width: 100%;
  background-color: var(--color-primary);
  border-radius: 4px 4px 0 0;
  transition: height 0.5s ease;
  position: relative;
  display: flex;
  justify-content: center;
}

.bar:hover {
  background-color: var(--color-primary-hover);
}

.bar-label {
  position: absolute;
  top: -20px;
  font-size: 0.75rem;
  font-weight: bold;
  color: var(--color-text);
}

.bar-date {
  margin-top: 0.5rem;
  font-size: 0.75rem;
  color: var(--color-text-muted);
}

.logout-btn {
  margin-top: 2rem;
}
</style>
