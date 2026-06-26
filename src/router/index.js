import { createRouter, createWebHistory } from 'vue-router'

const routes = [
  {
    path: '/',
    name: 'Landing',
    component: () => import('../views/public/Landing.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/features',
    name: 'Features',
    component: () => import('../views/public/Features.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/talent-info',
    name: 'TalentInfo',
    component: () => import('../views/public/TalentInfo.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/b2b-info',
    name: 'B2BInfo',
    component: () => import('../views/public/B2BInfo.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/pricing',
    name: 'Pricing',
    component: () => import('../views/public/Pricing.vue'),
    meta: { guestOnly: true }
  },
  {
    path: '/about',
    name: 'AboutOppy',
    component: () => import('../views/public/AboutOppy.vue'),
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
    path: '/onboarding/role-selection',
    name: 'RoleSelection',
    component: () => import('../views/auth/RoleSelection.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/home',
    name: 'HomeFeed',
    component: () => import('../views/private/HomeFeed.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/b2b',
    name: 'B2BHome',
    component: () => import('../views/b2b/B2BHome.vue'),
    meta: { requiresAuth: true } 
  },
  {
    path: '/b2b/tribunal',
    name: 'TribunalRoom',
    component: () => import('../views/b2b/TribunalRoom.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/b2b/pipeline',
    name: 'B2BPipeline',
    component: () => import('../views/b2b/Pipeline.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/b2b/metrics',
    name: 'B2BMetrics',
    component: () => import('../views/b2b/Metrics.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/b2b/admin',
    name: 'B2BAdmin',
    component: () => import('../views/b2b/CompanyAdmin.vue'),
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
    path: '/estudio/:id',
    name: 'EstudioDetail',
    component: () => import('../views/public/EstudioDetail.vue'),
  },
  {
    path: '/reconocimiento/:id',
    name: 'ReconocimientoDetail',
    component: () => import('../views/public/ReconocimientoDetail.vue'),
  },
  {
    path: '/habilitacion/:id',
    name: 'HabilitacionDetail',
    component: () => import('../views/public/HabilitacionDetail.vue'),
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
    path: '/:username/dashboard',
    name: 'Dashboard',
    component: () => import('../views/admin/Dashboard.vue'),
    meta: { requiresAuth: true }
  },
  {
    path: '/inbox',
    name: 'Inbox',
    component: () => import('../views/admin/Inbox.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/cv-wizard',
    name: 'CVWizard',
    component: () => import('../views/admin/CVWizard.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/proyectos',
    name: 'ProyectosAdmin',
    component: () => import('../views/admin/ProyectosAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/experiencias',
    name: 'ExperienciasAdmin',
    component: () => import('../views/admin/ExperienciasAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/estudios',
    name: 'EstudiosAdmin',
    component: () => import('../views/admin/EstudiosAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/reconocimientos',
    name: 'ReconocimientosAdmin',
    component: () => import('../views/admin/ReconocimientosAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/habilitaciones',
    name: 'HabilitacionesAdmin',
    component: () => import('../views/admin/HabilitacionesAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/perfil',
    name: 'PerfilAdmin',
    component: () => import('../views/admin/PerfilAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/secciones',
    name: 'SeccionesAdmin',
    component: () => import('../views/admin/SeccionesAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/frases',
    name: 'FrasesAdmin',
    component: () => import('../views/admin/FrasesAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/chat-logs',
    name: 'ChatLogsAdmin',
    component: () => import('../views/admin/ChatLogsAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/chat-config',
    name: 'ChatConfigAdmin',
    component: () => import('../views/admin/ChatConfigAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/theme-config',
    name: 'ThemeConfigAdmin',
    component: () => import('../views/admin/ThemeConfigAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/storage',
    name: 'PlanConsumoAdmin',
    component: () => import('../views/admin/PlanConsumoAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username/rbac',
    name: 'RBACAdmin',
    component: () => import('../views/admin/RBACAdmin.vue'),
    meta: { requiresAuth: true },
  },
  {
    path: '/:username',
    name: 'UserPortfolio',
    component: () => import('../views/public/Home.vue'),
  },
  {
    path: '/admin/:pathMatch(.*)*',
    redirect: to => {
      const user = localStorage.getItem('currentPortfolioUser');
      if (user) {
        // Redirigir /admin/algo a /user/algo
        const path = to.path.replace('/admin', `/${user}`);
        return path === `/${user}` ? `/${user}/dashboard` : path;
      }
      return '/login';
    }
  }
]

const router = createRouter({
  history: createWebHistory(),
  routes,
})

import { useAuthStore } from '../stores/auth'

router.beforeEach(async (to, from, next) => {
  const token = localStorage.getItem('token')
  
  if (to.meta.requiresAuth && !token) {
    next('/login')
  }
  else if (to.meta.guestOnly && token) {
    const user = localStorage.getItem('currentPortfolioUser');
    next(user ? `/${user}/dashboard` : '/home')
  } 
  // En cualquier otro caso, continuar
  else {
    // Role Gate Check (si está logueado pero no tiene role_id y no está ya en la pantalla de selección)
    if (token && to.path !== '/onboarding/role-selection' && !to.path.startsWith('/auth/')) {
      try {
        const authStore = useAuthStore()
        if (!authStore.user) {
          await authStore.fetchUser()
        }
        if (authStore.user && authStore.user.role_id === null) {
          return next('/onboarding/role-selection')
        }
      } catch (e) {
        console.error("Error validando role_id en el router:", e)
      }
    }
    next()
  }
})

import { useThemeStore } from '../stores/useThemeStore'

router.afterEach(async (to, from) => {
  const themeStore = useThemeStore()
  let targetUser = to.params.username
  
  if (!targetUser && to.path.match(/^\/(portafolio|proyecto|experiencia|estudios|sobre-mi|contactame)/)) {
    targetUser = localStorage.getItem('currentPortfolioUser')
  }
  
  if (targetUser) {
    await themeStore.fetchThemeForUser(targetUser)
  } else {
    themeStore.setTheme('dark-glass')
  }
})

export default router
