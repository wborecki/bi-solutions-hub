import { useParams, Link } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Clock, Calendar, Share2, Linkedin, Twitter, Facebook } from "lucide-react";
import { CTASection } from "@/components/home/CTASection";

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
    excerpt: "Entenda como a análise estatística de dados jurídicos pode prever resultados e reduzir riscos processuais, trazendo mais previsibilidade para sua estratégia.",
    category: "Jurimetria",
    date: "10 Janeiro 2025",
    readTime: "7 min",
    content: [
      "A Jurimetria representa uma revolução na forma como o Direito é praticado, aplicando métodos estatísticos e científicos para análise de decisões judiciais e previsão de resultados processuais.",
      "Com a análise de milhares de decisões, é possível identificar padrões de julgamento por tribunal, turma e até mesmo por magistrado específico. Essas informações são valiosas para definir estratégias processuais mais eficazes.",
      "Um dos principais benefícios da Jurimetria é a capacidade de calcular probabilidades de sucesso em diferentes cenários. Isso permite que advogados orientem seus clientes com maior precisão sobre riscos e expectativas.",
      "A gestão de provisionamento também é beneficiada: com análises mais precisas, empresas podem ajustar suas reservas financeiras para contingências jurídicas, evitando tanto subdimensionamentos quanto excessos.",
      "No contexto trabalhista, por exemplo, análises jurimétricas podem revelar tendências específicas como a aplicação da Súmula 331 do TST, permitindo estratégias mais direcionadas na defesa.",
      "A adoção da Jurimetria está crescendo rapidamente, e escritórios que não se adaptarem a essa nova realidade correm o risco de ficar para trás em um mercado cada vez mais competitivo e orientado por dados.",
    ],
  },
  "automacao-juridica-robos": {
    title: "Automação jurídica: Robôs que economizam tempo",
    excerpt: "Conheça as vantagens de automatizar consultas processuais e como isso impacta positivamente a produtividade da equipe jurídica.",
    category: "Automação",
    date: "5 Janeiro 2025",
    readTime: "4 min",
    content: [
      "A automação de processos repetitivos através de robôs jurídicos está transformando a rotina de escritórios de advocacia e departamentos jurídicos em todo o Brasil.",
      "Consultas em tribunais que antes demandavam horas de trabalho manual agora são realizadas automaticamente, 24 horas por dia, 7 dias por semana, garantindo que nenhuma movimentação processual passe despercebida.",
      "Os robôs podem ser configurados para realizar diversas tarefas: consultas de processos, download de documentos, monitoramento de publicações em diários oficiais e muito mais.",
      "Um dos principais benefícios é a redução drástica de erros humanos. Tarefas repetitivas são propensas a falhas, e a automação elimina esse risco ao mesmo tempo que libera profissionais para atividades de maior valor agregado.",
      "A implementação de robôs jurídicos pode resultar em economia de até 80% do tempo gasto em atividades operacionais, permitindo que equipes foquem no que realmente importa: a estratégia jurídica.",
    ],
  },
  "power-bi-vs-tableau": {
    title: "Power BI vs Tableau: Qual a melhor ferramenta para você?",
    excerpt: "Uma análise comparativa das principais ferramentas de visualização de dados do mercado e como escolher a ideal para seu negócio.",
    category: "Business Intelligence",
    date: "28 Dezembro 2024",
    readTime: "6 min",
    content: [
      "Escolher a ferramenta certa de Business Intelligence pode ser desafiador, especialmente quando as opções incluem gigantes como Power BI e Tableau.",
      "O Power BI, desenvolvido pela Microsoft, oferece excelente integração com o ecossistema Office 365 e tem um modelo de precificação acessível, especialmente para empresas que já utilizam produtos Microsoft.",
      "Já o Tableau é reconhecido por suas capacidades avançadas de visualização e flexibilidade, sendo preferido por analistas que precisam criar dashboards complexos e altamente customizados.",
      "Para escritórios jurídicos e empresas de médio porte, o Power BI frequentemente oferece o melhor custo-benefício, com recursos robustos suficientes para a maioria das necessidades de análise.",
      "A decisão final deve considerar fatores como: infraestrutura existente, necessidades específicas de visualização, orçamento disponível e expertise da equipe.",
    ],
  },
  "tendencias-bi-2025": {
    title: "Tendências de BI para 2025: O que esperar",
    excerpt: "As principais tendências em Business Intelligence e análise de dados que devem impactar o mercado jurídico e corporativo no próximo ano.",
    category: "Tendências",
    date: "20 Dezembro 2024",
    readTime: "8 min",
    content: [
      "O ano de 2025 promete ser marcante para o Business Intelligence, com avanços significativos em inteligência artificial e automação transformando a forma como analisamos dados.",
      "A democratização do BI continua em ritmo acelerado, com ferramentas cada vez mais acessíveis permitindo que profissionais sem background técnico criem suas próprias análises.",
      "A integração de IA generativa com plataformas de BI permite consultas em linguagem natural, tornando a análise de dados mais intuitiva e acessível para todos os níveis da organização.",
      "No setor jurídico, a combinação de Jurimetria com modelos de machine learning promete previsões ainda mais precisas sobre resultados processuais.",
      "A segurança de dados ganha protagonismo, com regulamentações mais rígidas exigindo que empresas implementem controles robustos sobre suas informações sensíveis.",
      "Real-time analytics se torna padrão, com dashboards que atualizam instantaneamente permitindo respostas mais ágeis a mudanças no ambiente de negócios.",
    ],
  },
  "etl-o-que-e": {
    title: "ETL: O que é e por que sua empresa precisa",
    excerpt: "Entenda o processo de Extração, Transformação e Carga de dados e como ele é fundamental para uma boa estratégia de BI.",
    category: "Business Intelligence",
    date: "15 Dezembro 2024",
    readTime: "5 min",
    content: [
      "ETL — Extração, Transformação e Carga — é o processo fundamental que permite consolidar dados de múltiplas fontes em um repositório unificado para análise.",
      "A etapa de Extração envolve coletar dados de diferentes sistemas: ERPs, CRMs, sistemas jurídicos, planilhas e bancos de dados diversos.",
      "Na Transformação, os dados são limpos, padronizados e enriquecidos. É nessa fase que inconsistências são corrigidas e regras de negócio são aplicadas.",
      "A Carga finaliza o processo, inserindo os dados transformados em um data warehouse onde estarão disponíveis para consultas e análises.",
      "Sem um processo de ETL bem estruturado, análises de BI podem ser comprometidas por dados inconsistentes ou incompletos, levando a decisões equivocadas.",
      "Investir em uma infraestrutura de dados sólida é o primeiro passo para qualquer iniciativa de Business Intelligence bem-sucedida.",
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
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <Link
              to="/blog"
              className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
            >
              <ArrowLeft className="w-4 h-4" />
              Voltar para o Blog
            </Link>

            <div className="flex items-center gap-4 mb-6">
              <Badge>{post.category}</Badge>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Calendar className="w-4 h-4" />
                {post.date}
              </span>
              <span className="flex items-center gap-1 text-sm text-muted-foreground">
                <Clock className="w-4 h-4" />
                {post.readTime} de leitura
              </span>
            </div>

            <h1 className="text-3xl md:text-4xl lg:text-5xl font-display font-bold text-primary-dark mb-6 leading-tight">
              {post.title}
            </h1>

            <p className="text-xl text-muted-foreground leading-relaxed">
              {post.excerpt}
            </p>
          </div>
        </div>
      </section>

      {/* Content */}
      <section className="py-16">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto">
            <article className="prose prose-lg max-w-none">
              {post.content.map((paragraph, index) => (
                <p key={index} className="text-foreground leading-relaxed mb-6">
                  {paragraph}
                </p>
              ))}
            </article>

            {/* Share */}
            <div className="border-t pt-8 mt-12">
              <div className="flex items-center gap-4">
                <span className="flex items-center gap-2 text-sm font-medium">
                  <Share2 className="w-4 h-4" />
                  Compartilhar:
                </span>
                <div className="flex gap-2">
                  <a
                    href={`https://www.linkedin.com/shareArticle?mini=true&url=${encodeURIComponent(shareUrl)}&title=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Linkedin className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://twitter.com/intent/tweet?url=${encodeURIComponent(shareUrl)}&text=${encodeURIComponent(post.title)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Twitter className="w-4 h-4" />
                  </a>
                  <a
                    href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(shareUrl)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="w-10 h-10 rounded-full bg-muted flex items-center justify-center hover:bg-primary hover:text-white transition-colors"
                  >
                    <Facebook className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default BlogPost;
