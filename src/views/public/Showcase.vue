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

        <!-- View Toggle -->
        <div class="flex justify-center mb-8 gap-2" v-motion :initial="{ opacity: 0 }" :enter="{ opacity: 1, transition: { delay: 100 } }">
          <button @click="viewMode = 'grid'" :class="['p-2.5 rounded-lg border transition-all', viewMode === 'grid' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white']" aria-label="Vista de cuadrícula">
            <LayoutGrid :size="20" />
          </button>
          <button @click="viewMode = 'list'" :class="['p-2.5 rounded-lg border transition-all', viewMode === 'list' ? 'bg-primary/20 border-primary/50 text-primary' : 'bg-white/5 border-white/10 text-zinc-400 hover:bg-white/10 hover:text-white']" aria-label="Vista de lista">
            <ListIcon :size="20" />
          </button>
        </div>

        <div :class="[viewMode === 'grid' ? 'grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6 w-full' : 'flex flex-col gap-4 w-full max-w-4xl mx-auto']">
          <div 
            v-for="(demo, index) in demos" 
            :key="demo.username"
            v-motion
            :initial="{ opacity: 0, scale: 0.95, y: 20 }"
            :enter="{ opacity: 1, scale: 1, y: 0, transition: { delay: 150 + (viewMode === 'grid' ? index * 50 : index * 30) } }"
            class="group"
          >
            <router-link :to="`/${demo.username}`" class="block h-full">
              <div :class="['h-full relative overflow-hidden rounded-2xl bg-zinc-900/40 border border-white/5 backdrop-blur-md transition-all duration-300 hover:bg-white/10 hover:border-primary/50 hover:shadow-[0_0_30px_-5px_rgba(56,189,248,0.3)] hover:-translate-y-1', viewMode === 'grid' ? 'flex flex-col items-center text-center p-6' : 'flex flex-col sm:flex-row items-center text-center sm:text-left p-4 sm:p-5 gap-4 sm:gap-6']">
                <!-- Icono -->
                <div :class="['rounded-full bg-primary/10 border border-primary/20 flex items-center justify-center text-primary group-hover:scale-110 group-hover:bg-primary/20 transition-transform duration-300', viewMode === 'grid' ? 'w-16 h-16 mb-4' : 'w-14 h-14 shrink-0 mb-2 sm:mb-0']">
                  <component :is="demo.icon" :size="viewMode === 'grid' ? 32 : 26" stroke-width="1.5" />
                </div>
                
                <!-- Titulo -->
                <div :class="['flex-1 w-full', viewMode === 'list' ? 'sm:w-auto' : '']">
                  <h3 :class="['font-bold text-white group-hover:text-primary transition-colors', viewMode === 'grid' ? 'text-xl mb-2' : 'text-lg sm:text-xl mb-1']">{{ demo.ocupacion }}</h3>
                  <p :class="['text-sm text-zinc-400 font-light', viewMode === 'grid' ? 'mb-6' : 'mb-4 sm:mb-0']">
                    Ver demo interactiva
                  </p>
                </div>
                
                <!-- Boton sutil -->
                <div :class="['rounded-lg bg-white/5 border border-white/10 text-xs font-semibold uppercase tracking-wider text-zinc-300 group-hover:bg-primary/20 group-hover:text-primary group-hover:border-primary/30 transition-colors flex items-center justify-center gap-2', viewMode === 'grid' ? 'w-full py-2 mt-auto' : 'w-full sm:w-auto py-2.5 px-6']">
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
import { ref, computed } from 'vue'
import AuroraBackground from '../../components/ui/AuroraBackground.vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import Badge from '../../components/ui/Badge.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { 
  ArrowRight, 
  Sparkles,
  LayoutGrid,
  List as ListIcon,
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

const viewMode = ref('list')

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
