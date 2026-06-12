<template>
  <div class="auth-container">
    <div class="background-effects">
      <div class="glow-sphere sphere-2"></div>
    </div>
    
    <div class="auth-card glass-card">
      <div class="auth-header">
        <router-link to="/" class="logo">Oppy<span>Talent</span></router-link>
        <h2>Crea tu cuenta</h2>
        <p>Únete a la plataforma del talento</p>
      </div>

      <form @submit.prevent="handleRegister" class="auth-form">
        <div class="form-row">
          <div class="form-group">
            <label for="first_name">Nombre</label>
            <input type="text" id="first_name" v-model="form.first_name" required class="input-premium" />
          </div>
          <div class="form-group">
            <label for="last_name">Apellido</label>
            <input type="text" id="last_name" v-model="form.last_name" required class="input-premium" />
          </div>
        </div>

        <div class="form-group">
          <label for="username">Usuario</label>
          <input type="text" id="username" v-model="form.username" required class="input-premium" />
        </div>

        <div class="form-group">
          <label for="email">Correo Electrónico</label>
          <input type="email" id="email" v-model="form.email" required class="input-premium" />
        </div>

        <div class="form-group">
          <label for="password">Contraseña</label>
          <input type="password" id="password" v-model="form.password" required class="input-premium" />
        </div>

        <div class="form-checkbox">
          <input type="checkbox" id="terms" v-model="form.has_accepted_terms" required />
          <label for="terms">Acepto los términos y condiciones</label>
        </div>

        <button type="submit" class="btn-glow w-full" :disabled="loading">
          <span v-if="!loading">Registrarse</span>
          <span v-else class="loader"></span>
        </button>

        <div class="auth-divider">
          <span>o regístrate con</span>
        </div>

        <button type="button" class="btn-social w-full" @click="handleGoogleAuth">
          <svg class="google-icon" viewBox="0 0 24 24">
            <path d="M22.56 12.25c0-.78-.07-1.53-.2-2.25H12v4.26h5.92c-.26 1.37-1.04 2.53-2.21 3.31v2.77h3.57c2.08-1.92 3.28-4.74 3.28-8.09z" fill="#4285F4"/>
            <path d="M12 23c2.97 0 5.46-.98 7.28-2.66l-3.57-2.77c-.98.66-2.23 1.06-3.71 1.06-2.86 0-5.29-1.93-6.16-4.53H2.18v2.84C3.99 20.53 7.7 23 12 23z" fill="#34A853"/>
            <path d="M5.84 14.09c-.22-.66-.35-1.36-.35-2.09s.13-1.43.35-2.09V7.07H2.18C1.43 8.55 1 10.22 1 12s.43 3.45 1.18 4.93l2.85-2.22.81-.62z" fill="#FBBC05"/>
            <path d="M12 5.38c1.62 0 3.06.56 4.21 1.64l3.15-3.15C17.45 2.09 14.97 1 12 1 7.7 1 3.99 3.47 2.18 7.07l3.66 2.84c.87-2.6 3.3-4.53 6.16-4.53z" fill="#EA4335"/>
            <path d="M1 1h22v22H1z" fill="none"/>
          </svg>
          Google
        </button>
      </form>

      <div class="auth-footer">
        <p>¿Ya tienes cuenta? <router-link to="/login" class="link-accent">Inicia Sesión</router-link></p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'

const router = useRouter()
const loading = ref(false)
const form = ref({
  first_name: '',
  last_name: '',
  username: '',
  email: '',
  password: '',
  has_accepted_terms: false
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
    formData.append('has_accepted_terms', form.value.has_accepted_terms)

    const response = await fetch('/api/v1/auth/register', {
      method: 'POST',
      body: formData
    })
    
    if (!response.ok) {
      const error = await response.json()
      throw new Error(error.detail || 'Error en el registro')
    }
    
    alert('Registro exitoso. Serás redirigido para iniciar sesión.')
    router.push('/login')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}
</script>

<style scoped>
/* Resusing the same styles as Login */
.auth-container {
  min-height: 100vh;
  background-color: #09090b;
  display: flex;
  justify-content: center;
  align-items: center;
  padding: 2rem;
  position: relative;
  overflow: hidden;
  font-family: 'Inter', sans-serif;
  color: #fafafa;
}

.background-effects {
  position: absolute;
  width: 100%;
  height: 100%;
  z-index: 0;
  pointer-events: none;
}

.glow-sphere {
  position: absolute;
  border-radius: 50%;
  filter: blur(100px);
  opacity: 0.4;
  top: 50%;
  left: 50%;
  transform: translate(-50%, -50%);
  width: 50vw;
  height: 50vw;
}

.sphere-2 {
  background: radial-gradient(circle, rgba(139,92,246,0.3) 0%, rgba(76,29,149,0) 70%);
}

.auth-card {
  width: 100%;
  max-width: 480px;
  padding: 2.5rem;
  position: relative;
  z-index: 10;
}

.glass-card {
  background: rgba(24, 24, 27, 0.7);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 20px;
  backdrop-filter: blur(20px);
  box-shadow: 0 25px 50px -12px rgba(0, 0, 0, 0.5);
}

.auth-header {
  text-align: center;
  margin-bottom: 2rem;
}

.logo {
  font-size: 1.5rem;
  font-weight: 800;
  letter-spacing: -0.5px;
  color: white;
  text-decoration: none;
  display: inline-block;
  margin-bottom: 1rem;
}

.logo span { color: #3b82f6; }

.auth-header h2 {
  font-size: 1.5rem;
  font-weight: 700;
  margin-bottom: 0.5rem;
}

.auth-header p {
  color: #a1a1aa;
  font-size: 0.95rem;
}

.form-row {
  display: flex;
  gap: 1rem;
}

.form-row .form-group {
  flex: 1;
}

.form-group { margin-bottom: 1.25rem; }

.form-group label {
  display: block;
  font-size: 0.875rem;
  font-weight: 500;
  color: #e4e4e7;
  margin-bottom: 0.5rem;
}

.input-premium {
  width: 100%;
  padding: 0.75rem 1rem;
  background: rgba(0, 0, 0, 0.2);
  border: 1px solid rgba(255, 255, 255, 0.1);
  border-radius: 12px;
  color: white;
  font-family: inherit;
  font-size: 0.95rem;
  transition: all 0.2s ease;
  box-sizing: border-box;
}

.input-premium:focus {
  outline: none;
  border-color: #8b5cf6;
  box-shadow: 0 0 0 3px rgba(139, 92, 246, 0.2);
  background: rgba(0, 0, 0, 0.4);
}

.form-checkbox {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  margin-bottom: 1.5rem;
  margin-top: 0.5rem;
}

.form-checkbox label {
  font-size: 0.875rem;
  color: #a1a1aa;
}

.btn-glow {
  background: linear-gradient(135deg, #3b82f6 0%, #8b5cf6 100%);
  color: white;
  padding: 0.875rem;
  border-radius: 12px;
  font-weight: 600;
  font-size: 1rem;
  border: none;
  cursor: pointer;
  transition: all 0.3s ease;
  box-shadow: 0 4px 14px rgba(139, 92, 246, 0.3);
  display: flex;
  justify-content: center;
  align-items: center;
}

.btn-glow:hover:not(:disabled) {
  transform: translateY(-2px);
  box-shadow: 0 6px 20px rgba(139, 92, 246, 0.4);
}

.w-full { width: 100%; }

.auth-divider {
  display: flex;
  align-items: center;
  text-align: center;
  margin: 1.5rem 0;
  color: #a1a1aa;
  font-size: 0.875rem;
}

.auth-divider::before,
.auth-divider::after {
  content: '';
  flex: 1;
  border-bottom: 1px solid rgba(255, 255, 255, 0.1);
}

.auth-divider span {
  padding: 0 1rem;
}

.btn-social {
  background: rgba(255, 255, 255, 0.05);
  border: 1px solid rgba(255, 255, 255, 0.1);
  color: white;
  padding: 0.875rem;
  border-radius: 12px;
  font-weight: 500;
  font-size: 1rem;
  cursor: pointer;
  transition: all 0.2s ease;
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 0.75rem;
}

.btn-social:hover {
  background: rgba(255, 255, 255, 0.1);
  border-color: rgba(255, 255, 255, 0.2);
}

.google-icon {
  width: 20px;
  height: 20px;
}

.auth-footer {
  margin-top: 1.5rem;
  text-align: center;
  font-size: 0.9rem;
  color: #a1a1aa;
}

.link-accent {
  color: #8b5cf6;
  text-decoration: none;
  font-weight: 600;
}

.loader {
  width: 20px;
  height: 20px;
  border: 2px solid rgba(255,255,255,0.3);
  border-radius: 50%;
  border-top-color: #fff;
  animation: spin 0.8s ease-in-out infinite;
}

@keyframes spin { to { transform: rotate(360deg); } }
</style>
