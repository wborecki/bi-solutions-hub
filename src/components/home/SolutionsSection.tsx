import { Link } from "react-router-dom";
import { ArrowRight, BarChart3, Bot, Scale } from "lucide-react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";
import solutionBi from "@/assets/solution-bi.webp";
import solutionRobos from "@/assets/solution-robos.webp";
import solutionJurimetria from "@/assets/solution-jurimetria.webp";

const solutions = [
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Desenvolvimento de dashboards e relatórios customizados para análise de dados estratégicos, permitindo decisões mais assertivas.",
    features: ["Dashboards Power BI", "Relatórios automatizados", "KPIs personalizados", "Integração de dados"],
    href: "/solucoes/business-intelligence",
    color: "bg-primary",
    image: solutionBi,
  },
  {
    icon: Bot,
    title: "Robôs Jurídicos",
    description: "Automação de consultas em tribunais e sistemas jurídicos, reduzindo tempo em tarefas repetitivas e minimizando riscos operacionais.",
    features: ["Consultas automáticas", "Monitoramento processual", "Extração de dados", "Alertas inteligentes"],
    href: "/solucoes/robos-juridicos",
    color: "bg-secondary",
    image: solutionRobos,
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description: "Análise estatística de dados jurídicos para previsibilidade processual, gestão de riscos e insights estratégicos baseados em dados.",
    features: ["Análise estatística", "Pareceres jurimétricos", "Gestão de riscos", "Tendências jurisprudenciais"],
    href: "/solucoes/jurimetria",
    color: "bg-accent",
    image: solutionJurimetria,
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.2,
    },
  },
};

const itemVariants = {
  hidden: { opacity: 0, y: 60 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.6,
      ease: "easeOut" as const,
    },
  },
};

export function SolutionsSection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-muted/30 overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Nossas Soluções
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            Transforme dados em{" "}
            <span className="text-gradient">decisões estratégicas</span>
          </motion.h2>
          <motion.p 
            className="text-lg text-muted-foreground"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Oferecemos um portfólio completo de serviços especializados para escritórios de advocacia, 
            departamentos jurídicos e empresas em geral.
          </motion.p>
        </motion.div>

        {/* Solutions Grid */}
        <motion.div 
          className="grid md:grid-cols-2 lg:grid-cols-3 gap-8"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {solutions.map((solution, index) => {
            const IconComponent = solution.icon;
            return (
              <motion.div key={solution.title} variants={itemVariants}>
                <Card className="group relative overflow-hidden border-0 shadow-lg hover:shadow-2xl transition-all duration-500 h-full">
                  {/* Image header */}
                  <div className="relative h-48 overflow-hidden">
                    <motion.img 
                      src={solution.image} 
                      alt={solution.title}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                    <div className="absolute inset-0 bg-gradient-to-t from-background via-background/50 to-transparent" />
                    <div className={cn(
                      "absolute top-4 left-4 w-12 h-12 rounded-xl flex items-center justify-center",
                      solution.color,
                      "text-white shadow-lg"
                    )}>
                      <IconComponent className="w-6 h-6" />
                    </div>
                  </div>
                  
                  <CardHeader className="pb-4 relative">
                    <CardTitle className="text-xl font-display group-hover:text-accent transition-colors">
                      {solution.title}
                    </CardTitle>
                    <CardDescription className="text-base">
                      {solution.description}
                    </CardDescription>
                  </CardHeader>

                  <CardContent>
                    <ul className="space-y-2 mb-6">
                      {solution.features.map((feature, i) => (
                        <motion.li 
                          key={feature} 
                          className="flex items-center gap-2 text-sm text-muted-foreground"
                          initial={{ opacity: 0, x: -20 }}
                          animate={isInView ? { opacity: 1, x: 0 } : {}}
                          transition={{ delay: 0.5 + (index * 0.1) + (i * 0.05) }}
                        >
                          <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                          {feature}
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button asChild variant="ghost" className="group/btn p-0 h-auto font-medium text-primary hover:text-accent">
                      <Link to={solution.href}>
                        Saiba mais
                        <ArrowRight className="w-4 h-4 ml-2 transition-transform group-hover/btn:translate-x-1" />
                      </Link>
                    </Button>
                  </CardContent>

                  {/* Hover overlay */}
                  <motion.div 
                    className="absolute inset-0 border-2 border-accent/0 rounded-lg pointer-events-none"
                    whileHover={{ borderColor: "hsl(172 30% 62% / 0.5)" }}
                    transition={{ duration: 0.3 }}
                  />
                </Card>
              </motion.div>
            );
          })}
        </motion.div>

        {/* CTA */}
        <motion.div 
          className="text-center mt-12"
          initial={{ opacity: 0, y: 20 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ delay: 0.8 }}
        >
          <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
            <Link to="/solucoes">Ver Todas as Soluções</Link>
          </Button>
        </motion.div>
      </div>
    </section>
  );
}
