import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/home/CTASection";
import { Target, Eye, Heart, Lightbulb, Shield, Award, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import teamWillian from "@/assets/team-willian-photo.jpg";
import teamElisa from "@/assets/team-elisa-photo.jpg";

const values = [
  { icon: Lightbulb, label: "Inovação", description: "Buscamos constantemente novas tecnologias e metodologias." },
  { icon: Shield, label: "Transparência", description: "Comunicação clara e honesta em todas as etapas." },
  { icon: Heart, label: "Compromisso", description: "Dedicação total ao sucesso dos nossos clientes." },
  { icon: Award, label: "Excelência Técnica", description: "Padrões elevados de qualidade em tudo que fazemos." },
  { icon: Users, label: "Foco no Cliente", description: "Soluções personalizadas para cada necessidade." },
];

const team = [
  {
    name: "Willian Borecki",
    role: "CTO - Diretor Técnico",
    bio: "Graduado em Engenharia de Produção pela Univali e especialista em SQL Server pela DataCamp. Possui mais de 5 anos de experiência em Business Intelligence e Engenharia de Dados, tendo liderado projetos complexos de integração e análise para clientes em diversos setores.",
    image: teamWillian,
  },
  {
    name: "Elisa Santin",
    role: "CCO - Diretora Comercial",
    bio: "Graduada em Direito pela PUC-PR e especialista em Business Intelligence pela ENG. Acumula mais de 5 anos de experiência em Business Intelligence e Jurimetria, desenvolvendo soluções que integram tecnologia e análise jurídica para otimização de processos e redução de riscos.",
    image: teamElisa,
  },
];

const timeline = [
  {
    year: "Fundação",
    title: "Início da Jornada",
    description: "A Solutions in BI foi fundada com o propósito de proporcionar às empresas uma maneira inovadora de gerenciar e analisar dados.",
  },
  {
    year: "Crescimento",
    title: "Expansão de Serviços",
    description: "Ampliação do portfólio para incluir Jurimetria e Robôs Jurídicos, atendendo demandas específicas do mercado jurídico.",
  },
  {
    year: "Hoje",
    title: "Referência no Mercado",
    description: "Parceira estratégica de escritórios e empresas que transformam dados em insights valiosos e processos mais eficientes.",
  },
];

const Sobre = () => {
  const heroRef = useRef(null);
  const valuesRef = useRef(null);
  const teamRef = useRef(null);
  const heroInView = useInView(heroRef, { once: true });
  const valuesInView = useInView(valuesRef, { once: true, margin: "-100px" });
  const teamInView = useInView(teamRef, { once: true, margin: "-100px" });

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30" ref={heroRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="max-w-3xl"
            initial={{ opacity: 0, y: 40 }}
            animate={heroInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <motion.span 
              className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={heroInView ? { opacity: 1, scale: 1 } : {}}
              transition={{ delay: 0.2 }}
            >
              Sobre Nós
            </motion.span>
            <motion.h1 
              className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6"
              initial={{ opacity: 0, y: 20 }}
              animate={heroInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.3 }}
            >
              Transformando dados em{" "}
              <span className="text-gradient">decisões estratégicas</span>
            </motion.h1>
            <motion.p 
              className="text-xl text-muted-foreground leading-relaxed"
              initial={{ opacity: 0 }}
              animate={heroInView ? { opacity: 1 } : {}}
              transition={{ delay: 0.4 }}
            >
              A Solutions in BI é uma empresa especializada em desenvolver soluções de 
              Business Intelligence, análise de dados e automação de processos para o 
              mercado jurídico e corporativo.
            </motion.p>
          </motion.div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <motion.div
              initial={{ opacity: 0, x: -40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: 5 }}
                  >
                    <Target className="w-6 h-6 text-white" />
                  </motion.div>
                  <CardTitle className="text-2xl font-display">Missão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Apoiar advogados e empresas na tomada de decisões mais assertivas 
                    por meio de ferramentas de análise e automação, contribuindo para 
                    a excelência na gestão de informações.
                  </p>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div
              initial={{ opacity: 0, x: 40 }}
              whileInView={{ opacity: 1, x: 0 }}
              viewport={{ once: true }}
              transition={{ duration: 0.5, delay: 0.2 }}
            >
              <Card className="border-0 shadow-lg h-full">
                <CardHeader>
                  <motion.div 
                    className="w-12 h-12 rounded-xl bg-brand-tiffany flex items-center justify-center mb-4"
                    whileHover={{ scale: 1.1, rotate: -5 }}
                  >
                    <Eye className="w-6 h-6 text-primary" />
                  </motion.div>
                  <CardTitle className="text-2xl font-display">Visão</CardTitle>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground leading-relaxed">
                    Ser referência em tecnologia e inteligência de dados para o 
                    mercado jurídico e corporativo no Brasil, expandindo nossa 
                    atuação para oferecer soluções inovadoras e personalizadas.
                  </p>
                </CardContent>
              </Card>
            </motion.div>
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30" ref={valuesRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={valuesInView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6 }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-muted-foreground">
              Os princípios que guiam nossas ações e relacionamentos.
            </p>
          </motion.div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value, index) => {
              const IconComponent = value.icon;
              return (
                <motion.div
                  key={value.label}
                  className="text-center p-6 rounded-xl bg-background shadow-lg hover:shadow-xl transition-shadow"
                  initial={{ opacity: 0, y: 40 }}
                  animate={valuesInView ? { opacity: 1, y: 0 } : {}}
                  transition={{ delay: index * 0.1 }}
                  whileHover={{ y: -5 }}
                >
                  <motion.div 
                    className="w-14 h-14 mx-auto rounded-xl bg-accent/20 flex items-center justify-center mb-4"
                    whileHover={{ rotate: 10, scale: 1.1 }}
                  >
                    <IconComponent className="w-7 h-7 text-brand-tiffany" />
                  </motion.div>
                  <h3 className="font-display font-semibold mb-2">{value.label}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-muted-foreground">
              A trajetória da Solutions in BI na transformação digital.
            </p>
          </motion.div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <motion.div 
                key={item.year} 
                className="flex gap-6 mb-12 last:mb-0"
                initial={{ opacity: 0, x: -40 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.2 }}
              >
                <div className="flex flex-col items-center">
                  <motion.div 
                    className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-display font-bold text-sm"
                    whileHover={{ scale: 1.1 }}
                  >
                    {index + 1}
                  </motion.div>
                  {index < timeline.length - 1 && (
                    <motion.div 
                      className="w-0.5 h-full bg-border mt-2"
                      initial={{ scaleY: 0 }}
                      whileInView={{ scaleY: 1 }}
                      viewport={{ once: true }}
                      transition={{ delay: 0.5 + index * 0.2 }}
                    />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <span className="text-sm text-brand-tiffany font-medium">{item.year}</span>
                  <h3 className="text-xl font-display font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30" ref={teamRef}>
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            animate={teamInView ? { opacity: 1, y: 0 } : {}}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-muted-foreground">
              Profissionais com ampla experiência e visão de mercado.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member, index) => (
              <motion.div
                key={member.name}
                initial={{ opacity: 0, y: 60 }}
                animate={teamInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: index * 0.2 }}
              >
                <Card className="border-0 shadow-lg overflow-hidden group">
                  <motion.div 
                    className="aspect-[3/2] overflow-hidden"
                    whileHover={{ scale: 1.02 }}
                  >
                    <motion.img 
                      src={member.image}
                      alt={member.name}
                      className="w-full h-full object-cover"
                      whileHover={{ scale: 1.1 }}
                      transition={{ duration: 0.6 }}
                    />
                  </motion.div>
                  <CardHeader>
                    <CardTitle className="text-xl font-display group-hover:text-brand-tiffany transition-colors">
                      {member.name}
                    </CardTitle>
                    <span className="text-brand-tiffany font-medium">{member.role}</span>
                  </CardHeader>
                  <CardContent>
                    <p className="text-muted-foreground text-sm leading-relaxed">
                      {member.bio}
                    </p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <motion.div 
            className="text-center max-w-3xl mx-auto mb-12"
            initial={{ opacity: 0, y: 40 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true }}
          >
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Por que escolher a Solutions in BI?
            </h2>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Experiência técnica comprovada",
              "Soluções personalizadas",
              "Atendimento diferenciado",
              "Tecnologia de ponta",
              "Resultados mensuráveis",
              "Parceria de longo prazo",
            ].map((item, index) => (
              <motion.div 
                key={item} 
                className="flex items-center gap-3 p-4 rounded-lg bg-muted/50"
                initial={{ opacity: 0, x: -20 }}
                whileInView={{ opacity: 1, x: 0 }}
                viewport={{ once: true }}
                transition={{ delay: index * 0.1 }}
                whileHover={{ x: 5, backgroundColor: "hsl(172 30% 62% / 0.1)" }}
              >
                <CheckCircle className="w-5 h-5 text-brand-tiffany shrink-0" />
                <span className="font-medium">{item}</span>
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
