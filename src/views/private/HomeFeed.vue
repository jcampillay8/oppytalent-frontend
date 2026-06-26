<template>
  <div class="min-h-screen bg-background text-foreground font-sans relative overflow-x-hidden pt-20 pb-10">
    <!-- Decorative Blurs -->
    <div class="fixed top-[-10%] left-[-10%] w-[500px] h-[500px] bg-primary/10 blur-[120px] rounded-full pointer-events-none z-0"></div>
    <div class="fixed bottom-[-10%] right-[-10%] w-[500px] h-[500px] bg-purple-500/10 blur-[120px] rounded-full pointer-events-none z-0"></div>



    <!-- Main Grid -->
    <main class="max-w-7xl mx-auto px-6 grid grid-cols-1 lg:grid-cols-12 gap-6 relative z-10">
      
      <!-- Left Sidebar: Mi Perfil & Métricas -->
      <aside class="lg:col-span-3 space-y-6">
        <!-- Tarjeta de Perfil -->
        <div class="bg-card border border-border rounded-2xl overflow-hidden shadow-sm hover:border-primary/50 transition-colors group relative">
          <div class="h-20 bg-gradient-to-br from-primary/80 to-purple-600/80"></div>
          <div class="px-5 pb-5 text-center -mt-10">
            <div class="w-20 h-20 mx-auto rounded-full bg-background p-1 mb-3">
              <div class="w-full h-full rounded-full bg-secondary flex items-center justify-center font-bold text-2xl text-foreground overflow-hidden border border-border relative group-hover:ring-4 ring-primary/20 transition-all">
                <img v-if="currentUser?.userImage" :src="currentUser?.userImage" class="w-full h-full object-cover" />
                <span v-else>{{ (currentUser?.firstName || currentUser?.username || 'U').charAt(0).toUpperCase() }}</span>
              </div>
            </div>
            <h2 class="text-lg font-bold text-foreground">{{ currentUser?.firstName || currentUser?.username }} {{ currentUser?.lastName || '' }}</h2>
            <p class="text-xs text-muted-foreground mt-1">{{ currentUser?.occupation || 'Talento Tech' }}</p>
            
            <button @click="goToMyPortfolio" class="w-full mt-5 py-2 bg-secondary hover:bg-primary hover:text-primary-foreground text-foreground text-sm font-medium rounded-xl transition-all border border-border hover:border-primary flex justify-center items-center gap-2">
              <Eye size="16" /> Ver mi vitrina
            </button>
          </div>
        </div>

        <!-- Métricas del Clon Digital -->
        <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Bot class="text-primary" size="18" /> Rendimiento de mi Clon IA
          </h3>
          <div class="space-y-4">
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <MessageSquare size="14"/> Interacciones
              </div>
              <span class="font-bold text-foreground">12</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <Eye size="14"/> Vistas de Perfil
              </div>
              <span class="font-bold text-foreground">48</span>
            </div>
            <div class="flex justify-between items-center">
              <div class="flex items-center gap-2 text-sm text-muted-foreground">
                <Swords size="14"/> Citaciones B2B
              </div>
              <span class="font-bold text-emerald-500">2</span>
            </div>
          </div>
          <div class="mt-4 p-3 bg-secondary/50 rounded-xl border border-border/50">
            <p class="text-xs text-muted-foreground leading-relaxed">
              <span class="font-bold text-foreground">Tip:</span> Tu clon digital tiene un 85% de completitud. Agrega más proyectos para mejorar tus respuestas automáticas.
            </p>
          </div>
        </div>
      </aside>

      <!-- Center: Vitrina de Proyectos (Showcase) -->
      <section class="lg:col-span-6 space-y-6">
        <div class="flex items-center justify-between">
          <h1 class="text-2xl font-black tracking-tight flex items-center gap-2">
            <Sparkles class="text-yellow-500" size="24" /> Inspiración y Proyectos
          </h1>
          <button class="text-sm font-medium text-primary hover:underline">Ver todos</button>
        </div>

        <!-- Fake Project Showcase Cards -->
        <div class="space-y-6">
          <div class="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 text-emerald-500 flex items-center justify-center font-bold border border-emerald-500/30">
                  A
                </div>
                <div>
                  <h4 class="font-bold text-foreground text-sm">Ana Martínez</h4>
                  <p class="text-xs text-muted-foreground">Frontend Developer</p>
                </div>
              </div>
              <span class="text-[10px] uppercase tracking-wider font-bold text-primary bg-primary/10 px-2 py-1 rounded-full">
                Destacado
              </span>
            </div>
            
            <h3 class="text-lg font-bold mb-2">E-commerce con Nuxt 3 y Supabase</h3>
            <p class="text-sm text-muted-foreground line-clamp-3 mb-4">
              Implementación completa de un e-commerce utilizando SSR con Nuxt 3. La base de datos y la autenticación están manejadas por Supabase, logrando un perfomance de 99 en Lighthouse.
            </p>
            
            <div class="flex gap-2 mb-4">
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">Vue.js</span>
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">Supabase</span>
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">Tailwind</span>
            </div>
            
            <div class="flex gap-3 border-t border-border/50 pt-4">
              <button class="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium rounded-xl transition-all flex justify-center items-center gap-2">
                <ExternalLink size="16" /> Ver Demo
              </button>
              <button class="py-2 px-4 border border-border hover:border-primary text-muted-foreground hover:text-primary text-sm font-medium rounded-xl transition-all flex justify-center items-center gap-2">
                <Heart size="16" /> 24
              </button>
            </div>
          </div>

          <div class="bg-card border border-border rounded-2xl p-5 shadow-sm hover:shadow-lg transition-all hover:-translate-y-1 duration-300">
            <div class="flex justify-between items-start mb-4">
              <div class="flex items-center gap-3">
                <div class="w-10 h-10 rounded-full bg-blue-500/20 text-blue-500 flex items-center justify-center font-bold border border-blue-500/30">
                  C
                </div>
                <div>
                  <h4 class="font-bold text-foreground text-sm">Carlos Dev</h4>
                  <p class="text-xs text-muted-foreground">Data Engineer</p>
                </div>
              </div>
            </div>
            
            <h3 class="text-lg font-bold mb-2">Pipeline ETL en tiempo real con Kafka</h3>
            <p class="text-sm text-muted-foreground line-clamp-3 mb-4">
              Arquitectura de procesamiento de datos en streaming utilizando Apache Kafka y Python. Procesa más de 10k eventos por segundo y los ingesta en un data warehouse.
            </p>
            
            <div class="flex gap-2 mb-4">
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">Python</span>
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">Kafka</span>
              <span class="text-xs px-2 py-1 bg-secondary rounded-md text-foreground border border-border">AWS</span>
            </div>
            
            <div class="flex gap-3 border-t border-border/50 pt-4">
              <button class="flex-1 py-2 bg-secondary hover:bg-secondary/80 text-foreground text-sm font-medium rounded-xl transition-all flex justify-center items-center gap-2">
                <ExternalLink size="16" /> Ver Repositorio
              </button>
            </div>
          </div>
        </div>
      </section>

      <!-- Right Sidebar: Insights & Networking -->
      <aside class="lg:col-span-3 space-y-6">
        
        <!-- Radar de la Demanda (Insights) -->
        <div class="bg-gradient-to-br from-card to-card/50 border border-primary/20 rounded-2xl p-5 shadow-lg relative overflow-hidden">
          <div class="absolute top-0 right-0 w-32 h-32 bg-primary/10 blur-[40px] rounded-full pointer-events-none"></div>
          
          <h3 class="text-sm font-bold text-foreground mb-4 flex items-center gap-2 relative z-10">
            <Activity class="text-primary" size="18" /> Radar de la Demanda
          </h3>
          
          <div v-if="demandData" class="space-y-4 relative z-10">
            <p class="text-sm text-muted-foreground leading-relaxed">
              La IA de OppyTalent analizó <strong>+{{ demandData.total_searches }} búsquedas</strong> de Headhunters esta semana en tu área.
            </p>
            
            <div v-for="(insight, i) in demandData.insights" :key="i" class="space-y-2">
              <div class="flex justify-between items-center text-xs">
                <span class="text-foreground font-medium">{{ insight.skill }}</span>
                <span :class="`text-${insight.color_class} font-bold`">{{ insight.trend }}</span>
              </div>
              <div class="w-full bg-secondary rounded-full h-1.5 overflow-hidden">
                <div :class="`bg-${insight.color_class} h-1.5 rounded-full`" :style="{ width: insight.percentage + '%' }"></div>
              </div>
            </div>

            <div class="mt-4 p-3 bg-primary/10 rounded-xl border border-primary/20">
              <p class="text-xs text-foreground font-medium flex items-start gap-2">
                <Lightbulb size="14" class="text-yellow-500 flex-shrink-0 mt-0.5"/>
                Sugerencia: {{ demandData.suggestion }}
              </p>
            </div>
          </div>
          <div v-else class="py-10 flex justify-center relative z-10">
            <div class="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin"></div>
          </div>
        </div>

        <!-- Feedback de Batalla (Tribunal) -->
        <div v-if="talentFeedback && talentFeedback.length > 0" class="bg-card border border-primary/30 rounded-2xl p-5 shadow-sm relative overflow-hidden group">
          <div class="absolute inset-0 bg-primary/5 opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none"></div>
          <h3 class="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Swords class="text-primary" size="18" /> Feedback de Batalla B2B
          </h3>
          <p class="text-xs text-muted-foreground mb-4">
            ¡Tu Clon Digital fue evaluado en <strong>{{ talentFeedback.length }}</strong> paneles técnicos recientemente!
          </p>
          
          <div class="space-y-4">
            <div v-for="fb in talentFeedback.slice(0,2)" :key="fb.id" class="p-3 bg-secondary rounded-xl border border-border">
              <p class="text-xs font-medium text-foreground mb-1 line-clamp-1 opacity-80 flex items-center gap-1">
                <MessageSquare size="12"/> Reclutador: "{{ fb.question }}"
              </p>
              <div class="text-xs text-muted-foreground prose prose-invert prose-sm leading-relaxed" v-html="fb.talent_feedback || 'Procesando feedback...'"></div>
              <p class="text-[10px] text-right mt-2 text-primary opacity-70">{{ new Date(fb.created_at).toLocaleDateString() }}</p>
            </div>
          </div>
        </div>

        <!-- Networking Sugerido -->
        <div class="bg-card border border-border rounded-2xl p-5 shadow-sm">
          <h3 class="text-sm font-bold text-foreground mb-4 flex items-center gap-2">
            <Users class="text-primary" size="18" /> Conecta con Talentos
          </h3>
          
          <div class="space-y-4">
            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-purple-500/20 text-purple-500 flex items-center justify-center font-bold text-xs border border-purple-500/30">M</div>
                <div>
                  <p class="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">Martín UX</p>
                  <p class="text-[10px] text-muted-foreground">Diseñador UI/UX</p>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all">
                <UserPlus size="14"/>
              </button>
            </div>

            <div class="flex items-center justify-between group">
              <div class="flex items-center gap-3">
                <div class="w-8 h-8 rounded-full bg-amber-500/20 text-amber-500 flex items-center justify-center font-bold text-xs border border-amber-500/30">S</div>
                <div>
                  <p class="text-sm font-bold text-foreground group-hover:text-primary transition-colors cursor-pointer">Sofía QA</p>
                  <p class="text-[10px] text-muted-foreground">Automation Engineer</p>
                </div>
              </div>
              <button class="w-8 h-8 rounded-full bg-secondary hover:bg-primary hover:text-primary-foreground flex items-center justify-center text-muted-foreground transition-all">
                <UserPlus size="14"/>
              </button>
            </div>
          </div>
        </div>

      </aside>
    </main>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'
import { useRouter } from 'vue-router'
import { api } from '../../services/api'
import { useAuthStore } from '../../stores/auth'
import { 
  Briefcase, Eye, 
  Bot, MessageSquare, Swords, Sparkles, ExternalLink, Heart,
  Activity, Lightbulb, Users, UserPlus
} from 'lucide-vue-next'

const router = useRouter()
const authStore = useAuthStore()

const currentUser = ref(null)
const demandData = ref(null)
const talentFeedback = ref([])

onMounted(async () => {
  try {
    currentUser.value = await api.me()
  } catch (error) {
    console.error('Error fetching current user:', error)
  }
  
  try {
    demandData.value = await api.getDemandInsights()
  } catch (error) {
    console.error('Error fetching demand insights:', error)
  }

  try {
    talentFeedback.value = await api.getTalentFeedback()
  } catch (error) {
    console.error('Error fetching talent feedback:', error)
  }
})

onUnmounted(() => {
})

function goToMyPortfolio() {
  if (currentUser.value?.username) {
    const username = currentUser.value.username.split('@')[0]
    localStorage.setItem('currentPortfolioUser', username)
  }
  isDropdownOpen.value = false
  router.push('/portafolio')
}


</script>

<style scoped>
/* Las transiciones suaves y decoraciones glass ya están en las clases utilitarias de Tailwind */
</style>
