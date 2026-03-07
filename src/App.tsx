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

// Minimal loading — keeps header/footer visible, shows only a subtle indicator
const Loading = () => (
  <Layout>
    <div className="min-h-[60vh] flex items-center justify-center">
      <div className="w-6 h-6 border-2 border-primary border-t-transparent rounded-full animate-spin" />
    </div>
  </Layout>
);

const AppRoutes = () => {
  usePreloadPages();

  return (
    <Suspense fallback={<Loading />}>
      <Routes>
        <Route path="/" element={<Index />} />
        <Route path="/solucoes" element={<Solucoes />} />
        <Route path="/solucoes/:slug" element={<SolucaoDetalhe />} />
        <Route path="/servicos" element={<Servicos />} />
        <Route path="/sobre" element={<Sobre />} />
        <Route path="/blog" element={<Blog />} />
        <Route path="/blog/:slug" element={<BlogPost />} />
        <Route path="/contato" element={<Contato />} />
        <Route path="/privacy" element={<Privacy />} />
        <Route path="/terms" element={<Terms />} />
        <Route path="/bia-preview" element={<BiaPreview />} />
        <Route path="*" element={<NotFound />} />
      </Routes>
    </Suspense>
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
        <AppRoutes />
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
