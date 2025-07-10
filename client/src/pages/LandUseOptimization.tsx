import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Map, Plus, Settings, BarChart3 } from "lucide-react";

export default function LandUseOptimization() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: zones, isLoading: zonesLoading } = useQuery({
    queryKey: ["/api/projects", selectedProject, "land-use-zones"],
    enabled: !!selectedProject,
  });

  const landUseProjects = projects?.filter((p: any) => p.type === "land_use" || p.type === "mixed") || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header
          title="Land Use Optimization"
          subtitle="Analyze and optimize zoning efficiency with AI-powered recommendations"
        />

        <div className="p-6 space-y-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Map className="mr-2" size={20} />
                Select Project
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
              ) : landUseProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No land use projects found</p>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Land Use Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {landUseProjects.map((project: any) => (
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

          {/* Land Use Analysis */}
          {selectedProject && (
            <div className="space-y-6">
              <Tabs defaultValue="zones" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="zones">Zoning Map</TabsTrigger>
                  <TabsTrigger value="analysis">Analysis</TabsTrigger>
                  <TabsTrigger value="optimization">Optimization</TabsTrigger>
                </TabsList>

                <TabsContent value="zones" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Zoning Map & Configuration</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="mr-2 w-4 h-4" />
                            Configure
                          </Button>
                          <Button size="sm">
                            <Plus className="mr-2 w-4 h-4" />
                            Add Zone
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Map Area */}
                        <div className="lg:col-span-2">
                          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Map className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                              <p className="text-gray-600">Interactive Zoning Map</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Leaflet map with zoning layers would be displayed here
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Zone Legend */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Zone Types</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-green-500 rounded"></div>
                              <span className="text-sm">Residential</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-blue-500 rounded"></div>
                              <span className="text-sm">Commercial</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-yellow-500 rounded"></div>
                              <span className="text-sm">Industrial</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-green-300 rounded"></div>
                              <span className="text-sm">Green Space</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-semibold text-gray-900 mb-2">Zone Statistics</h4>
                            {zonesLoading ? (
                              <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600">
                                <p>Total Zones: {zones?.length || 0}</p>
                                <p>Efficiency Score: 92%</p>
                                <p>Optimization Potential: Medium</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="analysis" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Efficiency Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Efficiency Chart</p>
                            <p className="text-xs text-gray-500">Zone efficiency visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Recommendations</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="p-4 bg-blue-50 rounded-lg">
                            <h4 className="font-medium text-blue-900">Mixed-Use Development</h4>
                            <p className="text-sm text-blue-700 mt-1">
                              Consider converting underutilized commercial zones to mixed-use
                            </p>
                          </div>
                          <div className="p-4 bg-green-50 rounded-lg">
                            <h4 className="font-medium text-green-900">Green Space Optimization</h4>
                            <p className="text-sm text-green-700 mt-1">
                              Increase green space by 15% for improved sustainability
                            </p>
                          </div>
                          <div className="p-4 bg-yellow-50 rounded-lg">
                            <h4 className="font-medium text-yellow-900">Density Adjustment</h4>
                            <p className="text-sm text-yellow-700 mt-1">
                              Optimize residential density in the northern district
                            </p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="optimization" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <CardTitle>AI-Powered Optimization</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="text-center py-12">
                        <div className="mx-auto w-24 h-24 bg-primary bg-opacity-10 rounded-full flex items-center justify-center mb-4">
                          <Settings className="w-12 h-12 text-primary" />
                        </div>
                        <h3 className="text-lg font-semibold text-gray-900 mb-2">
                          Optimization Engine
                        </h3>
                        <p className="text-gray-600 mb-6">
                          AI-powered land use optimization algorithms would run here to suggest 
                          optimal zoning configurations based on multiple factors.
                        </p>
                        <Button className="bg-primary hover:bg-blue-700">
                          Run Optimization
                        </Button>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>
              </Tabs>
            </div>
          )}
        </div>
      </main>
    </div>
  );
}
