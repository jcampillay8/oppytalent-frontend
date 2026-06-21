<template>
  <div class="min-h-screen bg-background text-foreground flex flex-col relative overflow-hidden">
    <!-- Decorative Blurs -->
    <div class="absolute top-0 right-0 w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none"></div>
    <div class="absolute bottom-0 left-0 w-[500px] h-[500px] bg-emerald-500/10 blur-[120px] rounded-full pointer-events-none"></div>

    <!-- Header -->
    <header class="w-full p-6 flex justify-between items-center border-b border-border/50 bg-background/50 backdrop-blur-md relative z-10">
      <div class="flex items-center gap-4">
        <button @click="router.push('/b2b')" class="p-2 hover:bg-secondary rounded-full transition-colors text-muted-foreground hover:text-foreground">
          <ArrowLeft size="24" />
        </button>
        <div class="text-xl font-bold flex items-center gap-2">
          <Swords class="text-primary" size="24" /> Tribunal de IAs
        </div>
      </div>
      <div class="text-sm font-medium text-muted-foreground bg-secondary px-4 py-2 rounded-full border border-border">
        {{ candidates.length }} Candidatos Seleccionados
      </div>
    </header>

    <main class="flex-1 flex flex-col md:flex-row relative z-10 w-full max-w-7xl mx-auto h-[calc(100vh-80px)]">
      
      <!-- Panel Izquierdo: Chat del Reclutador y Veredicto -->
      <section class="w-full md:w-1/3 flex flex-col border-r border-border/50 bg-background/80 backdrop-blur-sm relative">
        <div class="p-6 flex-1 overflow-y-auto">
          <h2 class="text-xl font-bold mb-4 flex items-center gap-2">
            <UserSearch class="text-primary" /> Evaluación Técnica
          </h2>
          <p class="text-sm text-muted-foreground mb-6">
            Escribe una pregunta técnica específica. Los "Clones Digitales" de cada candidato responderán usando su contexto real.
          </p>

          <form @submit.prevent="startDebate" class="space-y-4">
            <textarea 
              v-model="question" 
              rows="4"
              class="w-full p-4 bg-card border border-border rounded-xl focus:outline-none focus:border-primary focus:ring-2 focus:ring-primary/20 transition-all text-foreground resize-none shadow-inner"
              placeholder="Ej: ¿Cómo optimizarías una consulta lenta en PostgreSQL con millones de registros?"
              required
            ></textarea>
            
            <button 
              type="submit" 
              :disabled="isDebating || !question.trim()"
              class="w-full py-3 bg-gradient-to-r from-primary to-emerald-500 text-primary-foreground font-bold rounded-xl hover:shadow-lg hover:shadow-primary/20 transition-all flex items-center justify-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <Swords v-if="!isDebating" size="18" />
              <span v-if="!isDebating">Iniciar Debate</span>
              <div v-else class="w-5 h-5 border-2 border-white/30 border-t-white rounded-full animate-spin"></div>
            </button>
          </form>

          <!-- Moderador Result -->
          <div v-if="moderatorSummary" class="mt-8 animate-in fade-in slide-in-from-bottom-4">
            <div class="flex items-center gap-2 mb-3 text-emerald-500 font-bold">
              <Scale size="20" /> Veredicto del Moderador Neutral
            </div>
            <div class="p-4 bg-emerald-500/5 border border-emerald-500/20 rounded-xl text-sm leading-relaxed prose prose-invert prose-emerald prose-sm max-w-none mb-6" v-html="parsedModeratorSummary">
            </div>
            
            <button 
              @click="printReport"
              class="w-full py-3 bg-secondary text-foreground font-bold rounded-xl hover:bg-secondary/80 transition-all flex items-center justify-center gap-2 border border-border"
            >
              <FileText size="18" />
              Generar Reporte PDF (ATS-friendly)
            </button>
          </div>
        </div>
      </section>

      <!-- Panel Derecho: Respuestas de los Clones -->
      <section class="w-full md:w-2/3 p-6 flex flex-col bg-background/50 overflow-y-auto">
        <div v-if="!hasDebated && !isDebating && candidateResponses.length === 0" class="flex-1 flex flex-col items-center justify-center text-muted-foreground opacity-50">
          <MessageSquareDashed size="64" class="mb-4" />
          <h3 class="text-xl font-medium">Esperando pregunta...</h3>
          <p class="text-sm">Inicia el debate para ver cómo responde cada IA.</p>
        </div>

        <div v-else-if="isDebating && candidateResponses.length === 0" class="flex-1 flex flex-col items-center justify-center text-primary">
          <div class="w-16 h-16 border-4 border-primary/30 border-t-primary rounded-full animate-spin mb-4"></div>
          <h3 class="text-xl font-bold animate-pulse">Entrevistando Clones Digitales...</h3>
          <p class="text-sm text-muted-foreground mt-2">Evaluando contextos e infiriendo respuestas técnicas (Zero-Hallucination).</p>
        </div>

        <div v-else class="space-y-6">
          <h3 class="text-lg font-bold text-foreground border-b border-border/50 pb-2">Respuestas en tiempo real</h3>
          
          <div 
            v-for="(res, idx) in candidateResponses" 
            :key="res.usuario_id"
            class="p-5 bg-card border border-border rounded-2xl shadow-sm relative animate-in slide-in-from-right-8"
          >
            <div class="flex items-center gap-3 mb-3">
              <div class="w-10 h-10 bg-secondary rounded-full flex items-center justify-center font-bold text-foreground border border-border">
                {{ res.first_name ? res.first_name[0] : res.username[0].toUpperCase() }}
              </div>
              <div>
                <h4 class="font-bold text-foreground flex items-center gap-2">
                  {{ res.first_name }} {{ res.last_name }} 
                  <span class="text-[10px] bg-primary/20 text-primary px-2 py-0.5 rounded-full uppercase tracking-wider">Clon IA</span>
                </h4>
                <p class="text-xs text-muted-foreground">@{{ res.username }}</p>
              </div>
            </div>
            
            <div class="text-sm text-foreground/90 leading-relaxed whitespace-pre-wrap pl-13 border-l-2 border-primary/30 ml-5 py-1">
              {{ res.answer }}
            </div>
            
            <div class="absolute top-4 right-4 text-xs font-medium px-2 py-1 bg-secondary rounded-md text-muted-foreground border border-border/50 flex items-center gap-1">
              <CheckCircle2 size="12" class="text-emerald-500" /> RAG Validado
            </div>
          </div>
          
          <div v-if="isDebating" class="text-center py-4">
            <span class="text-sm font-medium text-primary animate-pulse flex items-center justify-center gap-2">
               <div class="w-4 h-4 border-2 border-primary/30 border-t-primary rounded-full animate-spin"></div>
               Esperando a los demás clones...
            </span>
          </div>

          <div v-if="isModerating" class="text-center py-4">
            <span class="text-sm font-medium text-emerald-500 animate-pulse flex items-center justify-center gap-2">
               <div class="w-4 h-4 border-2 border-emerald-500/30 border-t-emerald-500 rounded-full animate-spin"></div>
               El Moderador Neutral está evaluando las respuestas...
            </span>
          </div>
        </div>
      </section>

    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue'
import { useRouter, useRoute } from 'vue-router'
import { api } from '../../services/api'
import { marked } from 'marked'
import { toast } from 'vue3-toastify'
import { Swords, ArrowLeft, UserSearch, Scale, MessageSquareDashed, CheckCircle2, FileText } from 'lucide-vue-next'

const router = useRouter()
const route = useRoute()

const candidates = ref([])
const question = ref('')
const isDebating = ref(false)
const isModerating = ref(false)
const hasDebated = ref(false)
const candidateResponses = ref([])
const moderatorSummary = ref('')

const parsedModeratorSummary = computed(() => {
  if (!moderatorSummary.value) return ''
  return marked.parse(moderatorSummary.value)
})

onMounted(() => {
  const ids = route.query.candidatos
  if (ids) {
    candidates.value = ids.split(',').map(id => parseInt(id, 10))
  } else {
    toast.error('No se seleccionaron candidatos.')
    router.push('/b2b')
  }
})

function printReport() {
  window.print()
}

async function startDebate() {
  if (!question.value.trim() || candidates.value.length === 0) return
  
  isDebating.value = true
  hasDebated.value = false
  candidateResponses.value = []
  moderatorSummary.value = ''
  
  try {
    // 1. Fetch Candidates in Parallel
    const candidatePromises = candidates.value.map(async (candidate_id) => {
      try {
        const res = await api.tribunalCandidate(question.value, candidate_id)
        if (res) {
          candidateResponses.value.push(res)
        }
      } catch (err) {
        console.error(`Error with candidate ${candidate_id}:`, err)
      }
    })
    
    // We wait for all to finish, but they populate the array in real-time as they arrive!
    await Promise.all(candidatePromises)
    
    isDebating.value = false
    
    if (candidateResponses.value.length === 0) {
      toast.error('Ningún candidato pudo responder.')
      return
    }
    
    hasDebated.value = true
    
    // 2. Fetch Moderator
    isModerating.value = true
    const modRes = await api.tribunalModerator(question.value, candidateResponses.value)
    if (modRes && modRes.moderator_summary) {
      moderatorSummary.value = modRes.moderator_summary
    }
  } catch (error) {
    console.error(error)
    toast.error('Error al ejecutar el Tribunal: ' + (error.detail || error.message))
  } finally {
    isDebating.value = false
    isModerating.value = false
  }
}
</script>

<style>
@media print {
  body * {
    visibility: hidden;
  }
  main, main * {
    visibility: visible;
  }
  main {
    position: absolute;
    left: 0;
    top: 0;
    width: 100%;
  }
  header, button {
    display: none !important;
  }
  /* Ajustar scroll y altura para que imprima todo el contenido */
  .overflow-y-auto {
    overflow: visible !important;
    height: auto !important;
  }
}
</style>
