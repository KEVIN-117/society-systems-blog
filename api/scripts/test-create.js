const strapi = require('@strapi/strapi');

(async () => {
  const app = await strapi().load();
  
  try {
    const article = await app.documents('api::article.article').create({
      data: {
        title: 'Test',
        slug: 'test',
        content: 'test content',
        description: 'test description',
        publishedAt: new Date().toISOString()
      },
    });
    console.log("Success:", article.documentId);
  } catch (e) {
    console.error("Error:", e.message, e.details);
  }
  
  process.exit(0);
})();
