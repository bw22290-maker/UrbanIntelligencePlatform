import { Link, useLocation } from "wouter";
import { useAuth } from "@/hooks/useAuth";
import { 
  LayoutDashboard, 
  Map, 
  Route, 
  Leaf, 
  FolderOpen, 
  BarChart3, 
  Settings,
  LogOut,
  Building2
} from "lucide-react";
import { Button } from "@/components/ui/button";

const navigation = [
  { name: "Dashboard", href: "/", icon: LayoutDashboard },
  { name: "Land Use Optimization", href: "/land-use", icon: Map },
  { name: "Traffic Flow Simulator", href: "/traffic", icon: Route },
  { name: "Environmental Impact", href: "/environmental", icon: Leaf },
  { name: "Project Management", href: "/projects", icon: FolderOpen },
  { name: "Reports & Analytics", href: "/reports", icon: BarChart3 },
  { name: "Administration", href: "/admin", icon: Settings },
];

export function Sidebar() {
  const [location] = useLocation();
  const { user } = useAuth();

  const handleLogout = () => {
    window.location.href = "/api/logout";
  };

  return (
    <aside className="w-64 bg-white shadow-lg border-r border-gray-200 flex flex-col">
      {/* Logo */}
      <div className="p-6 border-b border-gray-200">
        <h1 className="text-xl font-bold text-gray-900 flex items-center">
          <Building2 className="text-primary mr-2" size={24} />
          Urban Intelligence
        </h1>
        <p className="text-sm text-gray-600 mt-1">City Planning Platform</p>
      </div>

      {/* Navigation */}
      <nav className="flex-1 p-4 space-y-2">
        {navigation.map((item) => {
          const isActive = location === item.href;
          return (
            <Link key={item.name} href={item.href}>
              <div
                className={`flex items-center p-3 rounded-lg transition-colors cursor-pointer ${
                  isActive
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
              </div>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
            alt="Brian Mutunga"
            className="w-10 h-10 rounded-full object-cover border-2 border-blue-200"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">Brian Mutunga</p>
            <p className="text-xs text-gray-500">Senior Urban Planner</p>
          </div>
          <div className="flex items-center space-x-1">
            <div className="w-2 h-2 bg-green-500 rounded-full"></div>
            <span className="text-xs text-green-600">Online</span>
          </div>
        </div>
        <div className="mt-3">
          <div className="flex items-center justify-between text-xs text-gray-600 mb-2">
            <span>Monthly Progress</span>
            <span>87%</span>
          </div>
          <div className="w-full bg-gray-200 rounded-full h-2">
            <div className="bg-blue-600 h-2 rounded-full" style={{ width: '87%' }}></div>
          </div>
        </div>
        <Button 
          variant="ghost" 
          size="sm" 
          className="w-full mt-3 text-left justify-start"
          onClick={handleLogout}
        >
          <LogOut className="mr-2 w-4 h-4" />
          Sign Out
        </Button>
      </div>
    </aside>
  );
}
