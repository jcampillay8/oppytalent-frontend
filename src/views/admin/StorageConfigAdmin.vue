<template>
  <div class="container">
    <AdminLayout>
      <div class="admin-header">
        <h1 class="page-title">Almacenamiento de Imágenes</h1>
      </div>

      <div class="storage-grid">
        <!-- Google Drive (Free Tier) -->
        <div class="card storage-card" :class="{ connected: isDriveConnected }">
          <div class="card-header">
            <h3>Google Drive (Plan Gratuito)</h3>
            <span class="badge" v-if="isDriveConnected">Conectado ✅</span>
          </div>
          <div class="card-body">
            <p>Utiliza tu propia cuota gratuita de 15GB de Google Drive para alojar todas las imágenes de tu portafolio, proyectos y experiencias.</p>
            <ul class="feature-list">
              <li>✓ Almacenamiento gratuito</li>
              <li>✓ Las fotos se suben automáticamente a la carpeta "OppyTalent"</li>
              <li>✓ Control total de tus archivos desde tu Drive</li>
            </ul>
            
            <div class="actions">
              <button 
                v-if="!isDriveConnected" 
                @click="connectGoogleDrive" 
                class="btn btn-outline-glass drive-btn"
                :disabled="loading"
              >
                <img src="https://upload.wikimedia.org/wikipedia/commons/1/12/Google_Drive_icon_%282020%29.svg" alt="Drive" class="drive-icon" />
                {{ loading ? 'Conectando...' : 'Conectar con Google Drive' }}
              </button>
              <button v-else class="btn btn-success" disabled>
                Drive Vinculado Correctamente
              </button>
            </div>
          </div>
        </div>

        <!-- Cloudflare R2 (Premium Tier) -->
        <div class="card storage-card premium-card" :class="{ active: isPremium }">
          <div class="card-header">
            <h3>Almacenamiento Premium (R2)</h3>
            <span class="badge premium-badge" v-if="isPremium">Activo 🌟</span>
          </div>
          <div class="card-body">
            <p>Aloja tus imágenes directamente en nuestros servidores de alto rendimiento. Las imágenes cargarán a la velocidad de la luz gracias a la red global de Cloudflare.</p>
            <ul class="feature-list">
              <li>🚀 Carga ultrarrápida de imágenes (CDN Global)</li>
              <li>🔒 No dependes de cuentas de terceros</li>
              <li>✨ Mejor experiencia (UX) para los reclutadores</li>
            </ul>
            
            <div class="actions">
              <button v-if="isPremium" class="btn btn-primary" disabled>
                Plan Premium Activo
              </button>
              <button v-else class="btn btn-primary upgrade-btn" @click="upgradeToPremium">
                Mejorar a Premium
              </button>
            </div>
          </div>
        </div>
      </div>
      
      <!-- Success Message -->
      <div v-if="showSuccessMsg" class="success-alert">
        ¡Google Drive conectado con éxito! Ahora puedes subir imágenes directamente desde los formularios.
      </div>

    </AdminLayout>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showSuccessMsg = ref(false)

const isDriveConnected = computed(() => {
  return !!authStore.user?.google_refresh_token
})

const isPremium = computed(() => {
  return !!authStore.user?.is_premium
})

onMounted(async () => {
  if (!authStore.user || route.query.connected === 'true') {
    await authStore.fetchUser()
  }
  
  if (route.query.connected === 'true') {
    showSuccessMsg.value = true
    setTimeout(() => {
      showSuccessMsg.value = false
      router.replace({ query: null })
    }, 5000)
  }
})

const connectGoogleDrive = async () => {
  loading.value = true
  try {
    const response = await api.getGoogleAuthUrl()
    window.location.href = response.auth_url // Redirect to Google
  } catch (error) {
    alert("Error al intentar conectar con Google Drive.")
    loading.value = false
  }
}

const upgradeToPremium = () => {
  alert("¡Próximamente! Estamos configurando la pasarela de pagos para el plan premium.")
}
</script>

<style scoped>
.storage-grid {
  display: grid;
  grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
  gap: 2rem;
  margin-top: 2rem;
}

.storage-card {
  display: flex;
  flex-direction: column;
  background: rgba(24, 24, 27, 0.4);
  border: 1px solid rgba(255, 255, 255, 0.08);
  transition: transform 0.2s, border-color 0.2s;
}

.storage-card:hover {
  transform: translateY(-2px);
  border-color: rgba(255, 255, 255, 0.15);
}

.storage-card.connected {
  border-color: #22c55e;
  background: rgba(34, 197, 94, 0.05);
}

.premium-card.active {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.05);
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  padding-bottom: 1rem;
  border-bottom: 1px solid rgba(255, 255, 255, 0.05);
  margin-bottom: 1rem;
}

.card-header h3 {
  font-size: 1.25rem;
  font-weight: 600;
  margin: 0;
}

.badge {
  background: rgba(34, 197, 94, 0.2);
  color: #4ade80;
  padding: 0.25rem 0.75rem;
  border-radius: 999px;
  font-size: 0.75rem;
  font-weight: 600;
}

.premium-badge {
  background: rgba(59, 130, 246, 0.2);
  color: #60a5fa;
}

.feature-list {
  list-style: none;
  padding: 0;
  margin: 1.5rem 0;
}

.feature-list li {
  margin-bottom: 0.5rem;
  color: var(--color-gray-300);
  font-size: 0.9rem;
}

.actions {
  margin-top: auto;
  padding-top: 1rem;
}

.drive-btn {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 0.75rem;
  width: 100%;
}

.drive-icon {
  width: 24px;
  height: 24px;
}

.upgrade-btn {
  width: 100%;
  background: linear-gradient(135deg, var(--color-primary), #8b5cf6);
  border: none;
}

.upgrade-btn:hover {
  filter: brightness(1.1);
}

.success-alert {
  margin-top: 2rem;
  padding: 1rem;
  background: rgba(34, 197, 94, 0.1);
  border: 1px solid #22c55e;
  border-radius: var(--radius-md);
  color: #4ade80;
  text-align: center;
  font-weight: 500;
}
</style>
