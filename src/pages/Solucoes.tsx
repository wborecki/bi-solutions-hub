import { Link } from "react-router-dom";
import {
  ArrowRight, BarChart3, Bot, Scale, CheckCircle, Plug,
  Lightbulb, LayoutDashboard, Zap, Shield, Users, GraduationCap, Monitor, Database, Workflow,
} from "lucide-react";
import { CTASection } from "@/components/home/CTASection";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { cn } from "@/lib/utils";
import { OptimizedImage } from "@/components/OptimizedImage";
import solutionsHero from "@/assets/solutions-hero.webp";

const solutions = [
  {
    icon: Workflow,
    title: "Automação de Fluxos",
    description:
      "Automatize processos conectando seus sistemas em fluxos inteligentes. Elimine tarefas manuais e ganhe eficiência operacional.",
    features: [
      "Fluxos automatizados entre sistemas",
      "Gatilhos inteligentes por eventos",
      "Notificações automáticas",
      "Integração com e-mail, CRM e ERP",
    ],
    href: "/solucoes/automacao-ia",
    accent: "primary",
  },
  {
    icon: BarChart3,
    title: "Business Intelligence",
    description:
      "Dashboards e relatórios que transformam dados brutos em insights acionáveis para decisões mais rápidas e assertivas.",
    features: [
      "Dashboards interativos em Power BI",
      "KPIs e métricas de performance",
      "Integração de múltiplas fontes de dados",
      "Relatórios automatizados",
    ],
    href: "/solucoes/business-intelligence",
    accent: "accent",
  },
  {
    icon: Scale,
    title: "Jurimetria",
    description:
      "Análise estatística de dados jurídicos para previsibilidade processual, gestão de riscos e estratégia baseada em evidências.",
    features: [
      "Análise estatística de resultados",
      "Pareceres jurimétricos detalhados",
      "Tendências jurisprudenciais",
      "Estatísticas por tribunal e relator",
    ],
    href: "/solucoes/jurimetria",
    accent: "primary",
  },
  {
    icon: LayoutDashboard,
    title: "Dashboards Customizados",
    description:
      "Painéis interativos e personalizados para acompanhar os indicadores mais importantes do seu negócio.",
    features: [
      "Visualizações sob medida",
      "Atualização contínua de dados",
      "Acesso mobile e desktop",
      "Drill-down e filtros dinâmicos",
    ],
    href: "/solucoes/business-intelligence",
    accent: "accent",
  },
  {
    icon: Plug,
    title: "Integrações",
    description:
      "Conecte seus sistemas e centralize informações. Eliminamos silos de dados e criamos um ecossistema integrado e eficiente.",
    features: [
      "APIs e conectores customizados",
      "Integração entre ERPs e CRMs",
      "Sincronização automática de dados",
      "Middleware e ETL avançado",
    ],
    href: "/contato",
    accent: "primary",
  },
  {
    icon: Monitor,
    title: "Implantação de Sistemas Jurídicos",
    description:
      "Implantação, configuração e personalização de sistemas jurídicos para escritórios e departamentos jurídicos.",
    features: [
      "Configuração personalizada",
      "Migração de dados",
      "Treinamento da equipe",
      "Suporte na adoção",
    ],
    href: "/solucoes/implantacao-sistemas",
    accent: "primary",
  },
  {
    icon: GraduationCap,
    title: "Mentoria de Power BI",
    description:
      "Aprenda Power BI com especialistas e domine a criação de dashboards, relatórios e análises de dados para seu negócio.",
    features: [
      "Aulas práticas e personalizadas",
      "Projetos com dados reais",
      "Acompanhamento individual",
      "Certificado de conclusão",
    ],
    href: "/solucoes/mentoria-power-bi",
    accent: "accent",
  },
  {
    icon: Database,
    title: "Coleta de Dados",
    description:
      "Captura e organização de informações de diversas fontes públicas e privadas para alimentar suas análises e decisões estratégicas.",
    features: [
      "Coleta automatizada de fontes públicas",
      "Organização e limpeza de dados",
      "Atualização periódica programada",
      "Entrega em formatos prontos para análise",
    ],
    href: "/solucoes/coleta-de-dados",
    accent: "primary",
  },
];

const differentials = [
  { icon: Shield, label: "Segurança", desc: "Dados protegidos com as melhores práticas" },
  { icon: Zap, label: "Agilidade", desc: "Entregas rápidas e incrementais" },
  { icon: Users, label: "Suporte", desc: "Acompanhamento dedicado pós-entrega" },
  { icon: Lightbulb, label: "Inovação", desc: "Tecnologia de ponta aplicada ao seu negócio" },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Solucoes = () => {
  const gridRef = useRef(null);
  const diffRef = useRef(null);
  const gridInView = useInView(gridRef, { once: true, margin: "-80px" });
  const diffInView = useInView(diffRef, { once: true, margin: "-80px" });

  return (
    <Layout>
      <SEO
        title="Soluções em BI, Automação e Jurimetria"
        description="Conheça nossas soluções em Business Intelligence, automação de processos, jurimetria e integrações para o mercado jurídico e corporativo."
        canonical="/solucoes"
      />
      {/* Hero */}
      <section className="pt-28 pb-16 md:pt-36 md:pb-20">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-semibold">
                Nossas Soluções
              </span>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-primary-dark">
                Tecnologia que transforma{" "}
                <span className="text-gradient">resultados</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Soluções completas de automação, inteligência artificial e Business Intelligence
                para empresas que querem escalar com eficiência.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link to="/contato">
                    Solicitar Diagnóstico Gratuito
                    <ArrowRight className="ml-2 h-4 w-4" />
                  </Link>
                </Button>
                <Button asChild size="lg" variant="outline">
                  <a href="https://wa.me/551151920925" target="_blank" rel="noopener noreferrer">
                    Falar no WhatsApp
                  </a>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <OptimizedImage
                src={solutionsHero}
                alt="Ilustração de soluções em automação e Business Intelligence"
                className="w-[480px] h-auto"
                loading="eager"
              />
            </motion.div>
          </div>
        </div>
      </section>

      {/* Grid de Soluções */}
      <section className="py-20 md:py-28" ref={gridRef}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-14"
            initial={{ opacity: 0, y: 30 }}
            animate={gridInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              O que <span className="text-gradient">oferecemos</span>
            </h2>
            <p className="text-muted-foreground text-lg">
              Cada solução é desenhada para resolver desafios reais e gerar impacto mensurável.
            </p>
          </motion.div>

          <motion.div
            className="flex flex-wrap justify-center gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={gridInView ? "visible" : "hidden"}
          >
            {solutions.map((sol) => {
              const Icon = sol.icon;
              const isAccent = sol.accent === "accent";
              
              return (
                <motion.div 
                  key={sol.title} 
                  variants={itemVariants}
                  className="w-full md:w-[calc(50%-12px)] lg:w-[calc(33.333%-16px)]"
                >
                  <Card className="h-full rounded-2xl border bg-card hover:shadow-lg transition-all duration-300 group overflow-hidden">
                    <CardContent className="p-6 flex flex-col h-full">
                      <div
                        className={cn(
                          "w-12 h-12 rounded-xl flex items-center justify-center mb-4",
                          isAccent ? "bg-accent/15" : "bg-primary/15"
                        )}
                      >
                        <Icon className={cn("h-6 w-6", isAccent ? "text-accent" : "text-primary")} />
                      </div>
                      <h3 className="text-lg font-display font-bold mb-2 group-hover:text-primary transition-colors">
                        {sol.title}
                      </h3>
                      <p className="text-sm text-muted-foreground leading-relaxed mb-5">
                        {sol.description}
                      </p>

                      <ul className="space-y-2 mb-6 flex-1">
                        {sol.features.map((f) => (
                          <li key={f} className="flex items-start gap-2 text-sm text-muted-foreground">
                            <CheckCircle className="h-4 w-4 text-accent shrink-0 mt-0.5" />
                            {f}
                          </li>
                        ))}
                      </ul>

                      <Button asChild variant="ghost" className="w-full justify-between group/btn">
                        <Link to={sol.href}>
                          Saiba mais
                          <ArrowRight className="h-4 w-4 group-hover/btn:translate-x-1 transition-transform" />
                        </Link>
                      </Button>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-20 bg-muted/50" ref={diffRef}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={diffInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-3">
              Por que a <span className="text-gradient">SBI</span>?
            </h2>
            <p className="text-muted-foreground text-lg">
              Mais do que ferramentas, entregamos parceria e resultados.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={diffInView ? "visible" : "hidden"}
          >
            {differentials.map((d) => {
              const Icon = d.icon;
              return (
                <motion.div key={d.label} variants={itemVariants}>
                  <div className="text-center p-6 rounded-2xl bg-card border hover:shadow-md transition-shadow h-full">
                    <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto mb-4">
                      <Icon className="h-7 w-7 text-primary" />
                    </div>
                    <h3 className="font-display font-bold text-lg mb-1">{d.label}</h3>
                    <p className="text-sm text-muted-foreground">{d.desc}</p>
                  </div>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Solucoes;
