import { motion } from "framer-motion";
import { FileText, Users, Calendar, Scale, AlertTriangle, TrendingUp, CheckCircle2 } from "lucide-react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import biaRobot from "@/assets/bia-robot.png";

const processoData = {
  numero: "0012345-67.2024.8.26.0100",
  tribunal: "TJSP - 5ª Vara Cível",
  classe: "Ação de Indenização",
  partes: { autor: "Empresa Alpha Ltda.", reu: "Beta Serviços S.A." },
  valor: "R$ 250.000,00",
  distribuicao: "15/03/2024",
};

const timeline = [
  { label: "Distribuição", date: "15/03/2024", done: true },
  { label: "Citação", date: "22/03/2024", done: true },
  { label: "Contestação", date: "10/04/2024", done: true },
  { label: "Audiência de Conciliação", date: "20/05/2024", done: false },
  { label: "Sentença", date: "Previsão: Ago/2024", done: false },
];

const insights = [
  { icon: TrendingUp, text: "78% de chance de procedência parcial com base em precedentes similares", color: "text-green-600" },
  { icon: AlertTriangle, text: "Prazo de contestação encerrado — réu apresentou defesa no prazo", color: "text-amber-600" },
  { icon: Scale, text: "Jurisprudência favorável ao autor em 62% dos casos na mesma vara", color: "text-primary" },
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
            Bia analisa seu processo <span className="text-gradient">completo</span>
          </h2>
          <p className="text-muted-foreground">
            Nossa IA examina cada detalhe do processo judicial e entrega uma análise estruturada em segundos.
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
                Análise jurimétrica automatizada com inteligência artificial de última geração.
              </p>
            </div>
            <Button asChild size="lg" className="w-full max-w-xs">
              <Link to="/solucoes/jurimetria">Saiba Mais</Link>
            </Button>
          </motion.div>

          {/* Painel de análise */}
          <motion.div
            className="space-y-4"
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6, delay: 0.2 }}
          >
            {/* Cabeçalho do processo */}
            <Card className="rounded-xl border bg-card">
              <CardContent className="p-5 space-y-3">
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  <FileText className="h-4 w-4 text-primary" />
                  <span className="font-mono">{processoData.numero}</span>
                  <span className="ml-auto bg-primary/10 text-primary text-xs font-semibold px-2 py-0.5 rounded-full">
                    {processoData.tribunal}
                  </span>
                </div>
                <h4 className="font-display font-bold text-lg">{processoData.classe}</h4>
                <div className="grid sm:grid-cols-3 gap-3 text-sm">
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Autor</p>
                      <p className="font-medium">{processoData.partes.autor}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Users className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Réu</p>
                      <p className="font-medium">{processoData.partes.reu}</p>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Calendar className="h-4 w-4 text-muted-foreground" />
                    <div>
                      <p className="text-xs text-muted-foreground">Valor da causa</p>
                      <p className="font-medium">{processoData.valor}</p>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Timeline */}
            <Card className="rounded-xl border bg-card">
              <CardContent className="p-5">
                <h4 className="font-display font-bold text-sm mb-4 flex items-center gap-2">
                  <Calendar className="h-4 w-4 text-primary" /> Andamento Processual
                </h4>
                <div className="flex flex-col gap-1">
                  {timeline.map((step, i) => (
                    <div key={step.label} className="flex items-center gap-3">
                      <div className="flex flex-col items-center">
                        <div className={`w-3 h-3 rounded-full border-2 ${step.done ? "bg-primary border-primary" : "bg-background border-muted-foreground/30"}`}>
                          {step.done && <CheckCircle2 className="h-3 w-3 text-primary-foreground" />}
                        </div>
                        {i < timeline.length - 1 && (
                          <div className={`w-0.5 h-6 ${step.done ? "bg-primary/40" : "bg-muted-foreground/20"}`} />
                        )}
                      </div>
                      <div className="flex items-center justify-between flex-1 pb-1">
                        <span className={`text-sm ${step.done ? "font-medium" : "text-muted-foreground"}`}>{step.label}</span>
                        <span className="text-xs text-muted-foreground">{step.date}</span>
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>

            {/* Insights da IA */}
            <Card className="rounded-xl border bg-card">
              <CardContent className="p-5">
                <h4 className="font-display font-bold text-sm mb-3 flex items-center gap-2">
                  <Scale className="h-4 w-4 text-primary" /> Insights da Bia
                </h4>
                <div className="space-y-3">
                  {insights.map((insight) => {
                    const Icon = insight.icon;
                    return (
                      <div key={insight.text} className="flex items-start gap-3 text-sm">
                        <Icon className={`h-4 w-4 mt-0.5 shrink-0 ${insight.color}`} />
                        <span className="text-muted-foreground">{insight.text}</span>
                      </div>
                    );
                  })}
                </div>
              </CardContent>
            </Card>
          </motion.div>
        </div>
      </div>
    </section>
  );
}
