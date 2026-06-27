<template>
  <AuroraBackground>
    <div class="min-h-screen text-zinc-50 flex flex-col font-sans selection:bg-primary/30 scroll-smooth">
      <LandingNavbar />

      <main class="flex-1 flex flex-col items-center pt-24 pb-20 px-6 md:px-16 w-full max-w-7xl mx-auto z-10 relative">
        <div class="text-center mb-16" v-motion :initial="{ opacity: 0, y: 20 }" :enter="{ opacity: 1, y: 0, transition: { delay: 100 } }">
          <Badge variant="outline" class="mb-6 border-primary/30 text-primary/90 bg-primary/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
            Vitrina de Profesiones
          </Badge>
          <h1 class="text-4xl md:text-5xl font-extrabold tracking-tight mb-6 text-white drop-shadow-sm">
            OppyTalent se adapta a <span class="bg-gradient-to-r from-blue-400 via-teal-400 to-emerald-400 bg-clip-text text-transparent">tu Profesión</span>
          </h1>
          <p class="text-lg text-zinc-400 max-w-2xl mx-auto font-light">
            Explora cómo se ve el Clon Digital y el Portafolio Interactivo para diferentes perfiles profesionales. Selecciona un demo a continuación para ver OppyTalent en acción.
          </p>
        </div>

        <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full">
          <div 
            v-for="(demo, index) in demos" 
            :key="demo.username"
            v-motion
            :initial="{ opacity: 0, scale: 0.95, y: 20 }"
            :enter="{ opacity: 1, scale: 1, y: 0, transition: { delay: 150 + index * 50 } }"
            class="group"
          >
            <router-link :to="`/${demo.username}`" class="block h-full">
              <div class="h-full relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md p-6 flex flex-col items-center text-center transition-all duration-300 hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)] hover:-translate-y-1">
                <!-- Icono -->
                <div class="w-16 h-16 rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center mb-4 text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-transform duration-300">
                  <component :is="demo.icon" :size="32" stroke-width="1.5" />
                </div>
                
                <!-- Titulo -->
                <h3 class="text-xl font-bold text-white mb-2 group-hover:text-primary transition-colors">{{ demo.ocupacion }}</h3>
                <p class="text-sm text-zinc-400 font-light mb-6 flex-1">
                  Ver demo interactiva
                </p>
                
                <!-- Boton sutil -->
                <div class="w-full py-2 rounded-lg bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-colors flex items-center justify-center gap-2">
                  Visitar Perfil <ArrowRight :size="14" />
                </div>
              </div>
            </router-link>
          </div>
        </div>

        <!-- Call to action al final -->
        <div class="mt-20 text-center" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 800 } }">
          <h2 class="text-2xl font-bold mb-6">¿Listo para crear tu propio Gemelo Digital?</h2>
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-semibold shadow-lg shadow-primary/25">
              Crear mi Portafolio Gratis
              <Sparkles :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </main>
    </div>
  </AuroraBackground>
</template>

<script setup>
import { computed } from 'vue'
import AuroraBackground from '../../components/ui/AuroraBackground.vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import Badge from '../../components/ui/Badge.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { 
  ArrowRight, 
  Sparkles,
  HeartPulse,
  Building2,
  Scale,
  Megaphone,
  Calculator,
  Cpu,
  Wrench,
  Microscope,
  FlaskConical,
  BrainCircuit,
  ConciergeBell,
  TestTube,
  ChefHat
} from 'lucide-vue-next'

const demos = [
  { username: 'demo-arquitecto', ocupacion: 'Arquitecto', icon: Building2 },
  { username: 'demo-chefdepartida', ocupacion: 'Chef de Partida', icon: ChefHat },
  { username: 'demo-contadorauditor', ocupacion: 'Contador Auditor', icon: Calculator },
  { username: 'demo-enfermera', ocupacion: 'Enfermera Clínica', icon: HeartPulse },
  { username: 'demo-ingenierocivilenautomatizacion', ocupacion: 'Ingeniero en Automatización', icon: Cpu },
  { username: 'demo-abogado', ocupacion: 'Licenciado en Derecho', icon: Scale },
  { username: 'demo-comunicadora', ocupacion: 'Comunicación y Marketing', icon: Megaphone },
  { username: 'demo-mecanico', ocupacion: 'Mecánico / Soldador', icon: Wrench },
  { username: 'demo-profesora', ocupacion: 'Profesora de Biología', icon: Microscope },
  { username: 'demo-profesordequimica', ocupacion: 'Profesor de Química', icon: FlaskConical },
  { username: 'demo-psicologa', ocupacion: 'Psicóloga Clínica/Laboral', icon: BrainCircuit },
  { username: 'demo-recepcionista', ocupacion: 'Recepcionista', icon: ConciergeBell },
  { username: 'demo-tecnicoquimico', ocupacion: 'Técnico Químico', icon: TestTube }
]
</script>
