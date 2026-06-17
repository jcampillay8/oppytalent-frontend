<template>
  
    <AdminLayout>
      <div class="mb-8">
        <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
          <Bot :size="32" class="text-primary" /> Configuración del Chatbot
        </h1>
        <p class="text-muted-foreground mt-1">Personaliza el comportamiento y respuestas de tu asistente virtual.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
        
        <!-- Configuración AI API Key -->
        <GlassCard>
          <div class="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
            <KeyRound :size="20" class="text-primary" />
            <h3 class="text-lg font-bold text-foreground">Inteligencia Artificial</h3>
          </div>
          <p class="text-sm text-muted-foreground mb-6 leading-relaxed">
            Tu portafolio utiliza <strong>Gemini 1.5 Flash</strong> para traducciones y el chatbot. Tienes <Badge variant="secondary" class="mx-1">{{ authStore.user?.ai_credits }} créditos gratuitos</Badge>. Si ingresas tu propia API Key (gratuita en Google AI Studio), tus llamadas serán ilimitadas.
          </p>
          
          <div class="space-y-2">
            <label class="text-sm font-medium text-foreground">Tu Google Gemini API Key</label>
            <div class="flex gap-2">
              <input
                type="password"
                v-model="geminiKeyForm"
                class="flex-1 px-4 py-2 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all font-mono text-sm"
                :placeholder="authStore.user?.has_gemini_key ? '•••••••••••••••••••••••• (Guardada)' : 'Pega tu API Key de Google Studio'"
              />
              <NeonButton @click="saveGeminiKey" :disabled="savingKey" variant="outline" class="shrink-0">
                <span v-if="savingKey" class="flex items-center gap-2">
                  <div class="w-3 h-3 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
                </span>
                <span v-else>Validar y Guardar</span>
              </NeonButton>
            </div>
            <p v-if="keySuccessMsg" class="text-xs text-emerald-500 mt-2 flex items-center gap-1"><CheckCircle2 :size="12" /> {{ keySuccessMsg }}</p>
            <p v-if="keyErrorMsg" class="text-xs text-destructive mt-2 flex items-center gap-1"><AlertCircle :size="12" /> {{ keyErrorMsg }}</p>
          </div>
        </GlassCard>

        <!-- Configuración de Chat -->
        <GlassCard>
          <div class="flex items-center gap-3 mb-4 pb-4 border-b border-border/50">
            <MessageSquare :size="20" class="text-primary" />
            <h3 class="text-lg font-bold text-foreground">Apariencia y Sugerencias</h3>
          </div>
          
          <form @submit.prevent="saveConfig" class="space-y-6">
            <div class="space-y-2">
              <label class="text-sm font-medium text-foreground">Mensaje Inicial</label>
              <textarea
                v-model="form.chat_welcome_message"
                class="w-full px-4 py-3 bg-secondary border border-border rounded-xl text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all resize-y"
                rows="3"
                placeholder="Ej: ¡Hola! Soy el asistente virtual de Sofia. Estoy aquí para ayudarte..."
              ></textarea>
            </div>

            <div class="space-y-4">
              <label class="text-sm font-medium text-foreground block border-b border-border/50 pb-2">Preguntas Rápidas Sugeridas (Chips)</label>
              
              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-muted-foreground text-xs font-bold">Q1</span>
                </div>
                <input
                  type="text"
                  v-model="form.chat_suggested_q1"
                  class="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: ¿Cuáles son sus principales habilidades?"
                />
              </div>

              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-muted-foreground text-xs font-bold">Q2</span>
                </div>
                <input
                  type="text"
                  v-model="form.chat_suggested_q2"
                  class="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: ¿Qué experiencia laboral tiene?"
                />
              </div>

              <div class="relative">
                <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
                  <span class="text-muted-foreground text-xs font-bold">Q3</span>
                </div>
                <input
                  v-model="form.chat_suggested_q3"
                  class="w-full pl-10 pr-4 py-2 bg-secondary border border-border rounded-xl text-foreground text-sm focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
                  placeholder="Ej: Muéstrame su último proyecto"
                />
              </div>
            </div>

            <div class="pt-4 border-t border-border/50 flex flex-col items-end gap-2">
              <NeonButton type="submit" glow :disabled="saving">
                <template #icon-left><Save :size="16" v-if="!saving" /></template>
                <span v-if="saving" class="flex items-center gap-2">
                  <div class="w-4 h-4 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
                  Guardando...
                </span>
                <span v-else>Guardar Cambios</span>
              </NeonButton>
              <p v-if="successMsg" class="text-xs text-emerald-500 font-medium">{{ successMsg }}</p>
              <p v-if="errorMsg" class="text-xs text-destructive font-medium">{{ errorMsg }}</p>
            </div>
          </form>
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
import { Bot, KeyRound, MessageSquare, Save, CheckCircle2, AlertCircle } from 'lucide-vue-next'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'

const authStore = useAuthStore()

const form = ref({
  chat_welcome_message: '',
  chat_suggested_q1: '',
  chat_suggested_q2: '',
  chat_suggested_q3: ''
})

const saving = ref(false)
const successMsg = ref('')
const errorMsg = ref('')

const geminiKeyForm = ref('')
const savingKey = ref(false)
const keySuccessMsg = ref('')
const keyErrorMsg = ref('')

async function saveGeminiKey() {
  if (!geminiKeyForm.value) return
  savingKey.value = true
  keySuccessMsg.value = ''
  keyErrorMsg.value = ''
  
  try {
    const res = await api.updateGeminiKey(geminiKeyForm.value)
    keySuccessMsg.value = res.message
    geminiKeyForm.value = ''
    await authStore.fetchUser()
  } catch (err) {
    keyErrorMsg.value = err.detail || 'La API Key ingresada no es válida.'
  } finally {
    savingKey.value = false
  }
}

onMounted(async () => {
  try {
    const userProfile = await api.me()
    if (userProfile) {
      form.value.chat_welcome_message = userProfile.chat_welcome_message || ''
      form.value.chat_suggested_q1 = userProfile.chat_suggested_q1 || ''
      form.value.chat_suggested_q2 = userProfile.chat_suggested_q2 || ''
      form.value.chat_suggested_q3 = userProfile.chat_suggested_q3 || ''
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
    await api.updateChatConfig({
      chat_welcome_message: form.value.chat_welcome_message || null,
      chat_suggested_q1: form.value.chat_suggested_q1 || null,
      chat_suggested_q2: form.value.chat_suggested_q2 || null,
      chat_suggested_q3: form.value.chat_suggested_q3 || null,
    })
    successMsg.value = '¡Configuración guardada con éxito!'
    setTimeout(() => successMsg.value = '', 3000)
  } catch (err) {
    errorMsg.value = 'Ocurrió un error al guardar la configuración.'
  } finally {
    saving.value = false
  }
}
</script>
