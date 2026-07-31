# Ejemplos de JSON y cURL para Modelos de la API (Strapi)

Este documento contiene ejemplos documentados de payloads JSON y comandos `curl` que puedes utilizar para realizar peticiones POST/PUT a tu API de Strapi (en `http://localhost:1337`) y probar los diferentes modelos definidos en `src/api`.

> **Nota para Strapi v5**: Recuerda que al realizar peticiones a la API REST para crear o actualizar, los datos principales deben ir envueltos dentro de un objeto `{"data": { ... }}`. Si tienes configurada la autenticación, deberás añadir el header `-H "Authorization: Bearer TU_TOKEN"`.

---

## 1. Category (Categorías)
Endpoint: `POST /api/categories`

Modelo utilizado para agrupar los artículos.

### JSON Payload
```json
{
  "data": {
    "name": "Inteligencia Artificial",
    "slug": "inteligencia-artificial",
    "description": "Artículos relacionados con Machine Learning, Redes Neuronales y automatización inteligente."
  }
}
```

### Comando cURL
```bash
curl -X POST http://localhost:1337/api/categories -H "Content-Type: application/json" -d '{"data": { "name": "Inteligencia Artificial", "slug": "inteligencia-artificial", "description": "Artículos relacionados con Machine Learning, Redes Neuronales y automatización inteligente."}}'
```

**Campos:**
- `name` (String): El nombre de la categoría.
- `slug` (UID): Identificador único amigable para la URL.
- `description` (Text): Breve descripción de la temática de la categoría.

---

## 2. Author (Autores)
Endpoint: `POST /api/authors`

Modelo que representa a los escritores o colaboradores del blog.

### JSON Payload
```json
{
  "data": {
    "name": "Alan Turing",
    "email": "alan.turing@example.com",
    "avatar": 1, 
    "user": 2 
  }
}
```

### Comando cURL
```bash
curl -X POST http://localhost:1337/api/authors \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "name": "Alan Turing",
      "email": "alan.turing@example.com",
      "avatar": 1, 
      "user": 2 
    }
  }'
```

**Campos:**
- `name` (String): Nombre completo del autor.
- `email` (String): Correo electrónico de contacto.
- `avatar` (Media/Relación): ID de la imagen previamente subida mediante el endpoint `/api/upload`.
- `user` (Relación): ID del usuario de Strapi (Admin/Users-Permissions) en caso de que esté vinculado a una cuenta del sistema.

---

## 3. Article (Artículos)
Endpoint: `POST /api/articles`

El modelo principal de contenido para los posts del blog. Incluye zonas dinámicas y relaciones.

### JSON Payload
```json
{
  "data": {
    "title": "El Futuro del Desarrollo de Software con IA",
    "description": "Una revisión exhaustiva de cómo las IA generativas están cambiando la ingeniería de software.",
    "slug": "futuro-desarrollo-software-ia",
    "content": "La ingeniería de software tradicional está evolucionando rápidamente...",
    "category": 1, 
    "author": 1,
    "cover": 5, 
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "## Introducción\n\nEl desarrollo de software se ha beneficiado enormemente de los LLMs..."
      },
      {
        "__component": "shared.quote",
        "title": "El código es el lenguaje de la era moderna.",
        "body": "No solo escribimos instrucciones para las máquinas, escribimos la lógica del futuro."
      }
    ]
  }
}
```

### Comando cURL
```bash
curl -X POST http://localhost:1337/api/articles \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "El Futuro del Desarrollo de Software con IA",
      "description": "Una revisión exhaustiva de cómo las IA generativas están cambiando la ingeniería de software.",
      "slug": "futuro-desarrollo-software-ia",
      "content": "La ingeniería de software tradicional está evolucionando rápidamente...",
      "category": 1, 
      "author": 1,
      "cover": 5, 
      "blocks": [
        {
          "__component": "shared.rich-text",
          "body": "## Introducción\n\nEl desarrollo de software se ha beneficiado enormemente de los LLMs..."
        },
        {
          "__component": "shared.quote",
          "title": "El código es el lenguaje de la era moderna.",
          "body": "No solo escribimos instrucciones para las máquinas, escribimos la lógica del futuro."
        }
      ]
    }
  }'
```

**Campos:**
- `title` (String): Título del artículo.
- `description` (Text): Resumen o subtítulo (máximo 80 caracteres).
- `slug` (UID): URL amigable generada a partir del título.
- `content` (RichText): El cuerpo de texto principal (Markdown o HTML).
- `category` y `author` (Relación): IDs de la categoría y autor correspondientes.
- `cover` (Media): ID de la imagen de portada.
- `blocks` (Dynamic Zone): Arreglo de diferentes componentes (texto, citas, media, sliders) para maquetación flexible.

---

## 4. About (Acerca de)
Endpoint: `PUT /api/about` (Single Type)

Modelo de tipo único (Single Type) para configurar la página "Sobre Nosotros" o "Acerca de".

### JSON Payload
```json
{
  "data": {
    "title": "Sobre Nuestra Sociedad de Ingeniería",
    "blocks": [
      {
        "__component": "shared.rich-text",
        "body": "Somos una comunidad de estudiantes y profesionales apasionados por la ingeniería de sistemas, la arquitectura de software y las nuevas tecnologías..."
      },
      {
        "__component": "shared.media",
        "file": 10
      }
    ]
  }
}
```

### Comando cURL
```bash
curl -X PUT http://localhost:1337/api/about \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "title": "Sobre Nuestra Sociedad de Ingeniería",
      "blocks": [
        {
          "__component": "shared.rich-text",
          "body": "Somos una comunidad de estudiantes y profesionales apasionados por la ingeniería de sistemas, la arquitectura de software y las nuevas tecnologías..."
        },
        {
          "__component": "shared.media",
          "file": 10
        }
      ]
    }
  }'
```

**Campos:**
- `title` (String): El título principal de la página.
- `blocks` (Dynamic Zone): Componentes que estructuran la presentación (texto enriquecido, galería/media, etc.).

---

## 5. Global (Configuración Global)
Endpoint: `PUT /api/global` (Single Type)

Modelo de tipo único utilizado para la configuración general del sitio web (SEO, nombre, logos).

### JSON Payload
```json
{
  "data": {
    "siteName": "Blog Sociedad de Ingeniería de Sistemas",
    "siteDescription": "El espacio principal para aprender, debatir y compartir conocimientos sobre ingeniería de software, IA y DevOps.",
    "favicon": 12,
    "defaultSeo": {
      "metaTitle": "Blog de Ingeniería de Sistemas - Inicio",
      "metaDescription": "Únete a nuestra comunidad y lee artículos de alta calidad técnica.",
      "shareImage": 15
    }
  }
}
```

### Comando cURL
```bash
curl -X PUT http://localhost:1337/api/global \
  -H "Content-Type: application/json" \
  -d '{
    "data": {
      "siteName": "Blog Sociedad de Ingeniería de Sistemas",
      "siteDescription": "El espacio principal para aprender, debatir y compartir conocimientos sobre ingeniería de software, IA y DevOps.",
      "favicon": 12,
      "defaultSeo": {
        "metaTitle": "Blog de Ingeniería de Sistemas - Inicio",
        "metaDescription": "Únete a nuestra comunidad y lee artículos de alta calidad técnica.",
        "shareImage": 15
      }
    }
  }'
```

**Campos:**
- `siteName` (String): Nombre global del sitio.
- `siteDescription` (Text): Descripción global del sitio.
- `favicon` (Media): ID del logo o icono.
- `defaultSeo` (Componente shared.seo): Información predeterminada de SEO que usan las páginas si no proveen la propia.
