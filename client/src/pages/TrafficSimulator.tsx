import { useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { Sidebar } from "@/components/Sidebar";
import { Header } from "@/components/Header";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Route, Play, Settings, BarChart3, Plus } from "lucide-react";

export default function TrafficSimulator() {
  const [selectedProject, setSelectedProject] = useState<number | null>(null);

  const { data: projects, isLoading: projectsLoading } = useQuery({
    queryKey: ["/api/projects"],
  });

  const { data: trafficNodes, isLoading: nodesLoading } = useQuery({
    queryKey: ["/api/projects", selectedProject, "traffic-nodes"],
    enabled: !!selectedProject,
  });

  const trafficProjects = projects?.filter((p: any) => p.type === "traffic" || p.type === "mixed") || [];

  return (
    <div className="min-h-screen flex bg-gray-50">
      <Sidebar />
      
      <main className="flex-1 overflow-y-auto">
        <Header
          title="Traffic Flow Simulator"
          subtitle="Simulate traffic patterns and optimize signal timing for improved traffic flow"
        />

        <div className="p-6 space-y-6">
          {/* Project Selection */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Route className="mr-2" size={20} />
                Select Traffic Project
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
              ) : trafficProjects.length === 0 ? (
                <div className="text-center py-8">
                  <p className="text-gray-500 mb-4">No traffic projects found</p>
                  <Button>
                    <Plus className="mr-2 w-4 h-4" />
                    Create Traffic Project
                  </Button>
                </div>
              ) : (
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                  {trafficProjects.map((project: any) => (
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

          {/* Traffic Simulation */}
          {selectedProject && (
            <div className="space-y-6">
              <Tabs defaultValue="network" className="w-full">
                <TabsList className="grid w-full grid-cols-3">
                  <TabsTrigger value="network">Traffic Network</TabsTrigger>
                  <TabsTrigger value="simulation">Simulation</TabsTrigger>
                  <TabsTrigger value="results">Results</TabsTrigger>
                </TabsList>

                <TabsContent value="network" className="space-y-6">
                  <Card>
                    <CardHeader>
                      <div className="flex items-center justify-between">
                        <CardTitle>Traffic Network Configuration</CardTitle>
                        <div className="flex items-center space-x-2">
                          <Button variant="outline" size="sm">
                            <Settings className="mr-2 w-4 h-4" />
                            Configure
                          </Button>
                          <Button size="sm">
                            <Plus className="mr-2 w-4 h-4" />
                            Add Node
                          </Button>
                        </div>
                      </div>
                    </CardHeader>
                    <CardContent>
                      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                        {/* Network Map */}
                        <div className="lg:col-span-2">
                          <div className="h-96 bg-gray-100 rounded-lg flex items-center justify-center">
                            <div className="text-center">
                              <Route className="mx-auto h-16 w-16 text-gray-400 mb-4" />
                              <p className="text-gray-600">Interactive Traffic Network</p>
                              <p className="text-sm text-gray-500 mt-1">
                                Traffic nodes, signals, and routes visualization
                              </p>
                            </div>
                          </div>
                        </div>

                        {/* Network Stats */}
                        <div className="space-y-4">
                          <h4 className="font-semibold text-gray-900">Network Elements</h4>
                          <div className="space-y-2">
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-red-500 rounded-full"></div>
                              <span className="text-sm">Traffic Signals</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-blue-500 rounded-full"></div>
                              <span className="text-sm">Intersections</span>
                            </div>
                            <div className="flex items-center space-x-2">
                              <div className="w-4 h-4 bg-green-500 rounded-full"></div>
                              <span className="text-sm">Roundabouts</span>
                            </div>
                          </div>

                          <div className="pt-4 border-t">
                            <h4 className="font-semibold text-gray-900 mb-2">Network Statistics</h4>
                            {nodesLoading ? (
                              <div className="space-y-2">
                                {[...Array(3)].map((_, i) => (
                                  <div key={i} className="h-3 bg-gray-200 rounded animate-pulse"></div>
                                ))}
                              </div>
                            ) : (
                              <div className="text-sm text-gray-600">
                                <p>Total Nodes: {trafficNodes?.length || 0}</p>
                                <p>Avg Flow Rate: 1,250 vph</p>
                                <p>Network Efficiency: 87%</p>
                              </div>
                            )}
                          </div>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                </TabsContent>

                <TabsContent value="simulation" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Simulation Controls</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Time Period
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                              <option>Morning Rush (7-9 AM)</option>
                              <option>Midday (11 AM - 1 PM)</option>
                              <option>Evening Rush (5-7 PM)</option>
                              <option>Custom</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Traffic Volume
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                              <option>Light (50% capacity)</option>
                              <option>Normal (75% capacity)</option>
                              <option>Heavy (100% capacity)</option>
                              <option>Peak (125% capacity)</option>
                            </select>
                          </div>
                          <div>
                            <label className="block text-sm font-medium text-gray-700 mb-2">
                              Simulation Duration
                            </label>
                            <select className="w-full border border-gray-300 rounded-lg px-3 py-2">
                              <option>15 minutes</option>
                              <option>30 minutes</option>
                              <option>1 hour</option>
                              <option>2 hours</option>
                            </select>
                          </div>
                          <Button className="w-full mt-4">
                            <Play className="mr-2 w-4 h-4" />
                            Start Simulation
                          </Button>
                        </div>
                      </CardContent>
                    </Card>

                    <Card>
                      <CardHeader>
                        <CardTitle>Real-time Monitor</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Simulation Monitor</p>
                            <p className="text-xs text-gray-500">Real-time traffic flow visualization</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>
                </TabsContent>

                <TabsContent value="results" className="space-y-6">
                  <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                    <Card>
                      <CardHeader>
                        <CardTitle>Performance Metrics</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="space-y-4">
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Average Speed</span>
                            <span className="font-semibold">35 mph</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Travel Time</span>
                            <span className="font-semibold">12 min</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Queue Length</span>
                            <span className="font-semibold">45 veh</span>
                          </div>
                          <div className="flex justify-between items-center">
                            <span className="text-sm text-gray-600">Efficiency</span>
                            <span className="font-semibold text-green-600">87%</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>

                    <Card className="lg:col-span-2">
                      <CardHeader>
                        <CardTitle>Traffic Flow Analysis</CardTitle>
                      </CardHeader>
                      <CardContent>
                        <div className="h-64 bg-gray-50 rounded-lg flex items-center justify-center">
                          <div className="text-center">
                            <BarChart3 className="mx-auto h-12 w-12 text-gray-400 mb-2" />
                            <p className="text-sm text-gray-600">Flow Analysis Chart</p>
                            <p className="text-xs text-gray-500">Traffic flow patterns and bottlenecks</p>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                  </div>

                  <Card>
                    <CardHeader>
                      <CardTitle>Optimization Recommendations</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        <div className="p-4 bg-blue-50 rounded-lg">
                          <h4 className="font-medium text-blue-900">Signal Timing Optimization</h4>
                          <p className="text-sm text-blue-700 mt-1">
                            Adjust signal timing at Main St intersection to reduce delays by 15%
                          </p>
                        </div>
                        <div className="p-4 bg-green-50 rounded-lg">
                          <h4 className="font-medium text-green-900">Lane Configuration</h4>
                          <p className="text-sm text-green-700 mt-1">
                            Add dedicated turn lanes to improve traffic flow at Oak Ave
                          </p>
                        </div>
                        <div className="p-4 bg-yellow-50 rounded-lg">
                          <h4 className="font-medium text-yellow-900">Alternative Routes</h4>
                          <p className="text-sm text-yellow-700 mt-1">
                            Promote alternative routes during peak hours to distribute traffic
                          </p>
                        </div>
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
