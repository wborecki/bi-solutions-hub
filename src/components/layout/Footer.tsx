import { Link } from "react-router-dom";

export function Footer() {
  return (
    <footer className="border-t py-12">
      <div className="max-w-6xl mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8">
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-8 h-8 rounded-lg bg-primary flex items-center justify-center">
                <span className="text-primary-foreground font-display font-bold text-xs">SBI</span>
              </div>
              <span className="font-display font-semibold">Solutions in BI</span>
            </div>
            <p className="text-sm text-muted-foreground">
              Transformamos dados em decisões inteligentes com automação e IA.
            </p>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Navegação</h4>
            <ul className="space-y-2">
              {[
                { label: "Soluções", href: "/solucoes" },
                { label: "Sobre", href: "/sobre" },
                
                { label: "Blog", href: "/blog" },
                { label: "Contato", href: "/contato" },
              ].map((link) => (
                <li key={link.href}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Soluções</h4>
            <ul className="space-y-2">
              {[
                { label: "Automação IA", href: "/solucoes" },
                { label: "Business Intelligence", href: "/solucoes" },
                { label: "Dashboards", href: "/solucoes" },
                { label: "Chatbots", href: "/solucoes" },
              ].map((link) => (
                <li key={link.label}>
                  <Link to={link.href} className="text-sm text-muted-foreground hover:text-primary transition-colors">
                    {link.label}
                  </Link>
                </li>
              ))}
            </ul>
          </div>

          <div>
            <h4 className="font-display font-semibold mb-3">Contato</h4>
            <ul className="space-y-2">
              <li className="text-sm text-muted-foreground">contato@solutionsinbi.com</li>
              <li className="text-sm text-muted-foreground">+55 (11) 5192-0925</li>
              <li className="text-sm text-muted-foreground">São Paulo - SP</li>
            </ul>
          </div>
        </div>

        <div className="border-t mt-8 pt-8 flex flex-col md:flex-row justify-between items-center gap-4">
          <p className="text-sm text-muted-foreground">
            Solutions in BI © {new Date().getFullYear()}. Todos os direitos reservados.
          </p>
          <div className="flex gap-6">
            <Link to="/privacy" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Privacidade
            </Link>
            <Link to="/terms" className="text-xs text-muted-foreground hover:text-primary transition-colors">
              Termos
            </Link>
          </div>
        </div>
      </div>
    </footer>
  );
}
