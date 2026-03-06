import { useState, useEffect, useRef } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown, Bot, BarChart3, LayoutDashboard, Plug, Lightbulb, GraduationCap } from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import logoSbi from "@/assets/logo-sbi.png";

const solutionItems = [
  { icon: Bot, label: "Automação IA", desc: "Automatize tarefas com IA", href: "/solucoes/automacao-ia" },
  { icon: BarChart3, label: "Business Intelligence", desc: "Dados estratégicos para decisões", href: "/solucoes/business-intelligence" },
  { icon: LayoutDashboard, label: "Dashboards", desc: "Painéis visuais e interativos", href: "/solucoes/dashboards" },
  { icon: Plug, label: "Integrações", desc: "Conecte seus sistemas", href: "/solucoes/integracoes" },
  { icon: GraduationCap, label: "Mentoria Power BI", desc: "Aprenda com especialistas", href: "/solucoes/mentoria-power-bi" },
  { icon: Lightbulb, label: "Consultoria", desc: "Orientação para transformação digital", href: "/solucoes/consultoria" },
];

const navLinks = [
  { label: "Home", href: "/" },
  { label: "Sobre", href: "/sobre" },
  
  { label: "Blog", href: "/blog" },
  { label: "Contato", href: "/contato" },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const [dropdownOpen, setDropdownOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => setIsScrolled(window.scrollY > 20);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    setIsMobileMenuOpen(false);
  }, [location]);

  return (
    <header
      className={cn(
        "fixed top-0 left-0 right-0 z-50 transition-all duration-300",
        isScrolled
          ? "bg-background/80 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-background py-3"
      )}
    >
      <div className="max-w-6xl mx-auto px-4 flex items-center justify-between">
        <Link to="/" className="flex items-center">
          <img src={logoSbi} alt="Solutions in BI" className="h-10 w-auto object-contain" />
        </Link>

        <nav className="hidden md:flex items-center gap-1">
          {/* Soluções dropdown */}
          <div
            className="relative group"
            onMouseEnter={() => setDropdownOpen(true)}
            onMouseLeave={() => setDropdownOpen(false)}
          >
            <Link
              to="/solucoes"
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-bold transition-colors inline-flex items-center gap-1",
                "after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full",
                "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                "hover:after:scale-x-100",
                location.pathname === "/solucoes" || location.pathname.startsWith("/solucoes/")
                  ? "text-primary after:scale-x-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Soluções
              <ChevronDown className={cn("h-3.5 w-3.5 transition-transform duration-200", dropdownOpen && "rotate-180")} />
            </Link>

            {dropdownOpen && (
              <div className="absolute top-full left-0 pt-2 z-50">
                <div className="bg-background/95 backdrop-blur-md border rounded-xl shadow-lg p-2 min-w-[280px]">
                  {solutionItems.map((item) => {
                    const Icon = item.icon;
                    return (
                      <Link
                        key={item.label}
                        to={item.href}
                        className="flex items-center gap-3 px-3 py-2.5 rounded-lg text-sm hover:bg-muted transition-colors group"
                      >
                        <Icon className="h-4 w-4 text-primary shrink-0" />
                        <div>
                          <p className="font-semibold text-foreground">{item.label}</p>
                          <p className="text-xs text-muted-foreground">{item.desc}</p>
                        </div>
                      </Link>
                    );
                  })}
                </div>
              </div>
            )}
          </div>

          {navLinks.map((link) => (
            <Link
              key={link.href}
              to={link.href}
              className={cn(
                "relative px-4 py-2 rounded-lg text-sm font-bold transition-colors",
                "after:content-[''] after:absolute after:bottom-0 after:left-2 after:right-2 after:h-0.5 after:bg-primary after:rounded-full",
                "after:scale-x-0 after:origin-left after:transition-transform after:duration-300",
                "hover:after:scale-x-100",
                location.pathname === link.href || location.pathname.startsWith(link.href + "/")
                  ? "text-primary after:scale-x-100"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {link.label}
            </Link>
          ))}
        </nav>

        <div className="hidden md:block">
          <Button asChild>
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>

        <button
          className="md:hidden p-2 rounded-lg hover:bg-muted transition-colors"
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? <X className="w-6 h-6" /> : <Menu className="w-6 h-6" />}
        </button>
      </div>

      {isMobileMenuOpen && (
        <div className="md:hidden absolute top-full left-0 right-0 bg-background/95 backdrop-blur-md border-b shadow-lg">
          <nav className="max-w-6xl mx-auto px-4 py-6 flex flex-col gap-1">
            <Link
              to="/solucoes"
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === "/solucoes" || location.pathname.startsWith("/solucoes/")
                  ? "bg-primary/10 text-primary"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              Soluções
            </Link>
            <div className="pl-4 flex flex-col gap-0.5">
              {solutionItems.map((item) => {
                const Icon = item.icon;
                return (
                  <Link
                    key={item.label}
                    to={item.href}
                    className={cn(
                      "flex items-center gap-2 px-4 py-2 rounded-lg text-sm transition-colors",
                      location.pathname === item.href
                        ? "text-primary bg-primary/5"
                        : "text-muted-foreground hover:text-foreground"
                    )}
                  >
                    <Icon className="h-3.5 w-3.5" />
                    {item.label}
                  </Link>
                );
              })}
            </div>
            {navLinks.map((link) => (
              <Link
                key={link.href}
                to={link.href}
                className={cn(
                  "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                  location.pathname === link.href
                    ? "bg-primary/10 text-primary"
                    : "text-muted-foreground hover:text-foreground"
                )}
              >
                {link.label}
              </Link>
            ))}
            <div className="pt-4 border-t mt-2">
              <Button asChild className="w-full">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
