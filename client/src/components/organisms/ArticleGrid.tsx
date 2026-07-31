import { ArticleCard } from "@/components/molecules/ArticleCard";

export function ArticleGrid() {
  const articles = [
    {
      title: "El futuro de los sistemas distribuidos en la educación superior",
      excerpt: "Un análisis exhaustivo sobre cómo las arquitecturas descentralizadas pueden revolucionar el acceso a la información en las universidades de Potosí.",
      date: "15 Oct 2026",
      author: "Comité de Investigación",
      category: "Arquitectura",
      categoryColor: "blue" as const,
    },
    {
      title: "Patrones de diseño en el desarrollo de software moderno",
      excerpt: "Explorando las mejores prácticas y principios aplicados a proyectos de software libre impulsados por estudiantes de la UATF.",
      date: "02 Sep 2026",
      author: "Dirección Científica",
      category: "Software",
      categoryColor: "purple" as const,
    },
    {
      title: "Seguridad y confianza en redes de nueva generación",
      excerpt: "Cómo la encriptación avanzada y la monitorización de infraestructura mejoran la resiliencia tecnológica en nuestras comunidades académicas.",
      date: "28 Ago 2026",
      author: "División de Redes",
      category: "Ciberseguridad",
      categoryColor: "blue" as const,
    }
  ];

  return (
    <section id="blog" className="py-24 relative">
      <div className="container mx-auto px-6 relative z-10">
        <div className="flex flex-col md:flex-row md:items-end justify-between mb-12">
          <div className="max-w-2xl">
            <h2 className="text-3xl md:text-5xl font-bold text-white mb-4">
              Últimas <span className="text-gradient-blue">Publicaciones</span>
            </h2>
            <p className="text-gray-400">
              Descubre las recientes investigaciones, artículos tecnológicos y proyectos desarrollados por los miembros de la Sociedad Científica.
            </p>
          </div>
          <a href="#" className="text-[#00b4db] hover:text-white font-medium mt-4 md:mt-0 transition-colors">
            Ver todos los artículos &rarr;
          </a>
        </div>
        
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6">
          {articles.map((article, i) => (
            <ArticleCard key={i} {...article} />
          ))}
        </div>
      </div>
    </section>
  );
}
