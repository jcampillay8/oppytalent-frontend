<template>
  <div class="container">
    <section class="section">
      <h2 class="section-title">{{ $t('nav.contact') }}</h2>
      <div v-if="perfilStore.loading" class="loading"><div class="spinner"></div></div>
      <div v-else-if="!perfil" class="empty-state">Información de contacto no disponible.</div>
      <div v-else class="contact-card card">
        <div class="contact-header">
          <img v-if="tData.avatar_url" :src="tData.avatar_url" alt="Avatar" class="contact-avatar" />
          <div class="contact-info">
            <h3>Jaime Campillay</h3>
            <p v-if="tData.ciudad" class="contact-city">📍 {{ tData.ciudad }}</p>
          </div>
        </div>
        
        <div class="contact-details">
          <div class="contact-item" v-if="tData.email">
            <span class="icon">✉️</span>
            <div class="contact-text">
              <span class="label">Email</span>
              <a :href="`mailto:${tData.email}`">{{ tData.email }}</a>
            </div>
          </div>
          
          <div class="contact-item" v-if="tData.telefono">
            <span class="icon">📱</span>
            <div class="contact-text">
              <span class="label">{{ $t('contact.phone') }}</span>
              <a :href="`tel:${tData.telefono.replace(/\s+/g, '')}`">{{ tData.telefono }}</a>
            </div>
          </div>
          
          <div class="contact-item" v-if="tData.linkedin">
            <span class="icon">💼</span>
            <div class="contact-text">
              <span class="label">LinkedIn</span>
              <a :href="tData.linkedin" target="_blank" rel="noopener noreferrer">{{ $t('contact.linkedin_profile') }}</a>
            </div>
          </div>
          
          <div class="contact-item" v-if="tData.github">
            <span class="icon">💻</span>
            <div class="contact-text">
              <span class="label">GitHub</span>
              <a :href="tData.github" target="_blank" rel="noopener noreferrer">{{ $t('contact.github_profile') }}</a>
            </div>
          </div>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { computed, onMounted } from 'vue'
import { usePerfilStore } from '../../stores/perfil'
import { useTranslatedData } from '../../composables/useTranslatedData'
import { useI18n } from 'vue-i18n'

const perfilStore = usePerfilStore()
const { locale } = useI18n()
const { getTranslated } = useTranslatedData()

const perfil = computed(() => perfilStore.items[0])
const tData = computed(() => perfil.value ? getTranslated(perfil.value, locale.value) : {})

onMounted(() => {
  perfilStore.fetchAll()
})
</script>

<style scoped>
.container {
  max-width: 600px;
  margin: 0 auto;
  padding: 2rem 1rem;
}

.section-title {
  font-size: 2rem;
  font-weight: 700;
  color: var(--color-gray-900);
  margin-bottom: 2rem;
  text-align: center;
}

.contact-card {
  padding: 2.5rem;
  background: #fff;
}

.contact-header {
  display: flex;
  align-items: center;
  gap: 1.5rem;
  margin-bottom: 2rem;
  padding-bottom: 1.5rem;
  border-bottom: 1px solid var(--color-gray-200);
}

.contact-avatar {
  width: 80px;
  height: 80px;
  border-radius: 50%;
  object-fit: cover;
  border: 3px solid var(--color-gray-100);
}

.contact-info h3 {
  font-size: 1.5rem;
  font-weight: 700;
  margin: 0 0 0.25rem 0;
  color: var(--color-gray-900);
}

.contact-city {
  color: var(--color-gray-500);
  font-size: 0.9375rem;
  margin: 0;
}

.contact-details {
  display: flex;
  flex-direction: column;
  gap: 1.5rem;
}

.contact-item {
  display: flex;
  align-items: flex-start;
  gap: 1rem;
}

.icon {
  font-size: 1.5rem;
  line-height: 1;
  margin-top: 0.25rem;
}

.contact-text {
  display: flex;
  flex-direction: column;
}

.label {
  font-size: 0.75rem;
  text-transform: uppercase;
  font-weight: 600;
  color: var(--color-gray-400);
  margin-bottom: 0.25rem;
  letter-spacing: 0.05em;
}

.contact-text a {
  color: var(--color-primary);
  font-weight: 500;
  text-decoration: none;
  font-size: 1.0625rem;
  transition: color 0.2s;
}

.contact-text a:hover {
  color: var(--color-accent);
  text-decoration: underline;
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
