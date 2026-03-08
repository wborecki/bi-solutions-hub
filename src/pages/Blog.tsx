import { useState, useMemo } from "react";
import { Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Input } from "@/components/ui/input";
import { ArrowRight, Clock, Search, ChevronLeft, ChevronRight } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

import blogBi from "@/assets/blog-il-bi.png";
import blogJurimetria from "@/assets/blog-il-jurimetria.png";
import blogAutomacao from "@/assets/blog-il-automacao.png";
import blogIntegracoes from "@/assets/blog-il-integracoes.png";
import blogColeta from "@/assets/blog-il-coleta.png";
import blogTendencias from "@/assets/blog-il-tendencias.png";
import blogMentoria from "@/assets/blog-il-mentoria.png";
import blogEtl from "@/assets/blog-il-etl.png";
import blogPowerBiTableau from "@/assets/blog-power-bi-tableau.png";
import blogKpis from "@/assets/blog-kpis.png";
import blogDashboardProd from "@/assets/blog-dashboard-prod.png";
import blogProvisionamento from "@/assets/blog-provisionamento.png";
import blogTrabalhista from "@/assets/blog-trabalhista.png";
import blogCivel from "@/assets/blog-civel.png";
import blog5processos from "@/assets/blog-5processos.png";
import blogFluxosEmail from "@/assets/blog-fluxos-email.png";
import blogRoi from "@/assets/blog-roi.png";
import blogApis from "@/assets/blog-apis.png";
import blogDadosPublicos from "@/assets/blog-dados-publicos.png";
import blogAprenderPbi from "@/assets/blog-aprender-pbi.png";
import blogDax from "@/assets/blog-dax.png";
import blogIaJuridico from "@/assets/blog-ia-juridico.png";
import blogFuturoGestao from "@/assets/blog-futuro-gestao.png";
import blogTransformacao from "@/assets/blog-transformacao.png";

const categories = ["Todos", "Business Intelligence", "Jurimetria", "Automação", "Integrações", "Coleta de Dados", "Mentoria", "Tendências"];

const posts = [
  // BI
  { id: 1, title: "Como o Business Intelligence pode transformar seu escritório jurídico", excerpt: "Descubra como dashboards e relatórios automatizados podem otimizar a gestão do seu escritório.", category: "Business Intelligence", date: "15 Jan 2025", readTime: "5 min", featured: true, slug: "bi-escritorio-juridico", image: blogBi },
  { id: 4, title: "Power BI vs Tableau: Qual a melhor ferramenta?", excerpt: "Análise comparativa das principais ferramentas de visualização de dados do mercado.", category: "Business Intelligence", date: "28 Dez 2024", readTime: "6 min", featured: false, slug: "power-bi-vs-tableau", image: blogPowerBiTableau },
  { id: 6, title: "ETL: O que é e por que sua empresa precisa", excerpt: "O processo de Extração, Transformação e Carga de dados e sua importância para o BI.", category: "Business Intelligence", date: "15 Dez 2024", readTime: "5 min", featured: false, slug: "etl-o-que-e", image: blogEtl },
  { id: 7, title: "KPIs jurídicos: Os indicadores que todo escritório deve acompanhar", excerpt: "Conheça os indicadores de desempenho mais importantes para a gestão jurídica eficiente.", category: "Business Intelligence", date: "10 Dez 2024", readTime: "6 min", featured: false, slug: "kpis-juridicos", image: blogKpis },
  { id: 8, title: "Dashboard de produtividade: Como medir o desempenho da equipe", excerpt: "Aprenda a criar dashboards que medem a produtividade e identificam gargalos operacionais.", category: "Business Intelligence", date: "5 Dez 2024", readTime: "5 min", featured: false, slug: "dashboard-produtividade", image: blogDashboardProd },
  
  // Jurimetria
  { id: 2, title: "Jurimetria: O futuro da advocacia baseada em dados", excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos.", category: "Jurimetria", date: "10 Jan 2025", readTime: "7 min", featured: true, slug: "jurimetria-futuro-advocacia", image: blogJurimetria },
  { id: 9, title: "Como a jurimetria ajuda na gestão de provisionamento", excerpt: "Descubra como análises estatísticas melhoram a precisão do provisionamento jurídico.", category: "Jurimetria", date: "1 Dez 2024", readTime: "6 min", featured: false, slug: "jurimetria-provisionamento", image: blogProvisionamento },
  { id: 10, title: "Análise jurimétrica trabalhista: Tendências e padrões", excerpt: "Como identificar padrões em decisões trabalhistas e usar dados para estratégia processual.", category: "Jurimetria", date: "25 Nov 2024", readTime: "7 min", featured: false, slug: "jurimetria-trabalhista", image: blogTrabalhista },
  { id: 11, title: "Jurimetria no contencioso cível: Guia prático", excerpt: "Aplicações práticas da jurimetria para casos cíveis e como calcular probabilidades de sucesso.", category: "Jurimetria", date: "20 Nov 2024", readTime: "8 min", featured: false, slug: "jurimetria-civel", image: blogCivel },
  
  // Automação
  { id: 3, title: "Automação jurídica: Robôs que economizam tempo", excerpt: "Conheça as vantagens de automatizar consultas processuais e o impacto na produtividade.", category: "Automação", date: "5 Jan 2025", readTime: "4 min", featured: false, slug: "automacao-juridica-robos", image: blogAutomacao },
  { id: 12, title: "5 processos jurídicos que você deveria automatizar hoje", excerpt: "Identifique quais tarefas repetitivas do seu escritório podem ser automatizadas imediatamente.", category: "Automação", date: "15 Nov 2024", readTime: "5 min", featured: true, slug: "5-processos-automatizar", image: blog5processos },
  { id: 13, title: "Automação de fluxos: Do e-mail ao sistema jurídico", excerpt: "Como criar fluxos automatizados que conectam e-mail, CRM e sistemas de gestão processual.", category: "Automação", date: "10 Nov 2024", readTime: "6 min", featured: false, slug: "automacao-fluxos-email", image: blogFluxosEmail },
  { id: 14, title: "ROI da automação: Como calcular o retorno do investimento", excerpt: "Metodologia prática para calcular quanto a automação pode economizar no seu escritório.", category: "Automação", date: "5 Nov 2024", readTime: "5 min", featured: false, slug: "roi-automacao", image: blogRoi },
  
  // Integrações
  { id: 15, title: "Integração de sistemas: Eliminando silos de dados", excerpt: "Como conectar seus sistemas e criar um ecossistema integrado de informações.", category: "Integrações", date: "1 Nov 2024", readTime: "5 min", featured: false, slug: "integracao-sistemas-silos", image: blogIntegracoes },
  { id: 16, title: "APIs no jurídico: Conectando sistemas de tribunais", excerpt: "Entenda como APIs permitem integrar dados de tribunais diretamente aos seus sistemas.", category: "Integrações", date: "25 Out 2024", readTime: "6 min", featured: false, slug: "apis-juridico-tribunais", image: blogApis },
  
  // Coleta de Dados
  { id: 17, title: "Coleta de dados jurídicos: Fontes e estratégias", excerpt: "Conheça as principais fontes de dados públicos e como utilizá-las para alimentar suas análises.", category: "Coleta de Dados", date: "20 Out 2024", readTime: "7 min", featured: false, slug: "coleta-dados-juridicos", image: blogColeta },
  { id: 18, title: "Dados públicos: Como aproveitar informações de portais governamentais", excerpt: "Guia completo sobre como acessar e utilizar dados de portais como DataJud e e-SAJ.", category: "Coleta de Dados", date: "15 Out 2024", readTime: "6 min", featured: false, slug: "dados-publicos-portais", image: blogDadosPublicos },
  
  // Mentoria
  { id: 19, title: "Por que aprender Power BI em 2025?", excerpt: "Os motivos pelos quais dominar Power BI é essencial para profissionais do mercado jurídico.", category: "Mentoria", date: "10 Out 2024", readTime: "4 min", featured: false, slug: "aprender-power-bi-2025", image: blogAprenderPbi },
  { id: 20, title: "DAX para iniciantes: As 10 fórmulas essenciais", excerpt: "Aprenda as fórmulas DAX mais usadas para criar dashboards profissionais no Power BI.", category: "Mentoria", date: "5 Out 2024", readTime: "8 min", featured: false, slug: "dax-iniciantes-formulas", image: blogDax },
  
  // Tendências
  { id: 5, title: "Tendências de BI para 2025: O que esperar", excerpt: "Principais tendências em BI e análise de dados para o mercado jurídico e corporativo.", category: "Tendências", date: "20 Dez 2024", readTime: "8 min", featured: true, slug: "tendencias-bi-2025", image: blogTendencias },
  { id: 21, title: "IA no jurídico: O que muda na prática advocatícia", excerpt: "Como a inteligência artificial está transformando o dia a dia dos escritórios de advocacia.", category: "Tendências", date: "1 Out 2024", readTime: "7 min", featured: false, slug: "ia-juridico-mudancas", image: blogIaJuridico },
  { id: 22, title: "O futuro da gestão jurídica: Dados, automação e IA", excerpt: "Uma visão sobre como tecnologia e dados estão redesenhando a gestão de escritórios.", category: "Tendências", date: "25 Set 2024", readTime: "6 min", featured: false, slug: "futuro-gestao-juridica", image: blogFuturoGestao },
  { id: 23, title: "Transformação digital no jurídico: Por onde começar", excerpt: "Um guia prático para iniciar a transformação digital do seu escritório ou departamento.", category: "Tendências", date: "20 Set 2024", readTime: "5 min", featured: false, slug: "transformacao-digital-juridico", image: blogTransformacao },
];

const POSTS_PER_PAGE = 9;

const BlogCard = ({ post, index, inView }: { post: typeof posts[0]; index: number; inView: boolean }) => (
  <motion.article
    className="h-full"
    initial={{ opacity: 0, y: 20 }}
    animate={inView ? { opacity: 1, y: 0 } : {}}
    transition={{ duration: 0.4, delay: index * 0.08 }}
  >
    <Link
      to={`/blog/${post.slug}`}
      className="group flex flex-col h-full rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300"
    >
      <div className="aspect-[16/10] overflow-hidden relative shrink-0">
        <div className="absolute inset-0 bg-muted animate-pulse" />
        <img
          src={post.image}
          alt={post.title}
          loading="lazy"
          onLoad={(e) => {
            const prev = e.currentTarget.previousElementSibling as HTMLElement;
            if (prev) prev.style.display = 'none';
          }}
          className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500 relative z-[1]"
        />
      </div>
      <div className="p-6 flex flex-col flex-1 space-y-3">
        <div className="flex items-center gap-3">
          <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
            {post.category}
          </span>
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="w-3 h-3" />
            {post.readTime}
          </span>
        </div>
        <h3 className="text-lg font-display font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2 leading-snug">
          {post.title}
        </h3>
        <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed flex-1">
          {post.excerpt}
        </p>
        <div className="flex items-center justify-between pt-2 mt-auto">
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
  const [currentPage, setCurrentPage] = useState(1);
  const postsRef = useRef(null);
  const postsInView = useInView(postsRef, { once: true, margin: "-60px" });

  const filteredPosts = useMemo(() => {
    return posts.filter((post) => {
      const matchesCategory = selectedCategory === "Todos" || post.category === selectedCategory;
      const matchesSearch =
        post.title.toLowerCase().includes(searchQuery.toLowerCase()) ||
        post.excerpt.toLowerCase().includes(searchQuery.toLowerCase());
      return matchesCategory && matchesSearch;
    });
  }, [selectedCategory, searchQuery]);

  const totalPages = Math.ceil(filteredPosts.length / POSTS_PER_PAGE);
  const paginatedPosts = filteredPosts.slice(
    (currentPage - 1) * POSTS_PER_PAGE,
    currentPage * POSTS_PER_PAGE
  );

  const handleCategoryChange = (category: string) => {
    setSelectedCategory(category);
    setCurrentPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearchQuery(value);
    setCurrentPage(1);
  };

  return (
    <Layout>
      <SEO
        title="Blog - Artigos sobre BI, Jurimetria e Automação"
        description="Leia artigos e insights sobre Business Intelligence, jurimetria, automação de processos e tendências do mercado jurídico."
        canonical="/blog"
      />
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 bg-background relative overflow-hidden">
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
                  onClick={() => handleCategoryChange(category)}
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
                onChange={(e) => handleSearchChange(e.target.value)}
                className="pl-10 h-9"
              />
            </div>
          </div>
        </div>
      </section>

      {/* Posts */}
      <section className="py-16" ref={postsRef}>
        <div className="container mx-auto px-4">
          {paginatedPosts.length > 0 ? (
            <>
              <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
                {paginatedPosts.map((post, index) => (
                  <BlogCard key={post.id} post={post} index={index} inView={postsInView} />
                ))}
              </div>

              {/* Pagination */}
              {totalPages > 1 && (
                <motion.div
                  className="flex items-center justify-center gap-2 mt-12"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.3 }}
                >
                  <button
                    onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
                    disabled={currentPage === 1}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronLeft className="w-4 h-4" />
                  </button>

                  {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
                    <button
                      key={page}
                      onClick={() => setCurrentPage(page)}
                      className={`w-10 h-10 rounded-lg text-sm font-semibold transition-colors ${
                        currentPage === page
                          ? "bg-primary text-primary-foreground"
                          : "border border-border text-muted-foreground hover:text-foreground hover:bg-muted"
                      }`}
                    >
                      {page}
                    </button>
                  ))}

                  <button
                    onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
                    disabled={currentPage === totalPages}
                    className="w-10 h-10 rounded-lg border border-border flex items-center justify-center text-muted-foreground hover:text-foreground hover:bg-muted transition-colors disabled:opacity-30 disabled:cursor-not-allowed"
                  >
                    <ChevronRight className="w-4 h-4" />
                  </button>
                </motion.div>
              )}

              <p className="text-center text-sm text-muted-foreground mt-4">
                Mostrando {(currentPage - 1) * POSTS_PER_PAGE + 1}-{Math.min(currentPage * POSTS_PER_PAGE, filteredPosts.length)} de {filteredPosts.length} artigos
              </p>
            </>
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
