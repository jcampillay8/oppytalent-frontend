<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO FEATURES -->
      <section class="w-full max-w-6xl mx-auto px-6 text-center mb-24" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-primary/30 text-primary/90 bg-primary/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          Tecnología y Arquitectura
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          Ingeniería de Clase Mundial<br />
          para tu <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">Marca Personal</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
          OppyTalent no es solo un creador de sitios web. Es un ecosistema impulsado por Inteligencia Artificial diseñado para transformar la forma en que los profesionales exhiben su talento y las empresas descubren valor.
        </p>
      </section>

      <!-- FEATURE: CLON DIGITAL (RAG) -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-primary/10 w-fit rounded-2xl mb-6">
              <Bot :size="32" class="text-primary" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Tu Clon Digital con Arquitectura RAG</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              El Chatbot de tu portafolio no es un LLM genérico. Utilizamos <strong>Retrieval-Augmented Generation (RAG)</strong>. Esto significa que la Inteligencia Artificial busca semánticamente dentro de tu base de datos (proyectos, experiencia, estudios) antes de responder.
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>Cero Alucinaciones:</strong> Responde basándose estrictamente en tus datos aprobados.</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>Defensa de Marca:</strong> Desvía preguntas tóxicas o fuera del contexto profesional.</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>Reglas de Pitch:</strong> Configura palabras clave para que la IA dispare tus mejores argumentos de venta.</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full" v-motion-slide-visible-once-bottom>
            <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 p-6 shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50"></div>
              <div class="relative z-10 flex flex-col gap-4">
                <div class="self-end bg-white/10 p-3 rounded-2xl rounded-tr-none max-w-[80%] border border-white/5 text-sm">
                  ¿Qué experiencia tienes liderando equipos?
                </div>
                <div class="self-start bg-primary/20 border border-primary/30 p-4 rounded-2xl rounded-tl-none max-w-[90%] text-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <div class="flex items-center gap-2 mb-2 font-semibold text-primary"><Sparkles :size="14" /> Clon Digital</div>
                  He liderado equipos de hasta 8 desarrolladores en MercadoTech durante 3 años. Fui responsable de la migración a microservicios, logrando reducir el time-to-market en un 40%. Si te interesa, puedes ver más en la sección de "Experiencia".
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: CV WIZARD -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-orange-500/10 w-fit rounded-2xl mb-6">
              <Wand2 :size="32" class="text-orange-400" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">CV Wizard: Magia Generativa</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              No tienes que reescribir tu historia profesional. Sube tu currículum en PDF y nuestro motor de IA extraerá de forma inteligente toda tu información estructurada.
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-orange-400 shrink-0 mt-1" /> <span><strong>Clasificación Automática:</strong> Separa proyectos, experiencia, estudios y reconocimientos al instante.</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-orange-400 shrink-0 mt-1" /> <span><strong>Constructor Visual:</strong> Edita y reordena los items antes de impactar tu base de datos.</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full" v-motion-slide-visible-once-bottom>
             <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
                <div class="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-50"></div>
                <div class="border-2 border-dashed border-orange-500/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm relative z-10 w-full max-w-sm">
                  <FileText :size="48" class="text-orange-400 mb-4" />
                  <div class="font-bold text-lg mb-2">Arrastra tu CV aquí</div>
                  <div class="text-sm text-zinc-500">Soportamos PDF, DOCX o Imágenes</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: DISEÑO & UI -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-purple-500/10 w-fit rounded-2xl mb-6">
              <LayoutTemplate :size="32" class="text-purple-400" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">Diseño Premium, Sistemas Modulares</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              La estética importa. Ofrecemos diseños inmersivos construidos sobre principios modernos de UI/UX como el <em>Glassmorphism</em> y el diseño <em>Bento Box</em>.
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>Temas Dinámicos:</strong> Cambia instantáneamente entre 5 paletas curadas (Dark Glass, Cyber Neon, Rose Gold, etc).</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>Arquitectura Bento:</strong> Muestra tu experiencia en bloques modulares que aprovechan el espacio horizontal y vertical.</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>Mobile-First:</strong> Tu portafolio lucirá perfecto tanto en un monitor ultrawide como en el smartphone del reclutador.</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full grid grid-cols-2 gap-4" v-motion-slide-visible-once-bottom>
             <div class="col-span-2 h-32 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
               <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
               <div class="w-1/3 h-4 bg-white/20 rounded mb-2"></div>
               <div class="w-1/2 h-3 bg-white/10 rounded"></div>
             </div>
             <div class="h-40 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                <div class="w-12 h-12 rounded-full bg-white/10 mb-4"></div>
             </div>
             <div class="h-40 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
               <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
               <div class="w-full h-full border border-white/5 rounded-lg"></div>
             </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: BYOK Y SEGURIDAD -->
      <section class="w-full bg-zinc-900/30 border-y border-white/5 py-24 mb-24">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <div class="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-8" v-motion-slide-visible-once-bottom>
            <Lock :size="40" class="text-emerald-400" />
          </div>
          <h2 class="text-3xl md:text-5xl font-bold mb-6" v-motion-slide-visible-once-bottom>Privacidad y Control Total (BYOK)</h2>
          <p class="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12" v-motion-slide-visible-once-bottom>
            Entendemos el valor de tus datos. Por eso implementamos el modelo <strong>Bring Your Own Key (BYOK)</strong>. Puedes conectar tu propia clave API de Google Gemini para procesar la IA. Nosotros encriptamos tu llave con criptografía <strong>AES-256</strong> en nuestra base de datos. Nadie, ni siquiera nosotros, tiene acceso a tu llave. Tú decides cómo y cuánto se usa.
          </p>
        </div>
      </section>

      <!-- TABLA COMPARATIVA -->
      <section class="w-full max-w-5xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12" v-motion-slide-visible-once-bottom>La Ventaja Injusta de OppyTalent</h2>
        <div class="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm" v-motion-slide-visible-once-bottom>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-900/80 border-b border-white/10">
                <th class="p-6 font-semibold text-zinc-300 uppercase tracking-wider text-sm">Característica</th>
                <th class="p-6 font-bold text-white uppercase tracking-wider text-sm bg-primary/10 border-l border-primary/20"><Sparkles :size="16" class="inline mr-2 text-primary" /> OppyTalent</th>
                <th class="p-6 font-semibold text-zinc-500 uppercase tracking-wider text-sm border-l border-white/10">LinkedIn</th>
                <th class="p-6 font-semibold text-zinc-500 uppercase tracking-wider text-sm border-l border-white/10">CV (PDF)</th>
              </tr>
            </thead>
            <tbody class="text-zinc-300 divide-y divide-white/5">
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">Asistente IA Interactivo 24/7</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">Tribunal B2B y Búsqueda Semántica</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /> (Solo Keywords)</td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">Diseño Premium Personalizable</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /> (5 Temas, 2 Layouts)</td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /> (Genérico)</td>
                <td class="p-6 text-zinc-600 border-l border-white/10">Variable</td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">Analíticas de Preguntas de Reclutadores</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">Importación Automática con IA</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <div class="p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">¿Listo para evolucionar tu carrera?</h2>
            <p class="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
              Miles de horas ahorradas en entrevistas irrelevantes. Configura tu portafolio, activa tu Clon Digital y deja que la tecnología hable por ti.
            </p>
            <router-link to="/register">
              <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold shadow-lg shadow-primary/30">
                Comenzar Completamente Gratis
                <ArrowRight :size="20" class="inline ml-2" />
              </NeonButton>
            </router-link>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer Simple -->
    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Plataforma de Empleabilidad Inteligente.</p>
    </footer>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  Bot, 
  Wand2, 
  LayoutTemplate, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  FileText,
  Network
} from 'lucide-vue-next'
</script>
