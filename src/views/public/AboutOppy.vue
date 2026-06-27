<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-purple-500/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HEADER -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center mb-16" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-purple-500/30 text-purple-400 bg-purple-500/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          {{ $t('public_about.about_1') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          {{ $t('public_about.about_2') }}<br />
          {{ $t('public_about.about_3') }} <span class="bg-gradient-to-r from-purple-400 to-pink-400 bg-clip-text text-transparent">{{ $t('public_about.about_4') }}</span>
        </h1>
      </section>

      <!-- CARTA ABIERTA (MANIFIESTO) -->
      <section class="w-full max-w-3xl mx-auto px-6 mb-24">
        <div class="bg-zinc-900/40 border border-white/10 rounded-3xl p-8 md:p-12 relative shadow-2xl overflow-hidden" v-motion-slide-visible-once-bottom>
          <!-- Decoración visual -->
          <div class="absolute top-0 right-0 w-64 h-64 bg-purple-500/10 rounded-full blur-3xl -translate-y-1/2 translate-x-1/3"></div>
          
          <div class="relative z-10 text-zinc-300 space-y-6 text-lg leading-relaxed font-light">
            <p class="font-medium text-white text-xl">{{ $t('public_about.about_5') }}</p>
            
            <p>
              {{ $t('public_about.about_6') }} <strong>{{ $t('public_about.about_7') }}</strong>
            </p>
            
            <p>
              {{ $t('public_about.about_8') }}
            </p>
            
            <p>
              <strong>{{ $t('public_about.about_9') }}</strong>
            </p>
            
            <p>
              {{ $t('public_about.about_10') }}
            </p>
            
            <p>
              {{ $t('public_about.about_11') }} <span class="text-white font-medium">{{ $t('public_about.about_12') }}</span> {{ $t('public_about.about_13') }}
            </p>
            
            <p>
              {{ $t('public_about.about_14') }} <strong>{{ $t('public_about.about_15') }}</strong> {{ $t('public_about.about_16') }}
            </p>
            
            <p>
              {{ $t('public_about.about_17') }}
            </p>
            
            <p class="font-medium text-purple-400 pt-4">
              {{ $t('public_about.about_18') }}<br />
              {{ $t('public_about.about_19') }}
            </p>
          </div>

          <!-- Perfil del Creador -->
          <div class="mt-12 pt-8 border-t border-white/10 flex flex-col md:flex-row items-center justify-between gap-6 relative z-10">
            <div class="flex items-center gap-4">
              <div class="w-16 h-16 rounded-full bg-gradient-to-tr from-purple-500 to-indigo-500 p-[2px]">
                <div class="w-full h-full bg-zinc-900 rounded-full flex items-center justify-center text-xl font-bold text-white">
                  {{ $t('public_about.about_20') }}
                </div>
              </div>
              <div>
                <h3 class="text-white font-bold text-lg">{{ $t('public_about.about_21') }}</h3>
                <p class="text-zinc-500 text-sm">{{ $t('public_about.about_22') }}</p>
              </div>
            </div>
            <router-link to="/jcampillayworks">
              <NeonButton variant="outline" class="border-purple-500/30 text-purple-300 hover:bg-purple-500/10 text-sm py-2">
                {{ $t('public_about.about_23') }}
              </NeonButton>
            </router-link>
          </div>
        </div>
      </section>

      <!-- VALORES CORE Y ROADMAP -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-24">
        <h2 class="text-3xl font-bold text-center mb-12" v-motion-slide-visible-once-bottom>{{ $t('public_about.about_24') }}</h2>
        
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          <!-- Transparencia -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-purple-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-purple-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-purple-400 mb-6">
              <Heart :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">{{ $t('public_about.about_25') }}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              {{ $t('public_about.about_26') }}
            </p>
          </div>

          <!-- Privacidad (BYOK) -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-indigo-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-indigo-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-indigo-400 mb-6">
              <ShieldCheck :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">{{ $t('public_about.about_27') }}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              {{ $t('public_about.about_28') }} <strong>{{ $t('public_about.about_29') }}</strong> {{ $t('public_about.about_30') }}
            </p>
          </div>

          <!-- Innovación (eAwards) -->
          <div class="bg-black/50 p-8 rounded-3xl border border-white/5 hover:border-pink-500/30 transition-colors" v-motion-slide-visible-once-bottom>
            <div class="bg-pink-500/10 w-12 h-12 rounded-2xl flex items-center justify-center text-pink-400 mb-6">
              <Trophy :size="24" />
            </div>
            <h3 class="text-xl font-bold mb-3 text-white">{{ $t('public_about.about_31') }}</h3>
            <p class="text-zinc-400 text-sm leading-relaxed">
              {{ $t('public_about.about_32') }} <strong>{{ $t('public_about.about_33') }}</strong>{{ $t('public_about.about_34') }}
            </p>
          </div>
        </div>
      </section>

      <!-- CTA -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <h2 class="text-3xl font-bold mb-6 text-white">{{ $t('public_about.about_35') }}</h2>
        <p class="text-lg text-zinc-400 mb-8 max-w-2xl mx-auto">
          {{ $t('public_about.about_36') }}
        </p>
        <div class="flex flex-col sm:flex-row items-center justify-center gap-4">
          <router-link to="/register" class="w-full sm:w-auto">
            <NeonButton glow variant="primary" class="w-full bg-purple-600 hover:bg-purple-500 border-purple-400 px-8 py-3">
              {{ $t('public_about.about_37') }}
            </NeonButton>
          </router-link>
          <router-link to="/features" class="w-full sm:w-auto">
            <NeonButton variant="outline" class="w-full text-zinc-300 border-white/10 hover:bg-white/5 px-8 py-3">
              {{ $t('public_about.about_38') }}
            </NeonButton>
          </router-link>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Hecho con pasión por el código.</p>
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
  Heart,
  ShieldCheck,
  Trophy
} from 'lucide-vue-next'
</script>
