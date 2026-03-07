import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Lightbulb, Shield, Heart, Award, Users, CheckCircle, Linkedin } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import logoSbi from "@/assets/logo-sbi.png";
import teamWillian from "@/assets/team-willian-photo.jpg";
import teamElisa from "@/assets/team-elisa-photo.jpg";

const values = [
  { icon: Lightbulb, label: "Inovação", description: "Buscamos constantemente novas formas de resolver problemas com tecnologia." },
  { icon: Shield, label: "Transparência", description: "Comunicação clara e honesta em cada etapa do projeto." },
  { icon: Heart, label: "Compromisso", description: "Dedicação total ao sucesso de cada cliente e projeto." },
  { icon: Award, label: "Excelência", description: "Padrões elevados de qualidade em tudo que entregamos." },
  { icon: Users, label: "Foco no Cliente", description: "Soluções pensadas a partir das necessidades reais do seu negócio." },
];

const diferenciais = [
  "Experiência técnica comprovada",
  "Soluções personalizadas",
  "Atendimento diferenciado",
  "Tecnologia de ponta",
  "Resultados mensuráveis",
  "Parceria de longo prazo",
];

const team = [
  {
    name: "Willian Ribeiro",
    role: "CEO & Co-Fundador",
    bio: "Especialista em Business Intelligence e análise de dados, com ampla experiência em soluções tecnológicas para o mercado jurídico e corporativo.",
    photo: teamWillian,
    linkedin: "https://www.linkedin.com/in/willian-ribeiro",
  },
  {
    name: "Elisa Ribeiro",
    role: "COO & Co-Fundadora",
    bio: "Profissional com sólida experiência em gestão de projetos e operações, responsável por garantir a excelência na entrega de cada solução.",
    photo: teamElisa,
    linkedin: "https://www.linkedin.com/in/elisa-ribeiro",
  },
];

const containerVariants = {
  hidden: { opacity: 0 },
  visible: { opacity: 1, transition: { staggerChildren: 0.1 } },
};

const itemVariants = {
  hidden: { opacity: 0, y: 25 },
  visible: { opacity: 1, y: 0, transition: { duration: 0.5, ease: "easeOut" as const } },
};

const Sobre = () => {
  const aboutRef = useRef(null);
  const missionRef = useRef(null);
  const teamRef = useRef(null);
  const valuesRef = useRef(null);
  const diffRef = useRef(null);
  const aboutInView = useInView(aboutRef, { once: true, margin: "-80px" });
  const missionInView = useInView(missionRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const diffInView = useInView(diffRef, { once: true, margin: "-80px" });

  return (
    <Layout>
      <SEO
        title="Sobre Nós - Especialistas em Inteligência de Dados"
        description="Conheça a Solutions in BI: valores e missão. Especialistas em Business Intelligence, automação e jurimetria para o mercado jurídico."
        canonical="/sobre"
      />

      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-background relative overflow-hidden dot-pattern">
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Sobre Nós
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-6 leading-tight">
              Especialistas em{" "}
              <span className="text-gradient">inteligência de dados</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Solutions in BI desenvolve soluções de automação, Business Intelligence e
              Inteligência Artificial para o mercado jurídico e corporativo, transformando
              dados em decisões estratégicas.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Nossa História */}
      <section className="py-20 section-sand" ref={aboutRef}>
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-[auto_1fr] gap-12 max-w-4xl mx-auto items-center">
            <motion.div
              className="flex justify-center"
              initial={{ opacity: 0, scale: 0.9 }}
              animate={aboutInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ duration: 0.5 }}
            >
              <img src={logoSbi} alt="Solutions in BI" className="w-48 md:w-56 h-auto object-contain mix-blend-multiply" />
            </motion.div>
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, x: 20 }}
              animate={aboutInView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-2xl md:text-3xl font-display font-bold text-foreground">
                Nossa História
              </h2>
              <p className="text-muted-foreground leading-relaxed">
                A Solutions in BI foi fundada com o propósito de proporcionar às empresas e escritórios de advocacia uma maneira inovadora de gerenciar e analisar dados, transformando informações em ativos estratégicos. Por trás da criação da empresa estão profissionais com ampla experiência e visão de mercado.
              </p>
              <p className="text-muted-foreground leading-relaxed">
                Combinando experiência técnica e conhecimento de mercado, a Solutions in BI se tornou uma parceira estratégica para escritórios e empresas que desejam transformar dados em insights valiosos e processos mais eficientes.
              </p>
            </motion.div>
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Missão e Visão */}
      <section className="py-16 md:py-20" ref={missionRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-12"
            initial={{ opacity: 0, y: 20 }}
            animate={missionInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Propósito
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground">
              Missão & Visão
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Target, title: "Missão", text: "Apoiar advogados e empresas na tomada de decisões mais assertivas por meio de ferramentas de análise e automação, contribuindo para a excelência na gestão de informações." },
              { icon: Eye, title: "Visão", text: "Ser referência em tecnologia e inteligência de dados para o mercado jurídico e corporativo no Brasil, expandindo nossa atuação para oferecer soluções inovadoras e personalizadas em todos os setores." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div
                  key={item.title}
                  initial={{ opacity: 0, y: 20 }}
                  animate={missionInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: i * 0.1 }}
                >
                  <Card className="rounded-2xl border bg-card hover:border-l-4 hover:border-l-accent transition-all h-full">
                    <CardContent className="p-8 flex gap-5 items-start">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <div>
                        <h3 className="text-lg font-display font-bold text-foreground mb-2">{item.title}</h3>
                        <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                      </div>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Equipe */}
      <section className="py-16 md:py-24 section-sand dot-pattern" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Equipe
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Quem faz acontecer
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Profissionais apaixonados por dados e tecnologia, dedicados a transformar a forma como empresas tomam decisões.
            </p>
          </motion.div>

          <motion.div
            className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={teamInView ? "visible" : "hidden"}
          >
            {team.map((member) => (
              <motion.div key={member.name} variants={itemVariants}>
                <Card className="rounded-2xl border bg-card overflow-hidden hover:shadow-lg hover:border-l-4 hover:border-l-accent transition-all group">
                  <div className="aspect-[4/3] overflow-hidden">
                    <img
                      src={member.photo}
                      alt={member.name}
                      className="w-full h-full object-cover group-hover:scale-105 transition-transform duration-500"
                    />
                  </div>
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-center justify-between">
                      <div>
                        <h3 className="text-lg font-display font-bold text-foreground">{member.name}</h3>
                        <p className="text-sm font-medium text-primary">{member.role}</p>
                      </div>
                      <a
                        href={member.linkedin}
                        target="_blank"
                        rel="noopener noreferrer"
                        aria-label={`LinkedIn de ${member.name}`}
                        className="w-9 h-9 rounded-lg bg-muted flex items-center justify-center text-muted-foreground hover:text-primary hover:bg-primary/10 transition-colors"
                      >
                        <Linkedin className="h-4 w-4" />
                      </a>
                    </div>
                    <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Valores */}
      <section className="py-16 md:py-24" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Valores
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os princípios que guiam cada projeto e decisão na Solutions in BI.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-5 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={valuesInView ? "visible" : "hidden"}
          >
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.label} variants={itemVariants}>
                  <Card className="rounded-xl border bg-card hover:shadow-md hover:border-l-4 hover:border-l-accent transition-all h-full">
                    <CardContent className="p-6 space-y-3">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <h3 className="font-display font-bold text-foreground">{v.label}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      <div className="section-divider" />

      {/* Diferenciais */}
      <section className="py-16 md:py-24 section-sand" ref={diffRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-14"
            initial={{ opacity: 0, y: 20 }}
            animate={diffInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              Diferenciais
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Por que a Solutions in BI?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Diferenciais que fazem da SBI a parceira ideal para seu negócio.
            </p>
          </motion.div>

          <motion.div
            className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto"
            variants={containerVariants}
            initial="hidden"
            animate={diffInView ? "visible" : "hidden"}
          >
            {diferenciais.map((item) => (
              <motion.div
                key={item}
                variants={itemVariants}
              >
                <Card className="rounded-xl border bg-card hover:shadow-sm hover:border-l-4 hover:border-l-accent transition-all h-full">
                  <CardContent className="p-5 flex items-start gap-3">
                    <CheckCircle className="w-5 h-5 text-accent shrink-0 mt-0.5" />
                    <span className="text-sm font-medium text-foreground">{item}</span>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </motion.div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Sobre;
