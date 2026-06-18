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
      <nav class="flex-1 overflow-y-auto overflow-x-hidden py-4 px-2 space-y-1 scrollbar-thin scrollbar-thumb-primary/20 scrollbar-track-transparent">
        <div v-for="item in menuItems" :key="item.path" class="relative group">
          <router-link
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
              class="font-medium text-sm whitespace-nowrap transition-all duration-300"
              :class="isCollapsed && !isOpenMobile ? 'opacity-0 w-0' : 'opacity-100'"
            >
              {{ item.label }}
            </span>
          </router-link>
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
            Salir a Público
          </span>
        </router-link>
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
import { ref, computed } from 'vue'
import { useRoute } from 'vue-router'
import { 
  LayoutDashboard, FolderKanban, Briefcase, GraduationCap, 
  User, Layers, MessageSquare, LineChart, Settings, 
  Palette, Database, LogOut, ChevronLeft, ChevronRight, X, Menu
} from 'lucide-vue-next'

const route = useRoute()
const isCollapsed = ref(false)
const isOpenMobile = ref(false)

const isActive = (path) => route.path === path || route.path.startsWith(path + '/')

const menuItems = computed(() => {
  const base = `/${route.params.username || 'admin'}`
  return [
    { path: `${base}/dashboard`, label: 'Dashboard', icon: LayoutDashboard, color: '#3b82f6', rgb: '59,130,246' },
    { path: `${base}/proyectos`, label: 'Proyectos', icon: FolderKanban, color: '#8b5cf6', rgb: '139,92,246' },
    { path: `${base}/experiencias`, label: 'Experiencia', icon: Briefcase, color: '#10b981', rgb: '16,185,129' },
    { path: `${base}/estudios`, label: 'Estudios', icon: GraduationCap, color: '#f59e0b', rgb: '245,158,11' },
    { path: `${base}/perfil`, label: 'Sobre Mí', icon: User, color: '#06b6d4', rgb: '6,182,212' },
    { path: `${base}/secciones`, label: 'Secciones', icon: Layers, color: '#ec4899', rgb: '236,72,153' },
    { path: `${base}/frases`, label: 'Frases', icon: MessageSquare, color: '#6366f1', rgb: '99,102,241' },
    { path: `${base}/chat-logs`, label: 'Chat Logs', icon: LineChart, color: '#14b8a6', rgb: '20,184,166' },
    { path: `${base}/chat-config`, label: 'Config. IA', icon: Settings, color: '#8b5cf6', rgb: '139,92,246' },
    { path: `${base}/theme-config`, label: 'Apariencia', icon: Palette, color: '#f43f5e', rgb: '244,63,94' },
    { path: `${base}/almacenamiento`, label: 'Storage', icon: Database, color: '#64748b', rgb: '100,116,139' },
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
</style>
