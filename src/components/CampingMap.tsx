import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CampingSpot } from "@/data/campingSpots";
import { Droplets, Flame, Zap, Bath, Star, Shield } from "lucide-react";

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

const facilityIcon: Record<string, React.ReactNode> = {
  water: <Droplets className="h-3.5 w-3.5 text-primary" />,
  fire: <Flame className="h-3.5 w-3.5 text-accent" />,
  electricity: <Zap className="h-3.5 w-3.5 text-accent" />,
  toilet: <Bath className="h-3.5 w-3.5 text-secondary" />,
};

function FitBounds({ spots }: { spots: CampingSpot[] }) {
  const map = useMap();
  useEffect(() => {
    if (spots.length > 0) {
      const bounds = L.latLngBounds(spots.map(s => [s.lat, s.lng]));
      map.fitBounds(bounds, { padding: [40, 40] });
    }
  }, [spots, map]);
  return null;
}

interface CampingMapProps {
  spots: CampingSpot[];
}

const CampingMap = ({ spots }: CampingMapProps) => (
  <div className="overflow-hidden rounded-lg border border-border shadow-card">
    <MapContainer center={[51.5, 5.5]} zoom={6} className="h-[380px] w-full md:h-[460px]" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds spots={spots} />
      {spots.map(spot => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={spot.type === "free" ? freeIcon : paidIcon}>
          <Popup maxWidth={240}>
            <div className="space-y-1.5 text-xs">
              <h3 className="text-sm font-semibold">{spot.name}</h3>
              <div className="flex items-center gap-2">
                <span className={`rounded px-1.5 py-0.5 text-[11px] font-medium ${spot.type === "free" ? "bg-green-50 text-green-700" : "bg-blue-50 text-blue-700"}`}>
                  {spot.type === "free" ? "Gratis" : `€${spot.pricePerNight}/nacht`}
                </span>
                <span className="flex items-center gap-0.5 text-muted-foreground"><Star className="h-3 w-3 fill-amber-400 text-amber-400" /> {spot.rating}</span>
              </div>
              <p className="text-muted-foreground leading-relaxed">{spot.description}</p>
              <div className="flex gap-1.5">{spot.facilities.map(f => <span key={f} title={f}>{facilityIcon[f]}</span>)}</div>
              <div className="flex items-center gap-1 text-muted-foreground">
                <Shield className="h-3 w-3" /> {spot.legalStatus}
              </div>
              {spot.daktentFriendly && (
                <span className="inline-block rounded bg-green-50 px-1.5 py-0.5 text-[11px] font-medium text-green-700">
                  Daktent vriendelijk
                </span>
              )}
            </div>
          </Popup>
        </Marker>
      ))}
    </MapContainer>
  </div>
);

export default CampingMap;
