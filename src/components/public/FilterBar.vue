<template>
  <div class="flex items-center flex-wrap gap-3 mb-8">
    <div class="flex flex-wrap gap-2">
      <button
        v-for="tag in allTags"
        :key="tag"
        :class="[
          'px-4 py-1.5 text-sm font-medium rounded-full border transition-all duration-200 outline-none',
          selectedTags.includes(tag) 
            ? 'bg-primary border-primary text-primary-foreground shadow-md shadow-primary/20' 
            : 'bg-secondary border-border/50 text-muted-foreground hover:border-primary/50 hover:text-foreground'
        ]"
        @click="toggleTag(tag)"
      >
        {{ tag }}
      </button>
    </div>
    
    <button 
      v-if="selectedTags.length" 
      class="px-3 py-1.5 text-xs font-medium rounded-full border border-destructive/30 text-destructive hover:bg-destructive/10 transition-colors outline-none" 
      @click="$emit('clear')"
    >
      Limpiar filtros
    </button>
  </div>
</template>

<script setup>
defineProps({
  allTags: { type: Array, default: () => [] },
  selectedTags: { type: Array, default: () => [] },
})

const emit = defineEmits(['toggle', 'clear'])

function toggleTag(tag) {
  emit('toggle', tag)
}
</script>
