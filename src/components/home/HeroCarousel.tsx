import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import heroBi from "@/assets/hero-bi.jpg";
import heroRobos from "@/assets/hero-robos.jpg";
import heroJurimetria from "@/assets/hero-jurimetria.jpg";

const slides = [
  {
    id: 1,
    title: "Business",
    titleHighlight: "Intelligence",
    description: "Transforme dados em insights estratégicos com soluções de BI personalizadas para o seu negócio.",
    href: "/solucoes/business-intelligence",
    image: heroBi,
  },
  {
    id: 2,
    title: "Robôs",
    titleHighlight: "Jurídicos",
    description: "Automatize consultas em tribunais e processos repetitivos, liberando sua equipe para focar na estratégia.",
    href: "/solucoes/robos-juridicos",
    image: heroRobos,
  },
  {
    id: 3,
    title: "Análise",
    titleHighlight: "Jurimétrica",
    description: "Análise estatística de dados jurídicos para previsibilidade e tomada de decisões assertivas.",
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

  return (
    <section className="relative h-screen flex items-center overflow-hidden">
      {/* Background Images - All preloaded, visibility controlled */}
      {slides.map((s, index) => (
        <div
          key={s.id}
          className="absolute inset-0 transition-opacity duration-700 ease-in-out"
          style={{ opacity: index === currentSlide ? 1 : 0 }}
        >
          <div 
            className="absolute inset-0 bg-cover bg-center bg-no-repeat"
            style={{ backgroundImage: `url(${s.image})` }}
          />
          {/* Dark overlay with gradient */}
          <div className="absolute inset-0 bg-gradient-to-r from-primary/95 via-primary/85 to-primary/60" />
        </div>
      ))}

      {/* Content */}
      <div className="container mx-auto px-4 relative z-10">
        <div className="max-w-3xl">
          <AnimatePresence mode="wait">
            <motion.div 
              key={slide.id}
              initial={{ opacity: 0, y: 40 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -40 }}
              transition={{ duration: 0.6 }}
              className="space-y-6"
            >
              {/* Title */}
              <motion.h1
                className="text-5xl md:text-6xl lg:text-7xl font-display font-bold leading-tight"
                initial={{ opacity: 0, y: 30 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.1 }}
              >
                <span className="text-white">{slide.title} </span>
                <span className="text-accent">{slide.titleHighlight}</span>
              </motion.h1>

              {/* Description */}
              <motion.p
                className="text-lg md:text-xl text-white/80 leading-relaxed max-w-xl"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.2 }}
              >
                {slide.description}
              </motion.p>

              {/* Buttons */}
              <motion.div
                className="flex flex-wrap gap-4 pt-4"
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.3 }}
              >
                <Button 
                  asChild 
                  size="lg" 
                  className="bg-accent text-accent-foreground hover:bg-accent/90 font-semibold px-8"
                >
                  <Link to={slide.href}>
                    Saiba Mais
                    <ChevronRight className="w-4 h-4 ml-2" />
                  </Link>
                </Button>
                <Button 
                  asChild 
                  variant="outline" 
                  size="lg" 
                  className="border-white/30 text-white hover:bg-white/10 backdrop-blur-sm"
                >
                  <Link to="/contato">Fale Conosco</Link>
                </Button>
              </motion.div>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Navigation Arrows */}
      <div className="absolute left-4 right-4 top-1/2 -translate-y-1/2 flex justify-between z-20 pointer-events-none">
        <motion.button
          onClick={prevSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all pointer-events-auto"
          aria-label="Slide anterior"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronLeft className="w-6 h-6 text-white" />
        </motion.button>
        <motion.button
          onClick={nextSlide}
          className="p-3 rounded-full bg-white/10 backdrop-blur-sm hover:bg-white/20 transition-all pointer-events-auto"
          aria-label="Próximo slide"
          whileHover={{ scale: 1.1 }}
          whileTap={{ scale: 0.95 }}
        >
          <ChevronRight className="w-6 h-6 text-white" />
        </motion.button>
      </div>

      {/* Indicators - Bottom center */}
      <motion.div 
        className="absolute bottom-12 left-1/2 -translate-x-1/2 flex gap-3 z-20"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.5 }}
      >
        {slides.map((_, index) => (
          <button
            key={index}
            onClick={() => goToSlide(index)}
            className={cn(
              "h-2 rounded-full transition-all duration-300",
              index === currentSlide
                ? "w-10 bg-accent"
                : "w-2 bg-white/40 hover:bg-white/60"
            )}
            aria-label={`Ir para slide ${index + 1}`}
          />
        ))}
      </motion.div>

      {/* Decorative line art - subtle like reference */}
      <div className="absolute right-0 top-1/2 -translate-y-1/2 w-1/3 h-1/2 pointer-events-none opacity-10">
        <svg viewBox="0 0 200 200" className="w-full h-full" fill="none" stroke="white" strokeWidth="0.5">
          <path d="M50,100 L100,50 L150,100 L100,150 Z" />
          <path d="M70,100 L100,70 L130,100 L100,130 Z" />
          <line x1="100" y1="0" x2="100" y2="200" />
          <line x1="0" y1="100" x2="200" y2="100" />
        </svg>
      </div>
    </section>
  );
}
