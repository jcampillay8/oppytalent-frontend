<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">{{ locale === 'en' ? 'Education & Certifications' : 'Estudios & Certificaciones' }}</h2>
      <div v-if="estudiosStore.loading" class="loading"><div class="spinner"></div></div>
      <div v-else-if="!estudiosStore.items.length" class="empty-state">{{ locale === 'en' ? 'No education records found.' : 'Sin estudios registrados.' }}</div>
      <div v-else class="estudios-list">
        <router-link v-for="e in sortedEstudios" :key="e.item.id" :to="`/estudios/${e.item.id}`" class="card estudio-item">
          <img v-if="e.tData.image_url" :src="e.tData.image_url" :alt="e.tData.institucion" class="estudio-img" />
          <div class="estudio-year">{{ e.tData.anio_obtencion }}</div>
          <div class="estudio-info">
            <h3>{{ e.tData.titulo }}</h3>
            <span class="estudio-institucion">{{ e.tData.institucion }}</span>
          </div>
        </router-link>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { useEstudiosStore } from '../../stores/estudios'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'

const estudiosStore = useEstudiosStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const sortedEstudios = computed(() => {
  const items = [...estudiosStore.items].sort((a, b) => b.anio_obtencion - a.anio_obtencion)
  return items.map(item => ({
    item,
    tData: getTranslated(item, locale.value)
  }))
})

onMounted(() => {
  estudiosStore.fetchAll()
})
</script>

<style scoped>
.container {
  max-width: 800px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
  padding-bottom: 0.5rem;
  border-bottom: 2px solid var(--color-gray-200);
}

.estudios-list {
  display: flex;
  flex-direction: column;
  gap: 1rem;
}

.estudio-item {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  padding: 1.5rem;
  text-decoration: none;
  color: inherit;
  background: #fff;
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  transition: transform 0.2s, box-shadow 0.2s;
}

.estudio-item:hover {
  transform: translateY(-2px);
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.05);
  border-color: var(--color-gray-300);
}

.estudio-img {
  width: 64px;
  height: 64px;
  border-radius: var(--radius-sm);
  object-fit: cover;
  flex-shrink: 0;
}

.estudio-year {
  font-size: 1.5rem;
  font-weight: 700;
  color: var(--color-primary);
  min-width: 70px;
}

.estudio-info h3 {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin: 0 0 0.25rem 0;
}

.estudio-institucion {
  font-size: 0.9375rem;
  color: var(--color-gray-500);
}

.loading {
  display: flex;
  justify-content: center;
  padding: 3rem;
}

.empty-state {
  text-align: center;
  padding: 3rem;
  color: var(--color-gray-500);
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
}
</style>
