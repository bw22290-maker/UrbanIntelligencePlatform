import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Progress } from "@/components/ui/progress";
import { BarChart3, TrendingUp, Download, Filter, Calendar, MapPin, Route, Leaf, FolderOpen, PieChart, LineChart } from "lucide-react";

export default function ReportsAnalytics() {
  const [selectedTimeRange, setSelectedTimeRange] = useState("last_30_days");
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: ["/api/dashboard/stats"],
  });

  const { data: activities, isLoading: activitiesLoading } = useQuery({
    queryKey: ["/api/dashboard/activities"],
  });

  const getProjectTypeStats = () => {
    if (!projects) return {};
    
    const stats = projects.reduce((acc: any, project: any) => {
      acc[project.type] = (acc[project.type] || 0) + 1;
      return acc;
    }, {});
    
    return stats;
  };

  const getProjectStatusStats = () => {
    if (!projects) return {};
    
    const stats = projects.reduce((acc: any, project: any) => {
      acc[project.status] = (acc[project.status] || 0) + 1;
      return acc;
    }, {});
    
    return stats;
  };

  const getAverageProgress = () => {
    if (!projects || projects.length === 0) return 0;
    
    const totalProgress = projects.reduce((sum: number, project: any) => sum + (project.progress || 0), 0);
    return Math.round(totalProgress / projects.length);
  };

  const typeStats = getProjectTypeStats();
  const statusStats = getProjectStatusStats();
  const avgProgress = getAverageProgress();

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header
          title="Reports & Analytics"
          subtitle="Comprehensive analysis and insights for urban planning decisions"
        />

        <div className="p-6 space-y-6">
          {/* Controls */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Filter className="mr-2" size={20} />
                Report Configuration
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex flex-wrap gap-4">
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Time Range
                  </label>
                  <Select value={selectedTimeRange} onValueChange={setSelectedTimeRange}>
                    <SelectTrigger>
                      <SelectValue placeholder="Select time range" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="last_7_days">Last 7 days</SelectItem>
                      <SelectItem value="last_30_days">Last 30 days</SelectItem>
                      <SelectItem value="last_3_months">Last 3 months</SelectItem>
                      <SelectItem value="last_6_months">Last 6 months</SelectItem>
                      <SelectItem value="last_year">Last year</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex-1 min-w-48">
                  <label className="block text-sm font-medium text-gray-700 mb-2">
                    Project Filter
                  </label>
                  <Select value={selectedProject?.toString() || "all"} onValueChange={(value) => setSelectedProject(value === "all" ? null : parseInt(value))}>
                    <SelectTrigger>
                      <SelectValue placeholder="All projects" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="all">All Projects</SelectItem>
                      {projects?.map((project: any) => (
                        <SelectItem key={project.id} value={project.id.toString()}>
                          {project.name}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
                <div className="flex items-end">
                  <Button>
                    <Download className="mr-2 w-4 h-4" />
                    Export Report
                  </Button>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Key Performance Indicators */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Total Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{projects?.length || 0}</p>
                  </div>
                  <div className="bg-blue-100 p-3 rounded-lg">
                    <FolderOpen className="w-6 h-6 text-blue-600" />
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <TrendingUp className="w-4 h-4 text-green-500 mr-1" />
                  <span className="text-green-500 font-medium">+12%</span>
                  <span className="text-gray-600 ml-2">from last period</span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Average Progress</p>
                    <p className="text-2xl font-bold text-gray-900">{avgProgress}%</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <BarChart3 className="w-6 h-6 text-green-600" />
                  </div>
                </div>
                <div className="mt-4">
                  <Progress value={avgProgress} className="h-2" />
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Active Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{statusStats.active || 0}</p>
                  </div>
                  <div className="bg-orange-100 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-orange-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">
                    {Math.round(((statusStats.active || 0) / (projects?.length || 1)) * 100)}% of total
                  </span>
                </div>
              </CardContent>
            </Card>

            <Card>
              <CardContent className="p-6">
                <div className="flex items-center justify-between">
                  <div>
                    <p className="text-sm text-gray-600">Completed Projects</p>
                    <p className="text-2xl font-bold text-gray-900">{statusStats.completed || 0}</p>
                  </div>
                  <div className="bg-green-100 p-3 rounded-lg">
                    <div className="w-6 h-6 bg-green-500 rounded-full flex items-center justify-center">
                      <div className="w-3 h-3 bg-white rounded-full"></div>
                    </div>
                  </div>
                </div>
                <div className="mt-4 flex items-center text-sm">
                  <span className="text-gray-600">
                    {Math.round(((statusStats.completed || 0) / (projects?.length || 1)) * 100)}% completion rate
                  </span>
                </div>
              </CardContent>
            </Card>
          </div>

          {/* Main Analytics */}
          <Tabs defaultValue="overview" className="w-full">
            <TabsList className="grid w-full grid-cols-4">
              <TabsTrigger value="overview">Overview</TabsTrigger>
              <TabsTrigger value="projects">Projects</TabsTrigger>
              <TabsTrigger value="performance">Performance</TabsTrigger>
              <TabsTrigger value="sustainability">Sustainability</TabsTrigger>
            </TabsList>

            <TabsContent value="overview" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <PieChart className="mr-2" size={20} />
                      Project Distribution by Type
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <PieChart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Project Type Distribution</p>
                        <div className="mt-4 space-y-2">
                          {Object.entries(typeStats).map(([type, count]) => (
                            <div key={type} className="flex items-center justify-between text-sm">
                              <span className="capitalize">{type.replace('_', ' ')}</span>
                              <span className="font-medium">{count}</span>
                            </div>
                          ))}
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <LineChart className="mr-2" size={20} />
                      Project Progress Trends
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                      <div className="text-center">
                        <LineChart className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                        <p className="text-sm text-gray-600">Progress Timeline</p>
                        <p className="text-xs text-gray-500 mt-1">
                          Chart.js integration for progress visualization
                        </p>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>

              <Card>
                <CardHeader>
                  <CardTitle className="flex items-center">
                    <Calendar className="mr-2" size={20} />
                    Recent Activity Summary
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  {activitiesLoading ? (
                    <div className="space-y-3">
                      {[...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-3">
                          <div className="w-8 h-8 bg-gray-200 rounded-full animate-pulse"></div>
                          <div className="flex-1">
                            <div className="h-4 bg-gray-200 rounded animate-pulse mb-1"></div>
                            <div className="h-3 bg-gray-100 rounded w-2/3 animate-pulse"></div>
                          </div>
                        </div>
                      ))}
                    </div>
                  ) : (
                    <div className="space-y-3">
                      {activities?.slice(0, 5).map((activity: any) => (
                        <div key={activity.id} className="flex items-center space-x-3 p-3 bg-gray-50 rounded-lg">
                          <div className="flex-shrink-0">
                            {activity.entityType === "project" && <FolderOpen className="w-5 h-5 text-blue-600" />}
                            {activity.entityType === "zone" && <MapPin className="w-5 h-5 text-purple-600" />}
                            {activity.entityType === "traffic_node" && <Route className="w-5 h-5 text-orange-600" />}
                            {activity.entityType === "environmental_metric" && <Leaf className="w-5 h-5 text-green-600" />}
                          </div>
                          <div className="flex-1">
                            <p className="text-sm font-medium text-gray-900">{activity.description}</p>
                            <p className="text-xs text-gray-500">{new Date(activity.createdAt).toLocaleDateString()}</p>
                          </div>
                        </div>
                      ))}
                    </div>
                  )}
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="projects" className="space-y-6">
              <Card>
                <CardHeader>
                  <CardTitle>Project Performance Analysis</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    {projectsLoading ? (
                      [...Array(3)].map((_, i) => (
                        <div key={i} className="flex items-center space-x-4 p-4 border rounded-lg animate-pulse">
                          <div className="w-12 h-12 bg-gray-200 rounded-lg"></div>
                          <div className="flex-1 space-y-2">
                            <div className="h-4 bg-gray-200 rounded w-1/3"></div>
                            <div className="h-3 bg-gray-100 rounded w-2/3"></div>
                          </div>
                          <div className="w-20 h-3 bg-gray-200 rounded"></div>
                        </div>
                      ))
                    ) : (
                      projects?.map((project: any) => (
                        <div key={project.id} className="flex items-center space-x-4 p-4 border rounded-lg">
                          <div className="flex-shrink-0 w-12 h-12 bg-gray-100 rounded-lg flex items-center justify-center">
                            {project.type === "land_use" && <MapPin className="w-6 h-6 text-purple-600" />}
                            {project.type === "traffic" && <Route className="w-6 h-6 text-orange-600" />}
                            {project.type === "environmental" && <Leaf className="w-6 h-6 text-green-600" />}
                            {project.type === "mixed" && <FolderOpen className="w-6 h-6 text-blue-600" />}
                          </div>
                          <div className="flex-1">
                            <div className="flex items-center space-x-2 mb-1">
                              <h3 className="font-semibold text-gray-900">{project.name}</h3>
                              <Badge variant={project.status === "active" ? "default" : "secondary"}>
                                {project.status}
                              </Badge>
                            </div>
                            <p className="text-sm text-gray-600 capitalize">{project.type.replace('_', ' ')}</p>
                          </div>
                          <div className="flex-shrink-0 w-24">
                            <div className="text-sm font-medium text-gray-900 mb-1">
                              {project.progress || 0}%
                            </div>
                            <Progress value={project.progress || 0} className="h-2" />
                          </div>
                        </div>
                      ))
                    )}
                  </div>
                </CardContent>
              </Card>
            </TabsContent>

            <TabsContent value="performance" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle>Traffic Efficiency Metrics</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Average Speed</span>
                        <span className="font-semibold">35 mph</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Traffic Flow Rate</span>
                        <span className="font-semibold">1,250 vph</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Network Efficiency</span>
                        <span className="font-semibold text-green-600">87%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Congestion Index</span>
                        <span className="font-semibold text-orange-600">0.65</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Land Use Efficiency</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="space-y-4">
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Residential Density</span>
                        <span className="font-semibold">45 units/acre</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Commercial Utilization</span>
                        <span className="font-semibold">78%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Mixed-Use Ratio</span>
                        <span className="font-semibold">32%</span>
                      </div>
                      <div className="flex justify-between items-center">
                        <span className="text-sm text-gray-600">Overall Efficiency</span>
                        <span className="font-semibold text-green-600">92%</span>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>

            <TabsContent value="sustainability" className="space-y-6">
              <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                <Card>
                  <CardHeader>
                    <CardTitle className="flex items-center">
                      <Leaf className="mr-2 text-green-600" size={20} />
                      Environmental Score
                    </CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-green-600 mb-2">
                        {dashboardStats?.environmentalScore || 8.4}
                      </div>
                      <p className="text-sm text-gray-600">out of 10</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Air Quality</span>
                          <span>85%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Green Coverage</span>
                          <span>78%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Water Quality</span>
                          <span>92%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Carbon Footprint</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-blue-600 mb-2">2.3</div>
                      <p className="text-sm text-gray-600">tons CO2/person/year</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Transportation</span>
                          <span>45%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Buildings</span>
                          <span>35%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Industry</span>
                          <span>20%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>

                <Card>
                  <CardHeader>
                    <CardTitle>Renewable Energy</CardTitle>
                  </CardHeader>
                  <CardContent>
                    <div className="text-center">
                      <div className="text-3xl font-bold text-yellow-600 mb-2">65%</div>
                      <p className="text-sm text-gray-600">renewable energy usage</p>
                      <div className="mt-4 space-y-2">
                        <div className="flex justify-between text-sm">
                          <span>Solar</span>
                          <span>40%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Wind</span>
                          <span>20%</span>
                        </div>
                        <div className="flex justify-between text-sm">
                          <span>Hydro</span>
                          <span>5%</span>
                        </div>
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </main>
    </div>
  );
}
