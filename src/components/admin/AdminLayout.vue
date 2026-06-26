<template>
  <div class="flex h-[calc(100vh-4rem)] bg-background overflow-hidden selection:bg-primary/20">
    <!-- Mobile Sidebar Backdrop -->
    <Transition
      enter-active-class="transition-opacity duration-300"
      enter-from-class="opacity-0"
      enter-to-class="opacity-100"
      leave-active-class="transition-opacity duration-300"
      leave-from-class="opacity-100"
      leave-to-class="opacity-0"
    >
      <div
        v-if="isOpenMobile"
        @click="isOpenMobile = false"
        class="fixed inset-0 bg-background/80 backdrop-blur-sm z-[100] md:hidden"
      ></div>
    </Transition>

    <!-- Sidebar -->
    <aside
      class="fixed md:relative top-0 left-0 bottom-0 z-[100] md:z-10 flex flex-col transition-all duration-300 ease-in-out border-r border-border shadow-2xl md:shadow-none bg-card/80 backdrop-blur-xl"
      :class="[
        isCollapsed ? 'md:w-[80px]' : 'md:w-[260px]',
        isOpenMobile ? 'translate-x-0 w-[280px]' : '-translate-x-full md:translate-x-0'
      ]"
    >
      <!-- Header -->
      <div class="relative flex items-center h-20 px-4 border-b border-border transition-all group/header">
        <button
          @click="isCollapsed = !isCollapsed"
          class="absolute -right-3 top-1/2 -translate-y-1/2 hidden md:flex h-6 w-6 items-center justify-center rounded-full border border-border bg-card text-muted-foreground hover:text-primary transition-all opacity-0 group-hover/header:opacity-100 shadow-sm z-50"
        >
          <ChevronRight v-if="isCollapsed" :size="14" />
          <ChevronLeft v-else :size="14" />
        </button>

        <div class="flex items-center gap-3 w-full overflow-hidden">
          <div class="flex-shrink-0 flex items-center justify-center h-10 w-10 rounded-xl bg-primary/10 border border-primary/20 text-primary shadow-inner">
            <LayoutDashboard :size="20" />
          </div>
          <div
            class="flex flex-col whitespace-nowrap transition-all duration-300 ease-in-out"
            :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100 w-auto'"
          >
            <span class="text-[10px] font-semibold text-primary uppercase tracking-[0.2em] leading-none">Admin</span>
            <span class="font-bold text-base tracking-tight uppercase text-foreground">OppyTalent</span>
          </div>
        </div>

        <button @click="isOpenMobile = false" class="md:hidden text-muted-foreground hover:text-foreground">
          <X :size="20" />
        </button>
      </div>

      <!-- Navigation -->
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1 sidebar-scrollbar">
        <div v-for="item in menuItems" :key="item.path || item.label" class="relative group">
          
          <!-- Normal Link -->
          <router-link
            v-if="!item.children"
            :to="item.path"
            class="flex items-center gap-4 px-3 h-11 rounded-xl transition-all duration-200 cursor-pointer outline-none"
            :style="{ '--item-color': item.color, '--item-rgb': item.rgb }"
            :class="[
              isActive(item.path)
                ? 'bg-[var(--item-color)] text-white shadow-md shadow-[rgba(var(--item-rgb),0.3)]'
                : 'text-muted-foreground hover:text-[var(--item-color)] hover:bg-[rgba(var(--item-rgb),0.1)]'
            ]"
            @click="isOpenMobile = false"
          >
            <!-- Active Indicator Pill -->
            <div
              v-if="isActive(item.path)"
              class="absolute left-0 w-1 h-5 bg-white rounded-r-full"
            ></div>

            <div class="relative shrink-0 w-8 flex justify-center">
              <component
                :is="item.icon"
                :size="20"
                class="transition-colors"
                :class="isActive(item.path) ? 'text-white' : 'text-zinc-400 group-hover:text-[var(--item-color)]'"
              />
            </div>
            
            <span
              class="font-medium text-sm whitespace-nowrap transition-all duration-300 flex-1"
              :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100'"
            >
              {{ item.label }}
            </span>
            
            <!-- Unread Badge -->
            <div 
              v-if="item.id === 'inbox' && chatStore.unreadCount > 0 && (!isCollapsed || isOpenMobile)"
              class="ml-auto bg-destructive text-destructive-foreground text-[10px] font-bold px-2 py-0.5 rounded-full flex items-center justify-center min-w-[20px] shadow-sm animate-pulse"
            >
              {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
            </div>
            <!-- Collapsed Badge Indicator -->
            <div 
              v-if="item.id === 'inbox' && chatStore.unreadCount > 0 && isCollapsed && !isOpenMobile"
              class="absolute top-2 right-2 w-2.5 h-2.5 bg-destructive rounded-full animate-pulse shadow-sm"
            ></div>
          </router-link>

          <!-- Dropdown Group -->
          <div v-else class="flex flex-col">
            <button
              @click="toggleMenu(item.id)"
              class="flex items-center justify-between px-3 h-11 rounded-xl transition-all duration-200 cursor-pointer outline-none text-muted-foreground hover:bg-secondary w-full"
            >
              <div class="flex items-center gap-4">
                <div class="relative shrink-0 w-8 flex justify-center">
                  <component :is="item.icon" :size="20" class="text-zinc-400" />
                </div>
                <span
                  class="font-medium text-sm whitespace-nowrap transition-all duration-300"
                  :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100'"
                >
                  {{ item.label }}
                </span>
              </div>
              <ChevronDown 
                v-if="!isCollapsed || isOpenMobile" 
                :size="16" 
                class="transition-transform duration-300" 
                :class="{ 'rotate-180': openMenus.includes(item.id) }" 
              />
            </button>
            
            <!-- Children Links (Animated) -->
            <div 
              class="grid transition-[grid-template-rows] duration-300 ease-[cubic-bezier(0.4,0,0.2,1)]"
              :class="openMenus.includes(item.id) && (!isCollapsed || isOpenMobile) ? 'grid-rows-[1fr]' : 'grid-rows-[0fr]'"
            >
              <div class="overflow-hidden flex flex-col gap-1 pl-4 border-l-2 border-border ml-6 mt-1">
                <router-link
                  v-for="child in item.children"
                  :key="child.path"
                  :to="child.path"
                  class="flex items-center gap-3 px-3 h-10 rounded-xl transition-all duration-200 cursor-pointer outline-none"
                  :style="{ '--item-color': child.color, '--item-rgb': child.rgb }"
                  :class="[
                    isActive(child.path)
                      ? 'text-[var(--item-color)] bg-[rgba(var(--item-rgb),0.1)] font-semibold'
                      : 'text-muted-foreground hover:text-[var(--item-color)] hover:bg-[rgba(var(--item-rgb),0.1)]'
                  ]"
                  @click="isOpenMobile = false"
                >
                  <component
                    :is="child.icon"
                    :size="16"
                    class="transition-colors"
                    :class="isActive(child.path) ? 'text-[var(--item-color)]' : 'text-zinc-400'"
                  />
                  <span class="text-xs">{{ child.label }}</span>
                </router-link>
              </div>
            </div>
          </div>
        </div>
      </nav>

      <!-- Footer / Logout -->
      <div class="p-4 border-t border-border">
        <router-link
          :to="`/${route.params.username || ''}`"
          class="flex items-center gap-4 px-3 h-11 rounded-xl text-muted-foreground hover:text-foreground hover:bg-secondary transition-all"
        >
          <div class="relative shrink-0 w-8 flex justify-center">
            <LogOut :size="20" />
          </div>
          <span
            class="font-medium text-sm whitespace-nowrap transition-all duration-300"
            :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100'"
          >
            {{ $t('admin.sidebar.back') }}
          </span>
        </router-link>
        
        <button
          @click="handleLogout"
          class="flex items-center gap-4 px-3 h-11 rounded-xl w-full mt-2 text-destructive hover:text-destructive hover:bg-destructive/10 transition-all outline-none"
        >
          <div class="relative shrink-0 w-8 flex justify-center">
            <LogOut :size="20" />
          </div>
          <span
            class="font-medium text-sm whitespace-nowrap transition-all duration-300"
            :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100'"
          >
            Cerrar Sesión
          </span>
        </button>
      </div>
    </aside>

    <div class="flex-1 flex flex-col min-w-0 h-full overflow-hidden relative transition-all duration-300">
      
      <!-- Mobile Header (Visible only on mobile) -->
      <header class="md:hidden flex items-center h-16 px-4 border-b border-border bg-card/50 backdrop-blur-md z-10 sticky top-0">
        <button @click="isOpenMobile = true" class="text-foreground hover:text-primary">
          <Menu :size="24" />
        </button>
        <span class="ml-4 font-bold tracking-tight">OppyTalent Admin</span>
      </header>

      <main class="flex-1 overflow-y-auto p-4 md:p-8 custom-scrollbar relative z-0">
        <slot />
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { useRoute } from 'vue-router'
import { 
  LayoutDashboard, FolderKanban, Briefcase, GraduationCap, 
  User, Layers, MessageSquare, LineChart, Settings, 
  Palette, Database, LogOut, ChevronLeft, ChevronRight, X, Menu, Award, ShieldCheck, ChevronDown
} from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { useChatP2PStore } from '../../stores/chat_p2p'

const { t } = useI18n()

const route = useRoute()
const authStore = useAuthStore()
const chatStore = useChatP2PStore()

onMounted(() => {
  chatStore.startPolling()
})

// Forzar que el AdminPanel siempre muestre los datos del usuario logueado
if (authStore.user?.username) {
  const username = authStore.user.username.split('@')[0]
  localStorage.setItem('currentPortfolioUser', username)
}

const isCollapsed = ref(false)
const isOpenMobile = ref(false)

const openMenus = ref([]) // Closed by default

function handleLogout() {
  authStore.logout()
}

function toggleMenu(id) {
  if (openMenus.value.includes(id)) {
    openMenus.value = openMenus.value.filter(m => m !== id)
  } else {
    openMenus.value.push(id)
  }
}

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const menuItems = computed(() => {
  const base = `/${route.params.username || 'admin'}`
  return [
    { path: `${base}/dashboard`, label: t('admin.sidebar.dashboard'), icon: LayoutDashboard, color: '#3b82f6', rgb: '59,130,246' },
    { path: `${base}/perfil`, label: t('admin.sidebar.profile'), icon: User, color: '#06b6d4', rgb: '6,182,212' },
    {
      label: 'Mi Trayectoria',
      icon: Briefcase,
      id: 'trayectoria',
      children: [
        { path: `${base}/proyectos`, label: t('admin.sidebar.projects'), icon: FolderKanban, color: '#8b5cf6', rgb: '139,92,246' },
        { path: `${base}/experiencias`, label: t('admin.sidebar.experience'), icon: Briefcase, color: '#10b981', rgb: '16,185,129' },
        { path: `${base}/estudios`, label: t('admin.sidebar.studies'), icon: GraduationCap, color: '#f59e0b', rgb: '245,158,11' },
        { path: `${base}/reconocimientos`, label: t('admin.sidebar.recognitions'), icon: Award, color: '#ec4899', rgb: '236,72,153' },
        { path: `${base}/habilitaciones`, label: t('admin.sidebar.certifications'), icon: ShieldCheck, color: '#6366f1', rgb: '99,102,241' },
      ]
    },
    { path: `${base}/secciones`, label: 'Secciones', icon: Layers, color: '#f43f5e', rgb: '244,63,94' },
    { path: `${base}/frases`, label: t('admin.sidebar.quotes'), icon: MessageSquare, color: '#8b5cf6', rgb: '139,92,246' },
    { path: `${base}/chat-logs`, label: t('admin.sidebar.metrics'), icon: LineChart, color: '#14b8a6', rgb: '20,184,166' },
    { path: `${base}/chat-config`, label: t('admin.sidebar.ai_config'), icon: Settings, color: '#8b5cf6', rgb: '139,92,246' },
    { path: `${base}/theme-config`, label: t('admin.sidebar.theme_config', 'Apariencia'), icon: Palette, color: '#f43f5e', rgb: '244,63,94' },
    { path: `${base}/storage`, label: t('admin.sidebar.storage', 'Plan y Consumo'), icon: Database, color: '#10b981', rgb: '16,185,129' },
  ]
})
</script>

<style>
/* Custom minimal scrollbar for the layout */
.custom-scrollbar::-webkit-scrollbar {
  width: 8px;
  height: 8px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsla(var(--primary), 0.3);
  border-radius: 4px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--primary), 0.5);
}

/* Invisible scrollbar for sidebar */
.sidebar-scrollbar::-webkit-scrollbar {
  display: none;
}
.sidebar-scrollbar {
  -ms-overflow-style: none;  /* IE and Edge */
  scrollbar-width: none;  /* Firefox */
}
</style>
