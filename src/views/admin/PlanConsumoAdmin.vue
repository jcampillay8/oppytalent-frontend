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
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { HardDrive, Zap, Activity, Sparkles, KeyRound, CheckCircle2, AlertCircle, ExternalLink } from 'lucide-vue-next'
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
