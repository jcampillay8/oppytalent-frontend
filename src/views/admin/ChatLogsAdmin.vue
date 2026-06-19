<template>
  
    <AdminLayout>
      <div class="flex flex-col sm:flex-row justify-between items-start sm:items-end mb-8 gap-4">
        <div>
          <h1 class="text-3xl font-extrabold tracking-tight text-foreground">{{ $t('admin.views.chat_logs.title') }}</h1>
          <p class="text-muted-foreground mt-1">{{ $t('admin.views.chat_logs.description') }}</p>
        </div>
        
        <div class="flex items-center gap-3 w-full sm:w-auto">
          <!-- Column Toggle via AnimatedDropdown -->
          <AnimatedDropdown align="right">
            <template #trigger>
              <NeonButton variant="outline">
                <template #icon-left><Settings2 :size="16" /></template>
                {{ $t('admin.views.chat_logs.columns') }}
              </NeonButton>
            </template>
            <template #content="{ close }">
              <div class="p-2 space-y-1 w-48">
                <label v-for="col in columnsState" :key="col.key" class="flex items-center gap-2 p-2 hover:bg-secondary rounded-lg cursor-pointer transition-colors">
                  <input type="checkbox" v-model="col.visible" class="rounded border-border bg-card text-primary focus:ring-primary/20" />
                  <span class="text-sm font-medium">{{ col.label }}</span>
                </label>
              </div>
            </template>
          </AnimatedDropdown>
          
          <NeonButton @click="refreshData" :disabled="chatLogsStore.loading" glow>
            <template #icon-left>
              <RefreshCw :size="16" :class="{ 'animate-spin': chatLogsStore.loading }" />
            </template>
            {{ chatLogsStore.loading ? $t('admin.views.chat_logs.refreshing') : $t('admin.views.chat_logs.refresh') }}
          </NeonButton>
        </div>
      </div>

      <div v-if="chatLogsStore.error" class="bg-destructive/10 border border-destructive/20 text-destructive px-4 py-3 rounded-xl mb-6">
        {{ chatLogsStore.error }}
      </div>

      <GlassCard class="p-0 overflow-x-auto custom-scrollbar">
        <table class="w-full text-sm text-left border-collapse">
          <thead class="text-xs text-muted-foreground uppercase bg-secondary/50 border-b border-border/50">
            <tr>
              <th v-for="col in visibleColumns" :key="col.key" class="px-4 py-4 font-semibold whitespace-nowrap">
                {{ col.label }}
              </th>
            </tr>
          </thead>
          <tbody class="divide-y divide-border/50">
            <tr 
              v-for="log in paginatedItems" 
              :key="log.id"
              class="hover:bg-primary/5 transition-colors cursor-pointer group"
              @click="openModal(log)"
            >
              <td v-if="isColVisible('created_at')" class="px-4 py-3 whitespace-nowrap text-muted-foreground">
                {{ formatDate(log.created_at) }}
              </td>
              <td v-if="isColVisible('ip_address')" class="px-4 py-3 font-mono text-xs text-primary/80">
                {{ log.ip_address || $t('admin.views.chat_logs.unknown') }}
              </td>
              <td v-if="isColVisible('city')" class="px-4 py-3 text-muted-foreground">
                {{ log.city || '-' }}
              </td>
              <td v-if="isColVisible('region')" class="px-4 py-3 text-muted-foreground">
                {{ log.region || '-' }}
              </td>
              <td v-if="isColVisible('country')" class="px-4 py-3">
                <Badge v-if="log.country" variant="secondary">{{ log.country }}</Badge>
                <span v-else class="text-muted-foreground">-</span>
              </td>
              <td v-if="isColVisible('user_message')" class="px-4 py-3 max-w-[200px] truncate">
                {{ log.user_message }}
              </td>
              <td v-if="isColVisible('ai_response')" class="px-4 py-3 max-w-[200px] truncate text-muted-foreground">
                {{ log.ai_response }}
              </td>
              <td v-if="isColVisible('clicked_link')" class="px-4 py-3">
                <Badge v-if="log.clicked_link" variant="outline" class="max-w-[150px] truncate">{{ log.clicked_link }}</Badge>
                <span v-else class="text-muted-foreground">-</span>
              </td>
            </tr>
            <tr v-if="chatLogsStore.items.length === 0 && !chatLogsStore.loading">
              <td :colspan="visibleColumns.length" class="px-4 py-16 text-center text-muted-foreground">
                <div class="flex flex-col items-center gap-3">
                  <div class="p-4 bg-secondary rounded-full"><MessageSquare :size="32" /></div>
                  <p>{{ $t('admin.views.chat_logs.no_logs') }}</p>
                </div>
              </td>
            </tr>
          </tbody>
        </table>
      </GlassCard>

      <!-- Pagination Controls -->
      <div class="flex flex-col sm:flex-row items-center justify-between gap-4 mt-6" v-if="chatLogsStore.items.length > 0">
        <div class="flex items-center gap-3 text-sm text-muted-foreground">
          <span>{{ $t('admin.views.chat_logs.show') }}:</span>
          <select v-model="itemsPerPage" @change="currentPage = 1" class="bg-secondary border border-border rounded-lg px-2 py-1 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50">
            <option :value="10">10</option>
            <option :value="20">20</option>
            <option :value="50">50</option>
          </select>
          <span>{{ $t('admin.views.chat_logs.of') }} {{ chatLogsStore.items.length }} {{ $t('admin.views.chat_logs.records') }}</span>
        </div>
        
        <div class="flex items-center gap-4 text-sm">
          <button @click="prevPage" :disabled="currentPage === 1" class="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors">
            &laquo; {{ $t('admin.views.chat_logs.prev') }}
          </button>
          <span class="font-medium bg-secondary px-3 py-1 rounded-lg">{{ $t('admin.views.chat_logs.page') }} {{ currentPage }} {{ $t('admin.views.chat_logs.of') }} {{ totalPages || 1 }}</span>
          <button @click="nextPage" :disabled="currentPage === totalPages || totalPages === 0" class="text-muted-foreground hover:text-foreground disabled:opacity-50 disabled:pointer-events-none transition-colors">
            {{ $t('admin.views.chat_logs.next') }} &raquo;
          </button>
        </div>
      </div>
    </AdminLayout>

    <!-- Detail Modal -->
    <Teleport to="body">
      <div v-if="selectedLog" class="fixed inset-0 z-[100] flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm" @click.self="closeModal">
        <div 
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          class="w-full max-w-2xl max-h-[90vh] overflow-hidden flex flex-col"
        >
          <GlassCard class="flex flex-col h-full max-h-[90vh] p-0 overflow-hidden border-primary/20 shadow-2xl">
            <div class="flex items-center justify-between p-4 border-b border-border/50 bg-secondary/50">
              <h2 class="text-lg font-bold flex items-center gap-2"><MessageSquare :size="18" class="text-primary"/> {{ $t('admin.views.chat_logs.modal_title') }}</h2>
              <button class="text-muted-foreground hover:text-destructive transition-colors" @click="closeModal"><X :size="20" /></button>
            </div>
            
            <div class="flex-1 overflow-y-auto p-4 custom-scrollbar">
              <div class="grid grid-cols-2 gap-4 mb-6 text-sm">
                <div class="bg-secondary/50 p-3 rounded-lg border border-border">
                  <span class="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">{{ $t('admin.views.chat_logs.datetime') }}</span>
                  <span class="font-medium">{{ formatDate(selectedLog.created_at) }}</span>
                </div>
                <div class="bg-secondary/50 p-3 rounded-lg border border-border">
                  <span class="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">{{ $t('admin.views.chat_logs.ip') }}</span>
                  <span class="font-mono text-primary/80">{{ selectedLog.ip_address || $t('admin.views.chat_logs.unknown') }}</span>
                </div>
                <div class="bg-secondary/50 p-3 rounded-lg border border-border col-span-2 sm:col-span-1" v-if="selectedLog.city || selectedLog.country">
                  <span class="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">{{ $t('admin.views.chat_logs.location') }}</span>
                  <span class="font-medium">
                    {{ [selectedLog.city, selectedLog.region, selectedLog.country].filter(Boolean).join(', ') }}
                  </span>
                </div>
                <div class="bg-secondary/50 p-3 rounded-lg border border-border col-span-2 sm:col-span-1" v-if="selectedLog.clicked_link">
                  <span class="block text-xs text-muted-foreground mb-1 uppercase tracking-wider">{{ $t('admin.views.chat_logs.clicked_link') }}</span>
                  <Badge variant="outline">{{ selectedLog.clicked_link }}</Badge>
                </div>
              </div>

              <div class="space-y-4">
                <div class="flex flex-col items-end gap-1">
                  <div class="text-xs text-muted-foreground mr-1 flex items-center gap-1"><User :size="12" /> {{ $t('admin.views.chat_logs.user') }}</div>
                  <div class="bg-primary text-primary-foreground p-3 rounded-2xl rounded-tr-sm max-w-[85%] shadow-sm">
                    {{ selectedLog.user_message }}
                  </div>
                </div>
                
                <div class="flex flex-col items-start gap-1">
                  <div class="text-xs text-muted-foreground ml-1 flex items-center gap-1"><Bot :size="12" /> {{ $t('admin.views.chat_logs.ai') }}</div>
                  <div class="bg-secondary border border-border/50 text-foreground p-3 rounded-2xl rounded-tl-sm max-w-[95%] shadow-sm whitespace-pre-wrap text-sm leading-relaxed">
                    {{ selectedLog.ai_response }}
                  </div>
                </div>
              </div>
            </div>
          </GlassCard>
        </div>
      </div>
    </Teleport>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import AnimatedDropdown from '../../components/ui/AnimatedDropdown.vue'
import Badge from '../../components/ui/Badge.vue'
import { Settings2, RefreshCw, MessageSquare, X, User, Bot } from 'lucide-vue-next'
import { useChatLogsStore } from '../../stores/chatLogs'
import { useI18n } from 'vue-i18n'

const chatLogsStore = useChatLogsStore()
const { t } = useI18n()

// State for Modal
const selectedLog = ref(null)

// Pagination State
const currentPage = ref(1)
const itemsPerPage = ref(10)

const totalPages = computed(() => Math.ceil(chatLogsStore.items.length / itemsPerPage.value))

const paginatedItems = computed(() => {
  const start = (currentPage.value - 1) * itemsPerPage.value
  const end = start + itemsPerPage.value
  return chatLogsStore.items.slice(start, end)
})

function prevPage() {
  if (currentPage.value > 1) currentPage.value--
}

function nextPage() {
  if (currentPage.value < totalPages.value) currentPage.value++
}

// State for Columns
const columns = computed(() => [
  { key: 'created_at', label: t('admin.views.chat_logs.col_datetime'), visible: true },
  { key: 'ip_address', label: t('admin.views.chat_logs.col_ip'), visible: true },
  { key: 'city', label: t('admin.views.chat_logs.col_city'), visible: false },
  { key: 'region', label: t('admin.views.chat_logs.col_region'), visible: false },
  { key: 'country', label: t('admin.views.chat_logs.col_country'), visible: true },
  { key: 'user_message', label: t('admin.views.chat_logs.col_user_msg'), visible: true },
  { key: 'ai_response', label: t('admin.views.chat_logs.col_ai_resp'), visible: true },
  { key: 'clicked_link', label: t('admin.views.chat_logs.col_link'), visible: false },
])

const activeColumns = ref([ 'created_at', 'ip_address', 'country', 'user_message', 'ai_response' ])

// Make columns reactive with v-model capability
const columnsState = ref(
  columns.value.map(col => ({ ...col, visible: activeColumns.value.includes(col.key) }))
)

const visibleColumns = computed(() => columnsState.value.filter(c => c.visible))

function isColVisible(key) {
  return columnsState.value.find(c => c.key === key)?.visible
}

onMounted(() => {
  chatLogsStore.fetchAll()
})

function refreshData() {
  chatLogsStore.fetchAll()
  currentPage.value = 1
}

function openModal(log) {
  selectedLog.value = log
  document.body.style.overflow = 'hidden'
}

function closeModal() {
  selectedLog.value = null
  document.body.style.overflow = ''
}

function formatDate(dateString) {
  if (!dateString) return ''
  const date = new Date(dateString)
  return new Intl.DateTimeFormat('es-ES', {
    dateStyle: 'short',
    timeStyle: 'medium',
  }).format(date)
}
</script>

<style scoped>
.custom-scrollbar::-webkit-scrollbar {
  width: 6px;
  height: 6px;
}
.custom-scrollbar::-webkit-scrollbar-track {
  background: transparent;
}
.custom-scrollbar::-webkit-scrollbar-thumb {
  background: hsla(var(--primary), 0.3);
  border-radius: 3px;
}
.custom-scrollbar::-webkit-scrollbar-thumb:hover {
  background: hsla(var(--primary), 0.5);
}
</style>
