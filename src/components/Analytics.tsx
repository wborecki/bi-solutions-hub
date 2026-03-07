import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Adicionando tipagem para os objetos globais do GTM e GA4
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

export function Analytics() {
  const location = useLocation();

  useEffect(() => {
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
