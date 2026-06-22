<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-amber-500/20 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="container max-w-5xl mx-auto py-12 px-6 relative z-10 flex flex-col items-center justify-center text-center mt-20">
      <div class="w-24 h-24 bg-secondary border border-border rounded-full flex items-center justify-center mb-8 mx-auto">
        <Building2 class="w-12 h-12 text-amber-500" />
      </div>
      <h1 class="text-4xl font-extrabold mb-4">Perfil de <span class="text-amber-500">Mi Empresa</span></h1>
      <p class="text-xl text-muted-foreground max-w-2xl mb-8">
        El panel administrativo B2B donde podrás configurar el logo de tu empresa, los datos de facturación, comprar créditos IA y administrar tu equipo de reclutadores.
      </p>
      
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-amber-500/10 border border-amber-500/20 text-amber-500 text-sm font-medium">
        <Rocket size="16" /> Próximamente
      </div>
    </div>
  </div>
</template>

<script setup>
import { Building2, Rocket } from 'lucide-vue-next'
</script>
