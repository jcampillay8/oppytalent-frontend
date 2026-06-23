<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 pt-28 md:pt-32">
      <div class="max-w-3xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-purple-500/20 text-purple-400 rounded-xl">
            <Users :size="32" />
          </div>
          <h1 class="text-4xl font-bold">Nosotros (Acerca de OppyTalent)</h1>
        </div>
        
        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
          Esta vista servirá para conectar emocionalmente con los usuarios, inversores y jueces (ej. NTT DATA eAwards).
        </p>

        <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 class="text-purple-400" /> Cosas por agregar a esta vista:</h2>
          <ul class="space-y-4 text-zinc-300">
            <li class="flex gap-3"><span class="text-purple-400">•</span> <strong>Nuestra Historia / Manifiesto:</strong> El origen de OppyTalent y por qué creemos que el CV tradicional está obsoleto.</li>
            <li class="flex gap-3"><span class="text-purple-400">•</span> <strong>El Equipo:</strong> Fotos y biografías de los fundadores (Jaime Campillay, etc.) destacando la experiencia en Tech.</li>
            <li class="flex gap-3"><span class="text-purple-400">•</span> <strong>Valores Core:</strong> Transparencia, privacidad de datos (BYOK) y disrupción tecnológica.</li>
            <li class="flex gap-3"><span class="text-purple-400">•</span> <strong>Logros / Roadmaps:</strong> Mención de participación en eAwards u otras aceleradoras, y los próximos pasos del producto.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import { Users, CheckCircle2 } from 'lucide-vue-next'
</script>
