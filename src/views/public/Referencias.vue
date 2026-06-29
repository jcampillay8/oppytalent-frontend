<template>
  <AuroraBackground>
    <div class="min-h-screen text-zinc-50 flex flex-col font-sans selection:bg-primary/30 scroll-smooth">
      <LandingNavbar />

      <main class="flex-1 flex flex-col items-center pt-24 pb-20">
        <!-- ============================================== -->
        <!-- 1. HEADER & MARKETING DASHBOARD                -->
        <!-- ============================================== -->
        <section class="w-full max-w-7xl mx-auto px-6 md:px-16 pt-12 pb-16 z-10 text-center">
          <Badge variant="outline" class="mb-6 border-primary/30 text-primary/90 bg-primary/10 uppercase tracking-wider backdrop-blur-sm px-4 py-1.5 text-sm font-bold">
            {{ $t('public_references.ref_1') }}
          </Badge>
          <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-[1.1] tracking-tight mb-6 text-white drop-shadow-sm">
            {{ $t('public_references.ref_2') }} <span class="bg-gradient-to-r from-amber-400 via-orange-400 to-rose-400 bg-clip-text text-transparent">{{ $t('public_references.ref_3') }}</span>
          </h1>
          <p class="text-lg md:text-xl text-zinc-400 leading-relaxed mb-8 max-w-2xl mx-auto">
            {{ $t('public_references.ref_4') }}
          </p>

          <div class="flex justify-center mb-12">
            <NeonButton glow variant="primary" class="px-8 py-3 font-bold" @click="openReviewModal" v-if="authStore.isAuthenticated">
              {{ $t('public_references.ref_5') }}
            </NeonButton>
            <NeonButton variant="outline" class="px-8 py-3" v-else @click="router.push('/login')">
              {{ $t('public_references.ref_6') }}
            </NeonButton>
          </div>

          <!-- Metrics Dashboard -->
          <div class="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
            <!-- Metric 1 -->
            <div class="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-blue-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Users class="text-blue-400 mb-3" :size="32" />
              <div class="text-4xl font-black text-white mb-1">{{ stats.total_talents }}</div>
              <div class="text-sm text-zinc-400 font-medium">{{ $t('public_references.ref_7') }}</div>
            </div>
            
            <!-- Metric 2 -->
            <div class="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-emerald-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <ThumbsUp class="text-emerald-400 mb-3" :size="32" />
              <div class="text-4xl font-black text-white mb-1">{{ stats.total_likes }}</div>
              <div class="text-sm text-zinc-400 font-medium">{{ $t('public_references.ref_8') }}</div>
            </div>

            <!-- Metric 3 -->
            <div class="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-amber-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <MessageSquareQuote class="text-amber-400 mb-3" :size="32" />
              <div class="text-4xl font-black text-white mb-1">{{ stats.total_reviews }}</div>
              <div class="text-sm text-zinc-400 font-medium">{{ $t('public_references.ref_9') }}</div>
            </div>

            <!-- Metric 4 -->
            <div class="p-6 rounded-3xl bg-zinc-900/60 border border-white/5 shadow-lg flex flex-col items-center justify-center relative overflow-hidden group">
              <div class="absolute inset-0 bg-purple-500/5 opacity-0 group-hover:opacity-100 transition-opacity"></div>
              <Briefcase class="text-purple-400 mb-3" :size="32" />
              <div class="text-4xl font-black text-white mb-1">{{ stats.total_hunters }}</div>
              <div class="text-sm text-zinc-400 font-medium">{{ $t('public_references.ref_10') }}</div>
            </div>
          </div>
        </section>

        <!-- ============================================== -->
        <!-- 2. REVIEWS WALL                                -->
        <!-- ============================================== -->
        <section class="w-full max-w-7xl mx-auto px-6 md:px-16 pb-24 z-10 relative">
          <!-- Loader -->
          <div v-if="loading" class="flex justify-center py-20">
            <Loader2 class="animate-spin text-primary w-10 h-10" />
          </div>

          <!-- Reviews Grid -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            <div 
              v-for="review in reviewsData" 
              :key="review.id"
              class="p-8 rounded-3xl bg-zinc-900/40 border border-white/5 hover:border-white/10 transition-colors flex flex-col relative overflow-hidden"
            >
              <div class="flex items-center justify-between mb-6 relative z-10">
                <div class="flex items-center gap-1 text-amber-400">
                  <Star fill="currentColor" :size="16" v-for="s in review.rating" :key="s" />
                  <Star :size="16" v-for="s in (5 - review.rating)" :key="'empty-'+s" class="text-zinc-600" />
                </div>
                <span class="text-xs text-zinc-500 font-medium">{{ formatDate(review.date) }}</span>
              </div>
              
              <p class="text-zinc-300 leading-relaxed italic mb-8 flex-1 relative z-10">
                "{{ review.content }}"
              </p>
              
              <div class="flex items-center justify-between border-t border-white/10 pt-6 relative z-10">
                <div class="flex items-center gap-3">
                  <div class="w-10 h-10 rounded-full bg-gradient-to-br from-primary to-purple-500 flex items-center justify-center font-bold text-white shadow-inner uppercase">
                    {{ review.author.charAt(0) }}
                  </div>
                  <div>
                    <div class="font-bold text-sm text-white capitalize">{{ review.author }}</div>
                    <div class="text-xs text-zinc-500 capitalize">{{ review.role }}</div>
                  </div>
                </div>
                
                <button 
                  @click="toggleLike(review)"
                  class="flex items-center gap-1.5 px-3 py-1.5 rounded-full transition-all text-sm font-medium hover:scale-105 active:scale-95"
                  :class="review.isLiked ? 'bg-rose-500/20 text-rose-400 shadow-[0_0_15px_rgba(244,63,94,0.3)]' : 'bg-white/5 text-zinc-400 hover:bg-white/10 hover:text-rose-400'"
                >
                  <Heart :size="16" :fill="review.isLiked ? 'currentColor' : 'none'" />
                  {{ review.likes }}
                </button>
              </div>
            </div>
          </div>
          
          <div v-if="!loading && reviewsData.length === 0" class="text-center py-20 text-zinc-500">
            {{ $t('public_references.ref_11') }}
          </div>
        </section>

        <!-- Footer -->
        <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500 z-10 relative bg-[#050505]">
          <p>© {{ new Date().getFullYear() }} {{ $t('public_references.ref_12') }}</p>
        </footer>

      </main>
    </div>

    <!-- Review Modal -->
    <Transition name="fade">
      <div v-if="showModal" class="fixed inset-0 z-50 flex items-center justify-center p-4">
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm" @click="showModal = false"></div>
        <div class="relative bg-card border border-border rounded-2xl w-full max-w-lg shadow-2xl p-6 sm:p-8">
          <h2 class="text-2xl font-black mb-2">{{ $t('public_references.ref_13') }}</h2>
          <p class="text-sm text-muted-foreground mb-6">{{ $t('public_references.ref_14') }} <strong class="text-amber-500">{{ $t('public_references.ref_15') }}</strong>.</p>
          
          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">{{ $t('public_references.ref_16') }}</label>
            <div class="flex gap-2">
              <Star 
                v-for="i in 5" 
                :key="i"
                @click="newReview.rating = i"
                class="cursor-pointer transition-colors"
                :class="i <= newReview.rating ? 'text-amber-400 fill-amber-400' : 'text-zinc-600 hover:text-amber-400/50'"
                :size="32"
              />
            </div>
          </div>

          <div class="mb-6">
            <label class="block text-sm font-medium mb-2">{{ $t('public_references.ref_17') }}</label>
            <textarea 
              v-model="newReview.content" 
              rows="4" 
              :placeholder="$t('public_references.ref_18')"
              class="w-full rounded-xl bg-secondary/50 border border-border focus:border-primary focus:ring-1 focus:ring-primary p-3 outline-none transition-all text-sm resize-none"
            ></textarea>
          </div>

          <div class="flex justify-end gap-3">
            <button @click="showModal = false" class="px-4 py-2 rounded-lg text-sm font-medium text-muted-foreground hover:bg-secondary/50">{{ $t('public_references.ref_19') }}</button>
            <NeonButton glow variant="primary" @click="submitReview" :disabled="isSubmitting || !newReview.content.trim()">
              {{ isSubmitting ? $t('public_references.ref_20') : $t('public_references.ref_21') }}
            </NeonButton>
          </div>
        </div>
      </div>
    </Transition>
  </AuroraBackground>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
import { ref, onMounted } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import AuroraBackground from '../../components/ui/AuroraBackground.vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  Users, ThumbsUp, MessageSquareQuote, Briefcase,
  Star, Heart, ChevronDown, Loader2
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const loading = ref(true)
const isSubmitting = ref(false)
const showModal = ref(false)

const stats = ref({
  total_talents: 0,
  total_reviews: 0,
  total_likes: 0,
  total_hunters: 0
})

const reviewsData = ref([])

const newReview = ref({
  rating: 5,
  content: ''
})

onMounted(async () => {
  await fetchData()
})

async function fetchData() {
  loading.value = true
  try {
    const [statsRes, reviewsRes] = await Promise.all([
      api.getFreemiumStats(),
      api.getFreemiumReviews()
    ])
    stats.value = statsRes
    reviewsData.value = reviewsRes
  } catch (error) {
    console.error("Error fetching freemium data", error)
  } finally {
    loading.value = false
  }
}

function formatDate(dateStr) {
  if (!dateStr) return '';
  const date = new Date(dateStr);
  const now = new Date();
  const diffInSeconds = Math.floor((now - date) / 1000);

  if (diffInSeconds < 60) {
    return `hace ${diffInSeconds} segundos`;
  }
  
  const diffInMinutes = Math.floor(diffInSeconds / 60);
  if (diffInMinutes < 60) {
    return `hace ${diffInMinutes} minuto${diffInMinutes > 1 ? 's' : ''}`;
  }
  
  const diffInHours = Math.floor(diffInMinutes / 60);
  if (diffInHours < 24) {
    return `hace ${diffInHours} hora${diffInHours > 1 ? 's' : ''}`;
  }
  
  const diffInDays = Math.floor(diffInHours / 24);
  if (diffInDays < 30) {
    return `hace ${diffInDays} día${diffInDays > 1 ? 's' : ''}`;
  }
  
  const diffInMonths = Math.floor(diffInDays / 30);
  if (diffInMonths < 12) {
    return `hace ${diffInMonths} mes${diffInMonths > 1 ? 'es' : ''}`;
  }

  const diffInYears = Math.floor(diffInDays / 365);
  return `hace ${diffInYears} año${diffInYears > 1 ? 's' : ''}`;
}

async function toggleLike(review) {
  if (!authStore.isAuthenticated) {
    alert("Debes iniciar sesión para dar un Me Gusta y desbloquear tu Nivel PRO.")
    router.push('/login')
    return
  }

  // Optimistic update
  const wasLiked = review.isLiked
  review.isLiked = !wasLiked
  review.likes += wasLiked ? -1 : 1

  try {
    const res = await api.toggleFreemiumReviewLike(review.id)
    if (res.message.includes('Nivel PRO')) {
      alert("🎉 " + res.message)
      // Opcional: Actualizar datos de usuario en Pinia
      await authStore.fetchUser()
    }
  } catch (e) {
    console.error(e)
    // Revert if error
    review.isLiked = wasLiked
    review.likes += wasLiked ? 1 : -1
  }
}

function openReviewModal() {
  newReview.value = { rating: 5, content: '' }
  showModal.value = true
}

async function submitReview() {
  if (!newReview.value.content.trim()) return
  
  isSubmitting.value = true
  try {
    const res = await api.createFreemiumReview(newReview.value)
    alert("🎉 " + res.message)
    await authStore.fetchUser()
    showModal.value = false
    await fetchData()
  } catch (error) {
    if (error.response?.status === 400) {
      alert(error.data?.detail || "Error al publicar")
    } else {
      alert("Ocurrió un error inesperado")
    }
  } finally {
    isSubmitting.value = false
  }
}
</script>

<style scoped>
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.2s ease;
}

.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}
</style>
