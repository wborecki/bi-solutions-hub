import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { SEO } from "@/components/SEO";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { toast } from "sonner";
import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import { CTASection } from "@/components/home/CTASection";


const contactInfo = [
  { icon: MapPin, label: "Endereço", value: "Rua Pamplona, 145, Cj 703\nSão Paulo - SP", href: undefined },
  { icon: Phone, label: "Telefone", value: "+55 (11) 5192-0925", href: "tel:+551151920925" },
  { icon: Mail, label: "E-mail", value: "contato@solutionsinbi.com", href: "mailto:contato@solutionsinbi.com" },
];

const Contato = () => {
  const [formData, setFormData] = useState({ name: "", email: "", phone: "", company: "", message: "" });
  const [isSubmitting, setIsSubmitting] = useState(false);
  const formRef = useRef(null);
  const formInView = useInView(formRef, { once: true, margin: "-60px" });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({ ...prev, [e.target.name]: e.target.value }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    if (!formData.name.trim() || !formData.email.trim() || !formData.message.trim()) {
      toast.error("Preencha todos os campos obrigatórios.");
      return;
    }

    setIsSubmitting(true);
    await new Promise((r) => setTimeout(r, 1500));
    toast.success("Mensagem enviada! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  return (
    <Layout>
      <SEO
        title="Contato - Fale com Nossos Especialistas"
        description="Entre em contato com a Solutions in BI. Solicite um diagnóstico gratuito e descubra como transformar dados em resultados para sua empresa."
        canonical="/contato"
      />
      {/* Hero */}
      <section className="pt-28 md:pt-36 pb-16 bg-background relative overflow-hidden">
        <div className="absolute inset-0 opacity-[0.03]">
          <div className="absolute inset-0" style={{
            backgroundImage: `radial-gradient(circle at 1px 1px, hsl(var(--foreground)) 1px, transparent 0)`,
            backgroundSize: '32px 32px'
          }} />
        </div>
        <div className="container mx-auto px-4 relative z-10">
          <motion.div
            className="max-w-2xl mx-auto text-center"
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6 }}
          >
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              Contato
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-primary-dark mb-6 leading-tight">
              Vamos conversar sobre <span className="text-gradient">seu projeto</span>
            </h1>
            <p className="text-lg text-muted-foreground leading-relaxed mb-8">
              Entre em contato e descubra como podemos transformar dados em resultados para sua empresa.
            </p>
            <motion.div whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }} className="inline-block">
              <Button asChild size="lg" variant="outline">
                <a
                  href="https://wa.me/551151920925?text=Olá! Gostaria de saber mais sobre as soluções da Solutions in BI."
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <MessageCircle className="w-4 h-4 mr-2" />
                  Falar no WhatsApp
                </a>
              </Button>
            </motion.div>
          </motion.div>
        </div>
      </section>

      {/* Form + Info */}
      <section className="py-24" ref={formRef}>
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-5 gap-12 max-w-5xl mx-auto">
            {/* Form */}
            <motion.div
              className="lg:col-span-3"
              initial={{ opacity: 0, y: 20 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-8">Envie sua mensagem</h2>
              <form onSubmit={handleSubmit} className="space-y-5">
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="name" className="text-sm font-medium">Nome *</Label>
                    <Input
                      id="name"
                      name="name"
                      placeholder="Seu nome"
                      value={formData.name}
                      onChange={handleChange}
                      required
                      maxLength={100}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="email" className="text-sm font-medium">E-mail *</Label>
                    <Input
                      id="email"
                      name="email"
                      type="email"
                      placeholder="seu@email.com"
                      value={formData.email}
                      onChange={handleChange}
                      required
                      maxLength={255}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="grid sm:grid-cols-2 gap-4">
                  <div className="space-y-2">
                    <Label htmlFor="phone" className="text-sm font-medium">Telefone</Label>
                    <Input
                      id="phone"
                      name="phone"
                      placeholder="(11) 99999-9999"
                      value={formData.phone}
                      onChange={handleChange}
                      maxLength={20}
                      className="h-11"
                    />
                  </div>
                  <div className="space-y-2">
                    <Label htmlFor="company" className="text-sm font-medium">Empresa</Label>
                    <Input
                      id="company"
                      name="company"
                      placeholder="Sua empresa"
                      value={formData.company}
                      onChange={handleChange}
                      maxLength={100}
                      className="h-11"
                    />
                  </div>
                </div>
                <div className="space-y-2">
                  <Label htmlFor="message" className="text-sm font-medium">Mensagem *</Label>
                  <Textarea
                    id="message"
                    name="message"
                    placeholder="Como podemos ajudar?"
                    rows={5}
                    value={formData.message}
                    onChange={handleChange}
                    required
                    maxLength={1000}
                  />
                </div>
                <Button type="submit" size="lg" className="w-full h-12 font-semibold" disabled={isSubmitting}>
                  {isSubmitting ? (
                    "Enviando..."
                  ) : (
                    <>
                      <Send className="h-4 w-4 mr-2" />
                      Enviar Mensagem
                    </>
                  )}
                </Button>
                <p className="text-xs text-muted-foreground text-center">
                  Responderemos em até 24 horas úteis.
                </p>
              </form>
            </motion.div>

            {/* Info */}
            <motion.div
              className="lg:col-span-2 space-y-6"
              initial={{ opacity: 0, y: 20 }}
              animate={formInView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.5, delay: 0.15 }}
            >
              <h2 className="text-2xl font-display font-bold text-foreground mb-2">Informações</h2>
              <div className="space-y-3">
                {contactInfo.map((item) => {
                  const Icon = item.icon;
                  const content = (
                    <div className="flex items-start gap-4 p-5 rounded-2xl border border-border bg-card hover:shadow-sm transition-all duration-300">
                      <div className="w-10 h-10 rounded-xl bg-primary/10 flex items-center justify-center shrink-0">
                        <Icon className="h-5 w-5 text-primary" />
                      </div>
                      <div>
                        <span className="text-xs text-muted-foreground font-medium">{item.label}</span>
                        <p className="text-sm font-medium text-foreground whitespace-pre-line mt-0.5">{item.value}</p>
                      </div>
                    </div>
                  );

                  return item.href ? (
                    <a key={item.label} href={item.href} className="block">
                      {content}
                    </a>
                  ) : (
                    <div key={item.label}>{content}</div>
                  );
                })}
              </div>

              {/* Map */}
              <div className="rounded-2xl overflow-hidden border border-border">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975868462297!2d-46.65476542466963!3d-23.561823178795256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sR.%20Pamplona%2C%20145%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001405-001!5e0!3m2!1spt-BR!2sbr!4v1706893614567!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="200"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  title="Localização Solutions in BI"
                />
              </div>
            </motion.div>
          </div>
        </div>
      </section>

      
      <CTASection />
    </Layout>
  );
};

export default Contato;
