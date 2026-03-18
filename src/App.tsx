import { lazy, Suspense, useEffect, useRef } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route, useLocation } from "react-router-dom";
import { Analytics as VercelAnalytics } from "@vercel/analytics/react";
import { SpeedInsights } from "@vercel/speed-insights/react";
import { ScrollToTop } from "./components/ScrollToTop";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { CartProvider } from "./contexts/CartContext";
import { ProtectedRoute } from "./components/portal/ProtectedRoute";
import { PortalLayout } from "./components/portal/PortalLayout";

// Public site pages - all lazy loaded
const Index = lazy(() => import("./pages/Index"));
const Solucoes = lazy(() => import("./pages/Solucoes"));
const SolucaoDetalhe = lazy(() => import("./pages/SolucaoDetalhe"));
const Servicos = lazy(() => import("./pages/Servicos"));
const Sobre = lazy(() => import("./pages/Sobre"));
const Blog = lazy(() => import("./pages/Blog"));
const BlogPost = lazy(() => import("./pages/BlogPost"));
const Contato = lazy(() => import("./pages/Contato"));
const Privacy = lazy(() => import("./pages/Privacy"));
const Terms = lazy(() => import("./pages/Terms"));
const NotFound = lazy(() => import("./pages/NotFound"));

// Store pages
const Loja = lazy(() => import("./pages/Loja"));
const ProdutoDetalhe = lazy(() => import("./pages/ProdutoDetalhe"));
const Carrinho = lazy(() => import("./pages/Carrinho"));
const Checkout = lazy(() => import("./pages/Checkout"));

// Portal pages - lazy loaded (only downloaded when user visits portal)
const PortalLogin = lazy(() => import("./pages/portal/Login"));
const ResetPassword = lazy(() => import("./pages/portal/ResetPassword"));
const PortalDashboard = lazy(() => import("./pages/portal/Dashboard"));
const Chamados = lazy(() => import("./pages/portal/Chamados"));
const ChamadoDetalhe = lazy(() => import("./pages/portal/ChamadoDetalhe"));
const Documentos = lazy(() => import("./pages/portal/Documentos"));
const Perfil = lazy(() => import("./pages/portal/Perfil"));
const AdminEmpresas = lazy(() => import("./pages/portal/admin/Empresas"));
const AdminUsuarios = lazy(() => import("./pages/portal/admin/Usuarios"));
const AdminServicos = lazy(() => import("./pages/portal/admin/Servicos"));
const EmpresaServicos = lazy(() => import("./pages/portal/admin/EmpresaServicos"));
const DataTableManager = lazy(() => import("./pages/portal/admin/DataTableManager"));
const PortalServicos = lazy(() => import("./pages/portal/Servicos"));
const ServicoDetalhe = lazy(() => import("./pages/portal/ServicoDetalhe"));
const RegrasRls = lazy(() => import("./pages/portal/admin/RegrasRls"));

// Preload site pages only when user is on the public site (not portal)
function usePreloadPages() {
  const { pathname } = useLocation();
  useEffect(() => {
    if (pathname.startsWith("/portal")) return;
    const timer = setTimeout(() => {
      import("./pages/Solucoes");
      import("./pages/Sobre");
      import("./pages/Blog");
      import("./pages/Contato");
    }, 1500);
    return () => clearTimeout(timer);
  }, [pathname]);
}

// Preload portal pages once user enters the portal
function usePreloadPortalPages() {
  const { pathname } = useLocation();
  const preloaded = useRef(false);
  useEffect(() => {
    if (preloaded.current || !pathname.startsWith("/portal")) return;
    preloaded.current = true;
    import("./pages/portal/Dashboard");
    import("./pages/portal/Chamados");
    import("./pages/portal/Servicos");
    import("./pages/portal/Documentos");
    import("./pages/portal/Perfil");
  }, [pathname]);
}

const queryClient = new QueryClient();

// Minimal loading
const Loading = () => (
  <div className="min-h-screen flex items-center justify-center">
    <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
  </div>
);

const SiteLoading = () => (
  <Layout>
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  </Layout>
);

const AppRoutes = () => {
  usePreloadPages();
  usePreloadPortalPages();

  return (
    <Routes>
      {/* Public site */}
      <Route path="/" element={<Suspense fallback={<SiteLoading />}><Index /></Suspense>} />
      <Route path="/solucoes" element={<Suspense fallback={<SiteLoading />}><Solucoes /></Suspense>} />
      <Route path="/solucoes/:slug" element={<Suspense fallback={<SiteLoading />}><SolucaoDetalhe /></Suspense>} />
      <Route path="/servicos" element={<Suspense fallback={<SiteLoading />}><Servicos /></Suspense>} />
      <Route path="/sobre" element={<Suspense fallback={<SiteLoading />}><Sobre /></Suspense>} />
      <Route path="/blog" element={<Suspense fallback={<SiteLoading />}><Blog /></Suspense>} />
      <Route path="/blog/:slug" element={<Suspense fallback={<SiteLoading />}><BlogPost /></Suspense>} />
      <Route path="/contato" element={<Suspense fallback={<SiteLoading />}><Contato /></Suspense>} />
      <Route path="/privacy" element={<Suspense fallback={<SiteLoading />}><Privacy /></Suspense>} />
      <Route path="/terms" element={<Suspense fallback={<SiteLoading />}><Terms /></Suspense>} />

      {/* Store */}
      <Route path="/loja" element={<Suspense fallback={<SiteLoading />}><Loja /></Suspense>} />
      <Route path="/loja/:slug" element={<Suspense fallback={<SiteLoading />}><ProdutoDetalhe /></Suspense>} />
      <Route path="/loja/carrinho" element={<Suspense fallback={<SiteLoading />}><Carrinho /></Suspense>} />
      <Route path="/loja/checkout" element={<Suspense fallback={<SiteLoading />}><Checkout /></Suspense>} />

      {/* Portal - public */}
      <Route path="/portal/login" element={<Suspense fallback={<Loading />}><PortalLogin /></Suspense>} />
      <Route path="/portal/reset-password" element={<Suspense fallback={<Loading />}><ResetPassword /></Suspense>} />

      {/* Portal - protected (layout route keeps sidebar mounted) */}
      <Route element={<ProtectedRoute><PortalLayout /></ProtectedRoute>}>
        <Route path="/portal" element={<Suspense fallback={<Loading />}><PortalDashboard /></Suspense>} />
        <Route path="/portal/chamados" element={<Suspense fallback={<Loading />}><Chamados /></Suspense>} />
        <Route path="/portal/chamados/:id" element={<Suspense fallback={<Loading />}><ChamadoDetalhe /></Suspense>} />
        <Route path="/portal/documentos" element={<Suspense fallback={<Loading />}><Documentos /></Suspense>} />
        <Route path="/portal/perfil" element={<Suspense fallback={<Loading />}><Perfil /></Suspense>} />
        <Route path="/portal/servicos" element={<Suspense fallback={<Loading />}><PortalServicos /></Suspense>} />
        <Route path="/portal/servicos/:id" element={<Suspense fallback={<Loading />}><ServicoDetalhe /></Suspense>} />
      </Route>

      {/* Admin (layout route keeps sidebar mounted) */}
      <Route element={<ProtectedRoute adminOnly><PortalLayout /></ProtectedRoute>}>
        <Route path="/portal/admin/servicos" element={<Suspense fallback={<Loading />}><AdminServicos /></Suspense>} />
        <Route path="/portal/admin/empresas" element={<Suspense fallback={<Loading />}><AdminEmpresas /></Suspense>} />
        <Route path="/portal/admin/empresas/:id/servicos" element={<Suspense fallback={<Loading />}><EmpresaServicos /></Suspense>} />
        <Route path="/portal/admin/empresas/:id/rls-rules" element={<Suspense fallback={<Loading />}><RegrasRls /></Suspense>} />
        <Route path="/portal/admin/data-tables/:id" element={<Suspense fallback={<Loading />}><DataTableManager /></Suspense>} />
        <Route path="/portal/admin/usuarios" element={<Suspense fallback={<Loading />}><AdminUsuarios /></Suspense>} />
      </Route>

      <Route path="*" element={<Suspense fallback={<SiteLoading />}><NotFound /></Suspense>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <VercelAnalytics />
      <SpeedInsights />
      <BrowserRouter>
        <Analytics />
        <ScrollToTop />
        <AuthProvider>
          <CartProvider>
            <AppRoutes />
          </CartProvider>
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
