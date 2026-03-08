import { useRef, useEffect, useState } from "react";
import logoVP from "@/assets/logo-vernalha-pereira.webp";
import logoSofae from "@/assets/logo-sofae.webp";
import logoFL from "@/assets/logo-future-law.webp";
import logoVT from "@/assets/logo-vt-advogados.webp";
import logoSeleme from "@/assets/logo-seleme.webp";
import logoOAB from "@/assets/logo-oab-parana.webp";
import logoOthree from "@/assets/logo-c3.webp";
import logoBDA from "@/assets/logo-ebda.webp";
import logoLegalTrade from "@/assets/logo-legaltrade.webp";

const clients = [
  { name: "Vernalha Pereira", logo: logoVP },
  { name: "Sofá Novo de Novo", logo: logoSofae },
  { name: "FutureLaw", logo: logoFL },
  { name: "Valera & Tavares", logo: logoVT },
  { name: "Seleme Advocacia", logo: logoSeleme },
  { name: "OAB Paraná", logo: logoOAB },
  { name: "O'three", logo: logoOthree },
  { name: "BDA Gestão Jurídica", logo: logoBDA },
  { name: "LegalTrade", logo: logoLegalTrade },
];

export function ClientsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [singleSetWidth, setSingleSetWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (!trackRef.current) return;
      // Measure one set of logos (the first N children)
      const children = trackRef.current.children;
      const count = clients.length;
      let width = 0;
      for (let i = 0; i < count && i < children.length; i++) {
        const child = children[i] as HTMLElement;
        width += child.offsetWidth;
      }
      // Add gaps: gap-14 = 3.5rem = 56px, count gaps between items in one set
      width += (count - 1) * 56;
      // Add the gap after the last item of the first set (before second set starts)
      width += 56;
      setSingleSetWidth(width);
    };

    // Wait for images to load before measuring
    const images = trackRef.current?.querySelectorAll("img") ?? [];
    let loaded = 0;
    const total = images.length;

    const onLoad = () => {
      loaded++;
      if (loaded >= total) measure();
    };

    images.forEach((img) => {
      if (img.complete) {
        loaded++;
      } else {
        img.addEventListener("load", onLoad);
      }
    });

    if (loaded >= total) measure();

    window.addEventListener("resize", measure);
    return () => {
      window.removeEventListener("resize", measure);
      images.forEach((img) => img.removeEventListener("load", onLoad));
    };
  }, []);

  return (
    <section className="py-12 border-y border-border bg-muted/30 overflow-hidden">
      <div className="text-center mb-8 px-4">
        <h2 className="text-sm font-semibold tracking-wider text-muted-foreground uppercase">
          Empresas que confiam na Solutions in BI
        </h2>
      </div>

      <div className="relative w-full overflow-hidden">
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-muted/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-muted/80 to-transparent z-10" />

        <div
          ref={trackRef}
          className="flex items-center gap-14 w-max"
          style={{
            animation: singleSetWidth
              ? `carousel-scroll ${30}s linear infinite`
              : undefined,
          }}
        >
          {/* Render 3 copies for seamless infinite loop */}
          {[...clients, ...clients, ...clients].map((client, i) => (
            <div
              key={`${client.name}-${i}`}
              className="flex-shrink-0 flex items-center justify-center select-none"
              style={{ width: 200, height: 100 }}
            >
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="max-h-20 max-w-[180px] w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 drop-shadow-sm transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes carousel-scroll {
          0% { transform: translateX(0); }
          100% { transform: translateX(-${singleSetWidth}px); }
        }
      `}</style>
    </section>
  );
}
