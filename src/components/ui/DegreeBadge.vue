<template>
  <div v-if="degree" :class="[
    'inline-flex items-center justify-center rounded-full border px-2 py-0.5 text-[10px] font-bold tracking-wide transition-colors',
    badgeClasses
  ]">
    <span class="mr-1">
      <Link v-if="degree === 1" :size="10" />
      <Users v-else-if="degree === 2" :size="10" />
      <Globe v-else :size="10" />
    </span>
    {{ degreeText }}
  </div>
</template>

<script setup>
import { computed } from 'vue'
import { Link, Users, Globe } from 'lucide-vue-next'

const props = defineProps({
  degree: {
    type: Number,
    default: null
  }
})

const degreeText = computed(() => {
  if (props.degree === 1) return '1er'
  if (props.degree === 2) return '2do'
  if (props.degree === 3) return '3er'
  return `${props.degree}º`
})

const badgeClasses = computed(() => {
  switch (props.degree) {
    case 1:
      return 'bg-emerald-500/10 text-emerald-600 border-emerald-500/20'
    case 2:
      return 'bg-blue-500/10 text-blue-600 border-blue-500/20'
    case 3:
      return 'bg-slate-500/10 text-slate-600 border-slate-500/20'
    default:
      return 'bg-secondary text-muted-foreground border-border/50'
  }
})
</script>
