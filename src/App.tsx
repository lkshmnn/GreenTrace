import { useState } from "react";
import { queryClient } from "./lib/queryClient";
import { QueryClientProvider } from "@tanstack/react-query";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { ThemeProvider } from "next-themes";
import { NotificationSystem } from "@/components/NotificationSystem";
import { PWAInstall } from "@/components/PWAInstall";
import VoiceCommands from "@/components/VoiceCommands";
import { Landing } from "@/pages/Landing";
import { Auth } from "@/pages/Auth";
import { ActivityLog } from "@/pages/ActivityLog";
import { GamificationHub } from "@/components/GamificationHub";
import { AIChat } from "@/components/AIChat";
import { ARScanner } from "@/components/ARScanner";
import { SocialCommunity } from "@/components/SocialCommunity";
import { Header } from "@/components/Header";
import Challenges from "@/pages/Challenges";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, PieChart, Pie, Cell } from 'recharts';
import { Leaf, Zap, Users, Trophy, TrendingUp, Target, Award, Recycle } from 'lucide-react';

type AppScreen = 'landing' | 'auth' | 'dashboard' | 'activity' | 'gamification' | 'scanner' | 'social' | 'challenges';

const mockData = [
  { name: 'Mon', carbon: 12 },
  { name: 'Tue', carbon: 8 },
  { name: 'Wed', carbon: 15 },
  { name: 'Thu', carbon: 6 },
  { name: 'Fri', carbon: 10 },
  { name: 'Sat', carbon: 4 },
  { name: 'Sun', carbon: 7 }
];

const categoryData = [
  { name: 'Transport', value: 45, color: '#10B981' },
  { name: 'Food', value: 30, color: '#3B82F6' },
  { name: 'Energy', value: 15, color: '#F59E0B' },
  { name: 'Waste', value: 10, color: '#EF4444' }
];

function Dashboard({ onNavigate, user }: { onNavigate: (screen: AppScreen) => void, user: { name: string; university: string } }) {
  const stats = {
    carbonSaved: 127,
    ecoPoints: 2450,
    streak: 23,
    level: 8,
    weeklyProgress: 78
  };

  const achievements = [
    { id: 1, name: 'First Steps', description: 'Logged your first activity', icon: '🌱', unlocked: true },
    { id: 2, name: 'Week Warrior', description: 'Maintain streak for 7 days', icon: '🔥', unlocked: true },
    { id: 3, name: 'Carbon Crusher', description: 'Save 50kg CO₂', icon: '💚', unlocked: false },
    { id: 4, name: 'Community Champion', description: 'Top 10 in university', icon: '🏆', unlocked: false }
  ];

  return (
    <div className="space-y-8">
      
      <div className="bg-gradient-to-r from-green-600 to-blue-600 text-white p-6 rounded-xl">
        <h1 className="text-3xl font-bold mb-2">Welcome back, {user?.name || "Eco User"}! 🌟</h1>
        <p className="text-green-100">You've saved {stats.carbonSaved}kg CO₂ this month. Keep up the amazing work!</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Carbon Saved</CardTitle>
            <Leaf className="h-4 w-4 text-green-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-green-600">{stats.carbonSaved}kg</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">+12% from last week</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Eco Points</CardTitle>
            <Zap className="h-4 w-4 text-yellow-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-yellow-600">{stats.ecoPoints}</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Level {stats.level}</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Current Streak</CardTitle>
            <Target className="h-4 w-4 text-orange-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-orange-600">{stats.streak} days</div>
            <p className="text-xs text-gray-500 dark:text-gray-400">Personal best!</p>
          </CardContent>
        </Card>
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Weekly Goal</CardTitle>
            <TrendingUp className="h-4 w-4 text-blue-600" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold text-blue-600">{stats.weeklyProgress}%</div>
            <Progress value={stats.weeklyProgress} className="mt-2" />
          </CardContent>
        </Card>
      </div>
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        
        <Card className="lg:col-span-2">
          <CardHeader>
            <CardTitle>Weekly Carbon Footprint</CardTitle>
            <CardDescription>Your daily carbon savings this week</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <LineChart data={mockData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis dataKey="name" />
                <YAxis />
                <Tooltip />
                <Line type="monotone" dataKey="carbon" stroke="#10B981" strokeWidth={3} />
              </LineChart>
            </ResponsiveContainer>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Impact Categories</CardTitle>
            <CardDescription>Where you're making the biggest difference</CardDescription>
          </CardHeader>
          <CardContent>
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={categoryData}
                  cx="50%"
                  cy="50%"
                  innerRadius={60}
                  outerRadius={100}
                  dataKey="value"
                >
                  {categoryData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.color} />
                  ))}
                </Pie>
                <Tooltip />
              </PieChart>
            </ResponsiveContainer>
            <div className="mt-4 space-y-2">
              {categoryData.map((item) => (
                <div key={item.name} className="flex items-center justify-between">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: item.color }}
                    />
                    <span className="text-sm">{item.name}</span>
                  </div>
                  <span className="text-sm font-medium">{item.value}%</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Trophy className="mr-2 h-5 w-5 text-yellow-600" />
            Achievements
          </CardTitle>
          <CardDescription>Track your sustainability milestones</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            {achievements.map((achievement) => (
              <div 
                key={achievement.id}
                className={`p-4 rounded-lg border-2 transition-all ${
                  achievement.unlocked 
                    ? 'border-green-200 bg-green-50 dark:border-green-800 dark:bg-green-900/20' 
                    : 'border-gray-200 bg-gray-50 dark:border-gray-700 dark:bg-gray-800/50'
                }`}
              >
                <div className="text-2xl mb-2">{achievement.icon}</div>
                <h3 className="font-semibold mb-1">{achievement.name}</h3>
                <p className="text-sm text-gray-600 dark:text-gray-400">{achievement.description}</p>
                {achievement.unlocked && (
                  <Badge className="mt-2 bg-green-600">Unlocked</Badge>
                )}
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
      
      <Card>
        <CardHeader>
          <CardTitle>Quick Actions</CardTitle>
          <CardDescription>Continue your sustainability journey</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex flex-wrap gap-4">
            <Button 
              className="bg-green-600 hover:bg-green-700"
              onClick={() => onNavigate('activity')}
            >
              <Recycle className="mr-2 h-4 w-4" />
              Log Activity
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('gamification')}
            >
              <Users className="mr-2 h-4 w-4" />
              View Leaderboard
            </Button>
            <Button 
              variant="outline"
              onClick={() => onNavigate('gamification')}
            >
              <Award className="mr-2 h-4 w-4" />
              Join Challenge
            </Button>
            
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function App() {
  const [currentScreen, setCurrentScreen] = useState<AppScreen>('landing');
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [currentUser, setCurrentUser] = useState<{ name: string; email: string; university: string } | null>(null);

  const handleStartTracking = () => {
    if (isAuthenticated) {
      setCurrentScreen('dashboard');
    } else {
      setCurrentScreen('auth');
    }
  };

  const handleAuthSuccess = (user: { name: string; email: string; university: string }) => {
    setIsAuthenticated(true);
    setCurrentUser(user);
    setCurrentScreen('dashboard');
  };

  const handleNavigate = (screen: AppScreen) => {
    setCurrentScreen(screen);
  };

  const handleLogout = () => {
    setIsAuthenticated(false);
    setCurrentUser(null);
    setCurrentScreen('landing');
  };

  const renderContent = () => {
    if (!isAuthenticated) {
      switch (currentScreen) {
        case 'landing':
          return <Landing onStartTracking={handleStartTracking} />;
        case 'auth':
          return <Auth onAuthSuccess={handleAuthSuccess} />;
        default:
          return <Landing onStartTracking={handleStartTracking} />;
      }
    }

    // Authenticated screens
    return (
      <div className="min-h-screen bg-gray-50 dark:bg-gray-900">
        <Header 
          onNavigate={handleNavigate} 
          onLogout={handleLogout} 
          currentScreen={currentScreen}
        />
        <main className="container mx-auto px-4 py-8">
          {currentScreen === 'dashboard' && <Dashboard onNavigate={handleNavigate} user={currentUser!} />}
          {currentScreen === 'activity' && <ActivityLog />}
          {currentScreen === 'gamification' && <GamificationHub />}
          {currentScreen === 'scanner' && <ARScanner />}
          {currentScreen === 'social' && <SocialCommunity />}
          {currentScreen === 'challenges' && <Challenges />}
        </main>
      </div>
    );
  };

  return (
    <QueryClientProvider client={queryClient}>
      <ThemeProvider attribute="class" defaultTheme="light" enableSystem>
        <TooltipProvider>
          {renderContent()}
          <Toaster />
          <NotificationSystem />
          <PWAInstall />
          <VoiceCommands />
          <AIChat />
        </TooltipProvider>
      </ThemeProvider>
    </QueryClientProvider>
  );
}

export default App;
