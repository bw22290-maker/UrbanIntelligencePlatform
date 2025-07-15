import { useEffect, useRef, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Button } from "@/components/ui/button";
import { Layers, Expand, MapPin, Route, Leaf, Building2, Navigation } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export function CityMap() {
  const mapRef = useRef<HTMLDivElement>(null);
  const mapInstanceRef = useRef<any>(null);
  const [activeLayer, setActiveLayer] = useState("all");
  const [isFullscreen, setIsFullscreen] = useState(false);

  const { data: projects } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: zones } = useQuery({
    queryKey: ["/api/land-use/zones"],
  });

  const { data: trafficNodes } = useQuery({
    queryKey: ["/api/traffic/nodes"],
  });

  useEffect(() => {
    if (!mapRef.current || mapInstanceRef.current) return;

    // Create interactive map without external dependencies
    const mapContainer = mapRef.current;
    
    // Create SVG-based map with interactive elements
    const svg = document.createElementNS("http://www.w3.org/2000/svg", "svg");
    svg.setAttribute("width", "100%");
    svg.setAttribute("height", "100%");
    svg.setAttribute("viewBox", "0 0 800 600");
    svg.className = "w-full h-full";

    // Add city grid background
    const defs = document.createElementNS("http://www.w3.org/2000/svg", "defs");
    const pattern = document.createElementNS("http://www.w3.org/2000/svg", "pattern");
    pattern.setAttribute("id", "grid");
    pattern.setAttribute("width", "40");
    pattern.setAttribute("height", "40");
    pattern.setAttribute("patternUnits", "userSpaceOnUse");
    
    const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
    path.setAttribute("d", "M 40 0 L 0 0 0 40");
    path.setAttribute("fill", "none");
    path.setAttribute("stroke", "#e5e7eb");
    path.setAttribute("stroke-width", "1");
    
    pattern.appendChild(path);
    defs.appendChild(pattern);
    svg.appendChild(defs);

    // Background with grid
    const background = document.createElementNS("http://www.w3.org/2000/svg", "rect");
    background.setAttribute("width", "800");
    background.setAttribute("height", "600");
    background.setAttribute("fill", "#f8fafc");
    background.setAttribute("stroke", "url(#grid)");
    svg.appendChild(background);

    // Add city districts
    const districts = [
      { name: "Downtown", x: 200, y: 200, width: 180, height: 120, color: "#3b82f6" },
      { name: "Residential", x: 400, y: 150, width: 160, height: 140, color: "#10b981" },
      { name: "Industrial", x: 100, y: 350, width: 200, height: 100, color: "#f59e0b" },
      { name: "Parks & Recreation", x: 450, y: 350, width: 200, height: 180, color: "#22c55e" },
    ];

    districts.forEach(district => {
      const rect = document.createElementNS("http://www.w3.org/2000/svg", "rect");
      rect.setAttribute("x", district.x.toString());
      rect.setAttribute("y", district.y.toString());
      rect.setAttribute("width", district.width.toString());
      rect.setAttribute("height", district.height.toString());
      rect.setAttribute("fill", district.color);
      rect.setAttribute("fill-opacity", "0.2");
      rect.setAttribute("stroke", district.color);
      rect.setAttribute("stroke-width", "2");
      rect.setAttribute("rx", "8");
      rect.className = "cursor-pointer hover:fill-opacity-30 transition-all";
      
      rect.addEventListener("click", () => {
        alert(`${district.name} District - View detailed analysis`);
      });
      
      svg.appendChild(rect);

      // Add district labels
      const text = document.createElementNS("http://www.w3.org/2000/svg", "text");
      text.setAttribute("x", (district.x + district.width/2).toString());
      text.setAttribute("y", (district.y + district.height/2).toString());
      text.setAttribute("text-anchor", "middle");
      text.setAttribute("dominant-baseline", "middle");
      text.setAttribute("font-size", "12");
      text.setAttribute("font-weight", "600");
      text.setAttribute("fill", district.color);
      text.textContent = district.name;
      svg.appendChild(text);
    });

    // Add traffic routes
    const routes = [
      { path: "M 100 250 Q 300 200 500 250", color: "#ef4444" },
      { path: "M 200 100 Q 400 300 600 200", color: "#f97316" },
      { path: "M 50 400 Q 400 350 750 400", color: "#3b82f6" },
    ];

    routes.forEach(route => {
      const path = document.createElementNS("http://www.w3.org/2000/svg", "path");
      path.setAttribute("d", route.path);
      path.setAttribute("stroke", route.color);
      path.setAttribute("stroke-width", "3");
      path.setAttribute("fill", "none");
      path.setAttribute("stroke-dasharray", "10,5");
      path.className = "animate-pulse";
      svg.appendChild(path);
    });

    // Add interactive markers
    const markers = [
      { x: 250, y: 180, type: "project", label: "New Development" },
      { x: 480, y: 220, type: "traffic", label: "Traffic Hub" },
      { x: 520, y: 420, type: "environmental", label: "Air Quality Monitor" },
      { x: 150, y: 380, type: "zone", label: "Zoning Update" },
    ];

    markers.forEach(marker => {
      const circle = document.createElementNS("http://www.w3.org/2000/svg", "circle");
      circle.setAttribute("cx", marker.x.toString());
      circle.setAttribute("cy", marker.y.toString());
      circle.setAttribute("r", "8");
      circle.setAttribute("fill", getMarkerColor(marker.type));
      circle.setAttribute("stroke", "#ffffff");
      circle.setAttribute("stroke-width", "2");
      circle.className = "cursor-pointer hover:r-10 transition-all animate-pulse";
      
      circle.addEventListener("click", () => {
        alert(`${marker.label} - Click to view details`);
      });
      
      svg.appendChild(circle);
    });

    mapContainer.appendChild(svg);
    mapInstanceRef.current = svg;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, []);

  const getMarkerColor = (type: string) => {
    switch (type) {
      case "project": return "#3b82f6";
      case "traffic": return "#f97316";
      case "environmental": return "#22c55e";
      case "zone": return "#8b5cf6";
      default: return "#6b7280";
    }
  };

  const toggleFullscreen = () => {
    setIsFullscreen(!isFullscreen);
  };

  const layerOptions = [
    { id: "all", label: "All Layers", icon: Layers },
    { id: "projects", label: "Projects", icon: Building2 },
    { id: "traffic", label: "Traffic", icon: Route },
    { id: "environmental", label: "Environmental", icon: Leaf },
    { id: "zones", label: "Land Use", icon: MapPin },
  ];

  return (
    <div className={`lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-200 ${isFullscreen ? 'fixed inset-0 z-50' : ''}`}>
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Interactive City Map</h3>
            <p className="text-sm text-gray-600">Real-time urban planning visualization</p>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              {layerOptions.map(layer => (
                <Button
                  key={layer.id}
                  variant={activeLayer === layer.id ? "default" : "ghost"}
                  size="sm"
                  onClick={() => setActiveLayer(layer.id)}
                  className="text-xs"
                >
                  <layer.icon className="w-3 h-3 mr-1" />
                  {layer.label}
                </Button>
              ))}
            </div>
            <Button variant="ghost" size="sm" onClick={toggleFullscreen}>
              <Expand className="w-4 h-4 mr-1" />
              {isFullscreen ? 'Exit' : 'Fullscreen'}
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="flex items-center justify-between mb-4">
          <div className="flex items-center space-x-4">
            <Badge variant="outline" className="text-blue-600">
              <MapPin className="w-3 h-3 mr-1" />
              4 Active Projects
            </Badge>
            <Badge variant="outline" className="text-green-600">
              <Navigation className="w-3 h-3 mr-1" />
              Real-time Data
            </Badge>
          </div>
          <div className="text-sm text-gray-500">
            Last updated: {new Date().toLocaleTimeString()}
          </div>
        </div>
        <div ref={mapRef} className={`${isFullscreen ? 'h-screen' : 'h-96'} rounded-lg bg-gradient-to-br from-blue-50 to-green-50 border-2 border-gray-200`}></div>
        <div className="mt-4 flex items-center justify-between text-sm text-gray-600">
          <div>Click on districts and markers for detailed information</div>
          <div>Powered by Urban Intelligence Platform</div>
        </div>
      </div>
    </div>
  );
}
