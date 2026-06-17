<template>
  <div class="relative inline-block text-left" ref="dropdownRef">
    <div @click="toggle" class="cursor-pointer">
      <slot name="trigger" />
    </div>

    <div
      v-if="isOpen"
      v-motion
      :initial="{ opacity: 0, y: 10, scale: 0.95 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }"
      :leave="{ opacity: 0, y: 10, scale: 0.95, transition: { duration: 150 } }"
      class="absolute z-50 mt-2 w-56 rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl focus:outline-none"
      :class="[align === 'right' ? 'right-0 origin-top-right' : 'left-0 origin-top-left', className]"
    >
      <div class="p-1">
        <slot name="content" :close="close" />
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue'

const props = defineProps({
  align: {
    type: String,
    default: 'right', // 'left' or 'right'
  },
  className: {
    type: String,
    default: ''
  }
})

const isOpen = ref(false)
const dropdownRef = ref(null)

const toggle = () => {
  isOpen.value = !isOpen.value
}

const close = () => {
  isOpen.value = false
}

const handleClickOutside = (event) => {
  if (dropdownRef.value && !dropdownRef.value.contains(event.target)) {
    close()
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
})
</script>
