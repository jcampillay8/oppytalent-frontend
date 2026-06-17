<template>
  <div class="min-h-screen bg-[#09090b] text-zinc-50 flex justify-center items-center p-6 relative overflow-hidden font-sans selection:bg-primary/30">
    <!-- Efectos de Fondo -->
    <div class="absolute inset-0 z-0 pointer-events-none overflow-hidden">
      <div class="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[50vw] h-[50vw] rounded-full bg-[radial-gradient(circle,rgba(59,130,246,0.15)_0%,transparent_70%)] blur-[80px]"></div>
    </div>
    
    <div class="w-full max-w-md relative z-10 animate-in fade-in zoom-in-95 duration-500">
      <div class="bg-zinc-900/70 border border-white/10 rounded-[24px] backdrop-blur-2xl shadow-[0_25px_50px_-12px_rgba(0,0,0,0.5)] p-8 md:p-10">
        
        <div class="text-center mb-10">
          <router-link to="/" class="inline-block text-2xl font-extrabold tracking-tight mb-6">Oppy<span class="text-primary">Talent</span></router-link>
          <h2 class="text-2xl font-bold text-white mb-2">Bienvenido de nuevo</h2>
          <p class="text-zinc-400 text-sm">Inicia sesión para continuar a tu cuenta</p>
        </div>

        <form @submit.prevent="handleLogin" class="space-y-5">
          <div class="space-y-1.5">
            <label for="username" class="block text-sm font-medium text-zinc-300">Usuario o Correo</label>
            <input 
              type="text" 
              id="username" 
              v-model="form.username" 
              placeholder="Ingresa tu usuario" 
              required 
              class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div class="space-y-1.5">
            <label for="password" class="block text-sm font-medium text-zinc-300">Contraseña</label>
            <input 
              type="password" 
              id="password" 
              v-model="form.password" 
              placeholder="••••••••" 
              required 
              class="w-full px-4 py-3 bg-black/20 border border-white/10 rounded-xl text-white text-sm placeholder:text-zinc-600 focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all"
            />
          </div>

          <div class="flex justify-end pt-1">
            <a href="#" class="text-sm font-medium text-primary hover:text-primary/80 transition-colors">¿Olvidaste tu contraseña?</a>
          </div>

          <NeonButton type="submit" glow variant="primary" class="w-full h-[52px]" :disabled="loading">
            <span v-if="!loading">Iniciar Sesión</span>
            <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </NeonButton>

          <div class="flex items-center text-center text-sm text-zinc-500 my-6">
            <div class="flex-1 border-b border-white/10"></div>
            <span class="px-4">o inicia con</span>
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
          <p>¿No tienes una cuenta? <router-link to="/register" class="text-primary hover:text-primary/80 font-semibold ml-1">Regístrate</router-link></p>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import NeonButton from '../../components/ui/NeonButton.vue'

const router = useRouter()
const loading = ref(false)
const form = ref({
  username: '',
  password: ''
})

function handleGoogleAuth() {
  window.location.href = '/api/v1/auth/google/login'
}

async function handleLogin() {
  loading.value = true
  try {
    const formData = new URLSearchParams()
    formData.append('username', form.value.username)
    formData.append('password', form.value.password)

    const response = await fetch('/api/v1/auth/login', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/x-www-form-urlencoded',
      },
      body: formData.toString()
    })
    
    if (!response.ok) throw new Error('Credenciales inválidas')
    
    const data = await response.json()
    const newToken = data.accessToken || data.access_token
    localStorage.setItem('token', newToken)
    
    const authStore = useAuthStore()
    authStore.token = newToken
    await authStore.fetchUser()
    
    if (authStore.user) {
      const baseUsername = authStore.user.username.split('@')[0]
      try {
        const perfilResponse = await fetch(`/api/v1/perfil/?username=${baseUsername}`)
        if (perfilResponse.ok) {
          const perfiles = await perfilResponse.json()
          if (perfiles && perfiles.length > 0) {
            router.push(`/${baseUsername}`)
          } else {
            router.push(`/${baseUsername}/dashboard`)
          }
        } else {
          router.push(`/${baseUsername}/dashboard`)
        }
      } catch (e) {
        router.push(`/${baseUsername}/dashboard`)
      }
    } else {
      router.push('/home')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>
