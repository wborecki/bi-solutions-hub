import { Link } from "react-router-dom";
import { ArrowRight, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";

export function CTASection() {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <section className="py-24 relative overflow-hidden" ref={ref}>
      <div className="absolute inset-0 bg-primary-dark" />
      
      <motion.div 
        className="absolute top-0 left-0 w-96 h-96 rounded-full bg-accent/10 blur-3xl"
        animate={{ x: [0, 50, 0], y: [0, 30, 0], scale: [1, 1.1, 1] }}
        transition={{ duration: 8, repeat: Infinity, ease: "easeInOut" }}
      />
      <motion.div 
        className="absolute bottom-0 right-0 w-80 h-80 rounded-full bg-white/5 blur-3xl"
        animate={{ x: [0, -30, 0], y: [0, -50, 0], scale: [1, 1.2, 1] }}
        transition={{ duration: 10, repeat: Infinity, ease: "easeInOut", delay: 2 }}
      />
      
      <div className="absolute inset-0 opacity-5">
        <div className="absolute inset-0" style={{
          backgroundImage: `radial-gradient(circle at 1px 1px, white 1px, transparent 0)`,
          backgroundSize: '40px 40px'
        }} />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <motion.div 
          className="max-w-3xl mx-auto text-center text-primary-foreground"
          initial={{ opacity: 0, y: 60 }}
          animate={isInView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.7 }}
        >
          <motion.h2 
            className="text-3xl md:text-4xl lg:text-5xl font-display font-bold mb-6"
            initial={{ opacity: 0, y: 30 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.2 }}
          >
            Pronto para transformar seus dados em{" "}
            <motion.span 
              className="text-accent"
              animate={{ opacity: [0.7, 1, 0.7] }}
              transition={{ duration: 2, repeat: Infinity }}
            >
              resultados
            </motion.span>
            ?
          </motion.h2>
          
          <motion.p 
            className="text-lg md:text-xl text-primary-foreground/80 mb-8 leading-relaxed"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.4 }}
          >
            Entre em contato conosco e descubra como nossas soluções podem 
            impulsionar a eficiência e a tomada de decisões do seu negócio.
          </motion.p>
          
          <motion.div 
            className="flex flex-wrap gap-4 justify-center"
            initial={{ opacity: 0, y: 20 }}
            animate={isInView ? { opacity: 1, y: 0 } : {}}
            transition={{ delay: 0.6 }}
          >
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                asChild 
                size="lg" 
                className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold shadow-lg"
              >
                <Link to="/contato">
                  Solicitar Contato
                  <ArrowRight className="w-4 h-4 ml-2" />
                </Link>
              </Button>
            </motion.div>
            <motion.div whileHover={{ scale: 1.05 }} whileTap={{ scale: 0.95 }}>
              <Button 
                asChild 
                size="lg" 
                variant="outline" 
                className="border-primary-foreground/30 text-primary-foreground hover:bg-primary-foreground/10 backdrop-blur-sm"
              >
                <a 
                  href="https://wa.me/551151920925?text=Olá! Gostaria de saber mais sobre as soluções da Solutions in BI." 
                  target="_blank" 
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  WhatsApp
                </a>
              </Button>
            </motion.div>
          </motion.div>

          <motion.div 
            className="mt-12 flex flex-wrap items-center justify-center gap-8 text-primary-foreground/60 text-sm"
            initial={{ opacity: 0 }}
            animate={isInView ? { opacity: 1 } : {}}
            transition={{ delay: 0.8 }}
          >
            {["+5 anos de experiência", "+50 projetos entregues", "100% de satisfação"].map((item, index) => (
              <motion.span 
                key={item}
                className="flex items-center gap-2"
                initial={{ opacity: 0, y: 10 }}
                animate={isInView ? { opacity: 1, y: 0 } : {}}
                transition={{ delay: 0.9 + index * 0.1 }}
              >
                <div className="w-1.5 h-1.5 rounded-full bg-accent" />
                {item}
              </motion.span>
            ))}
          </motion.div>
        </motion.div>
      </div>
    </section>
  );
}
