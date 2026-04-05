import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import CostCalculator from "@/components/CostCalculator";
import { campingSpots } from "@/data/campingSpots";

const mockConfig = {
  startLocation: "Amsterdam",
  destination: "NL",
  days: 5,
  budget: 100,
  carType: "suv", fuelType: "benzine" as const, batteryKwh: 60,
  people: 2,
  preferences: ["natuur"],
  customConsumption: null,
  customFuelPrice: null,
  customElectricityPrice: null,
  customCampingPrice: null,
  customFoodBudget: null,
  includeReturnTrip: false,
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
    const tolElements = screen.getAllByText(/€\d+/);
    expect(tolElements.length).toBeGreaterThan(0);
  });

  it("shows PHEV dual cost breakdown", () => {
    const phevConfig = { ...mockConfig, carType: "phev", batteryKwh: 13 };
    render(<CostCalculator config={phevConfig} spots={campingSpots.filter(s => s.countryCode === "NL")} />);
    expect(screen.getByText("Brandstof + Stroom")).toBeInTheDocument();
  });

  it("shows electric cost label for EV", () => {
    const evConfig = { ...mockConfig, carType: "electric" };
    render(<CostCalculator config={evConfig} spots={campingSpots.filter(s => s.countryCode === "NL")} />);
    expect(screen.getByText("Opladen")).toBeInTheDocument();
  });

  it("shows ferry cost for UK destination", () => {
    const gbConfig = { ...mockConfig, destination: "GB" };
    render(<CostCalculator config={gbConfig} spots={campingSpots.filter(s => s.countryCode === "GB")} />);
    expect(screen.getAllByText("Kanaaltunnel / Veerboot").length).toBeGreaterThanOrEqual(1);
    expect(screen.getAllByText(/€180/).length).toBeGreaterThanOrEqual(1);
  });

  it("shows ferry cost for Scandinavia", () => {
    const scConfig = { ...mockConfig, destination: "SC" };
    render(<CostCalculator config={scConfig} spots={campingSpots.filter(s => s.countryCode === "SC")} />);
    expect(screen.getAllByText("Veerboot Scandinavië").length).toBeGreaterThanOrEqual(1);
  });
});
