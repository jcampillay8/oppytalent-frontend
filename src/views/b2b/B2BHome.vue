<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <!-- Decorative Blurs -->
    <div class="absolute top-[-10%] left-[-10%] w-96 h-96 bg-primary/20 blur-[100px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-[-10%] right-[-10%] w-96 h-96 bg-emerald-500/10 blur-[100px] rounded-full pointer-events-none"></div>

    <nav class="w-full p-6 flex justify-between items-center relative z-10">
      <div class="text-2xl font-black tracking-tighter bg-clip-text text-transparent bg-gradient-to-r from-primary to-emerald-400">
        OppyTalent <span class="text-xs ml-1 uppercase tracking-widest text-muted-foreground border border-border px-2 py-1 rounded-full">For Business</span>
      </div>
      <div>
        <button @click="logout" class="text-sm font-medium text-muted-foreground hover:text-foreground transition-colors">
          Cerrar Sesión
        </button>
      </div>
    </nav>

    <main class="flex-1 flex flex-col items-center justify-center p-6 relative z-10 w-full max-w-4xl mx-auto">
      <div class="text-center mb-12">
        <h1 class="text-5xl md:text-6xl font-extrabold tracking-tight mb-4">
          Encuentra el <span class="text-primary">Match Perfecto</span>
        </h1>
        <p class="text-xl text-muted-foreground max-w-2xl mx-auto">
          No busques palabras clave, busca contextos. Nuestro Meta-Reclutador analizará matemáticamente a los candidatos ideales.
        </p>
      </div>

      <form @submit.prevent="handleSearch" class="w-full relative group">
        <div class="absolute inset-y-0 left-6 flex items-center pointer-events-none">
          <Search class="h-6 w-6 text-muted-foreground group-focus-within:text-primary transition-colors" />
        </div>
        <input 
          type="text" 
          v-model="searchQuery" 
          required
          class="w-full h-20 pl-16 pr-40 text-xl md:text-2xl bg-card border-2 border-border rounded-full focus:outline-none focus:border-primary focus:ring-4 focus:ring-primary/20 transition-all shadow-xl text-foreground placeholder:text-muted-foreground/50"
          placeholder="Ej: Data Engineer con experiencia en AWS y optimización de costos..."
        >
        <div class="absolute inset-y-2 right-2">
          <button 
            type="submit" 
            :disabled="isSearching || !searchQuery.trim()"
            class="h-full px-8 bg-primary text-primary-foreground font-bold rounded-full hover:bg-primary/90 transition-all flex items-center justify-center disabled:opacity-50 disabled:cursor-not-allowed"
          >
            <span v-if="!isSearching">Buscar</span>
            <div v-else class="w-6 h-6 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
          </button>
        </div>
      </form>

      <div class="flex flex-wrap justify-center gap-3 mt-8">
        <span class="text-sm text-muted-foreground font-medium self-center mr-2">Sugerencias:</span>
        <button v-for="s in suggestions" :key="s" @click="searchQuery = s; handleSearch()" class="px-4 py-2 text-sm bg-secondary hover:bg-secondary/80 border border-border rounded-full text-foreground transition-colors">
          {{ s }}
        </button>
      </div>

      <!-- Resultados -->
      <div v-if="results.length > 0 && !isSearching" class="w-full mt-16 animate-in slide-in-from-bottom-8 duration-500 fade-in">
        <div class="flex justify-between items-end mb-6">
          <h2 class="text-2xl font-bold">
            <template v-if="results.length === 1">1 Candidato Afín (Fast-Track)</template>
            <template v-else>Top {{ results.length }} Candidatos Afines</template>
          </h2>
          
          <button 
            v-if="results.length === 1"
            @click="router.push(`/${results[0].username.split('@')[0]}`)"
            class="px-6 py-2 bg-gradient-to-r from-primary to-blue-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-primary/20 flex items-center gap-2 transition-all"
          >
            <Zap size="18" />
            Entrevistar Directamente
          </button>
          
          <button 
            v-else
            @click="goToTribunal" 
            :disabled="selectedCandidates.length < 2"
            class="px-6 py-2 bg-gradient-to-r from-emerald-500 to-emerald-600 text-white font-bold rounded-lg hover:shadow-lg hover:shadow-emerald-500/20 disabled:opacity-50 disabled:cursor-not-allowed flex items-center gap-2 transition-all"
          >
            <Swords size="18" />
            Llevar al Tribunal de IAs ({{ selectedCandidates.length }})
          </button>
        </div>

        <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div 
            v-for="res in results" 
            :key="res.usuario_id" 
            class="p-5 rounded-2xl border-2 transition-all cursor-pointer relative overflow-hidden group"
            :class="selectedCandidates.includes(res.usuario_id) ? 'bg-primary/5 border-primary' : 'bg-card border-border hover:border-primary/50'"
            @click="toggleSelection(res.usuario_id)"
          >
            <!-- Match Score Badge -->
            <div class="absolute top-4 right-4 flex items-center gap-1 bg-background px-3 py-1 rounded-full border border-border shadow-sm">
              <Zap size="14" class="text-amber-400" />
              <span class="text-sm font-bold">{{ res.match_score }}% Match</span>
            </div>

            <div class="flex items-center gap-4 mb-4">
              <div class="w-14 h-14 bg-secondary rounded-full flex items-center justify-center text-xl font-bold border border-border text-foreground">
                {{ res.first_name ? res.first_name[0] : res.username[0].toUpperCase() }}
              </div>
              <div>
                <h3 class="text-lg font-bold text-foreground">
                  {{ res.first_name }} {{ res.last_name }}
                </h3>
                <p class="text-sm text-primary font-medium">@{{ res.username }}</p>
              </div>
            </div>
            
            <p class="text-sm text-muted-foreground line-clamp-2">
              Perfil altamente compatible basado en tu criterio de búsqueda vectorial.
            </p>
            
            <!-- Select Checkbox Indicator -->
            <div v-if="results.length > 1" class="mt-4 flex justify-between items-center">
              <span class="text-xs text-muted-foreground group-hover:text-foreground transition-colors">
                Haz clic para seleccionar
              </span>
              <div class="w-6 h-6 rounded-full border-2 flex items-center justify-center transition-colors"
                :class="selectedCandidates.includes(res.usuario_id) ? 'border-primary bg-primary' : 'border-muted-foreground/30 group-hover:border-primary/50'"
              >
                <Check v-if="selectedCandidates.includes(res.usuario_id)" size="14" class="text-primary-foreground" />
              </div>
            </div>
            <div v-else class="mt-4 flex justify-between items-center">
              <span class="text-xs text-primary font-medium">¡Match Directo!</span>
            </div>
          </div>
        </div>
      </div>
      
      <!-- No results -->
      <div v-if="hasSearched && results.length === 0 && !isSearching" class="mt-16 text-center">
        <div class="w-16 h-16 bg-secondary rounded-full flex items-center justify-center mx-auto mb-4 text-muted-foreground">
          <SearchX size="32" />
        </div>
        <h3 class="text-xl font-bold">Sin resultados</h3>
        <p class="text-muted-foreground">Intenta con otros términos o busca habilidades más generales.</p>
      </div>

    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue'
import { useRouter } from 'vue-router'
import { useAuthStore } from '../../stores/auth'
import { api } from '../../services/api'
import { Search, Zap, Check, Swords, SearchX } from 'lucide-vue-next'
import { toast } from 'vue3-toastify'

const router = useRouter()
const authStore = useAuthStore()

const searchQuery = ref('')
const isSearching = ref(false)
const hasSearched = ref(false)
const results = ref([])
const selectedCandidates = ref([])

const suggestions = [
  "Desarrollador Vue con Python",
  "Líder Técnico Cloud AWS",
  "Diseñador UX enfocado en SaaS"
]

function logout() {
  authStore.logout()
}

function toggleSelection(id) {
  if (results.value.length === 1) return; // Disallow selection if it's a fast-track
  const idx = selectedCandidates.value.indexOf(id)
  if (idx > -1) {
    selectedCandidates.value.splice(idx, 1)
  } else {
    if (selectedCandidates.value.length >= 4) {
      toast.warning('Puedes seleccionar máximo 4 candidatos para el Tribunal.')
      return
    }
    selectedCandidates.value.push(id)
  }
}

async function handleSearch() {
  if (!searchQuery.value.trim()) return
  isSearching.value = true
  hasSearched.value = true
  selectedCandidates.value = []
  
  try {
    const data = await api.searchTalent(searchQuery.value)
    results.value = data || []
  } catch (error) {
    toast.error('Error al realizar la búsqueda semántica.')
    console.error(error)
  } finally {
    isSearching.value = false
  }
}

function goToTribunal() {
  if (selectedCandidates.value.length < 2) return
  // We pass selected candidates in query params
  const ids = selectedCandidates.value.join(',')
  router.push(`/b2b/tribunal?candidatos=${ids}`)
}
</script>
