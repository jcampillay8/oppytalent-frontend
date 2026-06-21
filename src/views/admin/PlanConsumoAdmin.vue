<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
        <Activity :size="32" class="text-primary" /> Plan y Consumo
      </h1>
      <p class="text-muted-foreground mt-1">Supervisa tus recursos de almacenamiento y magia de IA (Peticiones) en tiempo real.</p>
    </div>

    <!-- BENTO GRID -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6 mb-6">
      
      <!-- CARD 1: ALMACENAMIENTO -->
      <GlassCard class="p-6 md:p-8 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
            <HardDrive :size="24" class="text-primary" /> Almacenamiento
          </h2>
          <Badge :variant="user.is_premium ? 'primary' : 'secondary'">
            {{ user.is_premium ? 'Premium' : 'Gratuito' }}
          </Badge>
        </div>

        <div class="space-y-4">
          <div class="flex justify-between items-end">
            <div>
              <span class="text-3xl font-extrabold text-foreground">{{ formatBytes(storageUsed) }}</span>
              <span class="text-muted-foreground ml-2 text-sm">de {{ formatBytes(storageLimit) }}</span>
            </div>
            <span class="text-sm font-bold" :class="percentageColor">{{ usagePercentage }}%</span>
          </div>

          <!-- Progress Bar -->
          <div class="h-4 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50 shadow-inner">
            <div 
              class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
              :class="progressBarClass"
              :style="{ width: `${usagePercentage}%` }"
            >
              <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
            </div>
          </div>
          
          <p class="text-xs text-muted-foreground mt-2">
            Espacio utilizado por fotos de perfil y archivos de proyectos.
          </p>
        </div>
      </GlassCard>

      <!-- CARD 2: MAGIA IA (CRÉDITOS) -->
      <GlassCard class="p-6 md:p-8 flex flex-col justify-between">
        <div class="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
          <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
            <Sparkles :size="24" class="text-primary" /> Magia de IA
          </h2>
          <Badge v-if="user.has_gemini_key" variant="primary" class="bg-emerald-500 text-white">Iluminado</Badge>
          <Badge v-else :variant="user.ai_credits > 0 ? 'secondary' : 'destructive'">
            {{ user.ai_credits > 0 ? 'Disponible' : 'Agotado' }}
          </Badge>
        </div>

        <div class="space-y-4">
          <div v-if="user.has_gemini_key" class="flex flex-col items-center justify-center py-4">
            <CheckCircle2 :size="48" class="text-emerald-500 mb-2" />
            <span class="text-xl font-bold text-foreground">Ilimitado</span>
            <p class="text-sm text-muted-foreground mt-1 text-center">Tu llave de Gemini está conectada.</p>
          </div>
          <div v-else>
            <div class="flex justify-between items-end">
              <div>
                <span class="text-3xl font-extrabold" :class="user.ai_credits === 0 ? 'text-destructive' : 'text-foreground'">{{ aiCreditsUsed }}</span>
                <span class="text-muted-foreground ml-2 text-sm">de 10 peticiones</span>
              </div>
              <span class="text-sm font-bold" :class="aiPercentageColor">{{ aiUsagePercentage }}%</span>
            </div>

            <!-- Progress Bar IA -->
            <div class="h-4 w-full bg-secondary/50 rounded-full overflow-hidden border border-border/50 shadow-inner mt-4">
              <div 
                class="h-full rounded-full transition-all duration-1000 ease-out relative overflow-hidden"
                :class="aiProgressBarClass"
                :style="{ width: `${aiUsagePercentage}%` }"
              >
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            
            <p class="text-xs text-muted-foreground mt-2">
              Se descuenta al usar el chat y traducir CVs.
            </p>
          </div>
          
          <div class="pt-4 mt-2 border-t border-border/50">
            <div class="flex items-center justify-between">
              <span class="text-sm font-medium text-foreground">Cerebro Vectorial (RAG)</span>
              <div class="flex items-center gap-2">
                <NeonButton @click="syncRag" :disabled="syncingRag" variant="outline" size="sm" class="h-8 text-xs">
                  <span v-if="syncingRag" class="flex items-center gap-2">
                    <div class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                  </span>
                  <span v-else class="flex items-center gap-1">
                    <RefreshCw :size="12" /> Re-indexar
                  </span>
                </NeonButton>
                <button @click="showRagInfo = true" class="text-muted-foreground hover:text-primary transition-colors p-1 rounded-full hover:bg-secondary">
                  <HelpCircle :size="18" />
                </button>
              </div>
            </div>
            <p v-if="syncRagSuccess" class="text-xs text-emerald-500 mt-2 flex items-center gap-1"><CheckCircle2 :size="12" /> {{ syncRagSuccess }}</p>
            <p v-if="syncRagError" class="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle :size="12" /> {{ syncRagError }}</p>
          </div>
        </div>
      </GlassCard>

    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <!-- CARD 3: BYOK (Trae tu llave) -->
      <GlassCard class="p-6 md:p-8">
        <div class="flex items-center justify-between mb-4 pb-4 border-b border-border/50">
          <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
            <KeyRound :size="24" class="text-primary" /> Personaliza tu Llave
          </h2>
        </div>
        <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
          ¿Te quedaste sin magia? No te preocupes. Puedes usar tu propia llave (API Key) gratuita de Google Gemini para obtener interacciones de IA <strong class="text-foreground">ilimitadas</strong> sin necesidad de pagar el plan Premium.
        </p>
        
        <div class="space-y-2">
          <label class="text-sm font-medium text-foreground">API Key de Gemini</label>
          <div class="flex gap-2">
            <input
              type="password"
              v-model="geminiKeyForm"
              class="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
              :placeholder="user.has_gemini_key ? 'Tu llave está guardada y segura' : 'Pega tu llave aquí (AIzaSy...)'"
            />
            <NeonButton @click="saveGeminiKey" :disabled="savingKey" variant="outline" class="shrink-0">
              <span v-if="savingKey" class="flex items-center gap-2">
                <div class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
              </span>
              <span v-else>Validar y Guardar</span>
            </NeonButton>
          </div>
          <p v-if="keySuccessMsg" class="text-xs text-emerald-500 mt-2 flex items-center gap-1"><CheckCircle2 :size="12" /> {{ keySuccessMsg }}</p>
          <p v-if="keyErrorMsg" class="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle :size="12" /> {{ keyErrorMsg }}</p>
        </div>
        <a href="https://aistudio.google.com/app/apikey" target="_blank" class="text-xs text-primary hover:underline mt-4 inline-flex items-center gap-1">
          Obtener mi llave de Gemini Gratis <ExternalLink :size="12"/>
        </a>
      </GlassCard>

      <!-- CARD 4: UPGRADE CTA -->
      <div v-if="!user.is_premium" class="h-full">
        <GlassCard class="p-6 md:p-8 h-full flex flex-col justify-center border-primary/20 bg-primary/5 relative overflow-hidden group">
          <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          
          <div class="mb-6">
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary">
              <Zap :size="24" />
            </div>
            <h3 class="text-2xl font-extrabold text-foreground mb-2">Desbloquea el Potencial</h3>
            <p class="text-sm text-muted-foreground leading-relaxed">
              Consigue <strong class="text-foreground">1 GB</strong> de almacenamiento y <strong class="text-foreground">Peticiones de IA Ilimitadas</strong>. 
              Muestra al mundo de lo que eres capaz sin restricciones.
            </p>
          </div>
          
          <NeonButton glow variant="primary" class="w-full text-lg py-3">
            Mejorar a Premium
          </NeonButton>
        </GlassCard>
      </div>

    </div>

    <!-- MODAL INFO RAG -->
    <div v-if="showRagInfo" class="fixed inset-0 z-50 flex items-center justify-center bg-background/80 backdrop-blur-sm p-4" @click.self="showRagInfo = false">
      <div class="bg-card border border-border/50 shadow-2xl rounded-2xl max-w-2xl w-full max-h-[90vh] overflow-y-auto relative animate-in fade-in zoom-in-95 duration-200 custom-scrollbar">
        <button @click="showRagInfo = false" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
          <X :size="24" />
        </button>
        <div class="p-6 md:p-8">
          <h2 class="text-2xl font-bold text-foreground mb-6 flex items-center gap-2">
            <Brain :size="28" class="text-primary" /> ¿Qué hace este "Re-indexar"?
          </h2>
          
          <div class="space-y-4 text-sm text-muted-foreground leading-relaxed">
            <p>El botón "Re-indexar" (o "Re-indexar Cerebro IA") es la herramienta que le permite a tu asistente de IA "memorizar" tus datos usando la nueva arquitectura matemática (vectores).</p>
            
            <p>Cuando haces clic en él, ocurre lo siguiente en el backend:</p>
            
            <h3 class="text-base font-semibold text-foreground mt-6 mb-2">1. Extracción de tu Información</h3>
            <p>El sistema toma toda la información que tienes en OppyTalent: tu Perfil, tus Proyectos, tus Experiencias, Estudios, etc., y borra la memoria matemática anterior para que no haya datos duplicados o viejos.</p>

            <h3 class="text-base font-semibold text-foreground mt-6 mb-2">2. Conversión a "Vectores" (Embeddings)</h3>
            <p>Envía cada pedacito de información (por ejemplo, un solo proyecto) a Google Gemini. Gemini lee el texto y lo convierte en una larga lista de 768 números decimales. A esta lista de números se le llama "Vector". Estos vectores capturan el "significado" o "semántica" del texto. Es decir, la IA deja de ver letras y empieza a ver conceptos matemáticos.</p>

            <h3 class="text-base font-semibold text-foreground mt-6 mb-2">3. Guardado en la Base de Datos (pgvector)</h3>
            <p>Guarda todos esos vectores en tu base de datos de PostgreSQL (en la nueva tabla PortfolioDocument).</p>

            <h3 class="text-base font-semibold text-foreground mt-8 mb-2 border-t border-border/50 pt-6">¿En qué te beneficia en el día a día?</h3>
            <p>Gracias a que tu información ahora está "Vectorizada" (indexada), logras <strong>Búsqueda Semántica</strong>. Cuando un reclutador va a tu portafolio y le pregunta al Chatbot: "¿Ha trabajado con Python en la nube?", sucede la magia:</p>

            <ul class="list-disc pl-5 space-y-1">
              <li>El chat convierte esa pregunta a vector.</li>
              <li>Compara matemáticamente la pregunta con todos tus vectores en milisegundos.</li>
              <li>Encuentra exactamente los 3 o 4 proyectos/experiencias que más coinciden con Python y Cloud.</li>
              <li>Le pasa únicamente esos 4 proyectos a Gemini para que genere la respuesta.</li>
            </ul>

            <p class="mt-6 p-4 bg-primary/10 border border-primary/20 rounded-xl text-foreground font-medium">
              <strong>En conclusión:</strong> Apretar el botón "Re-indexar" es decirle a tu IA: "Acabo de subir nuevos proyectos y cambiar mis datos. Por favor, vuelve a estudiar mi currículum y conviértelo a matemáticas para que seas ultra rápido respondiendo y no gastemos todos mis créditos de peticiones."
            </p>
          </div>
          
          <div class="mt-8 flex justify-end">
            <NeonButton @click="showRagInfo = false" variant="primary">
              Entendido
            </NeonButton>
          </div>
        </div>
      </div>
    </div>

  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { HardDrive, Zap, Activity, Sparkles, KeyRound, CheckCircle2, AlertCircle, ExternalLink, RefreshCw, HelpCircle, X, Brain } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'

const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  } else {
    // Force refresh to get latest storage used and AI credits
    await authStore.fetchUser()
  }
})

const user = computed(() => authStore.user || { is_premium: false, ai_credits: 10, has_gemini_key: false })

// ALMACENAMIENTO LÓGICA
const storageUsed = computed(() => user.value.storage_used || 0)
const FREE_LIMIT = 26_214_400
const PREMIUM_LIMIT = 1_073_741_824
const storageLimit = computed(() => user.value.is_premium ? PREMIUM_LIMIT : FREE_LIMIT)

const usagePercentage = computed(() => {
  if (storageLimit.value === 0) return 0
  const pct = (storageUsed.value / storageLimit.value) * 100
  return Math.min(100, Math.max(0, Number(pct.toFixed(1))))
})

const isVeryNearLimit = computed(() => usagePercentage.value >= 95)
const isNearLimit = computed(() => usagePercentage.value >= 85)

const percentageColor = computed(() => {
  if (isVeryNearLimit.value) return 'text-red-500'
  if (isNearLimit.value) return 'text-amber-500'
  return 'text-emerald-500'
})

const progressBarClass = computed(() => {
  if (isVeryNearLimit.value) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
  if (isNearLimit.value) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
  return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
})

function formatBytes(bytes) {
  const safeBytes = Number(bytes) || 0
  if (safeBytes === 0) return '0 B'
  const k = 1024
  const sizes = ['B', 'KB', 'MB', 'GB', 'TB']
  const i = Math.floor(Math.log(safeBytes) / Math.log(k))
  return parseFloat((safeBytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
}

// IA CRÉDITOS LÓGICA
const AI_MAX = 10
const aiCreditsUsed = computed(() => AI_MAX - user.value.ai_credits)
const aiUsagePercentage = computed(() => {
  const pct = (aiCreditsUsed.value / AI_MAX) * 100
  return Math.min(100, Math.max(0, Number(pct.toFixed(1))))
})

const isAiVeryNearLimit = computed(() => aiUsagePercentage.value >= 95)
const isAiNearLimit = computed(() => aiUsagePercentage.value >= 85)

const aiPercentageColor = computed(() => {
  if (isAiVeryNearLimit.value) return 'text-red-500'
  if (isAiNearLimit.value) return 'text-amber-500'
  return 'text-emerald-500'
})

const aiProgressBarClass = computed(() => {
  if (isAiVeryNearLimit.value) return 'bg-red-500 shadow-[0_0_10px_rgba(239,68,68,0.5)]'
  if (isAiNearLimit.value) return 'bg-amber-500 shadow-[0_0_10px_rgba(245,158,11,0.5)]'
  return 'bg-emerald-500 shadow-[0_0_10px_rgba(16,185,129,0.5)]'
})

// BYOK LÓGICA
const geminiKeyForm = ref('')
const savingKey = ref(false)
const keySuccessMsg = ref('')
const keyErrorMsg = ref('')

const syncingRag = ref(false)
const syncRagSuccess = ref('')
const syncRagError = ref('')
const showRagInfo = ref(false)

async function syncRag() {
  syncingRag.value = true
  syncRagSuccess.value = ''
  syncRagError.value = ''
  try {
    const res = await api.post('/api/v1/user/sync-rag')
    syncRagSuccess.value = res.data.message || 'Cerebro re-indexado.'
    setTimeout(() => { syncRagSuccess.value = '' }, 5000)
  } catch (error) {
    syncRagError.value = error.response?.data?.detail || 'Error al re-indexar.'
  } finally {
    syncingRag.value = false
  }
}

async function saveGeminiKey() {
  if (!geminiKeyForm.value) return
  savingKey.value = true
  keySuccessMsg.value = ''
  keyErrorMsg.value = ''
  
  try {
    const res = await api.updateGeminiKey(geminiKeyForm.value)
    keySuccessMsg.value = res.message
    geminiKeyForm.value = ''
    await authStore.fetchUser()
  } catch (err) {
    keyErrorMsg.value = err.detail || 'Error validando la llave.'
  } finally {
    savingKey.value = false
  }
}
</script>
