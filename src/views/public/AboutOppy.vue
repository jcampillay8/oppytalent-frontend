<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-purple-500/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HEADER -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center mb-16" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-purple-500/30 text-purple-400 bg-purple-500/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          El Origen
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          Nacido de la frustración.<br />
          Construido para el <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">futuro.</span>
        </h1>
      </section>

      <!-- CARTA ABIERTA (MANIFIESTO) -->
      <section class="w-full max-w-3xl mx-auto px-6 mb-24">
        <div class="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 md:p-12 relative shadow-2xl overflow-hidden" v-motion-slide-visible-once-bottom>
          <!-- Decoración visual -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div class="relative z-10 text-zinc-300 space-y-6 text-lg leading-relaxed font-light">
            <p class="font-medium text-white text-xl">Hola, soy Jaime Campillay.</p>
            
            <p>
              Hace un tiempo me encontré en una situación que probablemente conoces muy bien: <strong>estaba desempleado, buscando trabajo y enviando decenas de currículums en PDF que caían en un agujero negro.</strong>
            </p>
            
            <p>
              Como desarrollador y arquitecto de software, la frustración era doble. Sabía que tenía el talento, conocía las tecnologías (Vue, FastAPI, Inteligencia Artificial, Bases de Datos Vectoriales), pero no tenía cómo demostrar mi verdadero impacto en una simple hoja A4 estática. El sistema de reclutamiento tradicional me estaba limitando.
            </p>
            
            <p>
              <strong>Así que decidí hackear el sistema.</strong>
            </p>
            
            <p>
              Me propuse construir la herramienta definitiva para mí mismo: un portafolio interactivo, hermoso, y equipado con mi propio "Clon Digital" alimentado por IA. Un asistente que pudiera responder preguntas técnicas de los reclutadores 24/7 mientras yo dormía o estudiaba.
            </p>
            
            <p>
              Cuando vi el resultado, me di cuenta de algo más grande: <span class="text-white font-medium">yo no era el único con este problema.</span> Había miles de profesionales talentosos en Latinoamérica y el mundo siendo ignorados por culpa de un ATS (sistema automático) o un PDF aburrido.
            </p>
            
            <p>
              Decidí <strong>democratizar</strong> la tecnología. Adapté mi código, creé OppyTalent y lo abrí al mundo.
            </p>
            
            <p>
              Seré completamente honesto contigo: construir esto es mi mejor currículum. Si esta plataforma crece, mi visibilidad crece y mis oportunidades también. Al usar OppyTalent, no solo estás elevando tu propia carrera profesional, estás apoyando el trabajo de un desarrollador independiente que busca cambiar las reglas del juego.
            </p>
            
            <p class="font-medium text-purple-400 pt-4">
              Bienvenidos a la revolución del talento.<br />
              Bienvenidos a OppyTalent.
            </p>
          </div>

          <!-- Perfil del Creador -->
          <div class="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px]">
                <div class="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  JC
                </div>
              </div>
              <div>
                <h3 class="text-white font-bold text-lg">Jaime Campillay</h3>
                <p class="text-zinc-500 text-sm">Fundador & Arquitecto de Software</p>
              </div>
            </div>
            <router-link to="/jcampillayworks">
              <NeonButton variant="outline" class="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-sm py-2">
                Hablar con mi Clon Digital
              </NeonButton>
            </router-link>
          </div>
        </div>
      </section>

      <!-- VALORES CORE Y ROADMAP -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-24">
        <h2 class="text-3xl font-bold text-center mb-12" v-motion-slide-visible-once-bottom>Pilares del Proyecto</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Transparencia -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-purple-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
              <Heart :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Transparencia Radical</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Construimos en público. Hablamos claro sobre cómo funciona la Inteligencia Artificial (cero alucinaciones, puro RAG) y no ocultamos nuestra historia.
            </p>
          </div>

          <!-- Privacidad (BYOK) -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
              <ShieldCheck :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Privacidad y Control</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              Tus datos son tuyos. Promovemos el modelo <strong>Bring Your Own Key (BYOK)</strong> con encriptación AES-256 para que tengas el control absoluto de tus costos y privacidad de IA.
            </p>
          </div>

          <!-- Innovación (eAwards) -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-pink-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-pink-400 mb-6">
              <Trophy :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">Disrupción Constante</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              De un proyecto personal a ser considerado para iniciativas globales de innovación como los <strong>NTT DATA eAwards</strong>. Construimos herramientas que desafían el status quo.
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <h2 class="text-3xl font-bold mb-6 text-white">Únete a la Revolución</h2>
        <p class="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
          Ya sea que busques destacar en tu próxima entrevista o descubrir talento oculto, hay un lugar para ti en OppyTalent.
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/register" class="w-full sm:w-auto">
            <NeonButton glow variant="primary" class="w-full bg-purple-600 hover:bg-purple-500 border-purple-400 px-8 py-3">
              Crear mi Cuenta Gratis
            </NeonButton>
          </router-link>
          <router-link to="/features" class="w-full sm:w-auto">
            <NeonButton variant="outline" class="w-full text-zinc-300 border-white/10 hover:bg-white/5 px-8 py-3">
              Ver Funcionalidades
            </NeonButton>
          </router-link>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Hecho con pasión por el código.</p>
    </footer>
  </div>
</template>

<script setup>
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  Heart,
  ShieldCheck,
  Trophy
} from 'lucide-vue-next'
</script>
