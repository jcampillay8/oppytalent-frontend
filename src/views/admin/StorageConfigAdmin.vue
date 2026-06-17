<template>
  
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Database :size="32" class="text-primary" /> Almacenamiento de Archivos
        </h1>
        <p class="text-muted-foreground mt-1">Gestiona dónde se guardan tus currículums e imágenes de portafolio.</p>
      </div>

      <!-- Success Message -->
      <div v-if="showSuccessMsg" class="bg-emerald-500/10 border border-emerald-500/20 text-emerald-500 px-4 py-3 rounded-xl mb-6 flex items-center gap-2" v-motion :initial="{ opacity: 0, y: -10 }" :enter="{ opacity: 1, y: 0 }">
        <CheckCircle2 :size="18" />
        ¡Google Drive conectado con éxito! Ahora puedes subir imágenes directamente desde los formularios.
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        <!-- Google Drive (Free Tier) -->
        <GlassCard 
          class="flex flex-col relative overflow-hidden transition-all duration-300"
          :class="isDriveConnected ? 'border-emerald-500/50 shadow-lg shadow-emerald-500/10' : 'border-border/50'"
        >
          <!-- Fondo Decorativo -->
          <div class="absolute -right-10 -top-10 text-emerald-500/5 opacity-50 pointer-events-none">
            <Cloud :size="150" />
          </div>

          <div class="flex items-center justify-between mb-4 relative z-10 pb-4 border-b border-border/50">
            <h3 class="text-xl font-bold text-foreground">Google Drive</h3>
            <Badge v-if="isDriveConnected" variant="success" class="flex items-center gap-1">
              <Check :size="12" /> Conectado
            </Badge>
            <Badge v-else variant="secondary">Plan Gratuito</Badge>
          </div>
          
          <div class="flex-1 relative z-10 flex flex-col">
            <p class="text-muted-foreground text-sm leading-relaxed mb-6">
              Utiliza tu propia cuota gratuita de 15GB de Google Drive para alojar todas las imágenes de tu portafolio, proyectos y experiencias.
            </p>
            
            <ul class="space-y-3 mb-8 flex-1">
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-emerald-500 shrink-0 mt-0.5" :size="16" /> Almacenamiento 100% gratuito
              </li>
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-emerald-500 shrink-0 mt-0.5" :size="16" /> Subida automática a la carpeta "OppyTalent"
              </li>
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-emerald-500 shrink-0 mt-0.5" :size="16" /> Control total de tus archivos desde tu Drive
              </li>
            </ul>
            
            <div class="mt-auto">
              <NeonButton v-if="!isDriveConnected" @click="connectGoogleDrive" :disabled="loading" glow variant="primary" fullWidth>
                <template #icon-left><Cloud :size="18" v-if="!loading" /></template>
                <span v-if="loading" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Conectando...
                </span>
                <span v-else>Conectar con Google Drive</span>
              </NeonButton>
              
              <NeonButton v-else variant="outline" class="border-emerald-500/30 text-emerald-500 cursor-default" fullWidth>
                <template #icon-left><CheckCircle2 :size="18" /></template>
                Drive Vinculado Correctamente
              </NeonButton>
            </div>
          </div>
        </GlassCard>

        <!-- Cloudflare R2 (Premium Tier) -->
        <GlassCard 
          class="flex flex-col relative overflow-hidden transition-all duration-300 border-border/50"
        >
          <!-- Fondo Decorativo -->
          <div class="absolute -right-10 -top-10 text-primary/5 opacity-50 pointer-events-none">
            <Zap :size="150" />
          </div>

          <div class="flex items-center justify-between mb-4 relative z-10 pb-4 border-b border-border/50">
            <h3 class="text-xl font-bold text-foreground">Almacenamiento R2</h3>
            <Badge v-if="isPremium" variant="primary" class="flex items-center gap-1">
              <Star :size="12" /> Activo
            </Badge>
            <Badge v-else variant="outline" class="border-primary/50 text-primary">Premium 🌟</Badge>
          </div>
          
          <div class="flex-1 relative z-10 flex flex-col">
            <p class="text-muted-foreground text-sm leading-relaxed mb-6">
              Aloja tus imágenes directamente en nuestros servidores de alto rendimiento. Las imágenes cargarán a la velocidad de la luz gracias a la red global de Cloudflare.
            </p>
            
            <ul class="space-y-3 mb-8 flex-1">
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-primary shrink-0 mt-0.5" :size="16" /> Carga ultrarrápida de imágenes (CDN Global)
              </li>
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-primary shrink-0 mt-0.5" :size="16" /> No dependes de cuentas de terceros
              </li>
              <li class="flex items-start gap-2 text-sm text-foreground">
                <Check class="text-primary shrink-0 mt-0.5" :size="16" /> Mejor experiencia (UX) para los reclutadores
              </li>
            </ul>
            
            <div class="mt-auto">
              <NeonButton v-if="isPremium" variant="outline" class="border-primary/30 text-primary cursor-default" fullWidth>
                <template #icon-left><Star :size="18" /></template>
                Plan Premium Activo
              </NeonButton>
              
              <NeonButton v-else @click="upgradeToPremium" variant="secondary" fullWidth>
                <template #icon-left><Lock :size="18" /></template>
                Mejorar a Premium
              </NeonButton>
            </div>
          </div>
        </GlassCard>

      </div>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRoute, useRouter } from 'vue-router'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Database, Check, CheckCircle2, Cloud, Zap, Star, Lock } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'

const route = useRoute()
const router = useRouter()
const authStore = useAuthStore()

const loading = ref(false)
const showSuccessMsg = ref(false)

const isDriveConnected = computed(() => {
  return !!authStore.user?.google_refresh_token
})

const isPremium = computed(() => {
  return !!authStore.user?.is_premium
})

onMounted(async () => {
  if (!authStore.user || route.query.connected === 'true') {
    await authStore.fetchUser()
  }
  
  if (route.query.connected === 'true') {
    showSuccessMsg.value = true
    setTimeout(() => {
      showSuccessMsg.value = false
      router.replace({ query: null })
    }, 5000)
  }
})

const connectGoogleDrive = async () => {
  loading.value = true
  try {
    const response = await api.getGoogleAuthUrl()
    window.location.href = response.auth_url // Redirect to Google
  } catch (error) {
    alert("Error al intentar conectar con Google Drive.")
    loading.value = false
  }
}

const upgradeToPremium = () => {
  alert("¡Próximamente! Estamos configurando la pasarela de pagos para el plan premium.")
}
</script>
