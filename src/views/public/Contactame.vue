<template>
  <div class="container py-8 max-w-2xl mx-auto px-4">
    <section class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 class="text-3xl font-extrabold text-foreground mb-8 text-center flex items-center justify-center gap-2">
        <Mail :size="28" class="text-primary" /> {{ $t('nav.contact') }}
      </h2>
      
      <div v-if="perfilStore.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-primary/30 border-t-primary rounded-full animate-spin"></div></div>
      <div v-else-if="!perfil" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">Información de contacto no disponible.</div>
      
      <GlassCard v-else class="p-8 md:p-10 relative overflow-hidden">
        <!-- Decoración de fondo -->
        <div class="absolute -top-10 -right-10 text-primary/5 pointer-events-none">
          <MessageCircle :size="200" />
        </div>
        
        <div class="flex flex-col sm:flex-row items-center sm:items-start gap-6 mb-8 pb-8 border-b border-border/50 relative z-10 text-center sm:text-left">
          <div class="w-24 h-24 rounded-full p-1 border-2 border-primary/20 bg-background/50 backdrop-blur-sm shrink-0 shadow-lg">
            <img v-if="tData.avatar_url" :src="tData.avatar_url" alt="Avatar" class="w-full h-full object-cover rounded-full" />
            <div v-else class="w-full h-full rounded-full bg-secondary flex items-center justify-center">
              <User :size="32" class="text-muted-foreground" />
            </div>
          </div>
          <div>
            <h3 class="text-2xl font-bold text-foreground mb-1">{{ tData.nombre_completo || 'Jaime Campillay' }}</h3>
            <p v-if="tData.ciudad" class="text-muted-foreground flex items-center justify-center sm:justify-start gap-1">
              <MapPin :size="16" class="text-primary" /> {{ tData.ciudad }}
            </p>
          </div>
        </div>
        
        <div class="flex flex-col gap-6 relative z-10">
          <a v-if="tData.email" :href="`mailto:${tData.email}`" class="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-primary/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Mail :size="24" class="text-primary" />
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{{ $t('contact.email') }}</span>
              <span class="text-foreground font-medium group-hover:text-primary transition-colors">{{ tData.email }}</span>
            </div>
          </a>
          
          <a v-if="tData.telefono" :href="`tel:${tData.telefono.replace(/\s+/g, '')}`" class="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-emerald-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Phone :size="24" class="text-emerald-500" />
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">{{ $t('contact.phone') }}</span>
              <span class="text-foreground font-medium group-hover:text-emerald-500 transition-colors">{{ tData.telefono }}</span>
            </div>
          </a>
          
          <a v-if="tData.linkedin" :href="tData.linkedin" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-blue-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Linkedin :size="24" class="text-blue-500" />
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">LinkedIn</span>
              <span class="text-foreground font-medium group-hover:text-blue-500 transition-colors">{{ $t('contact.linkedin_profile') }}</span>
            </div>
          </a>
          
          <a v-if="tData.github" :href="tData.github" target="_blank" rel="noopener noreferrer" class="flex items-center gap-4 p-4 rounded-xl hover:bg-secondary/50 border border-transparent hover:border-border/50 transition-all group">
            <div class="w-12 h-12 rounded-full bg-purple-500/10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
              <Github :size="24" class="text-purple-500" />
            </div>
            <div>
              <span class="block text-xs font-bold uppercase tracking-wider text-muted-foreground mb-0.5">GitHub</span>
              <span class="text-foreground font-medium group-hover:text-purple-500 transition-colors">{{ $t('contact.github_profile') }}</span>
            </div>
          </a>
        </div>
      </GlassCard>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePerfilStore } from '../../stores/perfil'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import { Mail, MapPin, Phone, Linkedin, Github, MessageCircle, User } from 'lucide-vue-next'

const perfilStore = usePerfilStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const perfil = computed(() => perfilStore.items[0])
const tData = computed(() => perfil.value ? getTranslated(perfil.value, locale.value) : {})

onMounted(() => {
  perfilStore.fetchAll()
})
</script>
