import { defineStore } from 'pinia'
import { ref } from 'vue'
import { api } from '../services/api'
import { parseImageUrl } from '../services/utils'

function normalize(item) {
  if (item.image_url) item.image_url = parseImageUrl(item.image_url)
  return item
}

export const useHabilitacionesStore = defineStore('habilitaciones', () => {
  const items = ref([])
  const current = ref(null)
  const loading = ref(false)

  async function fetchAll(params = '') {
    loading.value = true
    try {
      items.value = (await api.getHabilitaciones(params)).map(normalize)
    } finally {
      loading.value = false
    }
  }

  async function fetchOne(id) {
    loading.value = true
    try {
      current.value = normalize(await api.getHabilitacion(id))
    } finally {
      loading.value = false
    }
  }

  async function create(data) {
    const item = await api.createHabilitacion(data)
    items.value.unshift(item)
    return item
  }

  async function update(id, data) {
    const item = await api.updateHabilitacion(id, data)
    const idx = items.value.findIndex((p) => p.id === id)
    if (idx !== -1) items.value[idx] = item
    return item
  }

  async function remove(id) {
    await api.deleteHabilitacion(id)
    items.value = items.value.filter((p) => p.id !== id)
  }

  return { items, current, loading, fetchAll, fetchOne, create, update, remove }
})
