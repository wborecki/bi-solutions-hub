import { motion, useInView } from "framer-motion";
import { useRef } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";

const faqs = [
  {
    question: "Quanto tempo leva um projeto de BI ou automação?",
    answer:
      "Depende da complexidade, mas projetos típicos levam de 2 a 8 semanas. Dashboards simples podem ser entregues em poucos dias, enquanto soluções completas de jurimetria ou automação de fluxos demandam mais tempo para coleta, integração e validação dos dados.",
  },
  {
    question: "É possível integrar com meu sistema atual?",
    answer:
      "Sim! Nossas soluções se conectam com os principais ERPs, CRMs, sistemas jurídicos e plataformas do mercado. Trabalhamos com APIs, bancos de dados e ferramentas como Power Automate para garantir que tudo funcione de forma integrada com o que você já utiliza.",
  },
  {
    question: "Preciso ter um sistema de gestão para usar BI?",
    answer:
      "Não necessariamente. Trabalhamos com diversas fontes de dados, incluindo planilhas, bancos de dados, APIs de tribunais e sistemas variados. O importante é ter dados — nós cuidamos de organizá-los e transformá-los em insights.",
  },
  {
    question: "Como funciona o suporte após a entrega do projeto?",
    answer:
      "Oferecemos suporte contínuo após a entrega, incluindo treinamento da equipe, ajustes em dashboards e manutenção de automações. Nossos planos de suporte garantem que sua solução continue evoluindo conforme as necessidades do negócio.",
  },
  {
    question: "Qual o investimento para um projeto de BI ou Jurimetria?",
    answer:
      "O investimento varia conforme o escopo do projeto. Trabalhamos com propostas personalizadas após um diagnóstico inicial gratuito, onde entendemos suas necessidades e definimos a melhor abordagem. Entre em contato para agendar uma conversa sem compromisso.",
  },
];

export function FAQSection() {
  const ref = useRef(null);
  const inView = useInView(ref, { once: true, margin: "-80px" });

  return (
    <section ref={ref} className="py-16 md:py-24">
      <div className="container mx-auto px-4">
        <motion.div
          className="max-w-3xl mx-auto"
          initial={{ opacity: 0, y: 30 }}
          animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.5 }}
        >
          <div className="text-center mb-12">
            <span className="inline-block px-4 py-1.5 rounded-full bg-primary/10 text-primary text-sm font-medium mb-4">
              FAQ
            </span>
            <h2 className="text-3xl md:text-4xl font-display font-bold text-primary-dark mb-3">
              Perguntas frequentes
            </h2>
            <p className="text-muted-foreground">
              Tire suas dúvidas sobre nossos serviços e processo de trabalho.
            </p>
          </div>

          <Accordion type="single" collapsible className="space-y-3">
            {faqs.map((faq, index) => (
              <motion.div
                key={index}
                initial={{ opacity: 0, y: 10 }}
                animate={inView ? { opacity: 1, y: 0 } : {}}
                transition={{ duration: 0.4, delay: index * 0.08 }}
              >
                <AccordionItem
                  value={`item-${index}`}
                  className="border rounded-xl px-6 bg-card"
                >
                  <AccordionTrigger className="text-left text-[15px] font-semibold hover:no-underline">
                    {faq.question}
                  </AccordionTrigger>
                  <AccordionContent className="text-muted-foreground leading-relaxed">
                    {faq.answer}
                  </AccordionContent>
                </AccordionItem>
              </motion.div>
            ))}
          </Accordion>
        </motion.div>
      </div>
    </section>
  );
}
