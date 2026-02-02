import { Link } from "react-router-dom";
import { ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";

export function CTASection() {
  return (
    <section className="py-24 bg-muted/30">
      <div className="container mx-auto px-4">
        <div className="max-w-4xl mx-auto text-center">
          <h2 className="text-3xl md:text-4xl font-display font-bold text-foreground mb-4">
            Pronto para transformar seus{" "}
            <span className="text-gradient">dados em resultados</span>?
          </h2>
          <p className="text-lg text-muted-foreground mb-8 max-w-2xl mx-auto">
            Entre em contato conosco e descubra como podemos ajudar sua empresa 
            a tomar decisões mais inteligentes com base em dados.
          </p>
          <div className="flex flex-wrap gap-4 justify-center">
            <Button asChild size="lg" className="bg-gradient-brand hover:opacity-90">
              <Link to="/contato">
                Fale com um Especialista
                <ArrowRight className="w-4 h-4 ml-2" />
              </Link>
            </Button>
            <Button asChild variant="outline" size="lg">
              <Link to="/solucoes">Conhecer Soluções</Link>
            </Button>
          </div>
        </div>
      </div>
    </section>
  );
}
