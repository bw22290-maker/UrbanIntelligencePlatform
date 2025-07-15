import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Map, Route, Leaf, FolderOpen, Clock, Activity, CheckCircle, AlertCircle, Plus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { apiRequest } from "@/lib/queryClient";

const activityIcons = {
  project: FolderOpen,
  zone: Map,
  traffic_node: Route,
  environmental_metric: Leaf,
};

export function RecentActivity() {
  const queryClient = useQueryClient();
  
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
    refetchInterval: 30000, // Refresh every 30 seconds for real-time updates
  });

  const createSampleActivity = useMutation({
    mutationFn: async () => {
      const sampleActivities = [
        {
          action: "created",
          entityType: "project",
          description: "New downtown development project initiated",
        },
        {
          action: "updated",
          entityType: "zone",
          description: "Residential zoning efficiency improved to 94%",
        },
        {
          action: "analyzed",
          entityType: "traffic_node",
          description: "Traffic flow optimization at Main St intersection",
        },
        {
          action: "monitored",
          entityType: "environmental_metric",
          description: "Air quality reading: Good (AQI: 45)",
        },
      ];
      
      const randomActivity = sampleActivities[Math.floor(Math.random() * sampleActivities.length)];
      return await apiRequest("/api/dashboard/activities", "POST", randomActivity);
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ["/api/dashboard/activities"] });
    },
  });

  const getActivityPriority = (activity: any) => {
    const priorities = {
      project: "high",
      environmental_metric: "medium",
      traffic_node: "medium",
      zone: "low"
    };
    return priorities[activity.entityType as keyof typeof priorities] || "low";
  };

  const getPriorityColor = (priority: string) => {
    switch (priority) {
      case "high": return "bg-red-100 text-red-700";
      case "medium": return "bg-yellow-100 text-yellow-700";
      case "low": return "bg-green-100 text-green-700";
      default: return "bg-gray-100 text-gray-700";
    }
  };

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
            <div className="flex items-center space-x-2">
              <div className="animate-pulse bg-gray-200 h-6 w-6 rounded"></div>
              <div className="animate-pulse bg-gray-200 h-4 w-16 rounded"></div>
            </div>
          </div>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(5)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="bg-gray-200 p-2 rounded-lg animate-pulse">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
                <div className="h-5 bg-gray-200 rounded animate-pulse w-12"></div>
              </div>
            ))}
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-xl shadow-sm border border-gray-200">
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <Activity className="w-5 h-5 text-blue-600" />
            <h3 className="text-lg font-semibold text-gray-900">Live Activity Feed</h3>
          </div>
          <div className="flex items-center space-x-2">
            <div className="flex items-center space-x-1">
              <div className="w-2 h-2 bg-green-500 rounded-full animate-pulse"></div>
              <span className="text-xs text-green-600 font-medium">Live</span>
            </div>
            <Button 
              variant="ghost" 
              size="sm"
              onClick={() => createSampleActivity.mutate()}
              disabled={createSampleActivity.isPending}
            >
              <Plus className="w-4 h-4 mr-1" />
              Add Activity
            </Button>
          </div>
        </div>
      </div>
      <div className="p-6">
        <div className="space-y-4 max-h-96 overflow-y-auto">
          {activities?.length === 0 ? (
            <div className="text-center py-8">
              <div className="w-12 h-12 mx-auto bg-gray-100 rounded-full flex items-center justify-center mb-4">
                <Clock className="w-6 h-6 text-gray-400" />
              </div>
              <p className="text-gray-500 font-medium">No recent activity</p>
              <p className="text-sm text-gray-400 mt-1">Your activities will appear here</p>
              <Button 
                variant="outline" 
                size="sm" 
                className="mt-4"
                onClick={() => createSampleActivity.mutate()}
              >
                Create Sample Activity
              </Button>
            </div>
          ) : (
            activities?.map((activity: any) => {
              const Icon = activityIcons[activity.entityType as keyof typeof activityIcons] || FolderOpen;
              const iconColor = {
                project: "bg-blue-100 text-blue-600",
                zone: "bg-purple-100 text-purple-600",
                traffic_node: "bg-orange-100 text-orange-600",
                environmental_metric: "bg-green-100 text-green-600",
              }[activity.entityType] || "bg-gray-100 text-gray-600";
              
              const priority = getActivityPriority(activity);
              const priorityColor = getPriorityColor(priority);

              return (
                <div key={activity.id} className="flex items-start space-x-3 p-3 hover:bg-gray-50 rounded-lg transition-colors group">
                  <div className={`p-2 rounded-lg ${iconColor} group-hover:scale-110 transition-transform`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <div className="flex items-center justify-between">
                      <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                      <Badge variant="outline" className={`text-xs ${priorityColor}`}>
                        {priority}
                      </Badge>
                    </div>
                    <div className="flex items-center space-x-2 mt-1">
                      <p className="text-xs text-gray-500">
                        {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                      </p>
                      <span className="text-xs text-gray-300">•</span>
                      <p className="text-xs text-gray-500 capitalize">{activity.action}</p>
                      <span className="text-xs text-gray-300">•</span>
                      <p className="text-xs text-gray-500 capitalize">{activity.entityType.replace('_', ' ')}</p>
                    </div>
                  </div>
                  <div className="flex items-center space-x-1 opacity-0 group-hover:opacity-100 transition-opacity">
                    <CheckCircle className="w-4 h-4 text-green-500" />
                  </div>
                </div>
              );
            })
          )}
        </div>
        <div className="mt-4 pt-4 border-t border-gray-200">
          <div className="flex items-center justify-between text-sm text-gray-600">
            <div className="flex items-center space-x-2">
              <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
              <span>Auto-refresh enabled</span>
            </div>
            <div>
              {activities?.length || 0} activities tracked
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
