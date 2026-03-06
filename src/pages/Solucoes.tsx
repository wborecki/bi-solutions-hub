import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, Scale, CheckCircle } from "lucide-react";
import { Layout } from "@/components/layout/Layout";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { CTASection } from "@/components/home/CTASection";
import { cn } from "@/lib/utils";

const solutions = [
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Desenvolvimento de dashboards e relatórios customizados para análise de dados estratégicos, permitindo decisões mais assertivas nos âmbitos jurídico e corporativo.",
    features: [
      "Dashboards interativos em Power BI",
      "Relatórios automatizados e personalizados",
      "KPIs e métricas de performance",
      "Integração de múltiplas fontes de dados",
      "ETL (Extração, Transformação e Carga)",
      "Análise de dados em tempo real",
    ],
    href: "/solucoes/business-intelligence",
    color: "bg-primary",
    gradient: "from-primary to-secondary",
  },
  {
    icon: Bot,
    title: "Robôs Jurídicos",
    description: "Implementação de robôs para consultas automáticas em tribunais, agilizando a busca por informações processuais e reduzindo o tempo em tarefas repetitivas.",
    features: [
      "Consultas automáticas em tribunais",
      "Monitoramento processual contínuo",
      "Extração de dados de sistemas jurídicos",
      "Alertas inteligentes de movimentações",
      "Redução de riscos operacionais",
      "Integração com sistemas existentes",
    ],
    href: "/solucoes/robos-juridicos",
    color: "bg-secondary",
    gradient: "from-secondary to-accent",
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description: "Análise estatística de dados jurídicos para previsibilidade processual, gestão de riscos e insights estratégicos baseados em dados reais.",
    features: [
      "Análise preditiva de resultados",
      "Pareceres jurimétricos detalhados",
      "Gestão de riscos processuais",
      "Tendências jurisprudenciais",
      "Estatísticas por tribunal e relator",
      "Suporte à estratégia jurídica",
    ],
    href: "/solucoes/jurimetria",
    color: "bg-accent",
    gradient: "from-accent to-primary",
  },
];

const Solucoes = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              Nossas Soluções
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Soluções completas em{" "}
              <span className="text-gradient">Business Intelligence</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Oferecemos um portfólio completo de serviços especializados para 
              escritórios de advocacia, departamentos jurídicos e empresas que 
              buscam transformar dados em vantagem competitiva.
            </p>
          </div>
        </div>
      </section>

      {/* Solutions Detail */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="space-y-24">
            {solutions.map((solution, index) => {
              const IconComponent = solution.icon;
              const isEven = index % 2 === 0;

              return (
                <div
                  key={solution.title}
                  className={cn(
                    "grid lg:grid-cols-2 gap-12 items-center",
                    !isEven && "lg:grid-flow-dense"
                  )}
                >
                  <div className={cn(!isEven && "lg:col-start-2")}>
                    <div className={cn(
                      "w-16 h-16 rounded-2xl flex items-center justify-center mb-6",
                      solution.color,
                      "text-white"
                    )}>
                      <IconComponent className="w-8 h-8" />
                    </div>
                    <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                      {solution.title}
                    </h2>
                    <p className="text-lg text-muted-foreground mb-8 leading-relaxed">
                      {solution.description}
                    </p>

                    <div className="grid sm:grid-cols-2 gap-4 mb-8">
                      {solution.features.map((feature) => (
                        <div key={feature} className="flex items-start gap-3">
                          <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                          <span className="text-sm text-foreground">{feature}</span>
                        </div>
                      ))}
                    </div>

                    <Button asChild className="bg-primary hover:bg-primary/90">
                      <Link to={solution.href}>
                        Saiba Mais
                        <ArrowRight className="w-4 h-4 ml-2" />
                      </Link>
                    </Button>
                  </div>

                  <div className={cn(!isEven && "lg:col-start-1")}>
                    <div
                      className={cn(
                        "aspect-square max-w-md mx-auto rounded-3xl bg-gradient-to-br p-8 flex items-center justify-center",
                        solution.gradient
                      )}
                    >
                      <div className="w-full h-full rounded-2xl bg-white/10 backdrop-blur-sm flex items-center justify-center">
                        <IconComponent className="w-32 h-32 text-white/80" strokeWidth={1} />
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Solucoes;
