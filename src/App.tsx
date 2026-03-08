import { lazy, Suspense, useEffect } from "react";
import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import { ScrollToTop } from "./components/ScrollToTop";
import Index from "./pages/Index";
import { Analytics } from "./components/Analytics";
import { Layout } from "./components/layout/Layout";
import { AuthProvider } from "./contexts/AuthContext";
import { ProtectedRoute } from "./components/portal/ProtectedRoute";

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
const BiaPreview = lazy(() => import("./pages/BiaPreview"));

// Portal pages — eagerly imported to avoid loading flicker on sidebar navigation
import PortalLogin from "./pages/portal/Login";
import ResetPassword from "./pages/portal/ResetPassword";
import PortalDashboard from "./pages/portal/Dashboard";
import Chamados from "./pages/portal/Chamados";
import ChamadoDetalhe from "./pages/portal/ChamadoDetalhe";
import Documentos from "./pages/portal/Documentos";
import Perfil from "./pages/portal/Perfil";
import AdminEmpresas from "./pages/portal/admin/Empresas";
import AdminUsuarios from "./pages/portal/admin/Usuarios";

// Preload main pages after initial render
function usePreloadPages() {
  useEffect(() => {
    const timer = setTimeout(() => {
      import("./pages/Solucoes");
      import("./pages/Sobre");
      import("./pages/Blog");
      import("./pages/Contato");
    }, 1500);
    return () => clearTimeout(timer);
  }, []);
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
      <Route path="/bia-preview" element={<Suspense fallback={<SiteLoading />}><BiaPreview /></Suspense>} />

      {/* Portal - public */}
      <Route path="/portal/login" element={<Suspense fallback={<Loading />}><PortalLogin /></Suspense>} />
      <Route path="/portal/reset-password" element={<Suspense fallback={<Loading />}><ResetPassword /></Suspense>} />

      {/* Portal - protected */}
      <Route path="/portal" element={<Suspense fallback={<Loading />}><ProtectedRoute><PortalDashboard /></ProtectedRoute></Suspense>} />
      <Route path="/portal/chamados" element={<Suspense fallback={<Loading />}><ProtectedRoute><Chamados /></ProtectedRoute></Suspense>} />
      <Route path="/portal/chamados/:id" element={<Suspense fallback={<Loading />}><ProtectedRoute><ChamadoDetalhe /></ProtectedRoute></Suspense>} />
      <Route path="/portal/documentos" element={<Suspense fallback={<Loading />}><ProtectedRoute><Documentos /></ProtectedRoute></Suspense>} />
      <Route path="/portal/perfil" element={<Suspense fallback={<Loading />}><ProtectedRoute><Perfil /></ProtectedRoute></Suspense>} />

      {/* Admin */}
      <Route path="/portal/admin/empresas" element={<Suspense fallback={<Loading />}><ProtectedRoute adminOnly><AdminEmpresas /></ProtectedRoute></Suspense>} />
      <Route path="/portal/admin/usuarios" element={<Suspense fallback={<Loading />}><ProtectedRoute adminOnly><AdminUsuarios /></ProtectedRoute></Suspense>} />

      <Route path="*" element={<Suspense fallback={<SiteLoading />}><NotFound /></Suspense>} />
    </Routes>
  );
};

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Analytics />
        <ScrollToTop />
        <AuthProvider>
          <AppRoutes />
        </AuthProvider>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
