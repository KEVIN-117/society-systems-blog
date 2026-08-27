const strapi = require('@strapi/strapi');

(async () => {
  const app = await strapi().load();
  
  const docs = await app.documents('api::article.article').findMany({
    populate: '*',
  });
  
  console.log(JSON.stringify(docs, null, 2));
  
  process.exit(0);
})();
