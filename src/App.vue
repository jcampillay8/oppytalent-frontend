<template>
  <div class="app">
    <header class="navbar glass-panel" v-if="!isAppLayout">
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
          <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
            <router-link :to="chatLink" class="nav-link" @click="closeMenu"><i class="icon-chat"></i> {{ $t('nav.chat') }}</router-link>
            <router-link to="/portafolio" class="nav-link" @click="closeMenu">{{ $t('nav.portafolio') }}</router-link>
            <router-link to="/contactame" class="nav-link" @click="closeMenu">{{ $t('nav.contact') }}</router-link>
            <router-link to="/sobre-mi" class="nav-link nav-link-avatar" @click="closeMenu">
              <img v-if="avatarUrl" :src="avatarUrl" alt="" class="nav-avatar" />
              <span v-else class="nav-avatar-placeholder">👤</span>
              {{ $t('nav.about', { name: portfolioOwnerName }) }}
            </router-link>
          </nav>
        </div>

        <div class="navbar-user">
          <div class="user-dropdown-container" v-if="authStore.token" @click.stop="isDropdownOpen = !isDropdownOpen">
            <button class="dropdown-trigger btn-outline-glass">
              <img v-if="authUserAvatar" :src="authUserAvatar" class="dropdown-avatar" />
              <span v-else class="dropdown-avatar-placeholder">{{ authUserInitials }}</span>
              <span class="dropdown-arrow">▼</span>
            </button>
            
            <div class="user-dropdown-menu glass-panel" v-if="isDropdownOpen" @click.stop>
              <router-link to="/admin" class="dropdown-item" @click="isDropdownOpen = false">
                <span class="icon">👤</span> {{ $t('nav.admin') }}
              </router-link>
              <router-link :to="`/${authStore.user?.username?.split('@')[0] || ''}`" class="dropdown-item" @click="isDropdownOpen = false">
                <span class="icon">🤖</span> Mi Chat IA
              </router-link>
              <button class="dropdown-item" @click="goToMyPortfolio">
                <span class="icon">💼</span> Mi Portafolio
              </button>
              <div class="dropdown-divider"></div>
              <button class="dropdown-item text-danger" @click="handleLogout">
                <span class="icon">🚪</span> Cerrar Sesión
              </button>
            </div>
          </div>
          <button class="lang-btn btn-outline-glass" @click="toggleLanguage" :title="currentLang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'">
            {{ currentLang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES' }}
          </button>
          
          <button class="mobile-menu-btn" @click="isMenuOpen = !isMenuOpen">
            <span class="hamburger" :class="{ 'is-active': isMenuOpen }"></span>
          </button>
        </div>
      </div>
    </header>
    <main :class="['main', { 'no-padding': isAppLayout }]">
      <router-view />
    </main>
    <footer class="footer" v-if="!isAppLayout">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} OppyTalent - jcampillay.com</p>
      </div>
    </footer>
    <ChatWidget v-if="!isAppLayout && route.path !== '/assistant'" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePerfilStore } from './stores/perfil'
import { useAuthStore } from './stores/auth'
import ChatWidget from './components/public/ChatWidget.vue'
import { api } from './services/api'

const { locale } = useI18n()

const route = useRoute()
const router = useRouter()
const perfilStore = usePerfilStore()
const authStore = useAuthStore()
const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || null)
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const portfolioOwnerName = ref('el Talento')
const currentLang = computed(() => locale.value)

const authUserAvatar = computed(() => authStore.user?.userImage || authStore.user?.avatar_url)
const authUserInitials = computed(() => {
  if (!authStore.user) return 'U'
  return ((authStore.user.firstName || authStore.user.username || 'U').charAt(0) + (authStore.user.lastName || '').charAt(0)).toUpperCase()
})

onMounted(async () => {
  document.addEventListener('click', () => { isDropdownOpen.value = false })
  
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (e) {
      console.warn("Failed to fetch auth user:", e)
    }
  }
  
  perfilStore.fetchAll()
})

watch(() => route.path, async () => {
  const username = route.params.username || localStorage.getItem('currentPortfolioUser')
  if (username) {
    try {
      const user = await api.getUserByUsername(username)
      portfolioOwnerName.value = user.firstName || user.username
    } catch(e) {}
  }
}, { immediate: true })

const appRoutes = ['Landing', 'LoginUser', 'RegisterUser', 'HomeFeed', 'AuthCallback']
const isAppLayout = computed(() => appRoutes.includes(route.name))

const searchQuery = ref('')
const searchResults = ref([])
const showResults = ref(false)
const isSearching = ref(false)
let searchTimeout = null
let blurTimeout = null

function onSearch() {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (!searchQuery.value.trim()) {
    searchResults.value = []
    isSearching.value = false
    return
  }
  isSearching.value = true
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

function goToMyPortfolio() {
  if (authStore.user?.username) {
    const username = authStore.user.username.split('@')[0]
    localStorage.setItem('currentPortfolioUser', username)
  }
  isDropdownOpen.value = false
  router.push('/portafolio')
}

const chatLink = computed(() => {
  const _ = route.path // Reactividad forzada
  const saved = localStorage.getItem('currentPortfolioUser')
  return route.params.username ? `/${route.params.username}` : (saved ? `/${saved}` : '/')
})

function closeMenu() {
  isMenuOpen.value = false
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('user-language', locale.value)
}


onMounted(() => {
  perfilStore.fetchAll()
})

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (blurTimeout) clearTimeout(blurTimeout)
  document.removeEventListener('click', () => { isDropdownOpen.value = false })
})
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.navbar {
  position: sticky;
  top: 0;
  left: 0;
  right: 0;
  height: 4rem;
  display: grid;
  grid-template-columns: 1fr minmax(auto, 400px) 1fr;
  align-items: center;
  padding: 0 2rem;
  z-index: 100;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.glass-panel {
  background: var(--color-gray-100);
  border: 1px solid var(--color-gray-200);
  border-radius: 12px;
  opacity: 0.95;
  box-shadow: 0 4px 6px -1px rgba(0, 0, 0, 0.1);
}

.navbar-brand {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.logo {
  font-size: 1.25rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: var(--color-gray-900);
  text-decoration: none;
}
.logo span { color: var(--color-accent); }

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
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: 8px;
  padding: 0.5rem 1rem;
  color: var(--color-gray-900);
  font-family: inherit;
  font-size: 0.9rem;
  transition: all 0.2s;
}

.search-input:focus {
  outline: none;
  background: var(--color-gray-100);
  border-color: var(--color-accent);
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
  color: var(--color-gray-500);
  font-size: 0.85rem;
}

.search-result-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  text-decoration: none;
  color: var(--color-gray-900);
  transition: background 0.2s;
}

.search-result-item:hover {
  background: var(--color-gray-200);
}

.search-avatar {
  width: 36px;
  height: 36px;
  border-radius: 50%;
  background: var(--color-accent);
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
  color: var(--color-gray-500);
}

.navbar-right-container {
  display: flex;
  align-items: center;
  justify-content: flex-end;
  gap: 2rem;
}

.navbar-menu {
  display: flex;
  gap: 2rem;
}

.navbar-user {
  display: flex;
  align-items: center;
  gap: 1rem;
}

.nav {
  display: flex;
  gap: 1.5rem;
}

.nav-link {
  padding: 0.375rem 0;
  color: var(--color-gray-500);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover {
  color: var(--color-gray-900);
  text-decoration: none;
}

.nav-link-avatar {
  display: flex;
  align-items: center;
  gap: 0.5rem;
}

.nav-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
  border: 2px solid var(--color-gray-600);
  flex-shrink: 0;
}

.nav-avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-gray-700);
  color: var(--color-gray-400);
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.625rem;
  font-weight: 600;
  flex-shrink: 0;
}

.nav-link-admin {
  padding: 0.375rem 0.75rem;
  border: 1px solid var(--color-gray-600);
  border-radius: var(--radius-sm);
}

.btn-outline-glass {
  background: transparent;
  border: 1px solid rgba(255, 255, 255, 0.2);
  color: white;
  padding: 0.4rem 0.8rem;
  border-radius: 6px;
  cursor: pointer;
  font-size: 0.85rem;
  font-weight: 500;
  transition: all 0.2s;
}

.btn-outline-glass:hover {
  background: rgba(255, 255, 255, 0.1);
  color: #fff;
  border-color: rgba(255, 255, 255, 0.3);
}

.main {
  flex: 1;
  padding: 2rem 0;
}

.main.no-padding {
  padding: 0;
}

.footer {
  background: rgba(24, 24, 27, 0.7);
  backdrop-filter: blur(16px);
  border-top: 1px solid rgba(255, 255, 255, 0.1);
  color: var(--color-gray-400);
  padding: 1.5rem 0;
  text-align: center;
  font-size: 0.875rem;
}

/* Mobile Menu Styles */
.mobile-menu-btn {
  display: none;
  background: none;
  border: none;
  cursor: pointer;
  padding: 0.5rem;
  z-index: 101;
}

.hamburger {
  display: block;
  width: 24px;
  height: 2px;
  background: #fff;
  position: relative;
  transition: all 0.3s;
}

.hamburger::before,
.hamburger::after {
  content: '';
  position: absolute;
  width: 24px;
  height: 2px;
  background: #fff;
  left: 0;
  transition: all 0.3s;
}

.hamburger::before {
  top: -8px;
}

.hamburger::after {
  bottom: -8px;
}

.hamburger.is-active {
  background: transparent;
}

.hamburger.is-active::before {
  transform: rotate(45deg);
  top: 0;
}

.hamburger.is-active::after {
  transform: rotate(-45deg);
  bottom: 0;
}

@media (max-width: 768px) {
  .mobile-menu-btn {
    display: block;
  }

  .nav {
    position: absolute;
    top: 100%;
    left: 0;
    right: 0;
    background: var(--color-primary-dark);
    flex-direction: column;
    padding: 1rem;
    gap: 1rem;
    clip-path: polygon(0 0, 100% 0, 100% 0, 0 0);
    transition: clip-path 0.3s ease-in-out;
    border-bottom: 1px solid var(--color-gray-800);
  }

  .nav.nav-open {
    clip-path: polygon(0 0, 100% 0, 100% 100%, 0 100%);
  }

  .nav-link {
    font-size: 1rem;
    padding: 0.5rem 0;
  }
}
</style>

<style>
/* Dropdown Styles */
.user-dropdown-container {
  position: relative;
  display: inline-block;
  margin-right: 0.5rem;
}

.dropdown-trigger {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.25rem 0.5rem;
  border-radius: 20px;
  cursor: pointer;
  background: rgba(255, 255, 255, 0.05);
  transition: all 0.2s ease;
}

.dropdown-trigger:hover {
  background: rgba(255, 255, 255, 0.1);
}

.dropdown-avatar {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  object-fit: cover;
}

.dropdown-avatar-placeholder {
  width: 28px;
  height: 28px;
  border-radius: 50%;
  background: var(--color-primary);
  color: #fff;
  display: flex;
  align-items: center;
  justify-content: center;
  font-size: 0.75rem;
  font-weight: bold;
}

.dropdown-arrow {
  font-size: 0.6rem;
  color: var(--color-gray-500);
}

.user-dropdown-menu {
  position: absolute;
  top: calc(100% + 0.5rem);
  right: 0;
  min-width: 200px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  box-shadow: var(--shadow-lg);
  padding: 0.5rem 0;
  z-index: 1000;
  display: flex;
  flex-direction: column;
}

.dropdown-item {
  display: flex;
  align-items: center;
  gap: 0.75rem;
  padding: 0.75rem 1rem;
  color: var(--color-gray-800);
  text-decoration: none;
  font-size: 0.875rem;
  font-weight: 500;
  transition: background 0.15s ease, color 0.15s ease;
  background: transparent;
  border: none;
  width: 100%;
  text-align: left;
  cursor: pointer;
}

.dropdown-item:hover {
  background: var(--color-gray-100);
  color: var(--color-accent);
  text-decoration: none;
}

.dropdown-item .icon {
  font-size: 1.1rem;
}

.dropdown-divider {
  height: 1px;
  background: var(--color-gray-200);
  margin: 0.5rem 0;
}

.text-danger {
  color: var(--color-danger);
}
.text-danger:hover {
  color: #dc2626;
  background: rgba(239, 68, 68, 0.1);
}
</style>
