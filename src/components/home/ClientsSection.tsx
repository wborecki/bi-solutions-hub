import { useRef, useEffect, useState } from "react";
import logoVP from "@/assets/logo-vernalha-pereira.webp";
import logoSofaNN from "@/assets/logo-sofa-novo-de-novo.webp";
import logoFL from "@/assets/logo-future-law.webp";
import logoValera from "@/assets/logo-valera-advogados.webp";
import logoSeleme from "@/assets/logo-seleme.webp";
import logoOAB from "@/assets/logo-oab-parana.webp";
import logoLegalTrade from "@/assets/logo-legaltrade.webp";
import logoBDA from "@/assets/logo-bda.webp";

const clients = [
  { name: "Vernalha Pereira", logo: logoVP },
  { name: "Sofá Novo de Novo", logo: logoSofaNN },
  { name: "Future Law", logo: logoFL },
  { name: "Valera Advogados", logo: logoValera },
  { name: "Seleme Advocacia", logo: logoSeleme },
  { name: "OAB Paraná", logo: logoOAB },
  { name: "LegalTrade", logo: logoLegalTrade },
  { name: "BDA Gestão Jurídica", logo: logoBDA },
];

export function ClientsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Measure width of one complete set of logos (including gaps)
        const firstChild = trackRef.current.firstElementChild;
        if (firstChild) {
          const childrenCount = trackRef.current.children.length / 3; // We have 3 copies
          let width = 0;
          for (let i = 0; i < childrenCount; i++) {
            const child = trackRef.current.children[i] as HTMLElement;
            width += child.offsetWidth;
          }
          setSingleSetWidth(width);
        }
      }
    };
    measure();
    window.addEventListener("resize", measure);
    return () => window.removeEventListener("resize", measure);
  }, []);

  return (
    <section className="py-12 border-y border-border bg-muted/30 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Empresas que confiam na Solutions in BI
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-32 bg-gradient-to-r from-muted/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-32 bg-gradient-to-l from-muted/80 to-transparent z-10" />

        <div
          ref={trackRef}
          className="flex items-center gap-20 w-max py-4"
          style={{
            animation: singleSetWidth ? `scroll-left ${50}s linear infinite` : undefined,
          }}
        >
          {[...clients, ...clients, ...clients].map((client, i) => (
            <div key={i} className="flex items-center justify-center whitespace-nowrap select-none px-4">
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="h-20 w-auto max-w-[180px] object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300 filter drop-shadow-sm"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { 
            transform: translateX(0); 
          }
          100% { 
            transform: translateX(calc(-100% / 3)); 
          }
        }
      `}</style>
    </section>
  );
}
