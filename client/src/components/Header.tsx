import { Button } from "@/components/ui/button";
import { Plus, Bell } from "lucide-react";

interface HeaderProps {
  title: string;
  subtitle?: string;
  onNewProject?: () => void;
}

export function Header({ title, subtitle, onNewProject }: HeaderProps) {
  return (
    <header className="bg-white shadow-sm border-b border-gray-200 p-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">{title}</h2>
          {subtitle && (
            <p className="text-gray-600 mt-1">{subtitle}</p>
          )}
        </div>
        <div className="flex items-center space-x-4">
          {onNewProject && (
            <Button onClick={onNewProject} className="bg-primary hover:bg-blue-700">
              <Plus className="mr-2 w-4 h-4" />
              New Project
            </Button>
          )}
          <Button variant="outline" size="sm">
            <Bell className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </header>
  );
}
