<template>
  <div class="container">
    <div v-if="store.loading" class="loading"><div class="spinner"></div></div>
    <div v-else-if="!store.items.length" class="empty-state">
      <p>No hay información disponible.</p>
      <router-link to="/" class="btn btn-outline" style="margin-top:1rem">Volver al inicio</router-link>
    </div>
    <article v-else class="about">
      <router-link to="/" class="back-link">&larr; Volver</router-link>
      <div class="about-hero">
        <h1 class="about-title">Sobre Mí</h1>
        <p class="about-subtitle">Jaime Gabriel Campillay Rojas</p>
      </div>
      <div class="about-body">
        <div class="about-content">
          <div class="markdown" v-html="renderMarkdown(profile.descripcion)"></div>

          <div v-if="getYoutubeEmbed(profile.youtube_url)" class="about-video">
            <h3 class="section-title">Video Presentación</h3>
            <div class="video-responsive">
              <iframe 
                :src="getYoutubeEmbed(profile.youtube_url)" 
                frameborder="0" 
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" 
                allowfullscreen>
              </iframe>
            </div>
          </div>
          
          <div v-if="profile.certificaciones?.length" class="about-extras">
            <h3 class="section-title">Certificaciones y Licencias</h3>
            <ul class="extra-list">
              <li v-for="(cert, i) in profile.certificaciones" :key="i">
                <strong>{{ cert.titulo || cert.nombre || 'Certificación' }}</strong>
                <span v-if="cert.entidad"> &middot; {{ cert.entidad }}</span>
              </li>
            </ul>
          </div>
          
          <div v-if="profile.idiomas?.length" class="about-extras">
            <h3 class="section-title">Idiomas</h3>
            <ul class="extra-list">
              <li v-for="(idioma, i) in profile.idiomas" :key="i">
                <strong>{{ idioma.idioma }}</strong>
                <span v-if="idioma.nivel"> &middot; {{ idioma.nivel }}</span>
              </li>
            </ul>
          </div>
        </div>
        <img
          v-if="profile.image_url"
          :src="profile.image_url"
          :alt="'Jaime Campillay'"
          class="about-img"
        />
      </div>
    </article>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePerfilStore } from '../../stores/perfil'

const store = usePerfilStore()
const profile = computed(() => store.items[0] || {})

function renderMarkdown(text) {
  if (!text) return ''
  let html = text
    .replace(/### (.+)/g, '<h3>$1</h3>')
    .replace(/## (.+)/g, '<h2>$1</h2>')
    .replace(/# (.+)/g, '<h1>$1</h1>')
    .replace(/\*\*(.+?)\*\*/g, '<strong>$1</strong>')
    .replace(/\*(.+?)\*/g, '<em>$1</em>')
    .replace(/`(.+?)`/g, '<code>$1</code>')
    .replace(/^- (.+)/gm, '<li>$1</li>')
    .replace(/\n\n/g, '</p><p>')
    .replace(/\n/g, '<br/>')
  return '<p>' + html + '</p>'
}

function getYoutubeEmbed(url) {
  if (!url) return null;
  const regExp = /^.*(youtu.be\/|v\/|u\/\w\/|embed\/|watch\?v=|&v=)([^#&?]*).*/;
  const match = url.match(regExp);
  return (match && match[2].length === 11) ? `https://www.youtube.com/embed/${match[2]}` : null;
}

onMounted(() => store.fetchAll())
</script>

<style scoped>
.about {
  max-width: 800px;
  margin: 0 auto;
}

.back-link {
  display: inline-block;
  margin-bottom: 1.5rem;
  font-size: 0.875rem;
}

.about-hero {
  margin-bottom: 1.5rem;
}

.about-body {
  display: flex;
  gap: 2rem;
  align-items: flex-start;
}

.about-img {
  width: 280px;
  height: auto;
  border-radius: var(--radius-lg);
  border: 3px solid var(--color-gray-200);
  flex-shrink: 0;
}

.about-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 0.25rem;
}

.about-subtitle {
  font-size: 1rem;
  color: var(--color-accent);
  font-weight: 500;
}

.about-content {
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

.about-video, .about-extras {
  margin-top: 2.5rem;
}

.section-title {
  font-size: 1.25rem;
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

.extra-list {
  list-style: none;
  padding: 0;
}

.extra-list li {
  padding: 0.75rem 1rem;
  background: var(--color-gray-50);
  border: 1px solid var(--color-gray-200);
  border-radius: var(--radius-sm);
  margin-bottom: 0.5rem;
  color: var(--color-gray-700);
}

@media (max-width: 600px) {
  .about-hero {
    text-align: center;
  }
  .about-body {
    flex-direction: column-reverse;
    align-items: center;
  }
  .about-img {
    width: 100%;
    max-width: 280px;
  }
}
</style>
