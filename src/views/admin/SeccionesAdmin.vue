<template>
  <div class="w-full">

      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <GlassCard 
          v-for="s in secciones" 
          :key="s.key" 
          hoverEffect 
          class="flex items-center justify-between p-5"
        >
          <div class="flex items-center gap-4">
            <div class="p-3 rounded-lg border flex-shrink-0" :class="s.colorClass">
              <component :is="s.icon" :size="20" />
            </div>
            <div>
              <h3 class="font-bold text-lg text-foreground leading-tight mb-1">{{ s.label }}</h3>
              <p class="text-sm text-muted-foreground">{{ s.desc }}</p>
            </div>
          </div>
          
          <div class="flex items-center ml-4 shrink-0">
            <label class="relative inline-flex items-center cursor-pointer">
              <input 
                type="checkbox" 
                class="sr-only peer" 
                :checked="defaults[s.key]" 
                @change="e => updateToggle(s.key, e.target.checked)" 
              />
              <div class="w-11 h-6 bg-secondary peer-focus:outline-none peer-focus:ring-4 peer-focus:ring-primary/20 rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-white after:border-gray-300 after:border after:rounded-full after:h-5 after:w-5 after:transition-all peer-checked:bg-primary"></div>
              <span class="ml-3 text-sm font-medium" :class="defaults[s.key] ? 'text-primary' : 'text-muted-foreground'">
                {{ defaults[s.key] ? $t('admin.views.sections.visible') : $t('admin.views.sections.hidden') }}
              </span>
            </label>
          </div>
        </GlassCard>
      </div>
  </div>
</template>

<script setup>
import GlassCard from '../../components/ui/GlassCard.vue'
import { useSectionConfig } from '../../composables/useSectionConfig'
import { api } from '../../services/api'
import { onMounted } from 'vue'
import { FolderKanban, Briefcase, GraduationCap, Award, ShieldCheck } from 'lucide-vue-next'
import { useI18n } from 'vue-i18n'
import { toast } from 'vue3-toastify'

const { defaults, fetchConfigs } = useSectionConfig()
const { t } = useI18n()

onMounted(() => {
  fetchConfigs()
})

const updateToggle = async (key, value) => {
  try {
    await api.updateSeccionConfig(key, {
      seccion: key,
      is_expanded: value
    })
    defaults[key] = value
  } catch (error) {
    console.error('Error updating config:', error)
    toast.error(t('admin.views.sections.error_saving'))
  }
}

const secciones = [
  { key: 'proyectos', label: 'Proyectos Propios y Laborales', desc: 'Galería de proyectos y repositorios', icon: FolderKanban, colorClass: 'bg-blue-500/10 text-blue-500 border-blue-500/20' },
  { key: 'experiencia', label: 'Experiencia Laboral', desc: 'Historial y trayectoria profesional', icon: Briefcase, colorClass: 'bg-emerald-500/10 text-emerald-500 border-emerald-500/20' },
  { key: 'estudios', label: 'Estudios, Cursos & Certificaciones', desc: 'Formación académica y técnica', icon: GraduationCap, colorClass: 'bg-amber-500/10 text-amber-500 border-amber-500/20' },
  { key: 'reconocimientos', label: 'Reconocimientos & Publicaciones', desc: 'Hitos, premios y publicaciones', icon: Award, colorClass: 'bg-pink-500/10 text-pink-500 border-pink-500/20' },
  { key: 'habilitaciones', label: 'Disponibilidad & Licencias', desc: 'Permisos especiales y flexibilidad', icon: ShieldCheck, colorClass: 'bg-indigo-500/10 text-indigo-500 border-indigo-500/20' }
]
</script>
