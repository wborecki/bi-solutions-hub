import { Toaster } from "@/components/ui/toaster";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { TooltipProvider } from "@/components/ui/tooltip";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Routes, Route } from "react-router-dom";
import Index from "./pages/Index";
import Solucoes from "./pages/Solucoes";
import SolucaoDetalhe from "./pages/SolucaoDetalhe";
import Servicos from "./pages/Servicos";
import CasesDeSucesso from "./pages/CasesDeSucesso";
import Sobre from "./pages/Sobre";
import Blog from "./pages/Blog";
import BlogPost from "./pages/BlogPost";
import Contato from "./pages/Contato";
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <Toaster />
      <Sonner />
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Index />} />
          <Route path="/solucoes" element={<Solucoes />} />
          <Route path="/solucoes/:slug" element={<SolucaoDetalhe />} />
          <Route path="/servicos" element={<Servicos />} />
          <Route path="/casos-de-sucesso" element={<CasesDeSucesso />} />
          <Route path="/sobre" element={<Sobre />} />
          <Route path="/blog" element={<Blog />} />
          <Route path="/blog/:slug" element={<BlogPost />} />
          <Route path="/contato" element={<Contato />} />
          <Route path="*" element={<NotFound />} />
        </Routes>
      </BrowserRouter>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
