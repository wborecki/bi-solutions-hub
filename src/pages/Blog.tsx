import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { ArrowRight, Clock, Search } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import blogBi from "@/assets/blog-bi.jpg";
import blogJurimetria from "@/assets/blog-jurimetria.jpg";
import blogAutomacao from "@/assets/blog-automacao.jpg";

const categories = ["Todos", "Business Intelligence", "Jurimetria", "Automação", "Tendências"];

const posts = [
  {
    id: 1,
    title: "Como o Business Intelligence pode transformar seu escritório jurídico",
    excerpt: "Descubra como dashboards e relatórios automatizados podem otimizar a gestão do seu escritório.",
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
    excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos.",
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
    excerpt: "Conheça as vantagens de automatizar consultas processuais e o impacto na produtividade.",
    category: "Automação",
    date: "5 Jan 2025",
    readTime: "4 min",
    featured: false,
    slug: "automacao-juridica-robos",
    image: blogAutomacao,
  },
  {
    id: 4,
    title: "Power BI vs Tableau: Qual a melhor ferramenta?",
    excerpt: "Análise comparativa das principais ferramentas de visualização de dados do mercado.",
    category: "Business Intelligence",
    date: "28 Dez 2024",
    readTime: "6 min",
    featured: false,
    slug: "power-bi-vs-tableau",
    image: blogBi,
  },
  {
    id: 5,
    title: "Tendências de BI para 2025: O que esperar",
    excerpt: "Principais tendências em BI e análise de dados para o mercado jurídico e corporativo.",
    category: "Tendências",
    date: "20 Dez 2024",
    readTime: "8 min",
    featured: true,
    slug: "tendencias-bi-2025",
    image: blogBi,
  },
  {
    id: 6,
    title: "ETL: O que é e por que sua empresa precisa",
    excerpt: "O processo de Extração, Transformação e Carga de dados e sua importância para o BI.",
    category: "Business Intelligence",
    date: "15 Dez 2024",
    readTime: "5 min",
    featured: false,
    slug: "etl-o-que-e",
    image: blogBi,
  },
];

const BlogCard = ({ post, index, inView }: { post: typeof posts[0]; index: number; inView: boolean }) => (
  <motion.article
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  >
    <Link
      to={`/blog/${post.slug}`}
      className="group block rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden">
        <img
          src={post.image}
          alt={post.title}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
        />
      </div>
      <div className="p-6 space-y-3">
        <div className="flex items-center gap-3">
          <Badge variant="outline" className="text-xs font-medium">
            {post.category}
          </Badge>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-2">
          <span className="text-xs text-muted-foreground">{post.date}</span>
          <span className="text-sm text-primary font-medium inline-flex items-center gap-1 group-hover:gap-2 transition-all">
            Ler mais
            <ArrowRight className="w-3.5 h-3.5" />
          </span>
        </div>
      </div>
    </Link>
  </motion.article>
);

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");
  const postsRef = useRef(null);
  const postsInView = useInView(postsRef, { once: true, margin: "-60px" });

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch =
      post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
      post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div
            className="absolute inset-0"
            style={{
              backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
              backgroundSize: "32px 32px",
            }}
          />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-6 leading-tight">
              Artigos e <span className="text-gradient">insights</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              Conteúdo sobre Business Intelligence, Jurimetria, automação e tecnologia
              para o mercado jurídico e corporativo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-6 border-b border-border bg-background sticky top-[60px] z-30">
        <div className="container mx-auto px-4">
          <div className="flex flex-col sm:flex-row gap-4 justify-between items-start sm:items-center">
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:text-foreground"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>
            <div className="relative w-full sm:w-56">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16" ref={postsRef}>
        <div className="container mx-auto px-4">
          {filteredPosts.length > 0 ? (
            <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
              {filteredPosts.map((post, index) => (
                <BlogCard key={post.id} post={post} index={index} inView={postsInView} />
              ))}
            </div>
          ) : (
            <div className="text-center py-20">
              <p className="text-muted-foreground text-lg">Nenhum artigo encontrado.</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Blog;
