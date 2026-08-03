# Objetivo

Refactorizar el backend de Strapi 5 para separar completamente la lógica de negocio de los controladores, creando una arquitectura basada en servicios reutilizables para la gestión de usuarios autenticados y artículos.

El resultado debe seguir las buenas prácticas de Strapi 5 y ser fácilmente escalable.

---

# Contexto

Actualmente existe un blog construido con Strapi 5.

Los principales Content Types son:

* User (plugin users-permissions)
* Author
* Article
* Category

La relación entre User y Author es:

```text
User (OneToOne) Author
```

Un usuario registrado genera automáticamente un Author.

La relación entre Author y Article es:

```text
Author (OneToMany) Articles
```

Existe una extensión del plugin `users-permissions` ubicada en:

```text
src/extensions/users-permissions/strapi-server.ts
```

Actualmente esta extensión:

* intercepta `auth.register`
* crea automáticamente un Author
* se extenderá para personalizar `GET /users/me`

Sin embargo, no quiero que la lógica de negocio permanezca dentro de `strapi-server.ts`.

---

# Objetivo arquitectónico

Quiero migrar el proyecto hacia una arquitectura basada en servicios.

Los controladores únicamente deben:

* validar la petición
* obtener el usuario autenticado
* llamar a un servicio
* devolver la respuesta

Toda la lógica de negocio debe vivir en servicios reutilizables.

---

# Primera tarea

Crear una estructura de servicios reutilizables.

Propón la estructura de carpetas más adecuada para Strapi 5.

Por ejemplo, si lo consideras correcto:

```text
src/
│
├── author/
│   ├── service/
│       ├── ArticleService
```

# Segunda tarea

Crear un servicio:

```text
ArticleService
```

Debe encapsular toda la lógica relacionada con artículos.

Como mínimo debe implementar:

```ts
getPublishedArticles()

getArticle(documentId)

getArticlesByAuthor(authorId)

createArticle(authorId, dto)

updateArticle(authorId, documentId, dto)

deleteArticle(authorId, documentId)
```

Responsabilidades:

* consultas
* filtros
* populate
* validaciones de pertenencia del artículo
* acceso a base de datos

Los controladores nunca deben consultar directamente la base de datos.

---

# Tercera tarea

Diseñar la API pública y privada.

## API pública

```http
GET /api/articles

GET /api/articles/:documentId
```

Disponible para visitantes.

Debe permitir filtros, ordenamiento y paginación.

---

## API privada

Crear endpoints específicos para el usuario autenticado.

Por ejemplo:

```http
GET /api/articles/me

POST /api/articles

PUT /api/articles/:documentId

DELETE /api/articles/:documentId
```

No debe aceptarse nunca un `authorId` enviado desde el frontend.

El autor siempre debe obtenerse desde:

```ts
ctx.state.user
```

utilizando [current-user](src/api/author/services/current-user.ts).

---

# Cuarta tarea

Aplicar principios SOLID y Clean Architecture cuando sean compatibles con Strapi.

Se busca:

* alta cohesión
* bajo acoplamiento
* reutilización
* separación de responsabilidades
* facilidad para pruebas
* facilidad para extender el proyecto

---

# Requisitos técnicos

La implementación debe:

* utilizar Strapi 5
* seguir las convenciones oficiales del framework
* minimizar consultas a la base de datos
* reutilizar servicios
* evitar duplicación de código
* utilizar populate únicamente cuando sea necesario
* aprovechar correctamente las relaciones existentes entre User, Author y Article

---

# Resultado esperado

El agente debe entregar:

1. La estructura final de carpetas.
2. La explicación de la arquitectura propuesta.
3. La implementación completa de cada servicio.
4. La implementación de los controladores.
5. La implementación de `strapi-server.ts`.
6. Las rutas necesarias.
7. La explicación de por qué cada responsabilidad pertenece a ese servicio.
8. Recomendaciones para futuras funcionalidades (comentarios, likes, borradores, revisiones, etc.) manteniendo la misma arquitectura.
