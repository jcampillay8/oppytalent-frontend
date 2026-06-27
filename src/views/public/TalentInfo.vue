<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-blue-500/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO SECTION -->
      <section class="w-full max-w-6xl mx-auto px-6 text-center mb-24" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-blue-500/30 text-blue-400 bg-blue-500/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          Para Profesionales y Talentos
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          Deja de enviar PDFs.<br />
          Haz que las empresas <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">te busquen a ti.</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
          El mercado laboral está roto. Mientras envías decenas de currículums que nadie lee, los reclutadores buscan talento desesperadamente. OppyTalent es tu agente de relaciones públicas 24/7.
        </p>
        <div class="mt-10 flex justify-center">
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold shadow-lg shadow-blue-500/30 bg-blue-600 hover:bg-blue-500 border-blue-400">
              Crear mi Portafolio Gratis
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

      <!-- DOLOR Y SOLUCIÓN -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="p-8 rounded-3xl bg-red-950/10 border border-red-900/30" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                <XCircle :size="24" />
              </div>
              <h3 class="text-2xl font-bold text-zinc-200">El Camino Tradicional</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              Envías 50 CVs en formato PDF. Quizás 5 son abiertos. Un reclutador lo mira por 6 segundos y, al no ver la palabra clave exacta en el primer párrafo, descarta tu perfil aunque seas el candidato ideal. Estás jugando a la lotería.
            </p>
          </div>
          
          <div class="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden" v-motion-slide-visible-once-bottom>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 :size="24" />
                </div>
                <h3 class="text-2xl font-bold text-white">La Ventaja OppyTalent</h3>
              </div>
              <p class="text-zinc-300 leading-relaxed mb-6">
                Tu perfil es indexado por nuestra Búsqueda Semántica B2B. Cuando un Hunter busca "experto en escalabilidad", te encuentra a ti. Entran a tu portafolio, le preguntan a tu Clon Digital sobre tus proyectos, y la IA los convence de agendar una entrevista.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- BENEFICIOS CLAVE -->
      <section class="w-full bg-zinc-900/30 border-y border-white/5 py-24 mb-32">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
            <h2 class="text-3xl md:text-5xl font-bold mb-4">¿Por qué los mejores usan OppyTalent?</h2>
            <p class="text-zinc-400">Diseñado para maximizar tu empleabilidad sin esfuerzo adicional.</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">Véndete Mientras Duermes</h3>
              <p class="text-zinc-400 leading-relaxed">
                Tu asistente IA está entrenado con tu perfil (RAG). Responde preguntas técnicas y defiende tus decisiones de arquitectura frente a los reclutadores a las 3 AM.
              </p>
            </div>
            
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-cyan-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">Métricas que Importan</h3>
              <p class="text-zinc-400 leading-relaxed">
                Descubre qué te falta para tu próximo ascenso. Lee los registros (logs) del chat para saber exactamente qué tecnologías están buscando las empresas en tu perfil.
              </p>
            </div>
            
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-blue-400/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-blue-400/10 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-300 mb-6 group-hover:scale-110 transition-transform">
                <Trophy :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">Exposición Directa (B2B)</h3>
              <p class="text-zinc-400 leading-relaxed">
                No eres solo un enlace web. Eres parte de una base de datos donde cientos de reclutadores utilizan nuestro <em>Tribunal de IA</em> para encontrar talento de alto nivel.
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CASOS DE USO -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16" v-motion-slide-visible-once-bottom>Un portafolio para cada disciplina</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Devs & Architects -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-emerald-400">
              <Code2 :size="28" />
              <h3 class="text-xl font-bold text-white">Desarrolladores & Arquitectos</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              El código fuente no explica el impacto en el negocio. Tu Clon Digital puede explicar a un reclutador no técnico cómo tu arquitectura de microservicios ahorró $10k mensuales en AWS.
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>✓ Muestra tu Stack Tecnológico detallado</li>
              <li>✓ Enlaza tus repositorios de GitHub</li>
              <li>✓ La IA explica tus decisiones técnicas</li>
            </ul>
          </div>
          
          <!-- PMs & Líderes -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-purple-400">
              <Terminal :size="28" />
              <h3 class="text-xl font-bold text-white">Líderes & Product Managers</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              El liderazgo es difícil de plasmar en un PDF. Usa OppyTalent para mostrar métricas, KPIs, metodologías ágiles aplicadas y cómo llevaste productos desde la idea hasta el lanzamiento.
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>✓ Destaca logros y KPIs comerciales</li>
              <li>✓ Muestra cronogramas de tus proyectos</li>
              <li>✓ La IA negocia y perfila tu cultura de trabajo</li>
            </ul>
          </div>
          
          <!-- Diseño UX/UI -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-pink-400">
              <PenTool :size="28" />
              <h3 class="text-xl font-bold text-white">Diseñadores (UX/UI)</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              Un currículum sin diseño es un pecado para un creativo. Aprovecha nuestros temas Bento Grid y Glassmorphism para que tu portafolio sea tu mejor carta de presentación visual.
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>✓ Galerías de imágenes inmersivas</li>
              <li>✓ Enlaces a Figma o Behance</li>
              <li>✓ Temas visuales personalizables (Ej. Rose Gold)</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- TESTIMONIOS -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16" v-motion-slide-visible-once-bottom>Historias de Éxito</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 relative" v-motion-slide-visible-once-bottom>
            <MessageSquare :size="40" class="text-white/10 absolute top-8 right-8" />
            <p class="text-zinc-300 italic leading-relaxed mb-8 relative z-10">
              "Llevaba 6 meses enviando mi PDF sin respuestas. Subí mi CV al Wizard de OppyTalent, configuré el Clon Digital y a la semana me contactaron por el chat interno de la plataforma. El reclutador ya había 'entrevistado' a mi IA. Conseguí el puesto de Senior Backend."
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center font-bold text-blue-300 border border-blue-500/30">JG</div>
              <div>
                <h4 class="font-bold text-white">Javier G.</h4>
                <p class="text-sm text-zinc-500">Senior Backend Engineer</p>
              </div>
            </div>
          </div>
          
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 relative" v-motion-slide-visible-once-bottom>
            <MessageSquare :size="40" class="text-white/10 absolute top-8 right-8" />
            <p class="text-zinc-300 italic leading-relaxed mb-8 relative z-10">
              "Como DevOps es muy difícil explicar mi trabajo en una página de papel. OppyTalent me permitió detallar la arquitectura de cada proyecto. Lo mejor fue ver en las analíticas cómo un Hunter le preguntaba a mi IA sobre Kubernetes."
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-300 border border-emerald-500/30">SM</div>
              <div>
                <h4 class="font-bold text-white">Sara M.</h4>
                <p class="text-sm text-zinc-500">Cloud & DevOps Specialist</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <div class="p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">Tu Clon Digital te está esperando</h2>
          <p class="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
            El 90% del trabajo lo hace nuestro asistente de IA al extraer tu CV actual. Crea tu portafolio premium hoy mismo y cambia las reglas del juego.
          </p>
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold bg-blue-600 hover:bg-blue-500 border-blue-400">
              Comenzar Ahora (Gratis)
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Impulsando el talento tecnológico mundial.</p>
    </footer>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  ArrowRight,
  CheckCircle2, 
  XCircle,
  BrainCircuit,
  TrendingUp,
  Trophy,
  Code2,
  Terminal,
  PenTool,
  MessageSquare
} from 'lucide-vue-next'
</script>
