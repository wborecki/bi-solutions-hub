import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import Index from "@/pages/Index";

const queryClient = new QueryClient({ defaultOptions: { queries: { retry: false } } });

function Wrapper({ children }: { children: React.ReactNode }) {
  return (
    <QueryClientProvider client={queryClient}>
      <HelmetProvider>
        <TooltipProvider>
          <MemoryRouter>{children}</MemoryRouter>
        </TooltipProvider>
      </HelmetProvider>
    </QueryClientProvider>
  );
}

describe("Index page", () => {
  it("renders hero section", () => {
    const { getByText } = render(<Index />, { wrapper: Wrapper });
    expect(getByText(/Solutions in BI/i)).toBeInTheDocument();
  });

  it("renders solutions cards", () => {
    const { getByText } = render(<Index />, { wrapper: Wrapper });
    expect(getByText(/Business Intelligence/i)).toBeInTheDocument();
    expect(getByText(/Automação de Fluxos/i)).toBeInTheDocument();
  });
});
