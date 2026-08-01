# Society Systems Blog 🚀

Un proyecto de plataforma de blog moderno, escalable y con una arquitectura verdaderamente desacoplada (Headless CMS), construido para ofrecer una experiencia de usuario (UX) inmersiva, alto rendimiento SEO (ISR), y una administración de contenido robusta.

## 🏗️ Arquitectura del Proyecto

El repositorio está estructurado como un **Monorepo** que separa rigurosamente las responsabilidades entre el gestor de contenido (Backend) y la capa de presentación (Frontend).

### ⚙️ Backend: `api/` (Strapi Headless CMS)
El directorio `api/` alberga el núcleo de datos gestionado con **Strapi**. La arquitectura del backend está centrada en la entrega de contenido vía RESTful API, gestionando roles y asegurando la integridad de datos.

- **Stack**: Node.js, Strapi v5, SQLite (Local) / PostgreSQL (Producción).
- **Colecciones de Datos (Models)** (`api/src/api/`):
  - `article`: Modelo principal de los posts del blog. Soporta contenido rico (Markdown), portadas, y relaciones con autores y categorías.
  - `author`: Perfiles de los escritores del blog (Relación 1:1 con el modelo interno de `User` de Strapi).
  - `category`: Agrupación temática para la organización de los artículos (Relación 1:N con articles).
  - `about`: Single Type para gestionar la información estática de la página "Acerca de".
  - `global`: Single Type para configuraciones globales del sitio (Metadatos SEO por defecto, enlaces de redes sociales, configuración del Navbar/Footer).
- **Control de Acceso y Seguridad**: Implementa RBAC (Role-Based Access Control) nativo de Strapi. Los `Authors` solo tienen permisos de mutación sobre sus propios `articles` mediante configuraciones de Policies y Webhooks, mientras que los `Admins` tienen control total.

### 💻 Frontend: `client/` (Next.js App Router)
El directorio `client/` contiene la capa de presentación construida con **Next.js**. Su arquitectura está orientada a componentes, server actions, e hidratación asíncrona (SSR/ISR).

- **Stack**: Next.js 15 (App Router), React 19, TypeScript, Tailwind CSS, shadcn/ui.
- **Estructura Interna (`client/src/`)**:
  - `app/`: Directorio principal de enrutamiento (App Router). Contiene grupos de rutas como `(auth)` para login/registro, `dashboard` para el panel privado de los autores, y las páginas públicas (ej. `page.tsx`, `layout.tsx`, `globals.css`).
  - `actions/`: Funciones Server Actions de Next.js para ejecutar mutaciones seguras en el servidor (ej. autenticación, creación de artículos).
  - `components/`: Componentes UI reutilizables y modulares (basados en shadcn/ui y componentes atómicos).
  - `context/`: Proveedores de estado global de React (React Context) para sesión, temas, etc.
  - `datasource/`: Capa de abstracción de red (Fetch/Axios) responsable de la comunicación RESTful con la API de Strapi, tipada y estructurada.
  - `hooks/`: Custom Hooks de React para abstraer la lógica compleja de los componentes de UI.
  - `model/`: Definición de tipos, interfaces de TypeScript y esquemas de validación (Zod) que espejean la estructura de Strapi para garantizar End-to-End Type Safety.
  - `lib/`: Utilidades generales (formateo de fechas, cn util para Tailwind, etc).
  - `middleware.ts`: Interceptor en el Edge (Next.js Middleware) para proteger rutas privadas (Dashboard) y manejar redirecciones basadas en el JWT del usuario.

---

## ✨ Características y Roadmap Funcional

El proyecto está en desarrollo iterativo, basándose en el framework CRISP-DM y prácticas HEFESTO v2.0 adaptadas. 

- 🔒 **Autenticación y Roles:** Manejo de sesiones JWT manejadas de forma segura (Cookies HttpOnly) e interceptadas por el `middleware.ts`.
- 📝 **Publicación Markdown:** El cliente renderiza el contenido almacenado en Strapi empleando `react-markdown` y asegurado contra inyecciones XSS usando `DOMPurify`.
- 🚀 **Optimización SEO:** Renderizado Híbrido (ISR/SSG) para que los artículos carguen a la velocidad de la luz y metadatos dinámicos estructurados con Open Graph.
- 💬 **Interacciones Comunitarias:** *(Planeado)* Sistema de comentarios y "Favoritos" en los artículos.
- 🔍 **Filtros Avanzados:** *(Planeado)* Búsqueda Full-Text y exploración multi-etiqueta (Tags).
- 🎨 **Experiencia Inmersiva:** Modo oscuro nativo implementado con `next-themes`, variables CSS inyectadas y utilidades de lectura (Barra de progreso, Tabla de Contenidos - ToC).

---

## 🚀 Guía de Instalación Local (Paso a Paso)

Requiere [Node.js](https://nodejs.org/) v18+ y un gestor de paquetes (`npm` o `pnpm`).

### 1. Preparar el Entorno
```bash
git clone https://github.com/KEVIN-117/society-systems-blog.git
cd society-systems-blog
```

### 2. Iniciar el API Backend (Strapi)
El CMS debe estar corriendo primero para que el cliente pueda consumir sus tipos y datos.
```bash
cd api
npm install
# Crea tu .env usando el archivo de ejemplo
cp .env.example .env
# Inicia la base de datos local y el servidor en modo desarrollo (Watch Mode)
npm run develop
```
- **Panel Admin:** `http://localhost:1337/admin`
- **Endpoints REST:** `http://localhost:1337/api/...`

### 3. Iniciar el Cliente Web (Next.js)
En una terminal nueva:
```bash
cd client
npm install
# Crea tu archivo .env (requerido para apuntar a la API local)
echo "NEXT_PUBLIC_API_URL=http://localhost:1337" > .env
# Levanta el servidor de desarrollo en el puerto 3000
npm run dev
```
- **Aplicación Frontend:** `http://localhost:3000`

---

## 📋 Metodología Kanban y Trazabilidad

Este repositorio se rige bajo límites estrictos de **WIP (Work In Progress)** para garantizar calidad y entrega continua (Flujo Pull).

Toda la planificación reside directamente en el código bajo los siguientes archivos:
- 📌 [`PLAN.md`](./PLAN.md) - Tablero Kanban maestro. Define la estructura de trabajo, el Backlog refinado, las tareas seleccionadas (Selected) y las activas (In Progress). Incluye la Definition of Done (DoD) crítica de cada ticket.
- 📌 [`BACKLOG.md`](./BACKLOG.md) - Repositorio de historias de usuario, requerimientos futuros y la bitácora inicial del proyecto.

> **Importante:** Todos los tickets documentados en `PLAN.md` se sincronizan bidireccionalmente con los [Issues del Repositorio de GitHub](https://github.com/KEVIN-117/society-systems-blog/issues). Todo PR (Pull Request) debe enlazar a un Issue activo.

---

## 🤝 Flujo de Contribución

1. Analizar el `PLAN.md` y tomar un ticket de la columna **Selected**. (Asegúrate de no violar el límite WIP de 3 en **In Progress**).
2. Crear un branch semántico (ej: `feat/ID-FRONT-09-dashboard-crud` o `fix/ID-BACK-02-auth-hook`).
3. Desarrollar la característica validando rigurosamente que se cumpla cada checklist de la **Definition of Done (DoD)** de la tarjeta Kanban.
4. Enviar un Pull Request detallando los cambios. El PR será revisado en la columna **Review/Test** del tablero (WIP max: 2).
