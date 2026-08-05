#!/usr/bin/env python3
"""
Synthetic Dataset Generator for Blog Article Content Moderation
===============================================================
Generates ~500 bilingual (ES/EN) blog articles labeled for multi-label
classification across 5 categories: sexual, violent, spam,
hate_discrimination, acceptable.

Output: ai/data/dataset_blog_articles.csv

Usage:
    cd ai/scripts
    python generate_data.py
"""

import csv
import random
import os
from collections import Counter

random.seed(42)

# === Configuration ===
SCRIPT_DIR = os.path.dirname(os.path.abspath(__file__))
AI_DIR = os.path.dirname(SCRIPT_DIR)
OUTPUT_DIR = os.path.join(AI_DIR, "data")
OUTPUT_FILE = os.path.join(OUTPUT_DIR, "dataset_blog_articles.csv")

FIELDNAMES = [
    "title", "description", "content", "author", "category",
    "sexual", "violent", "spam", "hate_discrimination", "acceptable"
]

# === Shared Constants ===
AUTHORS = [
    "Carlos Mendoza", "María García", "Juan Pérez", "Ana López",
    "Roberto Sánchez", "Laura Martínez", "Diego Torres", "Sofia Rivera",
    "Pedro Hernández", "Valentina Cruz", "Andrés Morales", "Isabella Flores",
    "John Smith", "Emily Johnson", "Michael Chen", "Sarah Williams",
    "David Kim", "Rachel Green", "Guest Author", "Admin"
]

CATEGORIES = [
    "Inteligencia Artificial", "DevOps", "Arquitectura de Software",
    "Redes y Seguridad", "Bases de Datos", "Programación",
    "Cloud Computing", "IoT", "Blockchain", "Data Science",
    "Machine Learning", "Desarrollo Web", "Ciberseguridad"
]

# === TECH TOPICS for acceptable articles ===
TECH_TOPICS = [
    "Docker", "Kubernetes", "React", "Next.js", "Python", "Go", "Rust",
    "PostgreSQL", "MongoDB", "Redis", "GraphQL", "REST APIs", "gRPC",
    "TensorFlow", "PyTorch", "Scikit-learn", "Apache Kafka", "RabbitMQ",
    "Terraform", "Ansible", "Jenkins", "GitHub Actions", "GitLab CI",
    "AWS Lambda", "Azure Functions", "Google Cloud Run", "Nginx",
    "Linux", "Git", "TypeScript", "Node.js", "Django", "FastAPI",
    "Spring Boot", "microservicios", "DevSecOps", "CI/CD",
    "WebAssembly", "Svelte", "Vue.js", "Flutter", "Elasticsearch"
]

# =========================================================================
# ACCEPTABLE Article Templates (tech blog about systems engineering)
# =========================================================================

ACCEPTABLE_TITLE_PATTERNS_ES = [
    "Introducción a {topic}: Conceptos Fundamentales",
    "Guía Completa de {topic} para Desarrolladores",
    "Cómo Implementar {topic} en Proyectos Reales",
    "{topic} vs {topic2}: ¿Cuál Elegir en {year}?",
    "Mejores Prácticas de {topic} en Producción",
    "Arquitectura con {topic}: Patrones y Antipatrones",
    "Tutorial: Desplegando Aplicaciones con {topic}",
    "Optimización de Rendimiento en {topic}",
    "Seguridad en {topic}: Lo que Todo Desarrollador Debe Saber",
    "El Futuro de {topic} en la Ingeniería de Software",
    "Escalabilidad Horizontal con {topic}",
    "Monitoreo y Observabilidad usando {topic}",
    "De Monolito a {topic}: Una Historia de Migración",
    "Testing Automatizado con {topic}",
    "Patrones de Diseño Aplicados a {topic}",
    "Integrando {topic} con {topic2} en un Stack Moderno",
    "Errores Comunes al Usar {topic} y Cómo Evitarlos",
    "{topic} en la Nube: Despliegue y Configuración",
    "Análisis de Rendimiento: {topic} bajo Carga",
    "Comenzando con {topic}: Tu Primer Proyecto"
]

ACCEPTABLE_TITLE_PATTERNS_EN = [
    "Getting Started with {topic}: A Comprehensive Guide",
    "Building Scalable Systems with {topic}",
    "How to Deploy {topic} in Production",
    "{topic} Best Practices for {year}",
    "Understanding {topic} Architecture Patterns",
    "Advanced {topic} Techniques for Backend Development",
    "Why We Switched from {topic2} to {topic}",
    "Performance Tuning in {topic}: A Deep Dive",
    "Security Considerations for {topic} Applications",
    "Real-World {topic} Case Studies and Lessons Learned",
    "{topic} and {topic2}: Building a Modern Stack",
    "The Complete {topic} Developer Roadmap",
    "Debugging Common {topic} Issues in Production",
    "Containerizing {topic} Applications with Docker",
    "From Zero to Hero with {topic}"
]

ACCEPTABLE_DESC_PATTERNS = [
    "Una guía detallada sobre cómo utilizar {topic} en entornos de producción modernos.",
    "Exploramos los conceptos clave y mejores prácticas para trabajar con {topic}.",
    "Análisis técnico de {topic} con ejemplos de código y casos de uso reales.",
    "A deep dive into {topic} architecture and implementation strategies.",
    "Learn how to leverage {topic} for building robust, scalable applications.",
    "Comparativa técnica y análisis de rendimiento de {topic} en equipos de desarrollo.",
    "Step-by-step tutorial for implementing {topic} in your next project.",
    "Descubre cómo {topic} puede transformar tu pipeline de desarrollo.",
    "Everything you need to know about {topic} in modern software engineering.",
    "Guía práctica con ejemplos reales para dominar {topic} desde cero."
]

ACCEPTABLE_PARAGRAPHS_ES = [
    "En el mundo del desarrollo de software moderno, {topic} se ha convertido en una herramienta fundamental para equipos que buscan mejorar su productividad y la calidad de sus entregables. Esta tecnología permite a los desarrolladores enfocarse en la lógica de negocio mientras la infraestructura se maneja de manera automatizada y reproducible. La comunidad de {topic} ha crecido exponencialmente en los últimos años, con miles de contribuciones open-source que enriquecen su ecosistema.",

    "La arquitectura basada en {topic} ofrece ventajas significativas en términos de escalabilidad y mantenibilidad. Al desacoplar los componentes del sistema, podemos desplegar, escalar y actualizar cada servicio de manera independiente, lo que reduce significativamente el riesgo de fallos en cascada. Esta aproximación sigue los principios de la arquitectura limpia propuestos por Robert C. Martin.",

    "Para implementar {topic} correctamente, es crucial entender sus principios fundamentales. Primero, debemos configurar el entorno de desarrollo local con las versiones correctas de las dependencias. Luego, establecemos las conexiones con los servicios externos necesarios como bases de datos y colas de mensajes. Finalmente, implementamos los patrones de resiliencia como circuit breakers, retry policies y bulkheads.",

    "El monitoreo es un aspecto crítico cuando trabajamos con {topic}. Herramientas como Prometheus, Grafana y el stack ELK nos permiten obtener visibilidad completa del comportamiento del sistema en producción. Las métricas clave que debemos rastrear incluyen latencia p50/p95/p99, throughput, tasa de errores HTTP 5xx y utilización de CPU/memoria.",

    "La seguridad no debe ser una consideración posterior cuando trabajamos con {topic}. Desde el inicio del proyecto, debemos implementar prácticas como el escaneo automatizado de vulnerabilidades con Snyk o Trivy, la gestión segura de secretos con Vault o AWS Secrets Manager, la autenticación robusta con OAuth2/OIDC y el principio de mínimo privilegio.",

    "Las pruebas automatizadas son esenciales para mantener la calidad del código cuando usamos {topic}. Recomendamos una estrategia de testing en pirámide: muchas pruebas unitarias rápidas en la base con Jest o pytest, pruebas de integración con Testcontainers en el medio, y pocas pero críticas pruebas end-to-end con Playwright o Cypress en la cima.",

    "El rendimiento es una preocupación constante en aplicaciones que utilizan {topic}. Técnicas como el caching con Redis, la indexación adecuada de bases de datos, la compresión gzip/brotli de respuestas, el lazy loading de módulos y la paginación basada en cursores pueden mejorar dramáticamente los tiempos de respuesta del sistema.",

    "La adopción de {topic} en equipos grandes requiere una estrategia de migración gradual y bien planificada. No es recomendable hacer un cambio radical de un día para otro. En su lugar, se sugiere un enfoque incremental tipo strangler fig pattern donde se migran módulos específicos mientras se mantiene la compatibilidad con el sistema legacy existente.",

    "La documentación técnica es un componente frecuentemente subestimado al trabajar con {topic}. Un README bien estructurado, diagramas de arquitectura actualizados con C4 model, ADRs (Architecture Decision Records) y runbooks de operación son fundamentales para la sostenibilidad a largo plazo del proyecto.",

    "El diseño de APIs con {topic} debe seguir principios de consistencia y facilidad de uso. Utilizar versionado semántico, documentación con OpenAPI/Swagger, códigos de estado HTTP correctos, paginación estandarizada y manejo uniforme de errores son prácticas que mejoran significativamente la experiencia del desarrollador consumidor."
]

ACCEPTABLE_PARAGRAPHS_EN = [
    "In modern software engineering, {topic} has become an essential tool for teams looking to improve their development workflow and ship reliable software faster. By leveraging its powerful features, developers can build more robust and maintainable systems while reducing the cognitive overhead of managing complex infrastructure.",

    "The key advantage of using {topic} lies in its ability to abstract away low-level concerns and provide a clean, declarative interface for defining system behavior. This allows teams to focus on delivering business value rather than fighting with configuration drift and deployment issues.",

    "When implementing {topic} in a production environment, there are several best practices to follow. First, always start with a proper CI/CD pipeline using tools like GitHub Actions or Jenkins. Second, implement comprehensive structured logging and distributed tracing from day one. Third, design for failure by implementing retry mechanisms, circuit breakers, and graceful degradation.",

    "Performance optimization with {topic} requires a data-driven approach. Profile your application under realistic load conditions using tools like k6 or Apache JMeter, identify bottlenecks using APM tools like Datadog or New Relic, and apply targeted optimizations. Remember that premature optimization is the root of all evil.",

    "Security should be a first-class concern in any {topic} implementation. Implement defense in depth with multiple layers of security controls. Use TLS everywhere, implement proper authentication with JWT or OAuth2, apply input validation and sanitization, and regularly audit your security posture with OWASP ZAP.",

    "Testing strategies for {topic} should follow the testing pyramid principle: a broad base of unit tests for fast feedback, a middle layer of integration tests for component interaction verification, and a thin layer of end-to-end tests for critical user journeys. This approach balances speed with confidence.",

    "Observability is crucial for {topic} systems in production. The three pillars of observability—metrics, logs, and traces—provide the visibility needed to understand system behavior and quickly diagnose issues. Implement structured logging, custom metrics, and distributed tracing from the start.",

    "Infrastructure as Code with {topic} enables reproducible and version-controlled infrastructure management. Tools like Terraform, Pulumi, or CDK allow teams to define their infrastructure declaratively, track changes through git, and apply consistent configurations across environments."
]

# =========================================================================
# SEXUAL Content Templates
# =========================================================================

SEXUAL_TITLES = [
    "Contenido Explícito para Adultos: Lo Que Necesitas Saber",
    "Las Mejores Páginas de Entretenimiento para Adultos en 2024",
    "Guía de Contenido NSFW: Sitios y Recursos",
    "Cómo Acceder a Material Pornográfico de Forma Segura",
    "Top 10 Sitios de Videos para Adultos XXX",
    "Reseñas de Plataformas de Contenido Erótico Premium",
    "Adult Entertainment Industry: A Complete Overview",
    "Best NSFW Websites and Adult Content Platforms",
    "Explicit Content Guide: Where to Find Adult Material Online",
    "The Adult Film Industry: Behind the Scenes",
    "Pornografía y Tecnología: Distribución de Contenido XXX",
    "Servicios de Escorts y Acompañantes Online: Guía Completa",
    "Cámaras en Vivo para Adultos: Las Mejores Opciones",
    "Fetiches y Fantasías Sexuales: Una Exploración",
    "Aplicaciones de Citas para Encuentros Sexuales Casuales",
    "Desnudos y Pornografía: Dónde Encontrar Contenido",
    "Explicit Sexual Content and Online Adult Safety",
    "XXX Videos: The Most Popular Categories Online",
    "Erotic Literature and Sensual Storytelling Platforms",
    "Sexting and Nude Photo Sharing: Risks and Platforms"
]

SEXUAL_DESCRIPTIONS = [
    "Una guía completa sobre el contenido para adultos disponible en internet.",
    "Descubre las mejores plataformas de entretenimiento adulto y contenido explícito.",
    "Comprehensive review of adult entertainment platforms and NSFW content.",
    "Todo lo que necesitas saber sobre pornografía en línea y contenido sexual.",
    "A detailed guide to explicit content, adult websites, and erotic material.",
    "Reseñas y recomendaciones de los mejores sitios de contenido para adultos.",
    "Exploring the world of adult entertainment and sexually explicit material online.",
    "Guía de sitios eróticos, pornográficos y de contenido sexual en la web."
]

SEXUAL_PARAGRAPHS = [
    "El contenido para adultos ha experimentado un crecimiento exponencial en internet. Plataformas de pornografía como Pornhub y OnlyFans generan millones de visitas diarias de usuarios buscando material sexualmente explícito y contenido NSFW de todo tipo. La industria del entretenimiento adulto mueve miles de millones de dólares anualmente.",

    "Los sitios de pornografía en línea ofrecen una amplia variedad de categorías de contenido erótico y sexual. Desde videos para adultos convencionales hasta fetiches especializados, el mercado de entretenimiento sexual digital es extremadamente diverso y continúa expandiéndose con nuevas plataformas de contenido XXX.",

    "Las aplicaciones de citas para encuentros sexuales casuales han revolucionado la forma en que las personas buscan relaciones íntimas. Plataformas enfocadas en sexo casual y hookups permiten a los usuarios encontrar parejas para encuentros eróticos sin compromiso, con funciones de geolocalización y verificación de perfiles.",

    "La industria del contenido para adultos genera miles de millones de dólares anuales. Modelos y actrices pornográficas crean contenido explícito y sensual que se distribuye a través de plataformas especializadas en material sexual, incluyendo suscripciones premium y contenido personalizado de tipo erótico.",

    "El sexting y el intercambio de fotos de desnudos se ha normalizado entre adultos. Sin embargo, compartir contenido íntimo y sexual conlleva riesgos significativos de privacidad. Las imágenes explícitas y pornográficas pueden filtrarse y causar daño a las personas involucradas en la creación de contenido para adultos.",

    "Adult content platforms have implemented age verification systems to prevent minors from accessing pornographic and sexually explicit material. These NSFW sites use various methods to ensure only adults can view erotic and explicit content, including ID verification and credit card checks.",

    "The escort and adult companion industry operates in legal gray areas in many countries. Services offering sexual encounters and erotic companionship advertise openly online through classified adult websites, despite regulatory challenges around prostitution and sexual services.",

    "Live webcam sites for adults allow performers to stream sexually explicit content in real-time. These adult platforms have become a major segment of the pornography industry, with performers engaging in erotic shows, nude performances, and explicit sexual acts for paying subscribers."
]

# =========================================================================
# VIOLENT Content Templates
# =========================================================================

VIOLENT_TITLES = [
    "Cómo Fabricar Armas Caseras con Materiales Comunes",
    "Las Peleas Callejeras Más Brutales Grabadas en Video",
    "Tutorial: Fabricación de Explosivos Artesanales Paso a Paso",
    "Técnicas de Combate Letal para Defensa Personal Extrema",
    "Los Asesinatos Más Sangrientos de la Historia Reciente",
    "Cómo Hacer Daño Máximo en una Pelea: Guía Completa",
    "Armas Blancas: Guía de Uso y Técnicas de Ataque Mortales",
    "How to Build Homemade Weapons from Household Items",
    "Most Brutal Street Fights and Beatings Caught on Camera",
    "DIY Explosives: A Detailed Step-by-Step Guide",
    "Lethal Combat Techniques and Deadly Fighting Methods",
    "The Bloodiest Murders and Most Violent Massacres in History",
    "Gore y Violencia Extrema: Los Videos Más Perturbadores",
    "Tortura y Castigo: Métodos de Causar Sufrimiento Extremo",
    "Cómo Atacar a Alguien Sin Dejar Evidencia Forense",
    "School Violence and Mass Shooting Planning Details",
    "Terrorist Attack Methods and Bomb-Making Instructions",
    "Graphic Violence Compilation: Death and Destruction Uncensored",
    "Guía para Intimidar y Amenazar: Tácticas de Terror Urbano",
    "Mutilación y Violencia Gráfica: Contenido Sin Censura"
]

VIOLENT_DESCRIPTIONS = [
    "Instrucciones detalladas para fabricar armas y explosivos caseros letales.",
    "Compilación de los actos más violentos y brutales capturados en video.",
    "A detailed guide on lethal weapons, combat techniques, and extreme violence.",
    "Gore, sangre y violencia extrema: contenido gráfico sin ninguna censura.",
    "Step-by-step instructions for creating deadly weapons and causing harm.",
    "Técnicas de ataque, tortura y métodos para causar daño físico severo.",
    "Graphic content showing extreme violence, bloodshed, and brutality.",
    "Aprende técnicas de pelea callejera letal y combate sin reglas."
]

VIOLENT_PARAGRAPHS = [
    "Para fabricar un arma casera necesitarás los siguientes materiales: tubería de metal, un mecanismo de percusión y munición. Las instrucciones para el ensamblaje del arma letal son sencillas y cualquier persona puede seguirlas para crear un dispositivo funcional capaz de disparar proyectiles con fuerza mortal.",

    "Los explosivos artesanales pueden construirse con materiales que se encuentran en cualquier ferretería. La mezcla de ciertos químicos comunes crea una reacción explosiva devastadora capaz de causar destrucción masiva, matar a múltiples personas y dejar un radio de destrucción considerable en el área del impacto.",

    "Las técnicas de combate letal incluyen golpes dirigidos a zonas vitales del cuerpo humano. Un golpe certero en la tráquea puede causar la muerte instantánea por asfixia. Otros puntos vulnerables incluyen la sien, la nuca y las arterias principales donde un corte profundo causa desangramiento fatal en minutos.",

    "La violencia gráfica de estos videos muestra asesinatos reales, decapitaciones y mutilaciones sin ningún tipo de censura. El gore y la sangre son extremadamente explícitos, mostrando cuerpos destrozados y víctimas en agonía mientras sufren heridas mortales de armas blancas y de fuego.",

    "Las técnicas de tortura más efectivas incluyen la aplicación de dolor extremo en terminaciones nerviosas sensibles del cuerpo. Los métodos de tortura descritos aquí buscan causar el máximo sufrimiento posible a la víctima mientras se mantiene consciente, utilizando instrumentos de dolor.",

    "Homemade weapons can be constructed using common household items found in any hardware store. Pipe bombs, for example, require only metal tubing, a fuse, and an explosive compound. These improvised explosive devices are designed to cause devastating injuries, mass casualties, and widespread destruction.",

    "Street fighting techniques documented here focus on causing maximum lethal damage quickly. Target vulnerable areas like the eyes, throat, and groin. Use improvised weapons like broken bottles, bats, or brass knuckles to increase the lethality of each strike and ensure the opponent is incapacitated.",

    "Detailed plans for violent attacks often involve thorough reconnaissance of the target location. The attacker maps out entry and exit points, identifies security weaknesses, and determines where the most victims can be targeted. This guide covers planning, weapons selection, and execution of violent assaults."
]

# =========================================================================
# SPAM Content Templates
# =========================================================================

SPAM_TITLES = [
    "¡¡¡GANA $10,000 DÓLARES EN UN DÍA SIN HACER NADA!!!",
    "COMPRA SEGUIDORES INSTAGRAM BARATOS - 100% REALES",
    "💰💰💰 DINERO FÁCIL - INVERSIÓN CRIPTO GARANTIZADA 💰💰💰",
    "★★★ PASTILLAS PARA ADELGAZAR - PIERDE 30KG EN UNA SEMANA ★★★",
    "CLICK AQUÍ >>> IPHONE 16 GRATIS <<< OFERTA LIMITADA",
    "🔥🔥🔥 TRABAJO DESDE CASA $5000/SEMANA GARANTIZADO 🔥🔥🔥",
    "FREE MONEY!!! CLICK HERE TO WIN $50,000 INSTANTLY!!!",
    "BUY CHEAP FOLLOWERS AND LIKES - BEST PRICES GUARANTEED!!!",
    "BITCOIN MILLIONAIRE SECRET - INVEST $100 MAKE $10,000",
    "MIRACLE WEIGHT LOSS PILLS - LOSE 50 POUNDS IN 7 DAYS!!!",
    "FREE IPHONE 16 GIVEAWAY - CLICK NOW BEFORE IT'S GONE!!!",
    "WORK FROM HOME - EARN $10,000/WEEK WITH THIS SIMPLE TRICK",
    "¡OFERTA EXCLUSIVA! RÉPLICAS DE ROLEX POR SOLO $49.99!!!",
    "VIAGRA Y CIALIS SIN RECETA - ENVÍO GRATIS MUNDIAL",
    "CASINO ONLINE - BONO DE $1,000 GRATIS SIN DEPÓSITO!!!",
    "PRÉSTAMOS INSTANTÁNEOS SIN VERIFICACIÓN DE CRÉDITO AQUÍ",
    "HACK ANY SOCIAL MEDIA ACCOUNT IN MINUTES - FREE TOOL!!!",
    "MAKE $500/DAY COPY-PASTING LINKS - NO EXPERIENCE NEEDED",
    "¡¡¡ÚLTIMA OPORTUNIDAD!!! CURSOS GRATIS $$$$ CLICK AHORA",
    "UNLOCK ANY PHONE FREE - 100% WORKING METHOD GUARANTEED"
]

SPAM_DESCRIPTIONS = [
    "¡¡¡NO TE PIERDAS ESTA INCREÍBLE OPORTUNIDAD DE GANAR DINERO FÁCIL Y RÁPIDO!!!",
    "COMPRA YA - OFERTA POR TIEMPO LIMITADO - ENVÍO GRATIS A TODO EL MUNDO HOY",
    "CLICK HERE NOW!!! Limited time offer - Don't miss out on FREE money!!!",
    "100% GUARANTEED results - Make thousands of dollars from your couch TODAY!!!",
    "★★★★★ MEJOR PRECIO GARANTIZADO - DESCUENTO DEL 90% SOLO HOY ★★★★★",
    "ACT NOW before this AMAZING deal expires!!! You won't believe the savings!!!",
    "GRATIS GRATIS GRATIS - Sin costo, sin trampa, dinero real ahora mismo!!!",
    "EXCLUSIVE DEAL for our readers - SAVE 95% on everything TODAY ONLY!!!"
]

SPAM_PARAGRAPHS = [
    "¡¡¡ACTÚA AHORA!!! Esta es la oportunidad que estabas esperando. Gana $10,000 dólares diarios sin mover un dedo. Solo necesitas registrarte en nuestro sitio web www.dinero-facil-ya.com y comenzar a recibir pagos inmediatos. ¡¡¡100% GARANTIZADO O TE DEVOLVEMOS TU DINERO!!! No esperes más, esta oferta es POR TIEMPO LIMITADO. Solo quedan 3 PLAZAS disponibles.",

    "COMPRA SEGUIDORES DE INSTAGRAM, TWITTER, TIKTOK Y FACEBOOK al mejor precio del mercado. Paquetes desde $4.99 por 1000 seguidores 100% REALES y ACTIVOS. Visita www.compra-seguidores-baratos.com y usa el código DESCUENTO50 para obtener un 50% de descuento adicional. ¡¡¡OFERTA VÁLIDA SOLO POR HOY!!! Miles de clientes satisfechos. COMPRA AHORA.",

    "🔥🔥🔥 INVERSIÓN EN CRIPTOMONEDAS CON RETORNO GARANTIZADO DEL 1000% 🔥🔥🔥 Deposita solo $100 y gana $10,000 en una semana. Nuestro algoritmo de trading automático con IA tiene una tasa de éxito del 99.9%. Miles de personas ya se han hecho MILLONARIAS. ¡¡¡ÚNETE AHORA visitando www.cripto-millonario.com!!! PLAZAS LIMITADAS.",

    "PASTILLAS MILAGROSAS PARA ADELGAZAR - Pierde 30 kilos en solo 7 días con nuestro producto revolucionario aprobado por doctores. Sin dieta, sin ejercicio, sin efectos secundarios. Compra ahora en www.adelgaza-rapido.com con ENVÍO GRATIS a todo el mundo. Resultados 100% GARANTIZADOS o te devolvemos tu dinero. ★★★★★ Miles de testimonios reales.",

    "FREE!!! Win a brand new iPhone 16 Pro Max absolutely FREE!!! All you have to do is click this link: www.free-iphone-giveaway.com and fill out a simple 30-second survey. THOUSANDS of winners EVERY DAY!!! Don't miss this INCREDIBLE opportunity!!! ACT NOW before it's too late!!! Share with friends for EXTRA entries!!!",

    "WORK FROM HOME and earn $5,000 to $10,000 per week GUARANTEED!!! No experience needed!!! Our proven system allows ANYONE to make money online by simply copying and pasting links. Visit www.easy-money-online.com NOW and start earning TODAY!!! Only LIMITED SPOTS available!!! Join our team of SUCCESSFUL entrepreneurs!!!",

    "¡¡¡PRÉSTAMOS INSTANTÁNEOS SIN VERIFICACIÓN DE CRÉDITO!!! Obtén hasta $50,000 en solo minutos. Sin revisión de crédito, sin garante, sin papeleo complicado. Aprobación 100% GARANTIZADA para todos. Solicita ahora en www.prestamos-ya.com. ¡¡¡LA TASA DE INTERÉS MÁS BAJA DEL MERCADO!!! No importa tu historial crediticio.",

    "HACK any Instagram, Facebook, TikTok or WhatsApp account in just 2 minutes!!! Our FREE tool works 100% of the time GUARANTEED. Download now from www.hack-accounts-free.com. No technical skills required whatsoever!!! Over 1 MILLION satisfied users worldwide!!! Updated for 2024!!! WORKS ON ALL DEVICES!!!"
]

# =========================================================================
# HATE/DISCRIMINATION Content Templates
# =========================================================================

HATE_TITLES = [
    "Por Qué las Mujeres No Deberían Trabajar en Tecnología",
    "La Superioridad Racial: Evidencia que lo Demuestra",
    "Los Inmigrantes Están Destruyendo Nuestro País y Cultura",
    "Las Personas con Discapacidad Son una Carga para la Sociedad",
    "Why Women Don't Belong in STEM Fields: The Evidence",
    "Certain Races Are Genetically Superior to Others",
    "Immigrants Are All Criminals and Should Be Deported",
    "Disabled People Should Not Have Equal Rights in Society",
    "Los Homosexuales Son una Enfermedad Social Peligrosa",
    "Las Personas Trans Son Enfermos Mentales que Necesitan Cura",
    "Los Pueblos Indígenas Son Primitivos e Inferiores",
    "Muslims Are All Terrorists and Should Be Banned from Entry",
    "La Gente Pobre es Pobre Porque es Floja y Estúpida",
    "Los Judíos Controlan Secretamente la Economía Global",
    "Fat People Are Disgusting and Should Be Publicly Shamed",
    "Los Ancianos Son Inútiles y un Desperdicio de Recursos",
    "Cierta Raza es Inferior Intelectualmente: Los Datos lo Prueban",
    "Why Diversity Is Destroying Our Tech Companies",
    "Las Feministas Son el Cáncer que Destruye la Sociedad",
    "Autistic People Should Not Be Allowed in Regular Schools"
]

HATE_DESCRIPTIONS = [
    "Un análisis de por qué ciertos grupos raciales son superiores a otros en todo.",
    "Argumentos contundentes sobre por qué la diversidad es negativa para las empresas.",
    "Scientific proof that certain groups are genetically inferior and should be excluded.",
    "Las razones por las que las minorías no merecen igualdad de derechos civiles.",
    "A rational argument for why certain groups should not have equal opportunities.",
    "Evidencia de la inferioridad intelectual de ciertos grupos étnicos y raciales.",
    "Why traditional values demand the exclusion of marginalized groups from society.",
    "Datos que demuestran la superioridad innata de ciertas razas sobre otras."
]

HATE_PARAGRAPHS = [
    "Es un hecho supuestamente comprobado que ciertos grupos raciales tienen capacidades intelectuales inferiores. Los estudios de IQ manipulados demuestran que las razas que este texto llama inferiores no pueden competir intelectualmente. Esta supuesta inferioridad genética es la razón por la que ciertos pueblos nunca lograrán el nivel de las razas que se autoproclaman superiores.",

    "Las mujeres no tienen la capacidad intelectual ni emocional para trabajar en campos como la ingeniería de software según esta perspectiva discriminatoria. Su cerebro supuestamente está diseñado solo para tareas domésticas. Las empresas que contratan mujeres en tecnología están sacrificando calidad por una agenda política de diversidad forzada que destruye la meritocracia.",

    "Los inmigrantes son retratados como criminales, delincuentes que vienen a robar empleos y destruir la cultura nacional. Según esta narrativa de odio, se debe deportar a todos los extranjeros y cerrar las fronteras completamente. Cada inmigrante es presentado como un potencial terrorista y una amenaza para la seguridad nacional.",

    "Los homosexuales y las personas transgénero son caracterizados como enfermos mentales que necesitan tratamiento forzado, no derechos. Su estilo de vida es descrito como antinatural y una abominación que corrompe a la juventud y destruye los valores familiares tradicionales. Esta retórica de odio busca marginalizar y excluir.",

    "Las personas con discapacidad son presentadas como una carga económica y social que la sociedad no debería soportar. Los recursos destinados a su cuidado y accesibilidad serían supuestamente mejor utilizados en personas consideradas productivas. Este discurso deshumanizante niega el valor inherente de toda persona.",

    "People from certain racial backgrounds are falsely portrayed as inherently less intelligent and more prone to criminal behavior. This racist pseudoscience claims that some races are genetically superior in intelligence, work ethic, and civilizational achievement, ignoring centuries of systemic oppression and inequality.",

    "Diversity hiring is attacked as supposedly destroying the tech industry. This discriminatory narrative claims that companies prioritizing inclusion end up with incompetent workers from groups deemed inferior. The hateful argument states that only one demographic built the industry, and quotas for others reduce quality.",

    "Indigenous peoples are dehumanized as primitive and described as having contributed nothing to civilization. Their rich cultures and knowledge systems are dismissed as backward and irrelevant. This colonial rhetoric demands forced assimilation and dismisses valid claims about historical injustices and ongoing discrimination."
]


# =========================================================================
# Generator Functions
# =========================================================================

def generate_acceptable_article():
    """Generate a single acceptable tech blog article."""
    topic = random.choice(TECH_TOPICS)
    topic2 = random.choice([t for t in TECH_TOPICS if t != topic])
    year = random.choice(["2024", "2025", "2026"])

    if random.random() < 0.6:
        title = random.choice(ACCEPTABLE_TITLE_PATTERNS_ES).format(
            topic=topic, topic2=topic2, year=year
        )
        paragraphs = random.sample(
            ACCEPTABLE_PARAGRAPHS_ES,
            k=random.randint(3, min(5, len(ACCEPTABLE_PARAGRAPHS_ES)))
        )
    else:
        title = random.choice(ACCEPTABLE_TITLE_PATTERNS_EN).format(
            topic=topic, topic2=topic2, year=year
        )
        paragraphs = random.sample(
            ACCEPTABLE_PARAGRAPHS_EN,
            k=random.randint(3, min(5, len(ACCEPTABLE_PARAGRAPHS_EN)))
        )

    description = random.choice(ACCEPTABLE_DESC_PATTERNS).format(
        topic=topic, topic2=topic2
    )
    content = "\n\n".join(p.format(topic=topic, topic2=topic2) for p in paragraphs)

    return {
        "title": title,
        "description": description,
        "content": content,
        "author": random.choice(AUTHORS),
        "category": random.choice(CATEGORIES),
        "sexual": 0, "violent": 0, "spam": 0,
        "hate_discrimination": 0, "acceptable": 1
    }


def generate_negative_article(category):
    """Generate a single-label negative article."""
    template_map = {
        "sexual": (SEXUAL_TITLES, SEXUAL_DESCRIPTIONS, SEXUAL_PARAGRAPHS),
        "violent": (VIOLENT_TITLES, VIOLENT_DESCRIPTIONS, VIOLENT_PARAGRAPHS),
        "spam": (SPAM_TITLES, SPAM_DESCRIPTIONS, SPAM_PARAGRAPHS),
        "hate": (HATE_TITLES, HATE_DESCRIPTIONS, HATE_PARAGRAPHS),
    }
    titles, descriptions, paragraphs = template_map[category]

    title = random.choice(titles)
    description = random.choice(descriptions)
    content_blocks = random.sample(
        paragraphs, k=random.randint(2, min(4, len(paragraphs)))
    )
    content = "\n\n".join(content_blocks)

    labels = {
        "sexual": 1 if category == "sexual" else 0,
        "violent": 1 if category == "violent" else 0,
        "spam": 1 if category == "spam" else 0,
        "hate_discrimination": 1 if category == "hate" else 0,
        "acceptable": 0
    }

    return {
        "title": title,
        "description": description,
        "content": content,
        "author": random.choice(AUTHORS),
        "category": random.choice(CATEGORIES + ["General", "Otro"]),
        **labels
    }


def generate_multilabel_article():
    """Generate a multi-label negative article combining two categories."""
    combos = [
        ("violent", "hate"),
        ("sexual", "spam"),
        ("violent", "spam"),
        ("hate", "spam"),
    ]
    cat1, cat2 = random.choice(combos)

    template_map = {
        "sexual": (SEXUAL_TITLES, SEXUAL_DESCRIPTIONS, SEXUAL_PARAGRAPHS),
        "violent": (VIOLENT_TITLES, VIOLENT_DESCRIPTIONS, VIOLENT_PARAGRAPHS),
        "spam": (SPAM_TITLES, SPAM_DESCRIPTIONS, SPAM_PARAGRAPHS),
        "hate": (HATE_TITLES, HATE_DESCRIPTIONS, HATE_PARAGRAPHS),
    }

    t1, d1, b1 = template_map[cat1]
    t2, d2, b2 = template_map[cat2]

    title = random.choice(t1)
    description = random.choice(d2)
    p1 = random.sample(b1, k=random.randint(1, 2))
    p2 = random.sample(b2, k=random.randint(1, 2))
    all_paragraphs = p1 + p2
    random.shuffle(all_paragraphs)
    content = "\n\n".join(all_paragraphs)

    labels = {
        "sexual": 1 if "sexual" in (cat1, cat2) else 0,
        "violent": 1 if "violent" in (cat1, cat2) else 0,
        "spam": 1 if "spam" in (cat1, cat2) else 0,
        "hate_discrimination": 1 if "hate" in (cat1, cat2) else 0,
        "acceptable": 0
    }

    return {
        "title": title,
        "description": description,
        "content": content,
        "author": random.choice(AUTHORS),
        "category": random.choice(CATEGORIES + ["General", "Otro"]),
        **labels
    }


def main():
    """Generate the complete dataset."""
    os.makedirs(OUTPUT_DIR, exist_ok=True)

    articles = []

    # Acceptable articles (~60%)
    for _ in range(300):
        articles.append(generate_acceptable_article())

    # Single-label negative articles
    for _ in range(50):
        articles.append(generate_negative_article("sexual"))
    for _ in range(50):
        articles.append(generate_negative_article("violent"))
    for _ in range(50):
        articles.append(generate_negative_article("spam"))
    for _ in range(30):
        articles.append(generate_negative_article("hate"))

    # Multi-label articles
    for _ in range(20):
        articles.append(generate_multilabel_article())

    # Shuffle the dataset
    random.shuffle(articles)

    # Write CSV
    with open(OUTPUT_FILE, "w", newline="", encoding="utf-8") as f:
        writer = csv.DictWriter(f, fieldnames=FIELDNAMES)
        writer.writeheader()
        writer.writerows(articles)

    print(f"Dataset generated successfully: {OUTPUT_FILE}")
    print(f"  Total articles: {len(articles)}")

    # Print label distribution
    label_counts = Counter()
    for a in articles:
        for label in ["sexual", "violent", "spam", "hate_discrimination", "acceptable"]:
            if a[label] == 1:
                label_counts[label] += 1

    print(f"  Label distribution:")
    for label, count in sorted(label_counts.items()):
        print(f"    {label}: {count} ({count/len(articles)*100:.1f}%)")

    # Multi-label stats
    multi = sum(
        1 for a in articles
        if sum(a[l] for l in ["sexual", "violent", "spam", "hate_discrimination"]) > 1
    )
    print(f"  Multi-label articles: {multi} ({multi/len(articles)*100:.1f}%)")


if __name__ == "__main__":
    main()
