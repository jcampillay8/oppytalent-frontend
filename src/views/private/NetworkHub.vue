<template>
  <AdminLayout>
    <div class="max-w-5xl mx-auto pb-20 pt-8 px-4 sm:px-8">
      
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Network class="text-primary" :size="36" />
          {{ $t('network_hub.network_hub_1') }}
        </h1>
        <p class="text-muted-foreground mt-2">{{ $t('network_hub.network_hub_2') }}</p>
      </div>

      <!-- Tabs -->
      <div class="flex gap-4 border-b border-border mb-8 overflow-x-auto hide-scrollbar">
        <button 
          v-for="tab in tabs" 
          :key="tab.id"
          @click="activeTab = tab.id"
          class="pb-3 text-sm font-semibold transition-colors border-b-2 whitespace-nowrap"
          :class="activeTab === tab.id ? 'border-primary text-primary' : 'border-transparent text-muted-foreground hover:text-foreground'"
        >
          <div class="flex items-center gap-2">
            <component :is="tab.icon" :size="16" />
            {{ tab.label }}
            <span v-if="tab.count !== undefined" class="bg-secondary px-2 py-0.5 rounded-full text-xs ml-1">{{ tab.count }}</span>
          </div>
        </button>
      </div>

      <!-- Content -->
      <div v-if="loading" class="flex justify-center py-20">
        <Loader2 class="animate-spin text-primary" :size="48" />
      </div>

      <div v-else>
        <!-- Contactos (Accepted) -->
        <div v-if="activeTab === 'contacts'" class="flex flex-col gap-4">
          <div v-if="contacts.length === 0" class="col-span-full text-center py-12 bg-secondary/30 rounded-2xl border border-dashed border-border/50">
            <Users :size="48" class="mx-auto text-muted-foreground/50 mb-4" />
            <h3 class="text-lg font-bold text-foreground">{{ $t('network_hub.network_hub_3') }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ $t('network_hub.network_hub_4') }}</p>
          </div>
          
          <div v-for="conn in contacts" :key="conn.connection_id" class="bg-card border border-border/50 rounded-2xl p-5 hover:border-primary/50 transition-colors shadow-sm flex flex-col sm:flex-row sm:items-center justify-between gap-4">
            <div class="flex items-center gap-5">
              <div class="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0 cursor-pointer border border-border hover:border-primary transition-colors" @click="router.push(`/${conn.user?.username?.split('@')[0] || ''}`)">
                <img v-if="conn.user?.user_image" :src="conn.user.user_image" class="w-full h-full object-cover" />
                <span v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-foreground uppercase">
                  {{ conn.user?.first_name ? conn.user.first_name[0] : (conn.user?.username ? conn.user.username[0] : 'U') }}
                </span>
              </div>
              <div class="min-w-0 cursor-pointer hover:text-primary transition-colors" @click="router.push(`/${conn.user?.username?.split('@')[0] || ''}`)">
                <h4 class="font-bold text-foreground text-lg">
                  {{ conn.user?.first_name || conn.user?.username?.split('@')[0] || 'Usuario' }} {{ conn.user?.last_name || '' }}
                </h4>
                <p class="text-sm text-muted-foreground">{{ conn.user?.occupation || 'Profesional' }}</p>
              </div>
            </div>
            
            <div class="flex items-center gap-4 sm:shrink-0">
              <span class="text-xs text-muted-foreground flex items-center gap-1">
                <Calendar :size="12" /> Desde {{ new Date(conn.connected_since).toLocaleDateString() }}
              </span>
              <button class="text-sm text-red-500 hover:text-red-400 font-medium px-3 py-1.5 rounded-lg hover:bg-red-500/10 transition-colors">{{ $t('network_hub.network_hub_5') }}</button>
            </div>
          </div>
        </div>

        <!-- Solicitudes Pendientes (Fase 4) -->
        <div v-if="activeTab === 'pending'" class="space-y-6">
          <div v-if="pendingRequests.length === 0" class="bg-card border border-border/50 rounded-2xl p-10 text-center shadow-sm">
            <UserPlus :size="48" class="mx-auto text-muted-foreground/50 mb-4" />
            <h3 class="text-lg font-bold text-foreground">{{ $t('network_hub.network_hub_6') }}</h3>
            <p class="text-sm text-muted-foreground mt-1">{{ $t('network_hub.network_hub_7') }}</p>
          </div>

          <div v-else class="flex flex-col gap-4">
            <div v-for="req in pendingRequests" :key="req.connection_id" class="bg-card border border-amber-500/30 rounded-2xl p-5 shadow-sm hover:border-amber-500/60 transition-all flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              <div class="flex items-center gap-5">
                <div class="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0 cursor-pointer border border-border hover:border-amber-500/50 transition-colors" @click="router.push(`/${req.requester?.username?.split('@')[0] || ''}`)">
                  <img v-if="req.requester?.user_image" :src="req.requester.user_image" class="w-full h-full object-cover" />
                  <span v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-foreground">
                    {{ req.requester?.first_name ? req.requester.first_name[0] : (req.requester?.username ? req.requester.username[0].toUpperCase() : 'U') }}
                  </span>
                </div>
                <div class="min-w-0">
                  <h4 class="font-bold text-foreground text-lg cursor-pointer hover:text-primary transition-colors" @click="router.push(`/${req.requester?.username?.split('@')[0] || ''}`)">
                    {{ req.requester?.first_name || req.requester?.username?.split('@')[0] || 'Usuario' }} {{ req.requester?.last_name || '' }}
                  </h4>
                  <p class="text-sm text-muted-foreground">{{ req.requester?.occupation || 'Profesional' }}</p>
                </div>
              </div>
              
              <div class="flex gap-2 sm:shrink-0">
                <button @click="acceptRequest(req.connection_id)" class="px-6 bg-primary text-primary-foreground py-2 rounded-lg text-sm font-bold shadow-sm hover:shadow-primary/20 transition-all flex items-center justify-center gap-2">
                  <UserCheck size="16" /> {{ $t('network_hub.network_hub_8') }}
                </button>
                <button @click="rejectRequest(req.connection_id)" class="px-4 bg-secondary text-foreground hover:bg-secondary/80 py-2 rounded-lg text-sm font-bold transition-all border border-border">
                  {{ $t('network_hub.network_hub_9') }}
                </button>
              </div>
            </div>
          </div>
        </div>

        <!-- Sugerencias IA (Fase 4) -->
        <div v-if="activeTab === 'suggestions'" class="space-y-6">
          
          <div v-if="loadingSuggestions" class="flex justify-center py-20">
            <div class="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>

          <!-- Locked State -->
          <div v-else-if="suggestionsLocked" class="relative overflow-hidden rounded-3xl border border-border bg-card shadow-xl group">
            <!-- Blur overlay over some fake suggestions -->
            <div class="absolute inset-0 bg-background/60 backdrop-blur-md z-10 flex flex-col items-center justify-center p-6 text-center">
              <div class="w-20 h-20 bg-primary/20 rounded-full flex items-center justify-center mb-6">
                <Sparkles :size="40" class="text-primary" />
              </div>
              <h2 class="text-3xl font-black mb-4">{{ $t('network_hub.network_hub_10') }}</h2>
              <p class="text-muted-foreground max-w-lg mb-8 text-sm md:text-base">
                {{ $t('network_hub.network_hub_11') }}
              </p>
              
              <div class="flex flex-col sm:flex-row gap-4 w-full max-w-md justify-center">
                <button @click="goToAdminStorage" class="px-6 py-3 bg-secondary hover:bg-secondary/80 text-foreground font-bold rounded-xl transition-all border border-border shadow-sm text-sm">
                  {{ $t('network_hub.network_hub_12') }}
                </button>
                <button @click="goToAdminStorage" class="px-6 py-3 bg-primary hover:bg-primary/90 text-primary-foreground font-bold rounded-xl transition-all shadow-md hover:shadow-primary/20 flex items-center justify-center gap-2 text-sm">
                  <Zap :size="18" /> {{ $t('network_hub.network_hub_13') }}
                </button>
              </div>
            </div>
            
            <!-- Fake content behind blur -->
            <div class="grid grid-cols-1 md:grid-cols-2 gap-4 p-8 opacity-40 select-none">
              <div v-for="i in 4" :key="i" class="bg-secondary/50 rounded-2xl h-48 border border-border/50"></div>
            </div>
          </div>

          <!-- Unlocked / Loaded State -->
          <div v-else class="grid grid-cols-1 md:grid-cols-2 gap-6">
            <div v-if="suggestions.length === 0" class="col-span-full bg-card border border-border rounded-2xl p-10 text-center">
              <h3 class="text-lg font-bold">{{ $t('network_hub.network_hub_14') }}</h3>
              <p class="text-muted-foreground mt-2">{{ $t('network_hub.network_hub_15') }}</p>
            </div>
            
            <div v-for="sug in suggestions" :key="sug.suggested_user_id" class="bg-card border border-border rounded-2xl p-6 shadow-sm hover:shadow-md transition-all group">
              <div class="flex justify-between items-start mb-4">
                <div class="flex items-center gap-4">
                  <div class="w-14 h-14 rounded-full bg-secondary overflow-hidden shrink-0 cursor-pointer border border-border group-hover:border-primary transition-colors" @click="router.push(`/${sug.user?.username?.split('@')[0] || ''}`)">
                    <img v-if="sug.user?.user_image" :src="sug.user.user_image" class="w-full h-full object-cover" />
                    <span v-else class="w-full h-full flex items-center justify-center text-xl font-bold text-foreground">
                      {{ sug.user?.first_name ? sug.user.first_name[0] : (sug.user?.username ? sug.user.username[0].toUpperCase() : 'U') }}
                    </span>
                  </div>
                  <div>
                    <h4 class="font-bold text-lg text-foreground cursor-pointer hover:text-primary transition-colors" @click="router.push(`/${sug.user?.username?.split('@')[0] || ''}`)">
                      {{ sug.user?.first_name || sug.user?.username?.split('@')[0] || 'Usuario' }} {{ sug.user?.last_name || '' }}
                    </h4>
                    <p class="text-xs font-medium text-primary">{{ sug.user?.occupation || 'Profesional' }}</p>
                  </div>
                </div>
                <div class="flex items-center gap-1 bg-amber-500/10 text-amber-500 px-2 py-1 rounded-full border border-amber-500/20 shadow-sm text-xs font-bold">
                  <Zap size="12" /> {{ Math.round(sug.affinity_score * 100) }}% Match
                </div>
              </div>
              
              <div class="bg-primary/5 border border-primary/10 rounded-xl p-4 mb-5 min-h-[5rem]">
                <p class="text-sm text-foreground/90 italic flex gap-2">
                  <Sparkles class="text-primary shrink-0 mt-0.5" size="16" /> 
                  "{{ sug.reason }}"
                </p>
              </div>
              
              <ConnectionButton :userId="sug.suggested_user_id" class="w-full" />
            </div>
          </div>
        </div>
      </div>

    </div>
  </AdminLayout>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { ref, onMounted, watch } from 'vue'
import { Network, Users, UserPlus, Sparkles, Loader2, Calendar, Zap, UserCheck } from 'lucide-vue-next'
import { api } from '../../services/api'
import ConnectionButton from '../../components/ui/ConnectionButton.vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { useNetworkStore } from '../../stores/network'

const router = useRouter()
const authStore = useAuthStore()
const networkStore = useNetworkStore()

const activeTab = ref('contacts')
const loading = ref(true)
const contacts = ref([])
const pendingRequests = ref([])

const tabs = ref([
  { id: 'contacts', label: 'Mis Contactos', icon: Users, count: 0 },
  { id: 'pending', label: 'Solicitudes', icon: UserPlus, count: 0 },
  { id: 'suggestions', label: 'Sugerencias IA', icon: Sparkles }
])

onMounted(async () => {
  try {
    loading.value = true
    const [resContacts, resPending] = await Promise.all([
      api.getConnections(),
      api.getPendingConnections()
    ])
    
    contacts.value = resContacts || []
    pendingRequests.value = resPending || []
    
    tabs.value[0].count = contacts.value.length
    tabs.value[1].count = pendingRequests.value.length
    
  } catch (error) {
    console.error("Error loading network data:", error)
  } finally {
    loading.value = false
  }
})

async function acceptRequest(connectionId) {
  try {
    await api.acceptConnection(connectionId)
    // Remove from pending
    pendingRequests.value = pendingRequests.value.filter(req => req.connection_id !== connectionId)
    tabs.value[1].count = pendingRequests.value.length
    // Update global store
    networkStore.fetchPendingRequests()
    // Reload contacts
    const resContacts = await api.getConnections()
    contacts.value = resContacts || []
    tabs.value[0].count = contacts.value.length
  } catch (err) {
    console.error('Error accepting connection:', err)
  }
}

async function rejectRequest(connectionId) {
  try {
    await api.rejectConnection(connectionId)
    pendingRequests.value = pendingRequests.value.filter(req => req.connection_id !== connectionId)
    tabs.value[1].count = pendingRequests.value.length
    networkStore.fetchPendingRequests()
  } catch (err) {
    console.error('Error rejecting connection:', err)
  }
}

const suggestions = ref([])
const suggestionsLocked = ref(false)
const loadingSuggestions = ref(false)
const hasLoadedSuggestions = ref(false)

watch(activeTab, async (newVal) => {
  if (newVal === 'suggestions' && !hasLoadedSuggestions.value) {
    loadingSuggestions.value = true
    try {
      suggestions.value = await api.getNetworkSuggestions()
      hasLoadedSuggestions.value = true
    } catch (e) {
      if (e.message && e.message.includes('402')) {
        suggestionsLocked.value = true
      } else if (e.response && e.response.status === 402) {
        suggestionsLocked.value = true
      } else {
        suggestionsLocked.value = true // default to locked on error for safety
      }
    } finally {
      loadingSuggestions.value = false
    }
  }
})

function goToAdminStorage() {
  const username = authStore.user?.username?.split('@')[0] || 'admin'
  router.push(`/${username}/storage`)
}
</script>
