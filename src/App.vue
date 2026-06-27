<template>
  <div class="app">
    <!-- Impersonation Banner -->
    <div v-if="authStore.user?.isImpersonating" class="bg-amber-500 text-white px-4 py-2 flex items-center justify-between text-sm font-medium shadow-md z-[100] relative">
      <div class="flex items-center gap-2">
        <span>⚠️ Estás navegando bajo un rol simulado (Impersonate). Tus acciones afectan a este rol.</span>
      </div>
      <div class="flex items-center gap-3">
        <button @click="handleQaResetCredits" :disabled="authStore.loading" class="flex items-center gap-1 bg-white/20 hover:bg-white/30 px-3 py-1 rounded-md transition-colors">
          <Zap :size="14" /> Recargar 10 Créditos (QA)
        </button>
        <button @click="handleRestoreRole" :disabled="authStore.loading" class="flex items-center gap-1 bg-black/20 hover:bg-black/30 px-3 py-1 rounded-md transition-colors">
          Volver al Modo Owner
        </button>
      </div>
    </div>

    <header class="sticky top-0 z-50 w-full border-b border-border/40 bg-background/80 backdrop-blur-xl" v-if="!isAppLayout">
      <div class="flex h-16 w-full items-center justify-between px-4 md:px-8">
        
        <!-- Logo -->
        <router-link :to="isHunter ? '/b2b' : '/home'" class="flex items-center gap-2 font-bold text-xl tracking-tight transition-colors hover:text-primary">
          <div class="h-8 w-8 rounded-lg bg-primary/10 border border-primary/20 flex items-center justify-center text-primary">
            <Zap :size="18" />
          </div>
          <span class="text-foreground flex items-center">
            Oppy<span class="text-primary">Talent</span>
            <span v-if="isHunter" class="ml-2 px-2 py-0.5 rounded-full border border-primary/30 bg-primary/10 text-[10px] font-semibold text-primary uppercase tracking-wider hidden sm:inline-block">For Business</span>
          </span>
        </router-link>
      
        <!-- Search Spotlight -->
        <div class="hidden md:flex flex-1 items-center justify-center px-6">
          <SearchSpotlight 
            v-model="searchQuery"
            :results="searchResults"
            :is-loading="isSearching"
            @focus="showResults = true"
            @close="showResults = false"
            @update:modelValue="onSearch"
          />
        </div>

        <!-- Right Side Nav -->
        <div class="flex items-center gap-4">
          <!-- Desktop Nav (Hunter) -->
          <nav v-if="isHunter" class="hidden md:flex items-center gap-6 text-sm font-medium">
            <router-link to="/b2b" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Search :size="16" /> Buscador
            </router-link>
            <router-link to="/b2b/pipeline" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Users :size="16" /> Mis Talentos
            </router-link>
            <router-link to="/b2b/tribunal" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Scale :size="16" /> Tribunal IA
            </router-link>
            <router-link to="/b2b/metrics" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Activity :size="16" /> Métricas B2B
            </router-link>
          </nav>

          <!-- Desktop Nav (Talent) -->
          <nav v-else class="hidden md:flex items-center gap-6 text-sm font-medium">
            <router-link :to="chatLink" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <MessageSquare :size="16" /> {{ $t('nav.chat') }}
            </router-link>
            <router-link to="/portafolio" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Briefcase :size="16" /> {{ $t('nav.portafolio') }}
            </router-link>
            <router-link to="/contactame" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <Mail :size="16" /> {{ $t('nav.contact') }}
            </router-link>

            <router-link to="/sobre-mi" class="flex items-center gap-2 text-muted-foreground hover:text-primary transition-colors">
              <img v-if="avatarUrl" :src="avatarUrl" alt="" class="h-6 w-6 rounded-full border border-border object-cover" />
              <User v-else :size="16" />
              {{ $t('nav.about', { name: portfolioOwnerName }) }}
            </router-link>
          </nav>

          <!-- User Menu & Lang -->
          <div class="flex items-center gap-3">
            <!-- P2P Inbox/Contact Controls -->
            <template v-if="!authStore.token && isPortfolioView">
              <button @click="router.push('/login')" class="hidden sm:flex items-center gap-1.5 bg-primary/10 hover:bg-primary/20 text-primary border border-primary/20 px-3 py-1.5 rounded-md text-sm font-medium transition-colors">
                <MessageSquare :size="14" /> Contactar
              </button>
            </template>
            <template v-else-if="authStore.token">
              <button 
                v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== portfolioUsername" 
                @click="contactTalent" 
                class="hidden sm:flex items-center gap-1.5 bg-primary text-primary-foreground hover:bg-primary/90 px-3 py-1.5 rounded-md text-sm font-medium transition-colors shadow-sm"
              >
                <MessageSquare :size="14" /> Chat {{ portfolioOwnerName || portfolioUsername }}
              </button>
              <ConnectionButton 
                v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== portfolioUsername && portfolioUserObj"
                :userId="portfolioUserObj.id"
                class="hidden sm:flex"
              />

              <router-link :to="`/${authStore.user?.username?.split('@')[0] || 'admin'}/inbox`" class="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors mr-1" title="Mensajes">
                <MessageSquare :size="18" />
                <span 
                  v-if="chatStore.unreadCount > 0"
                  class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-destructive text-[10px] font-bold text-white rounded-full shadow-md animate-in zoom-in"
                >
                  {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
                </span>
              </router-link>

              <button class="relative p-1.5 text-muted-foreground hover:text-foreground transition-colors mr-1" title="Notificaciones">
                <Bell :size="18" />
              </button>

            </template>

            <!-- Separator -->
            <div class="hidden sm:block h-5 w-px bg-border/60 mx-1"></div>

            <button @click="toggleLanguage" :title="currentLang === 'es' ? 'Cambiar a Inglés' : 'Switch to Spanish'" class="h-9 px-2 rounded-md hover:bg-secondary text-sm font-medium transition-colors border border-transparent hover:border-border">
              {{ currentLang === 'es' ? '🇪🇸 ES' : '🇺🇸 EN' }}
            </button>

            <!-- User Dropdown via AnimatedDropdown Component -->
            <AnimatedDropdown v-if="authStore.token" align="right">
              <template #trigger>
                <div class="h-9 w-9 rounded-full bg-secondary border border-border flex items-center justify-center overflow-hidden hover:ring-2 hover:ring-primary/20 transition-all cursor-pointer">
                  <img v-if="authUserAvatar" :src="authUserAvatar" class="h-full w-full object-cover" />
                  <span v-else class="text-xs font-bold text-muted-foreground">{{ authUserInitials }}</span>
                </div>
              </template>
              <template #content="{ close }">
                <div class="flex flex-col space-y-1 p-1">
                  <!-- Mostrar Dashboard Admin solo si NO es Hunter, o si tiene los permisos explícitos y no estamos en la vista B2B -->
                  <button v-if="authStore.user?.permissions?.includes('can_edit_portfolio') && !isHunter" @click="goToAdmin(); close()" class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                    <LayoutDashboard :size="16" /> {{ $t('nav.admin') }}
                  </button>
                  
                  <!-- Dropdown Hunter -->
                  <template v-if="isHunter">
                    <router-link to="/b2b/admin" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors" @click="close">
                      <Building2 :size="16" /> {{ $t('app_dropdown.my_company') }}
                    </router-link>
                    <button class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors" @click="close">
                      <CreditCard :size="16" /> {{ $t('app_dropdown.subscription') }}
                    </button>
                  </template>

                  <!-- Dropdown Talent -->
                  <template v-else>
                    <router-link :to="`/${authStore.user?.username?.split('@')[0] || ''}`" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors" @click="close">
                      <Bot :size="16" /> {{ $t('app_dropdown.my_ai_chat') }}
                    </router-link>
                    <button @click="goToMyPortfolio(); close()" class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors">
                      <Briefcase :size="16" /> {{ $t('app_dropdown.my_portfolio') }}
                    </button>
                    <router-link :to="`/${authStore.user?.username?.split('@')[0] || ''}/compartir`" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors text-primary font-medium" @click="close">
                      <Share2 :size="16" /> {{ $t('app_dropdown.share') }}
                    </router-link>
                    <router-link to="/network" class="flex items-center gap-2 px-3 py-2 text-sm rounded-lg hover:bg-secondary transition-colors" @click="close">
                      <Users :size="16" /> {{ $t('app_dropdown.my_network') }}
                      <span v-if="networkStore.pendingCount > 0" class="ml-auto bg-amber-500 text-white text-[10px] font-bold px-1.5 py-0.5 rounded-full">{{ networkStore.pendingCount }}</span>
                    </router-link>
                  </template>

                  <div class="h-px bg-border my-1"></div>
                  
                  <!-- Impersonation Dropdown Section -->
                  <div v-if="authStore.user?.permissions?.includes('can_impersonate')" class="px-2 py-1">
                    <div class="text-xs font-semibold text-muted-foreground uppercase tracking-wider mb-1 px-1">{{ $t('app_dropdown.impersonate_as') }}</div>
                    <button 
                      v-for="role in availableRoles" 
                      :key="role.id"
                      @click="handleQuickImpersonate(role.id); close()"
                      class="flex items-center gap-2 w-full text-left px-2 py-1.5 text-xs rounded-md hover:bg-amber-500/10 hover:text-amber-500 transition-colors"
                    >
                      <VenetianMask :size="14" /> {{ role.name }}
                    </button>
                  </div>
                  <div v-if="authStore.user?.permissions?.includes('can_impersonate')" class="h-px bg-border my-1"></div>

                  <button @click="handleLogout(); close()" class="flex items-center gap-2 w-full text-left px-3 py-2 text-sm rounded-lg text-destructive hover:bg-destructive/10 transition-colors">
                    <LogOut :size="16" /> {{ $t('app_dropdown.logout') }}
                  </button>
                </div>
              </template>
            </AnimatedDropdown>

            <template v-if="!authStore.token">
              <router-link to="/login" class="text-sm font-medium text-foreground hover:text-primary transition-colors ml-2 hidden sm:block">
                {{ $t('app_dropdown.login') }}
              </router-link>
            </template>

            <button class="md:hidden p-2 text-foreground hover:text-primary transition-colors" @click="isMenuOpen = !isMenuOpen">
              <Menu :size="24" />
            </button>
          </div>
        </div>
      </div>

      <!-- Mobile Menu -->
      <div v-if="isMenuOpen" class="md:hidden border-t border-border bg-card/95 backdrop-blur-lg">
        <nav class="flex flex-col p-4 space-y-4">
          <div class="px-2">
            <SearchSpotlight 
              v-model="searchQuery"
              :results="searchResults"
              :is-loading="isSearching"
              @focus="showResults = true"
              @close="showResults = false; isMenuOpen = false"
              @update:modelValue="onSearch"
            />
          </div>
          <!-- Mobile Menu Hunter -->
          <template v-if="isHunter">
            <router-link to="/b2b" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Search :size="20" /> Buscador
            </router-link>
            <router-link to="/b2b/pipeline" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Users :size="20" /> Mis Talentos
            </router-link>
            <router-link to="/b2b/tribunal" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Scale :size="20" /> Tribunal IA
            </router-link>
            <router-link to="/b2b/metrics" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Activity :size="20" /> Métricas B2B
            </router-link>
          </template>

          <!-- Mobile Menu Talent -->
          <template v-else>
            <!-- Mobile Contactar (Unauthenticated) -->
            <button v-if="!authStore.token && isPortfolioView" @click="closeMenu(); router.push('/login')" class="flex items-center justify-center gap-2 w-full bg-primary/10 text-primary px-4 py-3 rounded-lg font-medium border border-primary/20">
              <MessageSquare :size="18" /> Contactar
            </button>
            
            <!-- Mobile Contactar (Authenticated) -->
            <button v-if="authStore.token && isPortfolioView && authStore.user?.username.split('@')[0] !== portfolioUsername" @click="closeMenu(); contactTalent()" class="flex items-center justify-center gap-2 w-full bg-primary text-primary-foreground px-4 py-3 rounded-lg font-medium shadow-sm mb-2">
              <MessageSquare :size="18" /> Chat {{ portfolioOwnerName || portfolioUsername }}
            </button>
            <ConnectionButton 
              v-if="authStore.token && isPortfolioView && authStore.user?.username.split('@')[0] !== portfolioUsername && portfolioUserObj"
              :userId="portfolioUserObj.id"
              class="w-full py-3 justify-center mb-2"
            />

            <!-- Inbox Link for Mobile -->
            <router-link v-if="authStore.token" :to="`/${authStore.user?.username?.split('@')[0] || 'admin'}/inbox`" class="flex items-center justify-between px-2 py-2 text-muted-foreground" @click="closeMenu">
              <div class="flex items-center gap-3">
                <MessageSquare :size="20" /> Mensajes
              </div>
              <span v-if="chatStore.unreadCount > 0" class="bg-destructive text-white text-xs px-2 py-0.5 rounded-full">{{ chatStore.unreadCount }}</span>
            </router-link>

            <!-- Notifications Link for Mobile -->
            <button v-if="authStore.token" class="flex items-center justify-between px-2 py-2 text-muted-foreground w-full text-left" @click="closeMenu">
              <div class="flex items-center gap-3">
                <Bell :size="20" /> Notificaciones
              </div>
            </button>

            <!-- Network Link for Mobile -->
            <router-link v-if="authStore.token" to="/network" class="flex items-center justify-between px-2 py-2 text-muted-foreground" @click="closeMenu">
              <div class="flex items-center gap-3">
                <Users :size="20" /> Red Profesional
              </div>
              <span v-if="networkStore.pendingCount > 0" class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{{ networkStore.pendingCount }}</span>
            </router-link>

            <router-link :to="chatLink" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <MessageSquare :size="20" /> {{ $t('nav.chat') }}
            </router-link>
            <router-link to="/portafolio" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Briefcase :size="20" /> {{ $t('nav.portafolio') }}
            </router-link>
            <router-link to="/contactame" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <Mail :size="20" /> {{ $t('nav.contact') }}
            </router-link>

            <router-link to="/sobre-mi" class="flex items-center gap-3 px-2 py-2 text-muted-foreground" @click="closeMenu">
              <User :size="20" /> {{ $t('nav.about', { name: portfolioOwnerName }) }}
            </router-link>
          </template>
        </nav>
      </div>
    </header>
    <main :class="['main', { 'no-padding': isAppLayout || isAdminRoute || isFullHeightRoute }]">
      <router-view />
    </main>
    <footer class="footer" v-if="!isAppLayout">
      <div class="container">
        <p>&copy; {{ new Date().getFullYear() }} OppyTalent - jcampillay.com</p>
      </div>
    </footer>
    <ChatWidget v-if="!isAppLayout && !isAdminRoute && !isFullHeightRoute" />
  </div>
</template>

<script setup>
import { computed, onMounted, ref, onUnmounted, watch } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { usePerfilStore } from './stores/perfil'
import { useAuthStore } from './stores/auth'
import { useNetworkStore } from './stores/network'
import { useThemeStore } from './stores/useThemeStore'
import ChatWidget from './components/public/ChatWidget.vue'
import ConnectionButton from './components/ui/ConnectionButton.vue'
import AnimatedDropdown from './components/ui/AnimatedDropdown.vue'
import SearchSpotlight from './components/ui/SearchSpotlight.vue'
import { useChatP2PStore } from './stores/chat_p2p'
import { api } from './services/api'
import { Zap, MessageSquare, Briefcase, Mail, User, LayoutDashboard, Bot, LogOut, Menu, ArrowLeft, AlertTriangle, VenetianMask, Search, Users, Scale, Activity, Building2, CreditCard, Bell, Network, Share2 } from 'lucide-vue-next'

const { locale } = useI18n()

const route = useRoute()
const router = useRouter()
const perfilStore = usePerfilStore()
const authStore = useAuthStore()
const chatStore = useChatP2PStore()
const networkStore = useNetworkStore()

const isHunter = computed(() => authStore.user?.role_name?.toUpperCase() === 'HUNTER')
const avatarUrl = computed(() => perfilStore.items[0]?.avatar_url || null)
const isMenuOpen = ref(false)
const isDropdownOpen = ref(false)
const portfolioOwnerName = ref('el Talento')
const currentLang = computed(() => locale.value)

const isPortfolioView = computed(() => route.name === 'UserPortfolio' || !!route.params.username)
const portfolioUsername = computed(() => route.params.username || localStorage.getItem('currentPortfolioUser'))

const authUserAvatar = computed(() => authStore.user?.userImage || authStore.user?.avatar_url)
const authUserInitials = computed(() => {
  if (!authStore.user) return 'U'
  return ((authStore.user.firstName || authStore.user.username || 'U').charAt(0) + (authStore.user.lastName || '').charAt(0)).toUpperCase()
})

const availableRoles = ref([])

onMounted(async () => {
  // Inicializar el sistema de temas (OppyTec Style)
  const themeStore = useThemeStore()
  themeStore.initTheme()

  document.addEventListener('click', () => { isDropdownOpen.value = false })
  
  if (authStore.token && !authStore.user) {
    try {
      await authStore.fetchUser()
    } catch (e) {
      console.warn("Failed to fetch auth user:", e)
    }
  }

  if (authStore.user?.permissions?.includes('can_impersonate')) {
    try {
      availableRoles.value = await api.getRoles()
    } catch(e) {}
  }
  
  watch(() => authStore.token, (newToken) => {
    if (newToken) {
      chatStore.startPolling()
      networkStore.startPolling()
    } else {
      chatStore.stopPolling()
      networkStore.stopPolling()
    }
  }, { immediate: true })
})

const portfolioUserObj = ref(null)

watch(() => route.path, async () => {
  const username = route.params.username || localStorage.getItem('currentPortfolioUser')
  if (username) {
    try {
      const user = await api.getUserByUsername(username)
      portfolioUserObj.value = user
      portfolioOwnerName.value = user.firstName || user.username
      // Fetch only the profile of the target user
      await perfilStore.fetchAll(`?username=${username}`)
    } catch(e) {}
  }
}, { immediate: true })

const appRoutes = ['Landing', 'Features', 'TalentInfo', 'B2BInfo', 'Pricing', 'AboutOppy', 'LoginUser', 'RegisterUser', 'AuthCallback', 'Showcase']
const isAppLayout = computed(() => appRoutes.includes(route.name))

const adminRoutes = [
  'Dashboard', 'CVWizard', 'ProyectosAdmin', 'ExperienciasAdmin', 
  'EstudiosAdmin', 'ReconocimientosAdmin', 'HabilitacionesAdmin', 
  'PerfilAdmin', 'SeccionesAdmin', 'FrasesAdmin', 
  'ChatLogsAdmin', 'ChatConfigAdmin', 'ThemeConfigAdmin', 
  'PlanConsumoAdmin', 'RBACAdmin', 'NetworkHub', 'ShareAdmin'
]
const isAdminRoute = computed(() => adminRoutes.includes(route.name))

const fullHeightRoutes = ['UserPortfolio', 'AI Assistant', 'Inbox', 'HomeFeed']
const isFullHeightRoute = computed(() => fullHeightRoutes.includes(route.name))

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

function goToAdmin() {
  if (authStore.user?.username) {
    const username = authStore.user.username.split('@')[0]
    localStorage.setItem('currentPortfolioUser', username)
  }
  isDropdownOpen.value = false
  router.push('/admin')
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
}

function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('user-language', locale.value)
}

async function handleQaResetCredits() {
  if (confirm("¿Estás seguro de inyectar 10 créditos QA usando tus privilegios originales?")) {
    try {
      await api.qaResetCredits();
      alert("Créditos recargados con éxito.");
      await authStore.fetchUser();
    } catch(e) {
      alert("Error al recargar créditos: " + e.message);
    }
  }
}

async function handleRestoreRole() {
  await authStore.restoreRole();
  router.push('/admin');
}

async function handleQuickImpersonate(roleId) {
  try {
    await authStore.impersonate(roleId);
    router.push('/b2b');
  } catch(e) {
    alert("Error al impersonar: " + e.message);
  }
}

async function contactTalent() {
  const targetUsername = portfolioUsername.value
  if (!targetUsername) return
  
  try {
    await api.startChatConversation(targetUsername)
    const myUser = authStore.user?.username?.split('@')[0] || 'admin'
    router.push(`/${myUser}/inbox?chat=${targetUsername}`)
  } catch (err) {
    console.error("Error iniciando chat:", err)
  }
}

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
  z-index: 100;
  border-radius: 0;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
  background: rgba(24, 24, 27, 0.8);
  backdrop-filter: blur(12px);
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
