<template>
  <div class="flex flex-col gap-4">
    <div 
      class="relative border-2 border-dashed rounded-xl p-8 text-center cursor-pointer transition-all duration-300 min-h-[160px] flex items-center justify-center overflow-hidden"
      :class="[
        isDragging ? 'border-primary bg-primary/10' : 'border-border/50 bg-secondary/30 hover:border-primary/50 hover:bg-secondary/50',
        modelValue && !uploading ? 'p-0 border-solid border-border/50' : ''
      ]"
      @click="triggerFileInput" 
      @dragover.prevent="isDragging = true" 
      @dragleave.prevent="isDragging = false" 
      @drop.prevent="handleDrop"
    >
      
      <input type="file" ref="fileInput" class="hidden" accept="image/*" @change="handleFileChange" />
      
      <!-- Si ya hay una imagen -->
      <div v-if="modelValue && !uploading" class="w-full h-[160px] relative group flex items-center justify-center bg-black/5 rounded-xl overflow-hidden">
        <img :src="parsedImageUrl" alt="Preview" class="max-w-full max-h-full object-contain drop-shadow-md" />
        <div class="absolute inset-0 bg-background/80 backdrop-blur-sm flex flex-col items-center justify-center opacity-0 group-hover:opacity-100 transition-all text-foreground">
          <div class="bg-primary/10 text-primary p-3 rounded-full mb-2">
            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round"><path d="M21 12a9 9 0 0 0-9-9 9.75 9.75 0 0 0-6.74 2.74L3 8"/><path d="M3 3v5h5"/><path d="M3 12a9 9 0 0 0 9 9 9.75 9.75 0 0 0 6.74-2.74L21 16"/><path d="M16 21v-5h5"/></svg>
          </div>
          <p class="text-sm font-medium">Haz clic para cambiar la imagen</p>
        </div>
      </div>
      
      <!-- Estado de carga -->
      <div v-else-if="uploading" class="flex flex-col items-center text-muted-foreground">
        <div class="w-8 h-8 border-4 border-white/10 border-t-primary rounded-full animate-spin mb-4"></div>
        <p class="text-sm font-medium">Subiendo imagen...</p>
      </div>
      
      <!-- Estado vacío -->
      <div v-else class="flex flex-col items-center text-muted-foreground">
        <span class="text-4xl mb-2">☁️</span>
        <p class="font-medium mb-2 text-foreground">Arrastra tu imagen o haz clic para subir</p>
        <small v-if="authStore.user?.is_premium" class="text-xs text-primary">Almacenamiento Ilimitado (Premium)</small>
        <small v-else class="text-xs text-muted-foreground">Almacenamiento Seguro Habilitado</small>
      </div>
    </div>
    
    <!-- Opción manual -->
    <div class="flex flex-col gap-2">
      <div class="relative text-center">
        <div class="absolute inset-0 flex items-center">
          <div class="w-full border-t border-border/50"></div>
        </div>
        <div class="relative flex justify-center text-xs">
          <span class="bg-card px-2 text-muted-foreground">o pega una URL manualmente</span>
        </div>
      </div>
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="w-full px-4 py-2.5 bg-background border border-border/50 rounded-lg text-sm text-foreground focus:outline-none focus:border-primary focus:ring-1 focus:ring-primary/50" 
        placeholder="https://ejemplo.com/imagen.png"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue'
import { api } from '../../services/api'
import { parseImageUrl } from '../../services/utils'
import { useAuthStore } from '../../stores/auth'
import { toast } from 'vue3-toastify'

const props = defineProps({
  modelValue: {
    type: String,
    default: ''
  }
})

const emit = defineEmits(['update:modelValue'])

const fileInput = ref(null)
const isDragging = ref(false)
const uploading = ref(false)
const authStore = useAuthStore()

const parsedImageUrl = computed(() => {
  return parseImageUrl(props.modelValue)
})

const triggerFileInput = () => {
  fileInput.value.click()
}

const handleDrop = (e) => {
  isDragging.value = false
  const files = e.dataTransfer.files
  if (files.length > 0) {
    uploadFile(files[0])
  }
}

const handleFileChange = (e) => {
  const files = e.target.files
  if (files.length > 0) {
    uploadFile(files[0])
  }
}

const uploadFile = async (file) => {
  if (!file.type.startsWith('image/')) {
    toast.error('Por favor selecciona un archivo de imagen válido.')
    return
  }
  
  uploading.value = true
  try {
    const res = await api.uploadImage(file)
    emit('update:modelValue', res.url)
  } catch (error) {
    toast.error(error.message || 'Error al subir la imagen. Verifica tu configuración de almacenamiento.')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>
