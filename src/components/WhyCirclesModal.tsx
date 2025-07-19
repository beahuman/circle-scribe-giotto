
import React, { useState } from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import WhyCirclesContent from './modal/WhyCirclesContent';

interface WhyCirclesModalProps {
  children: React.ReactNode;
  onStartCalibration?: () => void;
}

const WhyCirclesModal: React.FC<WhyCirclesModalProps> = ({ 
  children, 
  onStartCalibration 
}) => {
  const [isOpen, setIsOpen] = useState(false);

  const handleStartChallenge = () => {
    setIsOpen(false);
    onStartCalibration?.();
  };

  return (
    <Dialog open={isOpen} onOpenChange={setIsOpen}>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-4xl w-full max-h-[90vh] overflow-hidden p-0 border-none bg-gradient-to-br from-slate-50 via-white to-purple-50">
        <div className="relative h-full">
          {/* Close Button */}
          <Button
            onClick={() => setIsOpen(false)}
            variant="ghost"
            size="icon"
            className="absolute top-4 right-4 z-50 rounded-full bg-background/80 backdrop-blur-sm hover:bg-background/90 transition-all duration-200"
          >
            <X className="h-4 w-4" strokeWidth={1.5} />
          </Button>

          {/* Content */}
          <div className="p-6 h-full overflow-y-auto">
            <WhyCirclesContent onStartChallenge={handleStartChallenge} />
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default WhyCirclesModal;
