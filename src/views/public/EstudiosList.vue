<template>
  <div class="container py-8 max-w-4xl mx-auto px-4">
    <section class="animate-in fade-in slide-in-from-bottom-4 duration-500">
      <h2 class="text-3xl font-extrabold text-foreground mb-8 pb-4 border-b border-border/50 flex items-center gap-3">
        <GraduationCap :size="32" class="text-amber-500" />
        {{ locale === 'en' ? 'Education & Certifications' : 'Estudios & Certificaciones' }}
      </h2>
      
      <div v-if="estudiosStore.loading" class="flex justify-center py-20"><div class="w-10 h-10 border-4 border-amber-500/30 border-t-amber-500 rounded-full animate-spin"></div></div>
      <div v-else-if="!estudiosStore.items.length" class="text-center py-20 text-muted-foreground bg-secondary/30 rounded-xl border border-dashed border-border/50">
        {{ locale === 'en' ? 'No education records found.' : 'Sin estudios registrados.' }}
      </div>
      
      <div v-else class="flex flex-col gap-4">
        <router-link v-for="e in sortedEstudios" :key="e.item.id" :to="`/estudios/${e.item.id}`" class="block outline-none group">
          <GlassCard hoverEffect class="flex items-center gap-6 p-5 transition-transform group-hover:translate-x-2 border-border/50 hover:border-amber-500/30">
            <div class="w-16 h-16 sm:w-20 sm:h-20 rounded-xl border border-border/50 bg-secondary flex items-center justify-center overflow-hidden shrink-0 group-hover:border-amber-500/50 transition-colors">
              <img v-if="e.tData.image_url" :src="e.tData.image_url" :alt="e.tData.institucion" class="w-full h-full object-cover" />
              <Building2 v-else :size="32" class="text-muted-foreground" />
            </div>
            
            <div class="flex-1 min-w-0">
              <h3 class="text-lg sm:text-xl font-bold text-foreground mb-1 truncate group-hover:text-amber-500 transition-colors">{{ e.tData.titulo }}</h3>
              <span class="text-sm text-muted-foreground flex items-center gap-1.5"><Building2 :size="14" class="text-amber-500/70" /> {{ e.tData.institucion }}</span>
            </div>
            
            <div class="text-3xl sm:text-4xl font-black text-amber-500/20 group-hover:text-amber-500/40 transition-colors shrink-0">
              {{ e.tData.anio_obtencion }}
            </div>
          </GlassCard>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEstudiosStore } from '../../stores/estudios'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'
import GlassCard from '../../components/ui/GlassCard.vue'
import { GraduationCap, Building2 } from 'lucide-vue-next'

const estudiosStore = useEstudiosStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const sortedEstudios = computed(() => {
  const items = [...estudiosStore.items].sort((a, b) => b.anio_obtencion - a.anio_obtencion)
  return items.map(item => ({
    item,
    tData: getTranslated(item, locale.value)
  }))
})

onMounted(() => {
  estudiosStore.fetchAll()
})
</script>
