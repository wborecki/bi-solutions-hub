import { Layout } from "@/components/layout/Layout";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Link } from "react-router-dom";
import { 
  TrendingUp, 
  Clock, 
  Users, 
  Target,
  ArrowRight,
  Quote,
  BarChart3,
  Bot,
  Scale,
  Building2,
  Briefcase,
  Award
} from "lucide-react";
import { motion } from "framer-motion";
import { useInView } from "framer-motion";
import { useRef } from "react";

const cases = [
  {
    id: "escritorio-corporativo",
    client: "Escritório de Advocacia Corporativa",
    segment: "Contencioso Cível",
    size: "50+ advogados",
    icon: Building2,
    solution: "Business Intelligence",
    solutionIcon: BarChart3,
    challenge: "Falta de visibilidade sobre a carteira de processos, dificuldade em prever demandas e custos, relatórios manuais que consumiam horas da equipe.",
    results: [
      { metric: "80%", label: "Redução no tempo de relatórios", icon: Clock },
      { metric: "35%", label: "Aumento na produtividade", icon: TrendingUp },
      { metric: "100%", label: "Visibilidade da carteira", icon: Target }
    ],
    testimonial: {
      quote: "A Solutions in BI transformou completamente nossa gestão. Hoje temos dados atualizados e tomamos decisões muito mais assertivas.",
      author: "Diretor de Operações",
      role: "Escritório de Advocacia Corporativa"
    },
    tags: ["Power BI", "Dashboards", "KPIs", "Gestão Processual"]
  },
  {
    id: "departamento-juridico",
    client: "Departamento Jurídico de Multinacional",
    segment: "Indústria",
    size: "200+ colaboradores",
    icon: Briefcase,
    solution: "Robôs Jurídicos",
    solutionIcon: Bot,
    challenge: "Consultas manuais em diversos tribunais consumindo tempo precioso dos analistas, alto risco de perda de prazos e informações desatualizadas.",
    results: [
      { metric: "95%", label: "Automação de consultas", icon: Bot },
      { metric: "12h", label: "Economia diária da equipe", icon: Clock },
      { metric: "0", label: "Prazos perdidos desde implantação", icon: Target }
    ],
    testimonial: {
      quote: "Os robôs jurídicos liberaram nossa equipe para atividades estratégicas. O retorno sobre investimento foi percebido já no primeiro mês.",
      author: "Gerente Jurídico",
      role: "Multinacional do setor industrial"
    },
    tags: ["Automação", "PJe", "Tribunais", "Monitoramento"]
  },
  {
    id: "escritorio-trabalhista",
    client: "Escritório Especializado em Trabalhista",
    segment: "Direito Trabalhista",
    size: "30 advogados",
    icon: Award,
    solution: "Jurimetria",
    solutionIcon: Scale,
    challenge: "Dificuldade em precificar riscos e estabelecer provisões adequadas. Falta de dados para negociações estratégicas com clientes corporativos.",
    results: [
      { metric: "40%", label: "Melhoria na precificação", icon: TrendingUp },
      { metric: "3x", label: "Mais contratos fechados", icon: Target },
      { metric: "25%", label: "Redução em provisões", icon: Clock }
    ],
    testimonial: {
      quote: "A jurimetria nos deu argumentos sólidos baseados em dados para negociar com grandes clientes. Triplicamos nossa carteira corporativa.",
      author: "Sócio-Fundador",
      role: "Escritório Trabalhista"
    },
    tags: ["Análise Estatística", "Gestão de Riscos", "Provisões", "Jurisprudência"]
  }
];

const stats = [
  { value: "50+", label: "Clientes atendidos" },
  { value: "98%", label: "Taxa de satisfação" },
  { value: "500k+", label: "Processos analisados" },
  { value: "R$ 2M+", label: "Economia gerada" }
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: { staggerChildren: 0.2 }
  }
};

const itemVariants = {
  hidden: { opacity: 0, y: 50 } as const,
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.6, ease: "easeOut" as const }
  }
};

export default function CasesDeSucesso() {
  const statsRef = useRef(null);
  const casesRef = useRef(null);
  
  const statsInView = useInView(statsRef, { once: true, margin: "-50px" });
  const casesInView = useInView(casesRef, { once: true, margin: "-100px" });

  return (
    <Layout>
      {/* Hero */}
      <section className="relative pt-32 pb-20 bg-gradient-to-b from-primary via-primary/95 to-background overflow-hidden">
        <div className="absolute inset-0 opacity-10">
          <div className="absolute top-20 right-20 w-80 h-80 bg-accent rounded-full blur-3xl" />
          <div className="absolute bottom-0 left-10 w-64 h-64 bg-secondary rounded-full blur-3xl" />
        </div>
        
        <div className="container mx-auto px-4 relative">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-6">
              Histórias de Sucesso
            </span>
            <h1 className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-primary-foreground mb-6">
              Resultados que{" "}
              <span className="text-accent">transformam</span>
            </h1>
            <p className="text-xl text-primary-foreground/80 mb-8 leading-relaxed">
              Conheça como nossos clientes alcançaram resultados extraordinários 
              com as soluções da Solutions in BI.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Stats */}
      <section className="py-16 bg-muted/50" ref={statsRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="grid grid-cols-2 md:grid-cols-4 gap-8"
            variants={containerVariants}
            initial="hidden"
            animate={statsInView ? "visible" : "hidden"}
          >
            {stats.map((stat) => (
              <motion.div 
                key={stat.label} 
                variants={itemVariants}
                className="text-center"
              >
                <div className="text-4xl md:text-5xl font-display font-bold text-gradient mb-2">
                  {stat.value}
                </div>
                <div className="text-sm text-muted-foreground">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      {/* Cases */}
      <section className="py-24" ref={casesRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-16"
            initial={{ opacity: 0, y: 30 }}
            animate={casesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Cases em <span className="text-gradient">Destaque</span>
            </h2>
            <p className="text-lg text-muted-foreground">
              Cada projeto é uma parceria estratégica com resultados mensuráveis.
            </p>
          </motion.div>

          <motion.div 
            className="space-y-16"
            variants={containerVariants}
            initial="hidden"
            animate={casesInView ? "visible" : "hidden"}
          >
            {cases.map((caseItem, index) => {
              const ClientIcon = caseItem.icon;
              const SolutionIcon = caseItem.solutionIcon;
              const isEven = index % 2 === 0;
              
              return (
                <motion.div 
                  key={caseItem.id} 
                  variants={itemVariants}
                >
                  <Card className="overflow-hidden border-0 shadow-xl">
                    <div className={`grid lg:grid-cols-2 ${isEven ? '' : 'lg:flex-row-reverse'}`}>
                      {/* Content Side */}
                      <CardContent className={`p-8 lg:p-12 ${isEven ? '' : 'lg:order-2'}`}>
                        <div className="flex items-center gap-3 mb-6">
                          <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center">
                            <ClientIcon className="w-6 h-6 text-white" />
                          </div>
                          <div>
                            <h3 className="font-display font-semibold text-lg text-foreground">
                              {caseItem.client}
                            </h3>
                            <p className="text-sm text-muted-foreground">
                              {caseItem.segment} • {caseItem.size}
                            </p>
                          </div>
                        </div>

                        <div className="flex items-center gap-2 mb-6">
                          <Badge variant="secondary" className="bg-accent/20 text-accent-foreground">
                            <SolutionIcon className="w-3 h-3 mr-1" />
                            {caseItem.solution}
                          </Badge>
                        </div>

                        <div className="mb-8">
                          <h4 className="text-sm font-semibold text-muted-foreground uppercase tracking-wider mb-2">
                            O Desafio
                          </h4>
                          <p className="text-foreground">
                            {caseItem.challenge}
                          </p>
                        </div>

                        {/* Results */}
                        <div className="grid grid-cols-3 gap-4 mb-8">
                          {caseItem.results.map((result) => {
                            const ResultIcon = result.icon;
                            return (
                              <div key={result.label} className="text-center p-4 rounded-xl bg-muted/50">
                                <ResultIcon className="w-5 h-5 text-accent mx-auto mb-2" />
                                <div className="text-2xl font-display font-bold text-foreground">
                                  {result.metric}
                                </div>
                                <div className="text-xs text-muted-foreground">
                                  {result.label}
                                </div>
                              </div>
                            );
                          })}
                        </div>

                        {/* Tags */}
                        <div className="flex flex-wrap gap-2">
                          {caseItem.tags.map((tag) => (
                            <Badge key={tag} variant="outline" className="text-xs">
                              {tag}
                            </Badge>
                          ))}
                        </div>
                      </CardContent>

                      {/* Testimonial Side */}
                      <div className={`bg-gradient-to-br from-primary to-secondary p-8 lg:p-12 flex flex-col justify-center ${isEven ? '' : 'lg:order-1'}`}>
                        <Quote className="w-12 h-12 text-accent/50 mb-6" />
                        <blockquote className="text-xl lg:text-2xl text-primary-foreground font-display leading-relaxed mb-8">
                          "{caseItem.testimonial.quote}"
                        </blockquote>
                        <div>
                          <div className="text-primary-foreground font-semibold">
                            {caseItem.testimonial.author}
                          </div>
                          <div className="text-primary-foreground/70 text-sm">
                            {caseItem.testimonial.role}
                          </div>
                        </div>
                      </div>
                    </div>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* CTA */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <Award className="w-16 h-16 text-accent mx-auto mb-6" />
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-6">
              Seu escritório pode ser o próximo case de sucesso
            </h2>
            <p className="text-xl text-muted-foreground mb-8">
              Agende uma conversa e descubra como podemos transformar sua operação 
              jurídica com soluções orientadas a dados.
            </p>
            <div className="flex flex-col sm:flex-row gap-4 justify-center">
              <Button asChild size="lg" className="bg-primary hover:bg-primary/90">
                <Link to="/contato">
                  Quero ser um Case
                  <ArrowRight className="ml-2 w-5 h-5" />
                </Link>
              </Button>
              <Button asChild size="lg" variant="outline">
                <Link to="/servicos">Ver Nossos Serviços</Link>
              </Button>
            </div>
          </motion.div>
        </div>
      </section>
    </Layout>
  );
}
