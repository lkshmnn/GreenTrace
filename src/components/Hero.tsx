import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Play, Camera } from "lucide-react";

export function Hero() {
  return (
    <section className="pt-24 pb-16 relative overflow-hidden">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <div className="floating mb-8">
            <h1 className="text-6xl md:text-8xl font-bold mb-6 text-gradient-primary">
              Future of
              <br />
              Sustainability
            </h1>
          </div>
          
          <p className="text-xl md:text-2xl text-muted-foreground mb-12 max-w-3xl mx-auto">
            AI-powered sustainability tracking with AR challenges, voice commands, and real-time environmental impact visualization
          </p>
          
          <div className="flex flex-col md:flex-row gap-6 justify-center items-center">
            <Button
              size="lg"
              className="magnetic-btn eco-gradient px-8 py-4 rounded-2xl text-lg font-semibold text-white shadow-lg"
            >
              <Play className="w-6 h-6 mr-2" />
              Start Your Journey
            </Button>
            
            <Button
              variant="outline"
              size="lg"
              className="magnetic-btn glassmorphism-dark px-8 py-4 rounded-2xl text-lg font-semibold border border-white/20"
            >
              <Camera className="w-6 h-6 mr-2" />
              Try AR Scanner
            </Button>
          </div>
        </div>
        
        {/* Floating Stats Cards */}
        <div className="grid md:grid-cols-3 gap-8 mb-16">
          <Card className="floating glassmorphism rounded-3xl hover-lift delay-200">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🌍</div>
              <div className="text-3xl font-bold text-primary mb-2">50M+</div>
              <div className="text-muted-foreground">CO₂ kg Saved</div>
            </CardContent>
          </Card>
          
          <Card className="floating glassmorphism rounded-3xl hover-lift delay-400">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">👥</div>
              <div className="text-3xl font-bold text-secondary mb-2">100K+</div>
              <div className="text-muted-foreground">Active Users</div>
            </CardContent>
          </Card>
          
          <Card className="floating glassmorphism rounded-3xl hover-lift delay-500">
            <CardContent className="p-8 text-center">
              <div className="text-4xl mb-4">🏆</div>
              <div className="text-3xl font-bold text-accent mb-2">1M+</div>
              <div className="text-muted-foreground">Achievements</div>
            </CardContent>
          </Card>
        </div>
      </div>
    </section>
  );
}
