import { useState, useEffect, useRef } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Badge } from "@/components/ui/badge";
import { Bike, Utensils, Zap, Recycle, Plus } from "lucide-react";


interface Activity {
  id: number;
  category: string;
  description: string;
  carbonImpact: number;
  points: number;
  timestamp: Date;
}

export function ActivityLog() {

  const [autoLoggingEnabled, setAutoLoggingEnabled] = useState(() => {
    return localStorage.getItem('autoLoggingEnabled') === 'true';
  });
  const [showAutoLogSetup, setShowAutoLogSetup] = useState(false);
  const [showAutoLogModal, setShowAutoLogModal] = useState(false);
  const [autoLogMessage, setAutoLogMessage] = useState('');
  const autoLogInterval = useRef<NodeJS.Timeout | null>(null);


  const [showScheduleModal, setShowScheduleModal] = useState(false);
  const [schedule, setSchedule] = useState(() => {
    const saved = localStorage.getItem('userSchedule');
    return saved ? JSON.parse(saved) : { meal: '', sleep: '', activity: '' };
  });
  const [scheduleInputs, setScheduleInputs] = useState({ meal: '', sleep: '', activity: '' });
  const [scheduleMsg, setScheduleMsg] = useState('');


  const [activities, setActivities] = useState<Activity[]>([
    {
      id: 1,
      category: 'transport',
      description: 'Cycled to university instead of driving',
      carbonImpact: -2.5,
      points: 50,
      timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000)
    },
    {
      id: 2,
      category: 'food',
      description: 'Chose plant-based meal at cafeteria',
      carbonImpact: -1.8,
      points: 35,
      timestamp: new Date(Date.now() - 5 * 60 * 60 * 1000)
    }
  ]);

  useEffect(() => {
    if (autoLoggingEnabled) {
      if (autoLogInterval.current) clearInterval(autoLogInterval.current);
      autoLogInterval.current = setInterval(() => {
        setActivities(prev => [
          {
            id: Date.now(),
            category: 'transport',
            description: 'You walked 0.5km (auto-log)',
            carbonImpact: -0.2,
            points: 4,
            timestamp: new Date()
          },
          ...prev
        ]);
        setAutoLogMessage('Auto-logged: You walked 0.5km');
        setTimeout(() => setAutoLogMessage(''), 3000);
      }, 30000);
    } else {
      if (autoLogInterval.current) clearInterval(autoLogInterval.current);
    }
    return () => { if (autoLogInterval.current) clearInterval(autoLogInterval.current); };
  }, [autoLoggingEnabled]);


  useEffect(() => {
    if (!schedule.meal && !schedule.sleep && !schedule.activity) return;
    const checkNotify = () => {
      const now = new Date();
      const pad = (n: number) => n.toString().padStart(2, '0');
      const nowStr = pad(now.getHours()) + ':' + pad(now.getMinutes());
      if (schedule.meal === nowStr) alert('🍽️ Time for your meal! Remember to log your food choices.');
      if (schedule.sleep === nowStr) alert('🛏️ Time to sleep! Log your day before bed.');
      if (schedule.activity === nowStr) alert('🏃 Activity time! Log your sustainable action.');
    };
    const interval = setInterval(checkNotify, 60000);
    return () => clearInterval(interval);
  }, [schedule]);

  const [newActivity, setNewActivity] = useState({
    category: '',
    description: '',
    carbonImpact: 0
  });

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!newActivity.category || !newActivity.description) return;

    const activity: Activity = {
      id: Date.now(),
      category: newActivity.category,
      description: newActivity.description,
      carbonImpact: -Math.abs(newActivity.carbonImpact),
      points: Math.round(Math.abs(newActivity.carbonImpact) * 20),
      timestamp: new Date()
    };

    setActivities([activity, ...activities]);
    setNewActivity({ category: '', description: '', carbonImpact: 0 });
  };

  const getCategoryIcon = (category: string) => {
    switch (category) {
      case 'transport': return <Bike className="h-4 w-4" />;
      case 'food': return <Utensils className="h-4 w-4" />;
      case 'energy': return <Zap className="h-4 w-4" />;
      case 'waste': return <Recycle className="h-4 w-4" />;
      default: return <Plus className="h-4 w-4" />;
    }
  };

  const getCategoryColor = (category: string) => {
    switch (category) {
      case 'transport': return 'bg-blue-100 text-blue-800 dark:bg-blue-900/30 dark:text-blue-300';
      case 'food': return 'bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300';
      case 'energy': return 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300';
      case 'waste': return 'bg-purple-100 text-purple-800 dark:bg-purple-900/30 dark:text-purple-300';
      default: return 'bg-gray-100 text-gray-800 dark:bg-gray-900/30 dark:text-gray-300';
    }
  };

  return (
    <div className="space-y-8">
      {/* Automatic Logging & Notification Setup */}
      <Card className="mb-6">
        <CardHeader>
          <CardTitle>Smart Activity Tracking</CardTitle>
          <CardDescription>
            Let GreenTrace automatically log your activities and remind you at the right time!
          </CardDescription>
        </CardHeader>
        <CardContent className="flex flex-col gap-4">
          <Button
            variant={autoLoggingEnabled ? 'default' : 'outline'}
            className="w-fit"
            onClick={() => {
              if (!autoLoggingEnabled) setShowAutoLogModal(true);
              else {
                setAutoLoggingEnabled(false);
                localStorage.setItem('autoLoggingEnabled', 'false');
                setAutoLogMessage('Auto logging disabled.');
                if (autoLogInterval.current) clearInterval(autoLogInterval.current);
              }
            }}
          >
            {autoLoggingEnabled ? 'Auto Logging Enabled' : 'Enable Auto Logging'}
          </Button>
          {autoLogMessage && (
            <div className="text-green-600 dark:text-green-300 text-sm">{autoLogMessage}</div>
          )}
          <Button
            variant="outline"
            className="w-fit"
            onClick={() => setShowAutoLogSetup(v => !v)}
          >
            {showAutoLogSetup ? 'Hide Details' : 'How does automatic logging work?'}
          </Button>
          {showAutoLogSetup && (
            <div className="text-sm text-gray-600 dark:text-gray-300 bg-gray-50 dark:bg-gray-900/30 rounded-lg p-3 mt-2">
              <ul className="list-disc pl-5 space-y-1">
                <li>GreenTrace can use your phone’s motion/location (with permission) to detect commutes and arrivals at college. (Simulated)</li>
                <li>Meal times can be detected by your set schedule or by smart reminders.</li>
                <li>We’ll suggest activities to log, and you can confirm or edit them.</li>
                <li>All data is private and only used for your sustainability tracking.</li>
              </ul>
            </div>
          )}
          {/* Auto Logging Modal */}
          {showAutoLogModal && (
            <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
              <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
                <h3 className="font-bold mb-2">Enable Auto Logging?</h3>
                <p className="mb-4 text-sm">Allow simulated access to your location and activity tracking?</p>
                <div className="flex gap-2 justify-end">
                  <Button onClick={() => {
                    setShowAutoLogModal(false);
                  }} variant="outline">Cancel</Button>
                  <Button onClick={() => {
                    setShowAutoLogModal(false);
                    setAutoLoggingEnabled(true);
                    localStorage.setItem('autoLoggingEnabled', 'true');
                    setAutoLogMessage("Auto logging enabled! We'll now track your activity in the background.");
                  }} className="bg-green-600 hover:bg-green-700">Allow</Button>
                </div>
              </div>
            </div>
          )}
        </CardContent>
      </Card>

      {/* Set Daily Schedule Button & Modal */}
      <div className="mb-6">
        <Button variant="outline" className="w-fit" onClick={() => {
          setScheduleInputs(schedule);
          setShowScheduleModal(true);
        }}>
          Set Daily Schedule
        </Button>
        {scheduleMsg && <div className="text-green-600 dark:text-green-300 text-sm mt-2">{scheduleMsg}</div>}
        {showScheduleModal && (
          <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
            <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-sm shadow-lg">
              <h3 className="font-bold mb-2">Set Your Daily Routine</h3>
              <form onSubmit={e => {
                e.preventDefault();
                setSchedule(scheduleInputs);
                localStorage.setItem('userSchedule', JSON.stringify(scheduleInputs));
                setShowScheduleModal(false);
                setScheduleMsg("Schedule saved! We'll notify you at the right time.");
              }} className="space-y-4">
                <div>
                  <label className="block text-sm font-medium mb-1">🍽️ Meal Time</label>
                  <input type="time" className="input input-bordered w-full" value={scheduleInputs.meal} onChange={e => setScheduleInputs(s => ({...s, meal: e.target.value}))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🛏️ Sleep Time</label>
                  <input type="time" className="input input-bordered w-full" value={scheduleInputs.sleep} onChange={e => setScheduleInputs(s => ({...s, sleep: e.target.value}))} required />
                </div>
                <div>
                  <label className="block text-sm font-medium mb-1">🏃 Preferred Activity Time</label>
                  <input type="time" className="input input-bordered w-full" value={scheduleInputs.activity} onChange={e => setScheduleInputs(s => ({...s, activity: e.target.value}))} required />
                </div>
                <div className="flex gap-2 justify-end">
                  <Button type="button" variant="outline" onClick={() => setShowScheduleModal(false)}>Cancel</Button>
                  <Button type="submit" className="bg-green-600 hover:bg-green-700">Save</Button>
                </div>
              </form>
            </div>
          </div>
        )}
      </div>

      {/* Activity Log UI */}
      <div>
        <h1 className="text-3xl font-bold mb-2">Activity Log</h1>
        <p className="text-gray-600 dark:text-gray-300">Track your eco-friendly activities and see your impact</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        {/* Log New Activity */}
        <div className="lg:col-span-1">
          <Card>
            <CardHeader>
              <CardTitle>Log New Activity</CardTitle>
              <CardDescription>Record your sustainable actions</CardDescription>
            </CardHeader>
            <CardContent>
              <form onSubmit={handleSubmit} className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={newActivity.category} 
                    onValueChange={(value) => setNewActivity({...newActivity, category: value})}
                  >
                    <SelectTrigger>
                      <SelectValue placeholder="Select category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="transport">🚲 Transportation</SelectItem>
                      <SelectItem value="food">🥗 Food & Dining</SelectItem>
                      <SelectItem value="energy">💡 Energy Usage</SelectItem>
                      <SelectItem value="waste">♻️ Waste Management</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Input
                    id="description"
                    placeholder="e.g., Cycled to university"
                    value={newActivity.description}
                    onChange={(e) => setNewActivity({...newActivity, description: e.target.value})}
                    required
                  />
                </div>

                <div className="space-y-2">
                  <Label htmlFor="carbon">Carbon Impact (kg CO₂)</Label>
                  <Input
                    id="carbon"
                    type="number"
                    step="0.1"
                    min="0"
                    placeholder="e.g., 2.5"
                    value={newActivity.carbonImpact || ''}
                    onChange={(e) => setNewActivity({...newActivity, carbonImpact: parseFloat(e.target.value) || 0})}
                    required
                  />
                  <p className="text-sm text-gray-500">
                    Estimated points: {Math.round(Math.abs(newActivity.carbonImpact) * 20)}
                  </p>
                </div>

                <Button type="submit" className="w-full bg-green-600 hover:bg-green-700">
                  <Plus className="mr-2 h-4 w-4" />
                  Log Activity
                </Button>
              </form>
            </CardContent>
          </Card>

          {/* Quick Suggestions */}
          <Card className="mt-6">
            <CardHeader>
              <CardTitle>Quick Actions</CardTitle>
            </CardHeader>
            <CardContent className="space-y-2">
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setNewActivity({
                  category: 'transport',
                  description: 'Cycled to campus',
                  carbonImpact: 2.5
                })}
              >
                <Bike className="mr-2 h-4 w-4" />
                Cycle to campus (-2.5 kg CO₂)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setNewActivity({
                  category: 'food',
                  description: 'Plant-based meal',
                  carbonImpact: 1.8
                })}
              >
                <Utensils className="mr-2 h-4 w-4" />
                Plant-based meal (-1.8 kg CO₂)
              </Button>
              <Button 
                variant="outline" 
                className="w-full justify-start"
                onClick={() => setNewActivity({
                  category: 'waste',
                  description: 'Recycled materials',
                  carbonImpact: 0.5
                })}
              >
                <Recycle className="mr-2 h-4 w-4" />
                Recycled materials (-0.5 kg CO₂)
              </Button>
            </CardContent>
          </Card>
        </div>

        {/* Activity History */}
        <div className="lg:col-span-2">
          <Card>
            <CardHeader>
              <CardTitle>Activity History</CardTitle>
              <CardDescription>Your recent sustainable activities</CardDescription>
            </CardHeader>
            <CardContent>
              {activities.length === 0 ? (
                <div className="text-center py-8 text-gray-500">
                  <Plus className="mx-auto h-12 w-12 mb-4 opacity-50" />
                  <p>No activities logged yet. Start tracking your impact!</p>
                </div>
              ) : (
                <div className="space-y-4">
                  {activities.map((activity) => (
                    <div 
                      key={activity.id}
                      className="flex items-center justify-between p-4 rounded-lg border bg-card"
                    >
                      <div className="flex items-center space-x-4">
                        <div className={`p-2 rounded-full ${getCategoryColor(activity.category)}`}>
                          {getCategoryIcon(activity.category)}
                        </div>
                        <div>
                          <p className="font-medium">{activity.description}</p>
                          <p className="text-sm text-gray-500">
                            {activity.timestamp.toLocaleTimeString([], { 
                              hour: '2-digit', 
                              minute: '2-digit' 
                            })} • {activity.timestamp.toLocaleDateString()}
                          </p>
                        </div>
                      </div>
                      <div className="text-right">
                        <div className="flex items-center space-x-2">
                          <Badge variant="secondary" className="bg-green-100 text-green-800 dark:bg-green-900/30 dark:text-green-300">
                            {activity.carbonImpact}kg CO₂
                          </Badge>
                          <Badge className="bg-yellow-100 text-yellow-800 dark:bg-yellow-900/30 dark:text-yellow-300">
                            +{activity.points} pts
                          </Badge>
                        </div>
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}