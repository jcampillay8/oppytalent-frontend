<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <div class="absolute top-[-10%] right-[-10%] w-96 h-96 bg-cyan-500/20 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="container max-w-5xl mx-auto py-12 px-6 relative z-10 flex flex-col items-center justify-center text-center mt-20">
      <div class="w-24 h-24 bg-secondary border border-border rounded-full flex items-center justify-center mb-8 mx-auto">
        <Activity class="w-12 h-12 text-cyan-500" />
      </div>
      <h1 class="text-4xl font-extrabold mb-4">Métricas de <span class="text-cyan-500">Uso B2B</span></h1>
      <p class="text-xl text-muted-foreground max-w-2xl mb-8">
        Aquí visualizarás el impacto de tus búsquedas: cuántos créditos has consumido, efectividad del Tribunal IA y analíticas avanzadas de reclutamiento.
      </p>
      
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-cyan-500/10 border border-cyan-500/20 text-cyan-500 text-sm font-medium">
        <Rocket size="16" /> Próximamente
      </div>
    </div>
  </div>
</template>

<script setup>
import { Activity, Rocket } from 'lucide-vue-next'
</script>
