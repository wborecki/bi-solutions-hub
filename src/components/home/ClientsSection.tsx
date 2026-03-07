import { motion } from "framer-motion";
import logoVP from "@/assets/logo-vernalha-pereira.png";
import logoSofae from "@/assets/logo-sofae.png";
import logoFL from "@/assets/logo-future-law.png";
import logoVT from "@/assets/logo-vt-advogados.png";
import logoSeleme from "@/assets/logo-seleme.png";
import logoOAB from "@/assets/logo-oab-parana.png";
import logoLA from "@/assets/logo-luis-albert.png";
import logoFebrapo from "@/assets/logo-febrapo.png";
import logoC3 from "@/assets/logo-c3.png";
import logoEBDA from "@/assets/logo-ebda.png";
import logoMS from "@/assets/logo-ms.png";

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

        <motion.div
          className="flex items-center gap-16 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {[...clients, ...clients].map((client, i) => (
            <div key={i} className="flex items-center whitespace-nowrap select-none">
              <img
                src={client.logo}
                alt={client.name}
                className="h-10 w-auto object-contain grayscale opacity-70 hover:grayscale-0 hover:opacity-100 transition-all duration-300"
              />
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
