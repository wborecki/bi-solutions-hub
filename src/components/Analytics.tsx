import { useEffect } from "react";
import { useLocation } from "react-router-dom";

// Adicionando tipagem para os objetos globais do GTM e GA4
declare global {
  interface Window {
    dataLayer: any[];
    gtag: (...args: any[]) => void;
  }
}

// IDs de Analytics (substitua pelos reais quando tiver)
const GTM_ID = "GTM-XXXXXXX";
const GA4_ID = "G-XXXXXXXXXX";

// Função para carregar o Google Tag Manager
const loadGTM = () => {
  if (window.dataLayer) return; // Já carregado
  
  window.dataLayer = window.dataLayer || [];
  
  const script = document.createElement("script");
  script.innerHTML = `(function(w,d,s,l,i){w[l]=w[l]||[];w[l].push({'gtm.start':
    new Date().getTime(),event:'gtm.js'});var f=d.getElementsByTagName(s)[0],
    j=d.createElement(s),dl=l!='dataLayer'?'&l='+l:'';j.async=true;j.src=
    'https://www.googletagmanager.com/gtm.js?id='+i+dl;f.parentNode.insertBefore(j,f);
    })(window,document,'script','dataLayer','${GTM_ID}');`;
  document.head.appendChild(script);

  // Adicionar noscript para GTM
  const noscript = document.createElement("noscript");
  noscript.innerHTML = `<iframe src="https://www.googletagmanager.com/ns.html?id=${GTM_ID}" height="0" width="0" style="display:none;visibility:hidden"></iframe>`;
  document.body.insertBefore(noscript, document.body.firstChild);
};

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
        loadGTM();
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
