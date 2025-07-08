import { apiRequest } from "./queryClient";

export interface ChatMessage {
  id: string;
  type: 'user' | 'ai';
  content: string;
  timestamp: Date;
}

export interface ChatResponse {
  message: string;
  sentiment: 'positive' | 'neutral' | 'negative';
  suggestions: string[];
  actionTaken?: string;
}

export interface ProductAnalysis {
  name: string;
  ecoScore: number;
  grade: string;
  carbonFootprint: number;
  recommendations: string[];
  sustainabilityFactors: {
    packaging: number;
    transport: number;
    production: number;
    endOfLife: number;
  };
  alternatives?: string[];
}

export class AIService {
  private static instance: AIService;
  private chatHistory: ChatMessage[] = [];

  static getInstance(): AIService {
    if (!AIService.instance) {
      AIService.instance = new AIService();
    }
    return AIService.instance;
  }

  async sendChatMessage(userId: number, message: string): Promise<ChatResponse> {
    try {
      const response = await apiRequest('POST', '/api/ai/chat', {
        userId,
        message
      });
      
      const result = await response.json();
      

      this.addToHistory(userId.toString(), 'user', message);
      this.addToHistory('ai', 'ai', result.message);
      
      return result;
    } catch (error) {
      console.error('Chat API error:', error);
      throw new Error('Failed to send chat message');
    }
  }

  async analyzeProduct(image?: string, productName?: string): Promise<ProductAnalysis> {
    try {
      const response = await apiRequest('POST', '/api/ai/analyze-product', {
        image,
        productName
      });
      
      return await response.json();
    } catch (error) {
      console.error('Product analysis API error:', error);
      throw new Error('Failed to analyze product');
    }
  }

  async processVoiceCommand(userId: number, command: string): Promise<ChatResponse> {
    try {
      const response = await apiRequest('POST', '/api/voice/process', {
        userId,
        command
      });
      
      return await response.json();
    } catch (error) {
      console.error('Voice command API error:', error);
      throw new Error('Failed to process voice command');
    }
  }

  async getChatHistory(userId: number): Promise<ChatMessage[]> {
    try {
      const response = await apiRequest('GET', `/api/users/${userId}/ai-history`);
      const history = await response.json();
      

      return history.map((item: any) => ([
        {
          id: `${item.id}-user`,
          type: 'user' as const,
          content: item.message,
          timestamp: new Date(item.timestamp)
        },
        {
          id: `${item.id}-ai`,
          type: 'ai' as const,
          content: item.response,
          timestamp: new Date(item.timestamp)
        }
      ])).flat();
    } catch (error) {
      console.error('Chat history API error:', error);
      return [];
    }
  }

  private addToHistory(userId: string, type: 'user' | 'ai', content: string) {
    const message: ChatMessage = {
      id: `${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      type,
      content,
      timestamp: new Date()
    };
    
    this.chatHistory.push(message);
    

    if (this.chatHistory.length > 50) {
      this.chatHistory = this.chatHistory.slice(-50);
    }
  }

  getLocalChatHistory(): ChatMessage[] {
    return [...this.chatHistory];
  }

  clearLocalChatHistory(): void {
    this.chatHistory = [];
  }


  calculateCarbonScore(activities: any[]): number {
    const totalImpact = activities.reduce((sum, activity) => {
      return sum + (activity.carbonImpact || 0);
    }, 0);
    

    return Math.min(10, Math.max(0, (totalImpact / 10) + 5));
  }

  generateSustainabilityTips(userStats: any): string[] {
    const tips = [];
    
    if (userStats.carbonSaved < 10) {
      tips.push("Try cycling or walking for short trips to increase your carbon savings");
    }
    
    if (userStats.streakDays < 7) {
      tips.push("Maintain daily eco-activities to build a strong sustainability streak");
    }
    
    if (userStats.ecoPoints < 1000) {
      tips.push("Join community challenges to earn more eco-points and meet like-minded people");
    }
    
    tips.push("Use the AR scanner to check the sustainability of products before purchasing");
    tips.push("Share your achievements on social media to inspire others");
    
    return tips.slice(0, 3);
  }

  formatCarbonImpact(impact: number): string {
    if (impact > 0) {
      return `Saved ${impact.toFixed(1)}kg CO₂`;
    } else if (impact < 0) {
      return `Emitted ${Math.abs(impact).toFixed(1)}kg CO₂`;
    } else {
      return 'Neutral impact';
    }
  }

  getActivityRecommendations(userLevel: number): string[] {
    const recommendations = [
      "Log your daily commute to track transportation impact",
      "Scan grocery receipts to analyze food choices",
      "Join a university challenge to compete with peers",
      "Use voice commands for quick activity logging",
      "Set weekly carbon reduction goals",
      "Share your progress on the social feed",
      "Trade carbon credits in the marketplace",
      "Explore AR challenges in your area"
    ];
    

    const startIndex = (userLevel - 1) * 2;
    return recommendations.slice(startIndex, startIndex + 3);
  }
}


export const aiService = AIService.getInstance();
