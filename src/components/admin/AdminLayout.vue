<template>
  <div class="admin-layout">
    <aside class="admin-sidebar">
      <h3 class="sidebar-title">Admin</h3>
      <nav class="sidebar-nav">
        <router-link :to="`/${route.params.username}/dashboard`" class="sidebar-link" exact>Dashboard</router-link>
        <router-link :to="`/${route.params.username}/proyectos`" class="sidebar-link">Proyectos</router-link>
        <router-link :to="`/${route.params.username}/experiencias`" class="sidebar-link">Experiencia Laboral</router-link>
        <router-link :to="`/${route.params.username}/estudios`" class="sidebar-link">Estudios</router-link>
        <router-link :to="`/${route.params.username}/perfil`" class="sidebar-link">Sobre Mí</router-link>
        <router-link :to="`/${route.params.username}/secciones`" class="sidebar-link">Secciones</router-link>
        <router-link :to="`/${route.params.username}/frases`" class="sidebar-link">Frases</router-link>
        <router-link :to="`/${route.params.username}/chat-logs`" class="sidebar-link">Chat Logs</router-link>
        <router-link :to="`/${route.params.username}/oportunidades`" class="sidebar-link">Oportunidades</router-link>
        <router-link :to="`/${route.params.username}/chat-config`" class="sidebar-link">Personaliza tu IA</router-link>
        <router-link :to="`/${route.params.username}/theme-config`" class="sidebar-link">Apariencia</router-link>
        <router-link :to="`/${route.params.username}/almacenamiento`" class="sidebar-link">☁️ Almacenamiento</router-link>
      </nav>
      <router-link :to="`/${route.params.username}`" class="sidebar-back">&larr; Sitio Público</router-link>
    </aside>
    <main class="admin-content">
      <slot />
    </main>
  </div>
</template>

<script setup>
import { useRoute } from 'vue-router'
const route = useRoute()
</script>

<style scoped>
.admin-layout {
  display: flex;
  gap: 2rem;
}

.admin-sidebar {
  width: 200px;
  flex-shrink: 0;
}

.sidebar-title {
  font-size: 0.75rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.1em;
  color: var(--color-gray-400);
  margin-bottom: 1rem;
}

.sidebar-nav {
  display: flex;
  flex-direction: column;
  gap: 0.25rem;
  margin-bottom: 2rem;
}

.sidebar-link {
  padding: 0.5rem 0.75rem;
  border-radius: var(--radius-sm);
  font-size: 0.875rem;
  font-weight: 500;
  color: var(--color-gray-600);
  transition: all 0.15s;
}

.sidebar-link:hover {
  background: var(--color-gray-100);
  color: var(--color-gray-900);
  text-decoration: none;
}

.sidebar-link.router-link-exact-active {
  background: var(--color-primary);
  color: #fff;
}

.sidebar-back {
  display: block;
  font-size: 0.8125rem;
  color: var(--color-gray-500);
  padding: 0.5rem 0.75rem;
}

.admin-content {
  flex: 1;
  min-width: 0;
}
</style>
