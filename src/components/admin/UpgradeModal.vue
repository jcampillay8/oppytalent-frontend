<template>
  <Transition name="fade">
    <div v-if="modelValue" class="fixed inset-0 z-[200] flex items-center justify-center p-4">
      <!-- Backdrop -->
      <div 
        class="absolute inset-0 bg-background/80 backdrop-blur-sm"
        @click="!isProcessing && closeModal()"
      ></div>

      <!-- Modal Content -->
      <div 
        class="relative bg-card border border-border rounded-2xl w-full max-w-2xl shadow-2xl overflow-hidden flex flex-col"
        v-motion
        :initial="{ opacity: 0, scale: 0.95, y: 20 }"
        :enter="{ opacity: 1, scale: 1, y: 0 }"
      >
        <!-- Thank You PRO Screen -->
        <div v-if="viewMode === 'thankYouPro'" class="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div class="w-20 h-20 bg-emerald-500/20 text-emerald-500 rounded-full flex items-center justify-center mb-6 border border-emerald-500/30">
            <Heart class="w-10 h-10 fill-current" />
          </div>
          <h2 class="text-3xl font-black text-foreground mb-4">¡Muchas Gracias, {{ userName }}!</h2>
          <p class="text-lg text-muted-foreground mb-8">
            Tu apoyo significa el mundo para nosotros. Hemos desbloqueado tu <strong class="text-emerald-500">Nivel PRO</strong> para siempre.
          </p>
          <NeonButton glow variant="primary" @click="closeModal" class="px-8">
            Continuar
          </NeonButton>
        </div>

        <!-- Thank You PREMIUM Screen -->
        <div v-else-if="viewMode === 'thankYouPremium'" class="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div class="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
            <Star class="w-10 h-10 fill-current" />
          </div>
          <h2 class="text-3xl font-black text-foreground mb-4">¡Muchas Gracias por la Reseña!</h2>
          <p class="text-lg text-muted-foreground mb-8">
            Tu opinión es oro para nosotros. Ya eres <strong class="text-amber-500">Nivel PREMIUM</strong>.
          </p>
          <NeonButton glow variant="primary" @click="closeModal" class="px-8">
            Continuar
          </NeonButton>
        </div>

        <!-- Write Review Screen -->
        <div v-else-if="viewMode === 'writeReview'" class="p-8 flex flex-col min-h-[400px]">
          <h2 class="text-2xl font-black text-foreground mb-2 text-center">Escribe tu Reseña</h2>
          <p class="text-sm text-muted-foreground mb-8 text-center">Tu opinión nos ayuda a crecer y destaca tu perfil en el Muro de la Fama.</p>
          
          <div class="mb-8 flex justify-center gap-4">
             <Star v-for="i in 5" :key="i" 
                   class="w-12 h-12 cursor-pointer transition-all hover:scale-110"
                   :class="i <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'"
                   @click="reviewRating = i" />
          </div>

          <textarea v-model="reviewContent" rows="4" 
                    class="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-amber-500/50 resize-none mb-8"
                    placeholder="Cuéntanos cómo OppyTalent te ha ayudado a crear tu portafolio..."></textarea>

          <div class="flex gap-4 mt-auto">
            <button class="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-secondary/50 font-medium transition-colors" 
                    @click="viewMode = 'missions'" :disabled="isProcessing">
              Cancelar
            </button>
            <NeonButton glow variant="primary" class="flex-1" :disabled="!isReviewValid || isProcessing" @click="submitReview">
              <span v-if="isProcessing" class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" /> Publicando...
              </span>
              <span v-else>Publicar Reseña</span>
            </NeonButton>
          </div>
        </div>

        <!-- Normal Content (Missions) -->
        <template v-else-if="viewMode === 'missions'">
          <!-- Header Image / Banner -->
          <div class="h-32 bg-gradient-to-br from-primary/80 to-purple-600/80 relative flex items-center justify-center overflow-hidden">
            <div class="absolute inset-0 bg-[url('/grid-pattern.svg')] opacity-20"></div>
            <Sparkles class="text-white w-12 h-12 relative z-10" />
          </div>

          <!-- Content -->
          <div class="p-6 sm:p-8 flex-1 flex flex-col">
            <h2 class="text-2xl font-black text-foreground text-center mb-2">Desbloquea tu Portafolio</h2>
            <p class="text-muted-foreground text-center text-sm mb-6 leading-relaxed">
              Tu plan actual no te permite editar más elementos. Puedes desbloquear esta función y potenciar tu Inteligencia Artificial para siempre <strong class="text-emerald-500 uppercase tracking-widest text-base font-black bg-emerald-500/10 px-2 py-0.5 rounded-md mx-1 border border-emerald-500/20">¡totalmente gratis!</strong> Solo escoge una misión:
            </p>

            <div class="space-y-4">
              <!-- Mission 1: Like -->
              <div class="border border-border rounded-xl p-4 flex gap-4 transition-colors relative overflow-hidden group"
                   :class="isProOrHigher ? 'bg-secondary/10 opacity-70' : 'hover:border-primary/50 bg-secondary/30'">
                
                <!-- If already unlocked overlay -->
                <div v-if="isProOrHigher" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle class="w-12 h-12 text-emerald-500 mb-2 drop-shadow-sm" />
                  <span class="font-black text-lg text-foreground">¡Gracias por tu Like!</span>
                  <span class="text-sm font-medium text-emerald-500 mt-1">Ya tienes el Nivel PRO</span>
                </div>

                <div class="shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Heart class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-blue-400">Nivel PRO (Dar Like)</h3>
                  <p class="text-xs text-muted-foreground mt-1">Muestra tu apoyo al proyecto OppyTalent con un solo clic. ¡Sin registros ni redes sociales!</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🔓 4x Categoría</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🧠 2 Skills IA</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🤖 35 Respuestas</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing || isProOrHigher" @click="handleProUpgrade"></button>
              </div>

              <!-- Mission 2: Review -->
              <div class="border border-border rounded-xl p-4 flex gap-4 transition-colors relative overflow-hidden group"
                   :class="isPremiumOrHigher ? 'bg-secondary/10 opacity-70' : 'hover:border-primary/50 bg-secondary/30'">
                
                <!-- If already unlocked overlay -->
                <div v-if="isPremiumOrHigher" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle class="w-12 h-12 text-amber-500 mb-2 drop-shadow-sm" />
                  <span class="font-black text-lg text-foreground">¡Gracias por tu Reseña!</span>
                  <span class="text-sm font-medium text-amber-500 mt-1">Ya tienes el Nivel PREMIUM</span>
                </div>

                <div class="shrink-0 w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Star class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-amber-500">Nivel PREMIUM (Escribir Reseña)</h3>
                  <p class="text-xs text-muted-foreground mt-1">Escribe tu propia reseña pública en nuestro Muro de la Fama.</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🔓 6x Categoría</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🧠 3 Skills IA</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🤖 50 Respuestas</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing || isPremiumOrHigher" @click="viewMode = 'writeReview'"></button>
              </div>

              <!-- Mission 3: Share (Embajador) -->
              <div class="border border-border rounded-xl p-4 flex gap-4 hover:border-primary/50 transition-colors bg-secondary/30 relative overflow-hidden group">
                <div class="shrink-0 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 border border-purple-500/20">
                  <Share2 class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-purple-400">Nivel EMBAJADOR (Referir a alguien)</h3>
                  <p class="text-xs text-muted-foreground mt-1">Refiere a un amigo usando tu enlace único y consigue que se registre.</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🔓 10x Categoría</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🧠 5 Skills IA</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">🚀 +50 Créditos (Acumulables)</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing" @click="viewMode = 'ambassador'"></button>
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <button 
                @click="closeModal"
                :disabled="isProcessing"
                class="text-xs text-muted-foreground hover:text-foreground underline transition-colors disabled:opacity-50"
              >
                Quizás más tarde
              </button>
            </div>
          </div>
        </template>
        
        <template v-else-if="viewMode === 'ambassador'">
          <div class="p-8 text-center animate-in fade-in zoom-in duration-300">
            <div class="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">🚀</span>
            </div>
            <h2 class="text-2xl font-black text-foreground mb-3">Nivel Embajador</h2>
            <p class="text-sm text-muted-foreground mb-6">
              Invita a tus colegas a OppyTalent. Cuando se registren usando tu enlace único, <strong>¡ganarás 50 Créditos IA adicionales!</strong> Puedes acumular hasta 250 créditos extra.
            </p>

            <div class="flex items-center gap-2 mb-6">
              <div class="bg-secondary flex-1 px-4 py-3 rounded-xl border border-primary/20 text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap text-primary">
                {{ referralUrl }}
              </div>
              <button @click="copyReferral" class="bg-primary text-primary-foreground px-4 py-3 rounded-xl font-bold hover:bg-primary/90 transition-colors flex items-center justify-center gap-2 min-w-[50px]">
                <Copy v-if="!referralCopied" :size="18" />
                <Check v-else :size="18" />
              </button>
            </div>

            <div class="bg-amber-500/10 border border-amber-500/20 rounded-xl p-4 text-xs text-amber-500/90 leading-relaxed text-left mb-8">
              <strong>⚠️ Nota Importante sobre Abusos:</strong> Por favor, usa este enlace de buena fe. El uso de bots, correos temporales o la creación de cuentas falsas para obtener créditos está estrictamente prohibido y resultará en la suspensión permanente de tu cuenta.
            </div>

            <button @click="viewMode = 'missions'" class="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
              Volver a Misiones
            </button>
          </div>
        </template>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Heart, Star, Share2, CheckCircle, Loader2, Copy, Check } from 'lucide-vue-next'
import Badge from '../ui/Badge.vue'
import NeonButton from '../ui/NeonButton.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import confetti from 'canvas-confetti'

const props = defineProps({
  modelValue: Boolean
})

const emit = defineEmits(['update:modelValue'])
const router = useRouter()
const authStore = useAuthStore()

const viewMode = ref('missions') // 'missions', 'thankYouPro', 'thankYouPremium', 'writeReview'
const isProcessing = ref(false)

const reviewRating = ref(0)
const reviewContent = ref('')

const userName = computed(() => {
  return authStore.user?.firstName || authStore.user?.username?.split('@')[0] || 'Talento'
})

const currentTier = computed(() => (authStore.user?.freemium_tier || authStore.user?.freemiumTier || 'BASIC').toUpperCase())
const isProOrHigher = computed(() => ['PRO', 'PREMIUM', 'AMBASSADOR'].includes(currentTier.value))
const isPremiumOrHigher = computed(() => ['PREMIUM', 'AMBASSADOR'].includes(currentTier.value))

const isReviewValid = computed(() => reviewRating.value > 0 && reviewContent.value.trim().length > 10)

const referralUrl = computed(() => {
  const host = window.location.origin
  const username = authStore.user?.username || ''
  return `${host}/register?ref=${username}`
})

const referralCopied = ref(false)

function copyReferral() {
  navigator.clipboard.writeText(referralUrl.value)
  referralCopied.value = true
  setTimeout(() => { referralCopied.value = false }, 2000)
}

function triggerConfetti() {
  const duration = 3000;
  const end = Date.now() + duration;

  (function frame() {
    confetti({
      particleCount: 8,
      angle: 270,
      spread: 70,
      origin: { x: Math.random(), y: -0.2 },
      startVelocity: 15,
      colors: ['#3b82f6', '#10b981', '#f59e0b', '#8b5cf6', '#ec4899', '#14b8a6']
    });

    if (Date.now() < end) {
      requestAnimationFrame(frame);
    }
  }());
}

async function handleProUpgrade() {
  isProcessing.value = true;
  try {
    await api.supportUsUpgrade();
    await authStore.fetchUser();
    viewMode.value = 'thankYouPro';
    triggerConfetti();
  } catch (error) {
    console.error(error);
    alert("Ocurrió un error. Inténtalo de nuevo.");
  } finally {
    isProcessing.value = false;
  }
}

async function submitReview() {
  isProcessing.value = true;
  try {
    await api.createFreemiumReview({
      rating: reviewRating.value,
      content: reviewContent.value.trim()
    });
    await authStore.fetchUser();
    viewMode.value = 'thankYouPremium';
    triggerConfetti();
  } catch (error) {
    console.error(error);
    alert("No se pudo publicar la reseña o ya escribiste una.");
  } finally {
    isProcessing.value = false;
  }
}

function handleRedirect(path) {
  emit('update:modelValue', false)
  router.push(path)
}

function closeModal() {
  viewMode.value = 'missions';
  reviewRating.value = 0;
  reviewContent.value = '';
  emit('update:modelValue', false);
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
