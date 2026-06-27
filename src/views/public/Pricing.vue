<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO PRICING -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center mb-16" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-white/20 text-zinc-300 bg-white/5 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          Planes Flexibles y Escalables
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          Invierte en tu <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">Futuro</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light mb-10">
          Precios diseñados para impulsar el talento en Latinoamérica y escalar hacia el mundo. Elige el plan que se adapte a tu momento profesional o al tamaño de tu empresa.
        </p>

        <!-- TABS (TALENTOS VS EMPRESAS) -->
        <div class="inline-flex bg-zinc-900 border border-white/10 rounded-full p-1 relative shadow-xl">
          <button 
            @click="activeTab = 'talentos'" 
            class="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10"
            :class="activeTab === 'talentos' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            Para Talentos
          </button>
          <button 
            @click="activeTab = 'empresas'" 
            class="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10"
            :class="activeTab === 'empresas' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            Para Empresas
          </button>
          <!-- Indicador animado -->
          <div 
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 border border-white/5 shadow-md rounded-full transition-all duration-300 ease-out"
            :class="activeTab === 'talentos' ? 'left-1' : 'translate-x-full left-1'"
          ></div>
        </div>
      </section>

      <!-- PRECIOS TALENTOS -->
      <section v-show="activeTab === 'talentos'" class="w-full max-w-7xl mx-auto px-6 mb-24 transition-opacity duration-500">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Plan Inicial (Free) -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-white/20 transition-colors relative">
            <h3 class="text-xl font-bold text-white mb-2">Inicial</h3>
            <div class="text-zinc-400 text-sm mb-6 min-h-[40px]">Para construir tu primera huella digital con IA.</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">Gratis</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-white border-white/20 hover:bg-white/5 py-3">Comenzar Gratis</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300 flex-1">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> Constructor Bento Box & Tabs</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> Asistente de IA (10 interacciones/mes)</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> CV Wizard (Importación PDF)</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> 25 MB Almacenamiento de Imágenes</li>
            </ul>
          </div>

          <!-- Plan PRO -->
          <div class="rounded-3xl border border-blue-500/50 bg-gradient-to-b from-blue-900/20 to-black p-8 flex flex-col shadow-[0_0_40px_rgba(59,130,246,0.15)] relative transform md:-translate-y-4">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Más Popular</div>
            <h3 class="text-xl font-bold text-white mb-2">Profesional</h3>
            <div class="text-blue-200 text-sm mb-6 min-h-[40px]">Para talentos que buscan destacar en el mercado internacional.</div>
            <div class="mb-2">
              <span class="text-5xl font-extrabold text-white">$7.99</span><span class="text-zinc-400"> / mes (USD)</span>
            </div>
            <div class="text-xs text-blue-400 mb-6 font-medium">Facturado anualmente o $9.99 mensual</div>
            <router-link to="/register" class="mb-8">
              <NeonButton glow variant="primary" class="w-full bg-blue-600 hover:bg-blue-500 border-blue-400 text-white py-3">Subir de Nivel</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-200 flex-1">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>Todo lo del plan Inicial</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>Interacciones IA Ilimitadas</strong> (Nosotros pagamos la API)</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>Visibilidad Prioritaria</strong> en búsquedas B2B</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> Analíticas detalladas de Chat</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> Almacenamiento Ilimitado (Cloudflare R2)</li>
            </ul>
          </div>

          <!-- Plan Hacker (BYOK) -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-amber-500/30 transition-colors relative">
            <h3 class="text-xl font-bold text-amber-400 mb-2">Hacker (BYOK)</h3>
            <div class="text-zinc-400 text-sm mb-6 min-h-[40px]">Control total. Conecta tu propia API Key de Inteligencia Artificial.</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$2.99</span><span class="text-zinc-400"> / mes</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-amber-400 border-amber-500/30 hover:bg-amber-500/10 py-3">Traer mi API Key</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300 flex-1">
              <li class="flex items-start gap-3"><Key :size="18" class="text-amber-500 shrink-0" /> <strong>Bring Your Own Key (Gemini)</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> Paga la IA directamente a Google al costo real</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> Llave encriptada con AES-256</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> Todas las analíticas y features Pro incluidas</li>
            </ul>
          </div>
          
        </div>
      </section>

      <!-- PRECIOS EMPRESAS -->
      <section v-show="activeTab === 'empresas'" class="w-full max-w-5xl mx-auto px-6 mb-24 transition-opacity duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Plan Starter B2B -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 class="text-2xl font-bold text-white mb-2">Hunter Starter</h3>
            <div class="text-zinc-400 text-sm mb-6">Para reclutadores independientes y Startups.</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$49</span><span class="text-zinc-400"> / mes (USD)</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-white border-white/20 hover:bg-white/5 py-3">Probar 7 días gratis</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> <strong>1 Asiento</strong> (Recruiter)</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> Búsquedas Semánticas de talento ilimitadas</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-500 shrink-0" /> <strong>50 Tribunales de IA</strong> al mes</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> Chat P2P directo con candidatos</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> Pipeline (Kanban) básico</li>
            </ul>
          </div>

          <!-- Plan Scale B2B -->
          <div class="rounded-3xl border border-emerald-500/50 bg-gradient-to-b from-emerald-900/20 to-black p-8 flex flex-col shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
            <div class="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">Agencias de HR</div>
            <h3 class="text-2xl font-bold text-white mb-2">Enterprise Scale</h3>
            <div class="text-emerald-200 text-sm mb-6">Procesos masivos, automatización y equipo colaborativo.</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$199</span><span class="text-zinc-400"> / mes (USD)</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton glow variant="primary" class="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white py-3">Contactar Ventas</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-200">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>Hasta 5 Asientos</strong> (Recruiters)</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>Tribunales de IA Ilimitados</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>Exportación a ATS</strong> vía API</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> Pipeline (Kanban) colaborativo avanzado</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> Soporte Dedicado 24/7</li>
            </ul>
          </div>
          
        </div>
      </section>

      <!-- FAQ FINANCIERO -->
      <section class="w-full max-w-3xl mx-auto px-6 mb-24 text-left">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-10">Preguntas Frecuentes</h2>
        <div class="space-y-4">
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>¿Qué moneda utilizan y qué métodos de pago aceptan?</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              Todos nuestros precios están expresados en Dólares Estadounidenses (USD) por ser un estándar global SaaS. Aceptamos todas las tarjetas de crédito (Visa, Mastercard, AMEX) a través de Stripe, garantizando pagos locales fluidos en Latinoamérica y el mundo.
            </div>
          </details>
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>¿Qué significa el plan Hacker (BYOK)?</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              Significa "Bring Your Own Key" (Trae tu propia llave). Por una fracción del costo mensual, accedes a todo el software premium de OppyTalent, pero las interacciones de Inteligencia Artificial se cobran directamente a tu tarjeta a través de Google Cloud. Es ideal si eres un usuario técnico (hacker) y quieres optimizar al máximo tus costos (usualmente céntimos al mes).
            </div>
          </details>
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>Si soy talento en el Plan Gratis, ¿alguien puede ver mi perfil?</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              Sí. Tu perfil es 100% público y visible. La limitación del plan gratuito radica en la cantidad de veces que el Clon Digital responderá a reclutadores y en el almacenamiento de imágenes. Si superas los 10 créditos, el perfil seguirá visible, pero el Chat AI se desactivará hasta el mes siguiente (salvo que pases a Pro o uses BYOK).
            </div>
          </details>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Precios transparentes para todos.</p>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  CheckCircle2, 
  Key,
  ChevronDown,
  ArrowRight
} from 'lucide-vue-next'

const activeTab = ref('talentos')
</script>
