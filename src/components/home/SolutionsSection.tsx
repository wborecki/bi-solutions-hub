import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, Bot, Scale, Plug, LayoutDashboard,
  GraduationCap, Monitor, Database, Workflow, Compass,
} from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

const solutions = [
  {
    icon: Workflow,
    title: "Automação de Fluxos",
    description: "Automatize processos e conecte seus sistemas com fluxos inteligentes.",
    href: "/solucoes/automacao-ia",
  },
  {
    icon: Bot,
    title: "Robôs Jurídicos",
    description: "Automatize consultas processuais e tarefas repetitivas para ganhar produtividade com segurança.",
    href: "/solucoes/robos-juridicos",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description: "Relatórios e análises estratégicas para decisões baseadas em dados.",
    href: "/solucoes/business-intelligence",
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description: "Análise estatística de dados jurídicos para previsibilidade e decisões estratégicas.",
    href: "/solucoes/jurimetria",
  },
  {
    icon: Plug,
    title: "Integrações",
    description: "Conecte seus sistemas e centralize informações automaticamente.",
    href: "/solucoes/integracoes",
  },
  {
    icon: Monitor,
    title: "Implantação de Sistemas",
    description: "Implantação e configuração de sistemas jurídicos sob medida.",
    href: "/solucoes/implantacao-sistemas",
  },
  {
    icon: GraduationCap,
    title: "Mentoria Power BI",
    description: "Aprenda Power BI com especialistas e domine a análise de dados.",
    href: "/solucoes/mentoria-power-bi",
  },
  {
    icon: Compass,
    title: "Consultoria",
    description: "Orientação especializada para transformação digital do seu negócio.",
    href: "/solucoes/consultoria",
  },
  {
    icon: Database,
    title: "Coleta de Dados",
    description: "Captura e organização de informações de diversas fontes para alimentar suas análises.",
    href: "/solucoes/coleta-de-dados",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.08 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
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
          className="flex flex-wrap justify-center gap-6"
          variants={containerVariants}
          initial="hidden"
          animate={isInView ? "visible" : "hidden"}
        >
          {solutions.map((sol) => {
            const Icon = sol.icon;
            return (
              <motion.div
                key={sol.title}
                variants={itemVariants}
                className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
              >
                <Link to={sol.href} className="block h-full">
                  <Card className="h-full rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6">
                      <div className="w-12 h-12 rounded-xl bg-primary/15 flex items-center justify-center mb-4">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors">
                        {sol.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">
                        {sol.description}
                      </p>
                      <ArrowRight className="h-4 w-4 text-primary mt-4 opacity-0 group-hover:opacity-100 transition-opacity" />
                    </CardContent>
                  </Card>
                </Link>
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
