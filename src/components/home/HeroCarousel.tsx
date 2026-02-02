import { useState, useEffect, useCallback } from "react";
import { Link } from "react-router-dom";
import { ChevronLeft, ChevronRight, BarChart3, Bot, Scale } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

const slides = [
  {
    id: 1,
    title: "Business Intelligence",
    subtitle: "Dashboards e relatórios customizados",
    description: "Transforme dados em insights estratégicos com soluções de BI personalizadas para o seu negócio.",
    icon: BarChart3,
    href: "/solucoes/business-intelligence",
    color: "from-primary to-secondary",
  },
  {
    id: 2,
    title: "Robôs Jurídicos",
    subtitle: "Automação inteligente",
    description: "Automatize consultas em tribunais e processos repetitivos, liberando sua equipe para focar na estratégia.",
    icon: Bot,
    href: "/solucoes/robos-juridicos",
    color: "from-secondary to-brand-tiffany",
  },
  {
    id: 3,
    title: "Jurimetria",
    subtitle: "Inteligência jurídica baseada em dados",
    description: "Análise estatística de dados jurídicos para previsibilidade e tomada de decisões assertivas.",
    icon: Scale,
    href: "/solucoes/jurimetria",
    color: "from-brand-tiffany to-primary",
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
      {/* Background decoration */}
      <div className="absolute inset-0 overflow-hidden">
        <div className="absolute -top-1/2 -right-1/4 w-[800px] h-[800px] rounded-full bg-gradient-to-br from-accent/20 to-transparent blur-3xl" />
        <div className="absolute -bottom-1/4 -left-1/4 w-[600px] h-[600px] rounded-full bg-gradient-to-tr from-secondary/10 to-transparent blur-3xl" />
        <div className="absolute top-1/3 left-1/2 w-[400px] h-[400px] rounded-full bg-gradient-to-r from-brand-tiffany/5 to-transparent blur-2xl animate-float" />
      </div>

      <div className="container mx-auto px-4 relative z-10">
        <div className="grid lg:grid-cols-2 gap-12 items-center">
          {/* Content */}
          <div className="space-y-8">
            <div className="space-y-2">
              <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium animate-fade-in">
                {slide.subtitle}
              </span>
              <h1
                key={slide.id}
                className="text-4xl md:text-5xl lg:text-6xl font-display font-bold text-foreground leading-tight animate-fade-in"
                style={{ animationDelay: "0.1s" }}
              >
                {slide.title}
              </h1>
            </div>

            <p
              className="text-lg md:text-xl text-muted-foreground leading-relaxed max-w-lg animate-fade-in"
              style={{ animationDelay: "0.2s" }}
            >
              {slide.description}
            </p>

            <div
              className="flex flex-wrap gap-4 animate-fade-in"
              style={{ animationDelay: "0.3s" }}
            >
              <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90">
                <Link to={slide.href}>Saiba Mais</Link>
              </Button>
              <Button asChild variant="outline" size="lg">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>

            {/* Indicators */}
            <div className="flex items-center gap-6 pt-4">
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
            </div>
          </div>

          {/* Visual */}
          <div className="relative lg:h-[500px] flex items-center justify-center">
            {/* Icon display */}
            <div
              key={slide.id}
              className={cn(
                "relative w-64 h-64 md:w-80 md:h-80 rounded-3xl bg-gradient-to-br",
                slide.color,
                "shadow-2xl animate-scale-in flex items-center justify-center"
              )}
            >
              <IconComponent className="w-24 h-24 md:w-32 md:h-32 text-white/90" strokeWidth={1.5} />
              
              {/* Floating elements */}
              <div className="absolute -top-4 -right-4 w-16 h-16 rounded-2xl bg-background shadow-lg flex items-center justify-center animate-float">
                <BarChart3 className="w-8 h-8 text-brand-tiffany" />
              </div>
              <div className="absolute -bottom-6 -left-6 w-20 h-20 rounded-2xl bg-background shadow-lg flex items-center justify-center animate-float" style={{ animationDelay: "1s" }}>
                <div className="text-center">
                  <div className="text-2xl font-display font-bold text-primary">+5</div>
                  <div className="text-xs text-muted-foreground">anos</div>
                </div>
              </div>
            </div>

            {/* Navigation arrows */}
            <button
              onClick={prevSlide}
              className="absolute left-0 lg:-left-4 p-3 rounded-full bg-background shadow-lg hover:shadow-xl transition-shadow"
              aria-label="Slide anterior"
            >
              <ChevronLeft className="w-6 h-6 text-foreground" />
            </button>
            <button
              onClick={nextSlide}
              className="absolute right-0 lg:-right-4 p-3 rounded-full bg-background shadow-lg hover:shadow-xl transition-shadow"
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
