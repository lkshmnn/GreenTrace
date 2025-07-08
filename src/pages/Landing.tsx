import { useState, useEffect } from 'react';
import { toast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Leaf, Zap, Users, Trophy, ArrowRight, Sparkles, BarChart3, Camera, MessageCircle } from 'lucide-react';

interface LandingProps {
  onStartTracking: () => void;
}

export function Landing({ onStartTracking }: LandingProps) {
  const [scrollY, setScrollY] = useState(0);
  const [currentFeature, setCurrentFeature] = useState(0);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => {
    const interval = setInterval(() => {
      setCurrentFeature((prev) => (prev + 1) % 4);
    }, 3000);
    return () => clearInterval(interval);
  }, []);

  const features = [
    {
      icon: BarChart3,
      title: "Monitor Progress",
      description: "Set goals and visualize carbon footprint reduction",
      color: "from-green-400 to-emerald-500"
    },
    {
      icon: Users,
      title: "Join Community",
      description: "Compete with peers and share achievements",
      color: "from-blue-400 to-cyan-500"
    },
    {
      icon: MessageCircle,
      title: "Smart Suggestions",
      description: "Get personalized sustainability recommendations",
      color: "from-purple-400 to-violet-500"
    },
    {
      icon: Camera,
      title: "AR Scanner",
      description: "Scan products for instant sustainability insights",
      color: "from-orange-400 to-red-500"
    }
  ];

  
  const handleStartTracking = () => {
    toast({
      title: "Welcome!",
      description: "You are starting your sustainability journey!",
    });
    onStartTracking();
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-900 via-purple-900 to-slate-800 text-white overflow-hidden">
      {/* Animated Background */}
      <div className="fixed inset-0 overflow-hidden pointer-events-none">
        <div className="absolute top-1/4 -left-4 w-72 h-72 bg-green-400/10 rounded-full blur-3xl animate-pulse"></div>
        <div className="absolute top-3/4 -right-4 w-96 h-96 bg-blue-400/10 rounded-full blur-3xl animate-pulse delay-1000"></div>
        <div className="absolute bottom-1/4 left-1/3 w-80 h-80 bg-purple-400/10 rounded-full blur-3xl animate-pulse delay-2000"></div>
        
        {/* Floating particles */}
        <div className="particles fixed inset-0">
          {Array.from({ length: 20 }, (_, i) => (
            <div
              key={i}
              className="absolute w-2 h-2 bg-green-400/30 rounded-full animate-float"
              style={{
                left: `${Math.random() * 100}%`,
                top: `${Math.random() * 100}%`,
                animationDelay: `${Math.random() * 10}s`,
                animationDuration: `${8 + Math.random() * 4}s`
              }}
            />
          ))}
        </div>
      </div>

      {/* Header */}
      <header className="relative z-50 p-6">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center space-x-3">
            <div className="w-10 h-10 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
              <Leaf className="h-6 w-6 text-white" />
            </div>
            <div>
              <h1 className="text-xl font-bold">GreenTrace AI</h1>
              <p className="text-xs text-gray-300">Sustainability Platform</p>
            </div>
          </div>
          <Button 
            variant="outline" 
            className="border-green-400/50 text-green-400 hover:bg-green-400/10"
            onClick={handleStartTracking}
          >
            Sign In
          </Button>
        </div>
      </header>

      {/* Hero Section */}
      <section className="relative z-10 pt-20 pb-32 px-6">
        <div className="container mx-auto text-center">
          <div 
            className="mb-8 transition-transform duration-1000"
            style={{ transform: `translateY(${scrollY * 0.2}px)` }}
          >
            <h1 className="text-6xl md:text-7xl font-bold mb-6 bg-gradient-to-r from-green-400 via-blue-400 to-purple-400 bg-clip-text text-transparent">
              Track Your Impact.
              <br />
              Save The Planet.
            </h1>
            <p className="text-xl md:text-2xl text-gray-300 mb-8 max-w-3xl mx-auto">
              Join the world's most advanced AI-powered sustainability platform. 
              Track carbon footprint, compete with friends, and make a real difference.
            </p>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 justify-center mb-16">
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-8 py-4 text-lg font-semibold group"
              onClick={handleStartTracking}
            >
              Start Tracking Now
              <ArrowRight className="ml-2 h-5 w-5 group-hover:translate-x-1 transition-transform" />
            </Button>
            <Button 
              size="lg" 
              variant="outline" 
              className="border-purple-400/50 text-purple-400 hover:bg-purple-400/10 px-8 py-4 text-lg"
            >
              Watch Demo
              <Sparkles className="ml-2 h-5 w-5" />
            </Button>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-8 max-w-4xl mx-auto">
            <div className="text-center">
              <div className="text-3xl font-bold text-green-400 mb-2">50K+</div>
              <div className="text-gray-400">Active Users</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-blue-400 mb-2">2.5M</div>
              <div className="text-gray-400">CO₂ Saved (kg)</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-purple-400 mb-2">150+</div>
              <div className="text-gray-400">Universities</div>
            </div>
            <div className="text-center">
              <div className="text-3xl font-bold text-orange-400 mb-2">95%</div>
              <div className="text-gray-400">Satisfaction</div>
            </div>
          </div>
        </div>
      </section>

      {/* Features Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto">
          <div className="text-center mb-20">
            <h2 className="text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Powerful Features
            </h2>
            <p className="text-xl text-gray-300 max-w-2xl mx-auto">
              Everything you need to track, reduce, and offset your carbon footprint with AI-powered insights
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-8">
            {features.map((feature, index) => {
              const Icon = feature.icon;
              return (
                <Card 
                  key={index}
                  className={`bg-gray-900/50 border-gray-700/50 backdrop-blur-sm transition-all duration-500 hover:scale-105 hover:bg-gray-800/50 group ${
                    currentFeature === index ? 'ring-2 ring-green-400/50 shadow-2xl shadow-green-400/20' : ''
                  }`}
                  style={{
                    /* Subtle or no transform to prevent overlap */
                    transform: `translateY(${scrollY * 0.02 * (index + 1)}px)`
                  }}
                >
                  <CardContent className="p-8 text-center">
                    <div className={`w-16 h-16 bg-gradient-to-r ${feature.color} rounded-2xl flex items-center justify-center mx-auto mb-6 group-hover:scale-110 transition-transform`}>
                      <Icon className="h-8 w-8 text-white" />
                    </div>
                    <h3 className="text-xl font-bold text-white mb-4">{feature.title}</h3>
                    <p className="text-gray-400 leading-relaxed">{feature.description}</p>
                  </CardContent>
                </Card>
              );
            })}
          </div>
        </div>
      </section>

      {/* CTA Section */}
      <section className="relative z-10 py-32 px-6">
        <div className="container mx-auto text-center">
          <div className="bg-gradient-to-r from-green-900/50 to-blue-900/50 backdrop-blur-sm rounded-3xl p-16 border border-green-400/20">
            <h2 className="text-4xl md:text-5xl font-bold mb-6 bg-gradient-to-r from-green-400 to-blue-400 bg-clip-text text-transparent">
              Ready to Make an Impact?
            </h2>
            <p className="text-xl text-gray-300 mb-8 max-w-2xl mx-auto">
              Join thousands of students already tracking their sustainability journey. 
              Start making a difference today.
            </p>
            <Button 
              size="lg" 
              className="bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white px-12 py-6 text-xl font-semibold group"
              onClick={handleStartTracking}
            >
              Get Started Free
              <Trophy className="ml-3 h-6 w-6 group-hover:rotate-12 transition-transform" />
            </Button>
          </div>
        </div>
      </section>

      {/* Footer */}
      <footer className="relative z-10 py-12 px-6 border-t border-gray-800">
        <div className="container mx-auto text-center">
          <div className="flex items-center justify-center space-x-3 mb-6">
            <div className="w-8 h-8 bg-gradient-to-r from-green-400 to-emerald-500 rounded-lg flex items-center justify-center">
              <Leaf className="h-5 w-5 text-white" />
            </div>
            <span className="text-lg font-semibold">GreenTrace AI</span>
          </div>
          <p className="text-gray-400">
            © 2025 GreenTrace AI. Building a sustainable future with AI.
          </p>
        </div>
      </footer>
    </div>
  );
}