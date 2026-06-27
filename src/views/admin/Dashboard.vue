<template>
  
    <AdminLayout>
      <!-- ESTADO ACTIVO: Dashboard Normal -->
      <template v-if="!isPortfolioEmpty && !isLoading">
        <div class="mb-8">
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground mb-2">{{ $t('admin.sidebar.dashboard') }}</h1>
          <p class="text-muted-foreground">{{ $t('dash_v2.dash_v2_1') }} <span class="text-primary">{{ authStore.user?.username }}</span>{{ $t('dash_v2.dash_v2_2') }}</p>
        </div>
        <div class="flex flex-col gap-6">
          
          <!-- Cuadrícula de Estadísticas -->
          <div class="flex flex-col gap-4">
            <h2 class="text-sm font-semibold tracking-wide uppercase text-muted-foreground">{{ $t('dash_v2.dash_v2_3') }}</h2>
            
            <div class="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
              <!-- Perfil -->
              <router-link to="/admin/perfil" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-cyan-500/10 text-cyan-500 border border-cyan-500/20">
                        <User :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.profile') }}
                        <button @click.prevent="openInfo('Perfil Base', 'En esta sección debes completar tus datos fundamentales:', ['Tu información personal (Nombre, Edad, etc.)', 'Tu rol principal o titular profesional', 'Tus datos de contacto', 'Una foto profesional y presentable'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ perfilStore.items.length > 0 ? '100%' : '0%' }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_4') }}</div>
                </GlassCard>
              </router-link>

              <!-- Proyectos -->
              <router-link to="/admin/proyectos" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-primary/10 text-primary border border-primary/20">
                        <FolderKanban :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.projects') }}
                        <button @click.prevent="openInfo('Proyectos Propios y Laborales', 'Aquí puedes detallar y mostrar todo lo que has construido:', ['Proyectos en los que has participado laboralmente', 'Repositorios de código o proyectos personales', 'Casos de éxito con resultados demostrables', 'Enlaces a las plataformas o demos en vivo'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ proyectosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_5') }}</div>
                </GlassCard>
              </router-link>

              <!-- Experiencia -->
              <router-link to="/admin/experiencias" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-emerald-500/10 text-emerald-500 border border-emerald-500/20">
                        <Briefcase :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.experience') }}
                        <button @click.prevent="openInfo('Experiencia Laboral', 'Documenta tu historial y trayectoria profesional:', ['Tus trabajos anteriores y actuales', 'Los roles y cargos que has ocupado', 'Tus responsabilidades principales en cada puesto', 'Logros profesionales e hitos importantes'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ experienciasStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_6') }}</div>
                </GlassCard>
              </router-link>

              <!-- Estudios -->
              <router-link to="/admin/estudios" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                        <GraduationCap :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.studies') }}
                        <button @click.prevent="openInfo('Estudios, Cursos & Certificaciones', 'Añade tu formación académica y conocimientos adquiridos:', ['Educación formal (Universidad, Instituto, etc.)', 'Bootcamps y academias intensivas', 'Cursos online relevantes para tu carrera', 'Certificaciones técnicas oficiales emitidas'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ estudiosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_7') }}</div>
                </GlassCard>
              </router-link>

              <!-- Reconocimientos -->
              <router-link to="/admin/reconocimientos" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-pink-500/10 text-pink-500 border border-pink-500/20">
                        <Award :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.recognitions') }}
                        <button @click.prevent="openInfo('Reconocimientos & Publicaciones', 'Destaca aquellos hitos que te diferencian del resto:', ['Premios o galardones que se te han otorgado', 'Publicaciones en revistas científicas o de difusión', 'Tu propio Podcast, canal de YouTube o Blog', 'Si has escrito o publicado algún libro'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ reconocimientosStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_8') }}</div>
                </GlassCard>
              </router-link>

              <!-- Habilitaciones -->
              <router-link to="/admin/habilitaciones" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group">
                  <div class="flex items-center justify-between mb-4">
                    <div class="flex items-center gap-3">
                      <div class="p-2 rounded-lg bg-indigo-500/10 text-indigo-500 border border-indigo-500/20">
                        <ShieldCheck :size="20" />
                      </div>
                      <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors flex items-center gap-1.5">
                        {{ $t('admin.sidebar.certifications') }}
                        <button @click.prevent="openInfo('Disponibilidad & Licencias', 'Indica tu flexibilidad y permisos especiales:', ['Disponibilidad para traslado o viajes', 'Disponibilidad para horarios nocturnos o turnos rotativos (7x7, 4x3)', 'Jornadas Part-time o Full-time', 'Licencias de conducir (B, C, maquinaria pesada)', 'Permisos especiales (buzo, soldador, primeros auxilios)'])" class="text-muted-foreground hover:text-primary transition-colors focus:outline-none ml-1">
                          <Info :size="18" />
                        </button>
                      </span>
                    </div>
                  </div>
                  <div class="text-4xl font-extrabold text-foreground mb-1">{{ habilitacionesStore.items.length }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_9') }}</div>
                </GlassCard>
              </router-link>

              <!-- Panel RBAC (Solo Superadmin/Owner) -->
              <router-link v-if="authStore.user?.role === 'SUPERADMIN' || authStore.user?.permissions?.includes('can_manage_roles')" to="/admin/rbac" class="block outline-none">
                <GlassCard hoverEffect class="h-full cursor-pointer group bg-gradient-to-br from-amber-500/5 to-transparent">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="p-2 rounded-lg bg-amber-500/10 text-amber-500 border border-amber-500/20">
                      <ShieldCheck :size="20" />
                    </div>
                    <span class="font-medium text-muted-foreground group-hover:text-foreground transition-colors">{{ $t('dash_v2.dash_v2_10') }}</span>
                  </div>
                  <div class="text-2xl font-extrabold text-foreground mb-1">{{ $t('dash_v2.dash_v2_11') }}</div>
                  <div class="text-xs text-muted-foreground">{{ $t('dash_v2.dash_v2_12') }}</div>
                </GlassCard>
              </router-link>
            </div>
          </div>

        <!-- Chart Panel -->
        <div class="mt-8">
          <h2 class="text-sm font-semibold tracking-wide uppercase text-muted-foreground mb-4">{{ $t('dash_v2.dash_v2_13') }}</h2>
          <GlassCard>
            <div class="h-64 flex items-end gap-1 sm:gap-2 p-2">
              <div 
                v-for="stat in paddedChartData" 
                :key="stat.date" 
                class="flex-1 flex flex-col items-center gap-2 h-full justify-end group"
              >
                <div 
                  class="w-full transition-all duration-300 rounded-t-sm relative" 
                  :class="stat.count > 0 ? 'bg-primary/40 group-hover:bg-primary cursor-pointer' : 'bg-primary/5'"
                  :style="{ height: `${Math.max((stat.count / Math.max(maxStatCount, 1)) * 100, 2)}%` }"
                >
                  <div v-if="stat.count > 0" class="absolute -top-8 left-1/2 -translate-x-1/2 opacity-0 group-hover:opacity-100 transition-opacity bg-card border border-border px-2 py-1 rounded text-xs whitespace-nowrap shadow-xl z-10 pointer-events-none">
                    {{ stat.count }} consultas
                  </div>
                </div>
                <div class="text-[8px] sm:text-[10px] text-muted-foreground whitespace-nowrap w-full text-center overflow-hidden" :title="stat.date">
                  {{ formatDateShort(stat.date) }}
                </div>
              </div>
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
              Sube tu archivo (PDF, Word, Excel, PPT, TXT, Audio, Imagen o ZIP) y nuestra IA extraerá tu experiencia, estudios y habilidades automáticamente.
            </p>
            
            <form @submit.prevent="handleCVUpload" class="space-y-6">
              <div 
                class="border-2 border-dashed rounded-xl p-8 text-center transition-colors relative"
                :class="isDragging ? 'border-primary bg-primary/10' : (selectedFile ? 'border-primary bg-primary/5' : 'border-border/50 hover:border-primary/50 hover:bg-secondary/50 cursor-pointer')"
                @dragover.prevent="isDragging = true"
                @dragleave.prevent="isDragging = false"
                @drop.prevent="onDrop"
              >
                <input 
                  type="file" 
                  ref="fileInput" 
                  accept=".pdf,application/pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.md,.csv,.json,.xml,.png,.jpg,.jpeg,.zip,.html,.epub,audio/*,image/*" 
                  class="absolute inset-0 w-full h-full opacity-0 cursor-pointer" 
                  @change="onFileChange" 
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

      <!-- Info Modal -->
      <div v-if="showInfoModal" class="fixed inset-0 z-[60] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" @click.self="showInfoModal = false">
        <div 
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          class="w-full max-w-md"
        >
          <GlassCard class="relative">
            <div class="flex items-start gap-4 mb-4">
              <div class="p-2 rounded-full bg-primary/10 text-primary shrink-0">
                <Info :size="24" />
              </div>
              <div>
                <h3 class="text-lg font-bold text-foreground leading-tight">{{ infoModalTitle }}</h3>
              </div>
            </div>
            
            <p v-if="infoModalDescription" class="text-foreground font-medium text-sm mb-3">
              {{ infoModalDescription }}
            </p>
            
            <ul class="space-y-2 mb-6 ml-1">
              <li v-for="(item, idx) in infoModalContent" :key="idx" class="flex items-start gap-2 text-muted-foreground text-[14px]">
                <div class="mt-1.5 w-1.5 h-1.5 rounded-full bg-primary shrink-0"></div>
                <span class="leading-snug">{{ item }}</span>
              </li>
            </ul>

            <div class="flex justify-end">
              <NeonButton @click="showInfoModal = false">Entendido</NeonButton>
            </div>
          </GlassCard>
        </div>
      </div>

    </AdminLayout>
  
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { onMounted, computed, ref } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import { api } from '../../services/api'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import { 
  FolderKanban, Briefcase, GraduationCap, User, Rocket, 
  MessageSquare, FileText, UploadCloud, LogOut, CheckCircle2, Award, ShieldCheck, Info
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

const paddedChartData = computed(() => {
  const data = []
  const today = new Date()
  
  const statsMap = {}
  chatLogsStore.stats.forEach(s => {
    statsMap[s.date] = s.count
  })

  // Generar últimos 14 días
  for (let i = 13; i >= 0; i--) {
    const d = new Date(today)
    d.setDate(d.getDate() - i)
    // Manejar Timezone offset para obtener formato local correcto YYYY-MM-DD
    const localDate = new Date(d.getTime() - (d.getTimezoneOffset() * 60000))
    const dateStr = localDate.toISOString().split('T')[0]
    data.push({
      date: dateStr,
      count: statsMap[dateStr] || 0
    })
  }
  return data
})

const maxStatCount = computed(() => {
  if (!paddedChartData.value.length) return 1
  return Math.max(...paddedChartData.value.map(s => s.count))
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
}

// Lógica de CV
const showCVUpload = ref(false)
const selectedFile = ref(null)
const uploadingCV = ref(false)
const isDragging = ref(false)

function onDrop(event) {
  isDragging.value = false
  if (event.dataTransfer.files && event.dataTransfer.files.length > 0) {
    handleFile(event.dataTransfer.files[0])
  }
}

function onFileChange(event) {
  if (event.target.files && event.target.files.length > 0) {
    handleFile(event.target.files[0])
  }
}

function handleFile(file) {
  const allowedExtensions = ['.pdf', '.docx', '.txt', '.md', '.png', '.jpg', '.jpeg']
  
  if (file) {
    const fileName = file.name.toLowerCase()
    const isValid = allowedExtensions.some(ext => fileName.endsWith(ext))
    
    if (isValid) {
      selectedFile.value = file
    } else {
      toast.warning("Por favor, sube un formato válido (PDF, Word, Excel, PPT, TXT, Audio, Imagen o ZIP).")
      selectedFile.value = null
    }
  }
}

function closeCVModal() {
  if (uploadingCV.value) return
  showCVUpload.value = false
  selectedFile.value = null
}

const showInfoModal = ref(false)
const infoModalTitle = ref('')
const infoModalDescription = ref('')
const infoModalContent = ref([])

function openInfo(title, description, items) {
  infoModalTitle.value = title
  infoModalDescription.value = description
  infoModalContent.value = items
  showInfoModal.value = true
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
      toast.warning("¡Magia agotada! 🪄 Has usado todos tus créditos gratuitos de IA. Para seguir usando las funciones inteligentes, ve a 'Personaliza tu IA' e ingresa tu propia API Key de Gemini gratis.", { autoClose: 6000 })
    } else {
      toast.error("Ocurrió un error al subir el CV: " + (error.detail || error.message), { autoClose: 5000 })
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
