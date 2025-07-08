import { useState, useEffect, useCallback, useRef } from "react";
import { useMutation } from "@tanstack/react-query";
import { apiRequest } from "@/lib/queryClient";

interface VoiceCommandResult {
  action: string;
  response: string;
  data?: any;
}

export function useVoiceCommands() {
  const [isListening, setIsListening] = useState(false);
  const [isSupported, setIsSupported] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [lastCommand, setLastCommand] = useState('');
  // @ts-ignore
  const recognitionRef = useRef<any>(null);
  const timeoutRef = useRef<NodeJS.Timeout>();


  useEffect(() => {
    const SpeechRecognition = 
      window.SpeechRecognition || 
      (window as any).webkitSpeechRecognition;
    
    if (SpeechRecognition) {
      setIsSupported(true);
      
      const recognition = new SpeechRecognition();
      recognition.continuous = true;
      recognition.interimResults = true;
      recognition.lang = 'en-US';
      
      recognitionRef.current = recognition;
    }
  }, []);

  const processCommandMutation = useMutation({
    mutationFn: async (command: string): Promise<VoiceCommandResult> => {
      const response = await apiRequest('POST', '/api/voice/process', {
        userId: 1, // Demo user ID
        command
      });
      return response.json();
    },
    onSuccess: (result) => {
      // Show notification or take action based on result
      console.log('Voice command processed:', result);
      
      // You could trigger specific actions here based on result.action
      switch (result.action) {
        case 'log_activity':
          // Navigate to activity logging or trigger AR scanner
          break;
        case 'check_stats':
          // Scroll to dashboard or show stats modal
          break;
        case 'set_goal':
          // Open goal setting modal
          break;
        default:
          // Show general response
          break;
      }
    }
  });

  const startListening = useCallback(() => {
    if (!recognitionRef.current || isListening) return;

    setIsListening(true);
    setTranscript('');
    
    const recognition = recognitionRef.current;
    
    recognition.onstart = () => {
      console.log('Voice recognition started');
    };
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      let interimTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        const transcript = event.results[i][0].transcript;
        if (event.results[i].isFinal) {
          finalTranscript += transcript;
        } else {
          interimTranscript += transcript;
        }
      }
      
      setTranscript(finalTranscript || interimTranscript);
      
      if (finalTranscript) {
        setLastCommand(finalTranscript);
        processCommandMutation.mutate(finalTranscript);
        
        // Auto-stop after getting final result
        timeoutRef.current = setTimeout(() => {
          stopListening();
        }, 1000);
      }
    };
    
    recognition.onerror = (event: any) => {
      console.error('Speech recognition error:', event.error);
      setIsListening(false);
    };
    
    recognition.onend = () => {
      console.log('Voice recognition ended');
      setIsListening(false);
    };
    
    try {
      recognition.start();
    } catch (error) {
      console.error('Error starting speech recognition:', error);
      setIsListening(false);
    }
  }, [isListening, processCommandMutation]);

  const stopListening = useCallback(() => {
    if (recognitionRef.current && isListening) {
      recognitionRef.current.stop();
    }
    setIsListening(false);
    setTranscript('');
    
    if (timeoutRef.current) {
      clearTimeout(timeoutRef.current);
    }
  }, [isListening]);

  const processCommand = useCallback((command: string) => {
    setLastCommand(command);
    processCommandMutation.mutate(command);
  }, [processCommandMutation]);

  // Wake word detection
  useEffect(() => {
    if (!recognitionRef.current) return;

    const recognition = recognitionRef.current;
    
    recognition.onresult = (event: any) => {
      let finalTranscript = '';
      
      for (let i = event.resultIndex; i < event.results.length; i++) {
        if (event.results[i].isFinal) {
          finalTranscript += event.results[i][0].transcript.toLowerCase();
        }
      }
      
      // Check for wake word
      if (finalTranscript.includes('greentrace') || finalTranscript.includes('green trace')) {
        console.log('Wake word detected');
        if (!isListening) {
          startListening();
        }
      }
    };
  }, [isListening, startListening]);

  // Cleanup
  useEffect(() => {
    return () => {
      if (timeoutRef.current) {
        clearTimeout(timeoutRef.current);
      }
      if (recognitionRef.current && isListening) {
        recognitionRef.current.stop();
      }
    };
  }, [isListening]);

  return {
    isListening,
    isSupported,
    transcript,
    lastCommand,
    startListening,
    stopListening,
    processCommand,
    isProcessing: processCommandMutation.isPending
  };
}

// Extend Window interface for TypeScript
declare global {
  interface Window {
    SpeechRecognition: any;
    webkitSpeechRecognition: any;
  }
}
