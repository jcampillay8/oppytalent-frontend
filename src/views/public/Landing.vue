<template>
  <AuroraBackground>
    <div class="min-h-screen text-zinc-50 flex flex-col font-sans selection:bg-primary/30 scroll-smooth">
      
      <!-- SEO: Schema Markup inyectado dinámicamente -->
      <component :is="'script'" type="application/ld+json">
        {{ schemaMarkup }}
      </component>

      <!-- Navbar -->
      <LandingNavbar />

      <main class="flex-1 flex flex-col items-center pt-20">
        
        <!-- ============================================== -->
        <!-- 1. HERO SECTION (Above the fold)               -->
        <!-- ============================================== -->
        <section class="relative w-full max-w-7xl mx-auto px-6 md:px-16 py-16 lg:py-20 flex flex-col lg:flex-row items-center gap-10 lg:gap-20">
          <div class="flex-1 text-center lg:text-left z-10" v-motion :initial="{ opacity: 0, x: -30 }" :enter="{ opacity: 1, x: 0, transition: { delay: 100 } }">
            <Badge variant="outline" class="mb-6 border-primary/30 text-primary/90 bg-primary/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
              El Futuro del Reclutamiento Tech
            </Badge>
            <!-- SEO H1: Keyword + Valor -->
            <h1 class="text-5xl md:text-6xl lg:text-7xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white drop-shadow-sm">
              Tu currículum habla por ti...<br class="hidden md:block" />
              Tu <span class="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">Clon Digital</span> responde por ti.
            </h1>
            <!-- SEO H2 Subtítulo -->
            <h2 class="text-lg md:text-xl text-zinc-400 leading-relaxed mb-10 max-w-xl mx-auto lg:mx-0 font-light">
              Dile adiós al PDF estático. Transforma tu experiencia en un <strong>portafolio profesional interactivo</strong> con un asistente de IA que atiende a los reclutadores 24/7.
            </h2>
            
            <!-- CTA Visible -->
            <div class="flex flex-col sm:flex-row items-center justify-center lg:justify-start gap-4">
              <router-link to="/register" class="w-full sm:w-auto">
                <NeonButton glow variant="primary" class="w-full px-8 py-4 text-lg font-semibold shadow-lg shadow-primary/25 hover:shadow-primary/40 transition-all">
                  Crear mi Gemelo Digital (Gratis)
                  <ArrowRight :size="20" class="inline ml-2" />
                </NeonButton>
              </router-link>
              <router-link to="/portfolio/jcampillayworks" class="w-full sm:w-auto">
                <NeonButton variant="outline" class="w-full px-8 py-4 text-lg border-white/10 hover:border-white/30 text-zinc-300 hover:text-white hover:bg-white/5 transition-all">
                  <Sparkles :size="20" class="inline mr-2 text-indigo-400" /> Ver Demo en Vivo
                </NeonButton>
              </router-link>
            </div>
          </div>
          
          <!-- Visual: Mockup -->
          <div class="flex-1 flex justify-center lg:justify-end w-full perspective-1000 z-10" v-motion :initial="{ opacity: 0, scale: 0.9, rotateY: 0 }" :enter="{ opacity: 1, scale: 1, transition: { delay: 300 } }">
            <!-- Glass Mockup simulando Bento Box -->
            <div class="w-full max-w-lg h-[450px] rounded-3xl bg-zinc-900/40 border border-white/10 backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.8)] p-6 flex flex-col transform lg:rotate-y-[-12deg] lg:rotate-x-[8deg] transition-transform duration-700 hover:rotate-0 hover:scale-105 group relative overflow-hidden">
              <!-- Brillo superior -->
              <div class="absolute top-0 left-0 w-full h-[2px] bg-gradient-to-r from-transparent via-primary/50 to-transparent"></div>
              
              <!-- Browser dots -->
              <div class="flex gap-2 mb-6">
                <div class="w-3 h-3 rounded-full bg-zinc-600/50"></div>
                <div class="w-3 h-3 rounded-full bg-zinc-600/50"></div>
                <div class="w-3 h-3 rounded-full bg-zinc-600/50"></div>
              </div>
              
              <!-- Bento Grid Mockup -->
              <div class="flex-1 grid grid-cols-2 grid-rows-3 gap-4">
                <div class="col-span-2 row-span-1 rounded-2xl bg-white/5 border border-white/5 p-4 flex flex-col gap-2 relative overflow-hidden group-hover:bg-white/10 transition-colors">
                   <div class="w-1/3 h-4 rounded bg-zinc-700/50 mb-2"></div>
                   <div class="w-3/4 h-3 rounded bg-zinc-700/30"></div>
                   <div class="w-1/2 h-3 rounded bg-zinc-700/30"></div>
                </div>
                <!-- Chat AI Mockup area -->
                <div class="col-span-1 row-span-2 rounded-2xl bg-primary/10 border border-primary/20 p-4 flex flex-col justify-end relative overflow-hidden">
                  <div class="w-full h-8 rounded-lg bg-primary/20 mb-2 border border-primary/30 flex items-center px-2">
                    <Sparkles :size="12" class="text-primary/70 mr-2" />
                    <div class="w-1/2 h-2 rounded bg-primary/40"></div>
                  </div>
                </div>
                <div class="col-span-1 row-span-1 rounded-2xl bg-white/5 border border-white/5 p-4"></div>
                <div class="col-span-1 row-span-1 rounded-2xl bg-white/5 border border-white/5 p-4"></div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- 2. PROBLEMA / SOLUCIÓN (SEO: Keyword Secundaria) -->
        <!-- ============================================== -->
        <section class="w-full bg-zinc-950/60 border-y border-white/5 py-20 backdrop-blur-sm z-10 relative">
          <div class="max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
            <h2 class="text-3xl md:text-4xl font-bold mb-8">Por qué tu CV en PDF y LinkedIn ya no son suficientes</h2>
            <p class="text-lg md:text-xl text-zinc-400 leading-relaxed mb-12">
              LinkedIn mapea tu historial, pero no inicia conversaciones de valor. Los reclutadores tardan solo <span class="text-zinc-200 font-semibold">6 segundos</span> en descartar un PDF plano. El talento excepcional necesita una plataforma que demuestre sus verdaderas capacidades de forma interactiva.
            </p>
            <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
              <div class="p-8 rounded-2xl bg-red-950/20 border border-red-900/30">
                <div class="text-red-400 font-bold mb-4 flex items-center justify-center gap-2">
                  <XCircle :size="20" /> El Pasado (Obsoleto)
                </div>
                <ul class="text-zinc-400 space-y-3 text-left list-disc list-inside">
                  <li>Un CV en PDF estático que nadie lee completo y se pierde en la bandeja de entrada.</li>
                  <li>Una lista monótona de cargos en LinkedIn sin contexto.</li>
                  <li>Esperar semanas para una primera entrevista de validación técnica.</li>
                </ul>
              </div>
              <div class="p-8 rounded-2xl bg-primary/10 border border-primary/30 shadow-[0_0_30px_rgba(59,130,246,0.1)]">
                <div class="text-primary font-bold mb-4 flex items-center justify-center gap-2">
                  <CheckCircle2 :size="20" /> El Futuro (OppyTalent)
                </div>
                <ul class="text-zinc-300 space-y-3 text-left list-disc list-inside">
                  <li>Un Asistente IA que vende tu perfil y responde dudas técnicas al instante.</li>
                  <li>Diseños premium (Bento Grid) que capturan la atención inmediatamente.</li>
                  <li>Búsqueda semántica B2B: las empresas te encuentran por tus habilidades reales.</li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- 3. BENEFICIOS Y FEATURES (SEO: Keywords en H3) -->
        <!-- ============================================== -->
        <section class="w-full max-w-7xl mx-auto px-6 py-24 z-10">
          <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
            <h2 class="text-3xl md:text-5xl font-bold mb-6">Eleva tu Empleabilidad al Siguiente Nivel</h2>
            <p class="text-zinc-400 text-lg max-w-2xl mx-auto">Herramientas de clase mundial diseñadas para que los profesionales muestren su impacto real y las empresas optimicen su reclutamiento.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <!-- Feature 1 -->
            <div class="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-primary/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="w-12 h-12 rounded-2xl bg-primary/20 text-primary flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Bot :size="24" />
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Entrevistas Automatizadas 24/7</h3>
              <p class="text-zinc-400 leading-relaxed">Tu Clon Digital responde preguntas de reclutadores utilizando estrictamente tu experiencia (RAG). Trabaja para ti mientras duermes, logrando la entrevista antes de la entrevista.</p>
            </div>
            
            <!-- Feature 2 -->
            <div class="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-indigo-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="w-12 h-12 rounded-2xl bg-indigo-500/20 text-indigo-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <FileText :size="24" />
              </div>
              <h3 class="text-xl font-bold text-white mb-3">CV Wizard Inteligente</h3>
              <p class="text-zinc-400 leading-relaxed">No pierdas tiempo configurando. Sube tu viejo PDF y nuestro asistente extraerá y construirá toda tu base de datos profesional en segundos usando IA generativa.</p>
            </div>

            <!-- Feature 3 -->
            <div class="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-purple-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="w-12 h-12 rounded-2xl bg-purple-500/20 text-purple-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LayoutTemplate :size="24" />
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Diseño Premium y Personalizable</h3>
              <p class="text-zinc-400 leading-relaxed">Destaca al instante. Elige entre 5 temas visuales de vanguardia (como Cyber Neon o Dark Glass) y arquitecturas dinámicas (Bento Grid) que demuestran alta calidad profesional.</p>
            </div>
            
            <!-- Feature 4 -->
            <div class="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-emerald-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="w-12 h-12 rounded-2xl bg-emerald-500/20 text-emerald-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <Network :size="24" />
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Tribunal de IA y Búsqueda B2B</h3>
              <p class="text-zinc-400 leading-relaxed">Entra en el radar de los Hunters. Las empresas utilizan nuestra búsqueda semántica y nuestro Tribunal de IA para evaluar simultáneamente a múltiples candidatos, conectándote directo con ofertas reales.</p>
            </div>
            
            <!-- Feature 5 -->
            <div class="p-8 rounded-3xl bg-zinc-900/50 border border-white/5 hover:border-orange-500/50 transition-colors group lg:col-span-2" v-motion-slide-visible-once-bottom>
              <div class="w-12 h-12 rounded-2xl bg-orange-500/20 text-orange-400 flex items-center justify-center mb-6 group-hover:scale-110 transition-transform">
                <LineChart :size="24" />
              </div>
              <h3 class="text-xl font-bold text-white mb-3">Analíticas de Chat y Mensajería P2P</h3>
              <p class="text-zinc-400 leading-relaxed">Descubre exactamente qué preguntan las empresas leyendo los registros de tu Chat IA. Cuando hay interés mutuo, conecta de inmediato a través de nuestra red profesional y mensajería en tiempo real integrada.</p>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- 4. REVIEWS Y SOCIAL PROOF                      -->
        <!-- ============================================== -->
        <section class="w-full bg-gradient-to-b from-transparent to-zinc-950/80 py-24 z-10 relative">
          <div class="max-w-6xl mx-auto px-6">
            <h2 class="text-3xl md:text-4xl font-bold text-center mb-16">Lo que dicen los expertos sobre OppyTalent</h2>
            <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
              <div class="p-6 rounded-2xl bg-white/5 border border-white/5" v-for="i in 3" :key="i">
                <div class="flex items-center gap-2 text-amber-400 mb-4">
                  <Star fill="currentColor" :size="16" v-for="s in 5" :key="s" />
                </div>
                <p class="text-zinc-300 mb-6 italic">"Revisar un portafolio en OppyTalent me ahorró 30 minutos de entrevista técnica inicial. Le pregunté al Clon Digital del candidato sobre su rol como Lead y me dio detalles precisos que un PDF jamás me habría contado. Increíble plataforma."</p>
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-zinc-800"></div>
                  <div>
                    <div class="font-bold text-sm">Elena R.</div>
                    <div class="text-xs text-zinc-500">Talent Acquisition Manager</div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- 5. FAQ (SEO: Preguntas Cola Larga)             -->
        <!-- ============================================== -->
        <section class="w-full max-w-3xl mx-auto px-6 py-24 z-10">
          <div class="text-center mb-12">
            <h2 class="text-3xl font-bold mb-4">Preguntas Frecuentes sobre Portafolios con IA</h2>
            <p class="text-zinc-400">Todo lo que necesitas saber antes de crear tu Gemelo Digital.</p>
          </div>
          
          <div class="space-y-4">
            <!-- FAQ 1 -->
            <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
                <span>¿Cómo funciona el Clon Digital de IA en mi portafolio?</span>
                <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
              </summary>
              <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
                El asistente interactivo utiliza un sistema RAG (Generación Aumentada por Recuperación). Se alimenta exclusivamente de la experiencia y proyectos que tú apruebas en tu perfil. Cuando un reclutador pregunta, la IA inyecta ese contexto para responder con tus propias habilidades, garantizando que "venda" tu talento sin alucinar respuestas.
              </div>
            </details>
            
            <!-- FAQ 2 -->
            <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
                <span>¿Por qué elegir OppyTalent en lugar de mi perfil en LinkedIn?</span>
                <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
              </summary>
              <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
                LinkedIn es esencial para ser descubierto, pero OppyTalent está diseñado para <strong>convencer y evaluar</strong>. Mientras LinkedIn es una lista estática, OppyTalent permite que el reclutador tenga una pre-entrevista técnica con tu Clon Digital. Además, nuestro diseño arquitectónico premium (Bento Grid, Glassmorphism) eleva drásticamente la percepción de tu calidad profesional.
              </div>
            </details>
            
            <!-- FAQ 3 -->
            <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
              <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
                <span>¿Mis datos están seguros si usan Inteligencia Artificial?</span>
                <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
              </summary>
              <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
                Absolutamente. Utilizamos un modelo Enterprise con soporte BYOK (Bring Your Own Key). Esto significa que puedes conectar tu propia API Key de Inteligencia Artificial encriptada en nuestra base de datos con AES-256. Tendrás control absoluto de tu información.
              </div>
            </details>
          </div>
        </section>

        <!-- Footer -->
        <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500 z-10 relative bg-[#050505]">
          <p>© {{ new Date().getFullYear() }} OppyTalent. Construyendo el futuro del talento digital.</p>
        </footer>

      </main>
    </div>
  </AuroraBackground>
</template>

<script setup>
import { computed } from 'vue'
import AuroraBackground from '../../components/ui/AuroraBackground.vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  ArrowRight, Sparkles, XCircle, CheckCircle2, 
  Bot, LayoutTemplate, LineChart, ShieldCheck, FileText, Network,
  Star, ChevronDown
} from 'lucide-vue-next'

// Schema Markup SEO para que Google identifique la página como SaaS
const schemaMarkup = computed(() => {
  return JSON.stringify({
    "@context": "https://schema.org",
    "@type": "SoftwareApplication",
    "name": "OppyTalent",
    "operatingSystem": "Web Browser",
    "applicationCategory": "BusinessApplication",
    "offers": {
      "@type": "Offer",
      "price": "0.00",
      "priceCurrency": "USD"
    },
    "description": "Plataforma de creación de portafolios interactivos con Inteligencia Artificial y Gemelos Digitales para profesionales y empresas.",
    "url": "https://oppytalent.com"
  })
})
</script>

<style scoped>
.perspective-1000 {
  perspective: 1000px;
}
.rotate-y-\[-12deg\] {
  transform: rotateY(-12deg);
}
.rotate-x-\[8deg\] {
  transform: rotateX(8deg);
}

/* Ocultar barra de scroll para una experiencia inmersiva */
::-webkit-scrollbar {
  width: 8px;
}
::-webkit-scrollbar-track {
  background: #050505; 
}
::-webkit-scrollbar-thumb {
  background: #333; 
  border-radius: 4px;
}
::-webkit-scrollbar-thumb:hover {
  background: #555; 
}
</style>
