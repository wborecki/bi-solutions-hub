import { useParams, Link } from "react-router-dom";
import { ArrowRight, CheckCircle, BarChart3, Bot, Scale, Cpu, LayoutDashboard, Plug, Lightbulb, GraduationCap, Monitor, Database } from "lucide-react";
import { OptimizedImage } from "@/components/OptimizedImage";
import { SEO } from "@/components/SEO";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import illustrationBI from "@/assets/illustration-bi.webp";
import illustrationBIWebp from "@/assets/illustration-bi.webp";
import illustrationRobos from "@/assets/bia-v1.webp";
import illustrationRobosWebp from "@/assets/bia-v1.webp";
import illustrationJurimetria from "@/assets/illustration-jurimetria.webp";
import illustrationJurimetriaWebp from "@/assets/illustration-jurimetria.webp";
import solutionJurimetria from "@/assets/solution-jurimetria.webp";
import illustrationAutomacao from "@/assets/illustration-automacao.webp";
import illustrationAutomacaoWebp from "@/assets/illustration-automacao.webp";
import illustrationDashboards from "@/assets/illustration-dashboards.webp";
import illustrationDashboardsWebp from "@/assets/illustration-dashboards.webp";
import illustrationIntegracoes from "@/assets/illustration-integracoes.webp";
import illustrationIntegracoesWebp from "@/assets/illustration-integracoes.webp";
import illustrationConsultoria from "@/assets/illustration-consultoria.webp";
import illustrationConsultoriaWebp from "@/assets/illustration-consultoria.webp";
import illustrationImplantacao from "@/assets/illustration-implantacao.webp";
import illustrationImplantacaoWebp from "@/assets/illustration-implantacao.webp";
import illustrationMentoria from "@/assets/illustration-mentoria.webp";
import illustrationMentoriaWebp from "@/assets/illustration-mentoria.webp";
import illustrationColeta from "@/assets/illustration-coleta.webp";
import illustrationColetaWebp from "@/assets/illustration-coleta.webp";

const solutionsData = {
  "business-intelligence": {
    illustration: illustrationBI,
    illustrationWebp: illustrationBIWebp,
    icon: BarChart3,
    title: "Business Intelligence",
    subtitle: "Dashboards e Relatórios Customizados",
    keywords: "business intelligence jurídico, Power BI, dashboards jurídicos, relatórios automatizados, KPIs jurídicos, CPJ, PROJuris, ADVBOX, BI para escritórios de advocacia",
    longDescription: `A Solutions in BI oferece soluções completas de Business Intelligence, transformando dados brutos em insights estratégicos para seu negócio. Nossa equipe especializada desenvolve dashboards personalizados que permitem visualizar KPIs críticos, identificar tendências e tomar decisões baseadas em dados confiáveis.`,
    features: [
      { title: "Dashboards Interativos", description: "Criação de painéis visuais em Power BI com navegação intuitiva e dados atualizados." },
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
    illustrationWebp: illustrationRobosWebp,
    icon: Bot,
    title: "Robôs Jurídicos",
    subtitle: "Automação de Consultas e Processos",
    keywords: "robôs jurídicos, automação PJe, robô ESAJ, consulta TJSP, TJPR, TJRJ, TJMG, TJRS, TRT, TST, STJ, TRF, PROJUDI, e-SAJ, Tucujuris, Eproc, CPJ, PROJuris, ADVBOX, consulta processual automatizada",
    longDescription: `Nossa solução de automação jurídica elimina o trabalho manual e repetitivo das equipes, permitindo que advogados e gestores foquem em atividades estratégicas. Os robôs realizam consultas automáticas nos principais tribunais estaduais, federais, trabalhistas e superiores, monitoram processos e extraem informações de forma contínua e confiável.`,
    features: [
      { title: "Consultas Automáticas", description: "Robôs que consultam automaticamente sistemas dos principais tribunais e órgãos públicos." },
      { title: "Monitoramento Contínuo", description: "Acompanhamento 24/7 de processos em todos os tribunais com alertas de movimentações importantes." },
      { title: "Extração de Dados", description: "Captura automatizada de informações de documentos e sistemas jurídicos de todo o país." },
      { title: "Integração com Sistemas", description: "Conexão com ERPs e sistemas de gestão jurídica como CPJ-SAJ, PROJuris e ADVBOX." },
    ],
    benefits: [
      "Redução de até 80% do tempo em tarefas manuais",
      "Eliminação de erros humanos",
      "Monitoramento automatizado em todos os tribunais",
      "Maior produtividade da equipe",
      "Redução de riscos operacionais",
      "Escalabilidade sem aumento de custos",
    ],
  },
  "jurimetria": {
    illustration: illustrationJurimetria,
    illustrationWebp: illustrationJurimetriaWebp,
    icon: Scale,
    title: "Jurimetria",
    subtitle: "Inteligência Jurídica Baseada em Dados",
    keywords: "jurimetria, análise jurimétrica, parecer jurimétrico, TJSP, TJPR, TJRJ, TJMG, TRT, TST, STJ, STF, provisionamento jurídico, probabilidade de êxito, análise estatística processual, jurisprudência dados",
    longDescription: `A Jurimetria transforma a prática jurídica ao aplicar métodos estatísticos para análise de processos judiciais. Com nossa solução, escritórios e empresas podem prever resultados, calcular probabilidades e desenvolver estratégias mais eficazes com base em dados de tribunais estaduais, federais, trabalhistas e superiores.`,
    features: [
      { title: "Análise Estatística", description: "Modelos estatísticos que analisam resultados processuais em tribunais de todo o Brasil." },
      { title: "Pareceres Jurimétricos", description: "Relatórios detalhados com análise de jurisprudência e tendências por tribunal e relator." },
      { title: "Gestão de Riscos", description: "Avaliação quantitativa de riscos processuais para tomada de decisão estratégica." },
      { title: "Análise de Tendências", description: "Identificação de padrões em decisões por tribunal, vara, relator e matéria." },
    ],
    benefits: [
      "Previsibilidade de resultados processuais",
      "Redução de incertezas jurídicas",
      "Estratégias mais fundamentadas",
      "Otimização de provisionamentos",
      "Identificação de padrões judiciais",
      "Diferencial competitivo no mercado",
    ],
    showcase: {
      image: solutionJurimetria,
      title: "Pareceres Jurimétricos",
      description: "Nossos pareceres jurimétricos combinam análise estatística rigorosa com inteligência de dados para oferecer uma visão clara e objetiva sobre o cenário processual. Cada parecer é personalizado para o caso do cliente, trazendo probabilidades de êxito, valores estimados, tempo de tramitação e comparativos por tribunal e relator.",
      highlights: [
        "Análise estatística de casos similares com probabilidade de êxito",
        "Estimativa de valores de condenação com base em dados reais",
        "Comparativo de decisões por tribunal, vara e relator",
        "Relatório visual e executivo para tomada de decisão",
      ],
    },
  },
  "automacao-ia": {
    illustration: illustrationAutomacao,
    illustrationWebp: illustrationAutomacaoWebp,
    icon: Cpu,
    title: "Automação de Fluxos",
    subtitle: "Automatize Processos e Ganhe Eficiência",
    keywords: "automação jurídica, automação de fluxos, integração CPJ, PROJuris, ADVBOX, Themis, SAJ, automação e-mail jurídico, RPA jurídico, automação escritório advocacia",
    longDescription: `Criamos fluxos automatizados que conectam seus sistemas, eliminam tarefas manuais e aceleram processos do início ao fim. Nossa plataforma de automação permite integrar e-mails, planilhas, CRMs, ERPs e sistemas jurídicos em fluxos inteligentes que rodam de forma autônoma, 24 horas por dia.`,
    features: [
      { title: "Fluxos Automatizados", description: "Crie sequências de ações automáticas que conectam diferentes sistemas e etapas do processo." },
      { title: "Integração de Sistemas", description: "Conecte e-mails, planilhas, CRMs, ERPs e sistemas jurídicos em um único fluxo." },
      { title: "Gatilhos Inteligentes", description: "Automações disparadas por eventos como recebimento de e-mail, vencimento de prazo ou atualização de dados." },
      { title: "Notificações e Alertas", description: "Envio automático de notificações por e-mail, WhatsApp ou sistema interno." },
    ],
    benefits: [
      "Eliminação de tarefas manuais repetitivas",
      "Processos rodando 24/7 automaticamente",
      "Menos erros operacionais",
      "Integração entre todos os sistemas",
      "Escalabilidade sem aumentar equipe",
      "Economia de horas de trabalho por semana",
    ],
  },
  "dashboards": {
    illustration: illustrationDashboards,
    illustrationWebp: illustrationDashboardsWebp,
    icon: LayoutDashboard,
    title: "Dashboards",
    subtitle: "Visualização de Dados Estratégicos",
    keywords: "dashboards jurídicos, Power BI, painel gerencial jurídico, KPIs escritório advocacia, dashboard produtividade jurídica, relatórios visuais, CPJ dashboard, PROJuris relatórios",
    longDescription: `Criamos dashboards interativos e responsivos que transformam dados complexos em visualizações claras e acionáveis. Nossos painéis são projetados para diferentes perfis de usuário, desde analistas até executivos, garantindo que cada stakeholder tenha acesso às informações relevantes.`,
    features: [
      { title: "Painéis Executivos", description: "Visão consolidada dos principais indicadores para tomada de decisão rápida." },
      { title: "Drill-down Interativo", description: "Navegação multinível para explorar dados do macro ao micro." },
      { title: "Atualização Automática", description: "Dados atualizados automaticamente com conexões diretas às fontes." },
      { title: "Design Responsivo", description: "Dashboards otimizados para desktop, tablet e mobile." },
    ],
    benefits: [
      "Visão 360° do negócio",
      "Decisões mais assertivas",
      "Acesso mobile e remoto",
      "Compartilhamento facilitado",
      "Personalização por perfil",
      "Alertas automáticos",
    ],
  },
  "integracoes": {
    illustration: illustrationIntegracoes,
    illustrationWebp: illustrationIntegracoesWebp,
    icon: Plug,
    title: "Integrações",
    subtitle: "Conexão entre Sistemas e Plataformas",
    keywords: "integração sistemas jurídicos, API tribunais, integração CPJ, PROJuris, ADVBOX, SAJ, Themis, ERP jurídico, integração PJe, ESAJ, ETL jurídico, middleware jurídico",
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
  "mentoria-power-bi": {
    illustration: illustrationMentoria,
    illustrationWebp: illustrationMentoriaWebp,
    icon: GraduationCap,
    title: "Mentoria de Power BI",
    subtitle: "Aprenda com Especialistas",
    keywords: "mentoria Power BI, curso Power BI jurídico, treinamento Power BI, DAX, dashboard jurídico, aprender Power BI, capacitação BI, Power BI para advogados",
    longDescription: `Nossa mentoria de Power BI é um programa personalizado para profissionais que desejam dominar a criação de dashboards, relatórios e análises de dados. Com acompanhamento individual e projetos práticos, você aprende a transformar dados em insights estratégicos para seu negócio.`,
    features: [
      { title: "Aulas Práticas", description: "Sessões hands-on com dados reais do seu negócio para aprendizado aplicado." },
      { title: "Acompanhamento Individual", description: "Mentor dedicado para tirar dúvidas e orientar seu desenvolvimento." },
      { title: "Projetos Reais", description: "Construa dashboards e relatórios aplicáveis ao seu dia a dia profissional." },
      { title: "Material Exclusivo", description: "Acesso a templates, guias e materiais de referência atualizados." },
    ],
    benefits: [
      "Domínio completo do Power BI",
      "Autonomia na criação de dashboards",
      "Análises mais assertivas",
      "Certificado de conclusão",
      "Suporte pós-mentoria",
      "Networking com outros profissionais",
    ],
  },
  "implantacao-sistemas": {
    illustration: illustrationImplantacao,
    illustrationWebp: illustrationImplantacaoWebp,
    icon: Monitor,
    title: "Implantação de Sistemas Jurídicos",
    subtitle: "Sistemas Sob Medida para sua Operação",
    keywords: "implantação CPJ, implantação PROJuris, implantação ADVBOX, implantação SAJ, implantação Themis, sistema jurídico, migração de dados jurídicos, implantação software jurídico",
    longDescription: `Realizamos a implantação completa dos principais sistemas jurídicos do mercado. Desde a configuração inicial até o treinamento da equipe, cuidamos da migração de dados, personalização de funcionalidades e acompanhamento para garantir que o sistema funcione perfeitamente no dia a dia do seu escritório ou departamento jurídico.`,
    features: [
      { title: "Configuração Personalizada", description: "Adaptamos o sistema jurídico às necessidades específicas do seu escritório ou departamento." },
      { title: "Migração de Dados", description: "Transferência segura de todos os dados do sistema anterior — planilhas, banco de dados ou outros — sem perda de informações." },
      { title: "Treinamento da Equipe", description: "Capacitação completa para que todos os usuários dominem o novo sistema jurídico." },
      { title: "Suporte na Adoção", description: "Acompanhamento contínuo nos primeiros meses para garantir a adoção plena do sistema." },
    ],
    benefits: [
      "Sistema funcionando rapidamente",
      "Zero perda de dados na migração",
      "Equipe treinada e confiante",
      "Processos organizados desde o início",
      "Suporte dedicado pós-implantação",
      "Customização para seu fluxo de trabalho",
    ],
  },
  "consultoria": {
    illustration: illustrationConsultoria,
    illustrationWebp: illustrationConsultoriaWebp,
    icon: Lightbulb,
    title: "Consultoria",
    subtitle: "Estratégia e Transformação Digital",
    keywords: "consultoria jurídica tecnologia, transformação digital escritório advocacia, consultoria BI, diagnóstico digital jurídico, CPJ, PROJuris, ADVBOX, gestão jurídica",
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
  "coleta-de-dados": {
    illustration: illustrationColeta,
    illustrationWebp: illustrationColetaWebp,
    icon: Database,
    title: "Coleta de Dados",
    subtitle: "Captura e Organização de Informações",
    keywords: "coleta dados tribunais, web scraping jurídico, dados PJe, dados ESAJ, TJSP, TJPR, TJRJ, TRT, dados públicos jurídicos, extração dados processuais, captura dados portais tribunais",
    longDescription: `Oferecemos soluções de coleta automatizada de dados de diversas fontes públicas e privadas. Nosso serviço captura, organiza e entrega informações estruturadas prontas para alimentar seus dashboards, relatórios e análises estratégicas, economizando tempo e garantindo precisão.`,
    features: [
      { title: "Coleta Automatizada", description: "Captura periódica e programada de dados de sites, portais e sistemas públicos." },
      { title: "Limpeza e Padronização", description: "Tratamento dos dados coletados para garantir qualidade e consistência." },
      { title: "Entrega Estruturada", description: "Dados organizados em planilhas, bancos de dados ou integrados diretamente aos seus sistemas." },
      { title: "Monitoramento Contínuo", description: "Acompanhamento de atualizações nas fontes com alertas automáticos de mudanças." },
    ],
    benefits: [
      "Economia de horas de trabalho manual",
      "Dados sempre atualizados e confiáveis",
      "Alimentação automática de dashboards",
      "Redução de erros na captura de informações",
      "Escalabilidade sem aumento de equipe",
      "Tomada de decisão com dados frescos",
    ],
  },
};

const SolucaoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = solutionsData[slug as keyof typeof solutionsData];
  const featuresRef = useRef(null);
  const showcaseRef = useRef(null);
  const benefitsRef = useRef(null);
  const featuresInView = useInView(featuresRef, { once: true, margin: "-80px" });
  const showcaseInView = useInView(showcaseRef, { once: true, margin: "-80px" });
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

  const serviceJsonLd = {
    "@context": "https://schema.org",
    "@type": "Service",
    name: solution.title,
    description: solution.longDescription,
    provider: {
      "@type": "Organization",
      name: "Solutions in BI",
      url: "https://solutionsinbi.com",
    },
    areaServed: {
      "@type": "Country",
      name: "Brasil",
    },
    serviceType: solution.subtitle,
    url: `https://solutionsinbi.com/solucoes/${slug}`,
  };

  const showcase = "showcase" in solution ? (solution as any).showcase as { image: string; title: string; description: string; highlights: string[] } : null;

  return (
    <Layout>
      <SEO
        title={`${solution.title} | Soluções Jurídicas`}
        description={solution.longDescription.length > 155 ? solution.longDescription.slice(0, 152) + "..." : solution.longDescription}
        canonical={`/solucoes/${slug}`}
        keywords={solution.keywords}
        jsonLd={serviceJsonLd}
      />
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>

        <div className="container mx-auto px-4 relative z-10">
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
                      href={`https://wa.me/5511945418626?text=Olá! Gostaria de saber mais sobre a solução de ${solution.title}.`}
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
              <OptimizedImage
                src={solution.illustration}
                webpSrc={solution.illustrationWebp}
                sizes="(max-width: 1024px) 320px, 384px"
                alt={`Ilustração ${solution.title}`}
                className="w-96 h-96"
                loading="eager"
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

      {/* Showcase (Pareceres Jurimétricos) */}
      {showcase && (
        <section className="py-24 bg-background" ref={showcaseRef}>
          <div className="container mx-auto px-4">
            <div className="grid lg:grid-cols-2 gap-12 items-center max-w-5xl mx-auto">
              <motion.div
                initial={{ opacity: 0, x: -30 }}
                animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6 }}
              >
                <img
                  src={showcase.image}
                  alt={showcase.title}
                  className="w-full rounded-2xl shadow-lg border border-border"
                  loading="lazy"
                />
              </motion.div>
              <motion.div
                initial={{ opacity: 0, x: 30 }}
                animate={showcaseInView ? { opacity: 1, x: 0 } : {}}
                transition={{ duration: 0.6, delay: 0.15 }}
              >
                <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                  {showcase.title}
                </h2>
                <p className="text-muted-foreground leading-relaxed mb-6">
                  {showcase.description}
                </p>
                <ul className="space-y-3">
                  {showcase.highlights.map((item: string) => (
                    <li key={item} className="flex items-start gap-3">
                      <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                      <span className="text-sm text-foreground">{item}</span>
                    </li>
                  ))}
                </ul>
              </motion.div>
            </div>
          </div>
        </section>
      )}

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
