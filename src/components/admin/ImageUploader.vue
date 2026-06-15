<template>
  <div class="image-uploader">
    <div class="upload-area" @click="triggerFileInput" :class="{ dragging: isDragging, 'has-image': modelValue }" @dragover.prevent="isDragging = true" @dragleave.prevent="isDragging = false" @drop.prevent="handleDrop">
      
      <input type="file" ref="fileInput" class="hidden-input" accept="image/*" @change="handleFileChange" />
      
      <!-- Si ya hay una imagen -->
      <div v-if="modelValue && !uploading" class="preview-container">
        <img :src="parsedImageUrl" alt="Preview" class="image-preview" />
        <div class="overlay">
          <span class="icon">🔄</span>
          <p>Haz clic para cambiar la imagen</p>
        </div>
      </div>
      
      <!-- Estado de carga -->
      <div v-else-if="uploading" class="loading-state">
        <span class="spinner"></span>
        <p>Subiendo imagen...</p>
      </div>
      
      <!-- Estado vacío -->
      <div v-else class="empty-state">
        <span class="icon">☁️</span>
        <p>Arrastra tu imagen o haz clic para subir</p>
        <small v-if="authStore.user?.is_premium">Premium Activo: Cloudflare R2</small>
        <small v-else-if="authStore.user?.google_refresh_token">Subiendo a Google Drive</small>
        <small v-else class="text-warning">⚠️ Configura tu almacenamiento primero</small>
      </div>
    </div>
    
    <!-- Opción manual -->
    <div class="manual-input">
      <p class="separator"><span>o pega una URL manualmente</span></p>
      <input 
        type="text" 
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        class="form-input" 
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
    alert('Por favor selecciona un archivo de imagen válido.')
    return
  }
  
  uploading.value = true
  try {
    const res = await api.uploadImage(file)
    emit('update:modelValue', res.url)
  } catch (error) {
    alert(error.message || 'Error al subir la imagen. Verifica tu configuración de almacenamiento.')
  } finally {
    uploading.value = false
    if (fileInput.value) fileInput.value.value = ''
  }
}
</script>

<style scoped>
.image-uploader {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.upload-area {
  position: relative;
  border: 2px dashed rgba(255, 255, 255, 0.2);
  border-radius: var(--radius-md);
  padding: 2rem;
  text-align: center;
  cursor: pointer;
  transition: all 0.3s;
  background: rgba(24, 24, 27, 0.5);
  min-height: 160px;
  display: flex;
  align-items: center;
  justify-content: center;
  overflow: hidden;
}

.upload-area:hover, .upload-area.dragging {
  border-color: var(--color-primary);
  background: rgba(59, 130, 246, 0.1);
}

.upload-area.has-image {
  padding: 0;
  border-style: solid;
  border-color: rgba(255, 255, 255, 0.1);
}

.hidden-input {
  display: none;
}

.preview-container {
  width: 100%;
  height: 160px;
  position: relative;
}

.image-preview {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.overlay {
  position: absolute;
  top: 0; left: 0; right: 0; bottom: 0;
  background: rgba(0, 0, 0, 0.6);
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;
  opacity: 0;
  transition: opacity 0.2s;
  color: white;
}

.preview-container:hover .overlay {
  opacity: 1;
}

.overlay .icon {
  font-size: 2rem;
  margin-bottom: 0.5rem;
}

.empty-state, .loading-state {
  display: flex;
  flex-direction: column;
  align-items: center;
  color: var(--color-gray-400);
}

.empty-state .icon {
  font-size: 2.5rem;
  margin-bottom: 0.5rem;
}

.empty-state p {
  margin: 0 0 0.5rem 0;
  font-weight: 500;
}

.text-warning {
  color: #f59e0b;
}

.separator {
  text-align: center;
  position: relative;
  margin: 0;
  color: var(--color-gray-500);
  font-size: 0.8rem;
}

.separator::before, .separator::after {
  content: '';
  position: absolute;
  top: 50%;
  width: calc(50% - 80px);
  height: 1px;
  background: rgba(255, 255, 255, 0.1);
}

.separator::before { left: 0; }
.separator::after { right: 0; }

.spinner {
  width: 30px;
  height: 30px;
  border: 3px solid rgba(255,255,255,0.1);
  border-radius: 50%;
  border-top-color: var(--color-primary);
  animation: spin 1s ease-in-out infinite;
  margin-bottom: 1rem;
}

@keyframes spin {
  to { transform: rotate(360deg); }
}
</style>
