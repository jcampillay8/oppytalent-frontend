<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-50 relative flex flex-col overflow-hidden selection:bg-primary/30">
    <!-- Efectos de Fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute -top-[10%] -left-[10%] w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[80px]"></div>
      <div class="absolute -bottom-[20%] -right-[10%] w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[80px]"></div>
      <div class="absolute top-[20%] right-[20%] w-[30vw] h-[30vw] rounded-full bg-[radial-gradient(circle,rgba(16,185,129,0.1)_0%,transparent_70%)] blur-[80px]"></div>
    </div>
    
    <!-- Navbar -->
    <header class="relative z-10 flex justify-between items-center px-6 md:px-12 py-5 bg-[#09090b]/40 backdrop-blur-xl border-b border-white/5" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
      <div class="text-2xl font-extrabold tracking-tight">Oppy<span class="text-primary">Talent</span></div>
      <div class="flex items-center gap-4">
        <router-link to="/login" class="text-zinc-400 font-medium hover:text-white transition-colors text-sm md:text-base">Iniciar Sesión</router-link>
        <router-link to="/register">
          <NeonButton glow variant="primary" size="sm">Registrarse</NeonButton>
        </router-link>
      </div>
    </header>

    <!-- Hero Section -->
    <main class="relative z-10 flex-1 flex flex-col lg:flex-row items-center px-6 md:px-16 gap-12 lg:gap-24 container mx-auto max-w-7xl py-12 lg:py-0">
      
      <!-- Contenido Textual -->
      <div class="flex-1 max-w-2xl text-center lg:text-left" v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 100 } }">
        <Badge variant="outline" class="mb-6 border-primary/30 text-primary/80 bg-primary/5 uppercase tracking-wider backdrop-blur-sm">Nueva Era del Talento</Badge>
        <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white drop-shadow-sm">
          Impulsa tu <span class="bg-gradient-to-r from-blue-400 via-indigo-400 to-purple-400 bg-clip-text text-transparent">Potencial</span><br class="hidden md:block" />
          al Siguiente Nivel
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0">
          La plataforma definitiva para conectar talento extraordinario con oportunidades de clase mundial.
          Únete a la red donde tus habilidades se potencian con Inteligencia Artificial.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
          <router-link to="/register">
            <NeonButton glow variant="primary" class="w-full sm:w-auto px-8 py-3 text-lg">Comenzar Ahora <ArrowRight :size="20" class="inline ml-2" /></NeonButton>
          </router-link>
          <router-link to="/portafolio">
            <NeonButton variant="outline" class="w-full sm:w-auto px-8 py-3 text-lg border-white/10 hover:border-white/30 text-white hover:bg-white/5">
              <Sparkles :size="20" class="inline mr-2 text-indigo-400" /> Explorar Portafolio
            </NeonButton>
          </router-link>
        </div>
      </div>
      
      <!-- Visual (Mockup Card) -->
      <div class="flex-1 flex justify-center lg:justify-end w-full perspective-1000" v-motion :initial="{ opacity: 0, scale: 0.9, rotateY: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 300 } }">
        <div class="w-full max-w-lg h-[400px] rounded-3xl bg-white/[0.03] border border-white/10 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-6 flex flex-col transform lg:rotate-y-[-15deg] lg:rotate-x-[5deg] transition-transform duration-500 hover:rotate-0 group">
          <div class="flex gap-2 mb-8">
            <div class="w-3 h-3 rounded-full bg-red-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-amber-500/80"></div>
            <div class="w-3 h-3 rounded-full bg-emerald-500/80"></div>
          </div>
          <div class="flex-1 flex flex-col gap-6">
            <!-- Gráfico falso -->
            <div class="h-32 bg-gradient-to-t from-primary/20 to-transparent border-b-2 border-primary rounded-t-lg relative overflow-hidden group-hover:from-primary/30 transition-colors">
              <div class="absolute bottom-0 left-0 w-full h-[1px] bg-primary/50 shadow-[0_0_15px_rgba(59,130,246,0.8)]"></div>
            </div>
            <!-- Líneas de texto falso -->
            <div class="space-y-3">
              <div class="h-3 bg-white/10 rounded-full w-full"></div>
              <div class="h-3 bg-white/10 rounded-full w-3/4"></div>
              <div class="h-3 bg-white/10 rounded-full w-1/2"></div>
            </div>
          </div>
        </div>
      </div>

    </main>
  </div>
</template>

<script setup>
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { ArrowRight, Sparkles } from 'lucide-vue-next'
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.rotate-y-\[-15deg\] {
  transform: rotateY(-15deg);
}
.rotate-x-\[5deg\] {
  transform: rotateX(5deg);
}
</style>
