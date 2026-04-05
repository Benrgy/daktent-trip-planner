/**
 * Energy cost calculation utility.
 * Handles fuel (L/100km) and electric (kWh/100km) vehicle types.
 * Consumption rates are realistic European averages per car type AND fuel type.
 */

import { getFuelPrices } from "./fuelPrices";

/**
 * Fuel consumption in L/100km per car type per fuel type.
 * LPG consumes ~20-25% more liters due to lower energy density.
 */
const fuelRates: Record<string, Record<string, number>> = {
  small:      { benzine: 6.5, diesel: 5.0, lpg: 8.0 },
  medium:     { benzine: 7.5, diesel: 6.0, lpg: 9.5 },
  suv:        { benzine: 9.0, diesel: 7.5, lpg: 11.0 },
  "4x4":      { benzine: 11.0, diesel: 9.0, lpg: 13.5 },
  hybrid:     { benzine: 5.5 },
  phev:       { benzine: 3.0 },
  motorcycle: { benzine: 4.5 },
};

/** Electric consumption in kWh/100km */
const electricRates: Record<string, number> = {
  electric: 18,
  phev: 15,
};

/** Valid fuel types per car type */
const validFuelTypes: Record<string, string[]> = {
  small:      ["benzine", "diesel", "lpg"],
  medium:     ["benzine", "diesel", "lpg"],
  suv:        ["benzine", "diesel", "lpg"],
  "4x4":      ["benzine", "diesel", "lpg"],
  hybrid:     ["benzine"],
  phev:       ["benzine"],
  electric:   [],
  motorcycle: ["benzine"],
};

export function getValidFuelTypes(carType: string): string[] {
  return validFuelTypes[carType] ?? ["benzine", "diesel", "lpg"];
}

/** Whether a car type uses electricity as primary energy */
export function isElectric(carType: string): boolean {
  return carType === "electric";
}

export function isHybrid(carType: string): boolean {
  return carType === "hybrid";
}

export function isPhev(carType: string): boolean {
  return carType === "phev";
}

/** Whether car type has an electric motor (EV or PHEV) */
export function hasElectricMotor(carType: string): boolean {
  return carType === "electric" || carType === "phev";
}

/** Average electricity price per kWh per country (public charger, EUR) */
const electricityPrices: Record<string, number> = {
  NL: 0.45, BE: 0.42, DE: 0.44, FR: 0.35, SC: 0.38,
  ES: 0.32, IT: 0.48, PT: 0.30, AT: 0.40, CH: 0.42, HR: 0.28, SI: 0.30,
  GB: 0.45,
};

export function getElectricityPrice(countryCode: string): number {
  return electricityPrices[countryCode] ?? 0.40;
}

export function getConsumptionRate(carType: string, fuelType: string): number {
  const rates = fuelRates[carType];
  if (!rates) return 8;
  return rates[fuelType] ?? rates["benzine"] ?? 8;
}

export function getElectricConsumptionRate(carType: string): number {
  return electricRates[carType] || 18;
}

export interface EnergyCostResult {
  cost: number;
  unit: string;
  rate: number;
  pricePerUnit: number;
  label: string;
  /** For PHEV: additional electric cost */
  electricCost?: number;
  electricLabel?: string;
}

/**
 * Calculate energy cost for a trip.
 * For PHEV: calculates both fuel and electric portions.
 * Supports custom price overrides for fuel and electricity.
 */
export function calculateEnergyCost(
  distanceKm: number,
  carType: string,
  fuelType: string,
  countryCode: string,
  customConsumption?: number | null,
  customFuelPrice?: number | null,
  customElectricityPrice?: number | null
): EnergyCostResult {
  // Pure electric
  if (isElectric(carType)) {
    const rate = customConsumption ?? getElectricConsumptionRate(carType);
    const pricePerUnit = customElectricityPrice ?? getElectricityPrice(countryCode);
    const kWh = (distanceKm / 100) * rate;
    return {
      cost: Math.round(kWh * pricePerUnit),
      unit: "kWh",
      rate,
      pricePerUnit,
      label: `${distanceKm} km × ${rate}kWh/100km × €${pricePerUnit.toFixed(2)}/kWh`,
    };
  }

  // PHEV: combination of fuel + electricity
  if (isPhev(carType)) {
    const prices = getFuelPrices(countryCode);
    const fuelRate = customConsumption ?? getConsumptionRate(carType, fuelType);
    const elRate = getElectricConsumptionRate(carType);
    const fuelPrice = customFuelPrice ?? prices.benzine;
    const elPrice = customElectricityPrice ?? getElectricityPrice(countryCode);

    const liters = (distanceKm / 100) * fuelRate;
    const kWh = (distanceKm / 100) * elRate;
    const fuelCost = Math.round(liters * fuelPrice);
    const elCost = Math.round(kWh * elPrice);

    return {
      cost: fuelCost + elCost,
      unit: "L",
      rate: fuelRate,
      pricePerUnit: fuelPrice,
      label: `${distanceKm} km × ${fuelRate}L/100km × €${fuelPrice.toFixed(2)}/L`,
      electricCost: elCost,
      electricLabel: `${distanceKm} km × ${elRate}kWh/100km × €${elPrice.toFixed(2)}/kWh`,
    };
  }

  // Standard combustion / hybrid
  const prices = getFuelPrices(countryCode);
  const rate = customConsumption ?? getConsumptionRate(carType, fuelType);
  const defaultPrice =
    fuelType === "diesel" ? prices.diesel :
    fuelType === "lpg" ? prices.lpg :
    prices.benzine;
  const pricePerUnit = customFuelPrice ?? defaultPrice;
  const liters = (distanceKm / 100) * rate;

  return {
    cost: Math.round(liters * pricePerUnit),
    unit: "L",
    rate,
    pricePerUnit,
    label: `${distanceKm} km × ${rate}L/100km × €${pricePerUnit.toFixed(2)}/L`,
  };
}
