<template>
  <div class="home-container">
    <!-- Navbar Premium -->
    <nav class="navbar glass-panel">
      <div class="navbar-brand">
        <router-link to="/home" class="logo">Oppy<span>Talent</span></router-link>
      </div>
      
      <div class="navbar-search-container">
        <div class="navbar-search">
          <input 
            type="text" 
            v-model="searchQuery" 
            @input="onSearch" 
            @focus="showResults = true"
            @blur="hideResultsDelay"
            placeholder="Buscar talento..." 
            class="search-input" 
          />
          <div class="search-results-wrapper">
            <div v-if="showResults && searchResults.length > 0" class="search-results glass-panel">
              <router-link 
                v-for="user in searchResults" 
                :key="user.id" 
                :to="`/${user.username.split('@')[0]}`" 
                class="search-result-item"
              >
                <div class="search-avatar">
                  <img v-if="user.userImage" :src="user.userImage" alt="Avatar" />
                  <span v-else>{{ (user.firstName || user.username || 'U').charAt(0) }}{{ (user.lastName || '').charAt(0) }}</span>
                </div>
                <div class="search-info">
                  <strong>{{ user.firstName || user.username }} {{ user.lastName || '' }}</strong>
                  <span>{{ user.occupation || 'Talento OppyTalent' }}</span>
                </div>
              </router-link>
            </div>
            <div v-else-if="showResults && searchQuery && searchResults.length === 0 && !isSearching" class="search-results glass-panel empty">
              <p>No se encontraron talentos con "{{ searchQuery }}"</p>
            </div>
          </div>
        </div>
      </div>
      <div class="navbar-right-container">
        <div class="navbar-menu">
          <button class="nav-item active"><i class="icon-home"></i> Inicio</button>
          <button class="nav-item"><i class="icon-network"></i> Red</button>
          <button class="nav-item"><i class="icon-jobs"></i> Empleos</button>
        </div>
        <div class="navbar-user">
          <button @click="logout" class="btn-outline-glass">Cerrar Sesión</button>
        </div>
      </div>
    </nav>

    <!-- Main Content Grid -->
    <main class="home-grid">
      <!-- Left Sidebar (Profile summary) -->
      <aside class="sidebar-left">
        <div class="profile-card glass-panel">
          <div class="profile-cover"></div>
          <router-link 
            v-if="currentUser"
            :to="`/${currentUser.username.split('@')[0]}`" 
            class="profile-info profile-link"
          >
            <div class="profile-avatar">
              <img v-if="currentUser.userImage" :src="currentUser.userImage" alt="Avatar" style="width: 100%; height: 100%; object-fit: cover; border-radius: 50%;" />
              <span v-else>{{ (currentUser.firstName || currentUser.username || 'U').charAt(0) }}{{ (currentUser.lastName || '').charAt(0) }}</span>
            </div>
            <h3 class="profile-name-hover">{{ currentUser.firstName || currentUser.username }} {{ currentUser.lastName || '' }}</h3>
            <p>{{ currentUser.occupation || 'Talento en crecimiento' }}</p>
          </router-link>
          <div v-else class="profile-info">
            <div class="profile-avatar"><span>👤</span></div>
            <h3>Cargando...</h3>
            <p>Talento en crecimiento</p>
          </div>
          <div class="profile-stats">
            <div class="stat">
              <span>Contactos</span>
              <strong>0</strong>
            </div>
            <div class="stat">
              <span>Vistas de perfil</span>
              <strong>0</strong>
            </div>
          </div>
          <div v-if="currentUser" style="margin-top: 1rem;">
            <router-link to="/admin" class="btn btn-primary" style="width: 100%; justify-content: center; background-color: rgba(59, 130, 246, 0.2); border-color: #3b82f6; color: white; display: flex; align-items: center; gap: 0.5rem; padding: 0.75rem; border-radius: 8px; text-decoration: none; font-weight: 600;">
              ⚙️ Administrar Perfil
            </router-link>
          </div>
        </div>
      </aside>

      <!-- Center Feed -->
      <section class="feed">
        <div class="create-post glass-panel">
          <div class="post-input-area">
            <div class="avatar-small">👤</div>
            <input type="text" placeholder="¿Qué tienes en mente, talento?" class="post-input" />
          </div>
          <div class="post-actions">
            <button class="post-action-btn">📷 Foto</button>
            <button class="post-action-btn">🎥 Video</button>
            <button class="post-action-btn">📄 Artículo</button>
          </div>
        </div>

        <div class="feed-posts">
          <!-- Placeholder Post 1 -->
          <div class="post-card glass-panel">
            <div class="post-header">
              <div class="avatar-small">JC</div>
              <div class="post-meta">
                <strong>Jaime Campillay</strong>
                <span>Ingeniero Civil Industrial • Hace 2 horas</span>
              </div>
            </div>
            <div class="post-content">
              <p>¡Bienvenidos a OppyTalent! La nueva red para potenciar el desarrollo profesional y conectar oportunidades.</p>
            </div>
            <div class="post-footer">
              <button class="interaction-btn">👍 Recomendar</button>
              <button class="interaction-btn">💬 Comentar</button>
              <button class="interaction-btn">🔗 Compartir</button>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Sidebar (News/Widgets) -->
      <aside class="sidebar-right">
        <div class="widget glass-panel">
          <h3>Noticias OppyTalent</h3>
          <ul class="news-list">
            <li>
              <strong>Lanzamiento de la plataforma</strong>
              <span>Hace 1 hora</span>
            </li>
            <li>
              <strong>Nuevas herramientas de IA</strong>
              <span>Hace 5 horas</span>
            </li>
          </ul>
        </div>
      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api' // Asegúrate de que api.js esté configurado

const router = useRouter()

const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)
const currentUser = ref(null)
let searchTimeout = null
let blurTimeout = null

onMounted(async () => {
  try {
    currentUser.value = await api.me()
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
})

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    isSearching.value = false
    return
  }

  isSearching.value = true
  // Debounce search
  searchTimeout = setTimeout(async () => {
    try {
      const data = await api.searchUsers(searchQuery.value)
      searchResults.value = data
    } catch (error) {
      console.error('Error buscando usuarios:', error)
      searchResults.value = []
    } finally {
      isSearching.value = false
    }
  }, 300)
}

function hideResultsDelay() {
  if (blurTimeout) clearTimeout(blurTimeout)
  blurTimeout = setTimeout(() => {
    showResults.value = false
  }, 200)
}

function logout() {
  localStorage.removeItem('token')
  router.push('/login')
}

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (blurTimeout) clearTimeout(blurTimeout)
})
</script>

<style scoped>
.home-container {
  min-height: 100vh;
  background-color: #09090b;
  color: #fafafa;
  font-family: 'Inter', sans-serif;
  padding-top: 5rem;
}

.glass-panel {
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(16px);
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.navbar {
  position: fixed;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  display: grid;
  grid-template-columns: 1fr minmax(auto, 400px) 1fr;
  align-items: center;
  padding: 0 2rem;
  z-index: 50;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: white;
  text-decoration: none;
}
.logo span { color: #3b82f6; }

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.navbar-search-container {
  width: 100%;
  position: relative;
}

.navbar-search {
  width: 100%;
  position: relative;
}

.search-input {
  width: 100%;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: white;
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  border-color: #3b82f6;
  box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
}

.search-results {
  position: absolute;
  top: 100%;
  left: 0;
  right: 0;
  margin-top: 0.5rem;
  max-height: 400px;
  overflow-y: auto;
  border-radius: 8px;
  z-index: 100;
  padding: 0.5rem 0;
}

.search-results.empty {
  padding: 1rem;
  text-align: center;
  color: #a1a1aa;
  font-size: 0.85rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: #fafafa;
  transition: background 0.2s;
}

.search-result-item:hover {
  background: rgba(255, 255, 255, 0.05);
}

.search-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: #3b82f6;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  font-size: 0.85rem;
  color: white;
  overflow: hidden;
  flex-shrink: 0;
}

.search-avatar img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.search-info {
  display: flex;
  flex-direction: column;
}

.search-info strong {
  font-size: 0.9rem;
  font-weight: 600;
}

.search-info span {
  font-size: 0.75rem;
  color: #a1a1aa;
}

.navbar-right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
}

.nav-item {
  background: none;
  border: none;
  color: #a1a1aa;
  font-weight: 500;
  font-size: 0.9rem;
  cursor: pointer;
  padding: 0.5rem;
  transition: color 0.2s;
}

.nav-item:hover, .nav-item.active {
  color: #fafafa;
}

.btn-outline-glass {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline-glass:hover {
  background: rgba(255, 255, 255, 0.1);
}

.home-grid {
  max-width: 1300px;
  margin: 0 auto;
  display: grid;
  grid-template-columns: 280px 1fr 300px;
  gap: 1.5rem;
  padding: 1.5rem;
}

/* Left Sidebar */
.profile-cover {
  height: 60px;
  background: linear-gradient(135deg, #3b82f6, #8b5cf6);
  border-radius: 12px 12px 0 0;
}

.profile-info {
  padding: 0 1rem 1rem;
  text-align: center;
  margin-top: -30px;
  border-bottom: 1px solid rgba(255, 255, 255, 0.08);
}

.profile-avatar {
  width: 64px;
  height: 64px;
  background: #1e293b;
  border: 2px solid #18181b;
  border-radius: 50%;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.profile-info h3 { font-size: 1rem; font-weight: 600; margin-bottom: 0.25rem; }
.profile-info p { font-size: 0.8rem; color: #a1a1aa; }

.profile-link {
  text-decoration: none;
  color: inherit;
  display: block;
  cursor: pointer;
  transition: transform 0.2s;
}

.profile-link:hover .profile-name-hover {
  text-decoration: underline;
  color: #3b82f6;
}

.profile-stats {
  padding: 1rem;
}
.stat {
  display: flex;
  justify-content: space-between;
  font-size: 0.8rem;
  margin-bottom: 0.5rem;
}
.stat span { color: #a1a1aa; }
.stat strong { color: #3b82f6; }

/* Center Feed */
.create-post {
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.post-input-area {
  display: flex;
  gap: 1rem;
  margin-bottom: 1rem;
}
.avatar-small {
  width: 40px;
  height: 40px;
  background: #3b82f6;
  border-radius: 50%;
  display: flex;
  align-items: center;
  justify-content: center;
  font-weight: 600;
  flex-shrink: 0;
}
.post-input {
  flex: 1;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  padding: 0.5rem 1rem;
  color: white;
  font-family: inherit;
  transition: all 0.2s;
}
.post-input:focus {
  outline: none;
  background: rgba(0, 0, 0, 0.3);
  border-color: #3b82f6;
}
.post-actions {
  display: flex;
  justify-content: space-around;
}
.post-action-btn {
  background: none;
  border: none;
  color: #a1a1aa;
  cursor: pointer;
  font-weight: 500;
  font-size: 0.85rem;
  padding: 0.5rem 1rem;
  border-radius: 6px;
  transition: background 0.2s;
}
.post-action-btn:hover { background: rgba(255, 255, 255, 0.05); }

.post-card {
  padding: 1rem;
  margin-bottom: 1.5rem;
}
.post-header {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 1rem;
}
.post-meta {
  display: flex;
  flex-direction: column;
}
.post-meta strong { font-size: 0.9rem; }
.post-meta span { font-size: 0.75rem; color: #a1a1aa; }
.post-content {
  font-size: 0.9rem;
  line-height: 1.5;
  margin-bottom: 1rem;
}
.post-footer {
  display: flex;
  border-top: 1px solid rgba(255, 255, 255, 0.08);
  padding-top: 0.5rem;
}
.interaction-btn {
  flex: 1;
  background: none;
  border: none;
  color: #a1a1aa;
  padding: 0.5rem;
  cursor: pointer;
  border-radius: 6px;
  font-weight: 500;
  transition: background 0.2s;
}
.interaction-btn:hover { background: rgba(255, 255, 255, 0.05); color: #fafafa; }

/* Right Sidebar */
.widget {
  padding: 1rem;
}
.widget h3 {
  font-size: 0.95rem;
  margin-bottom: 1rem;
  color: #fafafa;
}
.news-list {
  list-style: none;
  padding: 0;
}
.news-list li {
  margin-bottom: 0.75rem;
}
.news-list strong {
  display: block;
  font-size: 0.85rem;
  font-weight: 500;
  color: #e4e4e7;
}
.news-list span {
  font-size: 0.75rem;
  color: #a1a1aa;
}

@media (max-width: 1024px) {
  .home-grid { grid-template-columns: 1fr 300px; }
  .sidebar-left { display: none; }
}
@media (max-width: 768px) {
  .home-grid { grid-template-columns: 1fr; }
  .sidebar-right { display: none; }
}
</style>
