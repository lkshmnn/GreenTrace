import { useState, useEffect } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardContent } from "@/components/ui/card";
import { Smartphone, X, Download } from "lucide-react";
import { usePWA } from "@/hooks/usePWA";

export function PWAInstall() {
  const { canInstall, install, isInstalled } = usePWA();
  const [showPrompt, setShowPrompt] = useState(false);
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    // Show install prompt after 3 seconds if PWA can be installed
    if (canInstall && !isInstalled && !dismissed) {
      const timer = setTimeout(() => {
        setShowPrompt(true);
      }, 3000);
      return () => clearTimeout(timer);
    }
  }, [canInstall, isInstalled, dismissed]);

  const handleInstall = async () => {
    const success = await install();
    if (success) {
      setShowPrompt(false);
    }
  };

  const handleDismiss = () => {
    setShowPrompt(false);
    setDismissed(true);
    // Remember dismissal for this session
    sessionStorage.setItem('pwaPromptDismissed', 'true');
  };

  // Check if user already dismissed in this session
  useEffect(() => {
    const wasDismissed = sessionStorage.getItem('pwaPromptDismissed');
    if (wasDismissed) {
      setDismissed(true);
    }
  }, []);

  if (!canInstall || isInstalled || dismissed) {
    return null;
  }

  return (
    <div className={`fixed bottom-0 left-0 right-0 z-50 transform transition-transform duration-500 ${
      showPrompt ? 'translate-y-0' : 'translate-y-full'
    }`}>
      <Card className="glassmorphism m-4 rounded-2xl">
        <CardContent className="p-6">
          <div className="flex items-center justify-between">
            <div className="flex items-center space-x-4">
              <div className="eco-gradient w-12 h-12 rounded-xl flex items-center justify-center">
                <Smartphone className="w-6 h-6 text-white" />
              </div>
              <div>
                <div className="font-semibold">Install GreenTrace App</div>
                <div className="text-sm text-muted-foreground">
                  Get native app experience with offline support and push notifications
                </div>
              </div>
            </div>
            <div className="flex space-x-3">
              <Button
                variant="ghost"
                onClick={handleDismiss}
                className="px-4 py-2 glassmorphism-dark rounded-lg text-sm"
              >
                Maybe Later
              </Button>
              <Button
                onClick={handleInstall}
                className="magnetic-btn eco-gradient px-4 py-2 rounded-lg text-sm font-semibold"
              >
                <Download className="w-4 h-4 mr-2" />
                Install
              </Button>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
