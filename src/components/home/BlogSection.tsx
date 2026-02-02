import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import blogBi from "@/assets/blog-bi.jpg";
import blogJurimetria from "@/assets/blog-jurimetria.jpg";
import blogAutomacao from "@/assets/blog-automacao.jpg";

const featuredPosts = [
  {
    id: 1,
    title: "Como o Business Intelligence pode transformar seu escritório jurídico",
    excerpt: "Descubra como dashboards e relatórios automatizados podem otimizar a gestão do seu escritório e melhorar a tomada de decisões.",
    category: "Business Intelligence",
    date: "15 Jan 2025",
    readTime: "5 min",
    featured: true,
    slug: "bi-escritorio-juridico",
    image: blogBi,
  },
  {
    id: 2,
    title: "Jurimetria: O futuro da advocacia baseada em dados",
    excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos processuais.",
    category: "Jurimetria",
    date: "10 Jan 2025",
    readTime: "7 min",
    featured: true,
    slug: "jurimetria-futuro-advocacia",
    image: blogJurimetria,
  },
  {
    id: 3,
    title: "Automação jurídica: Robôs que economizam tempo",
    excerpt: "Conheça as vantagens de automatizar consultas processuais e como isso impacta a produtividade da equipe.",
    category: "Automação",
    date: "5 Jan 2025",
    readTime: "4 min",
    featured: false,
    slug: "automacao-juridica-robos",
    image: blogAutomacao,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.15,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.5,
      ease: "easeOut" as const,
    },
  },
};

export function BlogSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <div>
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={isInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Blog
            </motion.span>
            <motion.h2 
              className="text-3xl md:text-4xl font-display font-bold text-foreground"
              initial={{ opacity: 0, y: 20 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Artigos e insights
            </motion.h2>
            <motion.p 
              className="text-lg text-muted-foreground mt-2"
              initial={{ opacity: 0 }}
              animate={isInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              Conteúdo especializado sobre BI, Jurimetria e tecnologia.
            </motion.p>
          </div>
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ delay: 0.5 }}
          >
            <Button asChild variant="outline">
              <Link to="/blog">
                Ver todos os artigos
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
          </motion.div>
        </motion.div>

        {/* Posts Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {featuredPosts.map((post) => (
            <motion.div key={post.id} variants={itemVariants}>
              <Card className="group overflow-hidden border hover:shadow-xl transition-all duration-500 h-full">
                {/* Image */}
                <div className="aspect-video relative overflow-hidden">
                  <motion.img 
                    src={post.image}
                    alt={post.title}
                    className="w-full h-full object-cover"
                    whileHover={{ scale: 1.05 }}
                    transition={{ duration: 0.6 }}
                  />
                  <div className="absolute inset-0 bg-gradient-to-t from-background/60 to-transparent" />
                  {post.featured && (
                    <Badge className="absolute top-4 left-4 bg-brand-tiffany text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Destaque
                    </Badge>
                  )}
                </div>

                <CardHeader className="pb-2">
                  <div className="flex items-center gap-4 text-sm text-muted-foreground mb-2">
                    <Badge variant="outline">{post.category}</Badge>
                    <span className="flex items-center gap-1">
                      <Clock className="w-3 h-3" />
                      {post.readTime}
                    </span>
                  </div>
                  <CardTitle className="text-lg font-display group-hover:text-brand-tiffany transition-colors line-clamp-2">
                    <Link to={`/blog/${post.slug}`}>{post.title}</Link>
                  </CardTitle>
                </CardHeader>

                <CardContent>
                  <CardDescription className="line-clamp-2 mb-4">
                    {post.excerpt}
                  </CardDescription>
                  <div className="flex items-center justify-between">
                    <span className="text-sm text-muted-foreground">{post.date}</span>
                    <Button asChild variant="ghost" size="sm" className="text-primary hover:text-brand-tiffany">
                      <Link to={`/blog/${post.slug}`}>
                        Ler mais
                        <ArrowRight className="w-3 h-3 ml-1 transition-transform group-hover:translate-x-1" />
                      </Link>
                    </Button>
                  </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
