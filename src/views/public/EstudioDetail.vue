<template>
  <div class="container">
    <div v-if="store.loading" class="loading"><div class="spinner"></div></div>
    <div v-else-if="!store.current" class="empty-state">Estudio / Certificación no encontrado.</div>
    <article v-else class="detail">
      <router-link to="/portafolio" class="back-link">&larr; {{ locale === 'en' ? 'Back to Portfolio' : 'Volver al Portafolio' }}</router-link>
      <h1 class="detail-title">{{ tData.titulo }}</h1>
      <p class="detail-institution">{{ tData.institucion }}</p>
      
      <div class="detail-meta">
        <span class="detail-year">{{ locale === 'en' ? 'Year obtained:' : 'Año de Obtención:' }} <strong>{{ tData.anio_obtencion }}</strong></span>
      </div>

      <div class="detail-actions" v-if="tData.link">
        <a :href="tData.link" target="_blank" rel="noopener noreferrer" class="btn btn-primary">{{ locale === 'en' ? 'View Credential / More Info' : 'Ver Credencial / Más Info' }}</a>
      </div>

      <div class="detail-img-container" v-if="tData.image_url">
        <img :src="tData.image_url" :alt="tData.institucion" class="detail-img" />
      </div>

      <div class="detail-content">
        <h3 class="section-title">{{ locale === 'en' ? 'About this Credential / Education' : 'Sobre esta Credencial / Estudio' }}</h3>
        <div class="markdown" v-html="renderMarkdown(tData.descripcion_detallada)"></div>
      </div>
    </article>
  </div>
</template>

<script setup>
import { onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useEstudiosStore } from '../../stores/estudios'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'

const route = useRoute()
const store = useEstudiosStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const tData = computed(() => {
  if (!store.current) return {}
  return getTranslated(store.current, locale.value)
})

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/### (.+)/g, '<h4>$1</h4>')
    .replace(/## (.+)/g, '<h3>$1</h3>')
    .replace(/# (.+)/g, '<h2>$1</h2>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
  return '<p>' + html + '</p>'
}

watch(() => route.params.id, (newId) => {
  if (newId) {
    store.fetchOne(newId)
  }
})

onMounted(() => store.fetchOne(route.params.id))
</script>

<style scoped>
.detail {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
  color: var(--color-accent);
  text-decoration: none;
  font-weight: 500;
  transition: color 0.2s ease;
}

.back-link:hover {
  color: var(--color-primary);
}

.detail-img-container {
  display: flex;
  justify-content: center;
  align-items: center;
  width: 100%;
  max-height: 380px;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-150);
  border-radius: var(--radius-lg);
  margin-bottom: 2rem;
  padding: 2rem;
  overflow: hidden;
}

.detail-img {
  max-width: 100%;
  max-height: 320px;
  object-fit: contain;
  border-radius: var(--radius-sm);
  transition: transform 0.3s ease;
}

.detail-img:hover {
  transform: scale(1.02);
}

.detail-title {
  font-size: 2.25rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.375rem;
  line-height: 1.2;
}

.detail-institution {
  font-size: 1.25rem;
  color: var(--color-accent);
  font-weight: 600;
  margin-bottom: 0.75rem;
}

.detail-meta {
  font-size: 0.9375rem;
  color: var(--color-gray-500);
  margin-bottom: 2rem;
  padding-bottom: 1rem;
  border-bottom: 1px solid var(--color-gray-100);
}

.detail-actions {
  margin-bottom: 2rem;
  display: flex;
  gap: 1rem;
}

.detail-year strong {
  color: var(--color-gray-900);
}

.section-title {
  font-size: 1.25rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
  padding-bottom: 0.375rem;
  border-bottom: 2px solid var(--color-accent);
  display: inline-block;
}

.detail-content {
  margin-bottom: 3rem;
  color: var(--color-gray-700);
}

.detail-content p {
  font-size: 1rem;
  line-height: 1.75;
  margin-bottom: 1.25rem;
}

.detail-description-info {
  font-style: italic;
  color: var(--color-gray-500);
}

.markdown {
  line-height: 1.8;
  color: var(--color-gray-700);
}

.markdown code {
  background: var(--color-gray-100);
  padding: 0.125rem 0.375rem;
  border-radius: 4px;
  font-size: 0.875rem;
}

.markdown li {
  margin-left: 1.5rem;
  margin-bottom: 0.25rem;
}
</style>