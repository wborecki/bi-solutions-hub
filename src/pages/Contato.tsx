import { useState } from "react";
import { Layout } from "@/components/layout/Layout";
import { Mail, Phone, MapPin, Send, MessageCircle } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { toast } from "sonner";

const contactInfo = [
  {
    icon: MapPin,
    label: "Endereço",
    value: "Rua Pamplona, 145, Conjunto 703,\nSão Paulo - SP, CEP 01405-001",
    href: "https://maps.google.com/?q=Rua+Pamplona+145+São+Paulo",
  },
  {
    icon: Phone,
    label: "Telefone",
    value: "+55 (11) 5192-0925",
    href: "tel:+551151920925",
  },
  {
    icon: Mail,
    label: "E-mail",
    value: "contato@solutionsinbi.com",
    href: "mailto:contato@solutionsinbi.com",
  },
];

const Contato = () => {
  const [formData, setFormData] = useState({
    name: "",
    email: "",
    phone: "",
    company: "",
    message: "",
  });
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    setFormData((prev) => ({
      ...prev,
      [e.target.name]: e.target.value,
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsSubmitting(true);
    
    // Simulate form submission
    await new Promise((resolve) => setTimeout(resolve, 1500));
    
    toast.success("Mensagem enviada com sucesso! Entraremos em contato em breve.");
    setFormData({ name: "", email: "", phone: "", company: "", message: "" });
    setIsSubmitting(false);
  };

  const whatsappMessage = encodeURIComponent("Olá! Gostaria de saber mais sobre as soluções da Solutions in BI.");
  const whatsappUrl = `https://wa.me/551151920925?text=${whatsappMessage}`;

  return (
    <Layout>
      {/* Hero */}
      <section className="pt-32 pb-16 bg-muted/30">
        <div className="container mx-auto px-4">
          <div className="max-w-3xl">
            <span className="inline-block px-4 py-1.5 rounded-full bg-accent/20 text-accent-foreground text-sm font-medium mb-4">
              Contato
            </span>
            <h1 className="text-4xl md:text-5xl font-display font-bold text-foreground mb-6">
              Vamos conversar sobre{" "}
              <span className="text-gradient">seu projeto</span>
            </h1>
            <p className="text-xl text-muted-foreground leading-relaxed">
              Entre em contato conosco e descubra como podemos ajudar sua 
              empresa a transformar dados em decisões estratégicas.
            </p>
          </div>
        </div>
      </section>

      {/* Contact Section */}
      <section className="py-24">
        <div className="container mx-auto px-4">
          <div className="grid lg:grid-cols-2 gap-12">
            {/* Form */}
            <Card className="border-0 shadow-xl">
              <CardHeader>
                <CardTitle className="text-2xl font-display">Envie sua mensagem</CardTitle>
              </CardHeader>
              <CardContent>
                <form onSubmit={handleSubmit} className="space-y-6">
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="name">Nome *</Label>
                      <Input
                        id="name"
                        name="name"
                        placeholder="Seu nome completo"
                        value={formData.name}
                        onChange={handleChange}
                        required
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="email">E-mail *</Label>
                      <Input
                        id="email"
                        name="email"
                        type="email"
                        placeholder="seu@email.com"
                        value={formData.email}
                        onChange={handleChange}
                        required
                      />
                    </div>
                  </div>

                  <div className="grid sm:grid-cols-2 gap-4">
                    <div className="space-y-2">
                      <Label htmlFor="phone">Telefone</Label>
                      <Input
                        id="phone"
                        name="phone"
                        placeholder="(11) 99999-9999"
                        value={formData.phone}
                        onChange={handleChange}
                      />
                    </div>
                    <div className="space-y-2">
                      <Label htmlFor="company">Empresa</Label>
                      <Input
                        id="company"
                        name="company"
                        placeholder="Nome da empresa"
                        value={formData.company}
                        onChange={handleChange}
                      />
                    </div>
                  </div>

                  <div className="space-y-2">
                    <Label htmlFor="message">Mensagem *</Label>
                    <Textarea
                      id="message"
                      name="message"
                      placeholder="Como podemos ajudar?"
                      rows={5}
                      value={formData.message}
                      onChange={handleChange}
                      required
                    />
                  </div>

                  <Button
                    type="submit"
                    size="lg"
                    className="w-full bg-gradient-brand hover:opacity-90"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      "Enviando..."
                    ) : (
                      <>
                        Enviar Mensagem
                        <Send className="w-4 h-4 ml-2" />
                      </>
                    )}
                  </Button>
                </form>
              </CardContent>
            </Card>

            {/* Info */}
            <div className="space-y-8">
              <div>
                <h2 className="text-2xl font-display font-bold text-foreground mb-6">
                  Informações de Contato
                </h2>
                <div className="space-y-6">
                  {contactInfo.map((item) => {
                    const IconComponent = item.icon;
                    return (
                      <a
                        key={item.label}
                        href={item.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className="flex items-start gap-4 p-4 rounded-xl bg-muted/50 hover:bg-muted transition-colors group"
                      >
                        <div className="w-12 h-12 rounded-xl bg-primary flex items-center justify-center shrink-0">
                          <IconComponent className="w-5 h-5 text-white" />
                        </div>
                        <div>
                          <span className="text-sm text-muted-foreground">{item.label}</span>
                          <p className="font-medium text-foreground whitespace-pre-line group-hover:text-brand-tiffany transition-colors">
                            {item.value}
                          </p>
                        </div>
                      </a>
                    );
                  })}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <Card className="border-0 shadow-lg bg-gradient-brand text-white overflow-hidden">
                <CardContent className="p-8">
                  <MessageCircle className="w-12 h-12 mb-4 text-brand-tiffany" />
                  <h3 className="text-xl font-display font-bold mb-2">
                    Prefere WhatsApp?
                  </h3>
                  <p className="text-white/80 mb-6">
                    Fale diretamente com nossa equipe pelo WhatsApp para uma resposta mais rápida.
                  </p>
                  <Button
                    asChild
                    size="lg"
                    className="bg-white text-primary hover:bg-white/90 w-full"
                  >
                    <a href={whatsappUrl} target="_blank" rel="noopener noreferrer">
                      <MessageCircle className="w-5 h-5 mr-2" />
                      Iniciar Conversa
                    </a>
                  </Button>
                </CardContent>
              </Card>

              {/* Map placeholder */}
              <div className="aspect-video rounded-xl bg-muted overflow-hidden">
                <iframe
                  src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3657.1975868462297!2d-46.65476542466963!3d-23.561823178795256!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x94ce59c8da0aa315%3A0xd59f9431f2c9776a!2sR.%20Pamplona%2C%20145%20-%20Bela%20Vista%2C%20S%C3%A3o%20Paulo%20-%20SP%2C%2001405-001!5e0!3m2!1spt-BR!2sbr!4v1706893614567!5m2!1spt-BR!2sbr"
                  width="100%"
                  height="100%"
                  style={{ border: 0 }}
                  allowFullScreen
                  loading="lazy"
                  referrerPolicy="no-referrer-when-downgrade"
                  title="Localização Solutions in BI"
                />
              </div>
            </div>
          </div>
        </div>
      </section>
    </Layout>
  );
};

export default Contato;
