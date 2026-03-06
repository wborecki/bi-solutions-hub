import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter, Facebook } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { motion } from "framer-motion";

const postsData: Record<string, {
  title: string;
  excerpt: string;
  category: string;
  date: string;
  readTime: string;
  content: string[];
}> = {
  "bi-escritorio-juridico": {
    title: "Como o Business Intelligence pode transformar seu escritório jurídico",
    excerpt: "Descubra como dashboards e relatórios automatizados podem otimizar a gestão do seu escritório e melhorar a tomada de decisões estratégicas com base em dados confiáveis.",
    category: "Business Intelligence",
    date: "15 Janeiro 2025",
    readTime: "5 min",
    content: [
      "O mercado jurídico está em constante evolução, e a adoção de tecnologias de Business Intelligence (BI) tem se mostrado um diferencial competitivo crucial para escritórios que buscam excelência operacional.",
      "Os dashboards interativos permitem que gestores visualizem em tempo real métricas importantes como: volume de processos, taxa de sucesso, tempo médio de tramitação e produtividade da equipe. Essa visibilidade é fundamental para identificar gargalos e oportunidades de melhoria.",
      "Além da visualização de dados, o BI possibilita a automatização de relatórios periódicos, eliminando horas de trabalho manual e garantindo que informações críticas cheguem aos tomadores de decisão no momento certo.",
      "A integração de dados de diferentes fontes — sistemas de gestão processual, financeiro e de relacionamento — cria uma visão unificada do negócio, permitindo análises mais completas e estratégicas.",
      "Escritórios que já implementaram soluções de BI reportam melhorias significativas na eficiência operacional, com reduções de até 40% no tempo gasto em tarefas administrativas e aumento na satisfação dos clientes.",
    ],
  },
  "jurimetria-futuro-advocacia": {
    title: "Jurimetria: O futuro da advocacia baseada em dados",
    excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos processuais.",
    category: "Jurimetria",
    date: "10 Janeiro 2025",
    readTime: "7 min",
    content: [
      "A Jurimetria representa uma revolução na forma como o Direito é praticado, aplicando métodos estatísticos e científicos para análise de decisões judiciais e previsão de resultados processuais.",
      "Com a análise de milhares de decisões, é possível identificar padrões de julgamento por tribunal, turma e até mesmo por magistrado específico. Essas informações são valiosas para definir estratégias processuais mais eficazes.",
      "Um dos principais benefícios da Jurimetria é a capacidade de calcular probabilidades de sucesso em diferentes cenários. Isso permite que advogados orientem seus clientes com maior precisão sobre riscos e expectativas.",
      "A gestão de provisionamento também é beneficiada: com análises mais precisas, empresas podem ajustar suas reservas financeiras para contingências jurídicas.",
      "No contexto trabalhista, análises jurimétricas podem revelar tendências específicas, permitindo estratégias mais direcionadas na defesa.",
      "A adoção da Jurimetria está crescendo rapidamente, e escritórios que não se adaptarem correm o risco de ficar para trás em um mercado cada vez mais orientado por dados.",
    ],
  },
  "automacao-juridica-robos": {
    title: "Automação jurídica: Robôs que economizam tempo",
    excerpt: "Conheça as vantagens de automatizar consultas processuais e o impacto na produtividade da equipe jurídica.",
    category: "Automação",
    date: "5 Janeiro 2025",
    readTime: "4 min",
    content: [
      "A automação de processos repetitivos através de robôs jurídicos está transformando a rotina de escritórios de advocacia e departamentos jurídicos em todo o Brasil.",
      "Consultas em tribunais que antes demandavam horas de trabalho manual agora são realizadas automaticamente, 24 horas por dia, 7 dias por semana.",
      "Os robôs podem ser configurados para realizar diversas tarefas: consultas de processos, download de documentos, monitoramento de publicações em diários oficiais e muito mais.",
      "Um dos principais benefícios é a redução drástica de erros humanos. Tarefas repetitivas são propensas a falhas, e a automação elimina esse risco ao mesmo tempo que libera profissionais para atividades de maior valor.",
      "A implementação de robôs jurídicos pode resultar em economia de até 80% do tempo gasto em atividades operacionais.",
    ],
  },
  "power-bi-vs-tableau": {
    title: "Power BI vs Tableau: Qual a melhor ferramenta?",
    excerpt: "Uma análise comparativa das principais ferramentas de visualização de dados do mercado.",
    category: "Business Intelligence",
    date: "28 Dezembro 2024",
    readTime: "6 min",
    content: [
      "Escolher a ferramenta certa de Business Intelligence pode ser desafiador, especialmente quando as opções incluem gigantes como Power BI e Tableau.",
      "O Power BI, desenvolvido pela Microsoft, oferece excelente integração com o ecossistema Office 365 e tem um modelo de precificação acessível.",
      "Já o Tableau é reconhecido por suas capacidades avançadas de visualização e flexibilidade, sendo preferido por analistas que precisam criar dashboards altamente customizados.",
      "Para escritórios jurídicos e empresas de médio porte, o Power BI frequentemente oferece o melhor custo-benefício.",
      "A decisão final deve considerar: infraestrutura existente, necessidades de visualização, orçamento e expertise da equipe.",
    ],
  },
  "tendencias-bi-2025": {
    title: "Tendências de BI para 2025: O que esperar",
    excerpt: "As principais tendências em Business Intelligence e análise de dados para o próximo ano.",
    category: "Tendências",
    date: "20 Dezembro 2024",
    readTime: "8 min",
    content: [
      "O ano de 2025 promete ser marcante para o Business Intelligence, com avanços significativos em inteligência artificial transformando a forma como analisamos dados.",
      "A democratização do BI continua em ritmo acelerado, com ferramentas cada vez mais acessíveis permitindo que profissionais sem background técnico criem suas próprias análises.",
      "A integração de IA generativa com plataformas de BI permite consultas em linguagem natural, tornando a análise de dados mais intuitiva.",
      "No setor jurídico, a combinação de Jurimetria com modelos de machine learning promete previsões ainda mais precisas sobre resultados processuais.",
      "A segurança de dados ganha protagonismo, com regulamentações mais rígidas exigindo controles robustos sobre informações sensíveis.",
      "Real-time analytics se torna padrão, com dashboards que atualizam instantaneamente.",
    ],
  },
  "etl-o-que-e": {
    title: "ETL: O que é e por que sua empresa precisa",
    excerpt: "O processo de Extração, Transformação e Carga de dados e sua importância para o BI.",
    category: "Business Intelligence",
    date: "15 Dezembro 2024",
    readTime: "5 min",
    content: [
      "ETL — Extração, Transformação e Carga — é o processo fundamental que permite consolidar dados de múltiplas fontes em um repositório unificado para análise.",
      "A etapa de Extração envolve coletar dados de diferentes sistemas: ERPs, CRMs, sistemas jurídicos, planilhas e bancos de dados diversos.",
      "Na Transformação, os dados são limpos, padronizados e enriquecidos. É nessa fase que inconsistências são corrigidas e regras de negócio são aplicadas.",
      "A Carga finaliza o processo, inserindo os dados transformados em um data warehouse onde estarão disponíveis para consultas e análises.",
      "Sem um processo de ETL bem estruturado, análises de BI podem ser comprometidas por dados inconsistentes, levando a decisões equivocadas.",
      "Investir em uma infraestrutura de dados sólida é o primeiro passo para qualquer iniciativa de BI bem-sucedida.",
    ],
  },
};

const BlogPost = () => {
  const { slug } = useParams<{ slug: string }>();
  const post = slug ? postsData[slug] : null;

  if (!post) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Artigo não encontrado</h1>
            <Button asChild>
              <Link to="/blog">Voltar para o Blog</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const shareUrl = typeof window !== "undefined" ? window.location.href : "";

  return (
    <Layout>
      <SEO
        title={post.title}
        description={post.excerpt}
        canonical={`/blog/${slug}`}
        type="article"
        jsonLd={{
          "@context": "https://schema.org",
          "@type": "Article",
          "headline": post.title,
          "description": post.excerpt,
          "datePublished": post.date,
          "publisher": { "@type": "Organization", "name": "Solutions in BI" },
        }}
      />
      {/* Header */}
      <section className="pt-28 md:pt-36 pb-12 bg-background">
        <div className="container mx-auto px-4">
          <div className="max-w-2xl mx-auto">
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.5 }}
            >
              <Link
                to="/blog"
                className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-8 transition-colors"
              >
                <ArrowLeft className="w-4 h-4" />
                Blog
              </Link>

              <div className="flex items-center gap-3 mb-6">
                <span className="inline-flex items-center rounded-full border px-2.5 py-0.5 text-xs font-semibold text-foreground">
                  {post.category}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Calendar className="w-3.5 h-3.5" />
                  {post.date}
                </span>
                <span className="flex items-center gap-1 text-sm text-muted-foreground">
                  <Clock className="w-3.5 h-3.5" />
                  {post.readTime}
                </span>
              </div>

              <h1 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-6 leading-tight">
                {post.title}
              </h1>

              <p className="text-lg text-muted-foreground leading-relaxed">
                {post.excerpt}
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Divider */}
      <div className="container mx-auto px-4">
        <div className="max-w-2xl mx-auto border-t border-border" />
      </div>

      {/* Content */}
      <section className="py-12">
        <div className="container mx-auto px-4">
          <motion.div
            className="max-w-2xl mx-auto"
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ duration: 0.5, delay: 0.2 }}
          >
            <article className="space-y-6">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-foreground leading-[1.8] text-[16px]">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Share */}
            <div className="border-t border-border pt-8 mt-16">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium text-muted-foreground">
                  <Share2 className="w-4 h-4" />
                  Compartilhar
                </span>
                <div className="flex gap-2">
                  {[
                    { icon: Linkedin, url: `https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}` },
                    { icon: Twitter, url: `https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}` },
                    { icon: Facebook, url: `https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}` },
                  ].map(({ icon: Icon, url }) => (
                    <a
                      key={url}
                      href={url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="w-9 h-9 rounded-full border border-border flex items-center justify-center text-muted-foreground hover:text-primary hover:border-primary transition-colors"
                    >
                      <Icon className="w-4 h-4" />
                    </a>
                  ))}
                </div>
              </div>
            </div>

            {/* Back */}
            <div className="mt-8">
              <Button asChild variant="outline" size="sm">
                <Link to="/blog">
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  Todos os artigos
                </Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default BlogPost;
