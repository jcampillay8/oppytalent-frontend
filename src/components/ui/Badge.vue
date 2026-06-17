<template>
  <div
    class="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold transition-colors focus:outline-none focus:ring-2 focus:ring-ring focus:ring-offset-2"
    :class="[variantClasses, className]"
  >
    <slot />
  </div>
</template>

<script setup>
import { computed } from 'vue'

const props = defineProps({
  variant: {
    type: String,
    default: 'default',
    validator: (val) => ['default', 'secondary', 'destructive', 'outline', 'success', 'warning'].includes(val)
  },
  className: {
    type: String,
    default: ''
  }
})

const variantClasses = computed(() => {
  switch (props.variant) {
    case 'default':
      return 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80'
    case 'secondary':
      return 'border-transparent bg-secondary text-secondary-foreground hover:bg-secondary/80'
    case 'destructive':
      return 'border-transparent bg-destructive text-destructive-foreground shadow hover:bg-destructive/80'
    case 'success':
      return 'border-transparent bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
    case 'warning':
      return 'border-transparent bg-amber-500/10 text-amber-500 border border-amber-500/20'
    case 'outline':
      return 'text-foreground'
    default:
      return 'border-transparent bg-primary text-primary-foreground shadow hover:bg-primary/80'
  }
})
</script>
