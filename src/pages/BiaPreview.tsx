import biaV1 from "@/assets/bia-v1.png";
import biaV2 from "@/assets/bia-v2.png";
import biaV3 from "@/assets/bia-v3.png";
import biaV4 from "@/assets/bia-v4.png";

const variants = [
  { src: biaV1, label: "Variação A", desc: "Cabeça arredondada, visor escuro, corpo branco com detalhes roxos" },
  { src: biaV2, label: "Variação B", desc: "Cilíndrica compacta, corpo roxo escuro com luzes verde água" },
  { src: biaV3, label: "Variação C", desc: "Estilo capacete astronauta, corpo branco, detalhes roxos" },
  { src: biaV4, label: "Variação D", desc: "Cabeça quadrada arredondada, corpo branco, detalhes roxo e verde água" },
];

export default function BiaPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-5xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Escolha a Bia</h1>
        <p className="text-muted-foreground text-center mb-10">Qual variação você prefere como mascote oficial?</p>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-6">
          {variants.map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <img src={v.src} alt={v.label} className="w-48 h-48 object-contain" />
              <h3 className="font-bold text-lg">{v.label}</h3>
              <p className="text-sm text-muted-foreground text-center">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
