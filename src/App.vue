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
                  <span v-else>{{ user.firstName.charAt(0) }}{{ user.lastName.charAt(0) }}</span>
                </div>
                <div class="search-info">
                  <strong>{{ user.firstName }} {{ user.lastName }}</strong>
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
              Sobre Mí
            </router-link>
          </nav>
        </div>

        <div class="navbar-user">
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
import { computed, onMounted, ref, onUnmounted } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePerfilStore } from './stores/perfil'
import ChatWidget from './components/public/ChatWidget.vue'
import { api } from './services/api'

const { locale } = useI18n()

const route = useRoute()
const perfilStore = usePerfilStore()
const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || null)
const isMenuOpen = ref(false)

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

const chatLink = computed(() => {
  const _ = route.path // Reactividad forzada
  const saved = localStorage.getItem('currentPortfolioUser')
  return route.params.username ? `/${route.params.username}` : (saved ? `/${saved}` : '/')
})

function closeMenu() {
  isMenuOpen.value = false
}

function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('user-language', locale.value)
}

const currentLang = computed(() => locale.value)

onMounted(() => {
  perfilStore.fetchAll()
})

onUnmounted(() => {
  if (searchTimeout) clearTimeout(searchTimeout)
  if (blurTimeout) clearTimeout(blurTimeout)
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
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.08);
  border-radius: 12px;
  backdrop-filter: blur(16px);
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
  color: white;
  text-decoration: none;
}
.logo span { color: #3b82f6; }

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
  color: var(--color-gray-300);
  font-size: 0.875rem;
  font-weight: 500;
  transition: color 0.15s;
}

.nav-link:hover {
  color: #fff;
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
  background: var(--color-gray-900);
  color: var(--color-gray-500);
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
