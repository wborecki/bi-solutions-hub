import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

describe("Layout", () => {
  it("renders header and footer", () => {
    render(
      <MemoryRouter>
        <Layout>
          <div>Test content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(screen.getByText("Test content")).toBeInTheDocument();
    // Header should have navigation
    expect(screen.getByRole("navigation")).toBeInTheDocument();
  });
});
