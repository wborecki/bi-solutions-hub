import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle, BarChart3, Bot, Scale, Cpu, LayoutDashboard, Plug, MessageSquare, Lightbulb } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import illustrationBI from "@/assets/illustration-bi.png";
import illustrationRobos from "@/assets/illustration-robos.png";
import illustrationJurimetria from "@/assets/illustration-jurimetria.png";
import illustrationAutomacao from "@/assets/illustration-automacao.png";
import illustrationDashboards from "@/assets/illustration-dashboards.png";
import illustrationIntegracoes from "@/assets/illustration-integracoes.png";
import illustrationChatbots from "@/assets/illustration-chatbots.png";
import illustrationConsultoria from "@/assets/illustration-consultoria.png";

const solutionsData = {
  "business-intelligence": {
    illustration: illustrationBI,
    icon: BarChart3,
    title: "Business Intelligence",
    subtitle: "Dashboards e Relatórios Customizados",
    description: "Desenvolvimento de dashboards e relatórios customizados para análise de dados estratégicos.",
    longDescription: `A Solutions in BI oferece soluções completas de Business Intelligence, transformando dados brutos em insights estratégicos para seu negócio. Nossa equipe especializada desenvolve dashboards personalizados que permitem visualizar KPIs críticos, identificar tendências e tomar decisões baseadas em dados confiáveis.`,
    features: [
      { title: "Dashboards Interativos", description: "Criação de painéis visuais em Power BI com dados em tempo real e navegação intuitiva." },
      { title: "Relatórios Automatizados", description: "Geração automática de relatórios personalizados com distribuição programada." },
      { title: "ETL e Integração", description: "Extração, transformação e carga de dados de múltiplas fontes em um data warehouse unificado." },
      { title: "KPIs Personalizados", description: "Definição e monitoramento de indicadores-chave de performance específicos para seu negócio." },
    ],
    benefits: [
      "Tomada de decisões mais rápida e assertiva",
      "Visibilidade completa das operações",
      "Redução de custos operacionais",
      "Identificação de oportunidades de melhoria",
      "Consolidação de dados dispersos",
      "Democratização do acesso à informação",
    ],
  },
  "robos-juridicos": {
    illustration: illustrationRobos,
    icon: Bot,
    title: "Robôs Jurídicos",
    subtitle: "Automação de Consultas e Processos",
    description: "Implementação de robôs para consultas automáticas em tribunais.",
    longDescription: `Nossa solução de automação jurídica elimina o trabalho manual e repetitivo das equipes, permitindo que advogados e gestores foquem em atividades estratégicas. Os robôs realizam consultas em tribunais, monitoram processos e extraem informações de forma contínua e confiável.`,
    features: [
      { title: "Consultas Automáticas", description: "Robôs que consultam automaticamente sistemas de tribunais e órgãos públicos." },
      { title: "Monitoramento Contínuo", description: "Acompanhamento 24/7 de processos com alertas de movimentações importantes." },
      { title: "Extração de Dados", description: "Captura automatizada de informações de documentos e sistemas jurídicos." },
      { title: "Integração com Sistemas", description: "Conexão com ERPs e sistemas de gestão jurídica existentes." },
    ],
    benefits: [
      "Redução de até 80% do tempo em tarefas manuais",
      "Eliminação de erros humanos",
      "Monitoramento em tempo real",
      "Maior produtividade da equipe",
      "Redução de riscos operacionais",
      "Escalabilidade sem aumento de custos",
    ],
  },
  "jurimetria": {
    illustration: illustrationJurimetria,
    icon: Scale,
    title: "Jurimetria",
    subtitle: "Inteligência Jurídica Baseada em Dados",
    description: "Análise estatística de dados jurídicos para previsibilidade processual.",
    longDescription: `A Jurimetria transforma a prática jurídica ao aplicar métodos estatísticos e científicos para análise de processos judiciais. Com nossa solução, escritórios e empresas podem prever resultados, calcular probabilidades e desenvolver estratégias mais eficazes baseadas em evidências concretas.`,
    features: [
      { title: "Análise Preditiva", description: "Modelos estatísticos que preveem resultados processuais com base em dados históricos." },
      { title: "Pareceres Jurimétricos", description: "Relatórios detalhados com análise estatística de jurisprudência e tendências." },
      { title: "Gestão de Riscos", description: "Avaliação quantitativa de riscos processuais para tomada de decisão estratégica." },
      { title: "Análise de Tendências", description: "Identificação de padrões em decisões por tribunal, relator e matéria." },
    ],
    benefits: [
      "Previsibilidade de resultados processuais",
      "Redução de incertezas jurídicas",
      "Estratégias mais fundamentadas",
      "Otimização de provisionamentos",
      "Identificação de padrões judiciais",
      "Diferencial competitivo no mercado",
    ],
  },
  "automacao-ia": {
    illustration: illustrationAutomacao,
    icon: Cpu,
    title: "Automação IA",
    subtitle: "Inteligência Artificial Aplicada",
    description: "Automação inteligente de processos com IA.",
    longDescription: `Implementamos soluções de Inteligência Artificial para automatizar processos complexos, desde a análise de documentos até a tomada de decisões assistida por algoritmos. Nossa abordagem combina machine learning, processamento de linguagem natural e automação robótica para otimizar fluxos de trabalho.`,
    features: [
      { title: "Processamento de Linguagem Natural", description: "Análise e extração automática de informações de documentos jurídicos e corporativos." },
      { title: "Machine Learning", description: "Modelos preditivos que aprendem com seus dados e melhoram continuamente." },
      { title: "Automação Inteligente", description: "Fluxos de trabalho automatizados com decisões baseadas em IA." },
      { title: "Classificação Automática", description: "Categorização inteligente de documentos, e-mails e processos." },
    ],
    benefits: [
      "Processos até 10x mais rápidos",
      "Precisão superior à análise manual",
      "Aprendizado contínuo com os dados",
      "Redução de custos operacionais",
      "Escalabilidade instantânea",
      "Insights antes invisíveis",
    ],
  },
  "dashboards": {
    illustration: illustrationDashboards,
    icon: LayoutDashboard,
    title: "Dashboards",
    subtitle: "Visualização de Dados em Tempo Real",
    description: "Dashboards interativos para monitoramento e análise.",
    longDescription: `Criamos dashboards interativos e responsivos que transformam dados complexos em visualizações claras e acionáveis. Nossos painéis são projetados para diferentes perfis de usuário, desde analistas até executivos, garantindo que cada stakeholder tenha acesso às informações relevantes.`,
    features: [
      { title: "Painéis Executivos", description: "Visão consolidada dos principais indicadores para tomada de decisão rápida." },
      { title: "Drill-down Interativo", description: "Navegação multinível para explorar dados do macro ao micro." },
      { title: "Atualização em Tempo Real", description: "Dados atualizados automaticamente com conexões diretas às fontes." },
      { title: "Design Responsivo", description: "Dashboards otimizados para desktop, tablet e mobile." },
    ],
    benefits: [
      "Visão 360° do negócio",
      "Decisões em tempo real",
      "Acesso mobile e remoto",
      "Compartilhamento facilitado",
      "Personalização por perfil",
      "Alertas automáticos",
    ],
  },
  "integracoes": {
    illustration: illustrationIntegracoes,
    icon: Plug,
    title: "Integrações",
    subtitle: "Conexão entre Sistemas e Plataformas",
    description: "Integração de sistemas para fluxo de dados unificado.",
    longDescription: `Conectamos seus sistemas, bancos de dados e plataformas em um ecossistema integrado e eficiente. Eliminamos silos de informação e criamos fluxos de dados automatizados entre ERPs, CRMs, sistemas jurídicos e ferramentas de BI.`,
    features: [
      { title: "APIs e Conectores", description: "Desenvolvimento de APIs customizadas e conectores para sistemas legados." },
      { title: "ETL Automatizado", description: "Pipelines de extração, transformação e carga de dados entre sistemas." },
      { title: "Sincronização de Dados", description: "Dados sempre atualizados e consistentes entre todas as plataformas." },
      { title: "Middleware Customizado", description: "Camada intermediária para comunicação entre sistemas incompatíveis." },
    ],
    benefits: [
      "Eliminação de silos de dados",
      "Fluxos de trabalho automatizados",
      "Dados consistentes entre sistemas",
      "Redução de retrabalho",
      "Visão unificada do negócio",
      "Escalabilidade da infraestrutura",
    ],
  },
  "chatbots": {
    illustration: illustrationChatbots,
    icon: MessageSquare,
    title: "Chatbots",
    subtitle: "Atendimento Inteligente e Automatizado",
    description: "Chatbots com IA para atendimento e suporte.",
    longDescription: `Desenvolvemos chatbots inteligentes que utilizam processamento de linguagem natural para oferecer atendimento automatizado de alta qualidade. Nossos bots são treinados com dados específicos do seu negócio para responder dúvidas, qualificar leads e automatizar processos de atendimento.`,
    features: [
      { title: "IA Conversacional", description: "Chatbots com compreensão de linguagem natural para diálogos humanizados." },
      { title: "Multicanal", description: "Atendimento integrado via WhatsApp, site, e-mail e redes sociais." },
      { title: "Base de Conhecimento", description: "Treinamento com dados específicos da empresa para respostas precisas." },
      { title: "Escalonamento Inteligente", description: "Transferência automática para atendentes humanos quando necessário." },
    ],
    benefits: [
      "Atendimento 24/7 sem custos extras",
      "Redução de tempo de resposta",
      "Qualificação automática de leads",
      "Satisfação do cliente elevada",
      "Redução de custos com suporte",
      "Dados e insights de atendimento",
    ],
  },
  "consultoria": {
    illustration: illustrationConsultoria,
    icon: Lightbulb,
    title: "Consultoria",
    subtitle: "Estratégia e Transformação Digital",
    description: "Consultoria especializada em transformação digital.",
    longDescription: `Nossa consultoria combina expertise técnica com visão estratégica para guiar sua empresa na jornada de transformação digital. Analisamos processos, identificamos oportunidades e desenhamos roadmaps personalizados para maximizar o retorno dos investimentos em tecnologia.`,
    features: [
      { title: "Diagnóstico Digital", description: "Avaliação completa da maturidade digital e identificação de gaps." },
      { title: "Roadmap Estratégico", description: "Plano de ação personalizado com priorização e cronograma." },
      { title: "Gestão de Mudança", description: "Acompanhamento na adoção de novas tecnologias e processos." },
      { title: "Treinamento e Capacitação", description: "Programas de capacitação para equipes em ferramentas e metodologias." },
    ],
    benefits: [
      "Visão estratégica clara",
      "ROI maximizado em tecnologia",
      "Processos otimizados",
      "Equipe capacitada",
      "Competitividade ampliada",
      "Inovação contínua",
    ],
  },
};

const SolucaoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = solutionsData[slug as keyof typeof solutionsData];
  const featuresRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const benefitsInView = useInView(benefitsRef, { once: true, margin: "-80px" });

  if (!solution) {
    return (
      <Layout>
        <div className="min-h-screen flex items-center justify-center">
          <div className="text-center">
            <h1 className="text-2xl font-bold mb-4">Solução não encontrada</h1>
            <Button asChild>
              <Link to="/solucoes">Ver todas as soluções</Link>
            </Button>
          </div>
        </div>
      </Layout>
    );
  }

  const IconComponent = solution.icon;
  const allSlugs = Object.keys(solutionsData);
  const currentIndex = allSlugs.indexOf(slug!);
  const prevSolution = currentIndex > 0 ? allSlugs[currentIndex - 1] : null;
  const nextSolution = currentIndex < allSlugs.length - 1 ? allSlugs[currentIndex + 1] : null;

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 pb-20 bg-background relative overflow-hidden">
        {/* Subtle dot pattern */}
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
};

          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
                {solution.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-dark mb-6 leading-tight">
                <span className="text-gradient">{solution.title}</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed mb-8 max-w-lg">
                {solution.longDescription}
              </p>
              <div className="flex flex-wrap gap-4">
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" className="font-semibold">
                    <Link to="/contato">
                      Fale Conosco
                      <ArrowRight className="w-4 h-4 ml-2" />
                    </Link>
                  </Button>
                </motion.div>
                <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}>
                  <Button asChild size="lg" variant="outline">
                    <a
                      href="https://wa.me/551151920925?text=Olá! Gostaria de saber mais sobre a solução de ${solution.title}."
                      target="_blank"
                      rel="noopener noreferrer"
                    >
                      WhatsApp
                    </a>
                  </Button>
                </motion.div>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <img
                src={solution.illustration}
                alt={`Ilustração ${solution.title}`}
                className="w-96 h-96 object-contain"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24 bg-muted/30" ref={featuresRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={featuresInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Recursos e Funcionalidades
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Conheça os recursos que tornam o {solution.title} uma solução completa.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {solution.features.map((feature, index) => (
              <motion.div
                key={feature.title}
                className="rounded-2xl border border-border bg-card p-8 hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={featuresInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.1 }}
              >
                <div className="w-10 h-10 rounded-full bg-primary/10 text-primary flex items-center justify-center mb-5 text-sm font-bold">
                  {String(index + 1).padStart(2, '0')}
                </div>
                <h3 className="text-lg font-display font-semibold text-foreground mb-2">
                  {feature.title}
                </h3>
                <p className="text-muted-foreground text-sm leading-relaxed">
                  {feature.description}
                </p>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24" ref={benefitsRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Benefícios
            </h2>
            <p className="text-muted-foreground text-lg">
              Veja como o {solution.title} pode transformar seu negócio.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {solution.benefits.map((benefit, index) => (
              <motion.div
                key={benefit}
                className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-all duration-300"
                initial={{ opacity: 0, y: 15 }}
                animate={benefitsInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: index * 0.08 }}
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm text-foreground">{benefit}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>



      <CTASection />
    </Layout>
  );
};

export default SolucaoDetalhe;
