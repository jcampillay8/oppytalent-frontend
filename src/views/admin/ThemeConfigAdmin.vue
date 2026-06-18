<template>
  
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Palette :size="32" class="text-primary" /> Personalización Visual
        </h1>
        <p class="text-muted-foreground mt-1">Selecciona el estilo visual que mejor represente tu marca personal.</p>
      </div>

      <GlassCard class="p-6 md:p-8 w-full">
        <form @submit.prevent="saveConfig" class="space-y-12">
          
          <!-- SECCIÓN: TEMA VISUAL -->
          <div>
            <h2 class="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <Palette :size="24" class="text-primary" /> Colores del Tema
            </h2>
            <div class="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6">
            <div 
              v-for="theme in availableThemes" 
              :key="theme.id"
              class="relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group"
              :class="form.portfolio_theme === theme.id ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-border/50 hover:border-border hover:scale-[1.01] bg-secondary/20'"
              @click="selectTheme(theme.id)"
            >
              <!-- Selector Activo -->
              <div v-if="form.portfolio_theme === theme.id" class="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                <Check :size="14" class="text-primary-foreground" />
              </div>

              <!-- Preview del Tema -->
              <div class="h-32 p-4 flex flex-col gap-3 relative overflow-hidden" :style="theme.previewStyle">
                <!-- Efecto Glass simulado -->
                <div class="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent mix-blend-overlay"></div>
                <div class="w-3/4 h-3 rounded-md bg-white/20 backdrop-blur-md shadow-sm"></div>
                <div class="w-1/2 h-3 rounded-md bg-white/10 backdrop-blur-md shadow-sm"></div>
                <div class="w-full h-12 rounded-lg bg-white/5 backdrop-blur-md mt-auto border border-white/10 flex items-center px-3">
                  <div class="w-8 h-8 rounded-full bg-white/20"></div>
                </div>
              </div>

              <!-- Info del Tema -->
              <div class="p-4 bg-card/80 backdrop-blur-sm border-t border-border/50">
                <h4 class="font-bold text-foreground mb-1">{{ theme.name }}</h4>
                <p class="text-xs text-muted-foreground leading-relaxed">{{ theme.description }}</p>
              </div>
              </div>
            </div>
          </div>

          <!-- SECCIÓN: ESTRUCTURA (LAYOUT) -->
          <div>
            <h2 class="text-xl font-bold text-foreground mb-4 flex items-center gap-2">
              <LayoutDashboard :size="24" class="text-primary" /> Estructura del Portafolio
            </h2>
            <p class="text-sm text-muted-foreground mb-6">Elige cómo quieres que los reclutadores naveguen por tu perfil profesional.</p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
              
              <!-- Layout Tabs -->
              <div 
                class="relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group bg-card"
                :class="form.portfolio_layout === 'tabs' ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-border/50 hover:border-border hover:scale-[1.01] bg-secondary/20'"
                @click="selectLayout('tabs')"
              >
                <!-- Selector Activo -->
                <div v-if="form.portfolio_layout === 'tabs'" class="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                  <Check :size="14" class="text-primary-foreground" />
                </div>
                
                <!-- Preview Visual: Tabs -->
                <div class="h-40 p-4 bg-muted/30 flex flex-col gap-3 relative overflow-hidden border-b border-border/50">
                  <!-- Header simulación -->
                  <div class="flex gap-2">
                    <div class="w-16 h-6 rounded-full bg-primary/80"></div>
                    <div class="w-16 h-6 rounded-full bg-border"></div>
                    <div class="w-16 h-6 rounded-full bg-border"></div>
                  </div>
                  <!-- Contenido simulación -->
                  <div class="flex-1 rounded-lg bg-card border border-border/50 p-3 flex flex-col gap-2 mt-2 shadow-sm">
                    <div class="flex gap-2">
                      <div class="w-8 h-8 rounded-full bg-border shrink-0"></div>
                      <div class="flex flex-col gap-1 w-full">
                        <div class="w-1/2 h-3 rounded bg-border"></div>
                        <div class="w-3/4 h-2 rounded bg-border/50"></div>
                        <div class="w-full h-2 rounded bg-border/50"></div>
                      </div>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <h4 class="font-bold text-foreground mb-1">Tabs Dinámicos</h4>
                  <p class="text-xs text-muted-foreground leading-relaxed">Navegación tradicional por pestañas. Ideal para lectura extensa y perfiles con mucha información.</p>
                </div>
              </div>

              <!-- Layout Bento Box -->
              <div 
                class="relative rounded-xl border-2 transition-all duration-200 cursor-pointer overflow-hidden group bg-card"
                :class="form.portfolio_layout === 'bento' ? 'border-primary shadow-lg shadow-primary/20 scale-[1.02]' : 'border-border/50 hover:border-border hover:scale-[1.01] bg-secondary/20'"
                @click="selectLayout('bento')"
              >
                <!-- Selector Activo -->
                <div v-if="form.portfolio_layout === 'bento'" class="absolute top-3 right-3 w-6 h-6 bg-primary rounded-full flex items-center justify-center shadow-md z-10">
                  <Check :size="14" class="text-primary-foreground" />
                </div>
                
                <!-- Preview Visual: Bento Box -->
                <div class="h-40 p-4 bg-muted/30 relative overflow-hidden border-b border-border/50">
                  <!-- Grid simulación -->
                  <div class="w-full h-full grid grid-cols-3 grid-rows-2 gap-2">
                    <!-- Caja Grande -->
                    <div class="col-span-2 row-span-2 rounded-lg bg-primary/20 border border-primary/30 p-2 flex flex-col justify-end">
                      <div class="w-1/2 h-2 rounded bg-primary/60 mb-1"></div>
                      <div class="w-3/4 h-2 rounded bg-primary/40"></div>
                    </div>
                    <!-- Cajas Pequeñas -->
                    <div class="col-span-1 row-span-1 rounded-lg bg-card border border-border/50 p-2 flex items-center justify-center">
                      <div class="w-6 h-6 rounded bg-border"></div>
                    </div>
                    <div class="col-span-1 row-span-1 rounded-lg bg-card border border-border/50 p-2 flex items-center justify-center">
                       <div class="w-6 h-6 rounded bg-border"></div>
                    </div>
                  </div>
                </div>

                <div class="p-4">
                  <h4 class="font-bold text-foreground mb-1">Bento Box</h4>
                  <p class="text-xs text-muted-foreground leading-relaxed">Cuadrícula interactiva de vanguardia. Muestra tu perfil entero de un solo vistazo. Altamente visual.</p>
                </div>
              </div>

            </div>
          </div>

          <div class="flex justify-end pt-6 border-t border-border/50">
            <NeonButton type="submit" glow :disabled="saving">
              <template #icon-left><Save :size="18" v-if="!saving" /></template>
              <span v-if="saving" class="flex items-center gap-2">
                <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                Guardando...
              </span>
              <span v-else>Guardar Apariencia</span>
            </NeonButton>
          </div>
        </form>
      </GlassCard>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { Palette, Check, Save, LayoutDashboard } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { useThemeStore } from '../../stores/useThemeStore'
import { api } from '../../services/api'

const authStore = useAuthStore()
const themeStore = useThemeStore()

const form = ref({
  portfolio_theme: 'dark-glass',
  portfolio_layout: 'tabs'
})

const saving = ref(false)

const availableThemes = [
  {
    id: 'dark-glass',
    name: 'Dark Glass',
    description: 'Elegante, tecnológico y profundo. (Por defecto)',
    previewStyle: { background: 'linear-gradient(135deg, #09090b 0%, #18181b 100%)' }
  },
  {
    id: 'light-minimalist',
    name: 'Light Minimal',
    description: 'Limpio, luminoso y profesional.',
    previewStyle: { background: '#f8fafc' }
  },
  {
    id: 'cyber-neon',
    name: 'Cyber Neon',
    description: 'Alto contraste, vibrante y hacker.',
    previewStyle: { background: '#000000' }
  },
  {
    id: 'ocean-blue',
    name: 'Ocean Blue',
    description: 'Corporativo, serio y confiable. Estilo OppyTec.',
    previewStyle: { background: 'linear-gradient(135deg, #0f172a 0%, #1e3a8a 100%)' }
  },
  {
    id: 'rose-gold',
    name: 'Rose Gold',
    description: 'Creativo, cálido y personal.',
    previewStyle: { background: 'linear-gradient(135deg, #2a101f 0%, #701a40 100%)' }
  }
]

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  }
  
  if (authStore.user) {
    try {
      const data = await api.getUserByUsername(authStore.user.username.split('@')[0])
      form.value.portfolio_theme = data.portfolio_theme || 'dark-glass'
      form.value.portfolio_layout = data.portfolio_layout || 'tabs'
      themeStore.setLayout(form.value.portfolio_layout)
      themeStore.setTheme(form.value.portfolio_theme)
    } catch (err) {
      console.error('Error cargando tema:', err)
    }
  }
})

const selectTheme = (themeId) => {
  form.value.portfolio_theme = themeId
  themeStore.setTheme(themeId) // Live preview!
}

const selectLayout = (layoutId) => {
  form.value.portfolio_layout = layoutId
  themeStore.setLayout(layoutId)
}

const saveConfig = async () => {
  saving.value = true
  try {
    await api.updateThemeConfig({
      portfolio_theme: form.value.portfolio_theme,
      portfolio_layout: form.value.portfolio_layout
    })
    // Simulate a brief delay for UI feedback
    setTimeout(() => {
      saving.value = false
    }, 500)
  } catch (err) {
    alert(err.message || 'Error al guardar el tema')
    saving.value = false
  }
}
</script>
