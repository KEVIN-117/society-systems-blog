'use strict';

async function createCategories() {
  const categories = [
    { name: 'Software', slug: 'software', description: 'Desarrollo, ingeniería y mantenimiento de software.' },
    { name: 'Datos', slug: 'datos', description: 'Ciencia de datos, Big Data, análisis y bases de datos.' },
    { name: 'Redes', slug: 'redes', description: 'Infraestructura de redes, telecomunicaciones y conectividad.' },
    { name: 'Arquitectura', slug: 'arquitectura', description: 'Arquitectura de software, microservicios y diseño de sistemas.' },
    { name: 'Inteligencia Artificial', slug: 'inteligencia-artificial', description: 'Machine Learning, Deep Learning, NLP y robótica.' },
    { name: 'Ciberseguridad', slug: 'ciberseguridad', description: 'Seguridad informática, hacking ético y criptografía.' },
    { name: 'Desarrollo Web', slug: 'desarrollo-web', description: 'Frontend, Backend, y tecnologías web modernas.' },
    { name: 'Desarrollo Móvil', slug: 'desarrollo-movil', description: 'Desarrollo de aplicaciones para iOS, Android y multiplataforma.' },
    { name: 'DevOps', slug: 'devops', description: 'Integración continua, entrega continua, contenedores y automatización.' },
    { name: 'Cloud Computing', slug: 'cloud-computing', description: 'Servicios en la nube, Serverless y despliegue escalable.' },
    { name: 'Hardware e IoT', slug: 'hardware-e-iot', description: 'Internet de las cosas, microcontroladores y arquitectura de hardware.' },
    { name: 'Gestión de TI', slug: 'gestion-de-ti', description: 'Gestión de proyectos tecnológicos, gobierno de TI y metodologías ágiles.' },
    { name: 'Sistemas Operativos', slug: 'sistemas-operativos', description: 'Administración, configuración y uso de sistemas operativos.' },
    { name: 'Innovación', slug: 'innovacion', description: 'Nuevas tecnologías, Web3, Realidad Virtual, y Metaverso.' }
  ];

  for (const category of categories) {
    try {
      const existing = await strapi.documents('api::category.category').findFirst({
        filters: { slug: category.slug }
      });
      
      if (existing) {
        console.log(`Category already exists, skipping: ${category.name}`);
        continue;
      }
      
      const created = await strapi.documents('api::category.category').create({
        data: category,
        status: 'published'
      });
      console.log(`Successfully created category: ${created.name}`);
    } catch (error) {
      console.log(`Could not create category: ${category.name}`);
      console.error(error.message);
    }
  }
}

async function main() {
  const { createStrapi, compileStrapi } = require('@strapi/strapi');

  const appContext = await compileStrapi();
  const app = await createStrapi(appContext).load();

  app.log.level = 'error';

  await createCategories();
  await app.destroy();

  process.exit(0);
}

main().catch((error) => {
  console.error(error);
  process.exit(1);
});
