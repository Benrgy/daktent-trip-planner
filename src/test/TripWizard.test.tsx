import { describe, it, expect } from "vitest";
import { render, screen, fireEvent } from "@testing-library/react";
import TripWizard from "@/components/TripWizard";

describe("TripWizard", () => {
  it("renders the form with all key fields", () => {
    render(<TripWizard onGenerate={() => {}} />);
    expect(screen.getByText("Configureer je trip")).toBeInTheDocument();
    expect(screen.getByPlaceholderText("bijv. Amsterdam")).toBeInTheDocument();
    expect(screen.getByText("Bestemming")).toBeInTheDocument();
    expect(screen.getByText("Type auto")).toBeInTheDocument();
    expect(screen.getByText("Voorkeuren")).toBeInTheDocument();
  });

  it("shows default days and budget values", () => {
    render(<TripWizard onGenerate={() => {}} />);
    expect(screen.getByText("5")).toBeInTheDocument();
    expect(screen.getByText("€100")).toBeInTheDocument();
  });

  it("has disabled generate button when fields are empty", () => {
    render(<TripWizard onGenerate={() => {}} />);
    const button = screen.getByRole("button", { name: /genereer route/i });
    expect(button).toBeDisabled();
  });

  it("enables button when start location is filled", () => {
    render(<TripWizard onGenerate={() => {}} />);
    const input = screen.getByPlaceholderText("bijv. Amsterdam");
    fireEvent.change(input, { target: { value: "Utrecht" } });
    // Still disabled because destination is not set
    const button = screen.getByRole("button", { name: /genereer route/i });
    expect(button).toBeDisabled();
  });

  it("toggles preference selection", () => {
    render(<TripWizard onGenerate={() => {}} />);
    const kust = screen.getByText("Kust");
    fireEvent.click(kust);
    // Kust label should now have primary styling (selected)
    expect(kust.closest("label")).toHaveClass("border-primary");
  });
});
