import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/home/CTASection";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { Target, Eye, Lightbulb, Shield, Heart, Award, Users, CheckCircle } from "lucide-react";
import teamWillian from "@/assets/team-willian-photo.jpg";
import teamElisa from "@/assets/team-elisa-photo.jpg";

const values = [
  { icon: Lightbulb, label: "Inovação", description: "Buscamos constantemente novas tecnologias e abordagens para entregar soluções de ponta." },
  { icon: Shield, label: "Transparência", description: "Comunicação clara e honesta em cada etapa do processo com nossos clientes." },
  { icon: Heart, label: "Compromisso", description: "Dedicação total ao sucesso dos projetos e à satisfação dos nossos parceiros." },
  { icon: Award, label: "Excelência", description: "Padrão elevado de qualidade em tudo que desenvolvemos e entregamos." },
  { icon: Users, label: "Foco no Cliente", description: "Cada solução é desenhada sob medida para as necessidades reais do negócio." },
];

const team = [
  {
    name: "Willian Borecki",
    role: "CTO - Diretor Técnico",
    bio: "Engenheiro de Produção com +5 anos em BI e Engenharia de Dados. Lidera a arquitetura técnica e inovação das soluções.",
    image: teamWillian,
  },
  {
    name: "Elisa Santin",
    role: "CCO - Diretora Comercial",
    bio: "Advogada e especialista em BI com +5 anos em Jurimetria. Responsável pela estratégia comercial e relacionamento com clientes.",
    image: teamElisa,
  },
];

const diferenciais = [
  "Experiência técnica comprovada",
  "Soluções personalizadas",
  "Atendimento diferenciado",
  "Tecnologia de ponta",
  "Resultados mensuráveis",
  "Parceria de longo prazo",
];

const Sobre = () => {
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const diffRef = useRef(null);
  const valuesInView = useInView(valuesRef, { once: true, margin: "-80px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-80px" });
  const diffInView = useInView(diffRef, { once: true, margin: "-80px" });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-20 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <div className="grid lg:grid-cols-2 gap-16 items-center">
            <motion.div
              className="max-w-lg"
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

            {/* Missão e Visão - ao lado do hero */}
            <motion.div
              className="space-y-4"
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.6, delay: 0.2 }}
            >
              {[
                { icon: Target, title: "Missão", text: "Apoiar empresas na tomada de decisões assertivas por meio de análise de dados e automação inteligente." },
                { icon: Eye, title: "Visão", text: "Ser referência em tecnologia e inteligência de dados para o mercado jurídico e corporativo no Brasil." },
              ].map((item) => {
                const Icon = item.icon;
                return (
                  <div
                    key={item.title}
                    className="rounded-2xl border border-border bg-card p-6 flex gap-5 items-start"
                  >
                    <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                      <Icon className="h-6 w-6 text-primary" />
                    </div>
                    <div>
                      <h3 className="text-lg font-display font-bold text-foreground mb-1">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </div>
                  </div>
                );
              })}
            </motion.div>
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-24 bg-muted/30" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Os princípios que guiam cada projeto e decisão na Solutions in BI.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {values.map((v, index) => {
              const Icon = v.icon;
              return (
                <motion.div
                  key={v.label}
                  className="rounded-2xl border border-border bg-card p-6 hover:shadow-md transition-all duration-300"
                  initial={{ opacity: 0, y: 20 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ duration: 0.4, delay: index * 0.08 }}
                >
                  <div className="w-10 h-10 rounded-full bg-primary/10 flex items-center justify-center mb-4">
                    <Icon className="h-5 w-5 text-primary" />
                  </div>
                  <h3 className="font-display font-semibold text-foreground mb-2">{v.label}</h3>
                  <p className="text-sm text-muted-foreground leading-relaxed">{v.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-24" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossa Equipe
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Profissionais especializados em tecnologia e inteligência de dados.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div
                key={member.name}
                className="rounded-2xl border border-border bg-card overflow-hidden hover:shadow-md transition-all duration-300"
                initial={{ opacity: 0, y: 20 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: i * 0.15 }}
              >
                <div className="aspect-[4/3] overflow-hidden">
                  <img
                    src={member.image}
                    alt={member.name}
                    className="w-full h-full object-cover hover:scale-105 transition-transform duration-500"
                  />
                </div>
                <div className="p-6 space-y-2">
                  <h3 className="text-lg font-display font-bold text-foreground">{member.name}</h3>
                  <p className="text-sm text-primary font-semibold">{member.role}</p>
                  <p className="text-sm text-muted-foreground leading-relaxed">{member.bio}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-24 bg-muted/30" ref={diffRef}>
        <div className="container mx-auto px-4">
          <motion.div
            className="text-center mb-16"
            initial={{ opacity: 0, y: 20 }}
            animate={diffInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Por que a Solutions in BI?
            </h2>
            <p className="text-muted-foreground text-lg max-w-2xl mx-auto">
              Diferenciais que fazem da SBI a parceira ideal para seu negócio.
            </p>
          </motion.div>

          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {diferenciais.map((item, i) => (
              <motion.div
                key={item}
                className="flex items-start gap-3 p-5 rounded-xl border border-border bg-card hover:shadow-sm transition-all duration-300"
                initial={{ opacity: 0, y: 15 }}
                animate={diffInView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.3, delay: i * 0.08 }}
              >
                <CheckCircle className="w-5 h-5 text-primary shrink-0 mt-0.5" />
                <span className="text-sm font-medium text-foreground">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Sobre;
