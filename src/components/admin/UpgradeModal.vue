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
          <h2 class="text-3xl font-black text-foreground mb-4">{{ $t('admin_upgrade_modal.upgrade_1') }}, {{ userName }}!</h2>
          <p class="text-lg text-muted-foreground mb-8">
            {{ $t('admin_upgrade_modal.upgrade_2') }} <strong class="text-emerald-500">{{ $t('admin_upgrade_modal.upgrade_3') }}</strong> {{ $t('admin_upgrade_modal.upgrade_4') }}
          </p>
          <NeonButton glow variant="primary" @click="closeModal" class="px-8">
            {{ $t('admin_upgrade_modal.upgrade_5') }}
          </NeonButton>
        </div>

        <!-- Thank You PREMIUM Screen -->
        <div v-else-if="viewMode === 'thankYouPremium'" class="p-12 flex flex-col items-center justify-center text-center min-h-[400px]">
          <div class="w-20 h-20 bg-amber-500/20 text-amber-500 rounded-full flex items-center justify-center mb-6 border border-amber-500/30">
            <Star class="w-10 h-10 fill-current" />
          </div>
          <h2 class="text-3xl font-black text-foreground mb-4">{{ $t('admin_upgrade_modal.upgrade_6') }}</h2>
          <p class="text-lg text-muted-foreground mb-8">
            {{ $t('admin_upgrade_modal.upgrade_7') }} <strong class="text-amber-500">{{ $t('admin_upgrade_modal.upgrade_8') }}</strong>.
          </p>
          <NeonButton glow variant="primary" @click="closeModal" class="px-8">
            {{ $t('admin_upgrade_modal.upgrade_5') }}
          </NeonButton>
        </div>

        <!-- Write Review Screen -->
        <div v-else-if="viewMode === 'writeReview'" class="p-8 flex flex-col min-h-[400px]">
          <h2 class="text-2xl font-black text-foreground mb-2 text-center">{{ $t('admin_upgrade_modal.upgrade_9') }}</h2>
          <p class="text-sm text-muted-foreground mb-8 text-center">{{ $t('admin_upgrade_modal.upgrade_10') }}</p>
          
          <div class="mb-8 flex justify-center gap-4">
             <Star v-for="i in 5" :key="i" 
                   class="w-12 h-12 cursor-pointer transition-all hover:scale-110"
                   :class="i <= reviewRating ? 'text-amber-500 fill-amber-500' : 'text-muted-foreground/30'"
                   @click="reviewRating = i" />
          </div>

          <textarea v-model="reviewContent" rows="4" 
                    class="w-full bg-background border border-border rounded-xl p-4 text-foreground focus:outline-none focus:border-amber-500/50 resize-none mb-8"
                    :placeholder="$t('admin_upgrade_modal.upgrade_11')"></textarea>

          <div class="flex gap-4 mt-auto">
            <button class="flex-1 px-4 py-3 rounded-xl border border-border text-foreground hover:bg-secondary/50 font-medium transition-colors" 
                    @click="viewMode = 'missions'" :disabled="isProcessing">
              {{ $t('admin_upgrade_modal.upgrade_12') }}
            </button>
            <NeonButton glow variant="primary" class="flex-1" :disabled="!isReviewValid || isProcessing" @click="submitReview">
              <span v-if="isProcessing" class="flex items-center justify-center gap-2">
                <Loader2 class="w-5 h-5 animate-spin" /> {{ $t('admin_upgrade_modal.upgrade_13') }}
              </span>
              <span v-else>{{ $t('admin_upgrade_modal.upgrade_14') }}</span>
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
            <h2 class="text-2xl font-black text-foreground text-center mb-2">{{ $t('admin_upgrade_modal.upgrade_15') }}</h2>
            <p class="text-muted-foreground text-center text-sm mb-6 leading-relaxed">
              {{ $t('admin_upgrade_modal.upgrade_16') }} <strong class="text-emerald-500 uppercase tracking-widest text-base font-black bg-emerald-500/10 px-2 py-0.5 rounded-md mx-1 border border-emerald-500/20">{{ $t('admin_upgrade_modal.upgrade_17') }}</strong> {{ $t('admin_upgrade_modal.upgrade_18') }}
            </p>

            <div class="space-y-4">
              <!-- Mission 1: Like -->
              <div class="border border-border rounded-xl p-4 flex gap-4 transition-colors relative overflow-hidden group"
                   :class="isProOrHigher ? 'bg-secondary/10 opacity-70' : 'hover:border-primary/50 bg-secondary/30'">
                
                <!-- If already unlocked overlay -->
                <div v-if="isProOrHigher" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle class="w-12 h-12 text-emerald-500 mb-2 drop-shadow-sm" />
                  <span class="font-black text-lg text-foreground">{{ $t('admin_upgrade_modal.upgrade_19') }}</span>
                  <span class="text-sm font-medium text-emerald-500 mt-1">{{ $t('admin_upgrade_modal.upgrade_20') }}</span>
                </div>

                <div class="shrink-0 w-12 h-12 bg-blue-500/10 rounded-lg flex items-center justify-center text-blue-500 border border-blue-500/20">
                  <Heart class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-blue-400">{{ $t('admin_upgrade_modal.upgrade_21') }}</h3>
                  <p class="text-xs text-muted-foreground mt-1">{{ $t('admin_upgrade_modal.upgrade_22') }}</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_23') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_24') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_25') }}</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing || isProOrHigher" @click="handleProUpgrade"></button>
              </div>

              <!-- Mission 2: Review -->
              <div class="border border-border rounded-xl p-4 flex gap-4 transition-colors relative overflow-hidden group"
                   :class="isPremiumOrHigher ? 'bg-secondary/10 opacity-70' : (!isProOrHigher ? 'opacity-50 grayscale' : 'hover:border-primary/50 bg-secondary/30')">
                
                <!-- If already unlocked overlay -->
                <div v-if="isPremiumOrHigher" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle class="w-12 h-12 text-amber-500 mb-2 drop-shadow-sm" />
                  <span class="font-black text-lg text-foreground">{{ $t('admin_upgrade_modal.upgrade_26') }}</span>
                  <span class="text-sm font-medium text-amber-500 mt-1">{{ $t('admin_upgrade_modal.upgrade_27') }}</span>
                </div>

                <!-- If locked overlay -->
                <div v-else-if="!isProOrHigher" class="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
                  <Lock class="w-8 h-8 text-muted-foreground mb-2" />
                  <span class="text-sm font-bold text-muted-foreground">Desbloquea el Plan Pro primero</span>
                </div>

                <div class="shrink-0 w-12 h-12 bg-amber-500/10 rounded-lg flex items-center justify-center text-amber-500 border border-amber-500/20">
                  <Star class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-amber-500">{{ $t('admin_upgrade_modal.upgrade_28') }}</h3>
                  <p class="text-xs text-muted-foreground mt-1">{{ $t('admin_upgrade_modal.upgrade_29') }}</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_30') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_31') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_32') }}</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing || !isProOrHigher || isPremiumOrHigher" @click="viewMode = 'writeReview'"></button>
              </div>

              <!-- Mission 3: Share (Embajador) -->
              <div class="border border-border rounded-xl p-4 flex gap-4 transition-colors relative overflow-hidden group"
                   :class="isAmbassador ? 'bg-secondary/10 opacity-70' : (!isPremiumOrHigher ? 'opacity-50 grayscale' : 'hover:border-primary/50 bg-secondary/30')">
                
                <!-- If already unlocked overlay -->
                <div v-if="isAmbassador" class="absolute inset-0 bg-background/80 backdrop-blur-sm z-20 flex flex-col items-center justify-center text-center p-4">
                  <CheckCircle class="w-12 h-12 text-purple-500 mb-2 drop-shadow-sm" />
                  <span class="font-black text-lg text-foreground">¡Plan Embajador Activo!</span>
                  <span class="text-sm font-medium text-purple-500 mt-1">Disfruta de límites extendidos</span>
                </div>

                <!-- If locked overlay -->
                <div v-else-if="!isPremiumOrHigher" class="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-20 flex flex-col items-center justify-center text-center p-4">
                  <Lock class="w-8 h-8 text-muted-foreground mb-2" />
                  <span class="text-sm font-bold text-muted-foreground">Desbloquea el Plan Premium primero</span>
                </div>

                <div class="shrink-0 w-12 h-12 bg-purple-500/10 rounded-lg flex items-center justify-center text-purple-500 border border-purple-500/20">
                  <Share2 class="w-6 h-6" />
                </div>
                <div class="flex-1">
                  <h3 class="font-bold text-foreground text-sm text-purple-400">{{ $t('admin_upgrade_modal.upgrade_33') }}</h3>
                  <p class="text-xs text-muted-foreground mt-1">{{ $t('admin_upgrade_modal.upgrade_34') }}</p>
                  <div class="mt-2 flex flex-wrap gap-2">
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_35') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_36') }}</Badge>
                    <Badge variant="secondary" class="bg-primary/10 text-primary text-[10px]">{{ $t('admin_upgrade_modal.upgrade_37') }}</Badge>
                  </div>
                </div>
                <button class="absolute inset-0 z-10 disabled:cursor-not-allowed" :disabled="isProcessing || !isPremiumOrHigher || isAmbassador" @click="viewMode = 'ambassador'"></button>
              </div>
            </div>

            <div class="mt-6 flex justify-center">
              <button 
                @click="closeModal"
                :disabled="isProcessing"
                class="text-xs text-muted-foreground hover:text-foreground underline transition-colors disabled:opacity-50"
              >
                {{ $t('admin_upgrade_modal.upgrade_38') }}
              </button>
            </div>
          </div>
        </template>
        
        <template v-else-if="viewMode === 'ambassador'">
          <div class="p-8 text-center animate-in fade-in zoom-in duration-300">
            <div class="w-16 h-16 bg-purple-500/20 text-purple-500 rounded-full flex items-center justify-center mx-auto mb-6">
              <span class="text-3xl">🚀</span>
            </div>
            <h2 class="text-2xl font-black text-foreground mb-3">{{ $t('admin_upgrade_modal.upgrade_39') }}</h2>
            <p class="text-sm text-muted-foreground mb-6">
              {{ $t('admin_upgrade_modal.upgrade_40') }} <strong>{{ $t('admin_upgrade_modal.upgrade_41') }}</strong> {{ $t('admin_upgrade_modal.upgrade_42') }}
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
              <strong>{{ $t('admin_upgrade_modal.upgrade_43') }}</strong> {{ $t('admin_upgrade_modal.upgrade_44') }}
            </div>

            <button @click="viewMode = 'missions'" class="text-sm text-muted-foreground hover:text-foreground underline transition-colors">
              {{ $t('admin_upgrade_modal.upgrade_45') }}
            </button>
          </div>
        </template>

      </div>
    </div>
  </Transition>
</template>

<script setup>
import { ref, computed } from 'vue'
import { Sparkles, Heart, Star, Share2, CheckCircle, Loader2, Copy, Check, Lock } from 'lucide-vue-next'
import Badge from '../ui/Badge.vue'
import NeonButton from '../ui/NeonButton.vue'
import { useRouter } from 'vue-router'
import { useI18n } from 'vue-i18n'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import confetti from 'canvas-confetti'

const { t } = useI18n()

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
const isAmbassador = computed(() => currentTier.value === 'AMBASSADOR')

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
    alert(t('admin_upgrade_modal.error_1'));
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
    alert(t('admin_upgrade_modal.error_2'));
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
