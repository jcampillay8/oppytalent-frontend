<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-50 flex justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-primary/30">
    <!-- Efectos de Fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[60vw] h-[60vw] rounded-full bg-[radial-gradient(circle,rgba(139,92,246,0.15)_0%,transparent_70%)] blur-[80px]"></div>
    </div>
    
    <div class="w-full max-w-[480px] relative z-10 animate-in fade-in zoom-in-95 duration-500 my-8">
      <div class="bg-zinc-900/70 border border-white/10 rounded-[24px] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 md:p-10">
        
        <div class="text-center mb-10">
          <router-link to="/" class="inline-block text-2xl font-extrabold tracking-tight mb-6">Oppy<span class="text-primary">Talent</span></router-link>
          <h2 class="text-2xl font-bold text-white mb-2">Crea tu cuenta</h2>
          <p class="text-zinc-400 text-sm">Únete a la plataforma del talento</p>
        </div>

        <form @submit.prevent="handleRegister" class="space-y-5">
          
          <div class="flex flex-col sm:flex-row gap-5">
            <div class="space-y-1.5 flex-1">
              <label for="first_name" class="block text-sm font-medium text-zinc-300">Nombre</label>
              <input type="text" id="first_name" v-model="form.first_name" required class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
            <div class="space-y-1.5 flex-1">
              <label for="last_name" class="block text-sm font-medium text-zinc-300">Apellido</label>
              <input type="text" id="last_name" v-model="form.last_name" required class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
            </div>
          </div>

          <div class="space-y-1.5">
            <label for="username" class="block text-sm font-medium text-zinc-300">Usuario</label>
            <input type="text" id="username" v-model="form.username" required class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div class="space-y-1.5">
            <label for="email" class="block text-sm font-medium text-zinc-300">Correo Electrónico</label>
            <input type="email" id="email" v-model="form.email" required class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="block text-sm font-medium text-zinc-300">Contraseña</label>
            <input type="password" id="password" v-model="form.password" required class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all" />
          </div>

          <div class="flex items-center gap-3 pt-2">
            <input type="checkbox" id="terms" v-model="form.terms_accepted" required class="w-4 h-4 rounded border-white/20 bg-black/20 text-primary focus:ring-primary/50 focus:ring-offset-0" />
            <label for="terms" class="text-sm text-zinc-400 select-none">Acepto los términos y condiciones</label>
          </div>

          <NeonButton type="submit" glow variant="primary" class="w-full h-[52px] mt-2" :disabled="loading">
            <span v-if="!loading">Registrarse</span>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </NeonButton>

          <div class="flex items-center text-center text-sm text-zinc-500 my-6">
            <div class="flex-1 border-b border-white/10"></div>
            <span class="px-4">o regístrate con</span>
            <div class="flex-1 border-b border-white/10"></div>
          </div>

          <button type="button" @click="handleGoogleAuth" class="w-full flex justify-center items-center gap-3 px-4 py-3 bg-white/5 hover:bg-white/10 border border-white/10 hover:border-white/20 rounded-xl text-white font-medium transition-all">
            <svg class="w-5 h-5" viewBox="0 0 24 24">
              <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
              <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
              <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
              <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
              <path d="M1 1h22v22H1z" fill="none"/>
            </svg>
            Google
          </button>
        </form>

        <div class="mt-8 text-center text-sm text-zinc-400">
          <p>¿Ya tienes cuenta? <router-link to="/login" class="text-primary hover:text-primary/80 font-semibold ml-1">Inicia Sesión</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { toast } from 'vue3-toastify'
import NeonButton from '../../components/ui/NeonButton.vue'

const router = useRouter()
const route = useRoute()
const loading = ref(false)
const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  terms_accepted: false,
  referral_code: ''
})

onMounted(() => {
  if (route.query.ref) {
    form.value.referral_code = route.query.ref
  }
})

function handleGoogleAuth() {
  window.location.href = '/api/v1/auth/google/login'
}

async function handleRegister() {
  loading.value = true
  try {
    const formData = new FormData()
    formData.append('first_name', form.value.first_name)
    formData.append('last_name', form.value.last_name)
    formData.append('username', form.value.username)
    formData.append('email', form.value.email)
    formData.append('password', form.value.password)
    formData.append('terms_accepted', form.value.terms_accepted)
    if (form.value.referral_code) {
      formData.append('referral_code', form.value.referral_code)
    }

    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error en el registro')
    }
    
    toast.success('Registro exitoso. Serás redirigido para iniciar sesión.')
    router.push('/login')
  } catch (error) {
    toast.error(error.message)
  } finally {
    loading.value = false
  }
}
</script>
