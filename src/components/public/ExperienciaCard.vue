<template>
  <router-link :to="`/experiencia/${experiencia.id}`" class="card experiencia-card">
    <div v-if="tData.image_url" class="card-img">
      <img :src="tData.image_url" :alt="tData.empresa" />
    </div>
    <div class="card-body">
      <div class="card-header">
        <div>
          <h3 class="card-title">{{ tData.rol }}</h3>
          <span class="card-company">{{ tData.empresa }}</span>
        </div>
        <span class="card-date">{{ formatPeriod(tData.periodo_inicio, tData.periodo_fin) }}</span>
      </div>
      <p class="card-desc">{{ truncate(tData.descripcion_logros, 200) }}</p>
      <div class="card-tags">
        <span v-for="tag in tData.tags_industria" :key="tag" class="tag tag-industry">{{ tag }}</span>
      </div>
    </div>
  </router-link>
</template>

<script setup>
import { useTranslatedData } from '../../composables/useTranslatedData'
import { computed } from 'vue'
import { useI18n } from 'vue-i18n'

const props = defineProps({
  experiencia: { type: Object, required: true },
})

const { locale } = useI18n()
const { getTranslated } = useTranslatedData()
const tData = computed(() => getTranslated(props.experiencia, locale.value))

function formatPeriod(start, end) {
  const isEn = locale.value === 'en'
  const loc = isEn ? 'en-US' : 'es-CL'
  const fmt = (d) => new Date(d).toLocaleDateString(loc, { year: 'numeric', month: 'short' })
  const presentTxt = isEn ? 'Present' : 'Presente'
  return `${fmt(start)} - ${end ? fmt(end) : presentTxt}`
}

function truncate(text, max) {
  return text.length > max ? text.slice(0, max) + '...' : text
}
</script>

<style scoped>
.experiencia-card {
  display: block;
  color: inherit;
}

.experiencia-card:hover {
  text-decoration: none;
  color: inherit;
}

.card-img {
  width: 100%;
  height: 180px;
  overflow: hidden;
  border-radius: var(--radius-lg) var(--radius-lg) 0 0;
}

.card-img img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.card-body {
  padding: 1.5rem;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.75rem;
  gap: 1rem;
}

.card-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.card-company {
  font-size: 0.875rem;
  color: var(--color-accent);
  font-weight: 500;
}

.card-date {
  font-size: 0.8125rem;
  color: var(--color-gray-400);
  white-space: nowrap;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 0.75rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}
</style>
