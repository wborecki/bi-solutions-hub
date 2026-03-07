import biaV11 from "@/assets/bia-v11.png";
import biaV12 from "@/assets/bia-v12.png";
import biaV13 from "@/assets/bia-v13.png";
import biaV14 from "@/assets/bia-v14.png";

const variants = [
  { src: biaV11, label: "V11", desc: "Corpo lilás em gota, visor roxo, colar prata" },
  { src: biaV12, label: "V12", desc: "Gota branca, acenando, visor roxo brilhante" },
  { src: biaV13, label: "V13", desc: "Ovo branco matte, visor amplo, bracinhos esféricos" },
  { src: biaV14, label: "V14", desc: "Braços abertos, luz teal no peito, visor roxo" },
];

export default function BiaPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Escolha a Bia</h1>
        <p className="text-muted-foreground text-center mb-10">Novas variações inspiradas no estilo que você enviou</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {variants.map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <img src={v.src} alt={v.label} className="w-48 h-48 object-contain" />
              <h3 className="font-bold text-lg">{v.label}</h3>
              <p className="text-xs text-muted-foreground text-center">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
