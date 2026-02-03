import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Link } from "react-router-dom";
import { 
  BarChart3, 
  Bot, 
  Scale, 
  Users, 
  Lightbulb, 
  Cog, 
  ClipboardCheck, 
  GraduationCap,
  ArrowRight,
  CheckCircle2,
  Phone
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const mainServices = [
  {
    icon: Lightbulb,
    title: "Consultoria em Gestão Jurídica",
    description: "Diagnóstico completo dos processos do seu escritório com recomendações estratégicas para otimização e crescimento.",
    features: [
      "Análise de processos internos",
      "Identificação de gargalos operacionais",
      "Roadmap de transformação digital",
      "Benchmarking do mercado"
    ],
    highlight: "Ideal para escritórios que buscam eficiência"
  },
  {
    icon: Cog,
    title: "Desenvolvimento Customizado",
    description: "Soluções sob medida para suas necessidades específicas, desde dashboards até integrações complexas.",
    features: [
      "Dashboards Power BI personalizados",
      "Integrações com sistemas jurídicos",
      "Automações exclusivas",
      "APIs e conectores customizados"
    ],
    highlight: "Para necessidades únicas e complexas"
  },
  {
    icon: GraduationCap,
    title: "Mentoria para Gestores",
    description: "Programa de acompanhamento para líderes jurídicos que desejam dominar a gestão orientada a dados.",
    features: [
      "Encontros quinzenais personalizados",
      "Acompanhamento de metas e KPIs",
      "Acesso a materiais exclusivos",
      "Suporte contínuo via WhatsApp"
    ],
    highlight: "Desenvolvimento de liderança data-driven"
  },
  {
    icon: ClipboardCheck,
    title: "Auditoria de Dados",
    description: "Avaliação profunda da qualidade dos seus dados e processos de coleta, com plano de ação para melhorias.",
    features: [
      "Análise de integridade dos dados",
      "Identificação de inconsistências",
      "Recomendações de governança",
      "Plano de ação estruturado"
    ],
    highlight: "Base sólida para decisões estratégicas"
  }
];

const solutionPackages = [
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Dashboards e relatórios que transformam dados em insights acionáveis.",
    href: "/solucoes/business-intelligence"
  },
  {
    icon: Bot,
    title: "Robôs Jurídicos",
    description: "Automação de tarefas repetitivas para liberar tempo estratégico.",
    href: "/solucoes/robos-juridicos"
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description: "Análise estatística para previsibilidade e gestão de riscos.",
    href: "/solucoes/jurimetria"
  }
];

const processSteps = [
  {
    step: "01",
    title: "Diagnóstico",
    description: "Entendemos sua realidade, processos e objetivos em uma reunião inicial detalhada."
  },
  {
    step: "02",
    title: "Proposta",
    description: "Elaboramos uma proposta customizada com escopo, cronograma e investimento."
  },
  {
    step: "03",
    title: "Implementação",
    description: "Executamos o projeto com acompanhamento próximo e entregas incrementais."
  },
  {
    step: "04",
    title: "Acompanhamento",
    description: "Oferecemos suporte contínuo para garantir a adoção e os resultados esperados."
  }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.15 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 40 } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: "easeOut" as const }
  }
};

export default function Servicos() {
  const servicesRef = useRef(null);
  const processRef = useRef(null);
  const solutionsRef = useRef(null);
  
  const servicesInView = useInView(servicesRef, { once: true, margin: "-100px" });
  const processInView = useInView(processRef, { once: true, margin: "-100px" });
  const solutionsInView = useInView(solutionsRef, { once: true, margin: "-100px" });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary via-primary/95 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 left-10 w-72 h-72 bg-brand-tiffany rounded-full blur-3xl" />
          <div className="absolute bottom-10 right-10 w-96 h-96 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-brand-tiffany/20 text-brand-tiffany text-sm font-medium mb-6">
              Serviços Especializados
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Transformamos sua operação{" "}
              <span className="text-brand-tiffany">jurídica</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Consultoria, desenvolvimento e mentoria para escritórios e departamentos 
              jurídicos que buscam excelência operacional e resultados mensuráveis.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-tiffany text-primary hover:bg-brand-tiffany/90">
                <Link to="/contato">
                  Agendar Diagnóstico Gratuito
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <Link to="/casos-de-sucesso">Ver Cases de Sucesso</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>

      {/* Main Services */}
      <section className="py-24" ref={servicesRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={servicesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos <span className="text-gradient">Serviços</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Soluções completas para cada etapa da transformação digital do seu escritório.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-2 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={servicesInView ? "visible" : "hidden"}
          >
            {mainServices.map((service) => {
              const IconComponent = service.icon;
              return (
                <motion.div key={service.title} variants={itemVariants}>
                  <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group overflow-hidden">
                    <CardHeader className="pb-4">
                      <div className="flex items-start gap-4">
                        <div className="w-14 h-14 rounded-xl bg-gradient-brand flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                          <IconComponent className="w-7 h-7 text-white" />
                        </div>
                        <div>
                          <CardTitle className="text-xl font-display mb-2 group-hover:text-brand-tiffany transition-colors">
                            {service.title}
                          </CardTitle>
                          <span className="inline-block px-3 py-1 rounded-full bg-accent/20 text-accent-foreground text-xs font-medium">
                            {service.highlight}
                          </span>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <CardDescription className="text-base mb-6">
                        {service.description}
                      </CardDescription>
                      <ul className="space-y-3">
                        {service.features.map((feature) => (
                          <li key={feature} className="flex items-start gap-3 text-sm text-muted-foreground">
                            <CheckCircle2 className="w-5 h-5 text-brand-tiffany shrink-0 mt-0.5" />
                            {feature}
                          </li>
                        ))}
                      </ul>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Process */}
      <section className="py-24 bg-muted/30" ref={processRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={processInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Como <span className="text-gradient">Trabalhamos</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Nosso processo é estruturado para garantir resultados e minimizar riscos.
            </p>
          </motion.div>

          <motion.div 
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={processInView ? "visible" : "hidden"}
          >
            {processSteps.map((step, index) => (
              <motion.div 
                key={step.step} 
                variants={itemVariants}
                className="relative"
              >
                <div className="text-center">
                  <div className="relative inline-block mb-6">
                    <span className="text-7xl font-display font-bold text-brand-tiffany/20">
                      {step.step}
                    </span>
                    <div className="absolute inset-0 flex items-center justify-center">
                      <div className="w-12 h-12 rounded-full bg-gradient-brand flex items-center justify-center text-white font-bold">
                        {index + 1}
                      </div>
                    </div>
                  </div>
                  <h3 className="text-xl font-display font-semibold text-foreground mb-3">
                    {step.title}
                  </h3>
                  <p className="text-muted-foreground">
                    {step.description}
                  </p>
                </div>
                {index < processSteps.length - 1 && (
                  <div className="hidden lg:block absolute top-12 left-[60%] w-[80%] h-0.5 bg-gradient-to-r from-brand-tiffany/50 to-transparent" />
                )}
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Solutions Link */}
      <section className="py-24" ref={solutionsRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossas <span className="text-gradient">Soluções</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Conheça também nosso portfólio de produtos e soluções prontas.
            </p>
          </motion.div>

          <motion.div 
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={solutionsInView ? "visible" : "hidden"}
          >
            {solutionPackages.map((solution) => {
              const IconComponent = solution.icon;
              return (
                <motion.div key={solution.title} variants={itemVariants}>
                  <Link to={solution.href}>
                    <Card className="h-full border-0 shadow-lg hover:shadow-xl transition-all duration-300 group hover:border-brand-tiffany/50 cursor-pointer">
                      <CardHeader className="text-center pb-4">
                        <div className="w-16 h-16 rounded-2xl bg-accent/20 flex items-center justify-center mx-auto mb-4 group-hover:bg-gradient-brand group-hover:text-white transition-all duration-300">
                          <IconComponent className="w-8 h-8 text-brand-tiffany group-hover:text-white transition-colors" />
                        </div>
                        <CardTitle className="text-xl font-display group-hover:text-brand-tiffany transition-colors">
                          {solution.title}
                        </CardTitle>
                      </CardHeader>
                      <CardContent className="text-center">
                        <CardDescription className="text-base mb-4">
                          {solution.description}
                        </CardDescription>
                        <span className="inline-flex items-center text-sm font-medium text-brand-tiffany group-hover:gap-2 transition-all">
                          Saiba mais
                          <ArrowRight className="w-4 h-4 ml-1 group-hover:translate-x-1 transition-transform" />
                        </span>
                      </CardContent>
                    </Card>
                  </Link>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-gradient-to-r from-primary via-secondary to-primary">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl mx-auto text-center">
            <Users className="w-16 h-16 text-brand-tiffany mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-foreground mb-6">
              Pronto para transformar sua operação?
            </h2>
            <p className="text-xl text-primary-foreground/80 mb-8">
              Agende um diagnóstico gratuito e descubra como podemos ajudar seu escritório 
              a alcançar novos patamares de eficiência e resultados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-brand-tiffany text-primary hover:bg-brand-tiffany/90">
                <Link to="/contato">
                  <Phone className="mr-2 w-5 h-5" />
                  Falar com Especialista
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/5511951920925" target="_blank" rel="noopener noreferrer">
                  WhatsApp Direto
                </a>
              </Button>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
}
