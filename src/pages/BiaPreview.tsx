import biaV1 from "@/assets/bia-v1.png";
import biaV2 from "@/assets/bia-v2.png";
import biaV3 from "@/assets/bia-v3.png";
import biaV4 from "@/assets/bia-v4.png";
import biaV5 from "@/assets/bia-v5.png";
import biaV6 from "@/assets/bia-v6.png";
import biaV7 from "@/assets/bia-v7.png";
import biaV8 from "@/assets/bia-v8.png";
import biaV9 from "@/assets/bia-v9.png";
import biaV10 from "@/assets/bia-v10.png";

const variants = [
  { src: biaV1, label: "V1", desc: "Chibi arredondado, visor escuro, corpo branco/roxo" },
  { src: biaV2, label: "V2", desc: "Cilíndrico compacto, corpo roxo, luzes verde água" },
  { src: biaV3, label: "V3", desc: "Capacete astronauta, corpo branco, detalhes roxos" },
  { src: biaV4, label: "V4", desc: "Cabeça quadrada arredondada, branco com teal" },
  { src: biaV5, label: "V5", desc: "Cápsula/gota flutuante, visor oval, faixas roxas" },
  { src: biaV6, label: "V6", desc: "Ovo flutuante, orelhas roxas, base teal luminosa" },
  { src: biaV7, label: "V7", desc: "Foguete futurista, crista roxa, hover teal" },
  { src: biaV8, label: "V8", desc: "Antena roxa, visor panorâmico, mãos teal" },
  { src: biaV9, label: "V9", desc: "Geométrico/cristal, painéis roxos, estilo low-poly" },
  { src: biaV10, label: "V10", desc: "Capacete bolha, colarinho roxo, estilo Pixar" },
];

export default function BiaPreview() {
  return (
    <div className="min-h-screen bg-background p-8">
      <div className="max-w-6xl mx-auto">
        <h1 className="text-3xl font-bold text-center mb-2">Escolha a Bia</h1>
        <p className="text-muted-foreground text-center mb-10">10 variações — qual será a mascote oficial?</p>
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-5 gap-6">
          {variants.map((v) => (
            <div key={v.label} className="flex flex-col items-center gap-3 p-4 rounded-xl border bg-card hover:shadow-lg transition-shadow">
              <img src={v.src} alt={v.label} className="w-40 h-40 object-contain" />
              <h3 className="font-bold text-lg">{v.label}</h3>
              <p className="text-xs text-muted-foreground text-center">{v.desc}</p>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
