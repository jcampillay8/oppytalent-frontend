# ✨ Portafolio Frontend Client (Vue.js 3)

Este repositorio contiene la interfaz de usuario (UI) para el portafolio profesional. Está construido como una Single Page Application (SPA) moderna y reactiva utilizando **Vue.js 3** con Vite, lo que garantiza un desarrollo rápido y un rendimiento óptimo en el navegador del usuario.

## ⚙️ Visión General y Arquitectura

El frontend sigue la arquitectura de componentes reutilizables y está diseñado para ser consumido por el API Backend (el servicio gestionado en `portafolio-backend`). La aplicación se divide lógicamente en dos grandes áreas: **Público** (la vista del portafolio) y **Administrativo** (el panel de gestión).

La reactividad de Vue.js, combinada con Pinia para la gestión global de estado, permite que cualquier cambio en los datos (por ejemplo, al actualizar un proyecto) se refleje instantáneamente en toda la interfaz sin recargar la página.

**Tecnologías Clave:**
*   **Framework:** Vue.js 3
*   **Build Tool:** Vite
*   **Routing:** Vue Router
*   **State Management:** Pinia (para centralizar datos como el perfil del usuario o la lista de proyectos).
*   **Comunicación API:** Utiliza `axios` o `fetch` a través del módulo `services/api.js` para interactuar con el backend RESTful.

## 🛠️ Configuración e Instalación

### 1. Requisitos Previos
Asegúrate de tener instalado Node.js y npm (o pnpm, según el lockfile).

### 2. Dependencias
Instala todas las dependencias del proyecto:

```bash
pnpm install
# o si usas npm:
# npm install
```

### 3. Ejecución Local
Ejecuta la aplicación en modo desarrollo para ver los cambios en tiempo real:

```bash
pnpm run dev
# o si usas npm:
# npm run dev
```

## 📂 Estructura Modular del Código

El frontend está organizado siguiendo las mejores prácticas de Vue.js, separando la presentación (Components), el estado (Stores), y la lógica de negocio (Services).

| Directorio | Propósito | Componentes Clave |
| :--- | :--- | :--- |
| `src/` | **Raíz del Cliente:** Contiene toda la lógica de la aplicación. | `main.js`, `router/index.js`. |
| `components/` | **Componentes Reutilizables (UI):** Piezas atómicas que se usan en múltiples vistas, como tarjetas o botones. Se dividen en `public` y `admin`. | `ProyectoCard.vue`, `ExperienciaForm.vue`. |
| `stores/` | **Gestión de Estado (Pinia):** Almacenan el estado global de la aplicación (datos del usuario, listas de proyectos). Son la fuente única de verdad para los datos mostrados en el cliente. | `proyectos.js`, `auth.js`. |
| `services/` | **Lógica de Comunicación:** Contiene funciones para interactuar con APIs externas (`api.js`) y utilidades generales (`utils.js`). Esto aísla la lógica HTTP del componente. | `api.js` (manejo de peticiones GET/POST al backend). |
| `views/` | **Vistas Principales:** Componentes que representan páginas completas definidas por Vue Router. Son contenedores que ensamblan componentes más pequeños. | `Home.vue`, `About.vue`. |

## 🌐 Flujos y Módulos Funcionales

### 👤 Modo Público (Frontend de Portafolio)
Esta es la vista principal del portafolio, diseñada para el consumo externo. Los datos se cargan al inicio usando los *stores* y se muestran en las vistas públicas.

*   **`Home.vue`:** La página de aterrizaje que resume quién eres y te dirige a las secciones principales.
*   **`About.vue`:** Muestra la biografía, habilidades y detalles generales del perfil.
*   **`ProyectoDetail.vue` / `ExperienciaDetail.vue`:** Vistas dinámicas que reciben un ID de parámetro (ej: `/proyectos/:id`) para mostrar información detallada cargada desde el backend.

### 🛡️ Modo Administrativo (Panel de Gestión)
Esta sección está protegida por rutas y autenticación, permitiendo al dueño del portafolio actualizar su contenido sin tocar código.

*   **`Login.vue`:** Maneja la autenticación con el backend para obtener un token JWT.
*   **`Dashboard.vue`:** Vista principal de gestión que presenta formularios y listas de datos (proyectos, experiencias, etc.).
*   **Formularios Específicos:** Componentes como `ProyectoForm.vue` o `ExperienciaForm.vue` son responsables de capturar la información del usuario y enviarla al backend mediante el *store* correspondiente.

## 💡 Flujo Operacional (Data Flow)

1.  **Inicio/Login:** El usuario accede a `/admin/login`. El componente llama a `services/api.js` para autenticarse contra el endpoint `/api/v1/auth`.
2.  **Carga de Datos:** Una vez logueado, las vistas administrativas (ej: `ProyectosAdmin.vue`) llaman a los *stores* (`proyectos.js`), que a su vez usan `services/api.js` para hacer llamadas GET al backend (ej: `/api/v1/proyectos`).
3.  **Actualización:** Cuando el usuario edita un proyecto, el formulario llama al *store*, que ejecuta una petición PUT o POST a través de `services/api.js`, enviando los datos validados por Pinia al backend para su persistencia en PostgreSQL.

---
*(Este README fue generado automáticamente basándose en la estructura del código fuente.)*