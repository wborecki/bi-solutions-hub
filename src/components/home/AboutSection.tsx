import { Target, Eye, Heart, Lightbulb, Shield, Award, Users } from "lucide-react";

const values = [
  { icon: Lightbulb, label: "Inovação" },
  { icon: Shield, label: "Transparência" },
  { icon: Heart, label: "Compromisso" },
  { icon: Award, label: "Excelência" },
  { icon: Users, label: "Foco no Cliente" },
];

const stats = [
  { value: "+5", label: "Anos de experiência" },
  { value: "+50", label: "Projetos entregues" },
  { value: "100%", label: "Clientes satisfeitos" },
];

export function AboutSection() {
  return (
    <section className="py-24 bg-background">
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div>
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
                Sobre Nós
              </span>
              <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
                Especialistas em{" "}
                <span className="text-gradient">Business Intelligence</span>
              </h2>
              <p className="text-lg text-muted-foreground leading-relaxed">
                A Solutions in BI é uma empresa especializada em desenvolver soluções de 
                Business Intelligence, análise de dados e automação de processos para o 
                mercado jurídico e corporativo.
              </p>
            </div>

            <div className="grid sm:grid-cols-2 gap-6">
              <div className="p-6 rounded-xl bg-card border">
                <Target className="w-8 h-8 text-brand-tiffany mb-3" />
                <h3 className="font-display font-semibold text-lg mb-2">Missão</h3>
                <p className="text-sm text-muted-foreground">
                  Apoiar advogados e empresas na tomada de decisões mais assertivas 
                  por meio de ferramentas de análise e automação.
                </p>
              </div>
              <div className="p-6 rounded-xl bg-card border">
                <Eye className="w-8 h-8 text-brand-tiffany mb-3" />
                <h3 className="font-display font-semibold text-lg mb-2">Visão</h3>
                <p className="text-sm text-muted-foreground">
                  Ser referência em tecnologia e inteligência de dados para o 
                  mercado jurídico e corporativo no Brasil.
                </p>
              </div>
            </div>

            {/* Values */}
            <div>
              <h4 className="font-display font-semibold text-lg mb-4">Nossos Valores</h4>
              <div className="flex flex-wrap gap-3">
                {values.map((value) => {
                  const IconComponent = value.icon;
                  return (
                    <div
                      key={value.label}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium"
                    >
                      <IconComponent className="w-4 h-4 text-brand-tiffany" />
                      {value.label}
                    </div>
                  );
                })}
              </div>
            </div>
          </div>

          {/* Visual */}
          <div className="relative">
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Main circle */}
              <div className="absolute inset-8 rounded-full bg-gradient-brand flex items-center justify-center">
                <div className="text-center text-white">
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center">
                    <span className="font-display font-bold text-3xl">SBI</span>
                  </div>
                  <p className="text-sm text-white/80">Facilitando Processos</p>
                </div>
              </div>

              {/* Stats cards */}
              {stats.map((stat, index) => {
                const positions = [
                  "top-0 left-0",
                  "top-0 right-0",
                  "bottom-0 left-1/2 -translate-x-1/2",
                ];
                return (
                  <div
                    key={stat.label}
                    className={`absolute ${positions[index]} bg-background rounded-xl shadow-lg p-4 text-center animate-float`}
                    style={{ animationDelay: `${index * 0.5}s` }}
                  >
                    <div className="text-2xl font-display font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </div>
                );
              })}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
