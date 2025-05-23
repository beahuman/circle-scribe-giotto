
import React from 'react';
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Info } from "lucide-react";
import WhyCirclesContent from './modal/WhyCirclesContent';

interface WhyCirclesModalProps {
  children: React.ReactNode;
}

const WhyCirclesModal: React.FC<WhyCirclesModalProps> = ({ children }) => {
  return (
    <Dialog>
      <DialogTrigger asChild>
        {children}
      </DialogTrigger>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="flex items-center gap-2 text-xl">
            <Info className="h-5 w-5 text-primary" />
            Why Circles?
          </DialogTitle>
        </DialogHeader>

        <WhyCirclesContent />
      </DialogContent>
    </Dialog>
  );
};

export default WhyCirclesModal;
