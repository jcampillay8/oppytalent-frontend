<template>
  
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-foreground mb-2">Dashboard</h1>
        <p class="text-muted-foreground">¡Hola, <span class="text-primary">{{ authStore.user?.username }}</span>! 👋 Tu centro de comando de IA.</p>
      </div>

      <!-- ESTADO ACTIVO: Dashboard Normal -->
      <template v-if="!isPortfolioEmpty && !isLoading">
        <div class="flex flex-col gap-6">
          
          <!-- Cuadrícula de Estadísticas -->
          <div class="flex flex-col gap-4">
            <h2 class="text-sm font-semibold tracking-wide uppercase text-muted-foreground">Estadísticas Principales</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Proyectos -->
              <router-link to="/admin/proyectos" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                      <FolderKanban :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Proyectos</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ proyectosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">Ver detalles &rarr;</div>
                </GlassCard>
              </router-link>

              <!-- Experiencia -->
              <router-link to="/admin/experiencias" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                      <Briefcase :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Experiencia</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ experienciasStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">Ver detalles &rarr;</div>
                </GlassCard>
              </router-link>

              <!-- Estudios -->
              <router-link to="/admin/estudios" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <GraduationCap :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Estudios</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ estudiosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">Ver detalles &rarr;</div>
                </GlassCard>
              </router-link>

              <!-- Perfil -->
              <router-link to="/admin/perfil" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                      <User :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Perfil Base</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ perfilStore.items.length > 0 ? '100%' : '0%' }}</div>
                  <div class="text-xs text-muted-foreground">Completitud &rarr;</div>
                </GlassCard>
              </router-link>
              <!-- Reconocimientos -->
              <router-link to="/admin/reconocimientos" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20">
                      <Award :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Reconocimientos</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ reconocimientosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">Ver detalles &rarr;</div>
                </GlassCard>
              </router-link>

              <!-- Habilitaciones -->
              <router-link to="/admin/habilitaciones" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                      <ShieldCheck :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">Habilitaciones</span>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ habilitacionesStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">Ver detalles &rarr;</div>
                </GlassCard>
              </router-link>
            </div>
          </div>

        <!-- Chart Panel -->
        <div class="mt-8">
          <h2 class="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">Interacciones de IA (Chat)</h2>
          <GlassCard>
            <div v-if="chatLogsStore.stats.length > 0" class="h-64 flex items-end gap-2 p-2">
              <div 
                v-for="stat in chatLogsStore.stats" 
                :key="stat.date" 
                class="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div 
                  class="w-full bg-primary/40 group-hover:bg-primary transition-all duration-300 rounded-t-md relative" 
                  :style="{ height: `${Math.max((stat.count / maxStatCount) * 100, 5)}%` }"
                >
                  <div class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border px-2 py-1 rounded text-xs whitespace-nowrap shadow-xl">
                    {{ stat.count }} consultas
                  </div>
                </div>
                <div class="text-[10px] text-muted-foreground">{{ formatDateShort(stat.date) }}</div>
              </div>
            </div>
            <div v-else class="h-40 flex items-center justify-center text-muted-foreground border border-dashed border-border/50 rounded-xl">
              No hay interacciones registradas aún.
            </div>
          </GlassCard>
        </div>

        <div class="mt-8 flex items-center justify-between">
          <NeonButton glow @click="showCVUpload = true">
            <template #icon-left><UploadCloud :size="18" /></template>
            Carga tu CV (Auto-Completar)
          </NeonButton>
          <NeonButton variant="ghost" class="text-destructive hover:text-destructive hover:bg-destructive/10" @click="handleLogout">
            <template #icon-left><LogOut :size="18" /></template>
            Cerrar Sesión
          </NeonButton>
        </div>
        </div>
      </template>

      <!-- ESTADO DE CARGA -->
      <div v-else-if="isLoading" class="h-[60vh] flex flex-col items-center justify-center gap-4 text-muted-foreground">
        <div class="animate-spin rounded-full h-12 w-12 border-4 border-primary border-t-transparent"></div>
        <p>Cargando tu portafolio...</p>
      </div>

      <!-- ESTADO VACÍO: Onboarding -->
      <template v-else>
        <div class="mt-12">
          <GlassCard class="text-center p-8 border-primary/20 shadow-primary/5">
            <div class="w-16 h-16 bg-primary/10 rounded-full flex items-center justify-center mx-auto mb-6 text-primary">
              <Rocket :size="32" />
            </div>
            <h2 class="text-2xl font-bold mb-3">¡Bienvenido a tu portafolio inteligente!</h2>
            <p class="text-muted-foreground mb-8">
              Tu portafolio está vacío. Para empezar a brillar frente a los reclutadores, elige tu propio camino para construir tu perfil:
            </p>
            
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
              <!-- Camino Rápido -->
              <button 
                @click="showCVUpload = true"
                class="flex flex-col items-center text-center p-6 rounded-xl border-2 border-primary bg-primary/5 hover:bg-primary/10 transition-colors group"
              >
                <FileText :size="32" class="text-primary mb-4 group-hover:scale-110 transition-transform" />
                <strong class="text-lg text-foreground mb-2">Sube tu CV</strong>
                <span class="text-sm text-muted-foreground">La IA construirá tu perfil por ti en segundos</span>
              </button>

              <!-- Camino Manual -->
              <router-link 
                :to="`/${route.params.username}/perfil`" 
                class="flex flex-col items-center text-center p-6 rounded-xl border border-border bg-card/50 hover:bg-accent transition-colors group"
              >
                <User :size="32" class="text-muted-foreground mb-4 group-hover:text-foreground transition-colors group-hover:scale-110" />
                <strong class="text-lg text-foreground mb-2">Empezar de cero</strong>
                <span class="text-sm text-muted-foreground">Llenaré mis datos manualmente paso a paso</span>
              </router-link>
            </div>
          </GlassCard>
        </div>
      </template>

      <!-- Modal de Carga de CV -->
      <div v-if="showCVUpload" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div 
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          class="w-full max-w-lg"
        >
          <GlassCard class="relative">
            <h2 class="text-xl font-bold mb-2">Carga tu Currículum</h2>
            <p class="text-sm text-muted-foreground mb-6">
              Sube tu CV (PDF, Word, TXT, Imagen) y nuestra IA extraerá tu experiencia, estudios y habilidades automáticamente.
            </p>
            
            <form @submit.prevent="handleCVUpload" class="space-y-6">
              <div 
                class="border-2 border-dashed rounded-xl p-8 text-center transition-colors relative"
                :class="selectedFile ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 hover:bg-secondary/50 cursor-pointer'"
              >
                <input 
                  type="file" 
                  ref="fileInput" 
                  accept=".pdf,.docx,.txt,.md,.png,.jpg,.jpeg" 
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  @change="onFileChange" 
                  required 
                />
                <div v-if="!selectedFile" class="flex flex-col items-center gap-3">
                  <UploadCloud :size="32" class="text-muted-foreground" />
                  <span class="text-sm text-muted-foreground">Arrastra tu archivo aquí o haz clic para buscar</span>
                </div>
                <div v-else class="flex flex-col items-center gap-3">
                  <CheckCircle2 :size="32" class="text-primary" />
                  <span class="text-sm font-medium text-foreground">{{ selectedFile.name }}</span>
                </div>
              </div>
              
              <div class="flex justify-end gap-3">
                <NeonButton type="button" variant="ghost" @click="closeCVModal" :disabled="uploadingCV">
                  Cancelar
                </NeonButton>
                <NeonButton type="submit" glow :disabled="!selectedFile || uploadingCV">
                  <span v-if="uploadingCV" class="flex items-center gap-2">
                    <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                    Procesando...
                  </span>
                  <span v-else>Procesar con IA</span>
                </NeonButton>
              </div>
            </form>
          </GlassCard>
        </div>
      </div>

    </AdminLayout>
  
</template>

<script setup>
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { 
  FolderKanban, Briefcase, GraduationCap, User, Rocket, 
  MessageSquare, FileText, UploadCloud, LogOut, CheckCircle2, Award, ShieldCheck
} from 'lucide-vue-next'

import { useAuthStore } from '../../stores/auth'
import { useCVWizardStore } from '../../stores/cvWizard'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { usePerfilStore } from '../../stores/perfil'
import { useChatLogsStore } from '../../stores/chatLogs'
import { useReconocimientosStore } from '../../stores/reconocimientos'
import { useHabilitacionesStore } from '../../stores/habilitaciones'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()
const cvWizardStore = useCVWizardStore()
const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const perfilStore = usePerfilStore()
const chatLogsStore = useChatLogsStore()
const reconocimientosStore = useReconocimientosStore()
const habilitacionesStore = useHabilitacionesStore()

const isLoading = computed(() => {
  return proyectosStore.loading || experienciasStore.loading || estudiosStore.loading || perfilStore.loading || reconocimientosStore.loading || habilitacionesStore.loading
})

const isPortfolioEmpty = computed(() => {
  return proyectosStore.items.length === 0 &&
         experienciasStore.items.length === 0 &&
         estudiosStore.items.length === 0 &&
         perfilStore.items.length === 0 &&
         reconocimientosStore.items.length === 0 &&
         habilitacionesStore.items.length === 0
})

const maxStatCount = computed(() => {
  if (!chatLogsStore.stats.length) return 1
  return Math.max(...chatLogsStore.stats.map(s => s.count))
})

function formatDateShort(dateString) {
  const parts = dateString.split('-')
  if (parts.length === 3) {
    return `${parts[2]}/${parts[1]}`
  }
  return dateString
}

function handleLogout() {
  authStore.logout()
  router.push('/login')
}

// Lógica de CV
const showCVUpload = ref(false)
const selectedFile = ref(null)
const uploadingCV = ref(false)

function onFileChange(event) {
  const file = event.target.files[0]
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg']
  
  if (file) {
    const fileName = file.name.toLowerCase()
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (isValid) {
      selectedFile.value = file
    } else {
      alert("Por favor, sube un formato válido (PDF, Word, TXT, MD o Imagen).")
      selectedFile.value = null
    }
  }
}

function closeCVModal() {
  if (uploadingCV.value) return
  showCVUpload.value = false
  selectedFile.value = null
}

async function handleCVUpload() {
  if (!selectedFile.value) return
  uploadingCV.value = true
  try {
    const formData = new FormData()
    formData.append('file', selectedFile.value)
    
    // Llamada real al backend para extraer datos con IA
    const data = await api.extractCV(formData)
    
    // Guardar los datos extraídos en el Store
    cvWizardStore.setExtractedData(data)
    
    closeCVModal()
    
    // Redirigir al Asistente de CV
    router.push(`/${route.params.username}/cv-wizard`)
    
  } catch (error) {
    if (error.detail && error.detail.includes('Cuota agotada')) {
      alert("¡Magia agotada! 🪄 Has usado todos tus créditos gratuitos de IA. Para seguir usando las funciones inteligentes, ve a 'Personaliza tu IA' e ingresa tu propia API Key de Gemini gratis.")
    } else {
      alert("Ocurrió un error al subir el CV: " + (error.detail || error.message))
    }
  } finally {
    uploadingCV.value = false
  }
}

onMounted(async () => {
  try {
    if (!proyectosStore.items.length && !proyectosStore.loading) proyectosStore.fetchAll()
    if (!experienciasStore.items.length && !experienciasStore.loading) experienciasStore.fetchAll()
    if (!estudiosStore.items.length && !estudiosStore.loading) estudiosStore.fetchAll()
    if (!perfilStore.items.length && !perfilStore.loading) perfilStore.fetchAll()
    if (!reconocimientosStore.items.length && !reconocimientosStore.loading) reconocimientosStore.fetchAll()
    if (!habilitacionesStore.items.length && !habilitacionesStore.loading) habilitacionesStore.fetchAll()

    await chatLogsStore.fetchStats()
  } catch (error) {
    console.error(error)
  }
})
</script>
