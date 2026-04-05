/** Geocode a place name to [lat, lng] using Nominatim (free, no key) */
export async function geocode(placeName: string): Promise<[number, number] | null> {
  try {
    const res = await fetch(
      `https://nominatim.openstreetmap.org/search?q=${encodeURIComponent(placeName)}&format=json&limit=1`,
      { headers: { "User-Agent": "DaktentTripPlanner/1.0" } }
    );
    if (!res.ok) return null;
    const data = await res.json();
    if (data.length === 0) return null;
    return [parseFloat(data[0].lat), parseFloat(data[0].lon)];
  } catch {
    return null;
  }
}
