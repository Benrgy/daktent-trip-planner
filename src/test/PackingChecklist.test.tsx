import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import PackingChecklist from "@/components/PackingChecklist";

describe("PackingChecklist", () => {
  it("renders all packing categories", () => {
    render(<PackingChecklist />);
    expect(screen.getByText("Paklijst")).toBeInTheDocument();
    expect(screen.getByText("Daktent Essentials")).toBeInTheDocument();
    expect(screen.getByText("Koken & Eten")).toBeInTheDocument();
  });

  it("shows progress counter starting at 0", () => {
    render(<PackingChecklist />);
    // Should show 0/total
    expect(screen.getByText(/^0\//)).toBeInTheDocument();
  });

  it("toggles checklist item", () => {
    render(<PackingChecklist />);
    const slaapzakken = screen.getByText("Slaapzakken");
    fireEvent.click(slaapzakken);
    // After clicking, the item should have line-through
    expect(slaapzakken).toHaveClass("line-through");
  });

  it("collapses and expands sections", () => {
    render(<PackingChecklist />);
    const essentialsButton = screen.getByText("Daktent Essentials").closest("button");
    expect(essentialsButton).toBeInTheDocument();
    // Items should be visible initially
    expect(screen.getByText("Slaapzakken")).toBeVisible();
    // Click to collapse
    fireEvent.click(essentialsButton!);
    // Items should be hidden
    expect(screen.queryByText("Slaapzakken")).not.toBeInTheDocument();
  });
});
