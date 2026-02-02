import { useState, useEffect } from "react";
import { Link, useLocation } from "react-router-dom";
import { Menu, X, ChevronDown } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  NavigationMenu,
  NavigationMenuContent,
  NavigationMenuItem,
  NavigationMenuLink,
  NavigationMenuList,
  NavigationMenuTrigger,
} from "@/components/ui/navigation-menu";
import { cn } from "@/lib/utils";

const solutions = [
  {
    title: "Business Intelligence",
    href: "/solucoes/business-intelligence",
    description: "Dashboards e relatórios customizados para decisões estratégicas.",
  },
  {
    title: "Robôs Jurídicos",
    href: "/solucoes/robos-juridicos",
    description: "Automação de consultas em tribunais e processos repetitivos.",
  },
  {
    title: "Jurimetria",
    href: "/solucoes/jurimetria",
    description: "Análise estatística de dados jurídicos para previsibilidade.",
  },
];

export function Header() {
  const [isScrolled, setIsScrolled] = useState(false);
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const location = useLocation();

  useEffect(() => {
    const handleScroll = () => {
      setIsScrolled(window.scrollY > 20);
    };
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
          ? "bg-background/95 backdrop-blur-md border-b shadow-sm py-3"
          : "bg-gradient-to-b from-primary/80 via-primary/40 to-transparent py-5"
      )}
    >
      <div className="container mx-auto px-4 flex items-center justify-between">
        {/* Logo */}
        <Link to="/" className="flex items-center gap-2">
          <div className="w-10 h-10 rounded-lg bg-gradient-brand flex items-center justify-center">
            <span className="text-white font-display font-bold text-lg">SBI</span>
          </div>
          <div className="hidden sm:block">
            <span className={cn(
              "font-display font-semibold text-lg transition-colors",
              isScrolled ? "text-foreground" : "text-white"
            )}>
              Solutions in BI
            </span>
          </div>
        </Link>

        {/* Desktop Navigation */}
        <nav className="hidden lg:flex items-center gap-1">
          <Link
            to="/"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname === "/"
                ? "bg-white/20 text-white"
                : isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  : "text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            Home
          </Link>

          <NavigationMenu>
            <NavigationMenuList>
              <NavigationMenuItem>
                <NavigationMenuTrigger
                  className={cn(
                    "bg-transparent",
                    location.pathname.includes("/solucoes")
                      ? "bg-white/20 text-white"
                      : isScrolled 
                        ? "text-muted-foreground"
                        : "text-white/90 hover:text-white hover:bg-white/10"
                  )}
                >
                  Soluções
                </NavigationMenuTrigger>
                <NavigationMenuContent>
                  <ul className="grid w-[400px] gap-3 p-4 md:w-[500px] md:grid-cols-1">
                    {solutions.map((solution) => (
                      <li key={solution.title}>
                        <NavigationMenuLink asChild>
                          <Link
                            to={solution.href}
                            className="block select-none space-y-1 rounded-md p-3 leading-none no-underline outline-none transition-colors hover:bg-accent/10 focus:bg-accent/10"
                          >
                            <div className="text-sm font-medium leading-none text-foreground">
                              {solution.title}
                            </div>
                            <p className="line-clamp-2 text-sm leading-snug text-muted-foreground">
                              {solution.description}
                            </p>
                          </Link>
                        </NavigationMenuLink>
                      </li>
                    ))}
                    <li className="border-t pt-3">
                      <NavigationMenuLink asChild>
                        <Link
                          to="/solucoes"
                          className="block select-none rounded-md p-3 text-sm font-medium text-brand-tiffany hover:bg-accent/10"
                        >
                          Ver todas as soluções →
                        </Link>
                      </NavigationMenuLink>
                    </li>
                  </ul>
                </NavigationMenuContent>
              </NavigationMenuItem>
            </NavigationMenuList>
          </NavigationMenu>

          <Link
            to="/sobre"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname === "/sobre"
                ? "bg-white/20 text-white"
                : isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  : "text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            Sobre
          </Link>

          <Link
            to="/blog"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname.includes("/blog")
                ? "bg-white/20 text-white"
                : isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  : "text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            Blog
          </Link>

          <Link
            to="/contato"
            className={cn(
              "px-4 py-2 rounded-lg text-sm font-medium transition-colors",
              location.pathname === "/contato"
                ? "bg-white/20 text-white"
                : isScrolled 
                  ? "text-muted-foreground hover:text-foreground hover:bg-accent/10"
                  : "text-white/90 hover:text-white hover:bg-white/10"
            )}
          >
            Contato
          </Link>
        </nav>

        {/* CTA Button */}
        <div className="hidden lg:flex items-center gap-3">
          <Button asChild className="bg-gradient-brand hover:opacity-90 transition-opacity">
            <Link to="/contato">Fale Conosco</Link>
          </Button>
        </div>

        {/* Mobile Menu Button */}
        <button
          className={cn(
            "lg:hidden p-2 rounded-lg transition-colors",
            isScrolled ? "hover:bg-accent/10" : "hover:bg-white/10 text-white"
          )}
          onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
          aria-label="Menu"
        >
          {isMobileMenuOpen ? (
            <X className={cn("w-6 h-6", !isScrolled && "text-white")} />
          ) : (
            <Menu className={cn("w-6 h-6", !isScrolled && "text-white")} />
          )}
        </button>
      </div>

      {/* Mobile Menu */}
      {isMobileMenuOpen && (
        <div className="lg:hidden absolute top-full left-0 right-0 glass border-b shadow-lg animate-slide-up">
          <nav className="container mx-auto px-4 py-6 flex flex-col gap-2">
            <Link
              to="/"
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === "/"
                  ? "bg-accent/20 text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Home
            </Link>

            <div className="px-4 py-2">
              <span className="text-xs font-semibold text-muted-foreground uppercase tracking-wider">
                Soluções
              </span>
            </div>
            {solutions.map((solution) => (
              <Link
                key={solution.title}
                to={solution.href}
                className={cn(
                  "px-6 py-2 rounded-lg text-sm transition-colors",
                  location.pathname === solution.href
                    ? "bg-accent/20 text-foreground"
                    : "text-muted-foreground"
                )}
              >
                {solution.title}
              </Link>
            ))}
            <Link
              to="/solucoes"
              className="px-6 py-2 text-sm text-brand-tiffany font-medium"
            >
              Ver todas →
            </Link>

            <Link
              to="/sobre"
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === "/sobre"
                  ? "bg-accent/20 text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Sobre
            </Link>

            <Link
              to="/blog"
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname.includes("/blog")
                  ? "bg-accent/20 text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Blog
            </Link>

            <Link
              to="/contato"
              className={cn(
                "px-4 py-3 rounded-lg text-base font-medium transition-colors",
                location.pathname === "/contato"
                  ? "bg-accent/20 text-foreground"
                  : "text-muted-foreground"
              )}
            >
              Contato
            </Link>

            <div className="pt-4 border-t mt-2">
              <Button asChild className="w-full bg-gradient-brand">
                <Link to="/contato">Fale Conosco</Link>
              </Button>
            </div>
          </nav>
        </div>
      )}
    </header>
  );
}
