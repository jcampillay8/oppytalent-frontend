<template>
  <div class="min-h-screen text-zinc-50 flex flex-col font-sans bg-[#050505] selection:bg-primary/30">
    <LandingNavbar />
    
    <main class="flex-1 flex flex-col items-center pt-28 md:pt-32 pb-20">
      
      <!-- HERO FEATURES -->
      <section class="w-full max-w-6xl mx-auto px-6 text-center mb-24" v-motion-slide-visible-once-bottom>
        <Badge variant="outline" class="mb-6 border-primary/30 text-primary/90 bg-primary/10 uppercase tracking-wider backdrop-blur-sm px-3 py-1 text-xs font-semibold">
          {{ $t('public_features.features_1') }}
        </Badge>
        <h1 class="text-4xl md:text-5xl lg:text-6xl font-extrabold leading-tight tracking-tight mb-6 text-white drop-shadow-sm">
          {{ $t('public_features.features_2') }}<br />
          {{ $t('public_features.features_3') }} <span class="bg-gradient-to-r from-indigo-400 via-purple-400 to-pink-400 bg-clip-text text-transparent">{{ $t('public_features.features_4') }}</span>
        </h1>
        <p class="text-lg md:text-xl text-zinc-400 leading-relaxed max-w-3xl mx-auto font-light">
          {{ $t('public_features.features_5') }}
        </p>
      </section>

      <!-- FEATURE: CLON DIGITAL (RAG) -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-primary/10 w-fit rounded-2xl mb-6">
              <Bot :size="32" class="text-primary" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">{{ $t('public_features.features_6') }}</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              {{ $t('public_features.features_7') }} <strong>{{ $t('public_features.features_8') }}</strong>{{ $t('public_features.features_9') }}
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_10') }}</strong> {{ $t('public_features.features_11') }}</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_12') }}</strong> {{ $t('public_features.features_13') }}</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-primary shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_14') }}</strong> {{ $t('public_features.features_15') }}</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full" v-motion-slide-visible-once-bottom>
            <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 p-6 shadow-2xl">
              <div class="absolute inset-0 bg-gradient-to-br from-primary/10 to-purple-500/10 opacity-50"></div>
              <div class="relative z-10 flex flex-col gap-4">
                <div class="self-end bg-white/10 p-3 rounded-2xl rounded-tr-none max-w-[80%] border border-white/5 text-sm">
                  {{ $t('public_features.features_16') }}
                </div>
                <div class="self-start bg-primary/20 border border-primary/30 p-4 rounded-2xl rounded-tl-none max-w-[90%] text-sm shadow-[0_0_15px_rgba(59,130,246,0.15)]">
                  <div class="flex items-center gap-2 mb-2 font-semibold text-primary"><Sparkles :size="14" /> {{ $t('public_features.features_17') }}</div>
                  {{ $t('public_features.features_18') }}
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: CV WIZARD -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row-reverse items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-orange-500/10 w-fit rounded-2xl mb-6">
              <Wand2 :size="32" class="text-orange-400" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">{{ $t('public_features.features_19') }}</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              {{ $t('public_features.features_20') }}
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-orange-400 shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_21') }}</strong> {{ $t('public_features.features_22') }}</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-orange-400 shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_23') }}</strong> {{ $t('public_features.features_24') }}</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full" v-motion-slide-visible-once-bottom>
             <div class="relative rounded-3xl overflow-hidden border border-white/10 bg-zinc-900/50 p-8 shadow-2xl flex items-center justify-center min-h-[300px]">
                <div class="absolute inset-0 bg-gradient-to-tr from-orange-500/10 to-transparent opacity-50"></div>
                <div class="border-2 border-dashed border-orange-500/50 rounded-2xl p-10 flex flex-col items-center justify-center text-center bg-black/40 backdrop-blur-sm relative z-10 w-full max-w-sm">
                  <FileText :size="48" class="text-orange-400 mb-4" />
                  <div class="font-bold text-lg mb-2">{{ $t('public_features.features_25') }}</div>
                  <div class="text-sm text-zinc-500">{{ $t('public_features.features_26') }}</div>
                </div>
             </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: DISEÑO & UI -->
      <section class="w-full max-w-6xl mx-auto px-6 mb-32">
        <div class="flex flex-col lg:flex-row items-center gap-12 lg:gap-20">
          <div class="flex-1" v-motion-slide-visible-once-bottom>
            <div class="p-4 bg-purple-500/10 w-fit rounded-2xl mb-6">
              <LayoutTemplate :size="32" class="text-purple-400" />
            </div>
            <h2 class="text-3xl md:text-4xl font-bold mb-6">{{ $t('public_features.features_27') }}</h2>
            <p class="text-lg text-zinc-400 mb-6 leading-relaxed">
              {{ $t('public_features.features_28') }} <em>{{ $t('public_features.features_29') }}</em> {{ $t('public_features.features_30') }} <em>{{ $t('public_features.features_31') }}</em>.
            </p>
            <ul class="space-y-4 text-zinc-300">
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_32') }}</strong> {{ $t('public_features.features_33') }}</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_34') }}</strong> {{ $t('public_features.features_35') }}</span></li>
              <li class="flex items-start gap-3"><CheckCircle2 class="text-purple-400 shrink-0 mt-1" /> <span><strong>{{ $t('public_features.features_36') }}</strong> {{ $t('public_features.features_37') }}</span></li>
            </ul>
          </div>
          <div class="flex-1 w-full grid grid-cols-2 gap-4" v-motion-slide-visible-once-bottom>
             <div class="col-span-2 h-32 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
               <div class="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-transparent"></div>
               <div class="w-1/3 h-4 bg-white/20 rounded mb-2"></div>
               <div class="w-1/2 h-3 bg-white/10 rounded"></div>
             </div>
             <div class="h-40 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
                <div class="absolute inset-0 bg-gradient-to-b from-blue-500/20 to-transparent"></div>
                <div class="w-12 h-12 rounded-full bg-white/10 mb-4"></div>
             </div>
             <div class="h-40 rounded-2xl bg-zinc-900 border border-white/10 p-4 shadow-lg overflow-hidden relative">
               <div class="absolute inset-0 bg-gradient-to-t from-emerald-500/20 to-transparent"></div>
               <div class="w-full h-full border border-white/5 rounded-lg"></div>
             </div>
          </div>
        </div>
      </section>

      <!-- FEATURE: BYOK Y SEGURIDAD -->
      <section class="w-full bg-zinc-900/30 border-y border-white/5 py-24 mb-24">
        <div class="max-w-6xl mx-auto px-6 text-center">
          <div class="inline-flex items-center justify-center p-4 bg-emerald-500/10 rounded-full mb-8" v-motion-slide-visible-once-bottom>
            <Lock :size="40" class="text-emerald-400" />
          </div>
          <h2 class="text-3xl md:text-5xl font-bold mb-6" v-motion-slide-visible-once-bottom>{{ $t('public_features.features_38') }}</h2>
          <p class="text-lg md:text-xl text-zinc-400 max-w-3xl mx-auto leading-relaxed mb-12" v-motion-slide-visible-once-bottom>
            {{ $t('public_features.features_39') }} <strong>{{ $t('public_features.features_40') }}</strong>{{ $t('public_features.features_41') }} <strong>{{ $t('public_features.features_42') }}</strong> {{ $t('public_features.features_43') }}
          </p>
        </div>
      </section>

      <!-- TABLA COMPARATIVA -->
      <section class="w-full max-w-5xl mx-auto px-6 mb-32">
        <h2 class="text-3xl md:text-4xl font-bold text-center mb-12" v-motion-slide-visible-once-bottom>{{ $t('public_features.features_44') }}</h2>
        <div class="overflow-x-auto rounded-2xl border border-white/10 shadow-2xl bg-black/40 backdrop-blur-sm" v-motion-slide-visible-once-bottom>
          <table class="w-full text-left border-collapse">
            <thead>
              <tr class="bg-zinc-900/80 border-b border-white/10">
                <th class="p-6 font-semibold text-zinc-300 uppercase tracking-wider text-sm">{{ $t('public_features.features_45') }}</th>
                <th class="p-6 font-bold text-white uppercase tracking-wider text-sm bg-primary/10 border-l border-primary/20"><Sparkles :size="16" class="inline mr-2 text-primary" /> {{ $t('public_features.features_46') }}</th>
                <th class="p-6 font-semibold text-zinc-500 uppercase tracking-wider text-sm border-l border-white/10">{{ $t('public_features.features_47') }}</th>
                <th class="p-6 font-semibold text-zinc-500 uppercase tracking-wider text-sm border-l border-white/10">{{ $t('public_features.features_48') }}</th>
              </tr>
            </thead>
            <tbody class="text-zinc-300 divide-y divide-white/5">
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">{{ $t('public_features.features_49') }}</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">{{ $t('public_features.features_50') }}</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /> {{ $t('public_features.features_51') }}</td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">{{ $t('public_features.features_52') }}</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /> {{ $t('public_features.features_53') }}</td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /> {{ $t('public_features.features_54') }}</td>
                <td class="p-6 text-zinc-600 border-l border-white/10">{{ $t('public_features.features_55') }}</td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">{{ $t('public_features.features_56') }}</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
              <tr class="hover:bg-white/[0.02] transition-colors">
                <td class="p-6">{{ $t('public_features.features_57') }}</td>
                <td class="p-6 bg-primary/[0.03] border-l border-primary/20 text-emerald-400 font-bold"><CheckCircle2 :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
                <td class="p-6 text-zinc-600 border-l border-white/10"><XCircle :size="20" class="inline" /></td>
              </tr>
            </tbody>
          </table>
        </div>
      </section>

      <!-- CTA FINAL -->
      <section class="w-full max-w-4xl mx-auto px-6 text-center" v-motion-slide-visible-once-bottom>
        <div class="p-12 rounded-3xl bg-gradient-to-br from-primary/20 to-purple-500/20 border border-white/10 shadow-2xl relative overflow-hidden">
          <div class="absolute inset-0 bg-black/40 backdrop-blur-[2px]"></div>
          <div class="relative z-10">
            <h2 class="text-3xl md:text-5xl font-bold mb-6 text-white">{{ $t('public_features.features_58') }}</h2>
            <p class="text-lg text-zinc-300 mb-10 max-w-2xl mx-auto">
              {{ $t('public_features.features_59') }}
            </p>
            <router-link to="/register">
              <NeonButton glow variant="primary" class="px-8 py-4 text-lg font-bold shadow-lg shadow-primary/30">
                {{ $t('public_features.features_60') }}
                <ArrowRight :size="20" class="inline ml-2" />
              </NeonButton>
            </router-link>
          </div>
        </div>
      </section>

    </main>

    <!-- Footer Simple -->
    <footer class="w-full border-t border-white/10 py-12 text-center text-zinc-500">
      <p>© {{ new Date().getFullYear() }} OppyTalent. Plataforma de Empleabilidad Inteligente.</p>
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
  Bot, 
  Wand2, 
  LayoutTemplate, 
  Lock, 
  CheckCircle2, 
  XCircle, 
  ArrowRight,
  Sparkles,
  FileText,
  Network
} from 'lucide-vue-next'
</script>
