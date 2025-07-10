import { useEffect, useRef } from "react";
import { Button } from "@/components/ui/button";
import { Layers, Expand } from "lucide-react";

export function CityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Initialize Leaflet map
    const L = (window as any).L;
    if (!L) return;

    const map = L.map(mapRef.current).setView([40.7128, -74.0060], 13);
    
    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      attribution: '© OpenStreetMap contributors'
    }).addTo(map);

    // Add sample markers
    const downtownMarker = L.marker([40.7128, -74.0060])
      .addTo(map)
      .bindPopup('Downtown District');
    
    const greenZoneMarker = L.marker([40.7200, -74.0100])
      .addTo(map)
      .bindPopup('Green Zone');
    
    const trafficHubMarker = L.marker([40.7080, -74.0020])
      .addTo(map)
      .bindPopup('Traffic Hub');

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  return (
    <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <h3 className="text-lg font-semibold text-gray-900">City Overview Map</h3>
          <div className="flex items-center space-x-2">
            <Button variant="ghost" size="sm">
              <Layers className="mr-1 w-4 h-4" />
              Layers
            </Button>
            <Button variant="ghost" size="sm">
              <Expand className="mr-1 w-4 h-4" />
              Fullscreen
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div ref={mapRef} className="h-80 rounded-lg bg-gray-100"></div>
      </div>
    </div>
  );
}
