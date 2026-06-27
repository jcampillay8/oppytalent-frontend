<template>
  <AdminLayout>
    <div class="max-w-4xl mx-auto pb-20 pt-8 px-4 sm:px-8">
      <!-- Header -->
      <div class="mb-10">
        <h1 class="text-3xl sm:text-4xl font-extrabold tracking-tight flex items-center gap-3">
          <Share2 class="text-primary" :size="36" />
          Compartir Perfil
        </h1>
        <p class="text-muted-foreground mt-2">Difunde tu IA y portafolio con reclutadores y contactos.</p>
      </div>

      <div class="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        <!-- Enlace y Redes -->
        <div class="bg-card border border-border rounded-2xl p-6 shadow-sm">
          <h2 class="text-xl font-bold flex items-center gap-2 mb-4">
            <LinkIcon class="text-primary" :size="20" /> Tu Enlace Público
          </h2>
          <div class="flex items-center gap-2 mb-6">
            <div class="bg-secondary flex-1 px-4 py-3 rounded-xl border border-border text-sm font-medium overflow-hidden text-ellipsis whitespace-nowrap">
              {{ profileUrl }}
            </div>
            <button @click="copyLink" class="bg-primary text-primary-foreground p-3 rounded-xl hover:bg-primary/90 transition-colors" title="Copiar enlace">
              <Copy v-if="!copied" :size="20" />
              <Check v-else :size="20" />
            </button>
          </div>

          <h3 class="text-sm font-bold text-muted-foreground uppercase tracking-wider mb-3">Compartir en Redes</h3>
          <div class="grid grid-cols-2 gap-3">
            <button @click="shareLinkedIn" class="flex items-center justify-center gap-2 bg-[#0077b5] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#005582] transition-colors">
              <Linkedin :size="18" /> LinkedIn
            </button>
            <button @click="shareWhatsApp" class="flex items-center justify-center gap-2 bg-[#25D366] text-white px-4 py-3 rounded-xl font-bold hover:bg-[#1da851] transition-colors">
              <MessageCircle :size="18" /> WhatsApp
            </button>
          </div>
        </div>

        <!-- Generador de Código QR -->
        <div class="bg-card border border-border rounded-2xl p-6 shadow-sm flex flex-col items-center text-center">
          <h2 class="text-xl font-bold flex items-center gap-2 mb-2">
            <QrCode class="text-primary" :size="20" /> Código QR
          </h2>
          <p class="text-sm text-muted-foreground mb-6">Escanea para abrir tu portafolio. Ideal para imprimir en tu CV físico.</p>
          
          <div class="bg-white p-4 rounded-xl border border-border/50 shadow-inner mb-4 inline-block" id="qr-container">
            <qrcode-vue :value="profileUrl" :size="150" level="H" foreground="#000000" />
          </div>
          <button @click="downloadQR" class="flex items-center justify-center gap-2 border border-border bg-secondary hover:bg-secondary/80 px-6 py-2.5 rounded-xl font-medium transition-colors text-sm">
            <Download :size="16" /> Descargar QR
          </button>
        </div>

        <!-- Firma de Correo -->
        <div class="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2">
          <h2 class="text-xl font-bold flex items-center gap-2 mb-4">
            <Mail class="text-primary" :size="20" /> Firma de Correo Electrónico
          </h2>
          <p class="text-sm text-muted-foreground mb-4">Copia esta firma y pégala en Gmail, Outlook o Apple Mail.</p>
          
          <div class="border border-border rounded-xl overflow-hidden mb-4 bg-background">
            <div ref="signatureRef" class="p-5 flex items-center gap-4" style="font-family: Arial, sans-serif; color: #333; background: #fff;">
              <img v-if="userAvatar" :src="userAvatar" alt="Avatar" style="width: 50px; height: 50px; border-radius: 50%; object-fit: cover;" />
              <div v-else style="width: 50px; height: 50px; border-radius: 50%; background: #f0f0f0; display: flex; align-items: center; justify-content: center; font-size: 20px; font-weight: bold; color: #666;">
                {{ userFullName ? userFullName[0].toUpperCase() : 'U' }}
              </div>
              <div>
                <p style="margin: 0; font-size: 14px; font-weight: bold; color: #111;">{{ userFullName }}</p>
                <p style="margin: 2px 0 2px 0; font-size: 12px; color: #666;">{{ occupation }}</p>
                <p v-if="userPhone" style="margin: 0 0 6px 0; font-size: 12px; color: #666;">{{ userPhone }}</p>
                <a :href="profileUrl" style="display: inline-block; text-decoration: none; background: #3b82f6; color: white; padding: 4px 10px; border-radius: 4px; font-size: 11px; font-weight: bold;">
                  🗣️ Habla con mi Asistente IA
                </a>
              </div>
            </div>
          </div>
          
          <button @click="copySignature" class="flex items-center justify-center gap-2 bg-primary/10 text-primary hover:bg-primary/20 px-6 py-2.5 rounded-xl font-bold transition-colors text-sm w-full sm:w-auto">
            <Copy v-if="!signatureCopied" :size="16" />
            <Check v-else :size="16" />
            {{ signatureCopied ? '¡Firma Copiada!' : 'Copiar Firma HTML' }}
          </button>
        </div>

        <!-- Custom Slug (Premium) -->
        <div class="bg-card border border-border rounded-2xl p-6 shadow-sm lg:col-span-2 relative overflow-hidden group">
          <!-- Premium Overlay -->
          <div v-if="!isPremium" class="absolute inset-0 bg-background/60 backdrop-blur-[2px] z-10 flex flex-col items-center justify-center transition-all">
            <div class="bg-card border border-border/80 shadow-lg p-6 rounded-2xl flex flex-col items-center text-center max-w-sm">
              <div class="w-12 h-12 bg-amber-500/10 rounded-full flex items-center justify-center mb-3 text-amber-500">
                <Lock :size="24" />
              </div>
              <h3 class="font-bold text-lg mb-1">Personaliza tu Enlace</h3>
              <p class="text-sm text-muted-foreground mb-4">Mejora a un plan Premium para cambiar tu enlace público por uno más profesional y fácil de recordar.</p>
              <button class="w-full bg-primary text-primary-foreground py-2.5 rounded-xl font-bold text-sm shadow-sm hover:shadow-primary/25 transition-all">
                Ver Planes Premium
              </button>
            </div>
          </div>

          <div :class="{ 'opacity-40 select-none': !isPremium }">
            <h2 class="text-xl font-bold flex items-center gap-2 mb-2">
              <PenTool class="text-primary" :size="20" /> Personalizar Slug
            </h2>
            <p class="text-sm text-muted-foreground mb-6">
              El <strong>Slug</strong> es el texto final de tu enlace (ej: <span class="bg-secondary px-1 py-0.5 rounded text-xs">/juan-perez</span>). Hazlo único.
            </p>

            <div class="flex flex-col gap-2">
              <div class="flex items-center gap-2">
                <span class="text-muted-foreground font-medium shrink-0">oppytalent.com/</span>
                <input 
                  type="text" 
                  v-model="customSlug" 
                  placeholder="tu-nombre" 
                  :disabled="!isPremium"
                  class="flex-1 bg-secondary border border-border rounded-xl px-4 py-2 focus:outline-none focus:ring-2 focus:ring-primary/50 text-foreground"
                />
                <button :disabled="!isPremium || !customSlug" @click="saveSlug" class="bg-primary text-primary-foreground px-6 py-2 rounded-xl font-bold hover:bg-primary/90 transition-colors disabled:opacity-50 flex gap-2 items-center">
                  <Check v-if="savingSlugSuccess" :size="16" />
                  Guardar
                </button>
              </div>
              <p v-if="slugError" class="text-red-500 text-sm mt-1">{{ slugError }}</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue'
import { Share2, Link as LinkIcon, Copy, Check, Linkedin, MessageCircle, QrCode, Download, Mail, Lock, PenTool } from 'lucide-vue-next'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import { useAuthStore } from '../../stores/auth'
import QrcodeVue from 'qrcode.vue'
import { api } from '../../services/api'

const authStore = useAuthStore()

const profileUrl = computed(() => {
  const host = window.location.origin
  const slug = authStore.user?.custom_slug || (authStore.user?.username ? authStore.user.username.split('@')[0] : '')
  return `${host}/${slug}`
})

const copied = ref(false)
const signatureCopied = ref(false)
const signatureRef = ref(null)
const customSlug = ref(authStore.user?.custom_slug || '')
const occupation = ref('Profesional')
const userFullName = ref(authStore.user?.first_name ? `${authStore.user.first_name} ${authStore.user.last_name || ''}` : (authStore.user?.username?.split('@')[0] || ''))
const userAvatar = ref(authStore.user?.user_image || '')
const userPhone = ref('')
const slugError = ref('')
const savingSlugSuccess = ref(false)

const isPremium = computed(() => {
  // Allow for now if they have can_edit_portfolio, but normally we check a specific premium role/permission
  return authStore.user?.role_name?.toUpperCase() === 'OWNER' || authStore.user?.permissions?.includes('can_edit_slug') || false
})

onMounted(async () => {
  if (authStore.user?.username) {
    try {
      const perfs = await api.getPerfil()
      if (perfs && perfs.length > 0) {
        if (perfs[0].ocupacion) occupation.value = perfs[0].ocupacion
        if (perfs[0].nombre_completo) userFullName.value = perfs[0].nombre_completo
        if (perfs[0].avatar_url) userAvatar.value = perfs[0].avatar_url
        if (perfs[0].telefono) userPhone.value = perfs[0].telefono
      }
    } catch (e) {}
  }
})

function copyLink() {
  navigator.clipboard.writeText(profileUrl.value)
  copied.value = true
  setTimeout(() => { copied.value = false }, 2000)
}

function shareLinkedIn() {
  const url = encodeURIComponent(profileUrl.value)
  window.open(`https://www.linkedin.com/sharing/share-offsite/?url=${url}`, '_blank')
}

function shareWhatsApp() {
  const text = encodeURIComponent(`¡Hola! Te invito a interactuar con mi asistente de IA profesional en OppyTalent para que conozcas más de mi perfil: ${profileUrl.value}`)
  window.open(`https://wa.me/?text=${text}`, '_blank')
}

function downloadQR() {
  const canvas = document.querySelector('#qr-container canvas')
  if (!canvas) return
  const url = canvas.toDataURL('image/png')
  const link = document.createElement('a')
  link.download = `oppytalent_qr_${authStore.user?.username?.split('@')[0]}.png`
  link.href = url
  link.click()
}

function copySignature() {
  if (!signatureRef.value) return
  
  const range = document.createRange()
  range.selectNodeContents(signatureRef.value)
  const selection = window.getSelection()
  selection.removeAllRanges()
  selection.addRange(range)
  
  try {
    document.execCommand('copy')
    signatureCopied.value = true
    setTimeout(() => { signatureCopied.value = false }, 2000)
  } catch (err) {
    console.error('No se pudo copiar la firma HTML', err)
  }
  
  selection.removeAllRanges()
}

async function saveSlug() {
  if (!isPremium.value || !customSlug.value.trim()) return
  slugError.value = ''
  savingSlugSuccess.value = false
  
  try {
    await api.updateCustomSlug(customSlug.value)
    savingSlugSuccess.value = true
    // Update local user state
    if (authStore.user) {
      authStore.user.custom_slug = customSlug.value
    }
    setTimeout(() => { savingSlugSuccess.value = false }, 3000)
  } catch (err) {
    console.error('Error al guardar el slug:', err)
    slugError.value = err.response?.data?.detail || 'Error al guardar el Slug. Es posible que ya esté en uso.'
  }
}
</script>
