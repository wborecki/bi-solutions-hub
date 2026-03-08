import { motion } from "framer-motion";
import { Sparkles, Clock } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import biaRobot from "@/assets/bia-v1.webp";

const apps = [
  {
    id: "analista",
    title: "Bia Analista de Processo",
    description: "Análise automática de processos judiciais com inteligência artificial, jurimetria e predição de resultados.",
    icon: Sparkles,
  },
  {
    id: "secretaria",
    title: "Bia Secretária Pessoal",
    description: "Assistente inteligente para gestão de tarefas, prazos processuais e organização de documentos.",
    icon: Clock,
  },
];

export function BiaAnaliseSection() {
  return (
    <section className="py-16 md:py-24 bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="text-center max-w-2xl mx-auto mb-12"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.5 }}
        >
          <span className="bg-accent text-accent-foreground text-xs font-semibold px-3 py-1 rounded-full">
            Inteligência Artificial
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mt-4 mb-3">
            Bia, sua assistente <span className="text-gradient">inteligente</span>
          </h2>
          <p className="text-muted-foreground">
            Múltiplos apps da Bia para potencializar seu trabalho jurídico e gestão pessoal.
          </p>
        </motion.div>

        <div className="grid lg:grid-cols-[1fr_2fr] gap-8 items-start">
          {/* Bia lado esquerdo */}
          <motion.div
            className="flex flex-col items-center gap-6"
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
          >
            <motion.div
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <img src={biaRobot} alt="Bia - Assistente IA" className="w-48 h-48 object-contain drop-shadow-xl" />
            </motion.div>
            <div className="text-center space-y-2">
              <h3 className="text-xl font-display font-bold">Bia</h3>
              <p className="text-sm text-muted-foreground max-w-xs">
                Seu assistente jurídico alimentado por inteligência artificial de última geração.
              </p>
            </div>
          </motion.div>

          {/* Cards dos apps */}
          <motion.div
            className="grid gap-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {apps.map((app, index) => {
              const Icon = app.icon;
              return (
                <Card key={app.id} className="rounded-xl border bg-card hover:shadow-md transition-shadow">
                  <CardContent className="p-6 space-y-3">
                    <div className="flex items-start justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2 rounded-lg bg-primary/10">
                          <Icon className="h-5 w-5 text-primary" />
                        </div>
                        <div>
                          <h4 className="font-display font-bold text-lg">{app.title}</h4>
                          <p className="text-sm text-muted-foreground mt-1">{app.description}</p>
                        </div>
                      </div>
                      <Badge variant="outline" className="shrink-0 whitespace-nowrap">
                        Em Breve
                      </Badge>
                    </div>
                  </CardContent>
                </Card>
              );
            })}
          </motion.div>
        </div>
      </div>
    </section>
  );
}
