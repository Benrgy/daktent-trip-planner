/** OSRM routing service — free, no API key, unlimited */

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][]; // [lat, lng][]
}

/**
 * Get driving route between two points using OSRM demo server.
 * Note: OSRM uses [lng, lat] in URLs but we return [lat, lng] for Leaflet.
 */
export async function getRoute(
  from: [number, number], // [lat, lng]
  to: [number, number]    // [lat, lng]
): Promise<RouteResult | null> {
  try {
    const url = `https://router.project-osrm.org/route/v1/driving/${from[1]},${from[0]};${to[1]},${to[0]}?overview=full&geometries=geojson`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) return null;

    const route = data.routes[0];
    // GeoJSON coords are [lng, lat], flip to [lat, lng]
    const geometry: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );

    return {
      distanceKm: Math.round(route.distance / 1000),
      durationMinutes: Math.round(route.duration / 60),
      geometry,
    };
  } catch {
    return null;
  }
}

/** Format duration in hours and minutes */
export function formatDuration(minutes: number): string {
  const h = Math.floor(minutes / 60);
  const m = minutes % 60;
  if (h === 0) return `${m} min`;
  return `${h}u ${m}m`;
}
