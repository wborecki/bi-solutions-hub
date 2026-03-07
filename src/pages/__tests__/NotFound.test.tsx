import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { TooltipProvider } from "@/components/ui/tooltip";
import NotFound from "@/pages/NotFound";

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

describe("NotFound page", () => {
  it("renders 404 message and link to home", () => {
    const { getByText, container } = render(<NotFound />, { wrapper: Wrapper });
    expect(getByText(/não encontrada/i)).toBeInTheDocument();
    const homeLink = container.querySelector('a[href="/"]');
    expect(homeLink).toBeTruthy();
  });
});
