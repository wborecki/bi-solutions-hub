import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, Bot, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import heroBi from "@/assets/hero-bi.jpg";
import heroRobos from "@/assets/hero-robos.jpg";
import heroJurimetria from "@/assets/hero-jurimetria.jpg";

const slides = [
  {
    id: 1,
    title: "Business Intelligence",
    subtitle: "Dashboards e relatórios customizados",
    description: "Transforme dados em insights estratégicos com soluções de BI personalizadas para o seu negócio.",
    icon: BarChart3,
    href: "/solucoes/business-intelligence",
    image: heroBi,
  },
  {
    id: 2,
    title: "Robôs Jurídicos",
    subtitle: "Automação inteligente",
    description: "Automatize consultas em tribunais e processos repetitivos, liberando sua equipe para focar na estratégia.",
    icon: Bot,
    href: "/solucoes/robos-juridicos",
    image: heroRobos,
  },
  {
    id: 3,
    title: "Jurimetria",
    subtitle: "Inteligência jurídica baseada em dados",
    description: "Análise estatística de dados jurídicos para previsibilidade e tomada de decisões assertivas.",
    icon: Scale,
    href: "/solucoes/jurimetria",
    image: heroJurimetria,
  },
];

export function HeroCarousel() {
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isAutoPlaying, setIsAutoPlaying] = useState(true);

  const nextSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  }, []);

  const prevSlide = useCallback(() => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  }, []);

  const goToSlide = (index: number) => {
    setCurrentSlide(index);
    setIsAutoPlaying(false);
    setTimeout(() => setIsAutoPlaying(true), 10000);
  };

  useEffect(() => {
    if (!isAutoPlaying) return;
    const interval = setInterval(nextSlide, 5000);
    return () => clearInterval(interval);
  }, [isAutoPlaying, nextSlide]);

  const slide = slides[currentSlide];
  const IconComponent = slide.icon;

  return (
    <section className="relative min-h-screen flex items-center overflow-hidden bg-background pt-20">
      {/* Background Image */}
      <AnimatePresence mode="wait">
        <motion.div
          key={slide.id}
          initial={{ opacity: 0, scale: 1.1 }}
          animate={{ opacity: 1, scale: 1 }}
          exit={{ opacity: 0, scale: 0.95 }}
          transition={{ duration: 0.7, ease: "easeOut" }}
          className="absolute inset-0"
        >
          <div 
            className="absolute inset-0 bg-cover bg-center"
            style={{ backgroundImage: `url(${slide.image})` }}
          />
          <div className="absolute inset-0 bg-gradient-to-r from-background via-background/90 to-background/40" />
        </motion.div>
      </AnimatePresence>

      {/* Floating decoration */}
      <motion.div 
        className="absolute top-1/3 right-1/4 w-[300px] h-[300px] rounded-full bg-brand-tiffany/10 blur-3xl"
        animate={{ 
          y: [0, -30, 0],
          opacity: [0.3, 0.5, 0.3]
        }}
        transition={{ 
          duration: 6, 
          repeat: Infinity,
          ease: "easeInOut"
        }}
      />

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <AnimatePresence mode="wait">
              <motion.div 
                key={slide.id}
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -30 }}
                transition={{ duration: 0.5 }}
                className="space-y-2"
              >
                <motion.span 
                  className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium backdrop-blur-sm"
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.1 }}
                >
                  {slide.subtitle}
                </motion.span>
                <motion.h1
                  className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight"
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: 0.2 }}
                >
                  {slide.title}
                </motion.h1>
              </motion.div>
            </AnimatePresence>

            <AnimatePresence mode="wait">
              <motion.p
                key={`desc-${slide.id}`}
                className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -20 }}
                transition={{ delay: 0.3, duration: 0.5 }}
              >
                {slide.description}
              </motion.p>
            </AnimatePresence>

            <motion.div
              className="flex flex-wrap gap-4"
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.4 }}
            >
              <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90">
                <Link to={slide.href}>Saiba Mais</Link>
              </Button>
              <Button asChild variant="outline" size="lg" className="backdrop-blur-sm">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </motion.div>

            {/* Indicators */}
            <motion.div 
              className="flex items-center gap-6 pt-4"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 0.5 }}
            >
              <div className="flex gap-2">
                {slides.map((_, index) => (
                  <button
                    key={index}
                    onClick={() => goToSlide(index)}
                    className={cn(
                      "h-2 rounded-full transition-all duration-300",
                      index === currentSlide
                        ? "w-8 bg-primary"
                        : "w-2 bg-muted-foreground/30 hover:bg-muted-foreground/50"
                    )}
                    aria-label={`Ir para slide ${index + 1}`}
                  />
                ))}
              </div>
              <span className="text-sm text-muted-foreground">
                {String(currentSlide + 1).padStart(2, "0")} / {String(slides.length).padStart(2, "0")}
              </span>
            </motion.div>
          </div>

          {/* Visual */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            <AnimatePresence mode="wait">
              <motion.div
                key={slide.id}
                initial={{ opacity: 0, scale: 0.8, rotate: -5 }}
                animate={{ opacity: 1, scale: 1, rotate: 0 }}
                exit={{ opacity: 0, scale: 0.8, rotate: 5 }}
                transition={{ duration: 0.5, type: "spring", stiffness: 100 }}
                className="relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-brand shadow-2xl flex items-center justify-center overflow-hidden"
              >
                <div className="absolute inset-0 bg-black/20" />
                <IconComponent className="w-24 h-24 md:w-32 md:h-32 text-white/90 relative z-10" strokeWidth={1.5} />
                
                {/* Pulse ring */}
                <motion.div
                  className="absolute inset-0 rounded-3xl border-2 border-white/30"
                  animate={{ scale: [1, 1.1, 1], opacity: [0.5, 0, 0.5] }}
                  transition={{ duration: 2, repeat: Infinity }}
                />
              </motion.div>
            </AnimatePresence>
            
            {/* Floating elements */}
            <motion.div 
              className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center"
              animate={{ y: [0, -10, 0] }}
              transition={{ duration: 3, repeat: Infinity, ease: "easeInOut" }}
            >
              <BarChart3 className="w-8 h-8 text-brand-tiffany" />
            </motion.div>
            <motion.div 
              className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl bg-background shadow-lg flex items-center justify-center"
              animate={{ y: [0, 10, 0] }}
              transition={{ duration: 4, repeat: Infinity, ease: "easeInOut", delay: 1 }}
            >
              <div className="text-center">
                <div className="text-2xl font-display font-bold text-primary">+5</div>
                <div className="text-xs text-muted-foreground">anos</div>
              </div>
            </motion.div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 lg:-left-4 p-3 rounded-full bg-background shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 lg:-right-4 p-3 rounded-full bg-background shadow-lg hover:shadow-xl transition-all hover:scale-110"
              aria-label="Próximo slide"
            >
              <ChevronRight className="w-6 h-6 text-foreground" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
