import { describe, it, expect } from "vitest";
import { campingSpots } from "@/data/campingSpots";
import { packingCategories } from "@/data/packingItems";

describe("campingSpots data", () => {
  it("has at least 10 spots", () => {
    expect(campingSpots.length).toBeGreaterThanOrEqual(10);
  });

  it("all spots have required fields", () => {
    campingSpots.forEach(spot => {
      expect(spot.id).toBeDefined();
      expect(spot.name).toBeTruthy();
      expect(spot.lat).toBeGreaterThan(0);
      expect(spot.lng).toBeDefined();
      expect(["free", "paid"]).toContain(spot.type);
      expect(spot.rating).toBeGreaterThanOrEqual(1);
      expect(spot.rating).toBeLessThanOrEqual(5);
    });
  });

  it("has spots from multiple countries", () => {
    const countries = new Set(campingSpots.map(s => s.countryCode));
    expect(countries.size).toBeGreaterThanOrEqual(3);
  });

  it("has both free and paid spots", () => {
    expect(campingSpots.some(s => s.type === "free")).toBe(true);
    expect(campingSpots.some(s => s.type === "paid")).toBe(true);
  });
});

describe("packingItems data", () => {
  it("has at least 4 categories", () => {
    expect(Object.keys(packingCategories).length).toBeGreaterThanOrEqual(4);
  });

  it("each category has items", () => {
    Object.entries(packingCategories).forEach(([cat, items]) => {
      expect(items.length).toBeGreaterThan(0);
    });
  });

  it("all items have unique IDs", () => {
    const allIds = Object.values(packingCategories).flat().map(i => i.id);
    expect(new Set(allIds).size).toBe(allIds.length);
  });
});
