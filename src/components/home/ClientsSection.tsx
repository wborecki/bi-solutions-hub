import { motion } from "framer-motion";
import clientesLogos from "@/assets/clientes-logos.png";

export function ClientsSection() {
  return (
    <section className="py-12 border-y border-border bg-muted/30 overflow-hidden flex flex-col items-center">
      <div className="text-center mb-8 px-4">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Empresas que confiam na Solutions in BI
        </h2>
      </div>

      {/* Container do carrossel */}
      <div className="relative w-full flex overflow-hidden">
        {/* Máscaras de gradiente nas bordas para suavizar a entrada e saída */}
        <div className="pointer-events-none absolute inset-y-0 left-0 w-1/6 bg-gradient-to-r from-background to-transparent z-10"></div>
        <div className="pointer-events-none absolute inset-y-0 right-0 w-1/6 bg-gradient-to-l from-background to-transparent z-10"></div>

        <motion.div
          className="flex whitespace-nowrap"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 20, // Ajuste a velocidade aqui
          }}
        >
          {/* A imagem é repetida para criar o efeito infinito. 
              O mix-blend-multiply e grayscale deixam preto e branco e mesclam o fundo. */}
          <div className="flex shrink-0">
            <img 
              src={clientesLogos} 
              alt="Logos de clientes" 
              className="h-20 md:h-28 object-contain grayscale opacity-70 mix-blend-multiply contrast-125 px-8" 
            />
            <img 
              src={clientesLogos} 
              alt="Logos de clientes" 
              className="h-20 md:h-28 object-contain grayscale opacity-70 mix-blend-multiply contrast-125 px-8" 
            />
          </div>
        </motion.div>
      </div>
    </section>
  );
}
