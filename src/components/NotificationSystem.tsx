import { useState, useEffect } from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { X, CheckCircle, AlertCircle, Info, AlertTriangle } from "lucide-react";
import { useWebSocket } from "@/hooks/useWebSocket";

interface Notification {
  id: string;
  type: 'success' | 'error' | 'warning' | 'info';
  title: string;
  message: string;
  timestamp: Date;
  autoRemove?: boolean;
  duration?: number;
}

export function NotificationSystem() {
  const [notifications, setNotifications] = useState<Notification[]>([]);
  const { socket } = useWebSocket('/ws');

  // Listen for WebSocket notifications
  useEffect(() => {
    if (socket) {
      const handleMessage = (event: MessageEvent) => {
        try {
          const data = JSON.parse(event.data);
          
          switch (data.type) {
            case 'new_activity':
              showNotification('Activity Logged', 'Your sustainable activity has been recorded!', 'success');
              break;
            case 'achievement_unlocked':
              showNotification('Achievement Unlocked!', 'You\'ve earned a new eco-badge! 🏆', 'success');
              break;
            case 'challenge_progress_updated':
              showNotification('Challenge Progress', 'You\'re making great progress on your challenge!', 'info');
              break;
            case 'challenge_joined':
              showNotification('Challenge Joined', 'Welcome to the challenge! Let\'s save the planet together.', 'info');
              break;
            case 'new_social_post':
              showNotification('Community Update', 'Someone in your network shared an achievement!', 'info');
              break;
          }
        } catch (error) {
          console.error('Error parsing notification:', error);
        }
      };

      socket.addEventListener('message', handleMessage);
      return () => socket.removeEventListener('message', handleMessage);
    }
  }, [socket]);

  // Demo notifications
  useEffect(() => {
    const demoNotifications = [
      { message: 'Welcome to GreenTrace AI! 🌱', type: 'success' as const, delay: 1000 },
      { message: 'Your daily carbon goal is 85% complete!', type: 'info' as const, delay: 4000 },
      { message: 'New challenge available: Zero Waste Week', type: 'warning' as const, delay: 7000 },
    ];

    demoNotifications.forEach(({ message, type, delay }) => {
      setTimeout(() => {
        showNotification(
          type === 'success' ? 'Welcome!' : 
          type === 'info' ? 'Progress Update' : 'New Challenge',
          message,
          type
        );
      }, delay);
    });
  }, []);

  const showNotification = (
    title: string, 
    message: string, 
    type: Notification['type'] = 'info',
    duration: number = 5000
  ) => {
    const notification: Notification = {
      id: Date.now().toString() + Math.random().toString(36).substr(2, 9),
      type,
      title,
      message,
      timestamp: new Date(),
      autoRemove: true,
      duration
    };

    setNotifications(prev => [notification, ...prev]);

    // Auto remove after duration
    if (notification.autoRemove) {
      setTimeout(() => {
        removeNotification(notification.id);
      }, duration);
    }
  };

  const removeNotification = (id: string) => {
    setNotifications(prev => prev.filter(n => n.id !== id));
  };

  const getNotificationIcon = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return <CheckCircle className="w-5 h-5 text-green-400" />;
      case 'error':
        return <AlertCircle className="w-5 h-5 text-red-400" />;
      case 'warning':
        return <AlertTriangle className="w-5 h-5 text-yellow-400" />;
      case 'info':
      default:
        return <Info className="w-5 h-5 text-blue-400" />;
    }
  };

  const getNotificationBorder = (type: Notification['type']) => {
    switch (type) {
      case 'success':
        return 'border-l-4 border-green-400';
      case 'error':
        return 'border-l-4 border-red-400';
      case 'warning':
        return 'border-l-4 border-yellow-400';
      case 'info':
      default:
        return 'border-l-4 border-blue-400';
    }
  };

  if (notifications.length === 0) {
    return null;
  }

  return (
    <div className="fixed top-20 right-6 z-50 space-y-4 max-w-sm">
      {notifications.map((notification) => (
        <Card
          key={notification.id}
          className={`glassmorphism rounded-xl transform transition-all duration-300 hover:scale-105 ${getNotificationBorder(notification.type)}`}
          style={{
            animation: 'slideInRight 0.3s ease-out'
          }}
        >
          <CardContent className="p-4">
            <div className="flex items-start space-x-3">
              {getNotificationIcon(notification.type)}
              <div className="flex-1 min-w-0">
                <div className="font-semibold text-sm">{notification.title}</div>
                <div className="text-sm text-muted-foreground mt-1">
                  {notification.message}
                </div>
                <div className="text-xs text-muted-foreground mt-2">
                  {notification.timestamp.toLocaleTimeString()}
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeNotification(notification.id)}
                className="h-6 w-6 p-0 text-muted-foreground hover:text-foreground"
              >
                <X className="w-4 h-4" />
              </Button>
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}

// Add animation keyframes to the global CSS
const style = document.createElement('style');
style.textContent = `
  @keyframes slideInRight {
    from {
      transform: translateX(100%);
      opacity: 0;
    }
    to {
      transform: translateX(0);
      opacity: 1;
    }
  }
`;
document.head.appendChild(style);
