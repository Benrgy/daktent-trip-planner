import { useEffect } from "react";
import { MapContainer, TileLayer, Marker, Popup, useMap } from "react-leaflet";
import L from "leaflet";
import "leaflet/dist/leaflet.css";
import { CampingSpot } from "@/data/campingSpots";
import { Droplets, Flame, Zap, Bath, Star, Shield } from "lucide-react";

// Fix default marker icons
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
  water: <Droplets className="h-4 w-4 text-primary" />,
  fire: <Flame className="h-4 w-4 text-accent" />,
  electricity: <Zap className="h-4 w-4 text-accent" />,
  toilet: <Bath className="h-4 w-4 text-secondary" />,
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
  <div className="overflow-hidden rounded-2xl border border-border shadow-card">
    <MapContainer center={[51.5, 5.5]} zoom={6} className="h-[400px] w-full md:h-[500px]" scrollWheelZoom={false}>
      <TileLayer
        attribution='&copy; <a href="https://www.openstreetmap.org/copyright">OpenStreetMap</a>'
        url="https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png"
      />
      <FitBounds spots={spots} />
      {spots.map(spot => (
        <Marker key={spot.id} position={[spot.lat, spot.lng]} icon={spot.type === "free" ? freeIcon : paidIcon}>
          <Popup maxWidth={260}>
            <div className="space-y-2 p-1">
              <h3 className="text-base font-bold">{spot.name}</h3>
              <div className="flex items-center gap-2 text-xs">
                <span className={`rounded-full px-2 py-0.5 font-semibold ${spot.type === "free" ? "bg-green-100 text-green-700" : "bg-blue-100 text-blue-700"}`}>
                  {spot.type === "free" ? "Gratis" : `€${spot.pricePerNight}/nacht`}
                </span>
                <span className="flex items-center gap-0.5"><Star className="h-3 w-3 fill-yellow-400 text-yellow-400" /> {spot.rating}</span>
              </div>
              <p className="text-xs text-gray-600">{spot.description}</p>
              <div className="flex gap-2">{spot.facilities.map(f => <span key={f} title={f}>{facilityIcon[f]}</span>)}</div>
              <div className="flex items-center gap-1 text-xs text-gray-500">
                <Shield className="h-3 w-3" /> {spot.legalStatus}
              </div>
              {spot.daktentFriendly && (
                <span className="inline-block rounded-full bg-green-100 px-2 py-0.5 text-xs font-semibold text-green-700">
                  ✅ Daktent vriendelijk
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
