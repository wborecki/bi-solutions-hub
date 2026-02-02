import { Link } from "react-router-dom";
import { ArrowRight, Star, Clock } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";

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
  },
];

export function BlogSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
          <div>
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              Blog
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Artigos e insights
            </h2>
            <p className="text-lg text-muted-foreground mt-2">
              Conteúdo especializado sobre BI, Jurimetria e tecnologia.
            </p>
          </div>
          <Button asChild variant="outline">
            <Link to="/blog">
              Ver todos os artigos
              <ArrowRight className="w-4 h-4 ml-2" />
            </Link>
          </Button>
        </div>

        {/* Posts Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {featuredPosts.map((post, index) => (
            <Card
              key={post.id}
              className="group overflow-hidden border hover:shadow-lg transition-all duration-300 hover:-translate-y-1"
            >
              {/* Image placeholder */}
              <div className="aspect-video bg-gradient-to-br from-primary/20 to-secondary/20 relative overflow-hidden">
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="w-16 h-16 rounded-xl bg-primary/10 flex items-center justify-center">
                    <span className="font-display font-bold text-2xl text-primary">SBI</span>
                  </div>
                </div>
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
  );
}
