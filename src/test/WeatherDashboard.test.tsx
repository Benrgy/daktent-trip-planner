import { describe, it, expect } from "vitest";
import { render, screen } from "@testing-library/react";
import WeatherDashboard from "@/components/WeatherDashboard";

const mockConfig = {
  startLocation: "Amsterdam",
  destination: "NL",
  days: 5,
  budget: 100,
  carType: "suv", fuelType: "benzine" as const, batteryKwh: 60,
  people: 2,
  preferences: ["natuur"],
};

describe("WeatherDashboard", () => {
  it("renders weather section", () => {
    render(<WeatherDashboard config={mockConfig} />);
    expect(screen.getByText("Weersverwachting")).toBeInTheDocument();
  });

  it("renders correct number of weather cards for trip days", () => {
    render(<WeatherDashboard config={mockConfig} />);
    // 5 days = 5 weather cards, each has a km/h wind speed
    const windElements = screen.getAllByText(/km\/h/);
    expect(windElements).toHaveLength(5);
  });

  it("caps at 7 days even for longer trips", () => {
    const longConfig = { ...mockConfig, days: 14 };
    render(<WeatherDashboard config={longConfig} />);
    const windElements = screen.getAllByText(/km\/h/);
    expect(windElements).toHaveLength(7);
  });
});
