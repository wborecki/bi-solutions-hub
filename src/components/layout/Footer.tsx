import { Link } from "react-router-dom";
import { Linkedin, Instagram } from "lucide-react";
import logoSbi from "@/assets/logo-sbi-transparent.webp";

export function Footer() {
  return (
    <footer className="bg-primary-dark text-primary-foreground">
      {/* Divider */}
      <div className="section-divider" />

      <div className="max-w-6xl mx-auto px-4 py-14">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-10">
          <div className="space-y-4">
            <img src={logoSbi} alt="Solutions in BI" className="h-10 w-auto object-contain brightness-0 invert" />
            <p className="text-sm font-display font-medium text-primary-foreground/60 italic">
              Facilitando processos
            </p>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Transformamos dados em decisões inteligentes com automação e IA.
            </p>
            <div className="flex gap-3 pt-1">
              <a
                href="https://www.linkedin.com/company/solutions-in-bi/"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="LinkedIn da Solutions in BI"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-accent hover:bg-accent/20 transition-colors"
              >
                <Linkedin className="h-4 w-4" />
              </a>
              <a
                href="https://www.instagram.com/solutionsinbi"
                target="_blank"
                rel="noopener noreferrer"
                aria-label="Instagram da Solutions in BI"
                className="w-9 h-9 rounded-lg bg-primary-foreground/10 flex items-center justify-center text-primary-foreground/60 hover:text-accent hover:bg-accent/20 transition-colors"
              >
                <Instagram className="h-4 w-4" />
              </a>
            </div>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground/90">Navegação</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Soluções", href: "/solucoes" },
                { label: "Sobre", href: "/sobre" },
                { label: "Blog", href: "/blog" },
                { label: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground/90">Soluções</h4>
            <ul className="space-y-2.5">
              {[
                { label: "Automação de Fluxos", href: "/solucoes/automacao-ia" },
                { label: "Business Intelligence", href: "/solucoes/business-intelligence" },
                { label: "Implantação de Sistemas", href: "/solucoes/implantacao-sistemas" },
                { label: "Mentoria Power BI", href: "/solucoes/mentoria-power-bi" },
                { label: "Coleta de Dados", href: "/solucoes/coleta-de-dados" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-primary-foreground/60 hover:text-accent transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-4 text-primary-foreground/90">Contato</h4>
            <ul className="space-y-2.5">
              <li className="text-sm text-primary-foreground/60">contato@solutionsinbi.com</li>
              <li className="text-sm text-primary-foreground/60">+55 (11) 94541-8626</li>
              <li className="text-sm text-primary-foreground/60">Rua Pedro Américo, 68, 8º andar</li>
              <li className="text-sm text-primary-foreground/60">República, São Paulo - SP, 01045-010</li>
            </ul>
          </div>
        </div>

        <div className="border-t border-primary-foreground/10 mt-10 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            Solutions in BI © {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">
              Privacidade
            </Link>
            <Link to="/terms" className="text-xs text-primary-foreground/40 hover:text-accent transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>

      {/* Dot pattern decoration */}
      <div className="h-1 w-full bg-gradient-to-r from-primary via-accent to-primary" />
    </footer>
  );
}
