import { describe, it, expect } from "vitest";
import { render } from "@testing-library/react";
import { MemoryRouter } from "react-router-dom";
import { Layout } from "@/components/layout/Layout";

describe("Layout", () => {
  it("renders header, content, and footer", () => {
    const { getByText, container } = render(
      <MemoryRouter>
        <Layout>
          <div>Test content</div>
        </Layout>
      </MemoryRouter>
    );
    expect(getByText("Test content")).toBeInTheDocument();
    expect(container.querySelector("nav")).toBeTruthy();
    expect(container.querySelector("footer")).toBeTruthy();
  });
});
