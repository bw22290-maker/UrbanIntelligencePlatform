import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Progress } from "@/components/ui/progress";
import { Leaf, Plus, Settings, BarChart3, Wind, Droplets, TreePine } from "lucide-react";

export default function EnvironmentalImpact() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: metrics, isLoading: metricsLoading } = useQuery({
    queryKey: ["/api/projects", selectedProject, "environmental-metrics"],
    enabled: !!selectedProject,
  });

  const environmentalProjects = projects?.filter((p: any) => p.type === "environmental" || p.type === "mixed") || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header
          title="Environmental Impact Assessment"
          subtitle="Measure sustainability metrics and environmental impact scores"
        />

        <div className="p-6 space-y-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Leaf className="mr-2" size={20} />
                Select Environmental Project
              </CardTitle>
            </CardHeader>
            <CardContent>
              {projectsLoading ? (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {[...Array(3)].map((_, i) => (
                    <div key={i} className="border rounded-lg p-4 animate-pulse">
                      <div className="h-4 bg-gray-200 rounded w-3/4 mb-2"></div>
                      <div className="h-3 bg-gray-100 rounded w-full"></div>
                    </div>
                  ))}
                </div>
              ) : environmentalProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No environmental projects found</p>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Environmental Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {environmentalProjects.map((project: any) => (
                    <div
                      key={project.id}
                      className={`border rounded-lg p-4 cursor-pointer transition-all ${
                        selectedProject === project.id
                          ? "border-primary bg-primary bg-opacity-5"
                          : "border-gray-200 hover:border-gray-300"
                      }`}
                      onClick={() => setSelectedProject(project.id)}
                    >
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold text-gray-900">{project.name}</h3>
                        <Badge variant={project.status === "active" ? "default" : "secondary"}>
                          {project.status}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 mb-3">
                        {project.description || "No description"}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>Progress: {project.progress}%</span>
                        <span>{new Date(project.updatedAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>

          {/* Environmental Assessment */}
          {selectedProject && (
            <div className="space-y-6">
              {/* Overall Score */}
              <Card>
                <CardHeader>
                  <CardTitle>Overall Environmental Score</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="flex items-center space-x-8">
                    <div className="flex items-center justify-center w-32 h-32 bg-green-100 rounded-full">
                      <div className="text-center">
                        <div className="text-3xl font-bold text-green-600">8.4</div>
                        <div className="text-sm text-green-600">out of 10</div>
                      </div>
                    </div>
                    <div className="flex-1 space-y-4">
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Air Quality</span>
                          <span className="text-sm text-gray-600">85%</span>
                        </div>
                        <Progress value={85} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Green Coverage</span>
                          <span className="text-sm text-gray-600">92%</span>
                        </div>
                        <Progress value={92} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Water Quality</span>
                          <span className="text-sm text-gray-600">78%</span>
                        </div>
                        <Progress value={78} className="h-2" />
                      </div>
                      <div>
                        <div className="flex justify-between items-center mb-1">
                          <span className="text-sm font-medium">Noise Level</span>
                          <span className="text-sm text-gray-600">72%</span>
                        </div>
                        <Progress value={72} className="h-2" />
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Tabs defaultValue="metrics" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="metrics">Environmental Metrics</TabsTrigger>
                  <TabsTrigger value="analysis">Impact Analysis</TabsTrigger>
                  <TabsTrigger value="recommendations">Recommendations</TabsTrigger>
                </TabsList>

                <TabsContent value="metrics" className="space-y-6">
                  <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Wind className="mr-2 text-blue-600" size={20} />
                          Air Quality
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">PM2.5</span>
                            <span className="font-semibold">12 μg/m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">PM10</span>
                            <span className="font-semibold">25 μg/m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">NO2</span>
                            <span className="font-semibold">18 μg/m³</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">O3</span>
                            <span className="font-semibold">45 μg/m³</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <TreePine className="mr-2 text-green-600" size={20} />
                          Green Coverage
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">Tree Coverage</span>
                            <span className="font-semibold">45%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Parks & Gardens</span>
                            <span className="font-semibold">25%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Green Roofs</span>
                            <span className="font-semibold">8%</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Total Green</span>
                            <span className="font-semibold">78%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle className="flex items-center">
                          <Droplets className="mr-2 text-blue-500" size={20} />
                          Water Quality
                        </CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-3">
                          <div className="flex justify-between">
                            <span className="text-sm">pH Level</span>
                            <span className="font-semibold">7.2</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">Turbidity</span>
                            <span className="font-semibold">0.8 NTU</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">BOD</span>
                            <span className="font-semibold">3.2 mg/L</span>
                          </div>
                          <div className="flex justify-between">
                            <span className="text-sm">DO</span>
                            <span className="font-semibold">8.5 mg/L</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Environmental Monitoring Map</CardTitle>
                        <Button variant="outline" size="sm">
                          <Settings className="mr-2 w-4 h-4" />
                          Configure Sensors
                        </Button>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                        <div className="text-center">
                          <Leaf className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                          <p className="text-gray-600">Environmental Monitoring Map</p>
                          <p className="text-sm text-gray-500 mt-1">
                            Real-time environmental sensor data visualization
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Trend Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Environmental Trends</p>
                            <p className="text-xs text-gray-500">Monthly environmental metrics</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Impact Factors</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex items-center justify-between p-3 bg-red-50 rounded-lg">
                            <div>
                              <p className="font-medium text-red-900">Traffic Emissions</p>
                              <p className="text-sm text-red-700">High impact on air quality</p>
                            </div>
                            <div className="text-red-600 font-semibold">-15%</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-yellow-50 rounded-lg">
                            <div>
                              <p className="font-medium text-yellow-900">Industrial Activity</p>
                              <p className="text-sm text-yellow-700">Moderate impact on water</p>
                            </div>
                            <div className="text-yellow-600 font-semibold">-8%</div>
                          </div>
                          <div className="flex items-center justify-between p-3 bg-green-50 rounded-lg">
                            <div>
                              <p className="font-medium text-green-900">Green Initiatives</p>
                              <p className="text-sm text-green-700">Positive impact overall</p>
                            </div>
                            <div className="text-green-600 font-semibold">+22%</div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="recommendations" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Immediate Actions</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900">Increase Green Coverage</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Plant 500 additional trees in the downtown area to improve air quality
                            </p>
                            <div className="mt-2 flex items-center text-xs text-blue-600">
                              <span>Priority: High</span>
                              <span className="ml-auto">Est. Impact: +12%</span>
                            </div>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-900">Traffic Emission Reduction</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Implement low-emission zones and promote public transportation
                            </p>
                            <div className="mt-2 flex items-center text-xs text-green-600">
                              <span>Priority: High</span>
                              <span className="ml-auto">Est. Impact: +18%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Long-term Strategies</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-purple-50 rounded-lg">
                            <h4 className="font-medium text-purple-900">Renewable Energy</h4>
                            <p className="text-sm text-purple-700 mt-1">
                              Transition to 70% renewable energy sources by 2030
                            </p>
                            <div className="mt-2 flex items-center text-xs text-purple-600">
                              <span>Timeline: 5 years</span>
                              <span className="ml-auto">Est. Impact: +35%</span>
                            </div>
                          </div>
                          <div className="p-4 bg-indigo-50 rounded-lg">
                            <h4 className="font-medium text-indigo-900">Smart City Integration</h4>
                            <p className="text-sm text-indigo-700 mt-1">
                              Deploy IoT sensors for real-time environmental monitoring
                            </p>
                            <div className="mt-2 flex items-center text-xs text-indigo-600">
                              <span>Timeline: 2 years</span>
                              <span className="ml-auto">Est. Impact: +15%</span>
                            </div>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
