import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Cookie, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { getCookieConsent, setCookieConsent } from "@/lib/cookieConsent";

export function CookieConsent() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const consent = getCookieConsent();
    if (!consent) {
      const timer = setTimeout(() => setVisible(true), 1500);
      return () => clearTimeout(timer);
    }
  }, []);

  const handleAccept = () => {
    setCookieConsent("accepted");
    setVisible(false);
  };

  const handleReject = () => {
    setCookieConsent("rejected");
    setVisible(false);
  };

  return (
    <AnimatePresence>
      {visible && (
        <motion.div
          initial={{ y: 100, opacity: 0 }}
          animate={{ y: 0, opacity: 1 }}
          exit={{ y: 100, opacity: 0 }}
          transition={{ type: "spring", damping: 25, stiffness: 300 }}
          className="fixed bottom-4 left-4 right-4 md:left-auto md:right-6 md:bottom-6 md:max-w-md z-50"
        >
          <div className="rounded-2xl border border-border bg-card shadow-2xl p-6">
            <div className="flex items-start justify-between mb-3">
              <div className="flex items-center gap-2">
                <Cookie className="h-5 w-5 text-primary" />
                <h3 className="font-display font-semibold text-foreground text-sm">Cookies</h3>
              </div>
              <button onClick={handleReject} className="text-muted-foreground hover:text-foreground transition-colors">
                <X className="h-4 w-4" />
              </button>
            </div>
            <p className="text-sm text-muted-foreground leading-relaxed mb-4">
              Utilizamos cookies para melhorar sua experiência de navegação. Ao continuar, você concorda com nossa{" "}
              <Link to="/privacy" className="text-primary underline underline-offset-2 hover:text-primary/80">
                Política de Privacidade
              </Link>.
            </p>
            <div className="flex gap-3">
              <Button onClick={handleAccept} size="sm" className="flex-1 font-semibold">
                Aceitar
              </Button>
              <Button onClick={handleReject} size="sm" variant="outline" className="flex-1 font-semibold">
                Recusar
              </Button>
            </div>
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
}
