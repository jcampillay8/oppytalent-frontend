<template>
  <div class="relative w-full max-w-md" ref="searchContainerRef">
    <div class="relative group">
      <div class="absolute inset-y-0 left-0 pl-3 flex items-center pointer-events-none">
        <Search class="h-4 w-4 text-muted-foreground group-hover:text-primary transition-colors" />
      </div>
      <input
        type="text"
        ref="searchInputRef"
        :value="modelValue"
        @input="$emit('update:modelValue', $event.target.value)"
        @focus="isFocused = true; $emit('focus')"
        @keydown.down.prevent="onArrowDown"
        @keydown.up.prevent="onArrowUp"
        @keydown.enter.prevent="onEnter"
        placeholder="Buscar talento... (⌘ + K)"
        class="block w-full pl-10 pr-12 py-2 border border-border/50 rounded-xl bg-secondary/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-primary/20 focus:border-primary/50 transition-all duration-300 backdrop-blur-sm"
      />
      <div class="absolute inset-y-0 right-0 pr-2 flex items-center pointer-events-none">
        <kbd class="hidden sm:inline-flex h-5 items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
          <span class="text-xs">⌘</span>K
        </kbd>
      </div>
    </div>

    <!-- Search Results Dropdown -->
    <div
      v-if="isFocused && modelValue"
      v-motion
      :initial="{ opacity: 0, y: 10, scale: 0.98 }"
      :enter="{ opacity: 1, y: 0, scale: 1, transition: { type: 'spring', stiffness: 300, damping: 25 } }"
      class="absolute top-full left-0 right-0 mt-2 rounded-xl border border-border/50 bg-card/80 backdrop-blur-xl shadow-2xl overflow-hidden z-50"
    >
      <div v-if="isLoading" class="p-4 flex justify-center text-primary">
        <Loader2 class="h-5 w-5 animate-spin" />
      </div>
      <div v-else-if="results.length === 0" class="p-4 text-center text-sm text-muted-foreground">
        No se encontraron talentos con "{{ modelValue }}"
      </div>
      <div v-else ref="searchResultsListRef" class="max-h-[60vh] overflow-y-auto scrollbar-thin scrollbar-thumb-primary/20">
        <router-link
          v-for="(user, index) in results"
          :key="user.id"
          :id="'spotlight-result-' + index"
          :to="`/${user.username.split('@')[0]}`"
          @click="closeSearch"
          class="flex items-center gap-3 p-3 transition-colors border-b border-border/50 last:border-0"
          :class="[index === selectedIndex ? 'bg-primary/20' : 'hover:bg-primary/10']"
        >
          <div class="h-10 w-10 rounded-full bg-secondary overflow-hidden flex items-center justify-center shrink-0 border border-border">
            <img v-if="user.userImage" :src="user.userImage" class="h-full w-full object-cover" />
            <span v-else class="text-xs font-bold text-muted-foreground">
              {{ (user.firstName || user.username || 'U').charAt(0) }}{{ (user.lastName || '').charAt(0) }}
            </span>
          </div>
          <div class="flex flex-col overflow-hidden">
            <span class="text-sm font-semibold truncate">{{ user.firstName || user.username }} {{ user.lastName || '' }}</span>
            <span class="text-xs text-muted-foreground truncate">{{ user.occupation || 'Talento OppyTalent' }}</span>
          </div>
        </router-link>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted, watch } from 'vue'
import { Search, Loader2 } from 'lucide-vue-next'

const props = defineProps({
  modelValue: String,
  results: {
    type: Array,
    default: () => []
  },
  isLoading: Boolean
})

watch(() => props.results, () => {
  selectedIndex.value = -1
})

const emit = defineEmits(['update:modelValue', 'focus', 'close'])

const isFocused = ref(false)
const searchContainerRef = ref(null)
const searchInputRef = ref(null)
const searchResultsListRef = ref(null)
const selectedIndex = ref(-1)

import { useRouter } from 'vue-router'
const router = useRouter()

const closeSearch = () => {
  isFocused.value = false
  selectedIndex.value = -1
  emit('close')
}

const scrollToSelection = () => {
  setTimeout(() => {
    const el = document.getElementById('spotlight-result-' + selectedIndex.value)
    if (el && searchResultsListRef.value) {
      const container = searchResultsListRef.value
      const elTop = el.offsetTop
      const elBottom = elTop + el.offsetHeight
      const containerTop = container.scrollTop
      const containerBottom = containerTop + container.clientHeight

      if (elTop < containerTop) {
        container.scrollTop = elTop
      } else if (elBottom > containerBottom) {
        container.scrollTop = elBottom - container.clientHeight
      }
    }
  }, 10)
}

const onArrowDown = () => {
  if (isFocused.value && props.results.length > 0) {
    selectedIndex.value = (selectedIndex.value + 1) % props.results.length
    scrollToSelection()
  }
}

const onArrowUp = () => {
  if (isFocused.value && props.results.length > 0) {
    selectedIndex.value = selectedIndex.value <= 0 ? props.results.length - 1 : selectedIndex.value - 1
    scrollToSelection()
  }
}

const onEnter = () => {
  if (isFocused.value && props.results.length > 0 && selectedIndex.value >= 0) {
    const user = props.results[selectedIndex.value]
    router.push(`/${user.username.split('@')[0]}`)
    closeSearch()
  }
}

const handleClickOutside = (e) => {
  if (searchContainerRef.value && !searchContainerRef.value.contains(e.target)) {
    closeSearch()
  }
}

const handleKeyDown = (e) => {
  if (e.key === 'Escape') {
    closeSearch()
  }
  if ((e.metaKey || e.ctrlKey) && e.key === 'k') {
    e.preventDefault()
    const input = searchContainerRef.value?.querySelector('input')
    if (input) {
      input.focus()
    }
  }
}

onMounted(() => {
  document.addEventListener('click', handleClickOutside)
  document.addEventListener('keydown', handleKeyDown)
})

onUnmounted(() => {
  document.removeEventListener('click', handleClickOutside)
  document.removeEventListener('keydown', handleKeyDown)
})
</script>
