import { useState, useRef, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Zap, X, Send, Target, BarChart3, Trophy } from "lucide-react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface Message {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

const DEMO_USER_ID = 1;

export function AIChat() {
  const [isOpen, setIsOpen] = useState(false);
  const [messages, setMessages] = useState<Message[]>([
    {
      id: '1',
      type: 'ai',
      content: "Hi! I'm your AI sustainability mentor. I notice you've been cycling more - that's fantastic! Would you like me to suggest your next eco-challenge?",
      timestamp: new Date(),
    }
  ]);
  const [inputValue, setInputValue] = useState('');
  const messagesEndRef = useRef<HTMLDivElement>(null);

  const scrollToBottom = () => {
    messagesEndRef.current?.scrollIntoView({ behavior: "smooth" });
  };

  useEffect(() => {
    scrollToBottom();
  }, [messages]);

  const chatMutation = useMutation({
    mutationFn: async (message: string) => {
      const response = await apiRequest('POST', '/api/ai/chat', {
        userId: DEMO_USER_ID,
        message
      });
      return response.json();
    },
    onSuccess: (data) => {
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: data.message || data.response,
        timestamp: new Date(),
      }]);
    },
    onError: (error) => {
      console.error('Chat error:', error);
      setMessages(prev => [...prev, {
        id: Date.now().toString(),
        type: 'ai',
        content: "I'm sorry, I'm having trouble connecting right now. Please try again in a moment.",
        timestamp: new Date(),
      }]);
    }
  });

  const handleSendMessage = async () => {
    if (!inputValue.trim()) return;

    const userMessage: Message = {
      id: Date.now().toString(),
      type: 'user',
      content: inputValue,
      timestamp: new Date(),
    };

    setMessages(prev => [...prev, userMessage]);
    const messageToSend = inputValue;
    setInputValue('');

    chatMutation.mutate(messageToSend);
  };

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter' && !e.shiftKey) {
      e.preventDefault();
      handleSendMessage();
    }
  };

  const quickActions = [
    { icon: Target, label: "Set goals", action: "Help me set a carbon reduction goal" },
    { icon: BarChart3, label: "View insights", action: "Show me my sustainability insights" },
    { icon: Trophy, label: "Challenges", action: "What challenges should I try next?" },
  ];

  return (
    <>
      <div
        id="ai-chat"
        className={`fixed bottom-6 right-6 z-50 transform transition-transform duration-500 ${
          isOpen ? 'translate-y-0' : 'translate-y-full'
        }`}
      >
        <Card className="glassmorphism rounded-3xl w-80 max-h-96 overflow-hidden">
          <CardContent className="p-6">
            <div className="flex items-center justify-between mb-4">
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 eco-gradient rounded-full flex items-center justify-center">
                  <Zap className="w-5 h-5 text-white" />
                </div>
                <div>
                  <div className="font-semibold">Eco Smart Chat</div>
                  <div className="text-xs text-muted-foreground">Online & Learning</div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => setIsOpen(false)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="w-5 h-5" />
              </Button>
            </div>
            
            <div className="space-y-4 mb-4 max-h-48 overflow-y-auto custom-scrollbar">
              {messages.map((message) => (
                <div key={message.id} className={`flex ${message.type === 'user' ? 'justify-end' : 'justify-start'}`}>
                  <div className={`max-w-xs rounded-2xl p-3 ${
                    message.type === 'user' 
                      ? 'bg-primary text-primary-foreground ml-4' 
                      : 'ai-chat-bubble mr-4'
                  }`}>
                    <p className="text-sm">{message.content}</p>
                  </div>
                </div>
              ))}
              {chatMutation.isPending && (
                <div className="flex justify-start">
                  <div className="ai-chat-bubble max-w-xs rounded-2xl p-3 mr-4">
                    <div className="flex space-x-1">
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce"></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce delay-100"></div>
                      <div className="w-2 h-2 bg-white/70 rounded-full animate-bounce delay-200"></div>
                    </div>
                  </div>
                </div>
              )}
              <div ref={messagesEndRef} />
            </div>
            
            <div className="flex space-x-2">
              <Input
                type="text"
                placeholder="Ask me anything..."
                value={inputValue}
                onChange={(e) => setInputValue(e.target.value)}
                onKeyPress={handleKeyPress}
                className="flex-1 glassmorphism-dark border-0 rounded-xl focus:ring-2 focus:ring-primary"
                disabled={chatMutation.isPending}
              />
              <Button
                onClick={handleSendMessage}
                disabled={!inputValue.trim() || chatMutation.isPending}
                className="magnetic-btn eco-gradient p-2 rounded-xl"
              >
                <Send className="w-4 h-4 text-white" />
              </Button>
            </div>
            
            {/* Quick Actions */}
            <div className="flex flex-wrap gap-2 mt-3">
              {quickActions.map((action, index) => (
                <Button
                  key={index}
                  variant="ghost"
                  size="sm"
                  className="glassmorphism-dark px-3 py-1 rounded-lg text-xs hover:bg-white/10"
                  onClick={() => {
                    setInputValue(action.action);
                    handleSendMessage();
                  }}
                  disabled={chatMutation.isPending}
                >
                  <action.icon className="w-3 h-3 mr-1" />
                  {action.label}
                </Button>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Chat Toggle Button */}
      {!isOpen && (
        <Button
          onClick={() => setIsOpen(true)}
          className="fixed bottom-6 right-6 z-40 magnetic-btn eco-gradient w-14 h-14 rounded-full shadow-lg"
        >
          <Zap className="w-6 h-6 text-white" />
        </Button>
      )}
    </>
  );
}
