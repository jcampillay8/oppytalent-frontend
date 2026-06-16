<template>
  <div class="callback-container">
    <div class="loader"></div>
    <p>Autenticando con Google...</p>
  </div>
</template>

<script setup>
import { onMounted } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { useAuthStore } from '../../stores/auth'

const router = useRouter()
const route = useRoute()
const authStore = useAuthStore()

onMounted(async () => {
  const token = route.query.token
  if (token) {
    localStorage.setItem('token', token)
    authStore.token = token
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
  } else {
    alert("Error de autenticación. Redirigiendo a inicio de sesión.")
    router.push('/login')
  }
})
</script>

<style scoped>
.callback-container {
  min-height: 100vh;
  background-color: #09090b;
  display: flex;
  flex-direction: column;
  justify-content: center;
  align-items: center;
  color: #fafafa;
  font-family: 'Inter', sans-serif;
}

.loader {
  width: 40px;
  height: 40px;
  border: 4px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: #3b82f6;
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
