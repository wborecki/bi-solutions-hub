import { Link } from "react-router-dom";
import { Mail, Phone, MapPin, Linkedin, Instagram } from "lucide-react";

export function Footer() {
  return (
    <footer className="bg-primary text-primary-foreground">
      <div className="container mx-auto px-4 py-16">
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12">
          {/* Brand */}
          <div className="space-y-4">
            <div className="flex items-center gap-2">
              <div className="w-10 h-10 rounded-lg bg-brand-tiffany flex items-center justify-center">
                <span className="text-primary font-display font-bold text-lg">SBI</span>
              </div>
              <span className="font-display font-semibold text-lg">
                Solutions in BI
              </span>
            </div>
            <p className="text-sm text-primary-foreground/70 leading-relaxed">
              Transformando dados em decisões estratégicas para o mercado jurídico e corporativo.
            </p>
            <p className="text-xs text-primary-foreground/50">
              Facilitando Processos
            </p>
          </div>

          {/* Navigation */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Navegação</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Home
                </Link>
              </li>
              <li>
                <Link to="/solucoes" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Soluções
                </Link>
              </li>
              <li>
                <Link to="/sobre" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Sobre
                </Link>
              </li>
              <li>
                <Link to="/blog" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Blog
                </Link>
              </li>
              <li>
                <Link to="/contato" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Contato
                </Link>
              </li>
            </ul>
          </div>

          {/* Solutions */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Soluções</h4>
            <ul className="space-y-3">
              <li>
                <Link to="/solucoes/business-intelligence" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Business Intelligence
                </Link>
              </li>
              <li>
                <Link to="/solucoes/robos-juridicos" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Robôs Jurídicos
                </Link>
              </li>
              <li>
                <Link to="/solucoes/jurimetria" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  Jurimetria
                </Link>
              </li>
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="font-display font-semibold text-lg mb-4">Contato</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-3">
                <MapPin className="w-4 h-4 mt-0.5 text-brand-tiffany shrink-0" />
                <span className="text-sm text-primary-foreground/70">
                  Rua Pamplona, 145, Conjunto 703,<br />
                  São Paulo - SP, CEP 01405-001
                </span>
              </li>
              <li className="flex items-center gap-3">
                <Phone className="w-4 h-4 text-brand-tiffany shrink-0" />
                <a href="tel:+551151920925" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  +55 (11) 5192-0925
                </a>
              </li>
              <li className="flex items-center gap-3">
                <Mail className="w-4 h-4 text-brand-tiffany shrink-0" />
                <a href="mailto:contato@solutionsinbi.com" className="text-sm text-primary-foreground/70 hover:text-brand-tiffany transition-colors">
                  contato@solutionsinbi.com
                </a>
              </li>
            </ul>

            {/* Social */}
            <div className="flex gap-3 mt-6">
              <a
                href="https://linkedin.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-brand-tiffany hover:text-primary transition-colors"
              >
                <Linkedin className="w-4 h-4" />
              </a>
              <a
                href="https://instagram.com"
                target="_blank"
                rel="noopener noreferrer"
                className="w-10 h-10 rounded-full bg-primary-foreground/10 flex items-center justify-center hover:bg-brand-tiffany hover:text-primary transition-colors"
              >
                <Instagram className="w-4 h-4" />
              </a>
            </div>
          </div>
        </div>

        {/* Bottom */}
        <div className="border-t border-primary-foreground/10 mt-12 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-primary-foreground/50">
            © {new Date().getFullYear()} Solutions in BI. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacidade" className="text-xs text-primary-foreground/50 hover:text-brand-tiffany transition-colors">
              Política de Privacidade
            </Link>
            <Link to="/termos" className="text-xs text-primary-foreground/50 hover:text-brand-tiffany transition-colors">
              Termos de Uso
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
