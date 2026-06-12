<template>
  <div class="app">
    <header class="header" v-if="!isAppLayout">
      <div class="container header-inner">
        <router-link to="/" class="logo">
          <span class="logo-icon">&lt;/&gt;</span>
          <span class="logo-text">Jaime Campillay</span>
        </router-link>
        
        <button class="mobile-menu-btn" @click="isMenuOpen = !isMenuOpen">
          <span class="hamburger" :class="{ 'is-active': isMenuOpen }"></span>
        </button>

        <nav class="nav" :class="{ 'nav-open': isMenuOpen }">
          <router-link to="/" class="nav-link" @click="closeMenu">{{ $t('nav.chat') }}</router-link>
          <router-link to="/portafolio" class="nav-link" @click="closeMenu">{{ $t('nav.portafolio') }}</router-link>
          <router-link to="/contactame" class="nav-link" @click="closeMenu">{{ $t('nav.contact') }}</router-link>
          <router-link to="/sobre-mi" class="nav-link nav-link-avatar" @click="closeMenu">
            <img v-if="avatarUrl" :src="avatarUrl" alt="" class="nav-avatar" />
            <span v-else class="nav-avatar-placeholder">JA</span>
            Sobre Mí
          </router-link>
          <router-link to="/admin" class="nav-link nav-link-admin" @click="closeMenu">{{ $t('nav.admin') }}</router-link>
          <button class="lang-btn" @click="toggleLanguage" :title="currentLang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'">
            {{ currentLang === 'es' ? '🇺🇸 EN' : '🇪🇸 ES' }}
          </button>
        </nav>
      </div>
    </header>
    <main :class="['main', { 'no-padding': isAppLayout }]">
      <router-view />
    </main>
    <footer class="footer" v-if="!isAppLayout">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} Jaime Gabriel Campillay Rojas &mdash; Ingeniero Civil Industrial</p>
      </div>
    </footer>
    <ChatWidget v-if="!isAppLayout && route.path !== '/assistant'" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref } from 'vue'
import { useRoute } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePerfilStore } from './stores/perfil'
import ChatWidget from './components/public/ChatWidget.vue'

const { locale } = useI18n()

const route = useRoute()
const perfilStore = usePerfilStore()
const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || null)
const isMenuOpen = ref(false)

const appRoutes = ['Landing', 'LoginUser', 'RegisterUser', 'HomeFeed', 'AuthCallback']
const isAppLayout = computed(() => appRoutes.includes(route.name))

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
</script>

<style scoped>
.app {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

.header {
  background: var(--color-primary-dark);
  color: #fff;
  padding: 1rem 0;
  position: sticky;
  top: 0;
  z-index: 100;
}

.header-inner {
  display: flex;
  justify-content: space-between;
  align-items: center;
}

.logo {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  color: #fff;
  font-weight: 600;
  font-size: 1.125rem;
}

.logo:hover {
  text-decoration: none;
  opacity: 0.9;
}

.logo-icon {
  font-size: 1.25rem;
  font-weight: 700;
  color: var(--color-accent);
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

.lang-btn {
  background: none;
  border: 1px solid var(--color-gray-600);
  border-radius: var(--radius-sm);
  color: var(--color-gray-300);
  cursor: pointer;
  padding: 0.375rem 0.75rem;
  font-family: inherit;
  font-size: 0.875rem;
  font-weight: 600;
  transition: all 0.15s;
}

.lang-btn:hover {
  border-color: #fff;
  color: #fff;
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
