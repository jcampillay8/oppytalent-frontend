<template>
  <AdminLayout>
    <div class="mb-8">
      <h1 class="text-3xl font-extrabold tracking-tight text-foreground flex items-center gap-2">
        <Palette :size="32" class="text-primary" /> Apariencia y Contenido
      </h1>
      <p class="text-muted-foreground mt-1">Personaliza el diseño, la estructura y los mensajes de tu vitrina profesional.</p>
    </div>

    <!-- Tabs Header -->
    <div class="flex overflow-x-auto border-b border-border/50 mb-6 pb-2 gap-6 no-scrollbar">
      <button 
        @click="activeTab = 'theme'"
        class="pb-2 text-sm font-bold transition-all relative whitespace-nowrap"
        :class="activeTab === 'theme' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        🎨 Tema y Diseño
        <div v-if="activeTab === 'theme'" class="absolute -bottom-[9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"></div>
      </button>
      <button 
        @click="activeTab = 'sections'"
        class="pb-2 text-sm font-bold transition-all relative whitespace-nowrap"
        :class="activeTab === 'sections' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        🧱 Estructura de Secciones
        <div v-if="activeTab === 'sections'" class="absolute -bottom-[9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"></div>
      </button>
      <button 
        @click="activeTab = 'frases'"
        class="pb-2 text-sm font-bold transition-all relative whitespace-nowrap"
        :class="activeTab === 'frases' ? 'text-primary' : 'text-muted-foreground hover:text-foreground'"
      >
        💬 Textos y Frases
        <div v-if="activeTab === 'frases'" class="absolute -bottom-[9px] left-0 right-0 h-[3px] bg-primary rounded-t-full"></div>
      </button>
    </div>

    <!-- Tab Content -->
    <div class="mt-6">
      <ThemeConfig v-if="activeTab === 'theme'" />
      <SeccionesConfig v-if="activeTab === 'sections'" />
      <FrasesConfig v-if="activeTab === 'frases'" />
    </div>
  </AdminLayout>
</template>

<script setup>
import { ref } from 'vue'
import AdminLayout from '../../components/admin/AdminLayout.vue'
import ThemeConfig from './ThemeConfigAdmin.vue'
import SeccionesConfig from './SeccionesAdmin.vue'
import FrasesConfig from './FrasesAdmin.vue'
import { Palette } from 'lucide-vue-next'

const activeTab = ref('theme')
</script>

<style scoped>
.no-scrollbar::-webkit-scrollbar {
  display: none;
}
.no-scrollbar {
  -ms-overflow-style: none;
  scrollbar-width: none;
}
</style>
