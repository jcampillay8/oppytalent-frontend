<template>
  <router-link :to="`/proyecto/${proyecto.id}`" class="card proyecto-card">
    <div v-if="proyecto.image_url" class="card-img">
      <img :src="proyecto.image_url" :alt="proyecto.titulo" />
    </div>
    <div class="card-body">
      <div class="card-header">
        <h3 class="card-title">{{ proyecto.titulo }}</h3>
        <span class="card-date">{{ formatDate(proyecto.fecha_proyecto) }}</span>
      </div>
      <p class="card-desc">{{ proyecto.descripcion_corta }}</p>
      <div class="card-tags">
        <span v-for="tag in proyecto.tags" :key="tag" class="tag tag-industry">{{ tag }}</span>
      </div>
      <div class="card-stack">
        <span v-for="tech in (proyecto.stack_tecnologico || []).slice(0, 5)" :key="tech" class="tag tag-tech">{{ tech }}</span>
        <span v-if="proyecto.stack_tecnologico?.length > 5" class="tag">+{{ proyecto.stack_tecnologico.length - 5 }}</span>
      </div>
      <div v-if="proyecto.kpis && Object.keys(proyecto.kpis).length" class="card-kpis">
        <span class="kpis-label">KPIs</span>
        <div class="kpis-chips">
          <span v-for="(val, key) in proyecto.kpis" :key="key" class="kpi-chip">{{ key }}</span>
        </div>
      </div>
    </div>
  </router-link>
</template>

<script setup>
defineProps({
  proyecto: { type: Object, required: true },
})

function formatDate(d) {
  return new Date(d).toLocaleDateString('es-CL', { year: 'numeric', month: 'short' })
}
</script>

<style scoped>
.proyecto-card {
  display: block;
  color: inherit;
}

.proyecto-card:hover {
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

.card-date {
  font-size: 0.8125rem;
  color: var(--color-gray-400);
  white-space: nowrap;
}

.card-desc {
  font-size: 0.875rem;
  color: var(--color-gray-600);
  margin-bottom: 1rem;
  line-height: 1.5;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
  margin-bottom: 0.75rem;
}

.card-stack {
  display: flex;
  flex-wrap: wrap;
  gap: 0.375rem;
}

.card-kpis {
  margin-top: 0.75rem;
  padding-top: 0.75rem;
  border-top: 1px solid var(--color-gray-100);
}

.kpis-label {
  font-size: 0.625rem;
  font-weight: 700;
  color: var(--color-gray-400);
  text-transform: uppercase;
  letter-spacing: 0.08em;
  display: block;
  margin-bottom: 0.375rem;
}

.kpis-chips {
  display: flex;
  flex-wrap: wrap;
  gap: 0.25rem;
}

.kpi-chip {
  font-size: 0.6875rem;
  font-weight: 500;
  color: var(--color-accent);
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  padding: 0.125rem 0.5rem;
  border-radius: 4px;
}
</style>
