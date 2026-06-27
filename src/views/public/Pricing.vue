<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO PRICING -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center mb-16" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-white/20 text-zinc-300 bg-white/5 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          {{ $t('public_pricing.pricing_1') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          {{ $t('public_pricing.pricing_2') }} <span class="bg-gradient-to-r from-amber-400 to-orange-400 bg-clip-text text-transparent">{{ $t('public_pricing.pricing_3') }}</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-2xl mx-auto font-light mb-10">
          {{ $t('public_pricing.pricing_4') }}
        </p>

        <!-- TABS (TALENTOS VS EMPRESAS) -->
        <div class="inline-flex bg-zinc-900 border border-white/10 rounded-full p-1 relative shadow-xl">
          <button 
            @click="activeTab = 'talentos'" 
            class="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10"
            :class="activeTab === 'talentos' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            {{ $t('public_pricing.pricing_5') }}
          </button>
          <button 
            @click="activeTab = 'empresas'" 
            class="px-8 py-3 rounded-full text-sm font-bold transition-all duration-300 z-10"
            :class="activeTab === 'empresas' ? 'text-white' : 'text-zinc-500 hover:text-zinc-300'"
          >
            {{ $t('public_pricing.pricing_6') }}
          </button>
          <!-- Indicador animado -->
          <div 
            class="absolute top-1 bottom-1 w-[calc(50%-4px)] bg-zinc-800 border border-white/5 shadow-md rounded-full transition-all duration-300 ease-out"
            :class="activeTab === 'talentos' ? 'left-1' : 'translate-x-full left-1'"
          ></div>
        </div>
      </section>

      <!-- PRECIOS TALENTOS -->
      <section v-show="activeTab === 'talentos'" class="w-full max-w-7xl mx-auto px-6 mb-24 transition-opacity duration-500">
        <div class="grid grid-cols-1 md:grid-cols-3 gap-8">
          
          <!-- Plan Inicial (Free) -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-white/20 transition-colors relative">
            <h3 class="text-xl font-bold text-white mb-2">{{ $t('public_pricing.pricing_7') }}</h3>
            <div class="text-zinc-400 text-sm mb-6 min-h-[40px]">{{ $t('public_pricing.pricing_8') }}</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">{{ $t('public_pricing.pricing_9') }}</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-white border-white/20 hover:bg-white/5 py-3">{{ $t('public_pricing.pricing_10') }}</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300 flex-1">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_11') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_12') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_13') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_14') }}</li>
            </ul>
          </div>

          <!-- Plan PRO -->
          <div class="rounded-3xl border border-blue-500/50 bg-gradient-to-b from-blue-900/20 to-black p-8 flex flex-col shadow-[0_0_40px_rgba(59,130,246,0.15)] relative transform md:-translate-y-4">
            <div class="absolute top-0 left-1/2 -translate-x-1/2 -translate-y-1/2 bg-gradient-to-r from-blue-500 to-cyan-400 text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">{{ $t('public_pricing.pricing_15') }}</div>
            <h3 class="text-xl font-bold text-white mb-2">{{ $t('public_pricing.pricing_16') }}</h3>
            <div class="text-blue-200 text-sm mb-6 min-h-[40px]">{{ $t('public_pricing.pricing_17') }}</div>
            <div class="mb-2">
              <span class="text-5xl font-extrabold text-white">$7.99</span><span class="text-zinc-400"> {{ $t('public_pricing.pricing_18') }}</span>
            </div>
            <div class="text-xs text-blue-400 mb-6 font-medium">{{ $t('public_pricing.pricing_19') }}</div>
            <router-link to="/register" class="mb-8">
              <NeonButton glow variant="primary" class="w-full bg-blue-600 hover:bg-blue-500 border-blue-400 text-white py-3">{{ $t('public_pricing.pricing_20') }}</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-200 flex-1">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_21') }}</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_22') }}</strong> {{ $t('public_pricing.pricing_23') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_24') }}</strong> {{ $t('public_pricing.pricing_25') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> {{ $t('public_pricing.pricing_26') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-blue-400 shrink-0" /> {{ $t('public_pricing.pricing_27') }}</li>
            </ul>
          </div>

          <!-- Plan Hacker (BYOK) -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-amber-500/30 transition-colors relative">
            <h3 class="text-xl font-bold text-amber-400 mb-2">{{ $t('public_pricing.pricing_28') }}</h3>
            <div class="text-zinc-400 text-sm mb-6 min-h-[40px]">{{ $t('public_pricing.pricing_29') }}</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$2.99</span><span class="text-zinc-400"> {{ $t('public_pricing.pricing_30') }}</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-amber-400 border-amber-500/30 hover:bg-amber-500/10 py-3">{{ $t('public_pricing.pricing_31') }}</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300 flex-1">
              <li class="flex items-start gap-3"><Key :size="18" class="text-amber-500 shrink-0" /> <strong>{{ $t('public_pricing.pricing_32') }}</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> {{ $t('public_pricing.pricing_33') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> {{ $t('public_pricing.pricing_34') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-amber-500 shrink-0" /> {{ $t('public_pricing.pricing_35') }}</li>
            </ul>
          </div>
          
        </div>
      </section>

      <!-- PRECIOS EMPRESAS -->
      <section v-show="activeTab === 'empresas'" class="w-full max-w-5xl mx-auto px-6 mb-24 transition-opacity duration-500">
        <div class="grid grid-cols-1 md:grid-cols-2 gap-8">
          
          <!-- Plan Starter B2B -->
          <div class="rounded-3xl border border-white/10 bg-zinc-900/40 p-8 flex flex-col hover:border-white/20 transition-colors">
            <h3 class="text-2xl font-bold text-white mb-2">{{ $t('public_pricing.pricing_36') }}</h3>
            <div class="text-zinc-400 text-sm mb-6">{{ $t('public_pricing.pricing_37') }}</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$49</span><span class="text-zinc-400"> {{ $t('public_pricing.pricing_38') }}</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton variant="outline" class="w-full text-white border-white/20 hover:bg-white/5 py-3">{{ $t('public_pricing.pricing_39') }}</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> <strong>{{ $t('public_pricing.pricing_40') }}</strong> {{ $t('public_pricing.pricing_41') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_42') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-500 shrink-0" /> <strong>{{ $t('public_pricing.pricing_43') }}</strong> {{ $t('public_pricing.pricing_44') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_45') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-zinc-500 shrink-0" /> {{ $t('public_pricing.pricing_46') }}</li>
            </ul>
          </div>

          <!-- Plan Scale B2B -->
          <div class="rounded-3xl border border-emerald-500/50 bg-gradient-to-b from-emerald-900/20 to-black p-8 flex flex-col shadow-[0_0_40px_rgba(16,185,129,0.1)] relative">
            <div class="absolute top-0 right-8 -translate-y-1/2 bg-emerald-500 text-black font-bold text-xs px-4 py-1 rounded-full uppercase tracking-widest shadow-lg">{{ $t('public_pricing.pricing_47') }}</div>
            <h3 class="text-2xl font-bold text-white mb-2">{{ $t('public_pricing.pricing_48') }}</h3>
            <div class="text-emerald-200 text-sm mb-6">{{ $t('public_pricing.pricing_49') }}</div>
            <div class="mb-8">
              <span class="text-5xl font-extrabold text-white">$199</span><span class="text-zinc-400"> {{ $t('public_pricing.pricing_50') }}</span>
            </div>
            <router-link to="/register" class="mb-8">
              <NeonButton glow variant="primary" class="w-full bg-emerald-600 hover:bg-emerald-500 border-emerald-400 text-white py-3">{{ $t('public_pricing.pricing_51') }}</NeonButton>
            </router-link>
            <ul class="space-y-4 text-sm text-zinc-200">
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_52') }}</strong> {{ $t('public_pricing.pricing_53') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_54') }}</strong></li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> <strong>{{ $t('public_pricing.pricing_55') }}</strong> {{ $t('public_pricing.pricing_56') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> {{ $t('public_pricing.pricing_57') }}</li>
              <li class="flex items-start gap-3"><CheckCircle2 :size="18" class="text-emerald-400 shrink-0" /> {{ $t('public_pricing.pricing_58') }}</li>
            </ul>
          </div>
          
        </div>
      </section>

      <!-- FAQ FINANCIERO -->
      <section class="w-full max-w-3xl mx-auto px-6 mb-24 text-left">
        <h2 class="text-2xl md:text-3xl font-bold text-center mb-10">{{ $t('public_pricing.pricing_59') }}</h2>
        <div class="space-y-4">
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>{{ $t('public_pricing.pricing_60') }}</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              {{ $t('public_pricing.pricing_61') }}
            </div>
          </details>
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>{{ $t('public_pricing.pricing_62') }}</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              {{ $t('public_pricing.pricing_63') }}
            </div>
          </details>
          <details class="group bg-white/5 border border-white/10 rounded-2xl open:bg-white/10 transition-colors">
            <summary class="flex justify-between items-center font-medium cursor-pointer list-none p-6 text-lg">
              <span>{{ $t('public_pricing.pricing_64') }}</span>
              <span class="transition group-open:rotate-180"><ChevronDown :size="20" /></span>
            </summary>
            <div class="text-zinc-400 px-6 pb-6 leading-relaxed">
              {{ $t('public_pricing.pricing_65') }}
            </div>
          </details>
        </div>
      </section>

    </main>

    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Precios transparentes para todos.</p>
    </footer>
  </div>
</template>

<script setup>
import { useI18n } from 'vue-i18n'
const { t, locale } = useI18n()
import { ref } from 'vue'
import LandingNavbar from '../../components/public/LandingNavbar.vue'
import NeonButton from '../../components/ui/NeonButton.vue'
import Badge from '../../components/ui/Badge.vue'
import { 
  CheckCircle2, 
  Key,
  ChevronDown,
  ArrowRight
} from 'lucide-vue-next'

const activeTab = ref('talentos')
</script>
