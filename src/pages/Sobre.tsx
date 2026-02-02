import { Layout } from "@/components/layout/Layout";
import { CTASection } from "@/components/home/CTASection";
import { Target, Eye, Heart, Lightbulb, Shield, Award, Users, CheckCircle } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

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
    initials: "WB",
  },
  {
    name: "Elisa Santin",
    role: "CCO - Diretora Comercial",
    bio: "Graduada em Direito pela PUC-PR e especialista em Business Intelligence pela ENG. Acumula mais de 5 anos de experiência em Business Intelligence e Jurimetria, desenvolvendo soluções que integram tecnologia e análise jurídica para otimização de processos e redução de riscos.",
    initials: "ES",
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
  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              Sobre Nós
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Transformando dados em{" "}
              <span className="text-gradient">decisões estratégicas</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              A Solutions in BI é uma empresa especializada em desenvolver soluções de 
              Business Intelligence, análise de dados e automação de processos para o 
              mercado jurídico e corporativo.
            </p>
          </div>
        </div>
      </section>

      {/* Mission & Vision */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center mb-4">
                  <Target className="w-6 h-6 text-white" />
                </div>
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

            <Card className="border-0 shadow-lg">
              <CardHeader>
                <div className="w-12 h-12 rounded-xl bg-brand-tiffany flex items-center justify-center mb-4">
                  <Eye className="w-6 h-6 text-primary" />
                </div>
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
          </div>
        </div>
      </section>

      {/* Values */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossos Valores
            </h2>
            <p className="text-lg text-muted-foreground">
              Os princípios que guiam nossas ações e relacionamentos.
            </p>
          </div>
          <div className="grid sm:grid-cols-2 lg:grid-cols-5 gap-6">
            {values.map((value) => {
              const IconComponent = value.icon;
              return (
                <div
                  key={value.label}
                  className="text-center p-6 rounded-xl bg-background shadow-lg"
                >
                  <div className="w-14 h-14 mx-auto rounded-xl bg-accent/20 flex items-center justify-center mb-4">
                    <IconComponent className="w-7 h-7 text-brand-tiffany" />
                  </div>
                  <h3 className="font-display font-semibold mb-2">{value.label}</h3>
                  <p className="text-sm text-muted-foreground">{value.description}</p>
                </div>
              );
            })}
          </div>
        </div>
      </section>

      {/* History */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossa História
            </h2>
            <p className="text-lg text-muted-foreground">
              A trajetória da Solutions in BI na transformação digital.
            </p>
          </div>

          <div className="max-w-3xl mx-auto">
            {timeline.map((item, index) => (
              <div key={item.year} className="flex gap-6 mb-12 last:mb-0">
                <div className="flex flex-col items-center">
                  <div className="w-12 h-12 rounded-full bg-primary flex items-center justify-center text-white font-display font-bold text-sm">
                    {index + 1}
                  </div>
                  {index < timeline.length - 1 && (
                    <div className="w-0.5 h-full bg-border mt-2" />
                  )}
                </div>
                <div className="flex-1 pb-8">
                  <span className="text-sm text-brand-tiffany font-medium">{item.year}</span>
                  <h3 className="text-xl font-display font-semibold mt-1 mb-2">{item.title}</h3>
                  <p className="text-muted-foreground">{item.description}</p>
                </div>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Team */}
      <section className="py-24 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Nossa Equipe
            </h2>
            <p className="text-lg text-muted-foreground">
              Profissionais com ampla experiência e visão de mercado.
            </p>
          </div>

          <div className="grid md:grid-cols-2 gap-8 max-w-4xl mx-auto">
            {team.map((member) => (
              <Card key={member.name} className="border-0 shadow-lg overflow-hidden">
                <div className="aspect-[3/2] bg-gradient-brand flex items-center justify-center">
                  <div className="w-24 h-24 rounded-full bg-white/20 flex items-center justify-center">
                    <span className="font-display font-bold text-3xl text-white">
                      {member.initials}
                    </span>
                  </div>
                </div>
                <CardHeader>
                  <CardTitle className="text-xl font-display">{member.name}</CardTitle>
                  <span className="text-brand-tiffany font-medium">{member.role}</span>
                </CardHeader>
                <CardContent>
                  <p className="text-muted-foreground text-sm leading-relaxed">
                    {member.bio}
                  </p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>
      </section>

      {/* Differentials */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="text-center max-w-3xl mx-auto mb-12">
            <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
              Por que escolher a Solutions in BI?
            </h2>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-6 max-w-5xl mx-auto">
            {[
              "Experiência técnica comprovada",
              "Soluções personalizadas",
              "Atendimento diferenciado",
              "Tecnologia de ponta",
              "Resultados mensuráveis",
              "Parceria de longo prazo",
            ].map((item) => (
              <div key={item} className="flex items-center gap-3 p-4 rounded-lg bg-muted/50">
                <CheckCircle className="w-5 h-5 text-brand-tiffany shrink-0" />
                <span className="font-medium">{item}</span>
              </div>
            ))}
          </div>
        </div>
      </section>

      <CTASection />
    </Layout>
  );
};

export default Sobre;
