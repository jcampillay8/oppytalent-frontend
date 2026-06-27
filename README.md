Tengo toda la información necesaria. Ahora escribo el README del frontend.

<｜｜DSML｜｜tool_calls> <｜｜DSML｜｜invoke name="write"> <｜｜DSML｜｜parameter name="filePath" string="true">/home/jcampillay/WorkArea/OppyTalent/OppyTalent-frontend/README.md</｜｜DSML｜｜parameter> <｜｜DSML｜｜parameter name="content" string="true"># OppyTalent Frontend — Portafolios Profesionales con IA

Frontend moderno, reactivo y multi-idioma para la plataforma OppyTalent. Construido con Vue 3 + Vite, proporciona una experiencia de usuario inmersiva con temas visuales dinámicos, un asistente de IA integrado, panel de administración completo, red profesional y herramientas B2B para reclutadores.

Índice
Visión del Producto
Stack Tecnológico
Arquitectura General
Instalación y Configuración
Estructura del Proyecto
Sistema de Rutas
Flujo de Navegación
Gestión de Estado (Pinia Stores)
Servicios y API Client
Componentes UI y Biblioteca Visual
Sistema de Temas y Estilos
Internacionalización (i18n)
Vistas Públicas — Portafolio
Vistas de Autenticación
Panel de Administración
Ecosistema B2B
Red Profesional y Mensajería
Chat Widget IA
Wizard de Importación de CV
Despliegue
Configuración de Entorno
📋 Visión del Producto
OppyTalent transforma el currículum tradicional en una experiencia digital interactiva. Cada talento obtiene un portafolio profesional vivo con:

Portafolio visual con 5 temas y 2 layouts (Tabs / Bento Grid).
Asistente IA que responde preguntas de reclutadores usando RAG vectorial.
Panel de administración completo para gestionar perfil, proyectos, experiencias, estudios, reconocimientos, habilitaciones y frases.
CV Wizard: importa tu CV en PDF y la IA extrae y estructura todos los datos automáticamente.
Red profesional con conexiones, feed de actividad y chat peer-to-peer en tiempo real.
Modo B2B para reclutadores: búsqueda semántica de talento, tribunal de IA y métricas.
Multi-idioma (Español / Inglés).
BYOK (Bring Your Own Key): los usuarios pueden conectar su propia API Key de Gemini.
Impersonación para testing/QA de roles.
🛠️ Stack Tecnológico
Componente	Tecnología
Framework	Vue 3.5 (Composition API + <script setup>)
Build Tool	Vite 6
Lenguaje	JavaScript (ES Modules)
Estado Global	Pinia 2
Router	Vue Router 4 (hash history, lazy loading)
Internacionalización	vue-i18n 11 (es/en)
Estilos	Tailwind CSS 3.4 + CSS Variables + PostCSS
Animaciones	@vueuse/motion 3
Iconos	lucide-vue-next (Lucide icons)
Notificaciones	vue3-toastify
Markdown	marked 18
PDF	html2pdf.js (exportación de portafolio)
QR	qrcode.vue
Imágenes	compressorjs (compresión WebP en cliente)
HTTP Client	Fetch API nativa (servicio api.js)
WebSockets	Native WebSocket API
Package Manager	pnpm 11
Despliegue	Docker + Nginx (multi-stage build)
🏗️ Arquitectura General
text
┌──────────────────────────────────────────────────────────────┐
│                    OppyTalent Frontend                        │
│                     Vue 3 + Vite + Pinia                      │
│                                                              │
│  ┌─────────┐  ┌──────────┐  ┌──────────┐  ┌──────────────┐ │
│  │  Router  │  │  Stores  │  │ Services │  │  Components  │ │
│  │ (routes) │  │ (Pinia)  │  │ (api.js) │  │  (UI kit)    │ │
│  └────┬─────┘  └────┬─────┘  └────┬─────┘  └──────┬───────┘ │
│       │             │             │                │         │
│       └─────────────┴──────┬──────┴────────────────┘         │
│                            │                                  │
│                    ┌───────▼───────┐                          │
│                    │   App.vue     │                          │
│                    │ (Layout +     │                          │
│                    │  Navigation)  │                          │
│                    └───────┬───────┘                          │
│                            │                                  │
│                    ┌───────▼───────┐                          │
│                    │  <router-view> │                         │
│                    └───────────────┘                          │
└────────────────────────────┬─────────────────────────────────┘
                             │
                             ▼
              ┌──────────────────────────────┐
              │  Vite Proxy (desarrollo)     │
              │  /api → localhost:8000       │
              │  ó Nginx (producción)        │
              └──────────────┬───────────────┘
                             │
                      ┌──────▼──────┐
                      │  Backend    │
                      │  FastAPI    │
                      └─────────────┘
Principios de Diseño
Componentes atómicos: UI Kit reutilizable (Badge, GlassCard, NeonButton, SearchSpotlight).
Stores desacoplados: cada dominio (proyectos, experiencia, etc.) tiene su propio store Pinia.
API centralizada: todas las llamadas al backend pasan por src/services/api.js.
Lazy loading: todas las rutas cargan componentes bajo demanda (() => import(...)).
Tema reactivo: el store useThemeStore inyecta clases CSS al <html> y el portafolio se adapta.
i18n en toda la UI: más de 350 claves de traducción en español e inglés.
Proxy de desarrollo: Vite redirige /api/* al backend en http://localhost:8000.
🔧 Instalación y Configuración
Requisitos
Node.js 20+
pnpm 11 (npm install -g pnpm@11)
Backend de OppyTalent corriendo (puerto 8000)
Instalación Local
bash
# 1. Clonar el repositorio
git clone <repo-url> oppytalent-frontend
cd oppytalent-frontend

# 2. Instalar dependencias
pnpm install

# 3. Iniciar servidor de desarrollo (con proxy al backend)
pnpm dev
# → http://localhost:5173 (proxy /api → http://localhost:8000)

# 4. Build para producción
pnpm build
# → Salida en dist/
Docker
bash
# Build de producción con Nginx
docker build -t oppytalent-frontend .

# Ejecutar (requiere variables de entorno)
docker run -p 80:80 \
  -e PORT=80 \
  -e BACKEND_URL=https://api.oppytalent.com \
  oppytalent-frontend
📁 Estructura del Proyecto
text
OppyTalent-frontend/
├── index.html                       # Punto de entrada HTML (Google Fonts Inter)
├── vite.config.js                   # Configuración Vite + proxy /api
├── tailwind.config.js               # Configuración Tailwind (colores CSS vars, animaciones)
├── postcss.config.js                # PostCSS con Tailwind + Autoprefixer
├── pnpm-lock.yaml                   # Lockfile de dependencias
├── pnpm-workspace.yaml              # Configuración workspace pnpm
├── Dockerfile                       # Multi-stage build (Node build → Nginx serve)
├── default.conf.template            # Plantilla Nginx (variables PORT y BACKEND_URL)
├── .npmrc                           # Configuración npm/pnpm
│
└── src/
    ├── main.js                      # ★ Bootstrap: Pinia, Router, i18n, Motion, Toastify
    ├── App.vue                      # ★ Componente raíz: Navbar, Footer, ChatWidget, RouterView
    ├── i18n.js                      # Configuración vue-i18n (es/en, detección automática)
    │
    ├── router/
    │   └── index.js                 # ★ 40+ rutas con lazy loading, guards de auth, role gate
    │
    ├── services/
    │   ├── api.js                   # ★ Cliente HTTP centralizado (todos los endpoints)
    │   └── utils.js                 # parseImageUrl() — proxy de imágenes Google Drive
    │
    ├── stores/                      # ★ Pinia Stores (gestión de estado)
    │   ├── auth.js                  # Autenticación, sesión, impersonación, RBAC
    │   ├── perfil.js                # Perfil profesional CRUD
    │   ├── proyectos.js             # Proyectos CRUD
    │   ├── experiencias.js          # Experiencias laborales CRUD
    │   ├── estudios.js              # Estudios CRUD
    │   ├── reconocimientos.js       # Reconocimientos CRUD
    │   ├── habilitaciones.js        # Habilitaciones CRUD
    │   ├── frases.js                # Frases célebres CRUD
    │   ├── chat.js                  # Chat IA (mensajes, historial)
    │   ├── chatLogs.js              # Logs del chat IA (estadísticas)
    │   ├── chat_p2p.js              # Chat peer-to-peer (conversaciones, WebSocket, polling)
    │   ├── cvWizard.js              # Wizard de importación de CV (items pendientes, reorden)
    │   ├── network.js               # Red profesional (conexiones, pendientes, sugerencias)
    │   └── useThemeStore.js         # Tema visual y layout del portafolio
    │
    ├── composables/
    │   ├── useSectionConfig.js      # Configuración de visibilidad de secciones
    │   └── useTranslatedData.js     # Hidratación de datos traducidos
    │
    ├── locales/
    │   ├── es.json                  # ~350 claves en español
    │   └── en.json                  # ~350 claves en inglés
    │
    ├── assets/styles/
    │   ├── main.css                 # ★ Variables CSS, Tailwind layers, estilos globales
    │   ├── themes.css               # ★ 5 temas: dark-glass, light-minimalist, cyber-neon,
    │   │                            #    ocean-blue, rose-gold
    │   └── layout.css               # Estilos de layout (grid, secciones)
    │
    ├── components/
    │   ├── ui/                      # ★ UI Kit reutilizable
    │   │   ├── GlassCard.vue        # Tarjeta glassmorphism
    │   │   ├── NeonButton.vue       # Botón con efecto neón (4 variantes)
    │   │   ├── Badge.vue            # Badge con variantes de color
    │   │   ├── AuroraBackground.vue # Fondo animado de aurora
    │   │   ├── AnimatedDropdown.vue # Dropdown animado
    │   │   ├── ConnectionButton.vue # Botón de conexión de red
    │   │   ├── DegreeBadge.vue      # Badge de grado de conexión
    │   │   └── SearchSpotlight.vue  # Buscador tipo spotlight
    │   │
    │   ├── public/                  # ★ Componentes de portafolio público
    │   │   ├── ChatWidget.vue       # Widget flotante de chat IA
    │   │   ├── LandingNavbar.vue    # Navbar de landing público
    │   │   ├── PortfolioBentoLayout.vue # Layout Bento Grid
    │   │   ├── PortfolioTabsLayout.vue  # Layout Tabs
    │   │   ├── ProyectoCard.vue     # Tarjeta de proyecto
    │   │   ├── ExperienciaCard.vue  # Tarjeta de experiencia
    │   │   ├── EstudioCard.vue      # Tarjeta de estudio
    │   │   ├── ReconocimientoCard.vue # Tarjeta de reconocimiento
    │   │   ├── HabilitacionCard.vue # Tarjeta de habilitación
    │   │   └── FilterBar.vue        # Barra de filtros
    │   │
    │   └── admin/                   # ★ Componentes de administración
    │       ├── AdminLayout.vue       # Layout del panel admin (sidebar)
    │       ├── ImageUploader.vue     # Subida de imágenes con preview
    │       ├── PerfilForm.vue        # Formulario de perfil
    │       ├── ProyectoForm.vue      # Formulario de proyecto
    │       ├── ExperienciaForm.vue   # Formulario de experiencia
    │       ├── EstudioForm.vue       # Formulario de estudio
    │       ├── FraseForm.vue         # Formulario de frase
    │       ├── ReconocimientoForm.vue # Formulario de reconocimiento
    │       └── HabilitacionForm.vue  # Formulario de habilitación
    │
    └── views/                       # ★ Vistas principales
        ├── public/                  # Vistas públicas (portafolio, landing)
        │   ├── Landing.vue          # Landing page principal
        │   ├── Home.vue             # Portafolio público (tema-aware)
        │   ├── PortfolioView.vue    # Vista completa del portafolio
        │   ├── About.vue            # Acerca de / Sobre mí
        │   ├── AboutOppy.vue        # Acerca de OppyTalent
        │   ├── Features.vue         # Características
        │   ├── TalentInfo.vue       # Info para talentos
        │   ├── B2BInfo.vue          # Info para reclutadores
        │   ├── Pricing.vue          # Planes y precios
        │   ├── Contactame.vue       # Formulario de contacto
        │   ├── ProyectoDetail.vue   # Detalle de proyecto
        │   ├── ExperienciaDetail.vue # Detalle de experiencia
        │   ├── EstudiosList.vue     # Lista de estudios
        │   ├── EstudioDetail.vue    # Detalle de estudio
        │   ├── ReconocimientoDetail.vue # Detalle de reconocimiento
        │   └── HabilitacionDetail.vue   # Detalle de habilitación
        │
        ├── auth/                    # Vistas de autenticación
        │   ├── Login.vue            # Login (email + Google OAuth)
        │   ├── Register.vue         # Registro de nuevo usuario
        │   ├── RoleSelection.vue    # Selección de rol post-registro
        │   └── Callback.vue         # Callback OAuth Google
        │
        ├── admin/                   # ★ Panel de administración
        │   ├── Dashboard.vue        # Dashboard principal (estadísticas, CV upload)
        │   ├── PerfilAdmin.vue      # Editor de perfil
        │   ├── ProyectosAdmin.vue   # Gestión de proyectos
        │   ├── ExperienciasAdmin.vue # Gestión de experiencias
        │   ├── EstudiosAdmin.vue    # Gestión de estudios
        │   ├── ReconocimientosAdmin.vue # Gestión de reconocimientos
        │   ├── HabilitacionesAdmin.vue # Gestión de habilitaciones
        │   ├── FrasesAdmin.vue      # Gestión de frases
        │   ├── SeccionesAdmin.vue   # Visibilidad de secciones
        │   ├── AparienciaAdmin.vue  # Configuración de apariencia
        │   ├── ThemeConfigAdmin.vue # Selector de tema y layout
        │   ├── ChatConfigAdmin.vue  # Configuración del chat IA (pitch rules)
        │   ├── ChatLogsAdmin.vue    # Logs del chat IA
        │   ├── Inbox.vue            # Bandeja de entrada P2P
        │   ├── CVWizard.vue         # Wizard de importación de CV
        │   ├── RBACAdmin.vue        # Gestión de roles y permisos
        │   ├── PlanConsumoAdmin.vue # Almacenamiento, créditos, BYOK
        │   └── ShareAdmin.vue       # Compartir/exportar portafolio
        │
        ├── b2b/                     # ★ Herramientas B2B
        │   ├── B2BHome.vue          # Home del reclutador
        │   ├── CompanyAdmin.vue     # Administración de empresa
        │   ├── Pipeline.vue         # Pipeline de reclutamiento
        │   ├── Metrics.vue          # Métricas y analytics
        │   └── TribunalRoom.vue     # Sala de tribunal IA
        │
        └── private/                 # Vistas privadas (requieren auth)
            ├── HomeFeed.vue         # Feed personal de actividad
            └── NetworkHub.vue       # Hub de red profesional
🧭 Sistema de Rutas
El router (src/router/index.js) define más de 40 rutas con lazy loading, navegación antes/después y guards de autenticación.

Grupos de Rutas
Grupo	Prefijo	Meta	Auth Requerida
Landing Público	/, /features, /pricing	guestOnly	No
Info	/talent-info, /b2b-info	guestOnly	No
Auth	/login, /register, /auth/callback	guestOnly	No
Onboarding	/onboarding/role-selection	requiresAuth	Sí
Portafolio	/:username (catch-all)	—	No
Admin	/:username/dashboard, etc.	requiresAuth	Sí
B2B	/b2b/*	requiresAuth	Sí
Red	/network	requiresAuth	Sí
Privado	/home	requiresAuth	Sí
Guards de Navegación
javascript
// beforeEach — Auth + Role Gate
router.beforeEach((to, from, next) => {
  const token = localStorage.getItem('token')

  // 1. Si requiere auth y no hay token → redirect a /login
  if (to.meta.requiresAuth && !token) return next('/login')

  // 2. Si es guest-only y hay token → redirect al dashboard
  if (to.meta.guestOnly && token) {
    return next(user ? `/${user}/dashboard` : '/home')
  }

  // 3. Role Gate: si está logueado pero no tiene role_id → redirect a selección de rol
  if (token && to.path !== '/onboarding/role-selection' && !to.path.startsWith('/auth/')) {
    const authStore = useAuthStore()
    if (authStore.user && authStore.user.role_id === null) {
      return next('/onboarding/role-selection')
    }
  }

  next()
})

// afterEach — Tema dinámico por usuario
router.afterEach(async (to) => {
  const themeStore = useThemeStore()
  const targetUser = to.params.username || localStorage.getItem('currentPortfolioUser')
  if (targetUser) {
    await themeStore.fetchThemeForUser(targetUser)
  } else {
    themeStore.setTheme('dark-glass')
  }
})
Manejo de Rutas Admin Legacy
El router incluye un catch-all redirect que convierte rutas legacy /admin/* al formato /:username/* usando el usuario almacenado en localStorage:

javascript
{
  path: '/admin/:pathMatch(.*)*',
  redirect: to => {
    const user = localStorage.getItem('currentPortfolioUser')
    if (user) return to.path.replace('/admin', `/${user}`)
    return '/login'
  }
}
🔀 Flujo de Navegación
text
                         ┌──────────────┐
                         │   / (Landing) │
                         │  (guestOnly)  │
                         └──────┬───────┘
                                │
                    ┌───────────┼───────────┐
                    │           │           │
              ┌─────▼────┐ ┌───▼───┐ ┌─────▼─────┐
              │ /features │ │/login │ │/pricing   │
              │ /talent-  │ │/regist│ │/b2b-info  │
              │ info      │ │er     │ │/about     │
              └──────────┘ └───┬───┘ └───────────┘
                               │
                    ┌──────────▼──────────┐
                    │   /auth/callback    │
                    │ (Google OAuth)      │
                    └──────────┬──────────┘
                               │
                    ┌──────────▼──────────┐
                    │ /onboarding/        │
                    │ role-selection      │
                    └──────────┬──────────┘
                               │
          ┌────────────────────┼────────────────────┐
          │                    │                    │
   ┌──────▼──────┐    ┌───────▼───────┐    ┌───────▼───────┐
   │  /home      │    │  /:username/  │    │  /b2b/*      │
   │ (Feed)      │    │  dashboard    │    │ (Hunter)      │
   └─────────────┘    │  (Admin)      │    └───────────────┘
                      └───────┬───────┘
                              │
          ┌───────────────────┼───────────────────┐
          │                   │                   │
   ┌──────▼──────┐    ┌──────▼──────┐    ┌───────▼───────┐
   │ /:username  │    │  /:username │    │  /:username   │
   │ /proyectos  │    │  /chat-     │    │  /rbac        │
   │ /estudios   │    │  config     │    │  (Owner)      │
   │ /perfil     │    │  /apariencia│    └───────────────┘
   │ /cv-wizard  │    │  /chat-logs │
   └─────────────┘    └─────────────┘
                              │
                    ┌─────────▼─────────┐
                    │  /portafolio      │
                    │  /sobre-mi        │
                    │  /contactame      │
                    │  /proyecto/:id    │
                    │  /experiencia/:id │
                    │  /network         │
                    └───────────────────┘
📦 Gestión de Estado (Pinia Stores)
Stores por Dominio
Store	Archivo	Estado Clave	Acciones Clave
auth	stores/auth.js	user, token, loading, error	login(), logout(), fetchUser(), impersonate(), restoreRole()
perfil	stores/perfil.js	items[], loading	fetchAll(), create(), update(), remove()
proyectos	stores/proyectos.js	items[], loading	fetchAll(), create(), update(), remove()
experiencias	stores/experiencias.js	items[], loading	fetchAll(), create(), update(), remove()
estudios	stores/estudios.js	items[], loading	fetchAll(), create(), update(), remove()
reconocimientos	stores/reconocimientos.js	items[], loading	fetchAll(), create(), update(), remove()
habilitaciones	stores/habilitaciones.js	items[], loading	fetchAll(), create(), update(), remove()
frases	stores/frases.js	items[], loading	fetchAll(), create(), update(), remove()
chat	stores/chat.js	messages[], loading, context	sendMessage(), loadHistory(), registerClick()
chatLogs	stores/chatLogs.js	logs[], stats[], loading	fetchLogs(), fetchStats()
chat_p2p	stores/chat_p2p.js	conversations[], unreadCount, ws	startPolling(), stopPolling(), sendMessage()
cvWizard	stores/cvWizard.js	pendingItems{}, importing, error	setPendingItems(), clearCategory(), saveAll()
network	stores/network.js	connections[], pendingCount, suggestions[]	fetchConnections(), startPolling()
useThemeStore	stores/useThemeStore.js	theme, layout, loaded	setTheme(), fetchThemeForUser()
Store de Autenticación (auth.js) — Detalle
El store de autenticación es el más complejo. Gestiona:

Login: almacena token en localStorage, fetch de datos del usuario + permisos.
Impersonación: llama a /auth/impersonate, actualiza el token y el usuario.
Restore Role: revierte la impersonación llamando a /auth/restore.
User Profile: fetchUser() obtiene perfil completo con permisos RBAC.
Persistencia: el token persiste en localStorage — en cada fetchUser() se verifica que el usuario siga siendo válido.
javascript
// Estructura del usuario autenticado
user = {
  id, username, email,
  firstName, lastName, userImage,
  role,              // Rol legacy
  role_id,           // Rol RBAC
  role_name,         // Nombre del rol (Owner, Hunter, Talent...)
  permissions: [],   // Lista de permisos del rol
  isImpersonating,   // Flag de impersonación
  is_premium,
  ai_credits,
  storage_used,
  is_visible_b2b,
  is_recruiter,
  chat_welcome_message,
  ai_pitch_rules: [],
  portfolio_theme,   // dark-glass, light-minimalist, etc.
  portfolio_layout,  // tabs, bento
  has_gemini_key,
  google_refresh_token: bool
}
🌐 Servicios y API Client
src/services/api.js — Cliente HTTP Centralizado
Todas las comunicaciones con el backend pasan por el objeto api. Implementa:

Inyección automática de token: lee localStorage.getItem('token') y lo envía como Authorization: Bearer.
Manejo de errores: parsea data.detail del backend y lanza errores con status HTTP.
Compresión de imágenes: usa compressorjs para reducir imágenes a WebP (1200px, 0.7 quality) antes de subir.
Endpoints cubiertos (más de 60 métodos):

Categoría	Métodos
Auth & RBAC	login, me, impersonate, restoreRole, qaResetCredits, getRoles, getPermissions, toggleRolePermission, getRbacUsers, updateUserRole
Usuarios	searchUsers, getUserByUsername, updateCustomSlug, updateChatConfig, updateThemeConfig, updateB2bConfig, selectUserRole, updateGeminiKey
Portafolio CRUD	get*, create*, update*, delete* para Proyectos, Experiencias, Estudios, Perfil, Frases, Reconocimientos, Habilitaciones
Chat IA	chat, registerChatClick, getChatLogs, getChatStats
Chat P2P	getChatConversations, startChatConversation, getChatMessages, sendChatMessage, markChatAsRead, getChatUnreadCount
Networking	sendConnectionRequest, acceptConnection, rejectConnection, getConnections, getPendingConnections, getConnectionStatus, getConnectionDegree, getNetworkFeed, getNetworkSuggestions
B2B	searchTalent, tribunalCandidate, tribunalModerator, getTribunalHistory, getTalentFeedback, getDemandInsights
AI	translateWithAI, extractCV
Storage	getGoogleAuthUrl, uploadImage
Secciones	getSeccionConfigs, updateSeccionConfig
src/services/utils.js — Utilidades
parseImageUrl(value): normaliza URLs de imágenes. Si es una URL de Google Drive, la convierte al proxy del backend (/api/v1/images/proxy?url=...) para evitar problemas de CORS.
🎨 Componentes UI y Biblioteca Visual
UI Kit (src/components/ui/)
Componente	Propósito	Props clave
GlassCard	Tarjeta con efecto glassmorphism	variant, hover, glow
NeonButton	Botón con efecto neón	variant (primary, outline, ghost, destructive), size
Badge	Etiqueta de estado	variant (primary, secondary, destructive, outline)
AuroraBackground	Fondo animado tipo aurora boreal	—
AnimatedDropdown	Dropdown con animación de entrada/salida	align (left, right)
ConnectionButton	Botón de conexión de red profesional	userId, show pending/connected/rejected
DegreeBadge	Badge de grado de separación (1°, 2°, 3°)	degree
SearchSpotlight	Buscador tipo spotlight con resultados	modelValue, results, isLoading
Componentes de Portafolio Público
Componente	Descripción
ChatWidget	Widget flotante de chat IA (esquina inferior derecha)
PortfolioBentoLayout	Layout en cuadrícula tipo Bento Grid
PortfolioTabsLayout	Layout con pestañas navegables
ProyectoCard	Tarjeta de proyecto con stack tecnológico, KPIs, enlaces
ExperienciaCard	Tarjeta de experiencia laboral con periodo y logros
EstudioCard	Tarjeta de estudio/institución
ReconocimientoCard	Tarjeta de premio/publicación
HabilitacionCard	Tarjeta de licencia/habilitación
FilterBar	Barra de filtros con búsqueda
Componentes de Administración
Componente	Descripción
AdminLayout	Layout del panel admin con sidebar de navegación
ImageUploader	Subida de imágenes con preview, arrastrar y soltar
PerfilForm	Formulario completo de perfil profesional
ProyectoForm	Formulario de proyecto con stack, KPIs, galería
ExperienciaForm	Formulario de experiencia con logros y tags
EstudioForm	Formulario de estudio/título
FraseForm	Formulario de frase célebre
ReconocimientoForm	Formulario de reconocimiento/premio
HabilitacionForm	Formulario de habilitación/licencia
🎭 Sistema de Temas y Estilos
5 Temas Visuales
Tema	Variable CSS data-theme	Paleta
Dark Glass	dark-glass	Fondo oscuro, acento cian/violeta, glass
Light Minimalist	light-minimalist	Fondo claro, acento índigo, minimalista
Cyber Neon	cyber-neon	Fondo oscuro, acentos neón (rosa, cian)
Ocean Blue	ocean-blue	Azules profundos, turquesa, fondo marino
Rose Gold	rose-gold	Rosados, dorados, fondos cálidos
2 Layouts de Portafolio
Layout	Componente	Descripción
Tabs	PortfolioTabsLayout.vue	Navegación por pestañas (Perfil, Proyectos, Experiencia, Estudios, etc.)
Bento	PortfolioBentoLayout.vue	Cuadrícula tipo Bento Grid con tarjetas de diferentes tamaños
Sistema de Estilos
main.css: define variables CSS en :root para colores, bordes, sombras y animaciones. Usa Tailwind layers (@tailwind base, @tailwind components, @tailwind utilities).
themes.css: define los 5 temas mediante el selector [data-theme="..."] sobrescribiendo las variables CSS.
layout.css: estilos de estructura de página, secciones y grids.
Mecanismo de cambio de tema:

javascript
// useThemeStore.js
setTheme(themeName) {
  document.documentElement.setAttribute('data-theme', themeName)
  this.theme = themeName
}
El tema se persigue por usuario (cada portafolio puede tener su propio tema) y se carga automáticamente en router.afterEach:

javascript
router.afterEach(async (to) => {
  const targetUser = to.params.username || localStorage.getItem('currentPortfolioUser')
  if (targetUser) {
    await themeStore.fetchThemeForUser(targetUser) // GET /user/{username} → portfolio_theme
  }
})
🌍 Internacionalización (i18n)
Configuración en src/i18n.js con vue-i18n 11 (Composition API, legacy: false).

Detección de Idioma
javascript
const savedLanguage = localStorage.getItem('user-language')
const browserLanguage = navigator.language.split('-')[0]
const defaultLanguage = savedLanguage || (['es', 'en'].includes(browserLanguage) ? browserLanguage : 'es')
Cambio de Idioma en la UI
El toggle de idioma está en App.vue y persiste la selección:

javascript
function toggleLanguage() {
  locale.value = locale.value === 'es' ? 'en' : 'es'
  localStorage.setItem('user-language', locale.value)
}
Cobertura
Más de 350 claves de traducción por idioma, cubriendo:

Navegación principal y menús
Formularios de administración
Chat IA (incluyendo respuestas del sistema)
Red profesional
B2B / Tribunal
Páginas públicas (Landing, Features, Pricing, About)
Estados vacíos, errores y validaciones
👁️ Vistas Públicas — Portafolio
Home.vue — Portafolio Principal
Es la vista principal del portafolio público, accesible via /:username. Características:

Tema-aware: aplica el tema visual del usuario portafolio.
Secciones dinámicas: solo renderiza las secciones habilitadas en seccion_config.
Componentes: renderiza PerfilCard, ProyectoCard, ExperienciaCard, etc. según configuración.
ChatWidget: widget flotante de chat IA en la esquina inferior derecha.
PortfolioView.vue — Vista Completa del Portafolio
Renderiza el portafolio completo usando el layout seleccionado:

PortfolioTabsLayout.vue: navegación por pestañas.
PortfolioBentoLayout.vue: cuadrícula tipo Bento.
Ambos layouts incluyen:

Foto de perfil / avatar
Secciones expandibles
Traducciones multi-idioma
KPIs y métricas de proyectos
Enlaces a GitHub, LinkedIn, demo
Vistas de Detalle
Cada entidad tiene su vista de detalle con información completa:

Vista	Ruta	Contenido
ProyectoDetail	/proyecto/:id	Descripción completa, stack, KPIs, galería, enlaces, video YouTube
ExperienciaDetail	/experiencia/:id	Empresa, rol, periodo, logros detallados
EstudiosList	/estudios	Lista de instituciones y títulos
EstudioDetail	/estudio/:id	Institución, título, año, descripción
ReconocimientoDetail	/reconocimiento/:id	Tipo, institución, fecha, descripción
HabilitacionDetail	/habilitacion/:id	Tipo, título, descripción
About	/sobre-mi	Perfil completo + descripción personal
Contactame	/contactame	Información de contacto, LinkedIn, GitHub, email
Landing y Páginas Públicas
Vista	Ruta	Propósito
Landing	/	Página principal con hero, características, CTA
Features	/features	Funcionalidades detalladas de la plataforma
TalentInfo	/talent-info	Beneficios para talentos
B2BInfo	/b2b-info	Beneficios para reclutadores
Pricing	/pricing	Planes y precios
AboutOppy	/about	Acerca de OppyTalent
🔑 Vistas de Autenticación
Login.vue
Pantalla de inicio de sesión con dos modos:

Email/Password: formulario estándar con validación.
Google OAuth: botón de "Continuar con Google" que redirige al flujo OAuth del backend.
Incluye enlaces a "Olvidé mi contraseña" y "Crear cuenta".

Register.vue
Formulario de registro con los siguientes campos:

Nombre, Apellido, Username, Email, Contraseña (con validación de complejidad)
Subida opcional de foto de perfil (con compresión WebP en cliente)
Aceptación de términos y condiciones
RoleSelection.vue
Pantalla post-registro (protegida por role_id === null guard):

El usuario elige entre Talent (quiero mostrar mi portafolio) o Hunter (quiero reclutar talento).
Persiste la selección via api.selectUserRole(role_name).
Redirige al dashboard o al home de B2B según el rol.
Callback.vue
Manejador del callback OAuth de Google. Procesa el token recibido en la URL y redirige al dashboard.

🛠️ Panel de Administración
El panel de administración está disponible en /:username/* y requiere autenticación.

Dashboard.vue — Panel Principal
Vista central con:

Métrica de créditos IA: barra de progreso visual con los créditos restantes.
Uso de almacenamiento: indicador de espacio usado vs. límite.
Gráfico de uso de chat: estadísticas diarias de interacciones (últimos 30 días).
Botón de CV Wizard: acceso rápido a la importación de CV.
Estado B2B: indicador de visibilidad en búsqueda B2B.
Enlaces rápidos: acceso a todas las secciones de administración.
Gestores CRUD
Cada gestor CRUD sigue el mismo patrón:

Lista con tabla de items (con acciones: editar, eliminar).
Formulario modal para crear/editar (usando los componentes *Form.vue).
Confirmación antes de eliminar.
Estado vacío con mensaje amigable y CTA para crear el primer item.
Vista	Ruta	Descripción
ProyectosAdmin	/:username/proyectos	CRUD de proyectos del portafolio
ExperienciasAdmin	/:username/experiencias	CRUD de experiencias laborales
EstudiosAdmin	/:username/estudios	CRUD de estudios
ReconocimientosAdmin	/:username/reconocimientos	CRUD de reconocimientos
HabilitacionesAdmin	/:username/habilitaciones	CRUD de habilitaciones
FrasesAdmin	/:username/frases	CRUD de frases célebres
PerfilAdmin	/:username/perfil	Editor de perfil profesional
SeccionesAdmin	/:username/secciones	Toggle de visibilidad de secciones del portafolio
ChatConfigAdmin.vue — Configuración del Chat IA
Mensaje de Bienvenida: personaliza el mensaje inicial del chat.
Agent Skills (Pitch Rules): reglas de venta personalizadas. Cada regla tiene:
keyword: palabra clave que activa la regla.
pitch: argumento de venta que usará la IA.
call_to_action: enlace al que se redirige.
Visibilidad B2B: toggle para aparecer en búsquedas de reclutadores.
ThemeConfigAdmin.vue — Temas y Layout
Selector visual con preview de los 5 temas + selector de layout (Tabs / Bento). Persiste via api.updateThemeConfig().

ChatLogsAdmin.vue — Registros del Chat
Tabla paginada con todas las interacciones del chat IA, incluyendo:

Mensaje del usuario, respuesta de la IA
IP, ciudad, región, país (geolocalización)
Links clickeados (tracking de conversión)
Columnas personalizables (toggle show/hide)
Modal de detalle con la conversación completa
PlanConsumoAdmin.vue — Plan y Consumo
Almacenamiento: barra de progreso con límite free (25 MB) y upgrade a premium.
Créditos IA: contador y botón de recarga.
BYOK (Bring Your Own Key): campo para ingresar API Key de Gemini (se valida y encripta).
Sincronizar RAG: botón para disparar sincronización manual de vectores.
Conexión Google Drive: estado de vinculación con Google Drive.
RBACAdmin.vue — Roles y Permisos
Panel de administración de roles:

Directorio de usuarios: lista de usuarios con su rol asignado.
Matriz de permisos: tabla de roles × permisos con toggles para otorgar/revocar.
Asignación de roles: selector para cambiar el rol de un usuario.
Visible solo para usuarios con permiso can_manage_roles.
ShareAdmin.vue — Compartir Portafolio
Opciones para compartir el portafolio:

Enlace personalizado: input con el slug del portafolio (copiable).
Código QR: generación de QR con qrcode.vue.
Exportar PDF: descarga del portafolio como PDF usando html2pdf.js.
Redes sociales: enlaces para compartir en LinkedIn, Twitter, WhatsApp.
Inbox.vue — Bandeja de Mensajes
Sistema de mensajería peer-to-peer:

Lista de conversaciones: muestra otros participantes, último mensaje y timestamp.
Chat en vivo: vista de conversación con burbujas de mensaje.
No leídos: badge con contador de mensajes no leídos.
WebSocket: actualización en tiempo real via ws://.
CVWizard.vue — Wizard de Importación
Ver sección dedicada abajo.

💼 Ecosistema B2B
B2BHome.vue — Home del Reclutador
Dashboard para reclutadores (rol Hunter). Incluye:

Buscador semántico: campo de búsqueda con api.searchTalent().
Resultados: tarjetas de talentos encontrados con score de afinidad y foto.
Acciones: botón para iniciar chat o agregar a pipeline.
TribunalRoom.vue — Sala de Tribunal IA
Interfaz para el Tribunal de Talentos B2B:

Pregunta: el reclutador ingresa una pregunta técnica.
Selección de candidatos: picker de talentos para evaluar.
Respuestas: las tarjetas de respuesta se despliegan a medida que los "Clones Digitales" responden.
Moderación: botón para ejecutar el moderador IA que evalúa todas las respuestas.
Resultados: vista con el resumen del moderador y comparativa lado a lado.
Pipeline.vue — Pipeline de Reclutamiento
Gestión visual del pipeline de contratación (kanban-style):

Columnas: Contactado, En Proceso, Entrevista, Oferta, Contratado.
Arrastrar y soltar entre etapas (funcionalidad base).
Información de cada candidato en las tarjetas.
Metrics.vue — Métricas B2B
Estadísticas y analytics:

Demand Insights: visualización de las habilidades más buscadas (datos simulados).
Gráficos de actividad: uso del sistema B2B.
Resumen de tribunales: histórico de evaluaciones realizadas.
CompanyAdmin.vue — Administración de Empresa
Configuración del perfil de empresa reclutadora (vista básica).

🔗 Red Profesional y Mensajería
NetworkHub.vue — Hub de Red
Centro de red profesional con las siguientes secciones:

Sección	Descripción
Conexiones	Lista de conexiones aceptadas con avatar, nombre y grado
Solicitudes	Solicitudes de conexión pendientes (Aceptar/Rechazar)
Sugerencias IA	Sugerencias de conexión generadas por el Matchmaker IA
Feed de Red	Actividad reciente de la red (1° y 2° grado)
Buscar Talentos	Spotlight search para encontrar usuarios
chat_p2p.js Store — Mensajería en Tiempo Real
javascript
// Polling de mensajes no leídos cada 15 segundos
startPolling() {
  this.pollingInterval = setInterval(async () => {
    const data = await api.getChatUnreadCount()
    this.unreadCount = data.unread_count
    const convos = await api.getChatConversations()
    this.conversations = convos
  }, 15000)
}
El App.vue inicia/detiene el polling automáticamente cuando el usuario se loguea/desloguea:

javascript
watch(() => authStore.token, (newToken) => {
  if (newToken) {
    chatStore.startPolling()
    networkStore.startPolling()
  } else {
    chatStore.stopPolling()
    networkStore.stopPolling()
  }
}, { immediate: true })
💬 Chat Widget IA
ChatWidget.vue
Componente flotante que se muestra en la esquina inferior derecha de las vistas públicas del portafolio.

Características:

Estado inicial: minimizado (solo botón flotante).
Al abrir: muestra historial de mensajes con burbujas (usuario / IA).
Mensaje de bienvenida personalizado (desde chat_welcome_message del usuario).
Soporte para Markdown en respuestas (usando marked).
Enlaces interactivos: /proyecto/:id, /experiencia/:id, /contactame.
Tracking de clicks: cuando el usuario hace clic en un enlace, se registra via registerChatClick().
Input con envío por Enter o botón.
Animaciones de entrada/salida.
Flujo de integración:

text
ChatWidget.vue
  ↓ userMessage
api.chat(messages) → POST /api/v1/chat/
  ↓ response
Procesar Markdown (marked) → Renderizar en burbuja
  ↓ click en enlace
api.registerChatClick(logId, link) → PATCH /api/v1/chat/{logId}/click
📄 Wizard de Importación de CV
CVWizard.vue — Importación Inteligente de CV
Flujo completo de importación de CV usando IA:

text
1. SUBIR CV                   2. IA EXTRAE              3. REVISAR Y EDITAR
┌──────────────┐              ┌──────────────────┐      ┌──────────────────┐
│ Arrastrar     │             │ La IA extrae:    │      │ Editar campos    │
│ PDF / DOCX /  │────────────►│ - Datos contacto │─────►│ Reordenar items  │
│ Imagen        │             │ - Proyectos      │      │ ─── drag & drop ─│
└──────────────┘              │ - Experiencias   │      │                  │
                              │ - Estudios       │      │ 4. GUARDAR TODO  │
                              │ - Reconocimientos│      │ ────────────────►│
                              │ - Habilitaciones │      │ API create*()    │
                              └──────────────────┘      └──────────────────┘
Store: cvWizard.js

javascript
state: {
  pendingItems: {
    datos_contacto: null,
    proyectos: [],
    experiencias: [],
    estudios: [],
    reconocimientos: [],
    habilitaciones: []
  },
  importing: false,
  error: null
}
Características:

Subida de archivo (PDF, DOCX, imágenes).
Extracción vía api.extractCV(formData) → backend usa MarkItDown + Gemini.
Categorización automática en las 6 secciones del portafolio.
Reordenación drag & drop dentro de cada categoría.
Edición inline de cada item antes de guardar.
Guardado masivo: crea/actualiza todos los items en sus respectivos stores.
🚀 Despliegue
Arquitectura de Despliegue
text
┌──────────────┐     ┌─────────────────────────────────────────────┐
│   Usuario    │────►│         Nginx (Frontend)                     │
│              │     │  - Sirve SPA (dist/)                        │
│              │     │  - Proxy inverso /api → Backend             │
└──────────────┘     │  - Inyecta variables de entorno            │
                     └────────────────────┬────────────────────────┘
                                          │
                                   ┌──────▼──────┐
                                   │   Backend    │
                                   │   FastAPI    │
                                   └─────────────┘
Docker Multi-stage Build
dockerfile
# Stage 1: Build (Node 22 + pnpm)
FROM node:22-alpine AS build
RUN npm install -g pnpm@11
WORKDIR /app
COPY package.json pnpm-lock.yaml ./
RUN pnpm install --ignore-scripts
COPY . .
RUN pnpm build

# Stage 2: Serve (Nginx)
FROM nginx:1.27-alpine
COPY --from=build /app/dist /usr/share/nginx/html
COPY default.conf.template /etc/nginx/templates/
EXPOSE 80
CMD envsubst '$PORT $BACKEND_URL' < /etc/nginx/templates/default.conf.template > /etc/nginx/conf.d/default.conf && nginx -g 'daemon off;'
Nginx Configuration
nginx
server {
    listen ${PORT};
    root /usr/share/nginx/html;
    index index.html;

    # SPA fallback: todas las rutas sirven index.html
    location / {
        try_files $uri $uri/ /index.html;
    }

    # Proxy inverso al backend
    location /api/ {
        proxy_pass ${BACKEND_URL};
        proxy_ssl_server_name on;
        proxy_set_header Host $proxy_host;
        proxy_set_header X-Original-IP $http_x_forwarded_for;
        proxy_set_header X-Real-IP $remote_addr;
        proxy_set_header X-Forwarded-For $proxy_add_x_forwarded_for;
        proxy_set_header X-Forwarded-Proto $scheme;
    }
}
Variables de Entorno para Producción
bash
PORT=80                          # Puerto de Nginx
BACKEND_URL=https://api.oppytalent.com  # URL del backend FastAPI
🔧 Configuración de Entorno
El frontend no requiere archivo .env para funcionar localmente. La comunicación con el backend se configura via:

Desarrollo (Vite Proxy)
En vite.config.js:

javascript
server: {
  port: 5173,
  proxy: {
    '/api': {
      target: 'http://localhost:8000',
      changeOrigin: true,
    },
  },
}
Producción (Nginx)
Las variables se inyectan en tiempo de ejecución via envsubst en el template de Nginx:

PORT: puerto del contenedor (default: 80).
BACKEND_URL: URL base del backend (ej: https://api.oppytalent.com).
📊 Resumen de Capacidades
Funcionalidad	Estado	Componentes Clave
Portafolio público con 5 temas + 2 layouts	✅ Completo	Home.vue, Portfolio*Layout.vue, *Card.vue
CRUD completo de portafolio (7 entidades)	✅ Completo	7 stores + 7 formularios + 7 vistas admin
Chat IA con RAG vectorial	✅ Completo	ChatWidget.vue, chat.js store
Chat logs con geolocalización	✅ Completo	ChatLogsAdmin.vue, chatLogs.js store
CV Wizard con IA	✅ Completo	CVWizard.vue, cvWizard.js store
Multi-idioma (es/en, 350+ claves)	✅ Completo	i18n.js, locales/*.json
Autenticación JWT + OAuth Google	✅ Completo	Login.vue, Register.vue, auth.js store
RBAC granular con impersonación	✅ Completo	RBACAdmin.vue, auth.js store
Red profesional (conexiones, feed)	✅ Completo	NetworkHub.vue, network.js store
Chat P2P con WebSockets	✅ Completo	Inbox.vue, chat_p2p.js store
B2B — Búsqueda semántica	✅ Completo	B2BHome.vue
B2B — Tribunal de IA	✅ Completo	TribunalRoom.vue
B2B — Pipeline y métricas	✅ Completo	Pipeline.vue, Metrics.vue
BYOK (propia API Key Gemini)	✅ Completo	PlanConsumoAdmin.vue
Exportar portafolio a PDF	✅ Completo	ShareAdmin.vue
QR code + compartir en redes	✅ Completo	ShareAdmin.vue
Temas visuales dinámicos por usuario	✅ Completo	useThemeStore.js, themes.css
Spotlight search de usuarios	✅ Completo	SearchSpotlight.vue
Compresión de imágenes en cliente	✅ Completo	api.js (compressorjs)
OppyTalent Frontend — Vue 3 + Vite · Transformando currículums en experiencias interactivas potenciadas por IA. </｜｜DSML｜｜parameter> </｜｜DSML｜｜invoke> </｜｜DSML｜｜tool_calls>

2m 16s
6:43 PM
opencode logo
Big Pickle
build
Read File
El README.md del frontend está completo. Cubre toda la arquitectura: 40+ rutas, 12+ stores Pinia, 60+ endpoints API, 5 temas, 2 layouts, i18n, chat IA, CV Wizard, red P2P, B2B, RBAC, y despliegue Docker.

No hay scripts de lint/typecheck definidos en el proyecto.