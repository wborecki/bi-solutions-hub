import { useEffect } from "react";
import { useLocation } from "react-router-dom";
import { COOKIE_CONSENT_EVENT, getCookieConsent } from "@/lib/cookieConsent";

const GA_MEASUREMENT_ID = "G-XXXXXXXXXX";

// Adicionando tipagem para os objetos globais do GTM e GA4
declare global {
  interface Window {
    dataLayer: unknown[];
    gtag: (...args: unknown[]) => void;
  }
}

export function Analytics() {
  const location = useLocation();

  useEffect(() => {
    const loadGaScript = () => {
      if (document.querySelector(`script[data-ga-id="${GA_MEASUREMENT_ID}"]`)) {
        return;
      }

      const script = document.createElement("script");
      script.async = true;
      script.src = `https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}`;
      script.dataset.gaId = GA_MEASUREMENT_ID;
      document.head.appendChild(script);

      window.dataLayer = window.dataLayer || [];
      window.gtag = function gtag(...args: unknown[]) {
        window.dataLayer.push(args);
      };

      window.gtag("js", new Date());
      window.gtag("config", GA_MEASUREMENT_ID, { send_page_view: false });
    };

    if (getCookieConsent() === "accepted") {
      loadGaScript();
    }

    const handleConsentChange = () => {
      if (getCookieConsent() === "accepted") {
        loadGaScript();
      }
    };

    window.addEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
    return () => window.removeEventListener(COOKIE_CONSENT_EVENT, handleConsentChange);
  }, []);

  useEffect(() => {
    if (getCookieConsent() !== "accepted") {
      return;
    }

    const page_path = location.pathname + location.search;

    // Dispara evento de pageview para o Google Tag Manager (dataLayer)
    if (window.dataLayer) {
      window.dataLayer.push({
        event: "pageview",
        page_path: page_path,
      });
    }

    // Dispara evento de page_view diretamente para o GA4 (gtag)
    if (typeof window.gtag === "function") {
      window.gtag("event", "page_view", {
        page_path: page_path,
      });
    }
  }, [location]);

  return null;
}
