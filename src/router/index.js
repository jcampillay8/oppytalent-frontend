import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/public/Landing.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/assistant',
    name: 'AI Assistant',
    component: () => import('../views/public/Home.vue'),
  },
  {
    path: '/login',
    name: 'LoginUser',
    component: () => import('../views/auth/Login.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/register',
    name: 'RegisterUser',
    component: () => import('../views/auth/Register.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/auth/callback',
    name: 'AuthCallback',
    component: () => import('../views/auth/Callback.vue'),
  },
  {
    path: '/home',
    name: 'HomeFeed',
    component: () => import('../views/private/HomeFeed.vue'),
    meta: { requiresAuth: true }
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
    meta: { guestOnly: true }
  },
  {
    path: '/admin',
    name: 'Dashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/admin/cv-wizard',
    name: 'CVWizard',
    component: () => import('../views/admin/CVWizard.vue'),
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
  {
    path: '/admin/chat-logs',
    name: 'ChatLogsAdmin',
    component: () => import('../views/admin/ChatLogsAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username',
    name: 'UserPortfolio',
    component: () => import('../views/public/Home.vue'),
  },
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')
  
  // Si requiere autenticación y NO tiene token
  if (to.meta.requiresAuth && !token) {
    if (to.path.startsWith('/admin')) {
      next('/admin/login')
    } else {
      next('/login')
    }
  } 
  // Si la ruta es solo para invitados y SÍ tiene token
  else if (to.meta.guestOnly && token) {
    if (to.path.startsWith('/admin')) {
      next('/admin')
    } else {
      next('/home')
    }
  } 
  // En cualquier otro caso, continuar
  else {
    next()
  }
})

export default router
