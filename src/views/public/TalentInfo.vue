<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-blue-500/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO SECTION -->
      <section class="w-full max-w-6xl mx-auto px-6 text-center mb-24" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-blue-500/30 text-blue-400 bg-blue-500/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          {{ $t('public_talent.talent_1') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-7xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          {{ $t('public_talent.talent_2') }}<br />
          {{ $t('public_talent.talent_3') }} <span class="bg-gradient-to-r from-blue-400 to-cyan-300 bg-clip-text text-transparent">{{ $t('public_talent.talent_4') }}</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
          {{ $t('public_talent.talent_5') }}
        </p>
        <div class="mt-10 flex justify-center">
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold shadow-lg shadow-blue-500/30 bg-blue-600 hover:bg-blue-500 border-blue-400">
              {{ $t('public_talent.talent_6') }}
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

      <!-- DOLOR Y SOLUCIÓN -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="grid grid-cols-1 lg:grid-cols-2 gap-12 items-center">
          <div class="p-8 rounded-3xl bg-red-950/10 border border-red-900/30" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6">
              <div class="w-10 h-10 rounded-full bg-red-900/30 flex items-center justify-center text-red-400">
                <XCircle :size="24" />
              </div>
              <h3 class="text-2xl font-bold text-zinc-200">{{ $t('public_talent.talent_7') }}</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              {{ $t('public_talent.talent_8') }}
            </p>
          </div>
          
          <div class="p-8 rounded-3xl bg-blue-900/10 border border-blue-500/30 shadow-[0_0_40px_rgba(59,130,246,0.1)] relative overflow-hidden" v-motion-slide-visible-once-bottom>
            <div class="absolute inset-0 bg-gradient-to-br from-blue-500/5 to-transparent"></div>
            <div class="relative z-10">
              <div class="flex items-center gap-3 mb-6">
                <div class="w-10 h-10 rounded-full bg-blue-500/20 flex items-center justify-center text-blue-400">
                  <CheckCircle2 :size="24" />
                </div>
                <h3 class="text-2xl font-bold text-white">{{ $t('public_talent.talent_9') }}</h3>
              </div>
              <p class="text-zinc-300 leading-relaxed mb-6">
                {{ $t('public_talent.talent_10') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- BENEFICIOS CLAVE -->
      <section class="w-full bg-zinc-900/30 border-y border-white/5 py-24 mb-32">
        <div class="max-w-6xl mx-auto px-6">
          <div class="text-center mb-16" v-motion-slide-visible-once-bottom>
            <h2 class="text-3xl md:text-5xl font-bold mb-4">{{ $t('public_talent.talent_11') }}</h2>
            <p class="text-zinc-400">{{ $t('public_talent.talent_12') }}</p>
          </div>
          
          <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-blue-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-blue-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-400 mb-6 group-hover:scale-110 transition-transform">
                <BrainCircuit :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">{{ $t('public_talent.talent_13') }}</h3>
              <p class="text-zinc-400 leading-relaxed">
                {{ $t('public_talent.talent_14') }}
              </p>
            </div>
            
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-cyan-500/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-cyan-500/10 w-14 h-14 rounded-2xl flex items-center justify-center text-cyan-400 mb-6 group-hover:scale-110 transition-transform">
                <TrendingUp :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">{{ $t('public_talent.talent_15') }}</h3>
              <p class="text-zinc-400 leading-relaxed">
                {{ $t('public_talent.talent_16') }}
              </p>
            </div>
            
            <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-blue-400/50 transition-colors group" v-motion-slide-visible-once-bottom>
              <div class="bg-blue-400/10 w-14 h-14 rounded-2xl flex items-center justify-center text-blue-300 mb-6 group-hover:scale-110 transition-transform">
                <Trophy :size="28" />
              </div>
              <h3 class="text-xl font-bold mb-3">{{ $t('public_talent.talent_17') }}</h3>
              <p class="text-zinc-400 leading-relaxed">
                {{ $t('public_talent.talent_18') }} <em>{{ $t('public_talent.talent_19') }}</em> {{ $t('public_talent.talent_20') }}
              </p>
            </div>
          </div>
        </div>
      </section>

      <!-- CASOS DE USO -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-5xl font-bold text-center mb-16" v-motion-slide-visible-once-bottom>{{ $t('public_talent.talent_21') }}</h2>
        
        <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
          <!-- Devs & Architects -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-emerald-400">
              <Code2 :size="28" />
              <h3 class="text-xl font-bold text-white">{{ $t('public_talent.talent_22') }}</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              {{ $t('public_talent.talent_23') }}
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>{{ $t('public_talent.talent_24') }}</li>
              <li>{{ $t('public_talent.talent_25') }}</li>
              <li>{{ $t('public_talent.talent_26') }}</li>
            </ul>
          </div>
          
          <!-- PMs & Líderes -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-purple-400">
              <Terminal :size="28" />
              <h3 class="text-xl font-bold text-white">{{ $t('public_talent.talent_27') }}</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              {{ $t('public_talent.talent_28') }}
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>{{ $t('public_talent.talent_29') }}</li>
              <li>{{ $t('public_talent.talent_30') }}</li>
              <li>{{ $t('public_talent.talent_31') }}</li>
            </ul>
          </div>
          
          <!-- Diseño UX/UI -->
          <div class="rounded-3xl border border-white/10 bg-gradient-to-b from-zinc-900 to-black p-8" v-motion-slide-visible-once-bottom>
            <div class="flex items-center gap-3 mb-6 text-pink-400">
              <PenTool :size="28" />
              <h3 class="text-xl font-bold text-white">{{ $t('public_talent.talent_32') }}</h3>
            </div>
            <p class="text-zinc-400 leading-relaxed mb-6">
              {{ $t('public_talent.talent_33') }}
            </p>
            <ul class="text-sm text-zinc-500 space-y-2">
              <li>{{ $t('public_talent.talent_34') }}</li>
              <li>{{ $t('public_talent.talent_35') }}</li>
              <li>{{ $t('public_talent.talent_36') }}</li>
            </ul>
          </div>
        </div>
      </section>

      <!-- TESTIMONIOS -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-16" v-motion-slide-visible-once-bottom>{{ $t('public_talent.talent_37') }}</h2>
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 relative" v-motion-slide-visible-once-bottom>
            <MessageSquare :size="40" class="text-white/10 absolute top-8 right-8" />
            <p class="text-zinc-300 italic leading-relaxed mb-8 relative z-10">
              {{ $t('public_talent.talent_38') }}
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-blue-900/50 flex items-center justify-center font-bold text-blue-300 border border-blue-500/30">{{ $t('public_talent.talent_39') }}</div>
              <div>
                <h4 class="font-bold text-white">{{ $t('public_talent.talent_40') }}</h4>
                <p class="text-sm text-zinc-500">{{ $t('public_talent.talent_41') }}</p>
              </div>
            </div>
          </div>
          
          <div class="p-8 rounded-3xl bg-white/5 border border-white/10 relative" v-motion-slide-visible-once-bottom>
            <MessageSquare :size="40" class="text-white/10 absolute top-8 right-8" />
            <p class="text-zinc-300 italic leading-relaxed mb-8 relative z-10">
              {{ $t('public_talent.talent_42') }}
            </p>
            <div class="flex items-center gap-4">
              <div class="w-12 h-12 rounded-full bg-emerald-900/50 flex items-center justify-center font-bold text-emerald-300 border border-emerald-500/30">{{ $t('public_talent.talent_43') }}</div>
              <div>
                <h4 class="font-bold text-white">{{ $t('public_talent.talent_44') }}</h4>
                <p class="text-sm text-zinc-500">{{ $t('public_talent.talent_45') }}</p>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <div class="p-12 rounded-3xl bg-gradient-to-br from-blue-900/40 to-black border border-blue-500/20 shadow-[0_0_50px_rgba(59,130,246,0.15)]">
          <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">{{ $t('public_talent.talent_46') }}</h2>
          <p class="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
            {{ $t('public_talent.talent_47') }}
          </p>
          <router-link to="/register">
            <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold bg-blue-600 hover:bg-blue-500 border-blue-400">
              {{ $t('public_talent.talent_48') }}
              <ArrowRight :size="20" class="inline ml-2" />
            </NeonButton>
          </router-link>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Impulsando el talento tecnológico mundial.</p>
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
  BrainCircuit,
  TrendingUp,
  Trophy,
  Code2,
  Terminal,
  PenTool,
  MessageSquare
} from 'lucide-vue-next'
</script>
