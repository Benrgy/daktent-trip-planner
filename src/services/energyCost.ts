/**
 * Energy cost calculation utility.
 * Handles fuel (L/100km) and electric (kWh/100km) vehicle types.
 */

import { getFuelPrices } from "./fuelPrices";

/** Fuel consumption in L/100km per car type */
const fuelRates: Record<string, number> = {
  small: 6, medium: 8, suv: 10, "4x4": 12,
  hybrid: 4, // petrol equivalent for hybrid
};

/** Electric consumption in kWh/100km */
const electricRates: Record<string, number> = {
  electric: 18,
  hybrid: 8, // electric-only portion (not used for cost, just info)
};

/** Whether a car type uses electricity as primary energy */
export function isElectric(carType: string): boolean {
  return carType === "electric";
}

export function isHybrid(carType: string): boolean {
  return carType === "hybrid";
}

/** Average electricity price per kWh per country (public charger, EUR) */
const electricityPrices: Record<string, number> = {
  NL: 0.45, BE: 0.42, DE: 0.44, FR: 0.35, SC: 0.38,
  ES: 0.32, IT: 0.48, PT: 0.30, AT: 0.40, CH: 0.42, HR: 0.28, SI: 0.30,
};

export function getElectricityPrice(countryCode: string): number {
  return electricityPrices[countryCode] ?? 0.40;
}

export function getConsumptionRate(carType: string): number {
  return fuelRates[carType] || 8;
}

export function getElectricConsumptionRate(carType: string): number {
  return electricRates[carType] || 18;
}

/**
 * Calculate energy cost for a trip.
 * Returns { cost, unit, rate, pricePerUnit }
 */
export function calculateEnergyCost(
  distanceKm: number,
  carType: string,
  fuelType: string,
  countryCode: string
): { cost: number; unit: string; rate: number; pricePerUnit: number; label: string } {
  if (isElectric(carType)) {
    const rate = getElectricConsumptionRate(carType);
    const pricePerUnit = getElectricityPrice(countryCode);
    const kWh = (distanceKm / 100) * rate;
    return {
      cost: Math.round(kWh * pricePerUnit),
      unit: "kWh",
      rate,
      pricePerUnit,
      label: `${distanceKm} km × ${rate}kWh/100km × €${pricePerUnit.toFixed(2)}/kWh`,
    };
  }

  const prices = getFuelPrices(countryCode);
  const rate = getConsumptionRate(carType);
  const pricePerUnit =
    fuelType === "diesel" ? prices.diesel :
    fuelType === "lpg" ? prices.lpg :
    prices.benzine;
  const liters = (distanceKm / 100) * rate;

  return {
    cost: Math.round(liters * pricePerUnit),
    unit: "L",
    rate,
    pricePerUnit,
    label: `${distanceKm} km × ${rate}L/100km × €${pricePerUnit.toFixed(2)}/L`,
  };
}
