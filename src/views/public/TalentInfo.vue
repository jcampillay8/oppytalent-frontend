<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 pt-28 md:pt-32">
      <div class="max-w-3xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-blue-500/20 text-blue-400 rounded-xl">
            <User :size="32" />
          </div>
          <h1 class="text-4xl font-bold">Para Talentos</h1>
        </div>
        
        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
          Esta vista está orientada a los usuarios que buscan ser contratados o exponer su trabajo.
        </p>

        <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 class="text-blue-400" /> Cosas por agregar a esta vista:</h2>
          <ul class="space-y-4 text-zinc-300">
            <li class="flex gap-3"><span class="text-blue-400">•</span> <strong>Casos de Uso:</strong> Ejemplos de cómo lo puede usar un Arquitecto, un Dev, un Diseñador.</li>
            <li class="flex gap-3"><span class="text-blue-400">•</span> <strong>Beneficios:</strong> Destacar en el mercado laboral mediante el uso de Gemelos Digitales (IA).</li>
            <li class="flex gap-3"><span class="text-blue-400">•</span> <strong>Testimonios:</strong> Casos de éxito de talentos contratados usando OppyTalent.</li>
            <li class="flex gap-3"><span class="text-blue-400">•</span> <strong>Llamado a la acción:</strong> Botón para crear su perfil ahora mismo.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import { User, CheckCircle2 } from 'lucide-vue-next'
</script>
