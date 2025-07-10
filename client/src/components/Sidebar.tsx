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
              <a
                className={`flex items-center p-3 rounded-lg transition-colors ${
                  isActive
                    ? "bg-primary bg-opacity-10 text-primary"
                    : "text-gray-700 hover:bg-gray-100"
                }`}
              >
                <item.icon className="mr-3 w-5 h-5" />
                {item.name}
              </a>
            </Link>
          );
        })}
      </nav>

      {/* User Profile */}
      <div className="p-4 border-t border-gray-200">
        <div className="flex items-center space-x-3">
          <img
            src={user?.profileImageUrl || "https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?ixlib=rb-4.0.3&auto=format&fit=crop&w=150&h=150"}
            alt="User Profile"
            className="w-10 h-10 rounded-full object-cover"
          />
          <div className="flex-1">
            <p className="text-sm font-medium text-gray-900">
              {user?.firstName || user?.lastName 
                ? `${user.firstName || ""} ${user.lastName || ""}`.trim()
                : user?.email || "User"}
            </p>
            <p className="text-xs text-gray-500 capitalize">
              {user?.role || "City Planner"}
            </p>
          </div>
          <Button
            variant="ghost"
            size="sm"
            onClick={handleLogout}
            className="text-gray-400 hover:text-gray-600"
          >
            <LogOut className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </aside>
  );
}
