import { useEffect, useRef } from "react";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CampingSpot } from "@/data/campingSpots";

delete (L.Icon.Default.prototype as any)._getIconUrl;
L.Icon.Default.mergeOptions({
  iconRetinaUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon-2x.png",
  iconUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-icon.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
});

const freeIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-green.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

const paidIcon = new L.Icon({
  iconUrl: "https://raw.githubusercontent.com/pointhi/leaflet-color-markers/master/img/marker-icon-blue.png",
  shadowUrl: "https://cdnjs.cloudflare.com/ajax/libs/leaflet/1.9.4/images/marker-shadow.png",
  iconSize: [25, 41],
  iconAnchor: [12, 41],
  popupAnchor: [1, -34],
});

function buildPopupHtml(spot: CampingSpot): string {
  const priceLabel = spot.type === "free"
    ? '<span style="background:#f0fdf4;color:#15803d;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:500">Gratis</span>'
    : `<span style="background:#eff6ff;color:#1d4ed8;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:500">€${spot.pricePerNight}/nacht</span>`;

  const facilities = spot.facilities.map(f => {
    const icons: Record<string, string> = { water: "💧", fire: "🔥", electricity: "⚡", toilet: "🚿" };
    return icons[f] || f;
  }).join(" ");

  const daktent = spot.daktentFriendly
    ? '<div style="margin-top:4px"><span style="background:#f0fdf4;color:#15803d;padding:2px 6px;border-radius:4px;font-size:11px;font-weight:500">Daktent vriendelijk</span></div>'
    : '';

  return `
    <div style="font-size:12px;line-height:1.5;max-width:220px">
      <h3 style="font-size:14px;font-weight:600;margin:0 0 4px">${spot.name}</h3>
      <div style="display:flex;align-items:center;gap:8px;margin-bottom:4px">
        ${priceLabel}
        <span style="color:#92400e">⭐ ${spot.rating}</span>
      </div>
      <p style="color:#6b7280;margin:0 0 4px">${spot.description}</p>
      <div style="margin-bottom:4px">${facilities}</div>
      <div style="color:#6b7280;font-size:11px">🛡️ ${spot.legalStatus}</div>
      ${daktent}
    </div>
  `;
}

interface CampingMapProps {
  spots: CampingSpot[];
  routeGeometry?: [number, number][];
}

const CampingMap = ({ spots, routeGeometry }: CampingMapProps) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const mapRef = useRef<L.Map | null>(null);
  const markersRef = useRef<L.LayerGroup | null>(null);
  const routeLayerRef = useRef<L.Polyline | null>(null);

  // Initialize map once
  useEffect(() => {
    if (!containerRef.current || mapRef.current) return;

    const map = L.map(containerRef.current, {
      center: [51.5, 5.5],
      zoom: 6,
      scrollWheelZoom: false,
    });

    L.tileLayer("https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png", {
      attribution: '&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>',
    }).addTo(map);

    markersRef.current = L.layerGroup().addTo(map);
    mapRef.current = map;

    return () => {
      map.remove();
      mapRef.current = null;
      markersRef.current = null;
    };
  }, []);

  // Update markers when spots change
  useEffect(() => {
    const map = mapRef.current;
    const markers = markersRef.current;
    if (!map || !markers) return;

    markers.clearLayers();

    spots.forEach(spot => {
      const marker = L.marker([spot.lat, spot.lng], {
        icon: spot.type === "free" ? freeIcon : paidIcon,
      });
      marker.bindPopup(buildPopupHtml(spot), { maxWidth: 240 });
      markers.addLayer(marker);
    });

    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [spots]);

  // Draw route polyline
  useEffect(() => {
    const map = mapRef.current;
    if (!map) return;

    if (routeLayerRef.current) {
      map.removeLayer(routeLayerRef.current);
      routeLayerRef.current = null;
    }

    if (routeGeometry && routeGeometry.length > 1) {
      const polyline = L.polyline(routeGeometry, {
        color: "#2563eb",
        weight: 3,
        opacity: 0.7,
        dashArray: "8 4",
      }).addTo(map);
      routeLayerRef.current = polyline;
    }
  }, [routeGeometry]);

  return (
    <div className="overflow-hidden rounded-lg border border-border shadow-card">
      <div ref={containerRef} className="h-[380px] w-full md:h-[460px]" />
    </div>
  );
};

export default CampingMap;
