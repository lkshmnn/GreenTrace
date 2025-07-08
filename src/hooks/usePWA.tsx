import { useState, useEffect } from "react";

interface BeforeInstallPromptEvent extends Event {
  prompt: () => Promise<void>;
  userChoice: Promise<{ outcome: 'accepted' | 'dismissed' }>;
}

export function usePWA() {
  const [deferredPrompt, setDeferredPrompt] = useState<BeforeInstallPromptEvent | null>(null);
  const [canInstall, setCanInstall] = useState(false);
  const [isInstalled, setIsInstalled] = useState(false);

  useEffect(() => {
    // Check if already installed
    const checkIfInstalled = () => {
      // Check if running in standalone mode (PWA)
      const isStandalone = window.matchMedia('(display-mode: standalone)').matches;
      const isInWebAppiOS = (window.navigator as any).standalone === true;
      const isAndroidPWA = document.referrer.includes('android-app://');
      
      setIsInstalled(isStandalone || isInWebAppiOS || isAndroidPWA);
    };

    checkIfInstalled();

    // Listen for beforeinstallprompt event
    const handleBeforeInstallPrompt = (e: Event) => {
      e.preventDefault();
      const installEvent = e as BeforeInstallPromptEvent;
      setDeferredPrompt(installEvent);
      setCanInstall(true);
    };

    // Listen for app installed event
    const handleAppInstalled = () => {
      console.log('PWA was installed');
      setIsInstalled(true);
      setCanInstall(false);
      setDeferredPrompt(null);
    };

    window.addEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
    window.addEventListener('appinstalled', handleAppInstalled);

    // Check for iOS Safari installation capability
    const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
    const isSafari = /Safari/.test(navigator.userAgent) && !/Chrome/.test(navigator.userAgent);
    
    if (isIOS && isSafari && !isInstalled) {
      setCanInstall(true);
    }

    return () => {
      window.removeEventListener('beforeinstallprompt', handleBeforeInstallPrompt);
      window.removeEventListener('appinstalled', handleAppInstalled);
    };
  }, [isInstalled]);

  const install = async (): Promise<boolean> => {
    if (!deferredPrompt) {
      // For iOS Safari, show instructions
      const isIOS = /iPad|iPhone|iPod/.test(navigator.userAgent);
      if (isIOS) {
        alert('To install this app on your device, tap the Share button and then "Add to Home Screen".');
        return false;
      }
      return false;
    }

    try {
      await deferredPrompt.prompt();
      const { outcome } = await deferredPrompt.userChoice;
      
      if (outcome === 'accepted') {
        console.log('User accepted the install prompt');
        setDeferredPrompt(null);
        setCanInstall(false);
        return true;
      } else {
        console.log('User dismissed the install prompt');
        return false;
      }
    } catch (error) {
      console.error('Error during PWA installation:', error);
      return false;
    }
  };

  const getInstallInstructions = () => {
    const userAgent = navigator.userAgent;
    
    if (/iPad|iPhone|iPod/.test(userAgent)) {
      return 'Tap the Share button and select "Add to Home Screen"';
    } else if (/Android/.test(userAgent)) {
      if (/Chrome/.test(userAgent)) {
        return 'Tap the menu (⋮) and select "Add to Home screen"';
      } else if (/Firefox/.test(userAgent)) {
        return 'Tap the menu (⋮) and select "Install"';
      }
    } else if (/Chrome/.test(userAgent)) {
      return 'Click the install button in the address bar';
    } else if (/Firefox/.test(userAgent)) {
      return 'Click the install button in the address bar';
    } else if (/Safari/.test(userAgent)) {
      return 'Click Share and then "Add to Dock"';
    }
    
    return 'Look for an install button in your browser';
  };

  return {
    canInstall: canInstall && !isInstalled,
    isInstalled,
    install,
    getInstallInstructions
  };
}
