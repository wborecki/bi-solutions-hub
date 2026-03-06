import { Layout } from "@/components/layout/Layout";
import { Link } from "react-router-dom";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Shield, Sparkles, ArrowRight, Bot, BarChart3, LayoutDashboard,
  Plug, MessageSquare, Lightbulb, Search, Cpu, Rocket, Quote, ExternalLink,
} from "lucide-react";

const solutions = [
  { icon: Bot, title: "Automação IA", description: "Automatize processos repetitivos com inteligência artificial avançada." },
  { icon: BarChart3, title: "Business Intelligence", description: "Relatórios e análises estratégicas para decisões baseadas em dados." },
  { icon: LayoutDashboard, title: "Dashboards", description: "Painéis interativos e customizados para visualização em tempo real." },
  { icon: Plug, title: "Integrações", description: "Conecte seus sistemas e centralize informações automaticamente." },
  { icon: MessageSquare, title: "Chatbots", description: "Atendimento inteligente 24/7 com IA conversacional." },
  { icon: Lightbulb, title: "Consultoria", description: "Orientação especializada para transformação digital do seu negócio." },
];

const steps = [
  { icon: Search, title: "Diagnóstico", description: "Analisamos seus processos e identificamos oportunidades de melhoria." },
  { icon: Cpu, title: "Desenvolvimento", description: "Criamos soluções sob medida com tecnologia de ponta." },
  { icon: Rocket, title: "Entrega e Suporte", description: "Implantamos, treinamos e acompanhamos seus resultados." },
];

const testimonials = [
  {
    name: "Ana Carolina Simão",
    role: "Administradora",
    company: "Vernalha Pereira",
    content: "Solutions in BI nos ajudou a organizar dados estratégicos, possibilitando decisões assertivas nos âmbitos jurídico e paralegal.",
  },
  {
    name: "Fabiane Maciel",
    role: "Diretora Financeira",
    company: "Sofá Novo de Novo",
    content: "A SBI entrou na empresa como parte de uma melhoria contínua. Além de nos atender de forma customizada, realizamos reuniões que agregaram ainda mais valor.",
  },
  {
    name: "Karin Lima",
    role: "CEO",
    company: "Othree Tech",
    content: "Estou impressionada com o serviço de Business Intelligence. Integrar dados de múltiplas fontes nos permitiu processar volumes de dados com precisão.",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 30 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Section = React.forwardRef<HTMLElement, { children: React.ReactNode; className?: string }>(
  ({ children, className = "" }, ref) => (
    <section ref={ref} className={`py-16 md:py-24 ${className}`}>{children}</section>
  )
);
Section.displayName = "Section";

const Index = () => {
  const solutionsRef = useRef(null);
  const stepsRef = useRef(null);
  const testimonialsRef = useRef(null);
  const solutionsInView = useInView(solutionsRef, { once: true, margin: "-100px" });
  const stepsInView = useInView(stepsRef, { once: true, margin: "-100px" });
  const testimonialsInView = useInView(testimonialsRef, { once: true, margin: "-100px" });

  return (
    <Layout>
      {/* Hero */}
      <Section className="pt-28 md:pt-36">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12 items-center">
            <motion.div
              className="space-y-6"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6 }}
            >
              <div className="flex gap-2">
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Shield className="h-3 w-3" /> Confiável
                </span>
                <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full inline-flex items-center gap-1">
                  <Sparkles className="h-3 w-3" /> Inovador
                </span>
              </div>
              <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold leading-tight text-foreground">
                Transformamos dados em{" "}
                <span className="text-gradient">decisões inteligentes</span>
              </h1>
              <p className="text-lg text-muted-foreground leading-relaxed max-w-lg">
                Soluções de automação e inteligência artificial para empresas que querem escalar com eficiência.
              </p>
              <div className="flex flex-wrap gap-3 pt-2">
                <Button asChild size="lg">
                  <Link to="/contato">
                    Fale Conosco <ArrowRight className="h-4 w-4 ml-2" />
                  </Link>
                </Button>
                <Button asChild variant="outline" size="lg">
                  <Link to="/solucoes">Ver Soluções</Link>
                </Button>
              </div>
            </motion.div>

            <motion.div
              className="relative hidden lg:flex items-center justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.7, delay: 0.2 }}
            >
              <div className="w-80 h-80 rounded-full bg-primary/10 flex items-center justify-center">
                <div className="w-56 h-56 rounded-full bg-primary/20 flex items-center justify-center">
                  <div className="w-32 h-32 rounded-full bg-primary flex items-center justify-center">
                    <span className="text-primary-foreground font-display font-bold text-3xl">SBI</span>
                  </div>
                </div>
              </div>
              {/* Floating badges */}
              <motion.div
                className="absolute top-8 right-4 bg-card border rounded-xl shadow-md px-4 py-3"
                animate={{ y: [0, -8, 0] }}
                transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
              >
                <p className="text-sm font-semibold">+50 projetos</p>
                <p className="text-xs text-muted-foreground">entregues</p>
              </motion.div>
              <motion.div
                className="absolute bottom-12 left-0 bg-card border rounded-xl shadow-md px-4 py-3"
                animate={{ y: [0, 8, 0] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
              >
                <p className="text-sm font-semibold">100% satisfação</p>
                <p className="text-xs text-muted-foreground">dos clientes</p>
              </motion.div>
            </motion.div>
          </div>
        </div>
      </Section>

      {/* Como funciona */}
      <Section className="bg-muted/50" ref={stepsRef}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={stepsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Processo</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-3">Como funciona</h2>
            <p className="text-muted-foreground">Do diagnóstico à entrega, um processo simples e transparente.</p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={stepsInView ? "visible" : "hidden"}
          >
            {steps.map((step, i) => {
              const Icon = step.icon;
              return (
                <motion.div key={step.title} variants={itemVariants}>
                  <Card className="text-center rounded-xl border bg-card hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-8 pb-6 px-6 space-y-4">
                      <div className="w-14 h-14 rounded-full bg-primary/10 flex items-center justify-center mx-auto">
                        <Icon className="h-7 w-7 text-primary" />
                      </div>
                      <span className="text-xs font-semibold text-muted-foreground">Passo {i + 1}</span>
                      <h3 className="text-xl font-display font-bold">{step.title}</h3>
                      <p className="text-sm text-muted-foreground">{step.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* Soluções */}
      <Section ref={solutionsRef}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={solutionsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Soluções</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-3">O que oferecemos</h2>
            <p className="text-muted-foreground">Tecnologia de ponta para cada necessidade do seu negócio.</p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={solutionsInView ? "visible" : "hidden"}
          >
            {solutions.map((sol) => {
              const Icon = sol.icon;
              return (
                <motion.div key={sol.title} variants={itemVariants}>
                  <Card className="rounded-xl border bg-card hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-6 pb-6 px-6 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-lg font-display font-bold">{sol.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{sol.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </Section>

      {/* Produto Bia */}
      <Section className="bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="grid lg:grid-cols-2 gap-12 items-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <div className="space-y-5">
              <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">Produto em Destaque</span>
              <h2 className="text-3xl md:text-4xl font-display font-bold">
                Conheça a <span className="text-gradient">Bia</span>
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                Sua secretária pessoal no WhatsApp. A Bia utiliza inteligência artificial para organizar sua rotina, agendar compromissos e responder mensagens automaticamente.
              </p>
              <ul className="space-y-2">
                {["Agendamento inteligente", "Respostas automáticas", "Integração com calendário", "Disponível 24/7"].map((item) => (
                  <li key={item} className="flex items-center gap-2 text-sm text-muted-foreground">
                    <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                    {item}
                  </li>
                ))}
              </ul>
              <Button asChild variant="outline">
                <a href="https://bia.solutionsinbi.com" target="_blank" rel="noopener noreferrer">
                  Conhecer a Bia <ExternalLink className="h-4 w-4 ml-2" />
                </a>
              </Button>
            </div>
            <div className="flex items-center justify-center">
              <div className="w-64 h-64 rounded-3xl bg-accent/10 flex items-center justify-center border border-accent/20">
                <div className="text-center space-y-2">
                  <MessageSquare className="h-16 w-16 text-accent mx-auto" />
                  <p className="font-display font-bold text-2xl">Bia</p>
                  <p className="text-xs text-muted-foreground">Secretária IA</p>
                </div>
              </div>
            </div>
          </motion.div>
        </div>
      </Section>

      {/* Depoimentos */}
      <Section ref={testimonialsRef}>
        <div className="max-w-6xl mx-auto px-4">
          <motion.div
            className="text-center max-w-2xl mx-auto mb-12"
            initial={{ opacity: 0, y: 30 }}
            animate={testimonialsInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Depoimentos</span>
            <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-3">O que nossos clientes dizem</h2>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-3 gap-6"
            variants={containerVariants}
            initial="hidden"
            animate={testimonialsInView ? "visible" : "hidden"}
          >
            {testimonials.map((t) => (
              <motion.div key={t.name} variants={itemVariants}>
                <Card className="rounded-xl border bg-card hover:shadow-md transition-shadow h-full">
                  <CardContent className="pt-6 pb-6 px-6 space-y-4">
                    <Quote className="h-8 w-8 text-primary/30" />
                    <p className="text-sm text-muted-foreground leading-relaxed italic">"{t.content}"</p>
                    <div className="flex items-center gap-3 pt-2">
                      <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center">
                        <span className="text-xs font-bold text-primary">
                          {t.name.split(" ").map((n) => n[0]).join("")}
                        </span>
                      </div>
                      <div>
                        <p className="text-sm font-semibold">{t.name}</p>
                        <p className="text-xs text-muted-foreground">{t.role} · {t.company}</p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </Section>

      {/* CTA */}
      <Section className="bg-primary text-primary-foreground">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div
            className="max-w-2xl mx-auto space-y-6"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold">
              Pronto para transformar seus dados em resultados?
            </h2>
            <p className="text-primary-foreground/80 text-lg">
              Entre em contato e descubra como nossas soluções podem impulsionar seu negócio.
            </p>
            <div className="flex flex-wrap gap-3 justify-center">
              <Button asChild size="lg" variant="secondary">
                <Link to="/contato">
                  Solicitar Contato <ArrowRight className="h-4 w-4 ml-2" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline" className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10">
                <a href="https://wa.me/551151920925" target="_blank" rel="noopener noreferrer">
                  WhatsApp
                </a>
              </Button>
            </div>
          </motion.div>
        </div>
      </Section>
    </Layout>
  );
};

export default Index;
