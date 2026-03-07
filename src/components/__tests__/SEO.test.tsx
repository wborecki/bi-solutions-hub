import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { HelmetProvider } from "react-helmet-async";
import { SEO } from "@/components/SEO";

describe("SEO", () => {
  it("renders without crashing", () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO title="Teste" description="Descrição teste" canonical="/teste" />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(container).toBeDefined();
  });

  it("accepts article metadata", () => {
    const { container } = render(
      <HelmetProvider>
        <MemoryRouter>
          <SEO
            title="Artigo"
            description="Descrição"
            type="article"
            article={{ publishedTime: "2025-01-01", section: "BI", tags: ["dados"] }}
          />
        </MemoryRouter>
      </HelmetProvider>
    );
    expect(container).toBeDefined();
  });
});
