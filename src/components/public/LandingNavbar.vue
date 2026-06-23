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
        <router-link to="/features" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="text-primary font-bold">Funcionalidades</router-link>
        <router-link to="/talent-info" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="text-primary font-bold">Para Talentos</router-link>
        <router-link to="/b2b-info" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="text-primary font-bold">Para Empresas</router-link>
        <router-link to="/pricing" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="text-primary font-bold">Precios</router-link>
        <router-link to="/about" class="text-sm font-medium text-zinc-300 hover:text-white transition-colors" active-class="text-primary font-bold">Nosotros</router-link>
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
          ES
        </button>
        <button 
          @click="changeLang('en')" 
          class="px-2 py-1 rounded text-xs font-bold transition-all"
          :class="locale === 'en' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white hover:bg-white/10'"
        >
          EN
        </button>
      </div>

      <!-- Auth Buttons -->
      <router-link to="/login" class="text-zinc-300 font-medium hover:text-white transition-colors text-sm hidden sm:block ml-2">
        Iniciar Sesión
      </router-link>
      <router-link to="/register">
        <NeonButton glow variant="primary" size="sm" class="hidden sm:flex">Registrarse</NeonButton>
      </router-link>

      <!-- Mobile Menu Toggle -->
      <button @click="isMobileMenuOpen = !isMobileMenuOpen" class="lg:hidden p-2 text-zinc-300 hover:text-white">
        <Menu v-if="!isMobileMenuOpen" :size="24" />
        <X v-else :size="24" />
      </button>
    </div>

    <!-- Mobile Menu Overlay -->
    <div v-if="isMobileMenuOpen" class="absolute top-full left-0 w-full bg-[#050505]/95 backdrop-blur-2xl border-b border-white/10 flex flex-col p-6 gap-6 lg:hidden animate-in slide-in-from-top-2">
      <nav class="flex flex-col gap-4 text-lg">
        <router-link @click="isMobileMenuOpen = false" to="/features" class="text-zinc-300 hover:text-white transition-colors">Funcionalidades</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/talent-info" class="text-zinc-300 hover:text-white transition-colors">Para Talentos</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/b2b-info" class="text-zinc-300 hover:text-white transition-colors">Para Empresas</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/pricing" class="text-zinc-300 hover:text-white transition-colors">Precios</router-link>
        <router-link @click="isMobileMenuOpen = false" to="/about" class="text-zinc-300 hover:text-white transition-colors">Nosotros</router-link>
      </nav>
      
      <div class="h-px bg-white/10 w-full"></div>
      
      <div class="flex items-center justify-between">
        <span class="text-sm font-medium text-zinc-400">Idioma</span>
        <div class="flex items-center gap-1 bg-white/5 rounded-lg p-1 border border-white/10">
          <button @click="changeLang('es')" class="px-3 py-1 rounded text-sm font-bold transition-all" :class="locale === 'es' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'">ES</button>
          <button @click="changeLang('en')" class="px-3 py-1 rounded text-sm font-bold transition-all" :class="locale === 'en' ? 'bg-primary text-white' : 'text-zinc-400 hover:text-white'">EN</button>
        </div>
      </div>
      
      <div class="flex flex-col gap-3 mt-2">
        <router-link @click="isMobileMenuOpen = false" to="/login" class="w-full text-center py-3 rounded-lg border border-white/10 text-zinc-300 font-medium hover:bg-white/5 transition-colors">
          Iniciar Sesión
        </router-link>
        <router-link @click="isMobileMenuOpen = false" to="/register" class="w-full">
          <NeonButton glow variant="primary" class="w-full py-3 justify-center">Registrarse</NeonButton>
        </router-link>
      </div>
    </div>
  </header>
</template>

<script setup>
import { ref } from 'vue'
import { Menu, X } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import NeonButton from '../ui/NeonButton.vue'

const isMobileMenuOpen = ref(false)
const { locale } = useI18n()

function changeLang(lang) {
  locale.value = lang
}
</script>
