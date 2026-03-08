import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Adicionando tipagem para os objetos globais do GTM e GA4
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// IDs de Analytics
const GA4_ID = "G-2RD59KP0Y6";

// Função para carregar o Google Analytics 4
const loadGA4 = () => {
  if (typeof window.gtag === "function") return; // Já carregado

  const script1 = document.createElement("script");
  script1.async = true;
  script1.src = `https://www.googletagmanager.com/gtag/js?id=${GA4_ID}`;
  document.head.appendChild(script1);

  window.dataLayer = window.dataLayer || [];
  window.gtag = function() {
    window.dataLayer.push(arguments);
  };
  window.gtag("js", new Date());
  window.gtag("config", GA4_ID);
};

export function Analytics() {
  const location = useLocation();

  // Carregar scripts quando o usuário aceitar cookies
  useEffect(() => {
    const checkAndLoadScripts = () => {
      const consent = localStorage.getItem("cookie-consent");
      if (consent === "accepted") {
        loadGA4();
      }
    };

    // Verificar ao montar o componente
    checkAndLoadScripts();

    // Ouvir mudanças no consentimento
    window.addEventListener("cookie-consent-changed", checkAndLoadScripts);

    return () => {
      window.removeEventListener("cookie-consent-changed", checkAndLoadScripts);
    };
  }, []);

  // Enviar pageviews
  useEffect(() => {
    const consent = localStorage.getItem("cookie-consent");
    if (consent !== "accepted") return;

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
