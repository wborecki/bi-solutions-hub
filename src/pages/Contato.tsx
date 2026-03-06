import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Send } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent } from "@/components/ui/card";
import { toast } from "sonner";
import { motion } from "framer-motion";

const contactInfo = [
  { icon: MapPin, label: "Endereço", value: "Rua Pamplona, 145, Cj 703\nSão Paulo - SP" },
  { icon: Phone, label: "Telefone", value: "+55 (11) 5192-0925" },
  { icon: Mail, label: "E-mail", value: "contato@solutionsinbi.com" },
];

const Contato = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <section className="pt-28 md:pt-36 pb-16">
        <div className="max-w-6xl mx-auto px-4">
          <motion.div className="max-w-3xl" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>
            <span className="bg-primary text-primary-foreground text-xs font-semibold px-3 py-1 rounded-full">Contato</span>
            <h1 className="text-4xl md:text-5xl font-display font-bold mt-4 mb-4 text-primary-dark">
              Vamos conversar sobre <span className="text-gradient">seu projeto</span>
            </h1>
            <p className="text-lg text-muted-foreground">
              Entre em contato e descubra como podemos ajudar sua empresa.
            </p>
          </motion.div>
        </div>
      </section>

      <section className="py-16 md:py-24">
        <div className="max-w-6xl mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            <motion.div initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.1 }}>
              <Card className="rounded-xl border bg-card">
                <CardContent className="pt-6 pb-6 px-6">
                  <h2 className="text-xl font-display font-bold mb-6">Envie sua mensagem</h2>
                  <form onSubmit={handleSubmit} className="space-y-5">
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="name">Nome *</Label>
                        <Input id="name" name="name" placeholder="Seu nome" value={formData.name} onChange={handleChange} required />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="email">E-mail *</Label>
                        <Input id="email" name="email" type="email" placeholder="seu@email.com" value={formData.email} onChange={handleChange} required />
                      </div>
                    </div>
                    <div className="grid sm:grid-cols-2 gap-4">
                      <div className="space-y-2">
                        <Label htmlFor="phone">Telefone</Label>
                        <Input id="phone" name="phone" placeholder="(11) 99999-9999" value={formData.phone} onChange={handleChange} />
                      </div>
                      <div className="space-y-2">
                        <Label htmlFor="company">Empresa</Label>
                        <Input id="company" name="company" placeholder="Sua empresa" value={formData.company} onChange={handleChange} />
                      </div>
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="message">Mensagem *</Label>
                      <Textarea id="message" name="message" placeholder="Como podemos ajudar?" rows={5} value={formData.message} onChange={handleChange} required />
                    </div>
                    <Button type="submit" size="lg" className="w-full" disabled={isSubmitting}>
                      {isSubmitting ? "Enviando..." : <><Send className="h-4 w-4 mr-2" />Enviar Mensagem</>}
                    </Button>
                  </form>
                </CardContent>
              </Card>
            </motion.div>

            <motion.div className="space-y-6" initial={{ opacity: 0, y: 30 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 0.2 }}>
              <h2 className="text-xl font-display font-bold">Informações de Contato</h2>
              <div className="space-y-4">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  return (
                    <div key={item.label} className="flex items-start gap-4 p-4 rounded-xl bg-muted/50">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground">{item.label}</span>
                        <p className="text-sm font-medium whitespace-pre-line">{item.value}</p>
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="aspect-video rounded-xl overflow-hidden border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975868462297!2d-46.65476542466963!3d-23.561823178795256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sR.%20Pamplona%2C%20145%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001405-001!5e0!3m2!1spt-BR!2sbr!4v1706893614567!5m2!1spt-BR!2sbr"
                  width="100%" height="100%" style={{ border: 0 }} allowFullScreen loading="lazy" title="Localização"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
