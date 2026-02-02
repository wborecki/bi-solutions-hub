import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, Scale } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const solutions = [
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Desenvolvimento de dashboards e relatórios customizados para análise de dados estratégicos, permitindo decisões mais assertivas.",
    features: ["Dashboards Power BI", "Relatórios automatizados", "KPIs personalizados", "Integração de dados"],
    href: "/solucoes/business-intelligence",
    color: "bg-primary",
  },
  {
    icon: Bot,
    title: "Robôs Jurídicos",
    description: "Automação de consultas em tribunais e sistemas jurídicos, reduzindo tempo em tarefas repetitivas e minimizando riscos operacionais.",
    features: ["Consultas automáticas", "Monitoramento processual", "Extração de dados", "Alertas inteligentes"],
    href: "/solucoes/robos-juridicos",
    color: "bg-secondary",
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description: "Análise estatística de dados jurídicos para previsibilidade processual, gestão de riscos e insights estratégicos baseados em dados.",
    features: ["Análise preditiva", "Pareceres jurimétricos", "Gestão de riscos", "Tendências jurisprudenciais"],
    href: "/solucoes/jurimetria",
    color: "bg-brand-tiffany",
  },
];

export function SolutionsSection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
            Nossas Soluções
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Transforme dados em{" "}
            <span className="text-gradient">decisões estratégicas</span>
          </h2>
          <p className="text-lg text-muted-foreground">
            Oferecemos um portfólio completo de serviços especializados para escritórios de advocacia, 
            departamentos jurídicos e empresas em geral.
          </p>
        </div>

        {/* Solutions Grid */}
        <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <Card
                key={solution.title}
                className="group relative overflow-hidden border-0 shadow-lg hover:shadow-xl transition-all duration-300 hover:-translate-y-1"
                style={{ animationDelay: `${index * 0.1}s` }}
              >
                <div className={cn("absolute top-0 left-0 right-0 h-1", solution.color)} />
                
                <CardHeader className="pb-4">
                  <div className={cn(
                    "w-14 h-14 rounded-xl flex items-center justify-center mb-4",
                    solution.color,
                    "text-white"
                  )}>
                    <IconComponent className="w-7 h-7" />
                  </div>
                  <CardTitle className="text-xl font-display">{solution.title}</CardTitle>
                  <CardDescription className="text-base">
                    {solution.description}
                  </CardDescription>
                </CardHeader>

                <CardContent>
                  <ul className="space-y-2 mb-6">
                    {solution.features.map((feature) => (
                      <li key={feature} className="flex items-center gap-2 text-sm text-muted-foreground">
                        <div className="w-1.5 h-1.5 rounded-full bg-brand-tiffany" />
                        {feature}
                      </li>
                    ))}
                  </ul>
                  
                  <Button asChild variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:text-brand-tiffany">
                    <Link to={solution.href}>
                      Saiba mais
                      <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                    </Link>
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>

        {/* CTA */}
        <div className="text-center mt-12">
          <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90">
            <Link to="/solucoes">Ver Todas as Soluções</Link>
          </Button>
        </div>
      </div>
    </section>
  );
}
