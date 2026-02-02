import { useState } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { ArrowRight, Clock, Star, Search } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";

const categories = ["Todos", "Business Intelligence", "Jurimetria", "Automação", "Tendências"];

const posts = [
  {
    id: 1,
    title: "Como o Business Intelligence pode transformar seu escritório jurídico",
    excerpt: "Descubra como dashboards e relatórios automatizados podem otimizar a gestão do seu escritório e melhorar a tomada de decisões estratégicas com base em dados confiáveis.",
    category: "Business Intelligence",
    date: "15 Jan 2025",
    readTime: "5 min",
    featured: true,
    slug: "bi-escritorio-juridico",
  },
  {
    id: 2,
    title: "Jurimetria: O futuro da advocacia baseada em dados",
    excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos processuais, trazendo mais previsibilidade para sua estratégia.",
    category: "Jurimetria",
    date: "10 Jan 2025",
    readTime: "7 min",
    featured: true,
    slug: "jurimetria-futuro-advocacia",
  },
  {
    id: 3,
    title: "Automação jurídica: Robôs que economizam tempo",
    excerpt: "Conheça as vantagens de automatizar consultas processuais e como isso impacta positivamente a produtividade da equipe jurídica.",
    category: "Automação",
    date: "5 Jan 2025",
    readTime: "4 min",
    featured: false,
    slug: "automacao-juridica-robos",
  },
  {
    id: 4,
    title: "Power BI vs Tableau: Qual a melhor ferramenta para você?",
    excerpt: "Uma análise comparativa das principais ferramentas de visualização de dados do mercado e como escolher a ideal para seu negócio.",
    category: "Business Intelligence",
    date: "28 Dez 2024",
    readTime: "6 min",
    featured: false,
    slug: "power-bi-vs-tableau",
  },
  {
    id: 5,
    title: "Tendências de BI para 2025: O que esperar",
    excerpt: "As principais tendências em Business Intelligence e análise de dados que devem impactar o mercado jurídico e corporativo no próximo ano.",
    category: "Tendências",
    date: "20 Dez 2024",
    readTime: "8 min",
    featured: true,
    slug: "tendencias-bi-2025",
  },
  {
    id: 6,
    title: "ETL: O que é e por que sua empresa precisa",
    excerpt: "Entenda o processo de Extração, Transformação e Carga de dados e como ele é fundamental para uma boa estratégia de BI.",
    category: "Business Intelligence",
    date: "15 Dez 2024",
    readTime: "5 min",
    featured: false,
    slug: "etl-o-que-e",
  },
];

const Blog = () => {
  const [selectedCategory, setSelectedCategory] = useState("Todos");
  const [searchQuery, setSearchQuery] = useState("");

  const filteredPosts = posts.filter((post) => {
    const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
    const matchesSearch = post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
                          post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
    return matchesCategory && matchesSearch;
  });

  const featuredPosts = filteredPosts.filter((post) => post.featured);
  const regularPosts = filteredPosts.filter((post) => !post.featured);

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              Blog
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Artigos e{" "}
              <span className="text-gradient">insights</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Conteúdo especializado sobre Business Intelligence, Jurimetria, 
              automação e tecnologia para o mercado jurídico e corporativo.
            </p>
          </div>
        </div>
      </section>

      {/* Filters */}
      <section className="py-8 border-b">
        <div className="container mx-auto px-4">
          <div className="flex flex-col md:flex-row gap-4 justify-between items-start md:items-center">
            {/* Categories */}
            <div className="flex flex-wrap gap-2">
              {categories.map((category) => (
                <button
                  key={category}
                  onClick={() => setSelectedCategory(category)}
                  className={`px-4 py-2 rounded-full text-sm font-medium transition-colors ${
                    selectedCategory === category
                      ? "bg-primary text-primary-foreground"
                      : "bg-muted text-muted-foreground hover:bg-muted/80"
                  }`}
                >
                  {category}
                </button>
              ))}
            </div>

            {/* Search */}
            <div className="relative w-full md:w-64">
              <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-muted-foreground" />
              <Input
                placeholder="Buscar artigos..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                className="pl-10"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Featured Posts */}
      {featuredPosts.length > 0 && (
        <section className="py-12">
          <div className="container mx-auto px-4">
            <div className="flex items-center gap-2 mb-8">
              <Star className="w-5 h-5 text-brand-tiffany" />
              <h2 className="text-xl font-display font-semibold">Destaques</h2>
            </div>
            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {featuredPosts.map((post) => (
                <Card
                  key={post.id}
                  className="group overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                >
                  <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                        <span className="font-display font-bold text-2xl text-primary">SBI</span>
                      </div>
                    </div>
                    <Badge className="absolute top-4 left-4 bg-brand-tiffany text-primary">
                      <Star className="w-3 h-3 mr-1" />
                      Destaque
                    </Badge>
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
                          <ArrowRight className="w-3 h-3 ml-1" />
                        </Link>
                      </Button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>
          </div>
        </section>
      )}

      {/* All Posts */}
      <section className="py-12 bg-muted/30">
        <div className="container mx-auto px-4">
          {regularPosts.length > 0 ? (
            <>
              <h2 className="text-xl font-display font-semibold mb-8">Todos os artigos</h2>
              <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
                {regularPosts.map((post) => (
                  <Card
                    key={post.id}
                    className="group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
                  >
                    <div className="aspect-video bg-gradient-to-br from-muted to-muted/50 relative overflow-hidden">
                      <div className="absolute inset-0 flex items-center justify-center">
                        <div className="w-12 h-12 rounded-lg bg-primary/10 flex items-center justify-center">
                          <span className="font-display font-bold text-xl text-primary">SBI</span>
                        </div>
                      </div>
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
                            <ArrowRight className="w-3 h-3 ml-1" />
                          </Link>
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </>
          ) : (
            <div className="text-center py-12">
              <p className="text-muted-foreground">Nenhum artigo encontrado.</p>
            </div>
          )}
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Blog;
