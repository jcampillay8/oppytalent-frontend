<template>
  <form @submit.prevent="submit" class="space-y-6">
    <div class="grid grid-cols-1 gap-6">
      
      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Tipo de Habilitación</label>
        <select 
          v-model="form.tipo"
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all"
          required
        >
          <option value="DISPONIBILIDAD">Disponibilidad / Preferencias (Logística)</option>
          <option value="LICENCIA">Licencias y Credenciales (Operativa)</option>
          <option value="SALUD">Requisitos Especiales (Declarativa)</option>
        </select>
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Título</label>
        <input 
          v-model="form.titulo" 
          type="text" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground"
          placeholder="Ej: Licencia Clase B, Turnos 7x7..." 
          required 
        />
      </div>

      <div class="space-y-2">
        <label class="text-sm font-semibold text-foreground">Descripción / Detalles</label>
        <textarea 
          v-model="form.descripcion" 
          class="w-full bg-secondary/50 border border-border rounded-lg px-4 py-3 text-foreground focus:outline-none focus:ring-2 focus:ring-primary/50 transition-all placeholder:text-muted-foreground min-h-[100px]"
          placeholder="Ej: Licencia al día sin multas, disponibilidad inmediata..." 
          required
        ></textarea>
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
  habilitacion: {
    type: Object,
    default: null
  }
})

const emit = defineEmits(['save', 'cancel'])

const form = ref({
  tipo: 'LICENCIA',
  titulo: '',
  descripcion: ''
})

function initForm() {
  if (props.habilitacion) {
    form.value = { ...props.habilitacion }
  } else {
    form.value = {
      tipo: 'LICENCIA',
      titulo: '',
      descripcion: ''
    }
  }
}

watch(() => props.habilitacion, initForm, { deep: true })
onMounted(initForm)

function submit() {
  emit('save', { ...form.value })
}
</script>
