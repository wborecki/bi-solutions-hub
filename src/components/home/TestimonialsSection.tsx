import { useState } from "react";
import { ChevronLeft, ChevronRight, Quote } from "lucide-react";
import { cn } from "@/lib/utils";

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

  const next = () => {
    setCurrentIndex((prev) => (prev + 1) % testimonials.length);
  };

  const prev = () => {
    setCurrentIndex((prev) => (prev - 1 + testimonials.length) % testimonials.length);
  };

  return (
    <section className="py-24 bg-primary text-primary-foreground overflow-hidden">
      <div className="container mx-auto px-4">
        {/* Header */}
        <div className="text-center max-w-3xl mx-auto mb-16">
          <span className="inline-block px-4 py-1.5 rounded-full bg-brand-tiffany/20 text-brand-tiffany text-sm font-medium mb-4">
            Depoimentos
          </span>
          <h2 className="text-3xl md:text-4xl font-display font-bold mb-4">
            O que nossos clientes dizem
          </h2>
          <p className="text-lg text-primary-foreground/70">
            Histórias de sucesso de empresas que transformaram seus processos com nossas soluções.
          </p>
        </div>

        {/* Testimonial */}
        <div className="max-w-4xl mx-auto relative">
          <div className="text-center">
            <Quote className="w-12 h-12 text-brand-tiffany mx-auto mb-8 opacity-50" />
            
            <blockquote
              key={testimonials[currentIndex].id}
              className="text-xl md:text-2xl leading-relaxed mb-8 animate-fade-in"
            >
              "{testimonials[currentIndex].content}"
            </blockquote>

            <div className="animate-fade-in" style={{ animationDelay: "0.1s" }}>
              <div className="w-16 h-16 mx-auto mb-4 rounded-full bg-brand-tiffany/20 flex items-center justify-center">
                <span className="font-display font-bold text-xl text-brand-tiffany">
                  {testimonials[currentIndex].name.split(" ").map(n => n[0]).join("")}
                </span>
              </div>
              <div className="font-display font-semibold text-lg">
                {testimonials[currentIndex].name}
              </div>
              <div className="text-primary-foreground/70">
                {testimonials[currentIndex].role} - {testimonials[currentIndex].company}
              </div>
            </div>
          </div>

          {/* Navigation */}
          <div className="flex items-center justify-center gap-4 mt-12">
            <button
              onClick={prev}
              className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Anterior"
            >
              <ChevronLeft className="w-5 h-5" />
            </button>

            <div className="flex gap-2">
              {testimonials.map((_, index) => (
                <button
                  key={index}
                  onClick={() => setCurrentIndex(index)}
                  className={cn(
                    "w-2 h-2 rounded-full transition-all",
                    index === currentIndex
                      ? "w-8 bg-brand-tiffany"
                      : "bg-primary-foreground/30 hover:bg-primary-foreground/50"
                  )}
                  aria-label={`Ir para depoimento ${index + 1}`}
                />
              ))}
            </div>

            <button
              onClick={next}
              className="p-3 rounded-full bg-primary-foreground/10 hover:bg-primary-foreground/20 transition-colors"
              aria-label="Próximo"
            >
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  );
}
