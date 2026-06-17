<template>
  <button
    v-motion
    :initial="{ scale: 1 }"
    :enter="{ scale: 1 }"
    :tapped="{ scale: 0.95 }"
    class="relative inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-lg font-medium text-sm transition-all duration-300 focus:outline-none focus:ring-2 focus:ring-primary/50 focus:ring-offset-2 focus:ring-offset-background disabled:opacity-50 disabled:pointer-events-none"
    :class="[
      variantClasses,
      fullWidth ? 'w-full' : '',
      className
    ]"
    @click="$emit('click')"
  >
    <!-- Glow Effect underneath -->
    <div
      v-if="glow"
      class="absolute inset-0 bg-primary/20 blur-md rounded-lg -z-10 group-hover:bg-primary/30 transition-colors duration-300"
    ></div>
    
    <slot name="icon-left" />
    <slot />
    <slot name="icon-right" />
  </button>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'primary',
    validator: (val) => ['primary', 'secondary', 'outline', 'ghost', 'destructive'].includes(val)
  },
  glow: {
    type: Boolean,
    default: false
  },
  fullWidth: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})

defineEmits(['click'])

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'primary':
      return 'bg-primary text-primary-foreground hover:bg-primary/90 shadow-md'
    case 'secondary':
      return 'bg-secondary text-secondary-foreground hover:bg-secondary/80'
    case 'outline':
      return 'border border-input bg-transparent hover:bg-accent hover:text-accent-foreground'
    case 'ghost':
      return 'hover:bg-accent hover:text-accent-foreground'
    case 'destructive':
      return 'bg-destructive text-destructive-foreground hover:bg-destructive/90 shadow-sm'
    default:
      return 'bg-primary text-primary-foreground hover:bg-primary/90'
  }
})
</script>
