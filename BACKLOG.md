# Backlog de Proyecto (Gestión Kanban)

A continuación se detalla el backlog refinado para la creación de issues en GitHub, utilizando las plantillas definidas en la metodología Kanban (basadas en CRISP-DM y HEFESTO, adaptadas para Backend y Frontend del proyecto). Se omiten las tareas que ya han sido implementadas (Strapi inicializado, UI básica, Next.js, etc.).

---

## 🔧 Infraestructura

### [ID-BACK-01] Despliegue Strapi en Producción
- **Contexto**: Backend / Despliegue
- **Descripción**: Realizar el despliegue de la aplicación Strapi en una plataforma en la nube (Render o Railway) junto con una base de datos PostgreSQL.
- **Definición de Done (DoD)**:
  - [ ] El backend de Strapi se ejecuta sin errores en la plataforma de destino.
  - [ ] La base de datos está conectada y las migraciones se ejecutaron.
  - [ ] Las variables de entorno de producción están configuradas.
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-01] Despliegue Next.js en Vercel
- **Contexto**: Frontend / Despliegue
- **Descripción**: Configurar y desplegar el proyecto Next.js en Vercel, asegurando la correcta conexión con la API de Strapi desplegada.
- **Definición de Done (DoD)**:
  - [ ] La aplicación frontend se despliega correctamente en Vercel.
  - [ ] Las variables de entorno apuntan a la URL de Strapi en producción.
  - [ ] Las rutas estáticas y dinámicas funcionan sin errores de compilación.
- **Esfuerzo Estimado**: 3 Horas

---

## 👥 Autenticación y roles

### [ID-BACK-02] Configurar Rol Author y Hook de Registro
- **Contexto**: Backend / Seguridad y Lógica de Negocio
- **Descripción**: Definir el rol `Author` con permisos específicos (crear, leer, editar artículos) y crear un hook de ciclo de vida en Strapi (`afterCreate`) para crear automáticamente un registro `Author` asociado al `User` cuando este se registre.
- **Definición de Done (DoD)**:
  - [ ] Rol `Author` configurado con permisos adecuados.
  - [ ] El controlador de registro de Strapi dispara la creación de un `Author`.
  - [ ] Existe una relación 1:1 funcional entre `User` y `Author`.
- **Esfuerzo Estimado**: 5 Horas

---

## 📝 Publicación de artículos

### [ID-FRONT-02] Sanitización de Markdown con DOMPurify
- **Contexto**: Frontend / Seguridad
- **Descripción**: Integrar `DOMPurify` (o una herramienta similar) en el frontend antes de renderizar el Markdown de los artículos con `react-markdown` para prevenir ataques XSS.
- **Definición de Done (DoD)**:
  - [ ] El HTML generado a partir del Markdown pasa por un proceso de sanitización.
  - [ ] Se comprueba que scripts maliciosos insertados en Markdown no se ejecuten.
- **Esfuerzo Estimado**: 2 Horas

### [ID-FRONT-09] Interfaz CRUD de Artículos (Dashboard)
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar las interfaces necesarias en el dashboard privado para crear, leer, actualizar y eliminar (CRUD) artículos, conectándose a la API de Strapi.
- **Definición de Done (DoD)**:
  - [ ] Formularios de creación y edición de artículos implementados y conectados con la API.
  - [ ] Tabla o listado de artículos propios en el dashboard con acciones (editar, borrar).
  - [ ] Modales de confirmación antes de la eliminación de un artículo.
- **Esfuerzo Estimado**: 6 Horas

---

## 📂 Organización de contenido

### [ID-FRONT-03] Vista de Artículos por Categoría
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar una página en frontend (`/categories/[slug]`) que liste todos los artículos asociados a una categoría específica, consumiendo la API de Strapi.
- **Definición de Done (DoD)**:
  - [ ] Se muestran correctamente los artículos filtrados por categoría.
  - [ ] La vista incluye paginación o lazy loading si aplica.
  - [ ] El breadcrumb indica correctamente la categoría actual.
- **Esfuerzo Estimado**: 5 Horas

---

## 🎨 Frontend

### [ID-FRONT-04] Página de Perfil de Autor
- **Contexto**: Frontend / Visualización
- **Descripción**: Crear la vista pública del perfil del autor (`/authors/[slug]`), mostrando su biografía, avatar y una lista de los artículos que ha escrito.
- **Definición de Done (DoD)**:
  - [ ] Se visualiza correctamente la bio y avatar consumidos de Strapi.
  - [ ] Se lista el histórico de artículos del autor.
  - [ ] Diseño responsivo completado.
- **Esfuerzo Estimado**: 4 Horas

### [ID-FRONT-05] Página de Detalle de Artículo
- **Contexto**: Frontend / Visualización
- **Descripción**: Desarrollar la vista dinámica (`/articles/[slug]`) para mostrar el contenido completo del artículo, incluyendo el renderizado del Markdown con resaltado de sintaxis.
- **Definición de Done (DoD)**:
  - [ ] El artículo se obtiene por su slug.
  - [ ] El Markdown se renderiza y sanitiza correctamente (ref. ID-FRONT-02).
  - [ ] Se muestran los metadatos (fecha, autor, categoría).
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-06] Página de Login y Registro
- **Contexto**: Frontend / Visualización
- **Descripción**: Integrar los formularios de login y registro (`LoginForm.tsx` y `RegisterForm.tsx`) con la API de Strapi para el manejo de sesiones de usuario (JWT).
- **Definición de Done (DoD)**:
  - [ ] Autenticación completa funcionando y guardando JWT (ej. js-cookie).
  - [ ] Manejo de errores visualizado mediante Toast u otros componentes.
  - [ ] Redirección automática tras autenticación exitosa.
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-10] Panel de Configuración de Perfil
- **Contexto**: Frontend / Visualización
- **Descripción**: Desarrollar la vista de configuración de usuario donde pueda ver su información personal, actualizarla y subir una foto de perfil (avatar).
- **Definición de Done (DoD)**:
  - [ ] Vista de configuración protegida, accesible solo para usuarios autenticados.
  - [ ] Formulario para actualizar datos personales (nombre, biografía, etc.) sincronizado con Strapi.
  - [ ] Integración con el plugin de upload de Strapi para cargar y actualizar la foto de perfil.
  - [ ] Diseño responsivo completado.
- **Esfuerzo Estimado**: 5 Horas

---

## ⚡ Optimización

### [ID-FRONT-07] Configurar ISR (Incremental Static Regeneration)
- **Contexto**: Frontend / Rendimiento
- **Descripción**: Configurar ISR en las páginas de listado y detalle de artículos de Next.js para mejorar el SEO y rendimiento, revalidando el contenido cada cierto tiempo.
- **Definición de Done (DoD)**:
  - [ ] Rutas de artículos (SSG) implementan `revalidate`.
  - [ ] Se demuestra que las actualizaciones en Strapi se reflejan tras el tiempo configurado.
- **Esfuerzo Estimado**: 3 Horas

---

## 🔒 Seguridad y moderación

### [ID-BACK-03] Permisos Avanzados y Moderación
- **Contexto**: Backend / Seguridad
- **Descripción**: Definir estrictamente los permisos a nivel API: Los Authors solo pueden modificar sus propios artículos; los Admins pueden gestionar todo y borrar contenido inapropiado.
- **Definición de Done (DoD)**:
  - [ ] Policies personalizadas en Strapi (Is-Owner) para `update` y `delete`.
  - [ ] Pruebas confirmando que un Author A no puede editar el artículo del Author B.
- **Esfuerzo Estimado**: 4 Horas

### [ID-FRONT-08] Añadir Captcha en Registro
- **Contexto**: Frontend / Seguridad
- **Descripción**: Integrar una herramienta de validación CAPTCHA (ej. reCAPTCHA o Turnstile) en el formulario de registro para evitar ataques automatizados y spam.
- **Definición de Done (DoD)**:
  - [ ] El registro falla si no se resuelve el captcha.
  - [ ] Verificación de token validada tanto en front como en el backend si es necesario.
- **Esfuerzo Estimado**: 3 Horas

---

## 🔍 Descubrimiento y Búsqueda (Nuevos Features)

### [ID-BACK-04] Modelo Tags y Filtros de Búsqueda
- **Contexto**: Backend / Query Manager
- **Descripción**: Crear la colección `Tag`, establecer relación muchos-a-muchos con `Article` y habilitar filtros de búsqueda por texto y etiquetas en la API.
- **Definición de Done (DoD)**:
  - [ ] Colección `Tag` creada en Strapi.
  - [ ] Relación `Article` <-> `Tag` configurada.
  - [ ] Endpoints expuestos con capacidad de filtrado y búsqueda de texto.
- **Esfuerzo Estimado**: 3 Horas

### [ID-FRONT-11] Barra de Búsqueda y Navegación por Etiquetas
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar una barra de búsqueda global en el header y mostrar las etiquetas (`tags`) en los artículos con posibilidad de filtrado.
- **Definición de Done (DoD)**:
  - [ ] Barra de búsqueda funcional que consulta a la API.
  - [ ] Los artículos muestran sus etiquetas (`tags`).
  - [ ] Vista para explorar artículos por etiqueta (`/tags/[slug]`).
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-12] SEO Dinámico, Sitemap y Artículos Relacionados
- **Contexto**: Frontend / Optimización
- **Descripción**: Configurar meta tags Open Graph dinámicos por página, generar `sitemap.xml` automáticamente y mostrar componente "Leer Siguiente" en el detalle de artículos.
- **Definición de Done (DoD)**:
  - [ ] Metadatos y Open Graph dinámicos en `/articles/[slug]`.
  - [ ] Generación automática de `sitemap.xml`.
  - [ ] Componente "Artículos Relacionados" visible al final del post.
- **Esfuerzo Estimado**: 4 Horas

---

## 💬 Interacción y Comunidad

### [ID-BACK-05] Sistema de Comentarios y Favoritos (Modelos)
- **Contexto**: Backend / Lógica de Negocio
- **Descripción**: Modelar y configurar las colecciones `Comment` (relacionada a `Article` y `User`) y la lógica para guardar artículos en favoritos (relación muchos a muchos `User` y `Article`).
- **Definición de Done (DoD)**:
  - [ ] Colección `Comment` creada con relación a `User` y `Article`.
  - [ ] Endpoints de creación y lectura de comentarios habilitados y asegurados.
  - [ ] Endpoint o modelo para "Favoritos/Likes" del usuario configurado.
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-13] UI de Comentarios y Botón de Favoritos
- **Contexto**: Frontend / Interacción
- **Descripción**: Implementar la interfaz de usuario para ver y añadir comentarios en los artículos, y el botón para dar "Me gusta" o "Favorito".
- **Definición de Done (DoD)**:
  - [ ] Sección de comentarios visible en el detalle del artículo.
  - [ ] Formulario funcional para usuarios autenticados para enviar comentario.
  - [ ] Botón de "Favorito" funcional con feedback visual.
- **Esfuerzo Estimado**: 5 Horas

### [ID-FRONT-14] Formulario de Newsletter
- **Contexto**: Frontend / Engagement
- **Descripción**: Añadir un formulario en el footer del blog para captar correos de suscriptores (simulando suscripción o integrando con Resend/Mailchimp).
- **Definición de Done (DoD)**:
  - [ ] Componente de formulario de newsletter en el Footer.
  - [ ] Validación de email y feedback visual ("¡Suscrito con éxito!").
- **Esfuerzo Estimado**: 2 Horas

---

## 📖 Experiencia de Lectura (UX/UI)

### [ID-FRONT-15] Mejoras UX de Lectura (ToC, Progreso, Tiempo)
- **Contexto**: Frontend / Visualización
- **Descripción**: Agregar funciones avanzadas para la lectura: cálculo automático del tiempo de lectura, barra de progreso superior al hacer scroll y Tabla de Contenidos (ToC) autogenerada.
- **Definición de Done (DoD)**:
  - [ ] Muestra del tiempo de lectura estimado bajo el título.
  - [ ] Barra de progreso funcional ligada al scroll en el artículo.
  - [ ] Tabla de Contenidos (ToC) generada a partir de los encabezados del Markdown.
- **Esfuerzo Estimado**: 6 Horas

### [ID-FRONT-16] Tema Oscuro (Dark Mode)
- **Contexto**: Frontend / Visualización
- **Descripción**: Implementar el cambio entre tema claro y oscuro utilizando `next-themes` y ajustando las variables CSS de shadcn/ui.
- **Definición de Done (DoD)**:
  - [ ] Switch de tema en el Header (Sol/Luna).
  - [ ] Los colores se adaptan correctamente en todos los componentes.
  - [ ] La preferencia del usuario se guarda y persiste.
- **Esfuerzo Estimado**: 3 Horas

---

## 🖼️ Gestión de Medios (Autores)

### [ID-BACK-06] Assets: Imagen de Portada y Subida de Archivos
- **Contexto**: Backend / Gestión de Medios
- **Descripción**: Añadir un campo "Cover Image" al modelo `Article` y habilitar/configurar los permisos y el plugin de subida de medios de Strapi para el rol de `Author`.
- **Definición de Done (DoD)**:
  - [ ] Modelo `Article` tiene el campo "cover" (Media).
  - [ ] El rol `Author` tiene permisos para subir archivos mediante el plugin de `upload`.
- **Esfuerzo Estimado**: 2 Horas

### [ID-FRONT-17] Portadas de Artículo y Editor con Imágenes
- **Contexto**: Frontend / Visualización y Edición
- **Descripción**: Mostrar la imagen de portada en los listados y detalles del artículo, e integrar la subida de imágenes dentro de la UI del editor de artículos (Dashboard).
- **Definición de Done (DoD)**:
  - [ ] Las Cards de artículos y el detalle muestran la "Cover Image".
  - [ ] El formulario de edición permite subir y asignar la Cover Image.
  - [ ] El editor Markdown permite inyectar imágenes en el texto (opcional/deseable).
- **Esfuerzo Estimado**: 6 Horas
