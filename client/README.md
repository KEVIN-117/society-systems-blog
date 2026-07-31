# 🌐 Blog de la Sociedad Científica de Ingeniería de Sistemas (Frontend)

Este repositorio contiene el código fuente del frontend para el **Blog de la Sociedad Científica de Ingeniería de Sistemas**. Está desarrollado con tecnologías modernas y sigue las mejores prácticas de arquitectura de software para garantizar un sistema escalable, mantenible y de alto rendimiento.

## 🚀 Tecnologías Principales

- **Framework:** [Next.js](https://nextjs.org/) (App Router, versión 16+) con [React 19](https://react.dev/).
- **Estilos:** [Tailwind CSS v4](https://tailwindcss.com/) para estilos utilitarios y un motor de renderizado ultra rápido.
- **Componentes UI:** [shadcn/ui](https://ui.shadcn.com/) y [@base-ui/react](https://base-ui.com/) para componentes accesibles, hermosos y personalizables.
- **Iconografía:** [Lucide React](https://lucide.dev/).
- **Markdown:** `react-markdown` y `remark-gfm` para el renderizado del contenido de los artículos científicos e informativos.
- **Linter y Formatter:** [Biome](https://biomejs.dev/) garantizando código limpio, seguro y consistente a gran velocidad.

## 🏗️ Arquitectura del Proyecto

El proyecto utiliza una arquitectura híbrida que combina **Atomic Design** para la construcción de interfaces de usuario altamente reutilizables y el patrón **BFF (Backend-for-Frontend)** para una gestión de datos eficiente y segura.

### Organización de Carpetas

```text
src/
├─ app/                # Enrutamiento basado en archivos (Next.js App Router).
│   ├─ (public)/       # Rutas públicas (inicio, artículos, etc.)
│   └─ (protected)/    # Rutas protegidas (dashboard del autor, etc.)
│
├─ components/         # UI organizada siguiendo Atomic Design.
│   ├─ atoms/          # Componentes indivisibles (Botones, Inputs, Etiquetas, Iconos).
│   ├─ molecules/      # Agrupación de átomos (Campos de formulario, Tarjetas de autor).
│   ├─ organisms/      # Secciones completas de UI (Header, Footer, Lista de Artículos).
│   └─ templates/      # Layouts y estructuras de página base.
│
├─ api/                # Capa BFF (Next.js Route Handlers).
│   ├─ auth/           # Adaptadores y manejo de sesiones.
│   └─ articles/       # Transformación de datos de artículos para la UI.
│
├─ actions/            # Lógica de fetching (React Server Actions).
├─ datasource/         # Integración directa con APIs externas y microservicios backend.
│   ├─ remote/         # Clientes HTTP (axios) y esquemas OpenAPI.
│   └─ local/          # Manejo de Storage local o caché persistente.
│
├─ context/            # React Context y providers globales.
├─ model/              # Definición de entidades de dominio (Tipos e Interfaces de TypeScript).
├─ lib/                # Utilidades generales y helpers genéricos.
└─ styles/             # Hojas de estilo globales (index.css).
```

### 🔑 Principios Arquitectónicos

1. **Separación de Responsabilidades:** La lógica de negocio no debe mezclarse con la presentación. Los componentes UI en `components/` solo deben recibir `props` e interactuar visualmente. Toda lógica compleja o fetching vive en `actions/`, `datasource/` o la capa `api/`.
2. **Backend-For-Frontend (BFF):** Los endpoints en la carpeta `api/` actúan como una capa intermediaria segura. Filtran, adaptan y transforman los datos de los microservicios backend para que lleguen a la interfaz exactamente como los componentes los necesitan.
3. **Atomic Design Pragmático:**
   - Si un componente es genérico y reutilizable en varias secciones, se ubica en `components/`.
   - Si está acoplado estrictamente a una feature o vista (ej. un formulario muy específico), se debe mantener lo más cercano posible a la vista que lo consume para evitar inflar las carpetas globales.
4. **Seguridad Integrada:** La validación de sesiones, tokens de autenticación y lógica de autorización se centraliza en la capa BFF, evitando exponer datos sensibles al entorno del cliente (navegador).

## 🛠️ Instalación y Configuración Local

Para levantar este proyecto en tu entorno de desarrollo, sigue estos sencillos pasos:

### 1. Requisitos Previos
- [Node.js](https://nodejs.org/) (v20.x o superior recomendado).
- Gestor de paquetes (`npm` viene por defecto con Node, o puedes usar `yarn` / `pnpm`).

### 2. Clonar e Instalar

```bash
# Clona el repositorio
git clone <url-del-repositorio>

# Ingresa al directorio del cliente
cd society-systems-blog/client

# Instala las dependencias
npm install
```

### 3. Servidor de Desarrollo

Inicia el entorno de desarrollo con Hot Module Replacement (HMR):

```bash
npm run dev
```

La aplicación estará disponible y corriendo en [http://localhost:3000](http://localhost:3000).

## 📜 Scripts Disponibles

En el archivo `package.json` están configurados los comandos esenciales para el flujo de desarrollo:

- `npm run dev`: Inicia el servidor de Next.js en modo desarrollo.
- `npm run build`: Genera una compilación optimizada de la aplicación lista para producción.
- `npm run start`: Inicia el servidor de producción utilizando la compilación generada (requiere `npm run build` previo).
- `npm run lint`: Ejecuta [Biome](https://biomejs.dev/) para analizar el código fuente e identificar errores de sintaxis, formato o malas prácticas.
- `npm run format`: Formatea el código de manera automática utilizando las reglas definidas por Biome.

## 🤝 Flujo de Contribución

1. Asegúrate de estar sincronizado con la rama principal.
2. Crea una rama descriptiva para tu nueva funcionalidad o corrección: `git checkout -b feature/nombre-de-la-funcionalidad`.
3. Desarrolla tus cambios siguiendo la arquitectura definida.
4. Antes de hacer commit, asegúrate de correr el formateador para mantener el estándar: `npm run format`.
5. Haz commits semánticos (`feat: ...`, `fix: ...`) y súbelos a tu rama.
6. Crea un *Pull Request* describiendo con detalle los cambios y el problema que resuelves.

---
*Desarrollado para potenciar la difusión del conocimiento en la Sociedad Científica de Ingeniería de Sistemas.*