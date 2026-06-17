<template>
  <div
    class="relative overflow-hidden rounded-xl border border-border/50 bg-card/70 backdrop-blur-xl shadow-lg transition-all duration-300"
    :class="[
      hoverEffect ? 'hover:shadow-primary/20 hover:border-primary/50 group' : '',
      className
    ]"
  >
    <!-- Shimmer Effect (Aurora) -->
    <div
      v-if="hoverEffect"
      class="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-500 pointer-events-none"
      style="background: radial-gradient(circle at 50% -20%, hsla(var(--primary), 0.15), transparent 70%);"
    ></div>
    
    <div class="relative z-10 w-full h-full p-4 sm:p-6">
      <slot />
    </div>
  </div>
</template>

<script setup>
defineProps({
  hoverEffect: {
    type: Boolean,
    default: false
  },
  className: {
    type: String,
    default: ''
  }
})
</script>
