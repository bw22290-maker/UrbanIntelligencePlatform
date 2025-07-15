import { Switch, Route } from "wouter";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { useAuth } from "@/hooks/useAuth";
import { useEffect } from "react";

import NotFound from "@/pages/not-found";
import Landing from "@/pages/Landing";
import Dashboard from "@/pages/Dashboard";
import LandUseOptimization from "@/pages/LandUseOptimization";
import TrafficSimulator from "@/pages/TrafficSimulator";
import EnvironmentalImpact from "@/pages/EnvironmentalImpact";
import ProjectManagement from "@/pages/ProjectManagement";
import ReportsAnalytics from "@/pages/ReportsAnalytics";
import Administration from "@/pages/Administration";

function Router() {
  const { isAuthenticated, isLoading } = useAuth();

  // Show loading while checking authentication
  if (isLoading) {
    return (
      <div className="min-h-screen flex items-center justify-center bg-gray-50">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4"></div>
          <p className="text-gray-600">Loading Urban Intelligence Platform...</p>
        </div>
      </div>
    );
  }

  // If not authenticated, show landing page
  if (!isAuthenticated) {
    return (
      <Switch>
        <Route path="/" component={Landing} />
        <Route component={Landing} />
      </Switch>
    );
  }

  // If authenticated, show dashboard and other pages
  return (
    <Switch>
      <Route path="/" component={Dashboard} />
      <Route path="/land-use" component={LandUseOptimization} />
      <Route path="/traffic" component={TrafficSimulator} />
      <Route path="/environmental" component={EnvironmentalImpact} />
      <Route path="/projects" component={ProjectManagement} />
      <Route path="/reports" component={ReportsAnalytics} />
      <Route path="/admin" component={Administration} />
      <Route component={NotFound} />
    </Switch>
  );
}

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <TooltipProvider>
        <Toaster />
        <Router />
      </TooltipProvider>
    </QueryClientProvider>
  );
}

export default App;
