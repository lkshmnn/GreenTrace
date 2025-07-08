import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Badge } from "@/components/ui/badge";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Trophy, Users, Target, Calendar, Zap, Award, Star, TrendingUp, Sparkles, CheckCircle, Clock, Sword, Shield, Crown } from 'lucide-react';

interface Challenge {
  id: number;
  title: string;
  description: string;
  type: string;
  targetValue: number;
  unit: string;
  rewardPoints: number;
  startDate: string;
  endDate: string;
  participants?: number;
  progress?: number;
  completed?: boolean;
  difficulty: 'easy' | 'medium' | 'hard';
}

interface Achievement {
  id: number;
  achievement: {
    name: string;
    description: string;
    icon: string;
    category: string;
    rarity: string;
  };
  unlockedAt: string;
}

interface JoinBattleState {
  isOpen: boolean;
  challenge: Challenge | null;
  step: 'details' | 'preferences' | 'confirmation';
  formData: {
    username: string;
    university: string;
    teamName: string;
    motivation: string;
  };
}

export function GamificationHub() {
  const [joinBattleState, setJoinBattleState] = useState<JoinBattleState>({
    isOpen: false,
    challenge: null,
    step: 'details',
    formData: {
      username: '',
      university: '',
      teamName: '',
      motivation: ''
    }
  });

  const [challenges] = useState<Challenge[]>([
    {
      id: 1,
      title: "Green Transport Week",
      description: "Use sustainable transport for 7 consecutive days",
      type: "transport",
      targetValue: 7,
      unit: "days",
      rewardPoints: 500,
      startDate: "2025-01-10",
      endDate: "2025-01-17",
      participants: 234,
      progress: 43,
      completed: false,
      difficulty: 'easy'
    },
    {
      id: 2,
      title: "Zero Waste Champion",
      description: "Reduce waste to under 1kg per week",
      type: "waste",
      targetValue: 1,
      unit: "kg/week",
      rewardPoints: 750,
      startDate: "2025-01-05",
      endDate: "2025-01-25",
      participants: 156,
      progress: 78,
      completed: false,
      difficulty: 'medium'
    },
    {
      id: 3,
      title: "Carbon Crusader",
      description: "Save 50kg of CO₂ this month",
      type: "carbon",
      targetValue: 50,
      unit: "kg CO₂",
      rewardPoints: 1000,
      startDate: "2025-01-01",
      endDate: "2025-01-31",
      participants: 89,
      progress: 24,
      completed: false,
      difficulty: 'hard'
    }
  ]);

  const [achievements] = useState<Achievement[]>([
    {
      id: 1,
      achievement: {
        name: "First Steps",
        description: "Logged your first sustainable activity",
        icon: "🌱",
        category: "Getting Started",
        rarity: "common"
      },
      unlockedAt: "2025-01-05T10:30:00Z"
    },
    {
      id: 2,
      achievement: {
        name: "Week Warrior",
        description: "Maintained a 7-day streak",
        icon: "🔥",
        category: "Consistency",
        rarity: "uncommon"
      },
      unlockedAt: "2025-01-12T14:20:00Z"
    },
    {
      id: 3,
      achievement: {
        name: "Eco Pioneer",
        description: "First in your university to reach Level 5",
        icon: "🏆",
        category: "Leadership",
        rarity: "rare"
      },
      unlockedAt: "2025-01-15T09:45:00Z"
    }
  ]);

  const leaderboard = [
    { rank: 1, name: "EcoWarrior2025", university: "MIT", points: 4250, level: 12, trend: 'up' },
    { rank: 2, name: "GreenGenius", university: "Stanford", points: 3890, level: 11, trend: 'up' },
    { rank: 3, name: "CarbonCrusher", university: "Harvard", points: 3654, level: 10, trend: 'same' },
    { rank: 4, name: "SustainableSam", university: "Berkeley", points: 3401, level: 10, trend: 'down' },
    { rank: 5, name: "EcoChampion", university: "Caltech", points: 3205, level: 9, trend: 'up' },
    { rank: 6, name: "GreenHero", university: "UCLA", points: 2987, level: 9, trend: 'up' },
    { rank: 7, name: "You (Alex)", university: "Your University", points: 2450, level: 8, trend: 'up' }
  ];

  const handleJoinBattle = (challenge: Challenge) => {
    setJoinBattleState({
      isOpen: true,
      challenge,
      step: 'details',
      formData: {
        username: '',
        university: '',
        teamName: '',
        motivation: ''
      }
    });
  };

  const handleNextStep = () => {
    if (joinBattleState.step === 'details') {
      setJoinBattleState(prev => ({ ...prev, step: 'preferences' }));
    } else if (joinBattleState.step === 'preferences') {
      setJoinBattleState(prev => ({ ...prev, step: 'confirmation' }));
    }
  };

  const handleConfirmJoin = () => {
    // Simulate joining the battle
    setJoinBattleState(prev => ({ ...prev, isOpen: false }));
    // Show success notification (you could add a toast here)
    alert(`Successfully joined "${joinBattleState.challenge?.title}"! Good luck, warrior! 🚀`);
  };

  const getDifficultyColor = (difficulty: string) => {
    switch (difficulty) {
      case 'easy': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'medium': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'hard': return 'bg-red-100 text-red-800 dark:bg-red-900/30 dark:text-red-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  const getRarityColor = (rarity: string) => {
    switch (rarity) {
      case 'common': return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
      case 'uncommon': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'rare': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'epic': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      case 'legendary': return 'bg-orange-100 text-orange-800 dark:bg-orange-900/30 dark:text-orange-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      <div className="bg-gradient-to-r from-green-500/10 to-emerald-500/10 border border-green-200 dark:border-green-800 rounded-xl p-6">
        <div className="flex items-center space-x-3 mb-4">
          <div className="w-12 h-12 bg-gradient-to-r from-green-400 to-emerald-500 rounded-xl flex items-center justify-center">
            <Trophy className="h-6 w-6 text-white" />
          </div>
          <div>
            <h1 className="text-2xl font-bold text-gray-900 dark:text-white">Sustainability Arena</h1>
            <p className="text-gray-600 dark:text-gray-300">Compete, achieve, and make a difference</p>
          </div>
        </div>
        
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
          <div className="text-center">
            <div className="text-2xl font-bold text-green-500 mb-1">Level 8</div>
            <div className="text-sm text-gray-500">Current Level</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-blue-500 mb-1">2,450</div>
            <div className="text-sm text-gray-500">Total Points</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-purple-500 mb-1">3/12</div>
            <div className="text-sm text-gray-500">Achievements</div>
          </div>
          <div className="text-center">
            <div className="text-2xl font-bold text-orange-500 mb-1">#7</div>
            <div className="text-sm text-gray-500">Global Rank</div>
          </div>
        </div>
      </div>

      <Tabs defaultValue="challenges" className="w-full">
        <TabsList className="grid w-full grid-cols-3">
          <TabsTrigger value="challenges" className="data-[state=active]:bg-green-100 data-[state=active]:text-green-800">
            <Sword className="mr-2 h-4 w-4" />
            Battles
          </TabsTrigger>
          <TabsTrigger value="leaderboard" className="data-[state=active]:bg-blue-100 data-[state=active]:text-blue-800">
            <Crown className="mr-2 h-4 w-4" />
            Leaderboard
          </TabsTrigger>
          <TabsTrigger value="achievements" className="data-[state=active]:bg-purple-100 data-[state=active]:text-purple-800">
            <Award className="mr-2 h-4 w-4" />
            Achievements
          </TabsTrigger>
        </TabsList>

        <TabsContent value="challenges" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {challenges.map((challenge) => (
              <Card key={challenge.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-green-400">
                <CardHeader>
                  <div className="flex items-center justify-between">
                    <Badge className={getDifficultyColor(challenge.difficulty)}>
                      {challenge.difficulty}
                    </Badge>
                    <div className="flex items-center text-sm text-gray-500">
                      <Users className="h-4 w-4 mr-1" />
                      {challenge.participants}
                    </div>
                  </div>
                  <CardTitle className="text-lg">{challenge.title}</CardTitle>
                  <CardDescription>{challenge.description}</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div className="space-y-2">
                    <div className="flex justify-between text-sm">
                      <span>Progress</span>
                      <span>{challenge.progress}%</span>
                    </div>
                    <Progress value={challenge.progress} className="h-2" />
                  </div>
                  
                  <div className="flex items-center justify-between text-sm text-gray-500">
                    <div className="flex items-center">
                      <Calendar className="h-4 w-4 mr-1" />
                      {new Date(challenge.endDate).toLocaleDateString()}
                    </div>
                    <div className="flex items-center">
                      <Zap className="h-4 w-4 mr-1" />
                      {challenge.rewardPoints} pts
                    </div>
                  </div>

                  <Dialog open={joinBattleState.isOpen && joinBattleState.challenge?.id === challenge.id} onOpenChange={(open) => !open && setJoinBattleState(prev => ({ ...prev, isOpen: false }))}>
                    <DialogTrigger asChild>
                      <Button 
                        className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700 text-white group-hover:shadow-lg"
                        onClick={() => handleJoinBattle(challenge)}
                      >
                        <Sword className="mr-2 h-4 w-4" />
                        Join Battle
                      </Button>
                    </DialogTrigger>
                    <DialogContent className="sm:max-w-md">
                      <DialogHeader>
                        <DialogTitle className="flex items-center">
                          <Sparkles className="mr-2 h-5 w-5 text-green-500" />
                          Join "{challenge.title}"
                        </DialogTitle>
                        <DialogDescription>
                          Step {joinBattleState.step === 'details' ? '1' : joinBattleState.step === 'preferences' ? '2' : '3'} of 3
                        </DialogDescription>
                      </DialogHeader>
                      
                      {joinBattleState.step === 'details' && (
                        <div className="space-y-4">
                          <div className="bg-green-50 dark:bg-green-900/20 p-4 rounded-lg">
                            <h4 className="font-semibold text-green-800 dark:text-green-300 mb-2">Battle Details</h4>
                            <p className="text-sm text-green-700 dark:text-green-400">
                              {challenge.description} • Reward: {challenge.rewardPoints} points
                            </p>
                          </div>
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="username">Battle Username</Label>
                              <Input
                                id="username"
                                placeholder="Enter your warrior name"
                                value={joinBattleState.formData.username}
                                onChange={(e) => setJoinBattleState(prev => ({
                                  ...prev,
                                  formData: { ...prev.formData, username: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="university">University</Label>
                              <Input
                                id="university"
                                placeholder="Your university"
                                value={joinBattleState.formData.university}
                                onChange={(e) => setJoinBattleState(prev => ({
                                  ...prev,
                                  formData: { ...prev.formData, university: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleNextStep} 
                            className="w-full bg-green-600 hover:bg-green-700"
                            disabled={!joinBattleState.formData.username || !joinBattleState.formData.university}
                          >
                            Next: Battle Preferences
                          </Button>
                        </div>
                      )}

                      {joinBattleState.step === 'preferences' && (
                        <div className="space-y-4">
                          <div className="space-y-3">
                            <div>
                              <Label htmlFor="teamName">Team Name (Optional)</Label>
                              <Input
                                id="teamName"
                                placeholder="Create or join a team"
                                value={joinBattleState.formData.teamName}
                                onChange={(e) => setJoinBattleState(prev => ({
                                  ...prev,
                                  formData: { ...prev.formData, teamName: e.target.value }
                                }))}
                              />
                            </div>
                            <div>
                              <Label htmlFor="motivation">Your Motivation</Label>
                              <Input
                                id="motivation"
                                placeholder="Why do you want to join this battle?"
                                value={joinBattleState.formData.motivation}
                                onChange={(e) => setJoinBattleState(prev => ({
                                  ...prev,
                                  formData: { ...prev.formData, motivation: e.target.value }
                                }))}
                              />
                            </div>
                          </div>
                          <Button 
                            onClick={handleNextStep} 
                            className="w-full bg-green-600 hover:bg-green-700"
                          >
                            Next: Confirmation
                          </Button>
                        </div>
                      )}

                      {joinBattleState.step === 'confirmation' && (
                        <div className="space-y-4">
                          <div className="bg-gradient-to-r from-green-50 to-emerald-50 dark:from-green-900/20 dark:to-emerald-900/20 p-4 rounded-lg">
                            <div className="flex items-center mb-3">
                              <CheckCircle className="h-5 w-5 text-green-500 mr-2" />
                              <h4 className="font-semibold text-green-800 dark:text-green-300">Ready to Battle!</h4>
                            </div>
                            <div className="space-y-2 text-sm">
                              <p><strong>Warrior:</strong> {joinBattleState.formData.username}</p>
                              <p><strong>University:</strong> {joinBattleState.formData.university}</p>
                              {joinBattleState.formData.teamName && (
                                <p><strong>Team:</strong> {joinBattleState.formData.teamName}</p>
                              )}
                              {joinBattleState.formData.motivation && (
                                <p><strong>Motivation:</strong> {joinBattleState.formData.motivation}</p>
                              )}
                            </div>
                          </div>
                          <Button 
                            onClick={handleConfirmJoin} 
                            className="w-full bg-gradient-to-r from-green-500 to-emerald-600 hover:from-green-600 hover:to-emerald-700"
                          >
                            <Trophy className="mr-2 h-4 w-4" />
                            Confirm & Join Battle
                          </Button>
                        </div>
                      )}
                    </DialogContent>
                  </Dialog>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>

        <TabsContent value="leaderboard" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center">
                <Crown className="mr-2 h-5 w-5 text-yellow-500" />
                Global Leaderboard
              </CardTitle>
              <CardDescription>Top sustainability warriors worldwide</CardDescription>
            </CardHeader>
            <CardContent>
              <div className="space-y-4">
                {leaderboard.map((player, index) => (
                  <div 
                    key={player.rank}
                    className={`flex items-center justify-between p-4 rounded-lg transition-all hover:bg-gray-50 dark:hover:bg-gray-800/50 ${
                      player.name.includes('You') ? 'bg-green-50 dark:bg-green-900/20 border border-green-200 dark:border-green-800' : 'bg-white dark:bg-gray-900 border border-gray-200 dark:border-gray-700'
                    }`}
                  >
                    <div className="flex items-center space-x-4">
                      <div className={`w-8 h-8 rounded-full flex items-center justify-center font-bold ${
                        player.rank === 1 ? 'bg-yellow-100 text-yellow-800' :
                        player.rank === 2 ? 'bg-gray-100 text-gray-800' :
                        player.rank === 3 ? 'bg-orange-100 text-orange-800' :
                        'bg-blue-100 text-blue-800'
                      }`}>
                        {player.rank <= 3 ? (
                          player.rank === 1 ? '🥇' : player.rank === 2 ? '🥈' : '🥉'
                        ) : (
                          player.rank
                        )}
                      </div>
                      <div>
                        <div className="font-semibold">{player.name}</div>
                        <div className="text-sm text-gray-500">{player.university}</div>
                      </div>
                    </div>
                    <div className="flex items-center space-x-4">
                      <div className="text-right">
                        <div className="font-semibold">{player.points.toLocaleString()} pts</div>
                        <div className="text-sm text-gray-500">Level {player.level}</div>
                      </div>
                      <div className={`w-6 h-6 rounded-full flex items-center justify-center ${
                        player.trend === 'up' ? 'bg-green-100 text-green-600' :
                        player.trend === 'down' ? 'bg-red-100 text-red-600' :
                        'bg-gray-100 text-gray-600'
                      }`}>
                        {player.trend === 'up' ? '↗' : player.trend === 'down' ? '↘' : '→'}
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="achievements" className="space-y-6">
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
            {achievements.map((achievement) => (
              <Card key={achievement.id} className="group hover:shadow-lg transition-all duration-300 border-l-4 border-l-purple-400">
                <CardContent className="p-6">
                  <div className="flex items-start space-x-4">
                    <div className="text-3xl">{achievement.achievement.icon}</div>
                    <div className="flex-1">
                      <div className="flex items-center justify-between mb-2">
                        <h3 className="font-semibold">{achievement.achievement.name}</h3>
                        <Badge className={getRarityColor(achievement.achievement.rarity)}>
                          {achievement.achievement.rarity}
                        </Badge>
                      </div>
                      <p className="text-sm text-gray-600 dark:text-gray-300 mb-3">
                        {achievement.achievement.description}
                      </p>
                      <div className="flex items-center justify-between text-xs text-gray-500">
                        <span>{achievement.achievement.category}</span>
                        <div className="flex items-center">
                          <Clock className="h-3 w-3 mr-1" />
                          {new Date(achievement.unlockedAt).toLocaleDateString()}
                        </div>
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </TabsContent>
      </Tabs>
    </div>
  );
}