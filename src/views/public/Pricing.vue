<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center justify-center p-8 md:p-16 pt-28 md:pt-32">
      <div class="max-w-3xl w-full bg-zinc-900/50 border border-white/10 rounded-3xl p-8 md:p-12 backdrop-blur-md shadow-2xl">
        <div class="flex items-center gap-4 mb-6">
          <div class="p-3 bg-emerald-500/20 text-emerald-400 rounded-xl">
            <CreditCard :size="32" />
          </div>
          <h1 class="text-4xl font-bold">Precios y Planes</h1>
        </div>
        
        <p class="text-lg text-zinc-400 mb-8 leading-relaxed">
          Esta vista mostrará los diferentes modelos de suscripción, tanto para Talentos como para Empresas.
        </p>

        <div class="bg-black/40 border border-white/5 rounded-2xl p-6">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2"><CheckCircle2 class="text-emerald-400" /> Cosas por agregar a esta vista:</h2>
          <ul class="space-y-4 text-zinc-300">
            <li class="flex gap-3"><span class="text-emerald-400">•</span> <strong>Tabla de Precios (Talento):</strong> Plan Free (BYOK - Trae tu propia API Key) vs Plan Pro (Facturación gestionada por OppyTalent).</li>
            <li class="flex gap-3"><span class="text-emerald-400">•</span> <strong>Tabla de Precios (Empresas):</strong> Planes basados en "Asientos" (Recruiters) o volumen de búsquedas (Matches).</li>
            <li class="flex gap-3"><span class="text-emerald-400">•</span> <strong>Calculadora de Costos:</strong> Para estimar cuánto costará el uso de la API de Gemini si el usuario opta por BYOK.</li>
            <li class="flex gap-3"><span class="text-emerald-400">•</span> <strong>FAQ Financiero:</strong> Preguntas comunes sobre métodos de pago, cancelaciones y políticas de reembolso.</li>
          </ul>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import { CreditCard, CheckCircle2 } from 'lucide-vue-next'
</script>
