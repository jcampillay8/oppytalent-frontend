<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      
      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Tipo de Reconocimiento</label>
        <select 
          v-model="form.tipo"
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        >
          <option value="PREMIO">Premio / Galardón</option>
          <option value="PUBLICACION">Publicación / Artículo</option>
          <option value="MEDIO">Aparición en Medios</option>
          <option value="BECA">Beca / Fondo</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Título</label>
        <input 
          v-model="form.titulo" 
          type="text" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: Premio Nacional de Innovación" 
          required 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Institución / Medio</label>
        <input 
          v-model="form.institucion" 
          type="text" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: Universidad de Chile, IEEE, Diario Financiero" 
          required 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Fecha o Año</label>
        <input 
          v-model="form.fecha" 
          type="text" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: 2023, Diciembre 2023" 
        />
      </div>

      <div class="space-y-2 md:col-span-2">
        <label class="text-sm font-semibold text-foreground">Descripción / Resumen</label>
        <textarea 
          v-model="form.descripcion" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground min-h-[100px]"
          placeholder="Detalles sobre el mérito, resumen del paper o rol en la entrevista..." 
          required
        ></textarea>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Enlace (URL)</label>
        <input 
          v-model="form.enlace" 
          type="url" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: https://..." 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Referencia (Opcional)</label>
        <input 
          v-model="form.referencia" 
          type="text" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: DOI, ISBN, Coautores..." 
        />
      </div>

    </div>

    <div class="flex items-center justify-end gap-3 pt-4 border-t border-border/50">
      <NeonButton type="button" variant="ghost" @click="$emit('cancel')">Cancelar</NeonButton>
      <NeonButton type="submit" glow>Guardar</NeonButton>
    </div>
  </form>
</template>

<script setup>
import { ref, onMounted, watch } from 'vue'
import NeonButton from '../../components/ui/NeonButton.vue'

const props = defineProps({
  reconocimiento: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  tipo: 'PREMIO',
  titulo: '',
  institucion: '',
  fecha: '',
  descripcion: '',
  enlace: '',
  referencia: '',
  image_url: ''
})

function initForm() {
  if (props.reconocimiento) {
    form.value = { ...props.reconocimiento }
  } else {
    form.value = {
      tipo: 'PREMIO',
      titulo: '',
      institucion: '',
      fecha: '',
      descripcion: '',
      enlace: '',
      referencia: '',
      image_url: ''
    }
  }
}

watch(() => props.reconocimiento, initForm, { deep: true })
onMounted(initForm)

function submit() {
  emit('save', { ...form.value })
}
</script>
