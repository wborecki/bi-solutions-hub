import { useRef, useEffect, useState } from "react";
import logoVP from "@/assets/logo-vernalha-pereira.png";
import logoSofae from "@/assets/logo-sofae.webp";
import logoFL from "@/assets/logo-future-law.png";
import logoVT from "@/assets/logo-vt-advogados.webp";
import logoSeleme from "@/assets/logo-seleme.png";
import logoOAB from "@/assets/logo-oab-parana.png";
import logoLA from "@/assets/logo-luis-albert.webp";
import logoFebrapo from "@/assets/logo-febrapo.webp";
import logoC3 from "@/assets/logo-c3.webp";
import logoEBDA from "@/assets/logo-ebda.webp";
import logoMS from "@/assets/logo-ms.webp";

const clients = [
  { name: "Vernalha Pereira", logo: logoVP },
  { name: "SOFAE", logo: logoSofae },
  { name: "Future Law", logo: logoFL },
  { name: "VT Advogados", logo: logoVT },
  { name: "Seleme", logo: logoSeleme },
  { name: "OAB Paraná", logo: logoOAB },
  { name: "Luis Albert Advogados", logo: logoLA },
  { name: "FEBRAPO", logo: logoFebrapo },
  { name: "C3", logo: logoC3 },
  { name: "EBDA", logo: logoEBDA },
  { name: "MS", logo: logoMS },
];

export function ClientsSection() {
  const trackRef = useRef<HTMLDivElement>(null);
  const [halfWidth, setHalfWidth] = useState(0);

  useEffect(() => {
    const measure = () => {
      if (trackRef.current) {
        // Half = width of the first set of logos
        setHalfWidth(trackRef.current.scrollWidth / 2);
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
        <div className="pointer-events-none absolute inset-y-0 left-0 w-24 bg-gradient-to-r from-muted/80 to-transparent z-10" />
        <div className="pointer-events-none absolute inset-y-0 right-0 w-24 bg-gradient-to-l from-muted/80 to-transparent z-10" />

        <div
          ref={trackRef}
          className="flex items-center gap-16 w-max"
          style={{
            animation: halfWidth ? `scroll-left ${25}s linear infinite` : undefined,
            // CSS custom property for the keyframe
            ["--scroll-distance" as string]: `-${halfWidth}px`,
          }}
        >
          {[...clients, ...clients].map((client, i) => (
            <div key={i} className="flex items-center whitespace-nowrap select-none px-2">
              <img
                src={client.logo}
                alt={client.name}
                loading="lazy"
                className="h-16 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </div>
      </div>

      <style>{`
        @keyframes scroll-left {
          0% { transform: translateX(0); }
          100% { transform: translateX(var(--scroll-distance)); }
        }
      `}</style>
    </section>
  );
}
