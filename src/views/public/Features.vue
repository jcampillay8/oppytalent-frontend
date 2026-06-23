<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 pt-28 md:pt-32">
      <div class="max-w-3xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-primary/20 text-primary rounded-xl">
            <LayoutTemplate :size="32" />
          </div>
          <h1 class="text-4xl font-bold">Funcionalidades</h1>
        </div>
        
        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
          Esta vista está diseñada para explicar en detalle cómo funciona el "Gemelo Digital" y el constructor de portafolios.
        </p>

        <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 class="text-primary" /> Cosas por agregar a esta vista:</h2>
          <ul class="space-y-4 text-zinc-300">
            <li class="flex gap-3"><span class="text-primary">•</span> <strong>Demostración del Constructor (Bento Box):</strong> Un video corto o GIF mostrando lo fácil que es arrastrar y soltar componentes.</li>
            <li class="flex gap-3"><span class="text-primary">•</span> <strong>Explicación del Chat AI (RAG):</strong> Gráficos que expliquen que la IA solo responde basándose en los datos del usuario (privacidad y seguridad).</li>
            <li class="flex gap-3"><span class="text-primary">•</span> <strong>Comparativa:</strong> OppyTalent vs LinkedIn vs CV en PDF (Tabla comparativa de ventajas).</li>
            <li class="flex gap-3"><span class="text-primary">•</span> <strong>Llamado a la acción (CTA):</strong> Botón para registrarse y probar gratis.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import { LayoutTemplate, CheckCircle2 } from 'lucide-vue-next'
</script>
