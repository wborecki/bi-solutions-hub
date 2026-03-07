import { motion } from "framer-motion";

const clients = [
  { name: "Vernalha Pereira", initials: "VP", color: "from-violet-500 to-purple-600" },
  { name: "SOFAE", initials: "SF", color: "from-emerald-500 to-teal-600" },
  { name: "Future Law", initials: "FL", color: "from-blue-500 to-indigo-600" },
  { name: "VT Advogados", initials: "VT", color: "from-rose-500 to-pink-600" },
  { name: "Seleme", initials: "SE", color: "from-amber-500 to-orange-600" },
  { name: "OAB Paraná", initials: "OAB", color: "from-sky-500 to-cyan-600" },
  { name: "Luis Albert Advogados", initials: "LA", color: "from-fuchsia-500 to-purple-600" },
  { name: "FEBRAPO", initials: "FP", color: "from-lime-500 to-green-600" },
  { name: "C3", initials: "C3", color: "from-indigo-500 to-blue-600" },
  { name: "EBDA", initials: "EB", color: "from-teal-500 to-emerald-600" },
  { name: "MS", initials: "MS", color: "from-orange-500 to-red-600" },
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
          className="flex items-center gap-12 w-max"
          animate={{ x: ["0%", "-50%"] }}
          transition={{
            repeat: Infinity,
            ease: "linear",
            duration: 25,
          }}
        >
          {[...clients, ...clients].map((client, i) => (
            <div key={i} className="flex items-center gap-3 whitespace-nowrap select-none">
              <div
                className={`w-10 h-10 rounded-lg bg-gradient-to-br ${client.color} flex items-center justify-center text-white font-bold text-xs shadow-md`}
              >
                {client.initials}
              </div>
              <span className="text-sm md:text-base font-semibold tracking-wide text-muted-foreground/70">
                {client.name}
              </span>
            </div>
          ))}
        </motion.div>
      </div>
    </section>
  );
}
