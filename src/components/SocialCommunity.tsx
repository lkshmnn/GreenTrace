import { useState } from "react";

function Toast({ message, onClose }: { message: string, onClose: () => void }) {
  if (!message) return null;
  return (
    <div className="fixed bottom-6 right-6 z-50 bg-green-600 text-white px-4 py-2 rounded shadow-lg animate-fade-in">
      {message}
      <button className="ml-4 text-white/80 hover:text-white" onClick={onClose}>&times;</button>
    </div>
  );
}
//
function RankingsModal({ open, onClose, rankings }: { open: boolean, onClose: () => void, rankings: any[] }) {
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-lg shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-4 text-xl">Full University Rankings</h3>
        <div className="max-h-96 overflow-y-auto">
          {rankings.map((university, idx) => (
            <div key={university.university} className="flex items-center space-x-4 p-3 border-b last:border-b-0">
              <div className="w-8 text-lg text-center">{idx === 0 ? '🥇' : idx === 1 ? '🥈' : idx === 2 ? '🥉' : `#${idx + 1}`}</div>
              <div className="flex-1">
                <div className="font-semibold">{university.university}</div>
                <div className="text-xs text-muted-foreground">{university.userCount} students</div>
              </div>
              <div className="text-right font-bold">{university.totalPoints.toLocaleString()} pts</div>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
//
function ChallengeModal({ open, onClose, onJoinIndividual, onJoinTeam, joinedType }: {
  open: boolean,
  onClose: () => void,
  onJoinIndividual: () => void,
  onJoinTeam: (teamName: string) => void,
  joinedType: string | null
}) {
  const [teamName, setTeamName] = useState("");
  if (!open) return null;
  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/40">
      <div className="bg-white dark:bg-gray-900 rounded-lg p-6 w-full max-w-md shadow-lg relative">
        <button className="absolute top-2 right-2 text-gray-500 hover:text-black dark:hover:text-white" onClick={onClose}>&times;</button>
        <h3 className="font-bold mb-4 text-xl">Join a Challenge</h3>
        <div className="space-y-4">
          <button
            className={`w-full py-2 rounded bg-green-600 text-white font-semibold ${joinedType === 'individual' ? 'opacity-60' : ''}`}
            disabled={joinedType === 'individual'}
            onClick={onJoinIndividual}
          >
            {joinedType === 'individual' ? 'Joined as Individual ✅' : 'Join as Individual'}
          </button>
          <div className="flex items-center gap-2">
            <input
              className="flex-1 border rounded px-2 py-1"
              placeholder="Team Name"
              value={teamName}
              onChange={e => setTeamName(e.target.value)}
              disabled={joinedType === 'team'}
            />
            <button
              className={`py-2 px-4 rounded bg-blue-600 text-white font-semibold ${joinedType === 'team' ? 'opacity-60' : ''}`}
              disabled={!teamName || joinedType === 'team'}
              onClick={() => onJoinTeam(teamName)}
            >
              {joinedType === 'team' ? 'Joined Team ✅' : 'Join Team'}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Heart, MessageCircle, Share2, Trophy, Users, TrendingUp, MapPin } from "lucide-react";
import { useQuery, useMutation, useQueryClient } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";
import { useWebSocket } from "@/hooks/useWebSocket";

const DEMO_USER_ID = 1;

interface SocialPost {
  id: number;
  user: {
    id: number;
    username: string;
    university?: string;
    level: number;
  };
  content: string;
  type: string;
  likes: number;
  shares: number;
  comments: number;
  createdAt: string;
  metadata?: any;
}

interface UniversityRanking {
  university: string;
  totalPoints: number;
  userCount: number;
}

export function SocialCommunity() {
  const [showRankingsModal, setShowRankingsModal] = useState(false);
  const [showChallengeModal, setShowChallengeModal] = useState(false);
  const [joinedChallenge, setJoinedChallenge] = useState<string | null>(null);

  const [likeFeedback, setLikeFeedback] = useState<{ [key: number]: boolean }>({});
  const [shareFeedback, setShareFeedback] = useState<{ [key: number]: boolean }>({});
  const [commentFeedback, setCommentFeedback] = useState<{ [key: number]: boolean }>({});
  const [newPostContent, setNewPostContent] = useState('');
  const [showNewPostForm, setShowNewPostForm] = useState(false);
  const queryClient = useQueryClient();

  const [supportState, setSupportState] = useState<{ [key: string]: boolean }>({});
  const [toastMsg, setToastMsg] = useState('');


  const { socket, isConnected } = useWebSocket('/ws');


  const { data: socialFeed, isLoading: feedLoading } = useQuery({
    queryKey: ['/api/social/feed'],
  });


  const { data: leaderboard, isLoading: leaderboardLoading } = useQuery({
    queryKey: ['/api/leaderboard/universities'],
  });

  const createPostMutation = useMutation({
    mutationFn: async (content: string) => {
      const response = await apiRequest('POST', '/api/social/posts', {
        userId: DEMO_USER_ID,
        content,
        type: 'general'
      });
      return response.json();
    },
    onSuccess: () => {
      queryClient.invalidateQueries({ queryKey: ['/api/social/feed'] });
      setNewPostContent('');
      setShowNewPostForm(false);
    }
  });

  const handleCreatePost = () => {
    if (newPostContent.trim()) {
      createPostMutation.mutate(newPostContent);
    }
  };


  const mockFeed: SocialPost[] = [
    {
      id: 1,
      user: { id: 2, username: "Alex Kumar", university: "IIT Delhi", level: 5 },
      content: "Just completed the Zero Waste Week challenge! 🎉 Saved 15kg of plastic waste. Who's next?",
      type: "achievement",
      likes: 23,
      shares: 12,
      comments: 5,
      createdAt: "2024-01-07T10:00:00Z"
    },
    {
      id: 2,
      user: { id: 3, username: "Sarah Chen", university: "Stanford", level: 7 },
      content: "Cycled 50km this week! 🚴‍♀️ My carbon footprint is -25kg CO₂. Green commuting for the win!",
      type: "activity",
      likes: 45,
      shares: 20,
      comments: 8,
      createdAt: "2024-01-07T08:00:00Z"
    },
    {
      id: 3,
      user: { id: 4, username: "Team Green Warriors", university: "MIT", level: 10 },
      content: "Our team planted 100 trees today! 🌳 Join our reforestation challenge and make a real impact.",
      type: "challenge",
      likes: 156,
      shares: 67,
      comments: 24,
      createdAt: "2024-01-07T06:00:00Z"
    }
  ];

  const mockLeaderboard: UniversityRanking[] = [
    { university: "MIT", totalPoints: 2456789, userCount: 1205 },
    { university: "Stanford University", totalPoints: 2123456, userCount: 987 },
    { university: "IIT Delhi", totalPoints: 1987654, userCount: 1456 },
    { university: "Harvard University", totalPoints: 1765432, userCount: 892 },
    { university: "UC Berkeley", totalPoints: 1543210, userCount: 743 },
    { university: "Oxford University", totalPoints: 1420000, userCount: 800 },
    { university: "Cambridge University", totalPoints: 1390000, userCount: 780 },
    { university: "ETH Zurich", totalPoints: 1300000, userCount: 650 },
    { university: "National University of Singapore", totalPoints: 1280000, userCount: 700 },
    { university: "Tsinghua University", totalPoints: 1200000, userCount: 900 },
    { university: "Tokyo University", totalPoints: 1100000, userCount: 600 },
    { university: "Seoul National University", totalPoints: 1050000, userCount: 550 },
    { university: "University of Toronto", totalPoints: 1000000, userCount: 500 },
    { university: "Melbourne University", totalPoints: 950000, userCount: 480 },
    { university: "Technical University of Munich", totalPoints: 900000, userCount: 470 },
    { university: "Peking University", totalPoints: 850000, userCount: 460 },
    { university: "University of Cape Town", totalPoints: 800000, userCount: 450 },
    { university: "Indian Institute of Science", totalPoints: 750000, userCount: 440 },
    { university: "University of São Paulo", totalPoints: 700000, userCount: 430 },
    { university: "Sorbonne University", totalPoints: 650000, userCount: 420 }
  ];

  const feed = socialFeed || mockFeed;

  const universityRankings = leaderboard || mockLeaderboard;
  const feedArr: SocialPost[] = Array.isArray(feed) ? feed : [];
  const universityRankingsArr: UniversityRanking[] = Array.isArray(universityRankings) ? universityRankings : [];

  const top10Rankings = universityRankingsArr.slice(0, 10);

  const formatTimeAgo = (dateString: string) => {
    const date = new Date(dateString);
    const now = new Date();
    const diffInHours = Math.floor((now.getTime() - date.getTime()) / (1000 * 60 * 60));
    
    if (diffInHours < 1) return 'Just now';
    if (diffInHours < 24) return `${diffInHours}h ago`;
    return `${Math.floor(diffInHours / 24)}d ago`;
  };

  const getPostTypeIcon = (type: string) => {
    switch (type) {
      case 'achievement': return '🏆';
      case 'activity': return '🌱';
      case 'challenge': return '🎯';
      default: return '💬';
    }
  };


  return (
    <section id="social" className="py-20">
      <div className="container mx-auto px-6">
        <div className="text-center mb-16">
          <h2 className="text-5xl font-bold mb-6 text-gradient-primary">
            Social Ecosystem
          </h2>
          <p className="text-xl text-muted-foreground">Connect, compete, and collaborate with eco-warriors worldwide</p>
        </div>

        <div className="grid lg:grid-cols-3 gap-8">

          <div className={`lg:col-span-2 ${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'} rounded-3xl p-8 hover-lift`}> 
            <div className="flex items-center justify-between mb-8">
              <h3 className="text-2xl font-bold">🏛️ University Battle Royale</h3>
              <div className="flex items-center space-x-2">
                <span className="text-sm text-muted-foreground">Live</span>
                <div className={`w-2 h-2 rounded-full animate-pulse ${isConnected ? 'bg-green-500' : 'bg-red-500'}`}></div>
              </div>
            </div>

            <div className="space-y-4">
              {top10Rankings.map((university: UniversityRanking, index: number) => (
                <div
                  key={university.university}
                  className={`flex items-center space-x-4 p-4 ${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'} rounded-2xl ${university.university === 'IIT Delhi' ? 'border-2 border-primary' : ''}`}
                >
                  <div className="text-2xl">
                    {index === 0 ? '🥇' : index === 1 ? '🥈' : index === 2 ? '🥉' : `#${index + 1}`}
                  </div>
                  <div className="flex-1">
                    <div className="font-semibold">{university.university}</div>
                    <div className="text-sm text-muted-foreground flex items-center">
                      <Users className="w-3 h-3 mr-1" />
                      {university.userCount.toLocaleString()} students
                    </div>
                  </div>
                  <div className="text-right">
                    <div className={`text-xl font-bold ${
                      index === 0 ? 'text-primary' :
                      index === 1 ? 'text-secondary' :
                      index === 2 ? 'text-accent' : 'text-foreground'
                    }`}>
                      {university.totalPoints.toLocaleString()}
                    </div>
                    <div className="text-sm text-muted-foreground">Eco Points</div>
                  </div>
                </div>
              ))}

              <div className="text-center pt-4">
                <Button className="magnetic-btn eco-gradient px-6 py-3 rounded-xl font-semibold" onClick={() => setShowRankingsModal(true)}>
                  View Full Rankings
                </Button>
              </div>
            </div>
          </div>

          <div className={`rounded-3xl p-8 hover-lift ${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'}`}> 
            <div className="flex items-center justify-between mb-4">
              <h3 className="text-2xl font-bold">🌍 Eco Feed</h3>
              <Button
                onClick={() => setShowNewPostForm(!showNewPostForm)}
                size="sm"
                className="magnetic-btn eco-gradient"
              >
                Share
              </Button>
            </div>


            {showNewPostForm && (
              <Card className={`${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'} mb-6`}>
                <CardContent className="p-4">
                  <Textarea
                    placeholder="Share your sustainability achievement..."
                    value={newPostContent}
                    onChange={(e) => setNewPostContent(e.target.value)}
                    className={`${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'} border-0 resize-none`}
                    rows={3}
                  />
                  <div className="flex justify-end space-x-2 mt-3">
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => setShowNewPostForm(false)}
                    >
                      Cancel
                    </Button>
                    <Button
                      onClick={handleCreatePost}
                      disabled={!newPostContent.trim() || createPostMutation.isPending}
                      size="sm"
                      className="eco-gradient"
                    >
                      {createPostMutation.isPending ? 'Posting...' : 'Post'}
                    </Button>
                  </div>
                </CardContent>
              </Card>
            )}
            
            <div className="space-y-6 max-h-80 overflow-y-auto custom-scrollbar">
              {feedArr.map((post: SocialPost) => (
                <Card key={post.id} className={window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'}>
                  <CardContent className="p-4">
                    <div className="flex items-start space-x-3 mb-3">
                      <div className="w-10 h-10 bg-primary rounded-full flex items-center justify-center">
                        <span className="text-sm">🌱</span>
                      </div>
                      <div className="flex-1">
                        <div className="flex items-center space-x-2">
                          <span className="font-semibold">{post.user.username}</span>
                          <Badge variant="outline" className="text-xs">
                            Level {post.user.level}
                          </Badge>
                          <span className="text-xs">{getPostTypeIcon(post.type)}</span>
                        </div>
                        <div className="text-sm text-muted-foreground flex items-center">
                          {post.user.university && (
                            <>
                              <MapPin className="w-3 h-3 mr-1" />
                              {post.user.university} • 
                            </>
                          )}
                          {formatTimeAgo(post.createdAt)}
                        </div>
                      </div>
                    </div>
                    <p className="text-sm mb-3">{post.content}</p>
                    <div className="flex items-center space-x-4 text-sm text-muted-foreground">
                      <button
                        className={`flex items-center space-x-1 hover:text-red-400 transition-colors ${likeFeedback[post.id] ? 'text-red-500' : ''}`}
                        onClick={() => {
                          setLikeFeedback(f => ({ ...f, [post.id]: true }));
                          setToastMsg('❤️ Liked!');
                          setTimeout(() => setLikeFeedback(f => ({ ...f, [post.id]: false })), 800);
                        }}
                      >
                        <Heart className="w-4 h-4" />
                        <span>{post.likes + (likeFeedback[post.id] ? 1 : 0)}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 hover:text-blue-400 transition-colors ${commentFeedback[post.id] ? 'text-blue-500' : ''}`}
                        onClick={() => {
                          setCommentFeedback(f => ({ ...f, [post.id]: true }));
                          setToastMsg('💬 Comment coming soon!');
                          setTimeout(() => setCommentFeedback(f => ({ ...f, [post.id]: false })), 800);
                        }}
                      >
                        <MessageCircle className="w-4 h-4" />
                        <span>{post.comments}</span>
                      </button>
                      <button
                        className={`flex items-center space-x-1 hover:text-green-400 transition-colors ${shareFeedback[post.id] ? 'text-green-500' : ''}`}
                        onClick={() => {
                          setShareFeedback(f => ({ ...f, [post.id]: true }));
                          setToastMsg('🔗 Post shared!');
                          setTimeout(() => setShareFeedback(f => ({ ...f, [post.id]: false })), 800);
                        }}
                      >
                        <Share2 className="w-4 h-4" />
                        <span>{post.shares + (shareFeedback[post.id] ? 1 : 0)}</span>
                      </button>
                    </div>
                  </CardContent>
                </Card>
              ))}
            </div>

          </div>
        </div>


        {/* Support Projects section restored as before */}
        <div className={`mt-16 rounded-3xl p-8 ${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'}`}>
          <div className="text-center mb-8">
            <h3 className="text-3xl font-bold mb-4">💰 Carbon Credit Marketplace</h3>
            <p className="text-muted-foreground">Trade your earned carbon credits and support global environmental projects</p>
          </div>
          <div className="grid md:grid-cols-3 gap-8">
            <Card className={`${window.matchMedia && window.matchMedia('(prefers-color-scheme: dark)').matches ? 'social-glass' : 'social-glass-light'} rounded-2xl p-6 text-center hover-lift`}>
              <CardContent className="p-0">
                <div className="text-4xl mb-4">🌳</div>
                <h4 className="text-xl font-bold mb-2">Forest Protection</h4>
                <p className="text-sm text-muted-foreground mb-4">Protect 1000m² of rainforest</p>
                <div className="text-2xl font-bold text-primary mb-4">50 Credits</div>
                <Button
                  className="magnetic-btn eco-gradient w-full py-2 rounded-lg"
                  disabled={!!supportState['forest']}
                  onClick={() => {
                    setSupportState(s => ({ ...s, forest: true }));
                    setToastMsg('Thanks for supporting this project!');
                    setTimeout(() => setToastMsg(''), 2500);
                  }}
                >
                  {supportState['forest'] ? 'Supported ✅' : 'Support Project'}
                </Button>
              </CardContent>
            </Card>
            <Card className="glassmorphism-dark rounded-2xl p-6 text-center hover-lift">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">☀️</div>
                <h4 className="text-xl font-bold mb-2">Solar Energy</h4>
                <p className="text-sm text-muted-foreground mb-4">Fund solar panels for rural schools</p>
                <div className="text-2xl font-bold text-secondary mb-4">75 Credits</div>
                <Button
                  className="magnetic-btn eco-gradient w-full py-2 rounded-lg"
                  disabled={!!supportState['solar']}
                  onClick={() => {
                    setSupportState(s => ({ ...s, solar: true }));
                    setToastMsg('Thanks for supporting this project!');
                    setTimeout(() => setToastMsg(''), 2500);
                  }}
                >
                  {supportState['solar'] ? 'Supported ✅' : 'Support Project'}
                </Button>
              </CardContent>
            </Card>
            <Card className="glassmorphism-dark rounded-2xl p-6 text-center hover-lift">
              <CardContent className="p-0">
                <div className="text-4xl mb-4">💧</div>
                <h4 className="text-xl font-bold mb-2">Clean Water</h4>
                <p className="text-sm text-muted-foreground mb-4">Provide clean water access</p>
                <div className="text-2xl font-bold text-accent mb-4">100 Credits</div>
                <Button
                  className="magnetic-btn eco-gradient w-full py-2 rounded-lg"
                  disabled={!!supportState['water']}
                  onClick={() => {
                    setSupportState(s => ({ ...s, water: true }));
                    setToastMsg('Thanks for supporting this project!');
                    setTimeout(() => setToastMsg(''), 2500);
                  }}
                >
                  {supportState['water'] ? 'Supported ✅' : 'Support Project'}
                </Button>
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
      <Toast message={toastMsg} onClose={() => setToastMsg('')} />
      <RankingsModal open={showRankingsModal} onClose={() => setShowRankingsModal(false)} rankings={universityRankingsArr} />
      <ChallengeModal
        open={showChallengeModal}
        onClose={() => setShowChallengeModal(false)}
        joinedType={joinedChallenge}
        onJoinIndividual={() => {
          setJoinedChallenge('individual');
          setToastMsg('You joined as an individual!');
          setTimeout(() => setShowChallengeModal(false), 1200);
        }}
        onJoinTeam={teamName => {
          setJoinedChallenge(teamName);
          setToastMsg(`You joined the team: ${teamName}`);
          setTimeout(() => setShowChallengeModal(false), 1200);
        }}
      />
    </section>
  );
}
