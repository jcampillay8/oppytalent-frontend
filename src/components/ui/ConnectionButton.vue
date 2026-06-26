<template>
  <button 
    @click="handleConnect" 
    :disabled="isLoading || isConnected || isPending"
    :class="[
      'inline-flex items-center justify-center gap-2 px-4 py-2 rounded-full text-sm font-bold transition-all duration-300',
      buttonClasses
    ]"
  >
    <UserPlus v-if="!isConnected && !isPending && !isLoading" :size="16" />
    <UserCheck v-else-if="isConnected" :size="16" />
    <Clock v-else-if="isPending" :size="16" />
    <Loader2 v-else :size="16" class="animate-spin" />
    
    {{ buttonText }}
  </button>
</template>

<script setup>
import { ref, computed, onMounted, watch } from 'vue'
import { UserPlus, UserCheck, Clock, Loader2 } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { useRouter } from 'vue-router'

const props = defineProps({
  userId: { type: String, required: true },
  initialStatus: { type: String, default: null } // 'ACCEPTED', 'PENDING', null
})

const authStore = useAuthStore()
const router = useRouter()

const isLoading = ref(false)
const localStatus = ref(props.initialStatus)

async function fetchStatus() {
  if (props.userId && authStore.token) {
    try {
      const res = await api.getConnectionStatus(props.userId)
      if (res && res.status !== 'NONE') {
        localStatus.value = res.status
      } else {
        localStatus.value = null
      }
    } catch (e) {
      console.error("Error fetching connection status", e)
    }
  }
}

onMounted(fetchStatus)

watch(() => props.userId, fetchStatus)

const isConnected = computed(() => localStatus.value === 'ACCEPTED')
const isPending = computed(() => localStatus.value === 'PENDING' || localStatus.value === 'PENDING_RECEIVED')

const buttonText = computed(() => {
  if (isLoading.value) return 'Conectando...'
  if (isConnected.value) return 'Contactos'
  if (isPending.value) return 'Pendiente'
  return 'Conectar'
})

const buttonClasses = computed(() => {
  if (isConnected.value) {
    return 'bg-emerald-500/10 text-emerald-600 border border-emerald-500/20 cursor-default'
  }
  if (isPending.value) {
    return 'bg-secondary text-muted-foreground border border-border/50 cursor-default'
  }
  return 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-sm hover:shadow-primary/20 hover:-translate-y-0.5'
})

async function handleConnect() {
  if (!authStore.token) {
    router.push('/login')
    return
  }

  if (isConnected.value || isPending.value || isLoading.value) return

  try {
    isLoading.value = true
    await api.sendConnectionRequest(props.userId)
    localStatus.value = 'PENDING'
  } catch (error) {
    console.error('Error connecting:', error)
    // Here we could show a toast
  } finally {
    isLoading.value = false
  }
}
</script>
