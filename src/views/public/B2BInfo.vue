<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 pt-28 md:pt-32">
      <div class="max-w-3xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-cyan-500/20 text-cyan-400 rounded-xl">
            <Building2 :size="32" />
          </div>
          <h1 class="text-4xl font-bold">Para Empresas (B2B)</h1>
        </div>
        
        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
          Esta vista está orientada a reclutadores, *Headhunters* y empresas que buscan talento validado.
        </p>

        <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 class="text-cyan-400" /> Cosas por agregar a esta vista:</h2>
          <ul class="space-y-4 text-zinc-300">
            <li class="flex gap-3"><span class="text-cyan-400">•</span> <strong>Búsqueda con IA:</strong> Explicar cómo el reclutador puede pedir "Busca un Dev en Vue con 3 años de experiencia" y la IA hace el filtro automático.</li>
            <li class="flex gap-3"><span class="text-cyan-400">•</span> <strong>Ahorro de Tiempo:</strong> Mostrar métricas de cómo OppyTalent reduce el tiempo de validación técnica antes de la primera entrevista humana.</li>
            <li class="flex gap-3"><span class="text-cyan-400">•</span> <strong>Gestión de Candidatos (Pipeline):</strong> Capturas de pantalla de cómo se ve el panel B2B.</li>
            <li class="flex gap-3"><span class="text-cyan-400">•</span> <strong>Beta Access:</strong> Formulario para unirse a la lista de espera B2B o solicitar un "Access Code".</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import { Building2, CheckCircle2 } from 'lucide-vue-next'
</script>
