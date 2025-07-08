import { useState, useEffect, useRef } from "react";
import { toast } from "@/hooks/use-toast";
import { Card, CardContent } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Mic, MicOff } from "lucide-react";
import { useVoiceCommands } from "@/hooks/useVoiceCommands";

function VoiceCommands() {
  // Draggable Voice Button state
  const [voicePosition, setVoicePosition] = useState<{ x: number; y: number }>(() => ({
    x: 24,
    y: typeof window !== 'undefined' ? window.innerHeight - 180 : 300
  }));
  const [isVoiceDragging, setIsVoiceDragging] = useState(false);
  const voiceDragOffset = useRef({ x: 0, y: 0 });

  const handleVoiceDragStart = (e: React.MouseEvent) => {
    setIsVoiceDragging(true);
    voiceDragOffset.current = {
      x: e.clientX - voicePosition.x,
      y: e.clientY - voicePosition.y,
    };
    document.body.style.userSelect = 'none';
  };

  const handleVoiceDrag = (e: React.MouseEvent) => {
    if (!isVoiceDragging) return;
    setVoicePosition({
      x: e.clientX - voiceDragOffset.current.x,
      y: e.clientY - voiceDragOffset.current.y,
    });
  };

  const handleVoiceDragEnd = () => {
    setIsVoiceDragging(false);
    document.body.style.userSelect = '';
  };

  const [showIndicator, setShowIndicator] = useState(false);
  const [autoListening, setAutoListening] = useState(false);
  const [hideHelp, setHideHelp] = useState(() => {
    return localStorage.getItem('hideVoiceHelp') === '1';
  });
  const {
    isListening,
    isSupported,
    transcript,
    startListening,
    stopListening,
    lastCommand,
    processCommand
  } = useVoiceCommands();

  useEffect(() => {
    setShowIndicator(isListening);
    if (isListening && autoListening) {
      // Auto-close after 3 seconds
      const timer = setTimeout(() => {
        stopListening();
        setAutoListening(false);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [isListening, autoListening, stopListening]);

  useEffect(() => {
    // Show global keyboard shortcut hint
    const handleKeyPress = (e: KeyboardEvent) => {
      if (e.ctrlKey && e.code === 'Space') {
        e.preventDefault();
        if (isListening) {
          stopListening();
        } else {
          startListening();
        }
      }
    };

    document.addEventListener('keydown', handleKeyPress);
    return () => document.removeEventListener('keydown', handleKeyPress);
  }, [isListening, startListening, stopListening]);

  if (!isSupported) {
    return null;
  }

  return (
    <>
      {/* Voice Command Indicator */}
      {showIndicator && (
        <div className="fixed top-1/2 left-1/2 transform -translate-x-1/2 -translate-y-1/2 z-50">
          <Card className="glassmorphism rounded-full p-8 text-center">
            <CardContent className="p-0">
              <div className="w-16 h-16 eco-gradient rounded-full mx-auto mb-4 flex items-center justify-center animate-pulse">
                <Mic className="w-8 h-8 text-white" />
              </div>
              <div className="font-semibold mb-2">Listening...</div>
              <div className="text-sm text-muted-foreground mb-2">
                {transcript || 'Say "GreenTrace" to wake up'}
              </div>
              {lastCommand && (
                <div className="text-xs text-primary mt-2">
                  Last: {lastCommand}
                </div>
              )}
              <Button
                variant="ghost"
                size="sm"
                onClick={stopListening}
                className="mt-4"
              >
                Stop Listening
              </Button>
            </CardContent>
          </Card>
        </div>
      )}

      {/* Draggable Voice Button */}
      <Button
        onClick={() => {
          if (isListening) {
            stopListening();
          } else {
            setAutoListening(true);
            startListening();
          }
        }}
        className={`fixed z-40 magnetic-btn w-14 h-14 rounded-full shadow-lg transition-all duration-300 ${
          isListening 
            ? 'bg-red-500 hover:bg-red-600 animate-pulse' 
            : 'eco-gradient'
        }`}
        style={{
          left: voicePosition.x,
          top: voicePosition.y,
          cursor: isVoiceDragging ? 'grabbing' : 'grab',
        }}
        onMouseDown={handleVoiceDragStart}
        onMouseMove={handleVoiceDrag}
        onMouseUp={handleVoiceDragEnd}
        onMouseLeave={handleVoiceDragEnd}
        title={`Voice Commands (Ctrl+Space) - ${isListening ? 'Stop' : 'Start'} listening`}
      >
        {isListening ? (
          <MicOff className="w-6 h-6 text-white" />
        ) : (
          <Mic className="w-6 h-6 text-white" />
        )}
      </Button>

      {/* Voice Commands Help */}
      {!isListening && !hideHelp && (
        <div className="fixed bottom-24 left-24 z-30">
          <Card className="glassmorphism p-4 w-64">
            <CardContent className="p-0">
              <h4 className="font-semibold mb-2">Voice Commands</h4>
              <div className="text-xs text-muted-foreground space-y-1">
                <div>• "Log cycling 5 kilometers"</div>
                <div>• "Show my carbon stats"</div>
                <div>• "Set weekly goal"</div>
                <div>• "What challenges are available"</div>
                <div>• "Take a photo" (opens scanner)</div>
              </div>
              <div className="mt-2 text-xs text-primary">
                Press Ctrl+Space to activate
              </div>
              <Button
                variant="ghost"
                size="sm"
                className="mt-3 text-xs text-gray-400 hover:text-primary"
                onClick={() => {
                  setHideHelp(true);
                  localStorage.setItem('hideVoiceHelp', '1');
                  toast({
                    title: 'Voice help hidden',
                    description: 'You can refresh the page to see it again.',
                  });
                }}
              >
                Don&apos;t show again
              </Button>
            </CardContent>
          </Card>
        </div>
      )}
    </>
  );
}

export default VoiceCommands;