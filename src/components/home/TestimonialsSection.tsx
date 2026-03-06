import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence, useInView } from "framer-motion";
import { useRef } from "react";

const testimonials = [
  {
    id: 1,
    name: "Ana Carolina Simão",
    role: "Administradora",
    company: "Vernalha Pereira",
    content: "Solutions in BI nos ajudou a organizar dados estratégicos, possibilitando decisões assertivas nos âmbitos jurídico e paralegal do escritório. Estamos satisfeitos com a parceria de sucesso!",
  },
  {
    id: 2,
    name: "Fabiane Maciel",
    role: "Diretora Financeira",
    company: "Sofá Novo de Novo",
    content: "A SBI entrou na empresa como parte de uma melhoria contínua. Além de nos atender de forma customizada, entendendo a rotina empresarial e a forma como queríamos enxergar os dados, realizamos reuniões que agregaram ainda mais valor às informações. A SBI está se tornando parte da equipe.",
  },
  {
    id: 3,
    name: "Karin Lima",
    role: "CEO",
    company: "Othree Tech",
    content: "Estou impressionada com o serviço de Business Intelligence, especialmente o processo de ETL, que transformou nossos processos automatizados. Integrar dados de múltiplas fontes de forma eficiente nos permitiu processar e analisar grandes volumes de dados com rapidez e precisão.",
  },
];

export function TestimonialsSection() {
  const [currentIndex, setCurrentIndex] = useState(0);
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground overflow-hidden" ref={ref}>
      <div className="container mx-auto px-4">
        {/* Header */}
        <motion.div 
          className="text-center max-w-3xl mx-auto mb-16"
          initial={{ opacity: 0, y: 40 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.6 }}
        >
          <motion.span 
            className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4"
            initial={{ opacity: 0, scale: 0.8 }}
            animate={isInView ? { opacity: 1, scale: 1 } : {}}
            transition={{ delay: 0.2 }}
          >
            Depoimentos
          </motion.span>
          <motion.h2 
            className="text-3xl md:text-4xl font-display font-bold mb-4"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.3 }}
          >
            O que nossos clientes dizem
          </motion.h2>
          <motion.p 
            className="text-lg text-primary-foreground/70"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Histórias de sucesso de empresas que transformaram seus processos com nossas soluções.
          </motion.p>
        </motion.div>

        {/* Testimonial */}
        <motion.div 
          className="max-w-4xl mx-auto relative"
          initial={{ opacity: 0 }}
          animate={isInView ? { opacity: 1 } : {}}
          transition={{ delay: 0.5 }}
        >
          <div className="text-center">
            <motion.div
              initial={{ scale: 0 }}
              animate={isInView ? { scale: 1 } : {}}
              transition={{ delay: 0.6, type: "spring" }}
            >
              <Quote className="w-12 h-12 text-accent mx-auto mb-8 opacity-50" />
            </motion.div>
            
            <AnimatePresence mode="wait">
              <motion.blockquote
                key={testimonials[currentIndex].id}
                initial={{ opacity: 0, y: 30, scale: 0.95 }}
                animate={{ opacity: 1, y: 0, scale: 1 }}
                exit={{ opacity: 0, y: -30, scale: 0.95 }}
                transition={{ duration: 0.5 }}
                className="text-xl md:text-2xl leading-relaxed mb-8"
              >
                "{testimonials[currentIndex].content}"
              </motion.blockquote>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.div
                key={`author-${testimonials[currentIndex].id}`}
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ duration: 0.4, delay: 0.1 }}
              >
                <motion.div 
                  className="w-16 h-16 mx-auto mb-4 rounded-full bg-accent/20 flex items-center justify-center"
                  whileHover={{ scale: 1.1 }}
                  transition={{ type: "spring", stiffness: 300 }}
                >
                  <span className="font-display font-bold text-xl text-accent">
                    {testimonials[currentIndex].name.split(" ").map(n => n[0]).join("")}
                  </span>
                </motion.div>
                <div className="font-display font-semibold text-lg">
                  {testimonials[currentIndex].name}
                </div>
                <div className="text-primary-foreground/70">
                  {testimonials[currentIndex].role} - {testimonials[currentIndex].company}
                </div>
              </motion.div>
            </AnimatePresence>
          </div>

          {/* Navigation */}
          <motion.div 
            className="flex items-center justify-center gap-4 mt-12"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.7 }}
          >
            <motion.button
              onClick={prev}
              className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Anterior"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronLeft className="w-5 h-5" />
            </motion.button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <motion.button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-8 bg-accent"
                      : "w-2 bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  )}
                  aria-label={`Ir para depoimento ${index + 1}`}
                  whileHover={{ scale: 1.2 }}
                  whileTap={{ scale: 0.9 }}
                />
              ))}
            </div>

            <motion.button
              onClick={next}
              className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Próximo"
              whileHover={{ scale: 1.1 }}
              whileTap={{ scale: 0.95 }}
            >
              <ChevronRight className="w-5 h-5" />
            </motion.button>
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
