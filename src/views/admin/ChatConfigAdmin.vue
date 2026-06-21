<template>
  
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Bot :size="32" class="text-primary" /> {{ $t('admin.views.chat_config.title') }}
        </h1>
        <p class="text-muted-foreground mt-1">{{ $t('admin.views.chat_config.description') }}</p>
      </div>

      <div class="grid grid-cols-1 gap-6">

        <!-- Configuración de Chat -->
        <GlassCard>
          <div class="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
            <MessageSquare :size="20" class="text-primary" />
            <h3 class="text-lg font-bold text-foreground">{{ $t('admin.views.chat_config.appearance_section') }}</h3>
          </div>
          
          <form @submit.prevent="saveConfig" class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">{{ $t('admin.views.chat_config.welcome_msg') }}</label>
              <textarea
                v-model="form.chat_welcome_message"
                class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                rows="3"
                :placeholder="$t('admin.views.chat_config.welcome_placeholder')"
              ></textarea>
            </div>

            <div class="space-y-4">
              <div class="flex items-center justify-between border-b border-border/50 pb-2">
                <label class="text-sm font-medium text-foreground">Torpedos de Venta (Directrices para la IA)</label>
                <button type="button" @click="addPitchRule" :disabled="form.ai_pitch_rules.length >= 5" class="text-xs text-primary hover:underline font-medium disabled:opacity-50 disabled:cursor-not-allowed">
                  + Agregar Torpedo
                </button>
              </div>
              <p class="text-xs text-muted-foreground mt-1 mb-3 leading-relaxed">Entrena a tu IA. Dile qué proyecto destacar cuando un reclutador pregunte por una habilidad específica (Máx. 5).</p>
              
              <div v-if="form.ai_pitch_rules.length === 0" class="text-center p-6 bg-secondary/50 border border-dashed border-border rounded-xl">
                <p class="text-sm text-muted-foreground">No tienes torpedos configurados. La IA usará su criterio predeterminado.</p>
              </div>

              <div v-for="(rule, idx) in form.ai_pitch_rules" :key="idx" class="relative p-4 bg-background border border-border rounded-xl space-y-3" v-motion="{ initial: { opacity: 0, y: 10 }, enter: { opacity: 1, y: 0 } }">
                <button type="button" @click="removePitchRule(idx)" class="absolute top-3 right-3 text-muted-foreground hover:text-destructive transition-colors">
                  <X :size="16" />
                </button>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condición (Si preguntan sobre...)</label>
                  <input type="text" v-model="rule.keyword" placeholder="Ej: IoT, Monitoreo, Liderazgo" class="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50" />
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acción (La IA argumentará que...)</label>
                  <textarea v-model="rule.pitch" rows="2" placeholder="Ej: Destaca que tengo experiencia con ESP32 y que el proyecto FastAlert es el mejor ejemplo..." class="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y"></textarea>
                </div>
                <div class="space-y-1">
                  <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enlace (Invitar a ver...)</label>
                  <select v-model="rule.call_to_action" class="w-full px-3 py-2 bg-secondary border border-border rounded-lg text-sm focus:outline-none focus:ring-1 focus:ring-primary/50">
                    <option value="#">-- Sin enlace --</option>
                    <optgroup label="Proyectos">
                      <option v-for="p in proyectosStore.items" :key="'p'+p.id" :value="`/proyecto/${p.id}`">{{ p.title }}</option>
                    </optgroup>
                    <optgroup label="Experiencias">
                      <option v-for="e in experienciasStore.items" :key="'e'+e.id" :value="`/experiencia/${e.id}`">{{ e.company }}</option>
                    </optgroup>
                  </select>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-border/50 flex flex-col items-end gap-2">
              <NeonButton type="submit" glow :disabled="saving">
                <template #icon-left><Save :size="16" v-if="!saving" /></template>
                <span v-if="saving" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  {{ $t('admin.views.chat_config.saving') }}
                </span>
                <span v-else>{{ $t('common.save') }}</span>
              </NeonButton>
              <p v-if="successMsg" class="text-xs text-emerald-500 font-medium">{{ successMsg }}</p>
              <p v-if="errorMsg" class="text-xs text-destructive font-medium">{{ errorMsg }}</p>
            </div>
          </form>
        </GlassCard>

        <!-- Configuración de Privacidad B2B -->
        <GlassCard>
          <div class="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
            <Globe :size="20" class="text-primary" />
            <h3 class="text-lg font-bold text-foreground">Visibilidad B2B (Meta-Reclutador)</h3>
            <Badge variant="primary" class="ml-auto">Premium</Badge>
          </div>
          
          <div class="flex items-start gap-4">
            <div class="flex-1">
              <h4 class="text-md font-semibold text-foreground">Permitir que las empresas me encuentren</h4>
              <p class="text-sm text-muted-foreground mt-1 leading-relaxed">
                Al activar esto, tu perfil ("Clon Digital") será indexado en el Meta-Buscador privado de empresas de OppyTalent. Los Headhunters podrán encontrarte automáticamente según tus habilidades y experiencia, e invitar a tu IA al "Tribunal de IAs" para pre-evaluación.
              </p>
            </div>
            <div class="flex items-center">
              <label class="relative inline-flex items-center cursor-pointer">
                <input type="checkbox" v-model="b2bVisible" @change="saveB2bConfig" class="sr-only peer">
                <div class="w-11 h-6 bg-secondary border border-border peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              </label>
            </div>
          </div>
          <div v-if="b2bSaving" class="text-xs text-primary mt-2 flex items-center gap-2">
            <div class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
            Guardando preferencia...
          </div>
        </GlassCard>

      </div>
    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Bot, KeyRound, MessageSquare, Save, CheckCircle2, AlertCircle, X, Globe } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()

const form = ref({
  chat_welcome_message: '',
  ai_pitch_rules: []
})

const b2bVisible = ref(false)
const b2bSaving = ref(false)

function addPitchRule() {
  if (form.value.ai_pitch_rules.length < 5) {
    form.value.ai_pitch_rules.push({ keyword: '', pitch: '', call_to_action: '#' })
  }
}

function removePitchRule(idx) {
  form.value.ai_pitch_rules.splice(idx, 1)
}

const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

onMounted(async () => {
  try {
    const userProfile = await api.me()
    if (userProfile) {
      form.value.chat_welcome_message = userProfile.chat_welcome_message || ''
      form.value.ai_pitch_rules = userProfile.ai_pitch_rules || []
      b2bVisible.value = userProfile.is_visible_b2b || false
    }
    
    // Load projects and experiences for the dropdowns
    const user = localStorage.getItem('currentPortfolioUser') || authStore.user?.username.split('@')[0]
    if (user) {
      if (!proyectosStore.items.length) await proyectosStore.fetchAll(`?username=${user}`)
      if (!experienciasStore.items.length) await experienciasStore.fetchAll(`?username=${user}`)
    }
  } catch (err) {
    console.error('Error loading chat config:', err)
  }
})

async function saveConfig() {
  saving.value = true
  successMsg.value = ''
  errorMsg.value = ''
  
  try {
    // Validate rules to avoid saving empty objects
    const validRules = form.value.ai_pitch_rules.filter(r => r.keyword && r.pitch)
    
    await api.updateChatConfig({
      chat_welcome_message: form.value.chat_welcome_message || null,
      ai_pitch_rules: validRules
    })
    // Update local state to reflect what was saved
    form.value.ai_pitch_rules = validRules
    successMsg.value = t('admin.views.chat_config.success_msg')
    setTimeout(() => successMsg.value = '', 3000)
  } catch (err) {
    errorMsg.value = t('admin.views.chat_config.error_msg')
  } finally {
    saving.value = false
  }
}

async function saveB2bConfig() {
  b2bSaving.value = true
  try {
    await api.updateB2bConfig({
      is_visible_b2b: b2bVisible.value
    })
  } catch (err) {
    console.error('Error saving B2B config:', err)
    // Revert visually if failed
    b2bVisible.value = !b2bVisible.value
  } finally {
    b2bSaving.value = false
  }
}
</script>
