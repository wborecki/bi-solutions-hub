import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

export function renderWithProviders(ui: React.ReactElement, { route = "/" } = {}) {
  return render(
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <MemoryRouter initialEntries={[route]}>
            {ui}
          </MemoryRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}
