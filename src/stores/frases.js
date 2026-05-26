import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'

export const useFrasesStore = defineStore('frases', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchAll() {
    loading.value = true
    try {
      items.value = await api.getFrases()
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      current.value = await api.getFrase(id)
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const item = await api.createFrase(data)
    items.value.unshift(item)
    return item
  }

  async function update(id, data) {
    const item = await api.updateFrase(id, data)
    const idx = items.value.findIndex((p) => p.id === id)
    if (idx !== -1) items.value[idx] = item
    return item
  }

  async function remove(id) {
    await api.deleteFrase(id)
    items.value = items.value.filter((p) => p.id !== id)
  }

  return { items, current, loading, fetchAll, fetchOne, create, update, remove }
})
