import { motion } from "framer-motion";

const clients = [
  "Vernalha Pereira",
  "SOFAE",
  "Future Law",
  "VT Advogados",
  "Seleme",
  "OAB Paraná",
  "Luis Albert Advogados",
  "FEBRAPO",
  "C3",
  "EBDA",
  "MS",
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
          {[...clients, ...clients].map((name, i) => (
            <span
              key={i}
              className="text-lg md:text-xl font-bold tracking-wide text-muted-foreground/50 whitespace-nowrap select-none uppercase"
            >
              {name}
            </span>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
