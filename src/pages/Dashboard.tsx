import { Header } from "@/components/Header";
import type { AppScreen } from "../../../shared/schema";
import { Hero } from "@/components/Hero";
import { AIChat } from "@/components/AIChat";
import { ARScanner } from "@/components/ARScanner";
import { GamificationHub } from "@/components/GamificationHub";
import { SocialCommunity } from "@/components/SocialCommunity";
import { Card, CardContent } from "@/components/ui/card";
import { useQuery } from "@tanstack/react-query";
import { useEffect, useState } from "react";
import { Activity, BarChart3, Zap, Target, TrendingUp, Award } from "lucide-react";


const DEMO_USER_ID = 1;

export default function Dashboard() {
  const [scrollY, setScrollY] = useState(0);
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('dashboard');

  const handleLogout = () => { window.location.reload(); };
  const handleNavigate = (screen: AppScreen) => setCurrentScreen(screen);

  useEffect(() => {
    const handleScroll = () => setScrollY(window.scrollY);
    window.addEventListener("scroll", handleScroll);
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);


  const { data: dashboardStats, isLoading: statsLoading } = useQuery({
    queryKey: [`/api/users/${DEMO_USER_ID}/dashboard`],
  });


  const { data: carbonStats, isLoading: carbonLoading } = useQuery({
    queryKey: [`/api/users/${DEMO_USER_ID}/carbon-stats`],
  });


  type CarbonStats = { thisMonth: number };
  type DashboardStats = { weeklyGoalProgress: number, streakDays: number, ecoPoints: number, level: number };
  const safeCarbonStats: CarbonStats = (carbonStats && typeof carbonStats === 'object' && 'thisMonth' in carbonStats)
    ? carbonStats as CarbonStats
    : { thisMonth: 45.2 };
  const safeDashboardStats: DashboardStats = (dashboardStats && typeof dashboardStats === 'object' && 'weeklyGoalProgress' in dashboardStats && 'streakDays' in dashboardStats && 'ecoPoints' in dashboardStats && 'level' in dashboardStats)
    ? dashboardStats as DashboardStats
    : { weeklyGoalProgress: 85, streakDays: 23, ecoPoints: 1456, level: 7 };

  return (
    <div className="min-h-screen">
      <Header onNavigate={handleNavigate} onLogout={handleLogout} currentScreen={currentScreen} />
      
      <main>
        <Hero />
        
        {/* AI Dashboard Section */}
        <section id="dashboard" className="py-20">
          <div className="container mx-auto px-6">
            <div className="text-center mb-16">
              <h2 className="text-5xl font-bold mb-6 text-gradient-primary">
                AI-Powered Dashboard
              </h2>
              <p className="text-xl text-muted-foreground">Real-time insights with predictive sustainability analytics</p>
            </div>
            
            <div className="grid lg:grid-cols-3 gap-8">
              {/* Carbon Impact Visualization */}
              <div className="lg:col-span-2 glassmorphism rounded-3xl p-8 hover-lift">
                <div className="flex items-center justify-between mb-6">
                  <h3 className="text-2xl font-bold">Carbon Impact Trend</h3>
                  <div className="flex items-center space-x-2">
                    <span className="text-sm text-muted-foreground">AI Prediction</span>
                    <div className="w-2 h-2 bg-primary rounded-full animate-pulse"></div>
                  </div>
                </div>
                
                {/* Chart Placeholder with animated elements */}
                <div className="relative h-64 neomorphism-inset rounded-2xl overflow-hidden">
                  <div className="absolute inset-4">
                    <svg className="w-full h-full" viewBox="0 0 400 200">
                      <defs>
                        <linearGradient id="carbonGradient" x1="0%" y1="0%" x2="100%" y2="0%">
                          <stop offset="0%" stopColor="hsl(157, 69%, 38%)"/>
                          <stop offset="50%" stopColor="hsl(186, 77%, 44%)"/>
                          <stop offset="100%" stopColor="hsl(262, 83%, 65%)"/>
                        </linearGradient>
                      </defs>
                      <path 
                        d="M 20 160 Q 100 140 180 120 T 380 80" 
                        stroke="url(#carbonGradient)" 
                        strokeWidth="3" 
                        fill="none" 
                        className="animate-pulse"
                      />
                      <circle cx="100" cy="140" r="4" fill="hsl(157, 69%, 38%)" className="animate-ping"/>
                      <circle cx="200" cy="110" r="4" fill="hsl(186, 77%, 44%)" className="animate-ping delay-500"/>
                      <circle cx="300" cy="90" r="4" fill="hsl(262, 83%, 65%)" className="animate-ping delay-1000"/>
                    </svg>
                  </div>
                  
                  {/* Stats overlay */}
                  <div className="absolute top-4 left-4">
                    <div className="text-3xl font-bold text-primary">
                      {!carbonLoading && safeCarbonStats.thisMonth !== undefined ? `-${safeCarbonStats.thisMonth.toFixed(1)}%` : '-45.2%'}
                    </div>
                    <div className="text-sm text-muted-foreground">Carbon reduction this month</div>
                  </div>
                  
                  <div className="absolute bottom-4 right-4">
                    <div className="text-lg font-semibold">AI Forecast: 65% by year-end</div>
                  </div>
                </div>
              </div>
              
              {/* AI Insights Panel */}
              <div className="glassmorphism rounded-3xl p-8 hover-lift">
                <h3 className="text-2xl font-bold mb-6 flex items-center">
                  <Zap className="w-6 h-6 mr-3 text-accent" />
                  AI Insights
                </h3>
                
                <div className="space-y-6">
                  <div className="ai-chat-bubble p-4">
                    <div className="flex items-start space-x-3">
                      <div className="w-8 h-8 bg-white/20 rounded-full flex items-center justify-center">
                        <Zap className="w-4 h-4" />
                      </div>
                      <div>
                        <div className="font-medium mb-1">EcoAI</div>
                        <div className="text-sm">Great job! Your cycling habit saved 12.5kg CO₂ this week. Try walking for trips under 1km to maximize impact.</div>
                      </div>
                    </div>
                  </div>
                  
                  <div className="glassmorphism-dark p-4 rounded-2xl">
                    <div className="flex items-center justify-between mb-3">
                      <span className="text-sm text-muted-foreground">Prediction Accuracy</span>
                      <span className="text-primary font-semibold">94.7%</span>
                    </div>
                    <div className="w-full bg-muted/30 rounded-full h-2">
                      <div className="eco-gradient h-2 rounded-full" style={{ width: '94.7%' }}></div>
                    </div>
                  </div>
                  
                  {/* Quick Actions */}
                  <div className="space-y-3">
                    <button className="w-full glassmorphism p-3 rounded-xl text-left hover:bg-white/10 transition-colors">
                      <Activity className="w-4 h-4 inline mr-3" />
                      Voice: "Log cycling 5km"
                    </button>
                    <button className="w-full glassmorphism p-3 rounded-xl text-left hover:bg-white/10 transition-colors">
                      <BarChart3 className="w-4 h-4 inline mr-3" />
                      Scan receipt for eco-score
                    </button>
                  </div>
                </div>
              </div>
            </div>
            
            {/* Advanced Metrics Grid */}
            <div className="grid md:grid-cols-4 gap-6 mt-12">
              <Card className="glassmorphism rounded-2xl p-6 text-center hover-lift">
                <CardContent className="p-0">
                  <div className="carbon-ring w-16 h-16 rounded-full p-1 mx-auto mb-4">
                    <div className="w-full h-full bg-background rounded-full flex items-center justify-center">
                      <span className="text-xl font-bold">
                        {!statsLoading && safeDashboardStats.weeklyGoalProgress !== undefined ? `${Math.round(safeDashboardStats.weeklyGoalProgress)}%` : '85%'}
                      </span>
                    </div>
                  </div>
                  <div className="text-lg font-semibold">Weekly Goal</div>
                  <div className="text-sm text-muted-foreground">Carbon Reduction</div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism rounded-2xl p-6 text-center hover-lift">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">🔥</div>
                  <div className="text-2xl font-bold text-primary">
                    {!statsLoading && safeDashboardStats.streakDays !== undefined ? safeDashboardStats.streakDays : '23'}
                  </div>
                  <div className="text-sm text-muted-foreground">Day Streak</div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism rounded-2xl p-6 text-center hover-lift">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">⭐</div>
                  <div className="text-2xl font-bold text-secondary">
                    {!statsLoading && safeDashboardStats.ecoPoints !== undefined ? safeDashboardStats.ecoPoints.toLocaleString() : '1,456'}
                  </div>
                  <div className="text-sm text-muted-foreground">Eco Points</div>
                </CardContent>
              </Card>
              
              <Card className="glassmorphism rounded-2xl p-6 text-center hover-lift">
                <CardContent className="p-0">
                  <div className="text-3xl mb-2">🏆</div>
                  <div className="text-2xl font-bold text-accent">
                    Level {!statsLoading && safeDashboardStats.level !== undefined ? safeDashboardStats.level : '7'}
                  </div>
                  <div className="text-sm text-muted-foreground">Eco Warrior</div>
                </CardContent>
              </Card>
            </div>
          </div>
        </section>

        <ARScanner />
        <GamificationHub />
        <SocialCommunity />
        
        {/* Footer */}
        <footer className="py-16 border-t border-border/10">
          <div className="container mx-auto px-6">
            <div className="grid md:grid-cols-4 gap-8 mb-12">
              <div>
                <div className="flex items-center space-x-3 mb-6">
                  <div className="eco-gradient w-10 h-10 rounded-xl flex items-center justify-center">
                    <Activity className="w-6 h-6 text-white" />
                  </div>
                  <h3 className="text-xl font-bold">GreenTrace AI</h3>
                </div>
                <p className="text-muted-foreground mb-4">
                  Revolutionizing sustainability through AI-powered tracking and community engagement.
                </p>
                <div className="flex space-x-4">
                  <div className="glassmorphism w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <Target className="w-5 h-5" />
                  </div>
                  <div className="glassmorphism w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <TrendingUp className="w-5 h-5" />
                  </div>
                  <div className="glassmorphism w-10 h-10 rounded-full flex items-center justify-center hover:bg-white/20 transition-colors cursor-pointer">
                    <Award className="w-5 h-5" />
                  </div>
                </div>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Features</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">Smart Suggestions</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">AR Scanner</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Voice Commands</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Carbon Trading</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Community</h4>
                <ul className="space-y-2 text-muted-foreground">
                  <li><a href="#" className="hover:text-primary transition-colors">University Battles</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Challenges</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Leaderboards</a></li>
                  <li><a href="#" className="hover:text-primary transition-colors">Achievements</a></li>
                </ul>
              </div>
              
              <div>
                <h4 className="font-semibold mb-4">Global Impact</h4>
                <div className="space-y-3">
                  <div className="glassmorphism p-3 rounded-lg">
                    <div className="text-2xl font-bold text-primary">50M+</div>
                    <div className="text-sm text-muted-foreground">kg CO₂ Saved</div>
                  </div>
                  <div className="glassmorphism p-3 rounded-lg">
                    <div className="text-2xl font-bold text-secondary">2.5M</div>
                    <div className="text-sm text-muted-foreground">Trees Planted</div>
                  </div>
                </div>
              </div>
            </div>
            
            <div className="text-center pt-8 border-t border-border/10">
              <p className="text-muted-foreground">© 2024 GreenTrace AI. Empowering sustainable futures through technology.</p>
            </div>
          </div>
        </footer>
      </main>
      
      <AIChat />
    </div>
  );
}
