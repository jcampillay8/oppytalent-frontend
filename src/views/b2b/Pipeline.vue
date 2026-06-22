<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <div class="container max-w-5xl mx-auto py-12 px-6 relative z-10 flex flex-col items-center justify-center text-center mt-20">
      <div class="w-24 h-24 bg-secondary border border-border rounded-full flex items-center justify-center mb-8 mx-auto">
        <Users class="w-12 h-12 text-primary" />
      </div>
      <h1 class="text-4xl font-extrabold mb-4">Pipeline de <span class="text-primary">Talentos</span></h1>
      <p class="text-xl text-muted-foreground max-w-2xl mb-8">
        Aquí podrás organizar a los candidatos que hayas guardado, agruparlos por vacantes y hacer seguimiento a sus procesos de selección usando IA.
      </p>
      
      <div class="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 border border-primary/20 text-primary text-sm font-medium">
        <Rocket size="16" /> Próximamente
      </div>
    </div>
  </div>
</template>

<script setup>
import { Users, Rocket } from 'lucide-vue-next'
</script>
