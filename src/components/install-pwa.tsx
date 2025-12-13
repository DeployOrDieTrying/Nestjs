
'use client';

import { useState, useEffect } from 'react';
import { Button } from './ui/button';
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription } from './ui/sheet';

const InstallPWA = () => {
  const [installPrompt, setInstallPrompt] = useState<any>(null);
  const [isSheetOpen, setIsSheetOpen] = useState(false);

  useEffect(() => {
    const handler = (e: Event) => {
      e.preventDefault();
      setInstallPrompt(e);
      const hasDismissed = localStorage.getItem('pwa_install_dismissed');
      if (!hasDismissed) {
        setIsSheetOpen(true);
      }
    };

    window.addEventListener('beforeinstallprompt', handler);

    return () => {
      window.removeEventListener('beforeinstallprompt', handler);
    };
  }, []);

  const handleInstallClick = () => {
    if (installPrompt) {
      installPrompt.prompt();
      installPrompt.userChoice.then((choiceResult: { outcome: string }) => {
        if (choiceResult.outcome === 'accepted') {
          console.log('User accepted the A2HS prompt');
        } else {
          console.log('User dismissed the A2HS prompt');
        }
        setInstallPrompt(null);
        setIsSheetOpen(false);
      });
    }
  };

  const handleCloseClick = () => {
    localStorage.setItem('pwa_install_dismissed', 'true');
    setIsSheetOpen(false);
  };

  if (!installPrompt || !isSheetOpen) {
    return null;
  }

  return (
    <Sheet open={isSheetOpen} onOpenChange={setIsSheetOpen}>
      <SheetContent>
        <SheetHeader>
          <SheetTitle>Install FlowDash</SheetTitle>
          <SheetDescription>
            Install this application on your device for a better experience.
          </SheetDescription>
        </SheetHeader>
        <div className="flex flex-col gap-4 py-4">
          <Button onClick={handleInstallClick}>Install App</Button>
          <Button variant="outline" onClick={handleCloseClick}>
            Close
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
};

export default InstallPWA;
