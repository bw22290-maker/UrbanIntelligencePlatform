import { useQuery } from "@tanstack/react-query";
import { formatDistanceToNow } from "date-fns";
import { Map, Route, Leaf, FolderOpen } from "lucide-react";

const activityIcons = {
  project: FolderOpen,
  zone: Map,
  traffic_node: Route,
  environmental_metric: Leaf,
};

export function RecentActivity() {
  const { data: activities, isLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
  });

  if (isLoading) {
    return (
      <div className="bg-white rounded-xl shadow-sm border border-gray-200">
        <div className="p-6 border-b border-gray-200">
          <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
        </div>
        <div className="p-6">
          <div className="space-y-4">
            {[...Array(4)].map((_, i) => (
              <div key={i} className="flex items-start space-x-3">
                <div className="bg-gray-200 p-2 rounded-lg animate-pulse">
                  <div className="w-4 h-4 bg-gray-300 rounded"></div>
                </div>
                <div className="flex-1">
                  <div className="h-4 bg-gray-200 rounded animate-pulse mb-2"></div>
                  <div className="h-3 bg-gray-100 rounded animate-pulse w-2/3"></div>
                </div>
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
        <h3 className="text-lg font-semibold text-gray-900">Recent Activity</h3>
      </div>
      <div className="p-6">
        <div className="space-y-4">
          {activities?.length === 0 ? (
            <div className="text-center py-8">
              <p className="text-gray-500">No recent activity</p>
            </div>
          ) : (
            activities?.map((activity: any) => {
              const Icon = activityIcons[activity.entityType as keyof typeof activityIcons] || FolderOpen;
              const iconColor = {
                project: "bg-primary bg-opacity-10 text-primary",
                zone: "bg-purple-100 text-purple-600",
                traffic_node: "bg-orange-100 text-orange-600",
                environmental_metric: "bg-green-100 text-green-600",
              }[activity.entityType] || "bg-gray-100 text-gray-600";

              return (
                <div key={activity.id} className="flex items-start space-x-3">
                  <div className={`p-2 rounded-lg ${iconColor}`}>
                    <Icon className="w-4 h-4" />
                  </div>
                  <div className="flex-1">
                    <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                    <p className="text-xs text-gray-500 mt-1">
                      {formatDistanceToNow(new Date(activity.createdAt), { addSuffix: true })}
                    </p>
                  </div>
                </div>
              );
            })
          )}
        </div>
      </div>
    </div>
  );
}
