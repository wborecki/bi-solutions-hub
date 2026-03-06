import { Layout } from "@/components/layout/Layout";
import { Card, CardContent } from "@/components/ui/card";
import { motion } from "framer-motion";
import { Target, Eye, Lightbulb, Shield, Heart, Award, Users, CheckCircle } from "lucide-react";
import teamWillian from "@/assets/team-willian-photo.jpg";
import teamElisa from "@/assets/team-elisa-photo.jpg";

const values = [
  { icon: Lightbulb, label: "Inovação" },
  { icon: Shield, label: "Transparência" },
  { icon: Heart, label: "Compromisso" },
  { icon: Award, label: "Excelência" },
  { icon: Users, label: "Foco no Cliente" },
];

const team = [
  {
    name: "Willian Borecki",
    role: "CTO - Diretor Técnico",
    bio: "Engenheiro de Produção com +5 anos em BI e Engenharia de Dados.",
    image: teamWillian,
  },
  {
    name: "Elisa Santin",
    role: "CCO - Diretora Comercial",
    bio: "Advogada e especialista em BI com +5 anos em Jurimetria.",
    image: teamElisa,
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

const Sobre = () => {
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Sobre Nós</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-4">
              Especialistas em <span className="text-gradient">inteligência de dados</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed">
              A Solutions in BI desenvolve soluções de automação, BI e IA para o mercado jurídico e corporativo.
            </p>
          </motion.div>
        </div>
      </section>

      {/* Missão e Visão */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-6 max-w-4xl mx-auto">
            {[
              { icon: Target, title: "Missão", text: "Apoiar empresas na tomada de decisões assertivas por meio de análise de dados e automação." },
              { icon: Eye, title: "Visão", text: "Ser referência em tecnologia e inteligência de dados para o mercado jurídico e corporativo no Brasil." },
            ].map((item, i) => {
              const Icon = item.icon;
              return (
                <motion.div key={item.title} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                  <Card className="rounded-xl border bg-card hover:shadow-md transition-shadow h-full">
                    <CardContent className="pt-6 pb-6 px-6 space-y-3">
                      <div className="w-12 h-12 rounded-xl bg-primary/10 flex items-center justify-center">
                        <Icon className="h-6 w-6 text-primary" />
                      </div>
                      <h3 className="text-xl font-display font-bold">{item.title}</h3>
                      <p className="text-sm text-muted-foreground leading-relaxed">{item.text}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              );
            })}
          </div>
        </div>
      </section>

      {/* Valores */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4 text-center">
          <motion.div initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            <h2 className="text-3xl md:text-4xl font-display font-bold mb-8">Nossos Valores</h2>
          </motion.div>
          <motion.div className="flex flex-wrap justify-center gap-3" variants={containerVariants} initial="hidden" whileInView="visible" viewport={{ once: true }}>
            {values.map((v) => {
              const Icon = v.icon;
              return (
                <motion.div key={v.label} variants={itemVariants} className="flex items-center gap-2 px-4 py-2.5 rounded-full bg-muted text-sm font-medium">
                  <Icon className="h-4 w-4 text-primary" />
                  {v.label}
                </motion.div>
              );
            })}
          </motion.div>
        </div>
      </section>

      {/* Equipe */}
      <section className="py-16 md:py-24 bg-muted/50">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-12" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Nossa Equipe
          </motion.h2>
          <div className="grid md:grid-cols-2 gap-6 max-w-3xl mx-auto">
            {team.map((member, i) => (
              <motion.div key={member.name} initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.1 }}>
                <Card className="rounded-xl border bg-card overflow-hidden hover:shadow-md transition-shadow">
                  <img src={member.image} alt={member.name} className="w-full aspect-[3/2] object-cover" />
                  <CardContent className="pt-4 pb-5 px-5 space-y-1">
                    <h3 className="font-display font-bold">{member.name}</h3>
                    <p className="text-sm text-primary font-medium">{member.role}</p>
                    <p className="text-sm text-muted-foreground">{member.bio}</p>
                  </CardContent>
                </Card>
              </motion.div>
            ))}
          </div>
        </div>
      </section>

      {/* Diferenciais */}
      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <motion.h2 className="text-3xl md:text-4xl font-display font-bold text-center mb-10" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }}>
            Por que a Solutions in BI?
          </motion.h2>
          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-4 max-w-4xl mx-auto">
            {["Experiência técnica comprovada", "Soluções personalizadas", "Atendimento diferenciado", "Tecnologia de ponta", "Resultados mensuráveis", "Parceria de longo prazo"].map((item, i) => (
              <motion.div key={item} className="flex items-center gap-3 p-4 rounded-xl bg-muted/50" initial={{ opacity: 0, x: -20 }} whileInView={{ opacity: 1, x: 0 }} viewport={{ once: true }} transition={{ delay: i * 0.05 }}>
                <CheckCircle className="h-5 w-5 text-primary shrink-0" />
                <span className="text-sm font-medium">{item}</span>
              </motion.div>
            ))}
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Sobre;
