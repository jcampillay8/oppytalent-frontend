<template>
  <header class="fixed top-0 left-0 w-full z-50 flex justify-between items-center px-6 md:px-12 py-4 bg-[#050505]/80 backdrop-blur-xl border-b border-white/10 transition-all duration-300" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
    
    <!-- Left Side: Logo & Navigation -->
    <div class="flex items-center gap-10">
      <!-- Logo -->
      <router-link to="/" class="text-2xl font-extrabold tracking-tight flex-shrink-0">
        Oppy<span class="text-primary">Talent</span>
      </router-link>

      <!-- Desktop Navigation -->
      <nav class="hidden lg:flex items-center gap-6">
        <router-link to="/features" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.features') }}</router-link>
        <router-link to="/talent-info" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.talent') }}</router-link>
        <router-link to="/b2b-info" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.b2b') }}</router-link>
        <router-link to="/pricing" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.pricing') }}</router-link>
        <router-link to="/about" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.about') }}</router-link>
      </nav>
    </div>

    <!-- Right Controls -->
    <div class="flex items-center gap-4">
      
      <!-- Language Selector (Desktop) -->
      <div class="hidden sm:flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
        <button 
          @click="changeLang('es')" 
          class="px-2 py-1 rounded text-xs font-bold transition-all"
          :class="locale === 'es' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'"
        >
          🇪🇸 ES
        </button>
        <button 
          @click="changeLang('en')" 
          class="px-2 py-1 rounded text-xs font-bold transition-all"
          :class="locale === 'en' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'"
        >
          🇺🇸 EN
        </button>
      </div>

      <!-- Auth / User Controls -->
      <template v-if="!authStore.isAuthenticated">
        <router-link v-if="isPortfolioView" to="/login">
          <NeonButton variant="outline" size="sm" class="hidden sm:flex mr-2 border-primary/50 text-primary hover:bg-primary/10">
            <template #icon-left><MessageSquare :size="16" /></template>
            {{ $t('public_nav.contact') }}
          </NeonButton>
        </router-link>

        <router-link to="/login" class="text-zinc-300 font-medium hover:text-white transition-colors text-sm hidden sm:block ml-2">
          {{ $t('public_nav.login') }}
        </router-link>
        <router-link to="/register">
          <NeonButton glow variant="primary" size="sm" class="hidden sm:flex">{{ $t('public_nav.register') }}</NeonButton>
        </router-link>
      </template>
      <template v-else>
        <NeonButton 
          v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== route.params.username"
          @click="contactTalent" 
          variant="primary" 
          glow 
          size="sm"
          class="hidden sm:flex mr-2"
        >
          <template #icon-left><MessageSquare :size="16" /></template>
          {{ $t('public_nav.chat') }} {{ targetUserObj?.first_name || route.params.username }}
        </NeonButton>
        
        <ConnectionButton 
          v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== route.params.username && targetUserObj"
          :userId="targetUserObj.id"
          class="hidden sm:flex mr-2"
        />

        <router-link :to="`/${authStore.user?.username.split('@')[0] || 'admin'}/inbox`" class="relative p-2 text-zinc-300 hover:text-white transition-colors" title="Mensajes">
          <Bell :size="20" />
          <span 
            v-if="chatStore.unreadCount > 0"
            class="absolute -top-1.5 -right-1.5 flex items-center justify-center min-w-[18px] h-[18px] px-1 bg-destructive text-[10px] font-bold text-white rounded-full shadow-md animate-in zoom-in"
          >
            {{ chatStore.unreadCount > 99 ? '99+' : chatStore.unreadCount }}
          </span>
        </router-link>


        
        <router-link :to="`/${authStore.user?.username.split('@')[0]}/dashboard`">
          <NeonButton glow variant="primary" size="sm" class="hidden sm:flex">{{ $t('public_nav.dashboard') }}</NeonButton>
        </router-link>
      </template>

      <!-- Mobile Menu Toggle -->
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 text-zinc-300 hover:text-white">
        <Menu v-if="!isMobileMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" class="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 flex flex-col p-6 gap-6 lg:hidden animate-in slide-in-from-top-2">
      <nav class="flex flex-col gap-4 text-lg">
        <router-link @click="isMobileMenuOpen = false" to="/features" class="text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.features') }}</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/talent-info" class="text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.talent') }}</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/b2b-info" class="text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.b2b') }}</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/pricing" class="text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.pricing') }}</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/about" class="text-zinc-300 hover:text-white transition-colors" active-class="!text-primary font-bold">{{ $t('public_nav.about') }}</router-link>
      </nav>
      
      <div class="h-px bg-white/10 w-full"></div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-zinc-400">{{ $t('public_nav.language') }}</span>
        <div class="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
          <button @click="changeLang('es')" class="px-3 py-1 rounded text-sm font-bold transition-all" :class="locale === 'es' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'">🇪🇸 ES</button>
          <button @click="changeLang('en')" class="px-3 py-1 rounded text-sm font-bold transition-all" :class="locale === 'en' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'">🇺🇸 EN</button>
        </div>
      </div>
      
      <div class="flex flex-col gap-3 mt-2" v-if="!authStore.isAuthenticated">
        <router-link @click="isMobileMenuOpen = false" to="/login" class="w-full text-center py-3 rounded-lg border border-white/10 text-zinc-300 font-medium hover:bg-white/5 transition-colors">
          {{ $t('public_nav.login') }}
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/register" class="w-full">
          <NeonButton glow variant="primary" class="w-full py-3 justify-center">{{ $t('public_nav.register') }}</NeonButton>
        </router-link>
        <router-link v-if="isPortfolioView" @click="isMobileMenuOpen = false" to="/login" class="w-full mt-2">
          <NeonButton variant="outline" class="w-full py-3 justify-center border-primary/50 text-primary">
            {{ $t('public_nav.contact') }}
          </NeonButton>
        </router-link>
      </div>
      <div class="flex flex-col gap-3 mt-2" v-else>
        <NeonButton 
          v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== route.params.username"
          @click="() => { contactTalent(); isMobileMenuOpen = false }" 
          variant="primary" 
          glow
          class="w-full py-3 justify-center"
        >
          {{ $t('public_nav.chat') }} {{ targetUserObj?.first_name || route.params.username }}
        </NeonButton>
        <ConnectionButton 
          v-if="isPortfolioView && authStore.user?.username.split('@')[0] !== route.params.username && targetUserObj"
          :userId="targetUserObj.id"
          class="w-full py-3 justify-center mb-2"
        />

        <router-link @click="isMobileMenuOpen = false" :to="`/${authStore.user?.username.split('@')[0]}/dashboard`" class="w-full">
          <NeonButton glow variant="outline" class="w-full py-3 justify-center">{{ $t('public_nav.dashboard') }}</NeonButton>
        </router-link>
        
        <router-link @click="isMobileMenuOpen = false" :to="`/${authStore.user?.username.split('@')[0] || 'admin'}/inbox`" class="w-full">
          <NeonButton variant="outline" class="w-full py-3 justify-center flex items-center gap-2">
            {{ $t('public_nav.messages') }}
            <span v-if="chatStore.unreadCount > 0" class="bg-destructive text-white text-xs px-2 py-0.5 rounded-full">{{ chatStore.unreadCount }}</span>
          </NeonButton>
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/network" class="w-full">
          <NeonButton variant="outline" class="w-full py-3 justify-center flex items-center gap-2">
            {{ $t('public_nav.network') }}
            <span v-if="networkStore.pendingCount > 0" class="bg-amber-500 text-white text-xs px-2 py-0.5 rounded-full">{{ networkStore.pendingCount }}</span>
          </NeonButton>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue'
import { Menu, X, Bell, MessageSquare, Users } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { useRoute, useRouter } from 'vue-router'
import NeonButton from '../ui/NeonButton.vue'
import ConnectionButton from '../ui/ConnectionButton.vue'
import { useAuthStore } from '../../stores/auth'
import { useChatP2PStore } from '../../stores/chat_p2p'
import { useNetworkStore } from '../../stores/network'
import { api } from '../../services/api'

const isMobileMenuOpen = ref(false)
const { locale } = useI18n()

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()
const chatStore = useChatP2PStore()
const networkStore = useNetworkStore()

const isPortfolioView = computed(() => {
  return route.name === 'UserPortfolio' || !!route.params.username
})

const targetUserObj = ref(null)
watch(() => route.params.username, async (newVal) => {
  if (newVal && newVal !== authStore.user?.username?.split('@')[0]) {
    try {
      targetUserObj.value = await api.getUserByUsername(newVal)
    } catch (e) {
      targetUserObj.value = null
    }
  } else {
    targetUserObj.value = null
  }
}, { immediate: true })

async function contactTalent() {
  const targetUsername = route.params.username
  if (!targetUsername) return
  
  try {
    await api.startChatConversation(targetUsername)
    const myUser = authStore.user?.username?.split('@')[0] || 'admin'
    router.push(`/${myUser}/inbox?chat=${targetUsername}`)
  } catch (err) {
    console.error("Error iniciando chat:", err)
  }
}

onMounted(() => {
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

function changeLang(lang) {
  locale.value = lang
}
</script>
