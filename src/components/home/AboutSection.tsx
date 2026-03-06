import { Target, Eye, Heart, Lightbulb, Shield, Award, Users } from "lucide-react";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

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
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 bg-background overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        <div className="grid lg:grid-cols-2 gap-16 items-center">
          {/* Content */}
          <motion.div 
            className="space-y-8"
            initial={{ opacity: 0, x: -60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7 }}
          >
            <div>
              <motion.span 
                className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4"
                initial={{ opacity: 0, scale: 0.8 }}
                animate={isInView ? { opacity: 1, scale: 1 } : {}}
                transition={{ delay: 0.2 }}
              >
                Sobre Nós
              </motion.span>
              <motion.h2 
                className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4"
                initial={{ opacity: 0, y: 20 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.3 }}
              >
                Especialistas em{" "}
                <span className="text-gradient">Business Intelligence</span>
              </motion.h2>
              <motion.p 
                className="text-lg text-muted-foreground leading-relaxed"
                initial={{ opacity: 0 }}
                animate={isInView ? { opacity: 1 } : {}}
                transition={{ delay: 0.4 }}
              >
                A Solutions in BI é uma empresa especializada em desenvolver soluções de 
                Business Intelligence, análise de dados e automação de processos para o 
                mercado jurídico e corporativo.
              </motion.p>
            </div>

            <motion.div 
              className="grid sm:grid-cols-2 gap-6"
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.5 }}
            >
              <motion.div 
                className="p-6 rounded-xl bg-card border group hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Target className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display font-semibold text-lg mb-2">Missão</h3>
                <p className="text-sm text-muted-foreground">
                  Apoiar advogados e empresas na tomada de decisões mais assertivas 
                  por meio de ferramentas de análise e automação.
                </p>
              </motion.div>
              <motion.div 
                className="p-6 rounded-xl bg-card border group hover:shadow-lg transition-shadow"
                whileHover={{ scale: 1.02 }}
                transition={{ type: "spring", stiffness: 300 }}
              >
                <Eye className="w-8 h-8 text-accent mb-3" />
                <h3 className="font-display font-semibold text-lg mb-2">Visão</h3>
                <p className="text-sm text-muted-foreground">
                  Ser referência em tecnologia e inteligência de dados para o 
                  mercado jurídico e corporativo no Brasil.
                </p>
              </motion.div>
            </motion.div>

            {/* Values */}
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={isInView ? { opacity: 1, y: 0 } : {}}
              transition={{ delay: 0.6 }}
            >
              <h4 className="font-display font-semibold text-lg mb-4">Nossos Valores</h4>
              <div className="flex flex-wrap gap-3">
                {values.map((value, index) => {
                  const IconComponent = value.icon;
                  return (
                    <motion.div
                      key={value.label}
                      className="flex items-center gap-2 px-4 py-2 rounded-full bg-muted text-sm font-medium hover:bg-accent/20 transition-colors cursor-default"
                      initial={{ opacity: 0, scale: 0.8 }}
                      animate={isInView ? { opacity: 1, scale: 1 } : {}}
                      transition={{ delay: 0.7 + index * 0.1 }}
                      whileHover={{ scale: 1.05 }}
                    >
                      <IconComponent className="w-4 h-4 text-accent" />
                      {value.label}
                    </motion.div>
                  );
                })}
              </div>
            </motion.div>
          </motion.div>

          {/* Visual */}
          <motion.div 
            className="relative"
            initial={{ opacity: 0, x: 60 }}
            animate={isInView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.7, delay: 0.2 }}
          >
            <div className="aspect-square max-w-md mx-auto relative">
              {/* Main circle */}
              <motion.div 
                className="absolute inset-8 rounded-full bg-gradient-brand flex items-center justify-center shadow-2xl"
                animate={{ rotate: 360 }}
                transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                style={{ transformOrigin: "center center" }}
              >
                <motion.div 
                  className="text-center text-white"
                  animate={{ rotate: -360 }}
                  transition={{ duration: 60, repeat: Infinity, ease: "linear" }}
                >
                  <div className="w-20 h-20 mx-auto mb-4 rounded-xl bg-white/20 flex items-center justify-center backdrop-blur-sm">
                    <span className="font-display font-bold text-3xl">SBI</span>
                  </div>
                  <p className="text-sm text-white/80">Facilitando Processos</p>
                </motion.div>
              </motion.div>

              {/* Stats cards */}
              {stats.map((stat, index) => {
                const positions = [
                  "top-0 left-0",
                  "top-0 right-0",
                  "bottom-0 left-1/2 -translate-x-1/2",
                ];
                return (
                  <motion.div
                    key={stat.label}
                    className={`absolute ${positions[index]} bg-background rounded-xl shadow-xl p-4 text-center`}
                    initial={{ opacity: 0, scale: 0 }}
                    animate={isInView ? { 
                      opacity: 1, 
                      scale: 1,
                      y: [0, -10, 0]
                    } : {}}
                    transition={{ 
                      opacity: { delay: 0.8 + index * 0.2 },
                      scale: { delay: 0.8 + index * 0.2, type: "spring" },
                      y: { 
                        delay: 1.5 + index * 0.5, 
                        duration: 3, 
                        repeat: Infinity,
                        ease: "easeInOut"
                      }
                    }}
                  >
                    <div className="text-2xl font-display font-bold text-primary">
                      {stat.value}
                    </div>
                    <div className="text-xs text-muted-foreground">{stat.label}</div>
                  </motion.div>
                );
              })}

              {/* Decorative rings */}
              <motion.div 
                className="absolute inset-4 rounded-full border-2 border-dashed border-accent/20"
                animate={{ rotate: -360 }}
                transition={{ duration: 30, repeat: Infinity, ease: "linear" }}
              />
              <motion.div 
                className="absolute inset-0 rounded-full border border-primary/10"
                animate={{ scale: [1, 1.05, 1] }}
                transition={{ duration: 4, repeat: Infinity, ease: "easeInOut" }}
              />
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
