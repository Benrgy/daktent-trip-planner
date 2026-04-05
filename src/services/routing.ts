/** OSRM routing service — free, no API key, unlimited */

export interface RouteLeg {
  distanceKm: number;
  durationMinutes: number;
}

export interface RouteResult {
  distanceKm: number;
  durationMinutes: number;
  geometry: [number, number][]; // [lat, lng][]
  legs: RouteLeg[];
}

/**
 * Get driving route through multiple waypoints using OSRM demo server.
 * Supports 2+ points. OSRM uses [lng, lat] in URLs but we return [lat, lng] for Leaflet.
 */
export async function getRoute(
  from: [number, number], // [lat, lng]
  to: [number, number],   // [lat, lng]
  waypoints?: [number, number][] // optional intermediate [lat, lng][]
): Promise<RouteResult | null> {
  try {
    const allPoints = [from, ...(waypoints ?? []), to];
    const coordStr = allPoints.map(p => `${p[1]},${p[0]}`).join(";");
    const url = `https://router.project-osrm.org/route/v1/driving/${coordStr}?overview=full&geometries=geojson&steps=false`;
    const res = await fetch(url);
    if (!res.ok) return null;
    const data = await res.json();

    if (data.code !== "Ok" || !data.routes?.length) return null;

    const route = data.routes[0];
    const geometry: [number, number][] = route.geometry.coordinates.map(
      (c: [number, number]) => [c[1], c[0]] as [number, number]
    );

    const legs: RouteLeg[] = (route.legs ?? []).map((leg: any) => ({
      distanceKm: Math.round(leg.distance / 1000),
      durationMinutes: Math.round(leg.duration / 60),
    }));

    return {
      distanceKm: Math.round(route.distance / 1000),
      durationMinutes: Math.round(route.duration / 60),
      geometry,
      legs,
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
