import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { StatsCard } from "@/components/StatsCard";
import { CityMap } from "@/components/CityMap";
import { RecentActivity } from "@/components/RecentActivity";
import { ProjectModal } from "@/components/ProjectModal";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { FolderOpen, Route, Leaf, Map, ArrowRight } from "lucide-react";

export default function Dashboard() {
  const [isProjectModalOpen, setIsProjectModalOpen] = useState(false);

  const { data: stats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const handleNewProject = () => {
    setIsProjectModalOpen(true);
  };

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header
          title="Dashboard Overview"
          subtitle="Welcome back, monitor your city's key metrics and ongoing projects"
          onNewProject={handleNewProject}
        />

        <div className="p-6 space-y-6">
          {/* Stats Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {statsLoading ? (
              [...Array(4)].map((_, i) => (
                <div key={i} className="bg-white p-6 rounded-xl shadow-sm border border-gray-200">
                  <div className="animate-pulse">
                    <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                    <div className="h-8 bg-gray-200 rounded w-1/2 mb-4"></div>
                    <div className="h-3 bg-gray-200 rounded w-full"></div>
                  </div>
                </div>
              ))
            ) : (
              <>
                <StatsCard
                  title="Active Projects"
                  value={stats?.activeProjects || 0}
                  change="+12%"
                  changeType="positive"
                  icon={FolderOpen}
                  iconColor="bg-primary bg-opacity-10 text-primary"
                />
                <StatsCard
                  title="Traffic Efficiency"
                  value={`${stats?.trafficEfficiency || 0}%`}
                  change="+5%"
                  changeType="positive"
                  icon={Route}
                  iconColor="bg-orange-100 text-orange-600"
                />
                <StatsCard
                  title="Environmental Score"
                  value={stats?.environmentalScore || 0}
                  change="+0.3"
                  changeType="positive"
                  icon={Leaf}
                  iconColor="bg-green-100 text-green-600"
                />
                <StatsCard
                  title="Land Use Efficiency"
                  value={`${stats?.landUseEfficiency || 0}%`}
                  change="+2%"
                  changeType="positive"
                  icon={Map}
                  iconColor="bg-purple-100 text-purple-600"
                />
              </>
            )}
          </div>

          {/* Main Grid */}
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
            <CityMap />
            <RecentActivity />
          </div>

          {/* Module Quick Access */}
          <Card>
            <CardHeader>
              <CardTitle>Quick Access Tools</CardTitle>
              <p className="text-sm text-gray-600">Access key planning and simulation tools</p>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-purple-100 p-3 rounded-lg">
                      <Map className="text-purple-600" size={24} />
                    </div>
                    <span className="text-xs bg-green-100 text-green-800 px-2 py-1 rounded">Active</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Land Use Optimization</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Analyze and optimize zoning efficiency with AI-powered recommendations
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">12 active scenarios</span>
                    <Button variant="link" size="sm" className="text-primary p-0">
                      Launch Tool <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-orange-100 p-3 rounded-lg">
                      <Route className="text-orange-600" size={24} />
                    </div>
                    <span className="text-xs bg-blue-100 text-blue-800 px-2 py-1 rounded">Running</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Traffic Flow Simulator</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Simulate traffic patterns and optimize signal timing for better flow
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">3 simulations running</span>
                    <Button variant="link" size="sm" className="text-primary p-0">
                      View Results <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </div>

                <div className="border border-gray-200 rounded-lg p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex items-center justify-between mb-4">
                    <div className="bg-green-100 p-3 rounded-lg">
                      <Leaf className="text-green-600" size={24} />
                    </div>
                    <span className="text-xs bg-yellow-100 text-yellow-800 px-2 py-1 rounded">Updating</span>
                  </div>
                  <h4 className="font-semibold text-gray-900 mb-2">Environmental Impact Assessment</h4>
                  <p className="text-sm text-gray-600 mb-4">
                    Measure sustainability metrics and environmental impact scores
                  </p>
                  <div className="flex items-center justify-between">
                    <span className="text-xs text-gray-500">Score: 8.4/10</span>
                    <Button variant="link" size="sm" className="text-primary p-0">
                      View Details <ArrowRight className="ml-1 w-3 h-3" />
                    </Button>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Analytics Section */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Performance Chart */}
            <Card>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle>Performance Trends</CardTitle>
                  <select className="text-sm border border-gray-300 rounded px-3 py-1">
                    <option>Last 30 days</option>
                    <option>Last 3 months</option>
                    <option>Last year</option>
                  </select>
                </div>
              </CardHeader>
              <CardContent>
                <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                  <div className="text-center">
                    <div className="text-gray-400 text-3xl mb-2">📈</div>
                    <p className="text-sm text-gray-600">Performance Chart</p>
                    <p className="text-xs text-gray-500 mt-1">Chart.js integration for trend visualization</p>
                  </div>
                </div>
              </CardContent>
            </Card>

            {/* Project Status */}
            <Card>
              <CardHeader>
                <CardTitle>Project Status Overview</CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  {projectsLoading ? (
                    [...Array(4)].map((_, i) => (
                      <div key={i} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className="w-3 h-3 bg-gray-200 rounded-full animate-pulse"></div>
                          <div>
                            <div className="h-4 bg-gray-200 rounded w-32 mb-1 animate-pulse"></div>
                            <div className="h-3 bg-gray-100 rounded w-24 animate-pulse"></div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="h-4 bg-gray-200 rounded w-8 mb-1 animate-pulse"></div>
                          <div className="h-3 bg-gray-100 rounded w-16 animate-pulse"></div>
                        </div>
                      </div>
                    ))
                  ) : projects?.length === 0 ? (
                    <div className="text-center py-8">
                      <p className="text-gray-500">No projects yet</p>
                      <Button 
                        onClick={handleNewProject} 
                        variant="outline" 
                        size="sm" 
                        className="mt-2"
                      >
                        Create your first project
                      </Button>
                    </div>
                  ) : (
                    projects?.slice(0, 4).map((project: any) => (
                      <div key={project.id} className="flex items-center justify-between">
                        <div className="flex items-center space-x-3">
                          <div className={`w-3 h-3 rounded-full ${
                            project.status === 'completed' ? 'bg-green-500' :
                            project.status === 'active' ? 'bg-blue-500' :
                            'bg-yellow-500'
                          }`}></div>
                          <div>
                            <p className="text-sm font-medium text-gray-900">{project.name}</p>
                            <p className="text-xs text-gray-600 capitalize">{project.type.replace('_', ' ')}</p>
                          </div>
                        </div>
                        <div className="text-right">
                          <p className="text-sm font-medium text-gray-900">{project.progress}%</p>
                          <p className="text-xs text-gray-600">
                            {new Date(project.updatedAt).toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </CardContent>
            </Card>
          </div>
        </div>
      </main>

      <ProjectModal
        isOpen={isProjectModalOpen}
        onClose={() => setIsProjectModalOpen(false)}
      />
    </div>
  );
}
