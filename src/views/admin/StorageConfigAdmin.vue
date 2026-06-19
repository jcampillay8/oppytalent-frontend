<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
        <Database :size="32" class="text-primary" /> {{ $t('admin.views.storage.title') }}
      </h1>
      <p class="text-muted-foreground mt-1">{{ $t('admin.views.storage.description') }}</p>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <div class="lg:col-span-2 space-y-6">
        <GlassCard class="p-6 md:p-8">
          <div class="flex items-center justify-between mb-6 pb-4 border-b border-border/50">
            <h2 class="text-xl font-bold text-foreground flex items-center gap-2">
              <HardDrive :size="24" class="text-primary" /> {{ $t('admin.views.storage.usage_title') }}
            </h2>
            <Badge :variant="user.is_premium ? 'primary' : 'secondary'">
              {{ user.is_premium ? $t('admin.views.storage.premium_plan') : $t('admin.views.storage.free_plan') }}
            </Badge>
          </div>

          <div class="space-y-4">
            <div class="flex justify-between items-end">
              <div>
                <span class="text-3xl font-extrabold text-foreground">{{ formatBytes(storageUsed) }}</span>
                <span class="text-muted-foreground ml-2 text-sm">{{ $t('admin.views.storage.of') }} {{ formatBytes(storageLimit) }}</span>
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
                <!-- Animated shine effect -->
                <div class="absolute inset-0 bg-gradient-to-r from-transparent via-white/20 to-transparent -translate-x-full animate-[shimmer_2s_infinite]"></div>
              </div>
            </div>
            
            <p class="text-xs text-muted-foreground mt-2">
              {{ $t('admin.views.storage.description') }}
            </p>
          </div>
        </GlassCard>
      </div>

      <!-- Upgrade CTA (Only for Free users or nearly full Premium users) -->
      <div class="lg:col-span-1" v-if="!user.is_premium">
        <GlassCard class="p-6 h-full flex flex-col justify-between border-primary/20 bg-primary/5 relative overflow-hidden group">
          <!-- Decorative elements -->
          <div class="absolute top-0 right-0 -mr-8 -mt-8 w-32 h-32 bg-primary/10 rounded-full blur-2xl group-hover:bg-primary/20 transition-all duration-500"></div>
          
          <div>
            <div class="w-12 h-12 bg-primary/20 rounded-xl flex items-center justify-center mb-4 text-primary">
              <Zap :size="24" />
            </div>
            <h3 class="text-lg font-bold text-foreground mb-2">{{ $t('admin.views.storage.upgrade_title') }}</h3>
            <p class="text-sm text-muted-foreground leading-relaxed mb-6">
              {{ $t('admin.views.storage.upgrade_desc') }}
            </p>
          </div>
          
          <NeonButton glow variant="primary" class="w-full">
            {{ $t('admin.views.storage.upgrade_btn') }}
          </NeonButton>
        </GlassCard>
      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Database, HardDrive, Zap } from 'lucide-vue-next'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

onMounted(async () => {
  if (!authStore.user) {
    await authStore.fetchUser()
  } else {
    // Force refresh to get latest storage used
    await authStore.fetchUser()
  }
})

const user = computed(() => authStore.user || { is_premium: false })
const storageUsed = computed(() => user.value.storage_used || 0)

// 25 MB for Free, 1 GB for Premium
const FREE_LIMIT = 26_214_400
const PREMIUM_LIMIT = 1_073_741_824

const storageLimit = computed(() => {
  return user.value.is_premium ? PREMIUM_LIMIT : FREE_LIMIT
})

const usagePercentage = computed(() => {
  if (storageLimit.value === 0) return 0
  const pct = (storageUsed.value / storageLimit.value) * 100
  return Math.min(100, Math.max(0, Number(pct.toFixed(1))))
})

const isNearLimit = computed(() => usagePercentage.value >= 85)
const isVeryNearLimit = computed(() => usagePercentage.value >= 95)

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
</script>
