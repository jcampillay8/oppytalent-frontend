<template>
  <div class="container">
    <div v-if="store.loading" class="loading"><div class="spinner"></div></div>
    <div v-else-if="!translatedProyecto" class="empty-state">Proyecto no encontrado.</div>
    <article v-else class="detail">
      <router-link to="/portafolio" class="back-link">&larr; Volver al Portafolio</router-link>
      <h1 class="detail-title">{{ translatedProyecto.titulo }}</h1>
      <div class="detail-meta">
        <time>{{ formatDate(translatedProyecto.fecha_proyecto) }}</time>
        <span class="detail-date">Actualizado: {{ formatDate(translatedProyecto.updated_at) }}</span>
      </div>

      <img v-if="translatedProyecto.image_url" :src="translatedProyecto.image_url" :alt="translatedProyecto.titulo" class="detail-img" />

      <div v-if="getYoutubeEmbed(translatedProyecto.youtube_url)" class="detail-video">
        <h3 class="section-title">Video Demostrativo</h3>
        <div class="video-responsive">
          <iframe 
            :src="getYoutubeEmbed(translatedProyecto.youtube_url)" 
            frameborder="0" 
            allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
            allowfullscreen>
          </iframe>
        </div>
      </div>

      <div class="detail-tags">
        <span v-for="tag in translatedProyecto.tags" :key="tag" class="tag tag-industry">{{ tag }}</span>
      </div>

      <div class="detail-stack">
        <span v-for="tech in translatedProyecto.stack_tecnologico" :key="tech" class="tag tag-tech">{{ tech }}</span>
      </div>

      <div class="detail-links">
        <a v-if="translatedProyecto.link_github" :href="translatedProyecto.link_github" target="_blank" class="btn btn-outline">GitHub</a>
        <a v-if="translatedProyecto.link_demo" :href="translatedProyecto.link_demo" target="_blank" class="btn btn-outline">Demo</a>
      </div>

      <div v-if="translatedProyecto.kpis && Object.keys(translatedProyecto.kpis).length" class="detail-kpis">
        <h3 class="section-title">KPIs</h3>
        <div v-for="(val, key) in translatedProyecto.kpis" :key="key" class="kpi-group">
          <template v-if="isSimple(val)">
            <div class="kpi-row"><span class="kpi-row-key">{{ key }}</span><span class="kpi-row-val">{{ val }}</span></div>
          </template>
          <template v-else>
            <div class="kpi-group-header" @click="toggleKpi(key)">
              <span class="kpi-group-chevron">{{ expandedKpis[key] ? '▾' : '▸' }}</span>
              <span class="kpi-group-title">{{ key }}</span>
              <span class="kpi-group-count">{{ Object.keys(val).length }}</span>
            </div>
            <div v-if="expandedKpis[key]" class="kpi-sub-list">
              <div v-for="(subVal, subKey) in val" :key="subKey" class="kpi-row">
                <span class="kpi-row-key">{{ subKey }}:</span>
                <span class="kpi-row-val">{{ subVal }}</span>
              </div>
            </div>
          </template>
        </div>
      </div>

      <div class="detail-content">
        <h3 class="section-title">Descripción</h3>
        <div class="markdown" v-html="renderMarkdown(translatedProyecto.descripcion_detallada)"></div>
      </div>

      <div class="detail-pq">
        <h3 class="section-title">Contexto</h3>
        <p>{{ translatedProyecto.descripcion_corta }}</p>
      </div>
    </article>
  </div>
</template>

<script setup>
import { reactive, onMounted, watch, computed } from 'vue'
import { useRoute } from 'vue-router'
import { useProyectosStore } from '../../stores/proyectos'
import { useTranslatedData } from '../../composables/useTranslatedData'

const route = useRoute()
const store = useProyectosStore()

const translatedProyecto = useTranslatedData(computed(() => store.current))

const expandedKpis = reactive({})

function toggleKpi(key) {
  expandedKpis[key] = !expandedKpis[key]
}

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'long', day: 'numeric' })
}

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

function isSimple(val) {
  return typeof val === 'string' || typeof val === 'number' || typeof val === 'boolean'
}

function getYoutubeEmbed(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
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
}

.detail-img {
  width: 100%;
  max-height: 360px;
  object-fit: cover;
  border-radius: var(--radius-lg);
  margin-bottom: 1.5rem;
}

.detail-video {
  margin-bottom: 2rem;
}

.section-title {
  font-size: 1.125rem;
  font-weight: 600;
  color: var(--color-gray-900);
  margin-bottom: 1rem;
  border-bottom: 2px solid var(--color-gray-200);
  padding-bottom: 0.5rem;
}

.video-responsive {
  overflow: hidden;
  padding-bottom: 56.25%;
  position: relative;
  height: 0;
  border-radius: var(--radius-md);
}

.video-responsive iframe {
  left: 0;
  top: 0;
  height: 100%;
  width: 100%;
  position: absolute;
}

.detail-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.75rem;
}

.detail-meta {
  display: flex;
  gap: 1rem;
  font-size: 0.875rem;
  color: var(--color-gray-500);
  margin-bottom: 1rem;
}

.detail-tags,
.detail-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem;
  margin-bottom: 1rem;
}

.detail-links {
  display: flex;
  gap: 0.75rem;
  margin-bottom: 2rem;
}

.detail-kpis {
  margin-bottom: 2rem;
}

.kpi-group {
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-md);
  margin-bottom: 0.5rem;
  overflow: hidden;
}

.kpi-group:last-child {
  margin-bottom: 0;
}

.kpi-group-header {
  display: flex;
  align-items: center;
  gap: 0.5rem;
  padding: 0.625rem 1rem;
  background: var(--color-gray-50);
  cursor: pointer;
  user-select: none;
  transition: background 0.15s;
}

.kpi-group-header:hover {
  background: var(--color-gray-100);
}

.kpi-group-chevron {
  font-size: 0.75rem;
  color: var(--color-gray-400);
  flex-shrink: 0;
}

.kpi-group-title {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-primary);
  flex: 1;
}

.kpi-group-count {
  font-size: 0.75rem;
  font-weight: 700;
  color: var(--color-primary);
  background: var(--color-gray-100);
  padding: 0.125rem 0.5rem;
  border-radius: 999px;
  flex-shrink: 0;
}

.kpi-sub-list {
  border-top: 1px solid var(--color-gray-200);
}

.kpi-row {
  display: flex;
  align-items: baseline;
  gap: 0.5rem;
  padding: 0.5rem 1rem;
  border-bottom: 1px solid var(--color-gray-100);
}

.kpi-row:last-child {
  border-bottom: none;
}

.kpi-sub-list .kpi-row {
  padding-left: 3rem;
}

.kpi-row-key {
  font-size: 0.8125rem;
  font-weight: 500;
  color: var(--color-gray-600);
  white-space: nowrap;
}

.kpi-row-val {
  font-size: 0.875rem;
  font-weight: 600;
  color: var(--color-gray-900);
}

.detail-content {
  margin-bottom: 2rem;
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

.detail-pq {
  margin-top: 2rem;
  padding: 1.5rem;
  background: var(--color-gray-50);
  border-radius: var(--radius-md);
  border-left: 4px solid var(--color-accent);
}

.detail-pq p {
  color: var(--color-gray-600);
  line-height: 1.6;
}
</style>
