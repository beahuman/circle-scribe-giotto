
import React from 'react';
import { Button } from "@/components/ui/button";
import { Crown, X } from "lucide-react";

interface PremiumBannerProps {
  onUpgrade: () => void;
  onDismiss: () => void;
}

const PremiumBanner: React.FC<PremiumBannerProps> = ({ onUpgrade, onDismiss }) => {
  return (
    <div className="bg-gradient-to-r from-primary/10 to-purple-400/10 border border-primary/20 rounded-xl p-4 mb-6 relative">
      <Button
        variant="ghost"
        size="icon-sm"
        className="absolute top-2 right-2"
        onClick={onDismiss}
      >
        <X className="h-4 w-4" />
      </Button>
      
      <div className="flex items-center gap-3 pr-10">
        <div className="flex items-center justify-center w-10 h-10 rounded-full bg-primary/20">
          <Crown className="h-5 w-5 text-primary" />
        </div>
        
        <div className="flex-1">
          <h3 className="font-semibold text-sm">Unlock Premium Features</h3>
          <p className="text-xs text-muted-foreground">
            Advanced analytics, extended history, and exclusive content
          </p>
        </div>
        
        <Button 
          onClick={onUpgrade}
          size="sm"
          className="flex-shrink-0"
        >
          Upgrade
        </Button>
      </div>
    </div>
  );
};

export default PremiumBanner;
