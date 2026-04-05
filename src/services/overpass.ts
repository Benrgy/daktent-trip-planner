/** Fetch camping sites from OpenStreetMap via Overpass API */

import { CampingSpot } from "@/data/campingSpots";

interface OverpassElement {
  id: number;
  lat: number;
  lon: number;
  tags: Record<string, string>;
}

const countryBBox: Record<string, string> = {
  NL: "50.7,3.3,53.6,7.2",
  BE: "49.5,2.5,51.5,6.4",
  DE: "47.2,5.8,55.1,15.0",
  FR: "41.3,-5.1,51.1,9.6",
  SC: "55.3,4.5,71.2,31.1",
  ES: "36.0,-9.3,43.8,3.3",
  IT: "36.6,6.6,47.1,18.5",
  PT: "36.9,-9.5,42.2,-6.2",
  AT: "46.3,9.5,49.0,17.2",
  CH: "45.8,5.9,47.8,10.5",
  HR: "42.4,13.5,46.6,19.4",
  SI: "45.4,13.4,46.9,16.6",
};

/**
 * Fetch camping sites from Overpass API for a given country.
 * Returns extra spots not already in our static database.
 */
export async function fetchOsmCampingSites(
  countryCode: string,
  existingIds: Set<number>
): Promise<CampingSpot[]> {
  const bbox = countryBBox[countryCode];
  if (!bbox) return [];

  const query = `
    [out:json][timeout:15];
    node["tourism"="camp_site"](${bbox});
    out body 50;
  `;

  try {
    const res = await fetch("https://overpass-api.de/api/interpreter", {
      method: "POST",
      body: `data=${encodeURIComponent(query)}`,
      headers: { "Content-Type": "application/x-www-form-urlencoded" },
    });

    if (!res.ok) return [];
    const data = await res.json();

    const countryNames: Record<string, string> = {
      NL: "Nederland", BE: "België", DE: "Duitsland", FR: "Frankrijk",
      SC: "Scandinavië", ES: "Spanje", IT: "Italië", PT: "Portugal",
      AT: "Oostenrijk", CH: "Zwitserland", HR: "Kroatië", SI: "Slovenië",
    };

    return (data.elements as OverpassElement[])
      .filter((el) => el.tags?.name && !existingIds.has(el.id))
      .map((el, i) => ({
        id: 10000 + el.id, // avoid collision with static IDs
        name: el.tags.name,
        country: countryNames[countryCode] || countryCode,
        countryCode,
        lat: el.lat,
        lng: el.lon,
        type: el.tags.fee === "no" ? "free" as const : "paid" as const,
        facilities: parseFacilities(el.tags),
        rating: 0, // no rating from OSM
        daktentFriendly: false, // unknown
        description: el.tags.description || `Camping via OpenStreetMap in ${countryNames[countryCode] || countryCode}.`,
        legalStatus: el.tags.fee === "no" ? "Gratis camping" : "Campsite",
        pricePerNight: el.tags.fee === "no" ? 0 : 15,
        image: undefined,
      }));
  } catch {
    return [];
  }
}

function parseFacilities(tags: Record<string, string>): string[] {
  const facilities: string[] = [];
  if (tags.drinking_water === "yes") facilities.push("water");
  if (tags.toilets === "yes" || tags.shower === "yes") facilities.push("toilet");
  if (tags.power_supply === "yes") facilities.push("electricity");
  if (tags.bbq === "yes" || tags.fireplace === "yes") facilities.push("fire");
  return facilities;
}
