import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Home',
    component: () => import('../views/public/Home.vue'),
  },
  {
    path: '/portafolio',
    name: 'Portfolio',
    component: () => import('../views/public/PortfolioView.vue'),
  },
  {
    path: '/proyecto/:id',
    name: 'ProyectoDetail',
    component: () => import('../views/public/ProyectoDetail.vue'),
  },
  {
    path: '/experiencia/:id',
    name: 'ExperienciaDetail',
    component: () => import('../views/public/ExperienciaDetail.vue'),
  },
  {
    path: '/estudios',
    name: 'EstudiosList',
    component: () => import('../views/public/EstudiosList.vue'),
  },
  {
    path: '/estudios/:id',
    name: 'EstudioDetail',
    component: () => import('../views/public/EstudioDetail.vue'),
  },
  {
    path: '/sobre-mi',
    name: 'About',
    component: () => import('../views/public/About.vue'),
  },
  {
    path: '/contactame',
    name: 'Contactame',
    component: () => import('../views/public/Contactame.vue'),
  },
  {
    path: '/admin/login',
    name: 'Login',
    component: () => import('../views/admin/Login.vue'),
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/proyectos',
    name: 'ProyectosAdmin',
    component: () => import('../views/admin/ProyectosAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/experiencias',
    name: 'ExperienciasAdmin',
    component: () => import('../views/admin/ExperienciasAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/estudios',
    name: 'EstudiosAdmin',
    component: () => import('../views/admin/EstudiosAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/perfil',
    name: 'PerfilAdmin',
    component: () => import('../views/admin/PerfilAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/secciones',
    name: 'SeccionesAdmin',
    component: () => import('../views/admin/SeccionesAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/frases',
    name: 'FrasesAdmin',
    component: () => import('../views/admin/FrasesAdmin.vue'),
    meta: { requiresAuth: true },
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  if (to.meta.requiresAuth && !token) {
    next('/admin/login')
  } else {
    next()
  }
})

export default router
