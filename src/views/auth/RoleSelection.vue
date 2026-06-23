<template>
  <div class="min-h-screen bg-background relative flex flex-col items-center justify-center overflow-hidden selection-wrapper">
    <!-- Partículas decorativas de fondo -->
    <div class="absolute inset-0 overflow-hidden pointer-events-none">
      <div class="absolute -top-[20%] -left-[10%] w-[50%] h-[50%] rounded-full bg-primary/20 blur-[120px] mix-blend-screen"></div>
      <div class="absolute top-[60%] -right-[10%] w-[40%] h-[60%] rounded-full bg-cyan-500/20 blur-[100px] mix-blend-screen"></div>
    </div>

    <!-- Contenido principal -->
    <div class="relative z-10 w-full max-w-5xl px-6 py-12 flex flex-col items-center">
      <div class="text-center mb-12" v-motion :initial="{ opacity: 0, y: -20 }" :enter="{ opacity: 1, y: 0 }">
        <h1 class="text-4xl md:text-5xl font-extrabold text-foreground tracking-tight mb-4">
          ¿Cómo quieres usar <span class="text-primary bg-clip-text text-transparent bg-gradient-to-r from-primary to-cyan-500">OppyTalent</span>?
        </h1>
        <p class="text-lg text-muted-foreground max-w-2xl mx-auto">
          Hemos detectado que acabas de registrarte. Para ofrecerte la mejor experiencia, 
          cuéntanos cuál es tu objetivo principal en nuestra plataforma.
        </p>
      </div>

      <div class="grid grid-cols-1 md:grid-cols-2 gap-8 w-full">
        <!-- Opcion: Soy Empresa (HUNTER) -->
        <button 
          @click="openBetaModal"
          :disabled="isSubmitting"
          v-motion 
          :initial="{ opacity: 0, x: -50 }" 
          :enter="{ opacity: 1, x: 0, transition: { delay: 100 } }"
          class="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card hover:border-primary/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-primary/20"
        >
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-primary/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <!-- Badge Beta Cerrada -->
          <div class="absolute -top-3 -right-3 bg-primary text-white text-xs font-bold px-3 py-1 rounded-full shadow-lg border-2 border-background animate-bounce z-20">
            BETA CERRADA
          </div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 mx-auto mb-6 bg-primary/10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <Building2 class="w-10 h-10 text-primary" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Soy Empresa o Reclutador</h2>
            <p class="text-muted-foreground text-sm mb-6">
              Busco el mejor talento de IT. Quiero usar la IA para encontrar perfiles, comparar candidatos y ahorrar tiempo en selección.
            </p>
            <div class="flex items-center justify-center text-primary font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              Continuar como Reclutador <ArrowRight class="ml-2 w-4 h-4" />
            </div>
          </div>
        </button>

        <!-- Opcion: Soy Talento (TALENT) -->
        <button 
          @click="selectRole('TALENT')"
          :disabled="isSubmitting"
          v-motion 
          :initial="{ opacity: 0, x: 50 }" 
          :enter="{ opacity: 1, x: 0, transition: { delay: 200 } }"
          class="group relative flex flex-col items-center text-center p-8 rounded-3xl border border-border/50 bg-card/40 backdrop-blur-xl hover:bg-card hover:border-cyan-500/50 transition-all duration-300 hover:-translate-y-2 hover:shadow-2xl hover:shadow-cyan-500/20"
        >
          <div class="absolute inset-0 rounded-3xl bg-gradient-to-br from-cyan-500/10 to-transparent opacity-0 group-hover:opacity-100 transition-opacity"></div>
          
          <div class="relative z-10">
            <div class="w-20 h-20 mx-auto mb-6 bg-cyan-500/10 rounded-2xl flex items-center justify-center transform group-hover:scale-110 transition-transform duration-300">
              <User class="w-10 h-10 text-cyan-500" />
            </div>
            <h2 class="text-2xl font-bold text-foreground mb-3">Soy Talento o Profesional</h2>
            <p class="text-muted-foreground text-sm mb-6">
              Busco destacar y encontrar empleo. Quiero que la IA construya mi portafolio profesional y me conecte con las mejores empresas.
            </p>
            <div class="flex items-center justify-center text-cyan-500 font-medium opacity-0 group-hover:opacity-100 transition-opacity transform translate-y-2 group-hover:translate-y-0">
              Continuar como Talento <ArrowRight class="ml-2 w-4 h-4" />
            </div>
          </div>
        </button>
      </div>

      <!-- Loader Overlay -->
      <div v-if="isSubmitting" class="absolute inset-0 z-50 flex flex-col items-center justify-center bg-background/80 backdrop-blur-md rounded-3xl">
        <div class="animate-spin w-12 h-12 border-4 border-primary border-t-transparent rounded-full mb-4"></div>
        <p class="text-foreground font-medium animate-pulse">Configurando tu experiencia...</p>
      </div>
      <!-- Beta Modal Overlay -->
      <div v-if="isBetaModalOpen" class="fixed inset-0 z-[60] flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
        <div class="bg-card border border-border/50 rounded-2xl p-6 max-w-sm w-full shadow-2xl" v-motion :initial="{ scale: 0.9, opacity: 0 }" :enter="{ scale: 1, opacity: 1 }">
          <h3 class="text-xl font-bold text-foreground mb-2 flex items-center gap-2"><Lock class="w-5 h-5 text-primary" /> Acceso Anticipado</h3>
          <p class="text-sm text-muted-foreground mb-4">El portal B2B para Empresas se encuentra actualmente en Beta Privada. Por favor ingresa tu código de acceso.</p>
          <input 
            v-model="betaCode" 
            @keyup.enter="verifyBetaCode"
            type="password" 
            placeholder="Ej: BETA2026CODE"
            class="w-full bg-background border border-border/50 rounded-lg px-4 py-2 text-foreground focus:outline-none focus:border-primary mb-4"
          />
          <div class="flex gap-3">
            <button @click="isBetaModalOpen = false" class="flex-1 py-2 rounded-lg border border-border/50 text-foreground hover:bg-secondary/50 transition-colors text-sm font-medium">Cancelar</button>
            <button @click="verifyBetaCode" class="flex-1 py-2 rounded-lg bg-primary text-white hover:bg-primary/90 transition-colors text-sm font-medium">Verificar</button>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { Building2, User, ArrowRight, Lock } from 'lucide-vue-next';
import { api } from '../../services/api';
import { useAuthStore } from '../../stores/auth';
import { toast } from 'vue3-toastify';

const router = useRouter();
const authStore = useAuthStore();
const isSubmitting = ref(false);

const isBetaModalOpen = ref(false);
const betaCode = ref('');

function openBetaModal() {
  isBetaModalOpen.value = true;
  betaCode.value = '';
}

function verifyBetaCode() {
  if (betaCode.value.toUpperCase() === 'OPPY2026BETA') {
    isBetaModalOpen.value = false;
    selectRole('HUNTER');
  } else {
    toast.error("Código de acceso inválido o expirado. Únete a la lista de espera.");
    betaCode.value = '';
  }
}

async function selectRole(roleName) {
  isSubmitting.value = true;
  try {
    await api.selectUserRole(roleName);
    
    // Refetch the user profile so authStore knows the new role
    await authStore.fetchUser();
    
    // Redirect based on selected role
    if (roleName === 'HUNTER') {
      router.push('/b2b'); // Go to B2B Dashboard
    } else {
      router.push(`/${authStore.user?.username}/dashboard`); // Go to Portfolio Builder
    }
  } catch (error) {
    console.error("Error al seleccionar rol:", error);
    toast.error(error.detail || "Ocurrió un error configurando tu perfil.");
  } finally {
    isSubmitting.value = false;
  }
}
</script>

<style scoped>
.selection-wrapper {
  background-image: radial-gradient(circle at 50% 50%, var(--color-gray-900) 0%, var(--color-black) 100%);
}

.text-foreground {
  color: var(--color-white);
}

.text-muted-foreground {
  color: var(--color-gray-400);
}

.bg-card {
  background-color: var(--color-gray-800);
}

.border-border {
  border-color: var(--color-gray-700);
}
</style>
