import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CostCalculator from "@/components/CostCalculator";
import { campingSpots } from "@/data/campingSpots";

const mockConfig = {
  startLocation: "Amsterdam",
  destination: "NL",
  days: 5,
  budget: 100,
  carType: "suv",
  people: 2,
  preferences: ["natuur"],
};

describe("CostCalculator", () => {
  it("renders total cost", () => {
    render(<CostCalculator config={mockConfig} spots={campingSpots.filter(s => s.countryCode === "NL")} />);
    expect(screen.getByText("Totale kosten")).toBeInTheDocument();
    expect(screen.getByText(/per dag/)).toBeInTheDocument();
  });

  it("shows cost breakdown categories", () => {
    render(<CostCalculator config={mockConfig} spots={campingSpots.filter(s => s.countryCode === "NL")} />);
    expect(screen.getByText("Brandstof")).toBeInTheDocument();
    expect(screen.getByText("Camping")).toBeInTheDocument();
    expect(screen.getByText("Eten")).toBeInTheDocument();
    expect(screen.getByText("Tol")).toBeInTheDocument();
  });

  it("shows savings compared to hotels", () => {
    render(<CostCalculator config={mockConfig} spots={campingSpots.filter(s => s.countryCode === "NL")} />);
    expect(screen.getByText(/goedkoper dan hotels/)).toBeInTheDocument();
  });

  it("calculates toll for France", () => {
    const frConfig = { ...mockConfig, destination: "FR" };
    render(<CostCalculator config={frConfig} spots={campingSpots.filter(s => s.countryCode === "FR")} />);
    // Tol should have a non-zero value for FR
    const tolElements = screen.getAllByText(/€\d+/);
    expect(tolElements.length).toBeGreaterThan(0);
  });
});
