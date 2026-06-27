<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-emerald-500/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO SECTION B2B -->
      <section class="w-full max-w-6xl mx-auto px-6 text-center mb-24" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-emerald-500/30 text-emerald-400 bg-emerald-500/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          {{ $t('public_b2b.b2b_1') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          {{ $t('public_b2b.b2b_2') }}<br />
          {{ $t('public_b2b.b2b_3') }} <span class="bg-gradient-to-r from-emerald-400 to-teal-300 bg-clip-text text-transparent">{{ $t('public_b2b.b2b_4') }}</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
          {{ $t('public_b2b.b2b_5') }} <strong>{{ $t('public_b2b.b2b_6') }}</strong> {{ $t('public_b2b.b2b_7') }}
        </p>
        <div class="mt-10 flex justify-center">
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold shadow-lg shadow-emerald-500/30 bg-emerald-600 hover:bg-emerald-500 border-emerald-400">
              {{ $t('public_b2b.b2b_8') }}
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

      <!-- DOLOR Y SOLUCIÓN (B2B) -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="p-8 rounded-3xl bg-red-950/10 border border-red-900/30" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                <Clock :size="24" />
              </div>
              <h3 class="text-2xl font-bold text-zinc-200">{{ $t('public_b2b.b2b_9') }}</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              {{ $t('public_b2b.b2b_10') }} <em>{{ $t('public_b2b.b2b_11') }}</em>{{ $t('public_b2b.b2b_12') }}
            </p>
          </div>
          
          <div class="p-8 rounded-3xl bg-emerald-900/10 border border-emerald-500/30 shadow-[0_0_40px_rgba(16,185,129,0.1)] relative overflow-hidden" v-motion-slide-visible-once-bottom>
            <div class="absolute inset-0 bg-gradient-to-br from-emerald-500/5 to-transparent"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-emerald-500/20 flex items-center justify-center text-emerald-400">
                  <Target :size="24" />
                </div>
                <h3 class="text-2xl font-bold text-white">{{ $t('public_b2b.b2b_13') }}</h3>
              </div>
              <p class="text-zinc-300 leading-relaxed mb-6">
                {{ $t('public_b2b.b2b_14') }} <strong>{{ $t('public_b2b.b2b_15') }}</strong>{{ $t('public_b2b.b2b_16') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURES B2B -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16" v-motion-slide-visible-once-bottom>{{ $t('public_b2b.b2b_17') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
          <!-- Búsqueda Semántica -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-emerald-500/50 transition-colors group flex flex-col" v-motion-slide-visible-once-bottom>
            <div class="bg-emerald-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-400 mb-6 group-hover:scale-110 transition-transform">
              <Search :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3">{{ $t('public_b2b.b2b_18') }}</h3>
            <p class="text-zinc-400 leading-relaxed flex-1">
              {{ $t('public_b2b.b2b_19') }}
            </p>
          </div>
          
          <!-- Tribunal de IA -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-teal-500/50 transition-colors group flex flex-col" v-motion-slide-visible-once-bottom>
            <div class="bg-teal-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-teal-400 mb-6 group-hover:scale-110 transition-transform">
              <Scale :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3">{{ $t('public_b2b.b2b_20') }}</h3>
            <p class="text-zinc-400 leading-relaxed flex-1">
              {{ $t('public_b2b.b2b_21') }}
            </p>
          </div>
          
          <!-- Pipeline Kanban -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-emerald-400/50 transition-colors group flex flex-col" v-motion-slide-visible-once-bottom>
            <div class="bg-emerald-400/10 w-14 h-14 rounded-2xl flex items-center justify-center text-emerald-300 mb-6 group-hover:scale-110 transition-transform">
              <Kanban :size="28" />
            </div>
            <h3 class="text-xl font-bold mb-3">{{ $t('public_b2b.b2b_22') }}</h3>
            <p class="text-zinc-400 leading-relaxed flex-1">
              {{ $t('public_b2b.b2b_23') }}
            </p>
          </div>
        </div>
      </section>

      <!-- DEMO TRIBUNAL VISUAL -->
      <section class="w-full bg-zinc-900/30 border-y border-white/5 py-24 mb-32">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
            <h2 class="text-3xl md:text-4xl font-bold mb-4">{{ $t('public_b2b.b2b_24') }}</h2>
            <p class="text-zinc-400">{{ $t('public_b2b.b2b_25') }}</p>
          </div>
          
          <div class="rounded-3xl border border-white/10 bg-black/60 backdrop-blur-sm p-6 md:p-10 shadow-2xl relative overflow-hidden" v-motion-slide-visible-once-bottom>
            <div class="absolute inset-0 bg-gradient-to-r from-emerald-500/5 to-teal-500/5"></div>
            
            <div class="relative z-10 flex flex-col gap-6">
              <!-- Pregunta del Hunter -->
              <div class="self-center bg-zinc-800 border border-white/10 p-4 rounded-xl text-center shadow-lg w-full max-w-lg mb-4">
                <span class="text-xs text-emerald-400 font-bold uppercase tracking-wide block mb-1">{{ $t('public_b2b.b2b_26') }}</span>
                {{ $t('public_b2b.b2b_27') }}
              </div>
              
              <!-- Respuestas Clones -->
              <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
                <!-- Clon A -->
                <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-blue-900/50 flex items-center justify-center text-xs font-bold text-blue-300">{{ $t('public_b2b.b2b_28') }}</div>
                    <div>
                      <div class="font-bold text-sm">{{ $t('public_b2b.b2b_29') }}</div>
                      <div class="text-xs text-zinc-500">{{ $t('public_b2b.b2b_30') }}</div>
                    </div>
                  </div>
                  <p class="text-sm text-zinc-300 leading-relaxed italic">
                    {{ $t('public_b2b.b2b_31') }}
                  </p>
                </div>
                
                <!-- Clon B -->
                <div class="bg-white/5 border border-white/10 rounded-2xl p-6">
                  <div class="flex items-center gap-3 mb-4">
                    <div class="w-8 h-8 rounded-full bg-purple-900/50 flex items-center justify-center text-xs font-bold text-purple-300">{{ $t('public_b2b.b2b_32') }}</div>
                    <div>
                      <div class="font-bold text-sm">{{ $t('public_b2b.b2b_33') }}</div>
                      <div class="text-xs text-zinc-500">{{ $t('public_b2b.b2b_34') }}</div>
                    </div>
                  </div>
                  <p class="text-sm text-zinc-300 leading-relaxed italic">
                    {{ $t('public_b2b.b2b_35') }}
                  </p>
                </div>
              </div>
              
              <!-- Moderador IA -->
              <div class="mt-4 self-center bg-emerald-900/20 border border-emerald-500/30 p-5 rounded-xl w-full">
                <div class="flex items-center justify-center gap-2 text-emerald-400 font-bold mb-2">
                  <Scale :size="18" /> {{ $t('public_b2b.b2b_36') }}
                </div>
                <p class="text-sm text-zinc-300 text-center">
                  <strong>{{ $t('public_b2b.b2b_37') }}</strong> {{ $t('public_b2b.b2b_38') }} <strong>{{ $t('public_b2b.b2b_39') }}</strong> {{ $t('public_b2b.b2b_40') }} <strong>{{ $t('public_b2b.b2b_41') }}</strong> {{ $t('public_b2b.b2b_42') }}
                </p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <div class="p-12 rounded-3xl bg-gradient-to-br from-emerald-900/40 to-black border border-emerald-500/20 shadow-[0_0_50px_rgba(16,185,129,0.15)]">
          <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">{{ $t('public_b2b.b2b_43') }}</h2>
          <p class="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
            {{ $t('public_b2b.b2b_44') }}
          </p>
          <router-link to="/onboarding/role-selection">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold bg-emerald-600 hover:bg-emerald-500 border-emerald-400">
              {{ $t('public_b2b.b2b_45') }}
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Construyendo el puente entre el talento y la industria.</p>
    </footer>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  ArrowRight,
  CheckCircle2, 
  XCircle,
  Clock,
  Target,
  Search,
  Scale,
  Kanban,
  Building2
} from 'lucide-vue-next'
</script>
