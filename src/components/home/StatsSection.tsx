import { useRef, useEffect, useState } from "react";
import { motion, useInView } from "framer-motion";
import { Users, TrendingUp, Zap, Award } from "lucide-react";

const stats = [
  { icon: Users, value: 50, suffix: "+", label: "Clientes atendidos" },
  { icon: TrendingUp, value: 98, suffix: "%", label: "Satisfação dos clientes" },
  { icon: Zap, value: 500, suffix: "k+", label: "Processos automatizados" },
  { icon: Award, value: 5, suffix: "+", label: "Anos de experiência" },
];

function AnimatedNumber({ target, suffix, inView }: { target: number; suffix: string; inView: boolean }) {
  const [count, setCount] = useState(0);

  useEffect(() => {
    if (!inView) return;
    let start = 0;
    const duration = 1500;
    const step = Math.max(1, Math.floor(target / (duration / 16)));
    const timer = setInterval(() => {
      start += step;
      if (start >= target) {
        setCount(target);
        clearInterval(timer);
      } else {
        setCount(start);
      }
    }, 16);
    return () => clearInterval(timer);
  }, [inView, target]);

  return (
    <span className="text-3xl md:text-4xl font-display font-bold text-primary">
      {count}{suffix}
    </span>
  );
}

export function StatsSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-12 md:py-16 border-y bg-muted/30">
      <div className="max-w-6xl mx-auto px-4">
        <motion.div
          className="grid grid-cols-2 md:grid-cols-4 gap-8"
          initial={{ opacity: 0, y: 20 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div key={stat.label} className="text-center space-y-2">
                <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center mx-auto mb-2">
                  <Icon className="h-5 w-5 text-primary" />
                </div>
                <AnimatedNumber target={stat.value} suffix={stat.suffix} inView={inView} />
                <p className="text-sm text-muted-foreground">{stat.label}</p>
              </div>
            );
          })}
        </motion.div>
      </div>
    </section>
  );
}
