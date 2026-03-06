import { useParams, Link } from "react-router-dom";
import { ArrowLeft, ArrowRight, CheckCircle, BarChart3, Bot, Scale } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { CTASection } from "@/components/home/CTASection";
import { cn } from "@/lib/utils";

const solutionsData = {
  "business-intelligence": {
    icon: BarChart3,
    title: "Business Intelligence",
    subtitle: "Dashboards e Relatórios Customizados",
    description: "Desenvolvimento de dashboards e relatórios customizados para análise de dados estratégicos, permitindo decisões mais assertivas nos âmbitos jurídico e corporativo.",
    longDescription: `A Solutions in BI oferece soluções completas de Business Intelligence, 
    transformando dados brutos em insights estratégicos para seu negócio. Nossa equipe especializada 
    desenvolve dashboards personalizados que permitem visualizar KPIs críticos, identificar tendências 
    e tomar decisões baseadas em dados confiáveis.`,
    features: [
      {
        title: "Dashboards Interativos",
        description: "Criação de painéis visuais em Power BI com dados em tempo real e navegação intuitiva.",
      },
      {
        title: "Relatórios Automatizados",
        description: "Geração automática de relatórios personalizados com distribuição programada.",
      },
      {
        title: "ETL e Integração",
        description: "Extração, transformação e carga de dados de múltiplas fontes em um data warehouse unificado.",
      },
      {
        title: "KPIs Personalizados",
        description: "Definição e monitoramento de indicadores-chave de performance específicos para seu negócio.",
      },
    ],
    benefits: [
      "Tomada de decisões mais rápida e assertiva",
      "Visibilidade completa das operações",
      "Redução de custos operacionais",
      "Identificação de oportunidades de melhoria",
      "Consolidação de dados dispersos",
      "Democratização do acesso à informação",
    ],
    color: "bg-primary",
    gradient: "from-primary to-secondary",
  },
  "robos-juridicos": {
    icon: Bot,
    title: "Robôs Jurídicos",
    subtitle: "Automação de Consultas e Processos",
    description: "Implementação de robôs para consultas automáticas em tribunais, agilizando a busca por informações processuais e reduzindo o tempo em tarefas repetitivas.",
    longDescription: `Nossa solução de automação jurídica elimina o trabalho manual e repetitivo 
    das equipes, permitindo que advogados e gestores foquem em atividades estratégicas. Os robôs 
    realizam consultas em tribunais, monitoram processos e extraem informações de forma contínua 
    e confiável.`,
    features: [
      {
        title: "Consultas Automáticas",
        description: "Robôs que consultam automaticamente sistemas de tribunais e órgãos públicos.",
      },
      {
        title: "Monitoramento Contínuo",
        description: "Acompanhamento 24/7 de processos com alertas de movimentações importantes.",
      },
      {
        title: "Extração de Dados",
        description: "Captura automatizada de informações de documentos e sistemas jurídicos.",
      },
      {
        title: "Integração com Sistemas",
        description: "Conexão com ERPs e sistemas de gestão jurídica existentes.",
      },
    ],
    benefits: [
      "Redução de até 80% do tempo em tarefas manuais",
      "Eliminação de erros humanos",
      "Monitoramento em tempo real",
      "Maior produtividade da equipe",
      "Redução de riscos operacionais",
      "Escalabilidade sem aumento de custos",
    ],
    color: "bg-secondary",
    gradient: "from-secondary to-accent",
  },
  "jurimetria": {
    icon: Scale,
    title: "Jurimetria",
    subtitle: "Inteligência Jurídica Baseada em Dados",
    description: "Análise estatística de dados jurídicos para previsibilidade processual, gestão de riscos e insights estratégicos baseados em dados reais.",
    longDescription: `A Jurimetria transforma a prática jurídica ao aplicar métodos estatísticos 
    e científicos para análise de processos judiciais. Com nossa solução, escritórios e empresas 
    podem prever resultados, calcular probabilidades e desenvolver estratégias mais eficazes 
    baseadas em evidências concretas.`,
    features: [
      {
        title: "Análise Preditiva",
        description: "Modelos estatísticos que preveem resultados processuais com base em dados históricos.",
      },
      {
        title: "Pareceres Jurimétricos",
        description: "Relatórios detalhados com análise estatística de jurisprudência e tendências.",
      },
      {
        title: "Gestão de Riscos",
        description: "Avaliação quantitativa de riscos processuais para tomada de decisão estratégica.",
      },
      {
        title: "Análise de Tendências",
        description: "Identificação de padrões em decisões por tribunal, relator e matéria.",
      },
    ],
    benefits: [
      "Previsibilidade de resultados processuais",
      "Redução de incertezas jurídicas",
      "Estratégias mais fundamentadas",
      "Otimização de provisionamentos",
      "Identificação de padrões judiciais",
      "Diferencial competitivo no mercado",
    ],
    color: "bg-accent",
    gradient: "from-accent to-primary",
  },
};

const SolucaoDetalhe = () => {
  const { slug } = useParams<{ slug: string }>();
  const solution = solutionsData[slug as keyof typeof solutionsData];

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
      <section className="pt-32 pb-16 bg-muted/30 overflow-hidden relative">
        <div className="absolute inset-0">
          <div className={cn("absolute -top-1/2 -right-1/4 w-[600px] h-[600px] rounded-full blur-3xl opacity-20 bg-gradient-to-br", solution.gradient)} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <Link
            to="/solucoes"
            className="inline-flex items-center gap-2 text-sm text-muted-foreground hover:text-foreground mb-6 transition-colors"
          >
            <ArrowLeft className="w-4 h-4" />
            Voltar para Soluções
          </Link>

          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <div>
              <div className={cn(
                "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                solution.color,
                "text-white"
              )}>
                <IconComponent className="w-8 h-8" />
              </div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
                {solution.subtitle}
              </span>
              <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
                {solution.title}
              </h1>
              <p className="text-xl text-muted-foreground leading-relaxed">
                {solution.longDescription}
              </p>
            </div>

            <div className="hidden lg:block">
              <div className={cn(
                "aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br p-8 flex items-center justify-center",
                solution.gradient
              )}>
                <IconComponent className="w-40 h-40 text-white/80" strokeWidth={0.75} />
              </div>
            </div>
          </div>
        </div>
      </section>

      {/* Features */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <h2 className="text-3xl font-display font-bold text-foreground text-center mb-12">
            Recursos e Funcionalidades
          </h2>
          <div className="grid md:grid-cols-2 gap-8">
            {solution.features.map((feature, index) => (
              <Card key={feature.title} className="border-0 shadow-lg">
                <CardHeader>
                  <div className={cn(
                    "w-10 h-10 rounded-lg flex items-center justify-center mb-4",
                    solution.color,
                    "text-white text-lg font-bold"
                  )}>
                    {index + 1}
                  </div>
                  <CardTitle className="font-display">{feature.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground">{feature.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Benefits */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center mb-12">
            <h2 className="text-3xl font-display font-bold text-foreground mb-4">
              Benefícios
            </h2>
            <p className="text-lg text-muted-foreground">
              Veja como o {solution.title} pode transformar seu negócio.
            </p>
          </div>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-4xl mx-auto">
            {solution.benefits.map((benefit) => (
              <div key={benefit} className="flex items-start gap-3 p-4 rounded-lg bg-background">
                <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                <span className="text-foreground">{benefit}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Navigation */}
      <section className="py-12 border-t">
        <div className="container mx-auto px-4">
          <div className="flex justify-between items-center">
            {prevSolution ? (
              <Button asChild variant="ghost">
                <Link to={`/solucoes/${prevSolution}`}>
                  <ArrowLeft className="w-4 h-4 mr-2" />
                  {solutionsData[prevSolution as keyof typeof solutionsData].title}
                </Link>
              </Button>
            ) : <div />}
            {nextSolution ? (
              <Button asChild variant="ghost">
                <Link to={`/solucoes/${nextSolution}`}>
                  {solutionsData[nextSolution as keyof typeof solutionsData].title}
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            ) : <div />}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default SolucaoDetalhe;
