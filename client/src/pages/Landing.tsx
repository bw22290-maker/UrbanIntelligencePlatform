import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Building2, MapPin, Route, Leaf, BarChart3, Users } from "lucide-react";

export default function Landing() {
  const handleLogin = () => {
    // For development, just reload to trigger auto-login
    window.location.href = "/";
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100">
      {/* Header */}
      <header className="bg-white shadow-sm">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <Building2 className="h-8 w-8 text-primary mr-3" />
              <h1 className="text-2xl font-bold text-gray-900">Urban Intelligence</h1>
            </div>
            <Button onClick={handleLogin} className="bg-primary hover:bg-blue-700">
              Sign In
            </Button>
          </div>
        </div>
      </header>

      {/* Hero Section */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h2 className="text-4xl font-bold text-gray-900 mb-6">
            Smart Urban Intelligence Platform
          </h2>
          <p className="text-xl text-gray-600 mb-8 max-w-3xl mx-auto">
            Revolutionize city planning with advanced tools for land-use optimization, 
            traffic simulation, and sustainability scoring. Make data-driven decisions 
            for better urban development.
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            className="bg-primary hover:bg-blue-700 text-lg px-8 py-3"
          >
            Get Started
          </Button>
        </div>
      </section>

      {/* Features Grid */}
      <section className="py-20">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="text-center mb-16">
            <h3 className="text-3xl font-bold text-gray-900 mb-4">
              Comprehensive Urban Planning Tools
            </h3>
            <p className="text-lg text-gray-600">
              Everything you need to plan, simulate, and optimize urban development
            </p>
          </div>

          <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-purple-100 p-3 rounded-lg w-fit mb-4">
                  <MapPin className="h-8 w-8 text-purple-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Land Use Optimization
                </h4>
                <p className="text-gray-600">
                  Analyze and optimize zoning efficiency with AI-powered recommendations 
                  for better land utilization.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-orange-100 p-3 rounded-lg w-fit mb-4">
                  <Route className="h-8 w-8 text-orange-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Traffic Flow Simulator
                </h4>
                <p className="text-gray-600">
                  Simulate traffic patterns and optimize signal timing for improved 
                  traffic flow and reduced congestion.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-green-100 p-3 rounded-lg w-fit mb-4">
                  <Leaf className="h-8 w-8 text-green-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Environmental Impact Assessment
                </h4>
                <p className="text-gray-600">
                  Measure sustainability metrics and environmental impact scores 
                  for eco-friendly urban development.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-blue-100 p-3 rounded-lg w-fit mb-4">
                  <BarChart3 className="h-8 w-8 text-blue-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Reports & Analytics
                </h4>
                <p className="text-gray-600">
                  Generate comprehensive reports with data visualization and 
                  analytics for informed decision-making.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-indigo-100 p-3 rounded-lg w-fit mb-4">
                  <Users className="h-8 w-8 text-indigo-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  Project Management
                </h4>
                <p className="text-gray-600">
                  Manage urban development projects with collaborative tools 
                  and scenario planning capabilities.
                </p>
              </CardContent>
            </Card>

            <Card className="hover:shadow-lg transition-shadow">
              <CardContent className="p-8">
                <div className="bg-red-100 p-3 rounded-lg w-fit mb-4">
                  <Building2 className="h-8 w-8 text-red-600" />
                </div>
                <h4 className="text-xl font-semibold text-gray-900 mb-3">
                  System Administration
                </h4>
                <p className="text-gray-600">
                  Manage users, permissions, and system settings with 
                  comprehensive administrative controls.
                </p>
              </CardContent>
            </Card>
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="py-20 bg-primary">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 text-center">
          <h3 className="text-3xl font-bold text-white mb-4">
            Ready to Transform Your City Planning?
          </h3>
          <p className="text-xl text-blue-100 mb-8">
            Join city planners worldwide who are using Urban Intelligence to create smarter, 
            more sustainable urban environments.
          </p>
          <Button 
            onClick={handleLogin} 
            size="lg" 
            variant="secondary"
            className="bg-white text-primary hover:bg-gray-100 text-lg px-8 py-3"
          >
            Start Planning Today
          </Button>
        </div>
      </section>
    </div>
  );
}
