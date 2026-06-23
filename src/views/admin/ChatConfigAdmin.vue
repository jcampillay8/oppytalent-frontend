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
            <h3 class="text-lg font-bold text-foreground">Estrategia y Agent Skills de la IA</h3>
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
              <div class="flex items-center justify-between border-b border-border/50 pb-3">
                <label class="text-base font-semibold text-foreground">Agent Skills (Directrices para la IA)</label>
                <div class="flex items-center gap-3">
                  <p v-if="successMsg" class="text-xs text-emerald-500 font-medium">{{ successMsg }}</p>
                  <p v-if="errorMsg" class="text-xs text-destructive font-medium">{{ errorMsg }}</p>
                  <NeonButton type="submit" glow :disabled="saving" className="py-1.5 px-4 text-sm">
                    <template #icon-left><Save :size="16" v-if="!saving" /></template>
                    <span v-if="saving" class="flex items-center gap-2">
                      <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                      {{ $t('admin.views.chat_config.saving') }}
                    </span>
                    <span v-else>{{ $t('common.save') }}</span>
                  </NeonButton>
                </div>
              </div>
              <p class="text-xs text-muted-foreground mt-1 mb-3 leading-relaxed">Entrena a tu IA. Dile qué proyecto destacar cuando un reclutador pregunte por una habilidad específica (Máx. {{ maxRules }}).</p>
              
              <div v-if="form.ai_pitch_rules.length === 0" class="text-center p-6 bg-secondary/50 border border-dashed border-border rounded-xl">
                <p class="text-sm text-muted-foreground">No tienes Agent Skills configurados. La IA usará su criterio predeterminado.</p>
              </div>

              <div v-for="(rule, idx) in form.ai_pitch_rules" :key="idx" class="relative p-4 bg-background hover:bg-secondary/20 transition-colors border border-border rounded-xl flex flex-col sm:flex-row sm:items-center justify-between gap-4 group" v-motion="{ initial: { opacity: 0, y: 10 }, enter: { opacity: 1, y: 0 } }">
                <div class="flex-1 min-w-0">
                  <div class="flex items-center gap-2 mb-1">
                    <Badge variant="primary" class="shrink-0 text-[10px]">Si preguntan sobre:</Badge>
                    <span class="font-bold text-foreground truncate">{{ rule.keyword || 'Sin condición' }}</span>
                  </div>
                  <p class="text-sm text-muted-foreground line-clamp-2 mt-2">{{ rule.pitch || 'Sin argumento definido' }}</p>
                  <div v-if="rule.call_to_action && rule.call_to_action !== '#'" class="mt-2 text-xs text-primary flex items-center gap-1">
                    <LinkIcon :size="12" /> Enlaza a: {{ getLinkName(rule.call_to_action) }}
                  </div>
                </div>
                <div class="flex items-center gap-2 shrink-0">
                  <button type="button" @click="editPitchRule(idx)" class="p-2 text-muted-foreground hover:text-primary transition-colors bg-secondary/50 hover:bg-secondary rounded-lg" title="Editar Skill">
                    <Edit2 :size="16" />
                  </button>
                  <button type="button" @click="removePitchRule(idx)" class="p-2 text-muted-foreground hover:text-destructive transition-colors bg-secondary/50 hover:bg-secondary rounded-lg" title="Eliminar Skill">
                    <Trash2 :size="16" />
                  </button>
                </div>
              </div>
            </div>

            <div class="pt-4 border-t border-border/50 flex flex-col items-center gap-2">
              <NeonButton type="button" @click="addPitchRule" :disabled="form.ai_pitch_rules.length >= maxRules" variant="outline" className="w-full sm:w-auto">
                <template #icon-left><Plus :size="16" /></template>
                Agregar Skill
              </NeonButton>
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

      <!-- Modal Editar/Crear Skill -->
      <div v-if="showSkillModal" class="fixed inset-0 z-50 flex items-center justify-center p-4 bg-background/80 backdrop-blur-sm">
        <div 
          v-motion
          :initial="{ opacity: 0, scale: 0.95, y: 20 }"
          :enter="{ opacity: 1, scale: 1, y: 0 }"
          class="w-full max-w-4xl"
        >
          <GlassCard class="relative shadow-2xl border-primary/20">
            <button type="button" @click="closeSkillModal" class="absolute top-4 right-4 text-muted-foreground hover:text-foreground">
              <X :size="20" />
            </button>
            <h2 class="text-xl font-bold mb-1">{{ editingSkillIndex >= 0 ? 'Editar Agent Skill' : 'Nuevo Agent Skill' }}</h2>
            <p class="text-sm text-muted-foreground mb-6">Instruye a tu IA con formato Markdown para destacar tus mejores atributos.</p>
            
            <div class="space-y-5">
              <div class="space-y-1">
                <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Condición (Si preguntan sobre...)</label>
                <input type="text" v-model="editingSkill.keyword" placeholder="Ej: IoT, Monitoreo, Liderazgo" class="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50" />
              </div>
              
              <div class="space-y-1">
                <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Enlace (Invitar a ver...)</label>
                <select v-model="editingSkill.call_to_action" class="w-full px-4 py-2 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50">
                  <option value="#" class="bg-background text-foreground">-- Sin enlace --</option>
                  <optgroup label="Proyectos" class="bg-background text-muted-foreground font-semibold">
                    <option v-for="p in proyectosStore.items" :key="'p'+p.id" :value="`/proyecto/${p.id}`" class="bg-background text-foreground">{{ p.titulo }}</option>
                  </optgroup>
                  <optgroup label="Experiencias" class="bg-background text-muted-foreground font-semibold">
                    <option v-for="e in experienciasStore.items" :key="'e'+e.id" :value="`/experiencia/${e.id}`" class="bg-background text-foreground">{{ e.empresa }}</option>
                  </optgroup>
                  <optgroup label="Estudios & Certificaciones" class="bg-background text-muted-foreground font-semibold">
                    <option v-for="s in estudiosStore.items" :key="'s'+s.id" :value="`/estudios/${s.id}`" class="bg-background text-foreground">{{ s.institucion }} - {{ s.titulo }}</option>
                  </optgroup>
                  <optgroup label="Reconocimientos" class="bg-background text-muted-foreground font-semibold">
                    <option v-for="r in reconocimientosStore.items" :key="'r'+r.id" :value="`/portafolio`" class="bg-background text-foreground">{{ r.titulo }}</option>
                  </optgroup>
                  <optgroup label="Habilitaciones" class="bg-background text-muted-foreground font-semibold">
                    <option v-for="h in habilitacionesStore.items" :key="'h'+h.id" :value="`/portafolio`" class="bg-background text-foreground">{{ h.titulo }}</option>
                  </optgroup>
                  <optgroup label="Sobre Mí" class="bg-background text-muted-foreground font-semibold">
                    <option value="/sobre-mi" class="bg-background text-foreground">Ver perfil / Sobre mí</option>
                  </optgroup>
                </select>
              </div>

              <div class="space-y-1">
                <div class="flex items-center justify-between">
                  <label class="text-xs font-semibold text-muted-foreground uppercase tracking-wider">Acción (La IA argumentará que...)</label>
                  <Badge variant="secondary" class="text-[10px]">Markdown mejora la precisión</Badge>
                </div>
                <textarea v-model="editingSkill.pitch" rows="6" placeholder="Ej: **Destaca que tengo experiencia con ESP32** y que el proyecto *FastAlert* es el mejor ejemplo..." class="w-full px-4 py-3 bg-secondary border border-border rounded-lg text-sm text-foreground focus:outline-none focus:ring-1 focus:ring-primary/50 resize-y font-mono"></textarea>
                <p class="text-[10px] text-muted-foreground mt-1">Usa asteriscos para **negritas** o *cursivas*, y guiones para viñetas.</p>
              </div>
            </div>

            <div class="flex justify-end gap-3 mt-6 pt-4 border-t border-border/50">
              <NeonButton type="button" variant="ghost" @click="closeSkillModal">
                Cancelar
              </NeonButton>
              <NeonButton type="button" glow @click="saveSkillModal">
                Guardar Skill
              </NeonButton>
            </div>
          </GlassCard>
        </div>
      </div>

    </AdminLayout>
  
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import GlassCard from '../../components/ui/GlassCard.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { Bot, KeyRound, MessageSquare, Save, CheckCircle2, AlertCircle, X, Globe, Plus, Edit2, Trash2, Link as LinkIcon } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { useProyectosStore } from '../../stores/proyectos'
import { useExperienciasStore } from '../../stores/experiencias'
import { useEstudiosStore } from '../../stores/estudios'
import { useReconocimientosStore } from '../../stores/reconocimientos'
import { useHabilitacionesStore } from '../../stores/habilitaciones'
import { useI18n } from 'vue-i18n'

const authStore = useAuthStore()
const { t } = useI18n()

const proyectosStore = useProyectosStore()
const experienciasStore = useExperienciasStore()
const estudiosStore = useEstudiosStore()
const reconocimientosStore = useReconocimientosStore()
const habilitacionesStore = useHabilitacionesStore()

const form = ref({
  chat_welcome_message: '',
  ai_pitch_rules: []
})

const b2bVisible = ref(false)
const b2bSaving = ref(false)

const maxRules = computed(() => authStore.user?.is_premium ? 10 : 5)

const showSkillModal = ref(false)
const editingSkillIndex = ref(-1)
const editingSkill = ref({ keyword: '', pitch: '', call_to_action: '#' })

function addPitchRule() {
  if (form.value.ai_pitch_rules.length < maxRules.value) {
    editingSkillIndex.value = -1
    editingSkill.value = { keyword: '', pitch: '', call_to_action: '#' }
    showSkillModal.value = true
  }
}

function editPitchRule(idx) {
  editingSkillIndex.value = idx
  editingSkill.value = { ...form.value.ai_pitch_rules[idx] }
  showSkillModal.value = true
}

function closeSkillModal() {
  showSkillModal.value = false
}

async function removePitchRule(idx) {
  form.value.ai_pitch_rules.splice(idx, 1)
  await saveConfig()
}

async function saveSkillModal() {
  if (!editingSkill.value.keyword || !editingSkill.value.pitch) {
    // Si falta condición o pitch, no guardamos para evitar vacíos
    return
  }
  if (editingSkillIndex.value >= 0) {
    form.value.ai_pitch_rules[editingSkillIndex.value] = { ...editingSkill.value }
  } else {
    form.value.ai_pitch_rules.push({ ...editingSkill.value })
  }
  closeSkillModal()
  await saveConfig()
}

function getLinkName(val) {
  if (!val || val === '#') return ''
  if (val === '/sobre-mi') return 'Sobre Mí'
  if (val === '/portafolio') return 'Portafolio General'
  if (val.startsWith('/proyecto/')) {
    const id = val.split('/')[2]
    return proyectosStore.items.find(p => p.id == id)?.titulo || 'Proyecto'
  }
  if (val.startsWith('/experiencia/')) {
    const id = val.split('/')[2]
    return experienciasStore.items.find(e => e.id == id)?.empresa || 'Experiencia'
  }
  if (val.startsWith('/estudios/')) {
    const id = val.split('/')[2]
    return estudiosStore.items.find(s => s.id == id)?.titulo || 'Estudio'
  }
  return val
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
      if (!estudiosStore.items.length) await estudiosStore.fetchAll(`?username=${user}`)
      if (!reconocimientosStore.items.length) await reconocimientosStore.fetchAll(`?username=${user}`)
      if (!habilitacionesStore.items.length) await habilitacionesStore.fetchAll(`?username=${user}`)
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
