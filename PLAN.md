# 📌 Plan y Tablero Kanban del Proyecto

Este documento centraliza la planificación y el flujo de trabajo del proyecto basándose en las prácticas de Kanban, estableciendo límites de trabajo en curso (WIP) y un tablero estructurado.

## 1. Tablero Kanban y Flujo de Trabajo

### Límites de Trabajo en Curso (WIP)
- **In Progress (En Proceso)**: Máximo 3 tareas concurrentes por desarrollador/agente.
- **Review/Test (Revisión y Pruebas)**: Máximo 2 tareas concurrentes por revisor/agente.
- **Mantra**: *"Parar de empezar, empezar a terminar" (Stop starting, start finishing).*

### Columnas del Tablero

#### 1. Backlog (Pila de trabajo)
*(Ideas, requerimientos de negocio e historias de usuario iniciales sin refinar)*
- [ID-FRONT-09] Interfaz CRUD de Artículos (Dashboard)
- [ID-FRONT-10] Panel de Configuración de Perfil
- [ID-FRONT-05] Página de Detalle de Artículo
- [ID-FRONT-07] Configurar ISR (Incremental Static Regeneration)
- [ID-FRONT-08] Añadir Captcha en Registro
- [ID-BACK-03] Permisos Avanzados y Moderación
- [ID-BACK-01] Despliegue Strapi en Producción
- [ID-FRONT-01] Despliegue Next.js en Vercel
- [ID-BACK-04] Modelo Tags y Filtros de Búsqueda
- [ID-FRONT-11] Barra de Búsqueda y Navegación por Etiquetas
- [ID-FRONT-12] SEO Dinámico, Sitemap y Artículos Relacionados
- [ID-BACK-05] Sistema de Comentarios y Favoritos (Modelos)
- [ID-FRONT-13] UI de Comentarios y Botón de Favoritos
- [ID-FRONT-14] Formulario de Newsletter
- [ID-FRONT-15] Mejoras UX de Lectura (ToC, Progreso, Tiempo)
- [ID-FRONT-16] Tema Oscuro (Dark Mode)
- [ID-BACK-06] Assets: Imagen de Portada y Subida de Archivos
- [ID-FRONT-17] Portadas de Artículo y Editor con Imágenes

#### 2. Selected (Listo/Seleccionado)
*(Tareas refinadas y priorizadas. El Lead Time comienza a contar)*
- [ID-FRONT-03] Vista de Artículos por Categoría
- [ID-FRONT-04] Página de Perfil de Autor

#### 3. In Progress (En Proceso)
*(Tareas en desarrollo activo. WIP Limit: 3)*
- [ID-BACK-02] Configurar Rol Author y Hook de Registro
- [ID-FRONT-06] Página de Login y Registro
- [ID-FRONT-02] Sanitización de Markdown con DOMPurify

#### 4. Review/Test (Revisión y Pruebas)
*(Tareas bajo pruebas de calidad, revisiones de código. WIP Limit: 2)*
*(Vacío actualmente)*

#### 5. Done (Hecho / Entregado)
*(Tareas totalmente validadas y desplegadas)*
- [ID-BACK-00] Configuración base del proyecto Strapi y colecciones.
- [ID-FRONT-00] UI y componentes base en Next.js (Dashboard layout, breadcrumbs, inputs).

---

## 2. Detalle de los Tickets (Tarjetas Kanban)

### 2.1 Tickets en "In Progress"

#### [ID-BACK-02] Configurar Rol Author y Hook de Registro
- **Contexto**: Backend / Query Manager
- **Descripción**: Definir el rol `Author` con permisos específicos (crear, leer, editar artículos) y crear un hook de ciclo de vida en Strapi (`afterCreate`) para crear automáticamente un registro `Author` asociado al `User` cuando este se registre.
- **Definición de Done (DoD)**:
  - [ ] El rol `Author` está configurado con los permisos adecuados.
  - [ ] El hook de registro de Strapi dispara y valida la creación de un `Author`.
  - [ ] Existe una relación 1:1 funcional y estructurada entre `User` y `Author`.
  - [ ] Código estructurado y documentado bajo los estándares internos del proyecto.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-06] Página de Login y Registro
- **Contexto**: Frontend / Visualización
- **Descripción**: Integrar los formularios de login y registro (`LoginForm.tsx` y `RegisterForm.tsx`) con la API de Strapi para el manejo de sesiones de usuario (JWT).
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado de forma modular e interactiva para la autenticación.
  - [ ] Manejo de errores visualizado mediante componentes (ej. Toast).
  - [ ] Redirección automática tras autenticación exitosa hacia el Dashboard.
  - [ ] Consumo del API RESTful validado (endpoints de auth/local).
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-02] Sanitización de Markdown con DOMPurify
- **Contexto**: Frontend / Visualización
- **Descripción**: Integrar `DOMPurify` (o una herramienta similar) en el frontend antes de renderizar el Markdown de los artículos con `react-markdown` para prevenir ataques de inyección de código (XSS).
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado de forma modular para la sanitización.
  - [ ] El HTML generado a partir del Markdown pasa por un proceso de limpieza.
  - [ ] Se comprueba que scripts maliciosos insertados en Markdown no se ejecuten.
- **Esfuerzo Estimado**: 2 Horas

---

### 2.2 Tickets en "Selected"

#### [ID-FRONT-03] Vista de Artículos por Categoría
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar una página en frontend (`/categories/[slug]`) que liste todos los artículos asociados a una categoría específica, consumiendo la API de Strapi.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado de forma modular e interactiva.
  - [ ] Consumo del API RESTful validado para filtrar por la categoría deseada.
  - [ ] La vista incluye paginación o lazy loading.
  - [ ] El diseño es responsive y se adapta a pantallas de escritorio y tablets.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-04] Página de Perfil de Autor
- **Contexto**: Frontend / Visualización
- **Descripción**: Crear la vista pública del perfil del autor (`/authors/[slug]`), mostrando su biografía, avatar y una lista paginada de los artículos que ha escrito.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado y conectado a la API de Strapi para obtener datos del autor.
  - [ ] Se visualiza correctamente la bio y avatar usando componentes de interfaz existentes.
  - [ ] Se lista el histórico de artículos del autor utilizando tarjetas modulares.
  - [ ] El diseño es responsive.
- **Esfuerzo Estimado**: 4 Horas

---

### 2.3 Tickets en "Backlog"

#### [ID-FRONT-09] Interfaz CRUD de Artículos (Dashboard)
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar las interfaces necesarias en el dashboard privado para crear, leer, actualizar y eliminar (CRUD) artículos, conectándose a la API de Strapi.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado de forma modular e interactiva (formularios de creación/edición).
  - [ ] Listado de artículos propios en el dashboard con acciones (editar, borrar) y modales de confirmación.
  - [ ] Consumo del API RESTful validado (métodos GET, POST, PUT, DELETE).
- **Esfuerzo Estimado**: 6 Horas

#### [ID-FRONT-10] Panel de Configuración de Perfil
- **Contexto**: Frontend / Visualización
- **Descripción**: Desarrollar la vista de configuración de usuario donde pueda ver su información personal, actualizarla y subir una foto de perfil (avatar).
- **Definición de Done (DoD)**:
  - [ ] Componente SPA de configuración protegido, accesible solo para usuarios autenticados.
  - [ ] Formulario para actualizar datos personales sincronizado con Strapi.
  - [ ] Integración validada con el plugin de upload de Strapi para cargar y actualizar la foto de perfil.
  - [ ] El diseño es responsive y se adapta a pantallas de escritorio y tablets.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-05] Página de Detalle de Artículo
- **Contexto**: Frontend / Visualización
- **Descripción**: Desarrollar la vista dinámica (`/articles/[slug]`) para mostrar el contenido completo del artículo, incluyendo el renderizado del Markdown con resaltado de sintaxis.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado donde el artículo se obtiene por su slug.
  - [ ] El Markdown se renderiza y sanitiza correctamente (ref. ID-FRONT-02).
  - [ ] Se muestran correctamente los metadatos de apoyo (fecha, autor, categoría).
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-07] Configurar ISR (Incremental Static Regeneration)
- **Contexto**: Frontend / Visualización
- **Descripción**: Configurar ISR en las páginas de listado y detalle de artículos de Next.js para mejorar el SEO y rendimiento, revalidando el contenido cada cierto tiempo.
- **Definición de Done (DoD)**:
  - [ ] Rutas de artículos (SSG) implementan la directiva `revalidate`.
  - [ ] Configuración validada para regenerar páginas estáticas periódicamente.
- **Esfuerzo Estimado**: 3 Horas

#### [ID-FRONT-08] Añadir Captcha en Registro
- **Contexto**: Frontend / Visualización
- **Descripción**: Integrar una herramienta de validación CAPTCHA (ej. reCAPTCHA o Turnstile) en el formulario de registro.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA implementado para validar la resolución del captcha antes de enviar datos.
  - [ ] Integración visualmente cohesiva con el formulario existente.
- **Esfuerzo Estimado**: 3 Horas

#### [ID-BACK-03] Permisos Avanzados y Moderación
- **Contexto**: Backend / Query Manager
- **Descripción**: Definir estrictamente los permisos a nivel API: Los Authors solo pueden modificar sus propios artículos; los Admins pueden gestionar todo y borrar contenido inapropiado.
- **Definición de Done (DoD)**:
  - [ ] Se implementan policies personalizadas en Strapi (Is-Owner) para los endpoints de `update` y `delete`.
  - [ ] El endpoint cuenta con pruebas de acceso superadas (validación de roles).
  - [ ] Código estructurado y documentado bajo los estándares internos.
- **Esfuerzo Estimado**: 4 Horas

#### [ID-BACK-01] Despliegue Strapi en Producción
- **Contexto**: Backend / Query Manager
- **Descripción**: Realizar el despliegue de la aplicación Strapi en una plataforma en la nube (Render o Railway) junto con una base de datos de producción (PostgreSQL).
- **Definición de Done (DoD)**:
  - [ ] El servicio se despliega y ejecuta sin errores (apagado gradual contemplado de ser posible).
  - [ ] Base de datos migrada y conectada correctamente.
  - [ ] Variables de entorno (CORS, URLs, Secretos JWT) están aseguradas.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-01] Despliegue Next.js en Vercel
- **Contexto**: Frontend / Visualización
- **Descripción**: Configurar y desplegar el proyecto Next.js en Vercel, asegurando la correcta conexión con la API de Strapi desplegada.
- **Definición de Done (DoD)**:
  - [ ] La aplicación frontend compila y se despliega correctamente en la infraestructura de Vercel.
  - [ ] Las variables de entorno apuntan a la URL de Strapi en producción.
  - [ ] El diseño sigue siendo responsive y todos los consumos RESTful apuntan al entorno correcto.
- **Esfuerzo Estimado**: 3 Horas

#### [ID-BACK-04] Modelo Tags y Filtros de Búsqueda
- **Contexto**: Backend / Query Manager
- **Descripción**: Crear la colección `Tag`, establecer relación muchos-a-muchos con `Article` y habilitar filtros de búsqueda por texto y etiquetas en la API.
- **Definición de Done (DoD)**:
  - [ ] Colección `Tag` creada en Strapi con la relación adecuada.
  - [ ] Endpoint expuesto con capacidad de filtrado y búsqueda de texto.
  - [ ] Código estructurado y documentado bajo los estándares internos.
- **Esfuerzo Estimado**: 3 Horas

#### [ID-FRONT-11] Barra de Búsqueda y Navegación por Etiquetas
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar una barra de búsqueda global en el header y mostrar las etiquetas (`tags`) en los artículos con posibilidad de filtrado.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA (Search Bar) implementado e integrado en el Header.
  - [ ] Consumo del API validado (búsqueda de texto y etiquetas).
  - [ ] Vista creada para explorar artículos por etiqueta (`/tags/[slug]`).
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-12] SEO Dinámico, Sitemap y Artículos Relacionados
- **Contexto**: Frontend / Optimización
- **Descripción**: Configurar meta tags Open Graph dinámicos por página, generar `sitemap.xml` automáticamente y mostrar componente "Leer Siguiente" en el detalle de artículos.
- **Definición de Done (DoD)**:
  - [ ] Metadatos y Open Graph dinámicos integrados en las vistas principales.
  - [ ] Generación automática de `sitemap.xml` configurada.
  - [ ] Componente "Artículos Relacionados" (Read Next) funcional y responsive.
- **Esfuerzo Estimado**: 4 Horas

#### [ID-BACK-05] Sistema de Comentarios y Favoritos (Modelos)
- **Contexto**: Backend / Query Manager
- **Descripción**: Modelar las colecciones `Comment` (relacionada a `Article` y `User`) y lógica para guardar artículos favoritos (relación muchos-a-muchos `User`-`Article`).
- **Definición de Done (DoD)**:
  - [ ] Colección `Comment` creada e interconectada en Strapi.
  - [ ] Endpoints de creación y lectura de comentarios habilitados y seguros (RBAC básico).
  - [ ] Endpoints para "Favoritos/Likes" del usuario configurados.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-13] UI de Comentarios y Botón de Favoritos
- **Contexto**: Frontend / Interacción
- **Descripción**: Implementar la interfaz de usuario para ver/añadir comentarios en los artículos, y el botón para dar "Me gusta" o "Favorito".
- **Definición de Done (DoD)**:
  - [ ] Sección de comentarios SPA implementada en el detalle del artículo.
  - [ ] Consumo de API validado (POST de comentarios exclusivo para usuarios autenticados).
  - [ ] Botón de "Favorito" funcional con feedback visual de estado.
- **Esfuerzo Estimado**: 5 Horas

#### [ID-FRONT-14] Formulario de Newsletter
- **Contexto**: Frontend / Engagement
- **Descripción**: Añadir un componente de formulario en el footer del blog para captar correos de suscriptores.
- **Definición de Done (DoD)**:
  - [ ] Componente SPA funcional implementado en el Footer.
  - [ ] Validación de email y feedback visual de éxito ("¡Suscrito!").
- **Esfuerzo Estimado**: 2 Horas

#### [ID-FRONT-15] Mejoras UX de Lectura (ToC, Progreso, Tiempo)
- **Contexto**: Frontend / Visualización
- **Descripción**: Agregar cálculo automático del tiempo de lectura, barra de progreso superior al hacer scroll y Tabla de Contenidos (ToC) autogenerada.
- **Definición de Done (DoD)**:
  - [ ] Componente que calcula y muestra el tiempo de lectura.
  - [ ] Barra de progreso funcional ligada al evento scroll.
  - [ ] Componente ToC dinámico y responsive.
- **Esfuerzo Estimado**: 6 Horas

#### [ID-FRONT-16] Tema Oscuro (Dark Mode)
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar el toggle entre tema claro y oscuro utilizando `next-themes` y adaptando las variables CSS de shadcn/ui.
- **Definición de Done (DoD)**:
  - [ ] Switch de tema modular implementado.
  - [ ] La preferencia del usuario se guarda y persiste (LocalStorage o similar).
  - [ ] Adaptación visual exitosa de todos los componentes existentes al modo oscuro.
- **Esfuerzo Estimado**: 3 Horas

#### [ID-BACK-06] Assets: Imagen de Portada y Subida de Archivos
- **Contexto**: Backend / Gestión de Medios
- **Descripción**: Añadir un campo "Cover Image" al modelo `Article` y configurar los permisos del plugin de subida de medios de Strapi para los Authors.
- **Definición de Done (DoD)**:
  - [ ] El modelo `Article` contiene el campo `cover` (Media).
  - [ ] El rol `Author` cuenta con los permisos necesarios para la carga de archivos (Media Library).
- **Esfuerzo Estimado**: 2 Horas

#### [ID-FRONT-17] Portadas de Artículo y Editor con Imágenes
- **Contexto**: Frontend / Visualización
- **Descripción**: Mostrar la imagen de portada en los listados y detalles del artículo, e integrar la subida de imágenes dentro de la UI del editor de artículos (Dashboard).
- **Definición de Done (DoD)**:
  - [ ] Componentes de Card y Detalle actualizados para renderizar la Cover Image.
  - [ ] El formulario de creación/edición de artículo permite subir o seleccionar la imagen principal.
- **Esfuerzo Estimado**: 6 Horas